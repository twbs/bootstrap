import { z, defineCollection } from 'astro:content'

const docsSchema = z.object({
  added: z
    .object({
      show_badge: z.boolean().optional(),
      version: z.string()
    })
    .optional(),
  aliases: z.string().or(z.string().array()).optional(),
  csstricks: z
    .union([
      z.string(),
      z.object({
        url: z.string(),
        label: z.string().optional()
      })
    ])
    .optional(),
  description: z.string(),
  direction: z.literal('rtl').optional(),
  extra_js: z
    .object({
      async: z.boolean().optional(),
      src: z.string()
    })
    .array()
    .optional(),
  mdn: z.string().optional(),
  reference: z
    .object({
      class: z.string(),
      styles: z.union([z.string(), z.string().array(), z.record(z.string())])
    })
    .array()
    .optional(),
  sections: z
    .object({
      description: z.string(),
      title: z.string()
    })
    .array()
    .optional(),
  thumbnail: z.string().optional(),
  title: z.string(),
  toc: z.boolean().optional()
})

const docsCollection = defineCollection({
  schema: docsSchema
})

const calloutsSchema = z.object({})

const calloutsCollection = defineCollection({
  schema: calloutsSchema
})

export const collections = {
  docs: docsCollection,
  callouts: calloutsCollection
}
