import { getCollection } from 'astro:content'

export const docsPages = await getCollection('docs')
export const callouts = await getCollection('callouts')
export const details = await getCollection('details')

export const aliasedDocsPages = await getCollection('docs', ({ data }) => {
  return data.aliases !== undefined
})

function matchesEntryId(id: string, name: string) {
  return id === name || id.replace(/\.(md|mdx)$/, '') === name
}

function getEntryByPossibleIds(collection: typeof callouts | typeof details, name: string) {
  return collection.find((entry) => matchesEntryId(entry.id, name))
}

export function getCalloutByName(name: string) {
  return getEntryByPossibleIds(callouts, name)
}

export function getDetailsByName(name: string) {
  return getEntryByPossibleIds(details, name)
}

export function getDocsPageSlug(id: string) {
  return id.replace(/\.(md|mdx)$/, '')
}
