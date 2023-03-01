import fs from 'node:fs'
import yaml from 'js-yaml'
import { z } from 'zod'
import { zHexColor, zNamedHexColor } from './validation'
import { capitalizeFirstLetter } from './string'

// An object containing all the data types and their associated schema. The key should match the name of the data file
// in the `./site/data/` directory.
const dataDefinitions = {
  breakpoints: z.object({
      breakpoint: z.string(), // TODO: type?
      abbr: z.string(), // TODO: type?
      name: z.string(), // TODO: type?
      "min-width": z.string(), // TODO: type?
      container: z.string(), // TODO: type?
    })
    .array(),
  colors: z.object({
      name: z.string(),
      hex: zHexColor,
    })
    .array(),
  'core-team': z
    .object({
      name: z.string(),
      user: z.string(),
    })
    .array(),
  translations: z
    .object({
      name: z.string(),
      code: z.string(), // TODO: could maybe be a type
      description: z.string(),
      url: z.string().url(),
    })
    .array(),
  grays: z
    .tuple([
      zNamedHexColor(z.literal(100)),
      zNamedHexColor(z.literal(200)),
      zNamedHexColor(z.literal(300)),
      zNamedHexColor(z.literal(400)),
      zNamedHexColor(z.literal(500)),
      zNamedHexColor(z.literal(600)),
      zNamedHexColor(z.literal(700)),
      zNamedHexColor(z.literal(800)),
      zNamedHexColor(z.literal(900)),
    ])
    // TODO: transform() is commented because of the usage in customize/color.md which loops over it
    /*.transform((val) => {
      // Map array entries to an object with the name as key and the hex color as value for easier lookup.
      const grays = {} as Record<(typeof val)[number]['name'], string>

      for (const { name, hex } of val) {
        grays[name] = hex
      }

      return grays
    })*/,
  plugins: z
    .object({
      description: z.string(),
      link: z.string().startsWith('components/'),
      name: z.string(),
    })
    .array(),
  sidebar: z
    .object({
      title: z.string(),
      icon: z.string().optional(),
      icon_color: z.string().optional(),
      pages: z
        .object({
          title: z.string(),
        })
        .array()
        .optional(),
    })
    .array(),
  'theme-colors': z
    .object({
      name: z.string(),
      hex: zHexColor,
      contrast_color: z.string().optional()
    })
    .array()
    .transform((val) => {
      // Add a `title` property to each theme color object being the capitalized version of the `name` property.
      return val.map((themeColor) => ({ ...themeColor, title: capitalizeFirstLetter(themeColor.name) }))
    }),
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
