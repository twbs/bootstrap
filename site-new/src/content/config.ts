import { z, defineCollection } from 'astro:content'

const docsSchema = z.object({
  added: z.string().optional(),
  // TODO(HiDeoo) aliases
  description: z.string(),
  direction: z.literal('rtl').optional(),
  // TODO(HiDeoo) group
  extra_js: z
    .object({
      async: z.boolean().optional(),
      src: z.string(),
    })
    .array()
    .optional(),
  sections: z
    .object({
      description: z.string(),
      title: z.string(),
    })
    .array()
    .optional(),
  thumbnail: z.string().optional(),
  title: z.string(),
  toc: z.boolean().optional(),
})

const docsCollection = defineCollection({
  schema: docsSchema,
})

export const collections = {
  docs: docsCollection,
}
