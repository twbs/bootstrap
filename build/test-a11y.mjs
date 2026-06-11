#!/usr/bin/env node
/*!
 * Accessibility conformance test suite.
 *
 * Driven by the unified config in build/a11y.config.mjs (which WCAG criteria each
 * component is tested against). For every configured component it renders that
 * component's documented `<Example>` snippets in headless Chromium (with the
 * compiled CSS + JS bundle) and runs axe-core, scoped to the axe rules mapped to
 * each declared criterion (see `wcagAxeRules` in site/src/data/wcag.ts).
 *
 * It reports the criterion id, title, WCAG level, our coverage status, and an
 * automated verdict:
 *   - PASS / FAIL  — machine-checkable, component-owned criteria (built-in/partial)
 *   - MANUAL       — component-owned but not machine-checkable by axe
 *   - AUTHOR       — the consuming app's responsibility; not asserted here
 *   - N/A          — checkable, but no matching elements in the examples
 *
 * The process exits non-zero only when a component-owned, machine-checkable
 * criterion regresses (a FAIL), so author/manual items never break CI.
 *
 * Run: npm run js-test-a11y
 */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { createRequire } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { chromium } from 'playwright'
import { a11yComponents } from './a11y.config.mjs'

const require = createRequire(import.meta.url)
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const docsDir = path.join(rootDir, 'site/src/content/docs')
const axePath = require.resolve('axe-core')
const cssHref = pathToFileURL(path.join(rootDir, 'dist/css/bootstrap.css')).href
const jsHref = pathToFileURL(path.join(rootDir, 'dist/js/bootstrap.bundle.js')).href

const { wcagCriteria, a11yStatuses, a11yStatusLabels, wcagAxeRules } = await import(
  pathToFileURL(path.join(rootDir, 'site/src/data/wcag.ts')).href
)

// ---------------------------------------------------------------------------
// Config validation (replaces the old build-time zod check on frontmatter)
// ---------------------------------------------------------------------------

function validateConfig(entries) {
  const errors = []
  for (const [index, entry] of entries.entries()) {
    const where = entry.component ?? `entry #${index}`
    if (!entry.component) errors.push(`${where}: missing \`component\``)
    if (!Array.isArray(entry.criteria) || entry.criteria.length === 0) {
      errors.push(`${where}: must declare at least one criterion`)
      continue
    }

    for (const item of entry.criteria) {
      if (!wcagCriteria[item.criterion]) {
        errors.push(`${where}: unknown criterion "${item.criterion}" (not in wcag.ts catalog)`)
      }

      const status = item.status ?? 'author'
      if (!a11yStatuses.includes(status)) {
        errors.push(`${where}: invalid status "${status}" for ${item.criterion}`)
      }
    }
  }

  return errors
}

// ---------------------------------------------------------------------------
// Markup resolution
// ---------------------------------------------------------------------------

// Pull the HTML out of every `<Example code={`...`} />` template literal.
function extractExamples(src) {
  const examples = []
  const re = /code=\{`([\s\S]*?)`\}/g
  let match
  while ((match = re.exec(src)) !== null) {
    // Skip snippets that rely on JS template interpolation — we can't render
    // those statically and don't want to feed `${...}` into axe as text.
    if (!match[1].includes('${')) examples.push(match[1])
  }

  return examples
}

function resolveExamples(entry) {
  if (Array.isArray(entry.html)) return entry.html
  if (typeof entry.html === 'string') return [entry.html]

  const docId = entry.examplesFrom ?? entry.component
  for (const ext of ['.mdx', '.md']) {
    const file = path.join(docsDir, `${docId}${ext}`)
    if (fs.existsSync(file)) return extractExamples(fs.readFileSync(file, 'utf8'))
  }

  return []
}

const configErrors = validateConfig(a11yComponents)
if (configErrors.length > 0) {
  console.error('Invalid a11y config (build/a11y.config.mjs):')
  for (const error of configErrors) console.error(`  - ${error}`)
  process.exit(1)
}

const components = a11yComponents
  .map((entry) => ({
    id: entry.component,
    criteria: entry.criteria,
    examples: resolveExamples(entry)
  }))
  .sort((a, b) => a.id.localeCompare(b.id))

// ---------------------------------------------------------------------------
// Rendering + axe
// ---------------------------------------------------------------------------

const ROOT_ID = 'a11y-root'

function pageHtml(examplesHtml) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="${cssHref}">
  </head>
  <body>
    <main id="${ROOT_ID}">${examplesHtml}</main>
    <script src="${jsHref}"></script>
  </body>
