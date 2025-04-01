import fs from 'node:fs'
import yaml from 'js-yaml'
import { z } from 'zod'
import {
  zHexColor,
  zLanguageCode,
  zNamedHexColors,
  zPxSizeOrEmpty,
  zVersionMajorMinor,
  zVersionSemver
} from './validation'
import { capitalizeFirstLetter } from './utils'

// An object containing all the data types and their associated schema. The key should match the name of the data file
// in the `./site/data/` directory.
const dataDefinitions = {
  breakpoints: z
    .object({
      breakpoint: z.string(),
      abbr: z.string(),
      name: z.string(),
      'min-width': zPxSizeOrEmpty,
      container: zPxSizeOrEmpty
    })
    .array(),
  colors: zNamedHexColors(13),
  'core-team': z
    .object({
      name: z.string(),
      user: z.string()
    })
    .array(),
  'docs-versions': z
    .object({
      group: z.string(),
      baseurl: z.string().url(),
      description: z.string(),
      versions: z.union([zVersionSemver, zVersionMajorMinor]).array()
    })
    .array(),
  examples: z
    .object({
      category: z.string(),
      external: z.boolean().optional(),
      description: z.string(),
      examples: z
        .object({
          description: z.string(),
          indexPath: z.string().optional(),
          name: z.string(),
          url: z.string().optional()
        })
        .array()
    })
    .array(),
  grays: zNamedHexColors(9),
  icons: z.object({
    preferred: z
      .object({
        name: z.string(),
        website: z.string().url()
      })
      .array(),
    more: z
      .object({
        name: z.string(),
        website: z.string().url()
      })
      .array()
  }),
  plugins: z
    .object({
      description: z.string(),
      link: z.string().startsWith('components/'),
      name: z.string()
    })
    .array(),
  sidebar: z
    .object({
      title: z.string(),
      icon: z.string().optional(),
      icon_color: z.string().optional(),
      pages: z
        .object({
          title: z.string()
        })
        .array()
        .optional()
    })
    .array(),
  'theme-colors': z
    .object({
      name: z.string(),
      hex: zHexColor,
      contrast_color: z.union([z.literal('dark'), z.literal('white')]).optional()
    })
    .array()
    .transform((val) => {
      // Add a `title` property to each theme color object being the capitalized version of the `name` property.
      return val.map((themeColor) => ({ ...themeColor, title: capitalizeFirstLetter(themeColor.name) }))
    }),
  translations: z
    .object({
      name: z.string(),
      code: zLanguageCode,
      description: z.string(),
      url: z.string().url()
    })
    .array()
} satisfies Record<string, DataSchema>

let data = new Map<DataType, z.infer<DataSchema>>()

// A helper to get data loaded fom a yml file in the `./site/data/` directory. If the data does not match its associated
// schema from `dataDefinitions`, an error is thrown to indicate that the data file is invalid and some action is
// required.
export function getData<TType extends DataType>(type: TType): z.infer<(typeof dataDefinitions)[TType]> {
  if (data.has(type)) {
    // Returns the data if it has already been loaded.
    return data.get(type)
  }

  const dataPath = `./site/data/${type}.yml`

  try {
    // Load the data from the yml  file.
    const rawData = yaml.load(fs.readFileSync(dataPath, 'utf8'))

    // Parse the data using the data schema to validate its content and get back a fully typed data object.
    const parsedData = dataDefinitions[type].parse(rawData)

    // Cache the data.
    data.set(type, parsedData)

    return parsedData
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(`The \`${dataPath}\` file content is invalid:`, error.issues)
    }

    throw new Error(`Failed to load data from \`${dataPath}\``, { cause: error })
  }
}

type DataType = keyof typeof dataDefinitions
type DataSchema = z.ZodTypeAny
