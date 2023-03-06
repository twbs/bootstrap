import { getCollection } from 'astro:content'

export const docsPages = await getCollection('docs')
