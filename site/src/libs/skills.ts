import fs from 'node:fs'
import path from 'node:path'
import { load as yamlLoad } from 'js-yaml'

// The order the skills should appear in the docs. Any skill not listed here is
// appended alphabetically, so adding a new `skills/<name>/SKILL.md` shows up
// automatically without touching this file.
const skillOrder = [
  'bootstrap-v4-v6-migration',
  'bootstrap-v5-v6-migration',
  'bootstrap-v6-install',
  'bootstrap-npm',
  'bootstrap-webpack',
  'bootstrap-parcel',
  'bootstrap-vite',
  'bootstrap-component',
  'bootstrap-component-js',
  'bootstrap-color-system',
  'bootstrap-utility-api'
]

// The skills directory lives at the repository root, resolved relative to the
// current working directory (the repo root during dev and build), mirroring how
// `config.ts` reads `./config.yml` and `data.ts` reads `./site/data`.
const skillsDirectory = './skills'

export interface Skill {
  name: string
  description: string
  // A docs path (e.g. `/guides/npm`) linking to the matching human guide.
  guide?: string
}

// Extract and parse the YAML frontmatter block from a `SKILL.md` file.
function parseFrontmatter(content: string): Record<string, unknown> {
  const match = /^---\r?\n(?<frontmatter>[\s\S]*?)\r?\n---/.exec(content)

  if (!match?.groups?.frontmatter) {
    return {}
  }

  const data = yamlLoad(match.groups.frontmatter)

  return typeof data === 'object' && data !== null ? (data as Record<string, unknown>) : {}
}

// Read every `skills/<name>/SKILL.md` frontmatter and return an ordered list.
// Used to generate the skills table in the docs so it never drifts from the
// actual skill files.
export function getSkills(): Skill[] {
  const skills = fs
    .readdirSync(skillsDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry): Skill | undefined => {
      const skillPath = path.join(skillsDirectory, entry.name, 'SKILL.md')

      if (!fs.existsSync(skillPath)) {
        return undefined
      }

      const frontmatter = parseFrontmatter(fs.readFileSync(skillPath, 'utf8'))

      return {
        name: typeof frontmatter.name === 'string' ? frontmatter.name : entry.name,
        description: typeof frontmatter.description === 'string' ? frontmatter.description : '',
        guide: typeof frontmatter.guide === 'string' ? frontmatter.guide : undefined
      }
    })
    .filter((skill): skill is Skill => skill !== undefined)

  return skills.sort((a, b) => {
    const indexA = skillOrder.indexOf(a.name)
    const indexB = skillOrder.indexOf(b.name)

    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB
    }

    if (indexA !== -1) {
      return -1
    }

    if (indexB !== -1) {
      return 1
    }

    return a.name.localeCompare(b.name)
  })
}
