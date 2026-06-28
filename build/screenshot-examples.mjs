/**
 * Screenshot Bootstrap examples using Playwright.
 *
 * Starts the Astro dev server automatically, waits for it to be ready,
 * takes light + dark screenshots at 1x and 2x, then shuts the server down.
 *
 * Usage:
 *   node build/screenshot-examples.mjs [--only album,pricing]
 *
 * Prerequisites:
 *   npm install -D playwright
 *   npx playwright install chromium
 *
 * The script reads examples.yml and saves to:
 *   site/static/docs/[version]/assets/img/examples/{slug}.png       (480×300)
 *   site/static/docs/[version]/assets/img/examples/{slug}@2x.png    (960×600)
 *   site/static/docs/[version]/assets/img/examples/{slug}-dark.png  (480×300)
 *   site/static/docs/[version]/assets/img/examples/{slug}-dark@2x.png (960×600)
 */

import { readFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'
import { parse as parseYaml } from 'yaml'
import { chromium } from 'playwright'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// ─── Config ──────────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const getArg = flag => {
  const idx = args.indexOf(flag)
  return idx === -1 ? null : args[idx + 1]
}

const ONLY = getArg('--only')?.split(',').map(s => s.trim().toLowerCase()) ?? null

// Astro dev server port (matches astro-dev in package.json)
const PORT = 9001
const BASE_URL = `http://localhost:${PORT}`
const SERVER_TIMEOUT_MS = 60_000
const SERVER_POLL_INTERVAL_MS = 500

// Read docs version from config.yml
const configYml = readFileSync(path.resolve(ROOT, 'config.yml'), 'utf8')
const DOCS_VERSION = parseYaml(configYml).docs_version ?? '6.0'

// Output directory — [version] is a literal Astro dynamic-route folder name
const OUT_DIR = path.resolve(ROOT, 'site/static/docs/[version]/assets/img/examples')
mkdirSync(OUT_DIR, { recursive: true })

// Full-width capture viewport; images are then resized down to thumbnail sizes
const CAPTURE_VIEWPORT = { width: 1440, height: 900 }
// 1x thumbnail: 480×300  |  2x thumbnail: 960×600
const THUMB = { w: 480, h: 300 }

// ─── Dev server ──────────────────────────────────────────────────────────────

/** Spawn the Astro dev server and return the child process. */
function startDevServer() {
  console.log('Starting Astro dev server…')
  const server = spawn('node', ['node_modules/.bin/astro', 'dev', '--root', 'site', '--port', String(PORT)], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe']
  })
  server.stdout.on('data', d => process.stdout.write(`[astro] ${d}`))
  server.stderr.on('data', d => process.stderr.write(`[astro] ${d}`))
  return server
}

/** Poll until the server responds or timeout is reached. */
async function waitForServer() {
  const deadline = Date.now() + SERVER_TIMEOUT_MS

  const poll = async () => {
    if (Date.now() >= deadline) {
      throw new Error(`Dev server did not start within ${SERVER_TIMEOUT_MS / 1000}s`)
    }

    try {
      const res = await fetch(`${BASE_URL}/`)
      if (res.ok || res.status < 500) {
        console.log('Dev server is ready.\n')
        return
      }
    } catch {
      // not up yet
    }

    await new Promise(resolvePromise => {
      setTimeout(resolvePromise, SERVER_POLL_INTERVAL_MS)
    })

    await poll()
  }

  await poll()
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Replicate the getSlug() logic used in the Astro components */
function getSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/** Collect all non-external examples from examples.yml */
function getExamples() {
  const yml = readFileSync(path.resolve(ROOT, 'site/data/examples.yml'), 'utf8')
  const categories = parseYaml(yml)
  const result = []
  for (const { examples, external } of categories) {
    if (external) {
      continue
    }

    for (const example of examples ?? []) {
      result.push(example.name)
    }
  }

  return result
}

// ─── Screenshot ──────────────────────────────────────────────────────────────

/**
 * Capture the page at full viewport, then resize to the target thumbnail size.
 * colorScheme: 'light' | 'dark'
 * scale: 1 (480×300) | 2 (960×600)
 */
async function screenshot(page, slug, colorScheme, scale) {
  const darkSuffix = colorScheme === 'dark' ? '-dark' : ''
  const scaleSuffix = scale === 2 ? '@2x' : ''
  const outFile = path.resolve(OUT_DIR, `${slug}${darkSuffix}${scaleSuffix}.png`)

  await page.emulateMedia({ colorScheme })
  const rawBuffer = await page.screenshot({ type: 'png' })

  await sharp(rawBuffer)
    .resize(THUMB.w * scale, THUMB.h * scale, { fit: 'cover', position: 'top' })
    .toFile(outFile)

  console.log(`  saved ${outFile.replace(`${ROOT}/`, '')}`)
}

async function run() {
  const examples = getExamples()
  const filtered = ONLY ? examples.filter(n => ONLY.includes(n.toLowerCase())) : examples

  if (filtered.length === 0) {
    throw new Error('No examples matched. Check --only values against examples.yml.')
  }

  const server = startDevServer()

  // Ensure the server is killed even if we crash
  const cleanup = () => server.kill()
  process.on('exit', cleanup)

  try {
    await waitForServer()

    console.log(`Taking screenshots of ${filtered.length} example(s)`)
    console.log(`Output → ${OUT_DIR}\n`)

    const browser = await chromium.launch()

    await Promise.all(filtered.map(async name => {
      const slug = getSlug(name)
      const url = `${BASE_URL}/docs/${DOCS_VERSION}/examples/${slug}/`
      console.log(`→ ${name} (${slug})`)

      // Single page load — reuse for light & dark, both scales (sharp handles resizing)
      const page = await browser.newPage({ viewport: CAPTURE_VIEWPORT, deviceScaleFactor: 1 })
      await page.goto(url, { waitUntil: 'networkidle' })
      await page.addStyleTag({ content: '.bd-mode-toggle { display: none !important; }' })
      await screenshot(page, slug, 'light', 1)
      await screenshot(page, slug, 'light', 2)
      await screenshot(page, slug, 'dark', 1)
      await screenshot(page, slug, 'dark', 2)
      await page.close()
    }))

    await browser.close()
    console.log('\nDone.')
  } finally {
    server.kill()
  }
}

run().catch(error => {
  console.error(error)
  process.exitCode = 1
})
