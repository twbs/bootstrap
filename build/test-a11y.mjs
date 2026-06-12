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
// The dist bundle is an ES module. Browsers refuse to load `type="module"`
// scripts over file:// (CORS), so inline the source into an inline module
// script instead — its data-API side effects still register on evaluation.
const jsSource = fs
  .readFileSync(path.join(rootDir, 'dist/js/bootstrap.bundle.js'), 'utf8')
  .replaceAll('</script', '<\\/script')

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
    if (!entry.component) {
      errors.push(`${where}: missing \`component\``)
    }

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

    if (entry.interactions !== undefined && !Array.isArray(entry.interactions)) {
      errors.push(`${where}: \`interactions\` must be an array of steps`)
    }

    if (entry.assertions === undefined) {
      continue
    }

    if (!Array.isArray(entry.assertions)) {
      errors.push(`${where}: \`assertions\` must be an array`)
      continue
    }

    for (const assertion of entry.assertions) {
      if (!wcagCriteria[assertion.criterion]) {
        errors.push(`${where}: assertion references unknown criterion "${assertion.criterion}"`)
      }

      if (typeof assertion.run !== 'string') {
        errors.push(`${where}: assertion for ${assertion.criterion} must provide a \`run\` body (string)`)
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
    // Components that need a specific rendered state (e.g. for `interactions`)
    // should provide inline `html` in the config instead of relying on docs
    // extraction (see build/a11y.config.mjs).
    if (!match[1].includes('${')) {
      examples.push(match[1])
    }
  }

  return examples
}

function resolveExamples(entry) {
  if (Array.isArray(entry.html)) {
    return entry.html
  }

  if (typeof entry.html === 'string') {
    return [entry.html]
  }

  const docId = entry.examplesFrom ?? entry.component
  for (const ext of ['.mdx', '.md']) {
    const file = path.join(docsDir, `${docId}${ext}`)
    if (fs.existsSync(file)) {
      return extractExamples(fs.readFileSync(file, 'utf8'))
    }
  }

  return []
}

const configErrors = validateConfig(a11yComponents)
if (configErrors.length > 0) {
  console.error('Invalid a11y config (build/a11y.config.mjs):')
  for (const error of configErrors) {
    console.error(`  - ${error}`)
  }

  process.exit(1)
}

