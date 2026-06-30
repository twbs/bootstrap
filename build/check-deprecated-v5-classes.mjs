/* eslint-disable unicorn/no-process-exit */
/* eslint-disable @stylistic/max-statements-per-line */
/* eslint-disable unicorn/import-style */
/**
 * Bootstrap v5 → v6 Deprecated Classes Finder
 *
 * 1. Compiles CSS via `npm run css`
 * 2. Extracts unique classes from dist/css/bootstrap.css  (v6)
 * 3. Fetches unique classes from Bootstrap main branch     (v5)
 * 4. Computes classes present only in v5 (deprecated)
 * 5. Searches the codebase for those deprecated classes
 * 6. Writes a log file with findings
 */

import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join, resolve, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = resolve(__dirname, '..')
const onlyUsed = process.argv.includes('--only-used')

// ─── Step 1: Compile CSS ──────────────────────────────────────────────────────

console.log('▶ Compiling CSS with `npm run css`…')
execSync('npm run css', { cwd: ROOT, stdio: 'inherit' })
console.log('✔ CSS compiled\n')

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Extract all unique CSS class names from a stylesheet string.
 * Matches tokens of the form `.classname` in selectors.
 */
function extractClasses(css) {
  // Strip block comments to avoid false matches in commented-out selectors
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, '')
  const classes = new Set()
  // Match .classname – CSS ident chars: a-z A-Z 0-9 _ - (and leading -)
  const re = /\.(-?[a-zA-Z_][a-zA-Z0-9_-]*)/g
  let m
  while ((m = re.exec(stripped)) !== null) {
    classes.add(m[1])
  }

  return classes
}

// ─── Step 2: v6 classes ───────────────────────────────────────────────────────

console.log('▶ Extracting v6 classes from dist/css/bootstrap.css…')
const v6CssPath = join(ROOT, 'dist/css/bootstrap.css')
const v6Css = readFileSync(v6CssPath, 'utf8')
const v6Classes = extractClasses(v6Css)
console.log(`  → ${v6Classes.size} unique classes\n`)

// ─── Step 3: v5 classes from GitHub ──────────────────────────────────────────

const V5_URL =
  'https://raw.githubusercontent.com/twbs/bootstrap/refs/heads/main/dist/css/bootstrap.css'

console.log(`▶ Fetching v5 CSS from ${V5_URL}…`)
const v5Response = await fetch(V5_URL)
if (!v5Response.ok) {
  throw new Error(`Failed to fetch v5 CSS: ${v5Response.status} ${v5Response.statusText}`)
}

const v5Css = await v5Response.text()
const v5Classes = extractClasses(v5Css)
console.log(`  → ${v5Classes.size} unique classes\n`)

// ─── Step 4: Deprecated classes (v5-only) ────────────────────────────────────

const deprecatedClasses = [...v5Classes]
  .filter(c => !v6Classes.has(c))
  .sort()

console.log(`▶ Classes only in v5 (deprecated in v6): ${deprecatedClasses.length}\n`)

// ─── Step 5: Search the codebase ─────────────────────────────────────────────

const SEARCH_EXTENSIONS = new Set([
  '.html',
  '.astro',
  '.mdx',
  '.md',
  '.js',
  '.mjs',
  '.cjs',
  '.ts',
  '.tsx',
  '.jsx',
  '.vue',
  '.njk',
  '.hbs',
  '.liquid'
])

// Directories to skip entirely
const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  '_site', // built docs output
  'dist', // built Bootstrap assets
  '.cache',
  'coverage',
  'skills'
])

// Files to skip (relative to ROOT, using forward slashes)
const SKIP_FILES = new Set([
  'site/src/content/docs/guides/migration.mdx',
  'AGENTS.md'
])

function * walkDir(dir) {
  let entries
  try {
    entries = readdirSync(dir, { withFileTypes: true })
  } catch {
    return
  }

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) {yield * walkDir(fullPath)}
    } else if (entry.isFile()) {
      const dot = entry.name.lastIndexOf('.')
      if (dot !== -1 && SEARCH_EXTENSIONS.has(entry.name.slice(dot))) {
        const relPath = relative(ROOT, fullPath).replaceAll('\\', '/')
        if (!SKIP_FILES.has(relPath)) {yield fullPath}
      }
    }
  }
}

console.log('▶ Scanning codebase for deprecated classes…')

// Build a regex that matches any deprecated class as a standalone token.
// Characters that cannot be part of a CSS class name: anything except [a-zA-Z0-9_-]
// We use a single multi-alternative regex per file for efficiency.
const escapedClasses = deprecatedClasses.map(c =>
  c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
)

