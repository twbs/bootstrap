import fs from 'node:fs'
import yaml from 'js-yaml'
import { z } from 'zod'

let config: Config | undefined

// A helper to get the config loaded fom the `config.yml` file. If the config does not match the `configSchema` below,
// an error is thrown to indicate that the config file is invalid and some action is required.
export function getConfig(): Config {
  if (config) {
    // Returns the config if it has already been loaded.
    return config
  }

  try {
    // Load the config from the `config.yml` file.
    const rawConfig = yaml.load(fs.readFileSync('./config.yml', 'utf8'))

    // Parse the config using the config schema to validate its content and get back a fully typed config object.
    config = configSchema.parse(rawConfig)

    return config
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('The `config.yml` file content is invalid:', error.issues)
    }

    throw new Error('Failed to load configuration from `config.yml`', { cause: error })
  }
}

export function getVersionedDocsPath(path: string): string {
  const { docs_version } = getConfig().params

  return `/docs/${docs_version}/${path.replace(/^\//, '')}`
}

// The config schema used to validate the config file content and ensure all values required by the site are valid.
const configSchema = z.object({
  params: z.object({
    authors: z.string(),
    blog: z.string().url(),
    description: z.string(),
    docs_version: z.string().regex(/^\d+\.\d+$/),
    github_org: z.string().url(),
    icons: z.string().url(),
    opencollective: z.string().url(),
    subtitle: z.string(),
    themes: z.string().url(),
    twitter: z.string(),
  }),
  title: z.string(),
})

type Config = z.infer<typeof configSchema>
