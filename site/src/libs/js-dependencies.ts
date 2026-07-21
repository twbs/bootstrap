import fs from 'node:fs'
import path from 'node:path'

// Resolves the JavaScript source files and third-party packages a component needs when built from source, by walking
// the actual `import` graph starting from `js/src/<component>.ts`. This keeps the docs "Dependencies" tables in sync
// with the code automatically: change a component's imports and the table regenerates on the next build.
//
// The only manually-maintained data is the human-readable descriptions below. Add an entry when a new source file or
// third-party package enters the dependency graph (the build throws with the missing key if you forget).

// Root of the JavaScript source, relative to the repository root (the build's working directory).
const JS_SRC = 'js/src'

// Descriptions for internal source files, keyed by their path relative to `js/src` without the extension.
const FILE_DESCRIPTIONS: Record<string, string> = {
  'base-component': 'Base component class',
  'dialog-base': 'Base dialog component',
  menu: 'Menu component',
  tooltip: 'Tooltip component',
  'dom/data': 'Element data store',
  'dom/event-handler': 'Event handling utilities',
  'dom/manipulator': 'Data attribute manipulation',
  'dom/selector-engine': 'DOM selector utilities',
  'util/component-functions': 'Shared component helpers',
  'util/config': 'Configuration base class',
  'util/floating-ui': 'Responsive placement utilities',
  'util/index': 'Core utility functions',
  'util/sanitizer': 'HTML content sanitizer',
  'util/swipe': 'Swipe gesture utilities',
  'util/template-factory': 'Template rendering utilities'
}

// Descriptions for third-party packages that may appear in the graph.
const PACKAGE_DESCRIPTIONS: Record<string, string> = {
  '@floating-ui/dom': 'Third-party positioning library',
  'vanilla-calendar-pro': 'Third-party calendar library'
}

export interface JsDependency {
  /** Display label for the "File" column, e.g. `js/src/tooltip.ts` or `@floating-ui/dom`. */
  file: string
  /** Human-readable description for the "Description" column. */
  description: string
}

// Extracts the module specifiers of every `import` that pulls in at least one runtime (non-type-only) binding.
function parseRuntimeImports(content: string): string[] {
  const specifiers: string[] = []
  // Matches top-level (column 0) import statements, including multi-line ones, up to their `from '…'` clause.
  const importRegex = /^import\s+(type\s+)?([\s\S]*?)\s+from\s+['"]([^'"]+)['"]/gm

  let match: RegExpExecArray | null
  while ((match = importRegex.exec(content)) !== null) {
    const [, typeKeyword, clause, specifier] = match

    // `import type … from …` is fully type-only and erased at build time.
    if (typeKeyword) {
      continue
    }

    if (hasRuntimeBinding(clause)) {
      specifiers.push(specifier)
    }
  }

  return specifiers
}

// Determines whether an import clause (the part between `import` and `from`) binds any runtime value, as opposed to
// being made up entirely of inline `type` specifiers that are erased at build time.
function hasRuntimeBinding(clause: string): boolean {
  const trimmed = clause.trim()
  const braceStart = trimmed.indexOf('{')

  const defaultPart = (braceStart === -1 ? trimmed : trimmed.slice(0, braceStart)).replace(/,/g, '').trim()

  // A default import or namespace import (`* as X`) is always a runtime binding.
  if (defaultPart.length > 0) {
    return true
  }

  if (braceStart === -1) {
    return false
  }

  const namedPart = trimmed.slice(braceStart + 1, trimmed.lastIndexOf('}'))

  return namedPart
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean)
    .some((name) => !name.startsWith('type '))
}

// Walks the import graph from the given component, collecting every reachable internal file and third-party package.
export function getJsDependencies(component: string): JsDependency[] {
  const visitedFiles = new Set<string>()
  const packages = new Set<string>()

  function visit(key: string) {
    if (visitedFiles.has(key)) {
      return
    }

    visitedFiles.add(key)

    const filePath = path.join(JS_SRC, `${key}.ts`)

    let content: string
    try {
      content = fs.readFileSync(filePath, 'utf8')
    } catch (error) {
      throw new Error(
        `Failed to read JavaScript source '${filePath}' while resolving dependencies for '${component}'.`,
        {
          cause: error
        }
      )
    }

    for (const specifier of parseRuntimeImports(content)) {
      if (specifier.startsWith('.')) {
        const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(key), specifier)).replace(/\.js$/, '')
        visit(resolved)
      } else {
        packages.add(specifier)
      }
    }
  }

  visit(component)
  // The component's own file is listed first and handled separately from its dependencies.
  visitedFiles.delete(component)

  const describe = (key: string): string => {
    const description = FILE_DESCRIPTIONS[key]
    if (!description) {
      throw new Error(
        `Missing description for JavaScript source 'js/src/${key}.ts'. Add it to FILE_DESCRIPTIONS in site/src/libs/js-dependencies.ts.`
      )
    }

    return description
  }

  // Group files so the table reads predictably: root-level modules, then `dom/`, then `util/`.
  const rank = (key: string): number => (key.startsWith('dom/') ? 1 : key.startsWith('util/') ? 2 : 0)

  const files: JsDependency[] = [...visitedFiles]
    .sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))
    .map((key) => ({ file: `js/src/${key}.ts`, description: describe(key) }))

  const thirdParty: JsDependency[] = [...packages]
    .sort((a, b) => a.localeCompare(b))
    .map((name) => {
      const description = PACKAGE_DESCRIPTIONS[name]
      if (!description) {
        throw new Error(
          `Missing description for third-party package '${name}'. Add it to PACKAGE_DESCRIPTIONS in site/src/libs/js-dependencies.ts.`
        )
      }

      return { file: name, description }
    })

  return [{ file: `js/src/${component}.ts`, description: `Main ${component} component` }, ...files, ...thirdParty]
}