// findings: Map<className, Array<{file, lineNumber, lineText}>>
const findings = new Map()

let fileCount = 0
for (const filePath of walkDir(ROOT)) {
  fileCount++
  const relPath = relative(ROOT, filePath)
  let content
  try {
    content = readFileSync(filePath, 'utf8')
  } catch {
    continue
  }

  const lines = content.split('\n')

  for (const cls of deprecatedClasses) {
    // Non-global regex – no lastIndex drift
    const pattern = new RegExp(
      `(?<![a-zA-Z0-9_-])${escapedClasses[deprecatedClasses.indexOf(cls)]}(?![a-zA-Z0-9_-])`
    )
    for (const [i, line] of lines.entries()) {
      if (pattern.test(line)) {
        if (!findings.has(cls)) {findings.set(cls, [])}
        findings.get(cls).push({
          file: relPath,
          lineNumber: i + 1,
          lineText: line.trim().slice(0, 160)
        })
      }
    }
  }
}

console.log(`  → Scanned ${fileCount} files`)
console.log(`  → ${findings.size} deprecated class(es) found in codebase\n`)

// ─── Step 6: Write the log file ───────────────────────────────────────────────

const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
const logPath = join(ROOT, `deprecated-classes-${timestamp}.log`)

const HR = '─'.repeat(70)
const lines = []

const push = (...args) => lines.push(...args)

push(
  '╔══════════════════════════════════════════════════════════════════════╗',
  '║       Bootstrap v5 → v6  Deprecated Classes Report                  ║',
  '╚══════════════════════════════════════════════════════════════════════╝',
  '',
  `Generated : ${new Date().toISOString()}`,
  'v6 source : dist/css/bootstrap.css',
  `v5 source : ${V5_URL}`,
  ''
)

// Summary
push('SUMMARY', HR)
push(`  v6 unique classes .............. ${v6Classes.size}`)
push(`  v5 unique classes .............. ${v5Classes.size}`)
push(`  Classes only in v5 (deprecated) ${deprecatedClasses.length}`)
push(`  Deprecated classes used here ... ${findings.size}`)
push(`  Files scanned .................. ${fileCount}`)
push('')

// Full list of deprecated classes (mark which ones are in use)
if (onlyUsed) {
  push('USED DEPRECATED CLASSES  [only classes still found in this codebase]', HR)
  for (const [cls, usages] of [...findings].sort(([a], [b]) => a.localeCompare(b))) {
    push(`  .${cls}  (${usages.length} occurrence${usages.length === 1 ? '' : 's'})`)
  }
} else {
  push('ALL DEPRECATED CLASSES  [USED = found in this codebase]', HR)
  for (const cls of deprecatedClasses) {
    const used = findings.has(cls)
    push(`  ${used ? '[USED] ' : '       '}.${cls}`)
  }
}

push('')

// Detailed findings
push('DETAILED FINDINGS', HR)

if (findings.size === 0) {
  push('  No deprecated classes were found in the codebase. 🎉')
} else {
  const sortedFindings = [...findings].sort(([a], [b]) => a.localeCompare(b))
  for (const [cls, usages] of sortedFindings) {
    push('')
    push(`  .${cls}  (${usages.length} occurrence${usages.length === 1 ? '' : 's'})`)
    push(`  ${'─'.repeat(cls.length + 20)}`)
    for (const { file, lineNumber, lineText } of usages) {
      push(`    ${file}:${lineNumber}`)
      push(`      ${lineText}`)
    }
  }
}

push('')
push(HR)
push('End of report')

writeFileSync(logPath, `${lines.join('\n')}\n`, 'utf8')

const RED = '\u001B[31m'
const GREEN = '\u001B[32m'
const BOLD = '\u001B[1m'
const RESET = '\u001B[0m'

if (findings.size === 0) {
  console.log(`${GREEN}${BOLD}✔ No deprecated v5 classes found in the codebase.${RESET}`)
  console.log(`${GREEN}  Report written to: ${relative(ROOT, logPath)}${RESET}`)
  process.exit(0)
} else {
  const totalOccurrences = [...findings.values()].reduce((sum, arr) => sum + arr.length, 0)
  console.error(`${RED}${BOLD}✖ Found ${findings.size} deprecated v5 class(es) with ${totalOccurrences} occurrence(s) in the codebase.${RESET}`)
  console.error(`${RED}  Report written to: ${relative(ROOT, logPath)}${RESET}`)
  process.exit(1)
}
