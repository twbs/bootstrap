import { z } from 'zod'

export const zVersionMajorMinor = z.string().regex(/^\d+\.\d+$/)

// https://ihateregex.io/expr/semver/
const unboundSemverRegex =
  /(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?/

export const zVersionSemver = z.string().regex(new RegExp(`^${unboundSemverRegex.source}$`))
export const zPrefixedVersionSemver = z.string().regex(new RegExp(`^v${unboundSemverRegex.source}$`))

export const zHexColor = z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/)

export const zNamedHexColors = (count: number) => {
  return z
    .object({
      name: z.union([z.string(), z.number()]),
      hex: zHexColor
    })
    .array()
    .length(count)
}

export const zPxSizeOrEmpty = z.string().regex(/^(?:\d+px)?$/)

export const zLanguageCode = z.string().regex(/^[a-z]{2}(?:-[a-zA-Z]{2})?$/)