</html>`
}

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bs-a11y-'))

async function runAxe(page, component, ruleIds) {
  const html = pageHtml(component.examples.join('\n'))
  const file = path.join(tmpDir, `${component.id.replace(/\//g, '__')}.html`)
  fs.writeFileSync(file, html)

  await page.goto(pathToFileURL(file).href, { waitUntil: 'load' })
  await page.waitForTimeout(200) // let data-bs-* plugins auto-initialise
  await page.addScriptTag({ path: axePath })

  return page.evaluate(
    async ({ rootId, rules }) =>
      window.axe.run(`#${rootId}`, { runOnly: { type: 'rule', values: rules } }),
    { rootId: ROOT_ID, rules: ruleIds }
  )
}

// ---------------------------------------------------------------------------
// Reporting
// ---------------------------------------------------------------------------

const useColor = process.stdout.isTTY && !process.env.NO_COLOR
const paint = (code, text) => (useColor ? `\u001B[${code}m${text}\u001B[0m` : text)
const c = {
  pass: (t) => paint('32', t),
  fail: (t) => paint('31', t),
  warn: (t) => paint('33', t),
  dim: (t) => paint('90', t),
  bold: (t) => paint('1', t)
}

const VERDICTS = {
  pass: { label: 'PASS', color: c.pass },
  fail: { label: 'FAIL', color: c.fail },
  manual: { label: 'MANUAL', color: c.warn },
  author: { label: 'AUTHOR', color: c.dim },
  na: { label: 'N/A', color: c.dim }
}

function classify(item, axeResults) {
  const status = item.status ?? 'author'
  const rules = wcagAxeRules[item.criterion] ?? []

  if (status === 'author') return { verdict: 'author' }
  if (rules.length === 0) return { verdict: 'manual' }

  const violations = axeResults.violations.filter((v) => rules.includes(v.id))
  if (violations.length > 0) return { verdict: 'fail', violations }

  const passed = axeResults.passes.some((p) => rules.includes(p.id))
  return { verdict: passed ? 'pass' : 'na' }
}

const totals = { pass: 0, fail: 0, manual: 0, author: 0, na: 0 }
let failed = false

const browser = await chromium.launch()
const page = await browser.newPage()

console.log(c.bold('\nWCAG conformance — automated component checks\n'))

for (const component of components) {
  // Union of axe rules across this component's machine-checkable, owned criteria.
  const ruleIds = [
    ...new Set(
      component.criteria
        .filter((item) => (item.status ?? 'author') !== 'author')
        .flatMap((item) => wcagAxeRules[item.criterion] ?? [])
    )
  ]

  let axeResults = { violations: [], passes: [], incomplete: [], inapplicable: [] }
  if (ruleIds.length > 0) {
    if (component.examples.length === 0) {
      console.log(`${c.bold(component.id)} ${c.warn('— no renderable <Example> snippets; skipping axe')}`)
    } else {
      try {
        axeResults = await runAxe(page, component, ruleIds)
      } catch (error) {
        failed = true
        console.log(`${c.bold(component.id)} ${c.fail(`— axe run failed: ${error.message}`)}`)
        continue
      }
    }
  }

  console.log(c.bold(component.id))

  for (const item of component.criteria) {
    const meta = wcagCriteria[item.criterion]
    const { verdict, violations } = classify(item, axeResults)
    totals[verdict]++
    if (verdict === 'fail') failed = true

    const { label, color } = VERDICTS[verdict]
    const badge = color(label.padEnd(6))
    const level = c.dim(`[${meta.level}]`.padEnd(5))
    const id = item.criterion.padEnd(6)
    const statusLabel = c.dim(a11yStatusLabels[item.status ?? 'author'])

    console.log(`  ${badge} ${id} ${level} ${meta.title} ${c.dim('·')} ${statusLabel}`)

    if (verdict === 'fail') {
      for (const violation of violations) {
        console.log(`         ${c.fail('✗')} ${violation.id}: ${violation.help} (${violation.nodes.length} node(s))`)
      }
    }
  }

  console.log('')
}

await browser.close()
fs.rmSync(tmpDir, { recursive: true, force: true })

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log(c.bold('Summary'))
console.log(
  `  ${c.pass(`${totals.pass} passed`)}, ${c.fail(`${totals.fail} failed`)}, ` +
    `${c.warn(`${totals.manual} manual`)}, ${c.dim(`${totals.author} author`)}, ${c.dim(`${totals.na} n/a`)}\n`
)

if (failed) {
  console.error(c.fail('Accessibility checks failed.'))
  process.exit(1)
}

console.log(c.pass('All automated accessibility checks passed.'))