const components = a11yComponents
  .map(entry => ({
    id: entry.component,
    criteria: entry.criteria,
    interactions: entry.interactions ?? [],
    assertions: entry.assertions ?? [],
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
    <script type="module">${jsSource}</script>
  </body>
</html>`
}

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bs-a11y-'))

const EMPTY_AXE = {
  violations: [], passes: [], incomplete: [], inapplicable: []
}

// Drive scripted Playwright steps before auditing, so dynamic components can be
// opened/operated and audited in their *interactive* state rather than collapsed.
// Steps run sequentially because each depends on the state left by the previous.
async function runSteps(page, steps = []) {
  for (const step of steps) {
    if (step.click) {
      // eslint-disable-next-line no-await-in-loop -- ordered UI steps
      await page.click(step.click)
    } else if (step.focus) {
      // eslint-disable-next-line no-await-in-loop -- ordered UI steps
      await page.focus(step.focus)
    } else if (step.type !== undefined) {
      // eslint-disable-next-line no-await-in-loop -- ordered UI steps
      await (step.on ? page.type(step.on, step.type) : page.keyboard.type(step.type))
    } else if (step.press) {
      // eslint-disable-next-line no-await-in-loop -- ordered UI steps
      await (step.on ? page.press(step.on, step.press) : page.keyboard.press(step.press))
    } else if (step.wait) {
      // eslint-disable-next-line no-await-in-loop -- ordered UI steps
      await page.waitForTimeout(step.wait)
    }
  }
}

// Run the config's custom assertions for criteria axe can't check statically
// (keyboard operation, focus order/restore, status-message announcements). Each
// assertion may carry its own `steps` (cumulative, on the live page) and a `run`
// body evaluated in-page; the returned value is compared to `expect` (or treated
// as a boolean when `expect` is omitted).
async function runAssertions(page, assertions = []) {
  const results = []
  for (const assertion of assertions) {
    if (assertion.steps) {
      // eslint-disable-next-line no-await-in-loop -- assertions share one live page
      await runSteps(page, assertion.steps)
    }

    let actual
    let error
    try {
      // eslint-disable-next-line no-await-in-loop -- assertions share one live page
      actual = await page.evaluate(body => {
        // eslint-disable-next-line no-new-func -- assertion bodies come from the trusted local config
        return new Function(body)()
      }, assertion.run)
    } catch (error_) {
      error = error_.message
    }

    const pass = error === undefined &&
      (assertion.expect === undefined ?
        Boolean(actual) :
        JSON.stringify(actual) === JSON.stringify(assertion.expect))

    results.push({
      criterion: assertion.criterion,
      label: assertion.label ?? assertion.run,
      pass,
      actual,
      expect: assertion.expect,
      error
    })
  }

  return results
}

async function evaluateComponent(page, component, ruleIds) {
  const html = pageHtml(component.examples.join('\n'))
  const file = path.join(tmpDir, `${component.id.replace(/\//g, '__')}.html`)
  fs.writeFileSync(file, html)

  await page.goto(pathToFileURL(file).href, { waitUntil: 'load' })
  await page.waitForTimeout(200) // let data-bs-* plugins auto-initialise
  await runSteps(page, component.interactions)
  await page.addScriptTag({ path: axePath })

  const axeResults = ruleIds.length > 0 ?
    await page.evaluate(
      async ({ rootId, rules }) =>
        window.axe.run(`#${rootId}`, { runOnly: { type: 'rule', values: rules } }),
      { rootId: ROOT_ID, rules: ruleIds }
    ) :
    EMPTY_AXE

  const assertionResults = await runAssertions(page, component.assertions)

  return { axeResults, assertionResults }
}

// ---------------------------------------------------------------------------
// Reporting
// ---------------------------------------------------------------------------

const useColor = process.stdout.isTTY && !process.env.NO_COLOR
const paint = (code, text) => (useColor ? `\u001B[${code}m${text}\u001B[0m` : text)
const c = {
  pass: t => paint('32', t),
  fail: t => paint('31', t),
  warn: t => paint('33', t),
  dim: t => paint('90', t),
  bold: t => paint('1', t)
}

const VERDICTS = {
  pass: { label: 'PASS', color: c.pass },
  fail: { label: 'FAIL', color: c.fail },
  manual: { label: 'MANUAL', color: c.warn },
  author: { label: 'AUTHOR', color: c.dim },
  na: { label: 'N/A', color: c.dim }
}

function classify(item, axeResults, assertionResults) {
  const status = item.status ?? 'author'

  if (status === 'author') {
    return { verdict: 'author' }
  }

  const rules = wcagAxeRules[item.criterion] ?? []
  const assertions = assertionResults.filter(a => a.criterion === item.criterion)

  // Neither machine-checkable by axe nor backed by a scripted assertion.
  if (rules.length === 0 && assertions.length === 0) {
    return { verdict: 'manual' }
  }

  const violations = axeResults.violations.filter(v => rules.includes(v.id))
  const failedAssertions = assertions.filter(a => !a.pass)
  if (violations.length > 0 || failedAssertions.length > 0) {
    return { verdict: 'fail', violations, failedAssertions }
  }

  const axePassed = axeResults.passes.some(p => rules.includes(p.id))
  if (axePassed || assertions.length > 0) {
    return { verdict: 'pass' }
  }

  return { verdict: 'na' }
}

const totals = {
  pass: 0, fail: 0, manual: 0, author: 0, na: 0
}
let failed = false

const browser = await chromium.launch()
const page = await browser.newPage()

console.log(c.bold('\nWCAG conformance — automated component checks\n'))

for (const component of components) {
  // Union of axe rules across this component's machine-checkable, owned criteria.
  const ruleIds = [
    ...new Set(
      component.criteria
        .filter(item => (item.status ?? 'author') !== 'author')
        .flatMap(item => wcagAxeRules[item.criterion] ?? [])
    )
  ]

  const needsBrowser = ruleIds.length > 0 || component.assertions.length > 0

  let axeResults = EMPTY_AXE
  let assertionResults = []
  if (needsBrowser) {
    if (component.examples.length === 0) {
      console.log(`${c.bold(component.id)} ${c.warn('— no renderable <Example> snippets; skipping checks')}`)
    } else {
      try {
        // eslint-disable-next-line no-await-in-loop -- components share one page; run sequentially
        ({ axeResults, assertionResults } = await evaluateComponent(page, component, ruleIds))
      } catch (error) {
        failed = true
        console.log(`${c.bold(component.id)} ${c.fail(`— checks failed to run: ${error.message}`)}`)
        continue
      }
    }
  }

  console.log(c.bold(component.id))

  for (const item of component.criteria) {
    const meta = wcagCriteria[item.criterion]
    const { verdict, violations, failedAssertions } = classify(item, axeResults, assertionResults)
    totals[verdict]++
    if (verdict === 'fail') {
      failed = true
    }

    const { label, color } = VERDICTS[verdict]
    const badge = color(label.padEnd(6))
    const level = c.dim(`[${meta.level}]`.padEnd(5))
    const id = item.criterion.padEnd(6)
    const statusLabel = c.dim(a11yStatusLabels[item.status ?? 'author'])

    console.log(`  ${badge} ${id} ${level} ${meta.title} ${c.dim('·')} ${statusLabel}`)

    if (verdict === 'fail') {
      for (const violation of violations ?? []) {
        console.log(`         ${c.fail('✗')} ${violation.id}: ${violation.help} (${violation.nodes.length} node(s))`)
      }

      for (const assertion of failedAssertions ?? []) {
        const reason = assertion.error ?
          `errored: ${assertion.error}` :
          `expected ${JSON.stringify(assertion.expect ?? true)}, got ${JSON.stringify(assertion.actual)}`
        console.log(`         ${c.fail('✗')} assertion "${assertion.label}" ${reason}`)
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
