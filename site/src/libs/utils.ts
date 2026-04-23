import { slug } from 'github-slugger'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import type { Node, Parent } from 'unist'

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function getSequence(start: number, end: number, step = 1) {
  const sequence = []

  for (let i = start; i <= end; i += step) {
    sequence.push(i)
  }

  return sequence
}

// This function is used in the docs sidebar to generate partial slugs and properly order the sidebar entries and also
// to generate docs frontmatter sections slugs.
// Note: this should be refactored and removed, the sidebar ordering defined in `site/data/sidebar.yml` should not rely
// on slugified custom titles that are expected to generate a string matching the actual file names on disk, this is
// error prone. Instead, custom sidebar titles should be defined in the frontmatter of the MDX files when needed and
// `site/data/sidebar.yml` should only reference the actual file names and slug extracted from the docs content
// collection. Same goes for the docs frontmatter sections.
export function getSlug(str: string) {
  return slug(str).replace(/--+/g, '-')
}

export function trimLeadingAndTrailingSlashes(str: string) {
  return str.replace(/^\/+|\/+$/g, '')
}

// Single shared `remark` pipeline for every markdown helper below — keeps the
// dependency list to just `remark` + `remark-html` (no transitively-resolved
// `mdast-util-*` imports) and avoids paying parser setup cost per call.
const markdownParser = remark()
const htmlProcessor = remark().use(remarkHtml)

function nodeToText(node: Node): string {
  if ('value' in node && typeof node.value === 'string') {
    return node.value
  }

  if ('children' in node) {
    return (node as Parent).children.map((child) => nodeToText(child)).join('')
  }

  return ''
}

export function stripMarkdown(str: string) {
  return nodeToText(markdownParser.parse(str))
}

export function processMarkdownToHtml(markdown: string): string {
  return htmlProcessor.processSync(markdown).toString()
}
