import { docsPages, getDocsPageSlug } from '@libs/content'
import { getData, type SidebarItem, type SidebarSubItem } from '@libs/data'
import { getVersionedDocsPath } from '@libs/path'
import { getSlug } from '@libs/utils'

export interface LlmsPage {
  title: string
  description: string
  // The versioned docs path, e.g. `/docs/6.0/getting-started/install`.
  path: string
  // The raw MDX body of the page, if available.
  body: string
}

export interface LlmsSection {
  heading: string
  pages: LlmsPage[]
}

// Resolve a sidebar entry (by its group slug and title) to a docs collection
// entry, mirroring the slug logic in `DocsSidebar.astro`. Unlike the sidebar,
// this stays resilient and returns `undefined` when there is no match instead
// of throwing, so the generated `llms.txt` files never fail a build over a
// single stray sidebar entry.
function resolvePage(groupSlug: string, title: string | undefined): LlmsPage | undefined {
  if (!title) {
    return undefined
  }

  const unversionedPageSlug = `${groupSlug}/${getSlug(title)}`
  const entry = docsPages.find((page) => getDocsPageSlug(page.id) === unversionedPageSlug)

  if (!entry) {
    return undefined
  }

  return {
    title: entry.data.title,
    description: entry.data.description,
    path: getVersionedDocsPath(unversionedPageSlug),
    body: entry.body ?? ''
  }
}

// Build an ordered, grouped list of docs pages from `site/data/sidebar.yml`.
// Both `/llms.txt` and `/llms-full.txt` consume this so they stay in sync with
// the site navigation.
export function getLlmsSections(): LlmsSection[] {
  const sidebar = getData('sidebar')
  const sections: LlmsSection[] = []

  for (const group of sidebar) {
    if (!group.pages) {
      continue
    }

    const groupSlug = getSlug(group.title)
    const pages: LlmsPage[] = []

    for (const item of group.pages as SidebarItem[]) {
      // Nested sub-group (e.g. Utilities): flatten its pages under the parent
      // group heading.
      if (item.group && item.pages) {
        for (const subPage of item.pages as SidebarSubItem[]) {
          const resolved = resolvePage(groupSlug, subPage.title)

          if (resolved) {
            pages.push(resolved)
          }
        }

        continue
      }

      const resolved = resolvePage(groupSlug, item.title)

      if (resolved) {
        pages.push(resolved)
      }
    }

    if (pages.length > 0) {
      sections.push({ heading: group.title, pages })
    }
  }

  return sections
}
