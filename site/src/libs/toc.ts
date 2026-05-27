import type { MarkdownHeading } from 'astro'
import { getConfig } from './config'

// Generate a tree like structure from a list of headings.
export function generateToc(allHeadings: MarkdownHeading[]) {
  const headings = allHeadings.filter(
    (heading) => heading.depth >= getConfig().toc.min && heading.depth <= getConfig().toc.max
  )

  const toc: TocEntry[] = []

  for (const heading of headings) {
    if (toc.length === 0) {
      toc.push({ ...heading, children: [] })
      continue
    }

    const previousEntry = toc[toc.length - 1]

    if (heading.depth === previousEntry.depth) {
      toc.push({ ...heading, children: [] })
      continue
    }

    const children = getEntryChildrenAtDepth(previousEntry, heading.depth - previousEntry.depth)
    children.push({ ...heading, children: [] })
  }

  return toc
}

function getEntryChildrenAtDepth(entry: TocEntry, depth: number): TocEntry['children'] {
  if (!entry) {
    return []
  }

  return depth === 1 ? entry.children : getEntryChildrenAtDepth(entry.children[entry.children.length - 1], depth - 1)
}

export interface TocEntry extends MarkdownHeading {
  children: TocEntry[]
}
