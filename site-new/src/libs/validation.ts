import { z } from 'zod'

export const zVersionMajorMinor = z.string().regex(/^\d+\.\d+$/)

// https://ihateregex.io/expr/semver/
const semverRegex =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/

export const zVersionSemver = z.string().regex(semverRegex)

export const zHexColor = z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/)

export function zNamedHexColor<TName>(name: z.ZodLiteral<TName>) {
  return z.object({
    name,
    hex: zHexColor,
  })
}
