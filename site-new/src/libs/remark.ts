import type { Root } from 'mdast'
import type { MdxJsxAttribute, MdxJsxExpressionAttribute } from 'mdast-util-mdx-jsx'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import { getConfig, getVersionedDocsPath } from './config'

// [[param:foo]]
// [[param:foo.bar]]
const paramRegExp = /\[\[param:(?<name>[\w\.]+)]]/g
// [[docsref:/foo]]
// [[docsref:/foo/bar#baz]]
const docsrefRegExp = /\[\[docsref:(?<path>[\w\.\/#-]+)]]/g

// A remark plugin to replace config parameters embedded in markdown (or MDX) files.
// For example, [[param:foo]] will be replaced with the value of the `foo` parameter in the `config.yml` file.
// Nested parameters are also supported, e.g. [[param:foo.bar]].
// Note: this plugin is meant to facilitate the migration from Hugo to Astro while keeping the differences to a minimum.
// At some point, this plugin should maybe be removed and embrace a more MDX-friendly syntax.
export const remarkBsParam: Plugin<[], Root> = function () {
  return function remarkBsParamPlugin(ast) {
    // https://github.com/syntax-tree/mdast#nodes
    // https://github.com/syntax-tree/mdast-util-mdx-jsx#nodes
    visit(ast, ['code', 'definition', 'image', 'inlineCode', 'link', 'mdxJsxFlowElement', 'text'], (node) => {
      switch (node.type) {
        case 'code':
        case 'inlineCode':
        case 'text': {
          node.value = replaceParamInText(node.value)
          break
        }
        case 'image': {
          if (node.alt) {
            node.alt = replaceParamInText(node.alt)
          }

          node.url = replaceParamInText(node.url)
          break
        }
        case 'definition':
        case 'link': {
          node.url = replaceParamInText(node.url)
          break
        }
        case 'mdxJsxFlowElement': {
          node.attributes = replaceParamInAttributes(node.attributes)
          break
        }
      }
    })
  }
}

// A remark plugin to add versionned docs links in markdown (or MDX) files.
// For example, [[docsref:/foo]] will be replaced with the `/docs/${docs_version}/foo` value with the `docs_version`
// parameter being read from the `config.yml` file.
// Note: this plugin is meant to facilitate the migration from Hugo to Astro while keeping the differences to a minimum.
// At some point, this plugin should maybe be removed and embrace a more MDX-friendly syntax.
export const remarkBsDocsref: Plugin<[], Root> = function () {
  return function remarkBsParamPlugin(ast) {
    // https://github.com/syntax-tree/mdast#nodes
    // https://github.com/syntax-tree/mdast-util-mdx-jsx#nodes
    visit(ast, ['definition', 'link', 'mdxJsxTextElement'], (node) => {
      switch (node.type) {
        case 'definition':
        case 'link': {
          node.url = replaceDocsrefInText(node.url)
          break
        }
        case 'mdxJsxTextElement': {
          node.attributes = replaceDocsrefInAttributes(node.attributes)
          break
        }
      }
    })
  }
}

function replaceParamInText(text: string) {
  return text.replace(paramRegExp, (_match, path) => {
    const param = getParamAtPath(path)

    if (!param) {
      throw new Error(`Failed to find a valid parameter for '${path}'.`)
    }

    return param
  })
}

function replaceParamInAttributes(attributes: (MdxJsxAttribute | MdxJsxExpressionAttribute)[]) {
  return attributes.map((attribute) => {
    if (attribute.type === 'mdxJsxAttribute' && typeof attribute.value === 'string') {
      attribute.value = replaceParamInText(attribute.value)
    }

    return attribute
  })
}

function replaceDocsrefInText(text: string) {
  return text.replace(docsrefRegExp, (_match, path) => {
    return getVersionedDocsPath(path)
  })
}

function replaceDocsrefInAttributes(attributes: (MdxJsxAttribute | MdxJsxExpressionAttribute)[]) {
  return attributes.map((attribute) => {
    if (attribute.type === 'mdxJsxAttribute' && typeof attribute.value === 'string') {
      attribute.value = replaceDocsrefInText(attribute.value)
    }

    return attribute
  })
}

function getParamAtPath(path: string) {
  const params = getConfig().params

  const value = path.split('.').reduce((values, part) => {
    if (!values || typeof values !== 'object') {
      return undefined
    }

    return (values as any)?.[part]
  }, params as unknown)

  return typeof value === 'string' ? value : undefined
}
