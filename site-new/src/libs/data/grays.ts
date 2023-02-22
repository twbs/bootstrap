import fs from 'node:fs'
import yaml from 'js-yaml'
import { z } from 'zod'

let grays: Grays | undefined

// A helper to get the config loaded fom the `config.yml` file. If the config does not match the `configSchema` below,
// an error is thrown to indicate that the config file is invalid and some action is required.
export function getGrays(): Grays {
  if (grays) {
    // Returns the config if it has already been loaded.
    return grays
  }

  try {
    // Load the config from the `config.yml` file.
    const rawConfig = yaml.load(fs.readFileSync('./site/data/grays.yml', 'utf8'))

    // Parse the config using the config schema to validate its content and get back a fully typed config object.
    grays = configSchema.parse(rawConfig)

    console.log(grays)

    return grays
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('The `site/data/grays.yml` file content is invalid:', error.issues)
    }

    throw new Error('Failed to load grays from `site/data/grays.yml`', { cause: error })
  }
}

// The config schema used to validate the grays config file content and ensure all values required by the site are valid.
const configSchema = z.object({
  name: z.number(),
  hex: z.string()
}).array()

type Grays = z.infer<typeof configSchema>
