import { z, defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'

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
      description: z.string().optional(),
      styles: z.union([z.string(), z.string().array(), z.record(z.string(), z.string())]).optional()
    })
    .array()
    .optional(),
  utility: z.union([z.string(), z.string().array()]).optional(),
  classes: z
    .object({
      class: z.string(),
      description: z.string()
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
  loader: glob({
    base: './src/content/docs',
    pattern: '**/*.{md,mdx}'
  }),
  schema: docsSchema
})

const calloutsSchema = z.object({})

const calloutsCollection = defineCollection({
  loader: glob({
    base: './src/content/callouts',
    pattern: '**/*.{md,mdx}'
  }),
  schema: calloutsSchema
})

const detailsSchema = z.object({
  title: z.string().optional()
})

const detailsCollection = defineCollection({
  loader: glob({
    base: './src/content/details',
    pattern: '**/*.{md,mdx}'
  }),
  schema: detailsSchema
})

export const collections = {
  docs: docsCollection,
  callouts: calloutsCollection,
  details: detailsCollection
}
