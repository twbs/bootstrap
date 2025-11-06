import { getCollection, getEntry, getEntryBySlug } from 'astro:content'

export const docsPages = await getCollection('docs')
export const callouts = await getCollection('callouts')
export const details = await getCollection('details')

export const aliasedDocsPages = await getCollection('docs', ({ data }) => {
  return data.aliases !== undefined
})

export function getCalloutByName(name: string) {
  return getEntryBySlug('callouts', name)
}

export function getDetailsByName(name: string) {
  return getEntry('details', name)
}
