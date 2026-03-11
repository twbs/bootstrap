import { codeToHtml, type ShikiTransformer } from 'shiki'
import bootstrapLight from 'bootstrap-vscode-theme/themes/bootstrap-light.json'
import bootstrapDark from 'bootstrap-vscode-theme/themes/bootstrap-dark.json'

const classTransformer: ShikiTransformer = {
  name: 'class-name-transformer',
  pre(node) {
    const existingClasses = (node.properties?.className as string[]) || []
    node.properties.className = existingClasses.map((cls) => {
      if (typeof cls === 'string') {
        return cls.replace(/shiki/g, 'astro-code')
      }
      return cls
    })
  }
}

const lineWrapperTransformer: ShikiTransformer = {
  name: 'line-wrapper',
  line(node) {
    const hasOnlyComments = node.children.every((child) =>
      child.type === 'element' &&
      child.properties?.class &&
      Array.isArray(child.properties.class) &&
      child.properties.class.some((cls) => typeof cls === 'string' && cls.includes('comment'))
    )

    if (!hasOnlyComments) {
      node.properties = node.properties || {}
      node.properties.class = node.properties.class
        ? `${node.properties.class} line`
        : 'line'
    }
  }
}

function replaceShikiClasses(html: string): string {
  return html
    .replace(/class=(["'])shiki(\s+)/g, 'class=$1astro-code$2')
    .replace(/class=(["'])shiki(["'])/g, 'class=$1astro-code$2')
    .replace(/shiki-themes/g, 'astro-code-themes')
}

export async function highlightCode(
  code: string,
  lang: string,
  extraTransformers: ShikiTransformer[] = []
): Promise<string> {
  const shouldWrapLines = ['bash', 'sh', 'powershell'].includes(lang)

  const transformers: ShikiTransformer[] = [...extraTransformers, classTransformer]
  if (shouldWrapLines) {
    transformers.push(lineWrapperTransformer)
  }

  const highlighted = await codeToHtml(code, {
    lang,
    themes: {
      light: bootstrapLight as any,
      dark: bootstrapDark as any
    },
    transformers
  })

  return replaceShikiClasses(highlighted)
}
