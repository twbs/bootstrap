/*!
 * Vitest browser mode runs the unit specs in a real Chromium through Playwright.
 * It replaces Karma. `js/tests/vitest-setup.js` maps the Jasmine API the specs
 * are written against onto Vitest.
 * Copyright 2026 The Bootstrap Authors
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(dirname, '../..')

const DEBUG = Boolean(process.env.DEBUG)

// Same job as Rolldown's `resolve.extensionAlias`: our TypeScript sources import
// siblings with the ESM-style `.js` extension, so a specifier like
// `./util/index.js` has to resolve to `./util/index.ts` on disk. Vite has no
// built-in `extensionAlias` option.
const tsResolve = () => {
  const cache = new Map()

  return {
    name: 'ts-resolve',
    enforce: 'pre' as const,
    resolveId(source: string, importer?: string) {
      if (!importer || !source.startsWith('.') || !source.endsWith('.js')) {
        return null
      }

      const tsPath = path.resolve(path.dirname(importer), `${source.slice(0, -3)}.ts`)

      if (!cache.has(tsPath)) {
        cache.set(tsPath, fs.existsSync(tsPath) ? tsPath : null)
      }

      return cache.get(tsPath)
    }
  }
}

export default defineConfig({
  root,
  plugins: [tsResolve()],
  define: {
    'process.env.NODE_ENV': '"dev"'
  },
  test: {
    // The specs call describe/it/expect as globals, the way Karma provided them
    globals: true,
    setupFiles: [path.resolve(dirname, 'vitest-setup.js')],
    include: ['js/tests/unit/**/*.spec.js'],
    coverage: {
      provider: 'istanbul',
      // Cover every source file, not only the ones a spec happens to import.
      // Karma instrumented on demand, which hid untested files from the report.
      include: ['js/src/**/*.ts'],
      reporter: ['text-summary', 'lcov'],
      reportsDirectory: path.resolve(root, 'js/coverage'),
      // Karma's thresholds were 90/89/90/90, but they were measured against a
      // smaller denominator, because istanbul only instrumented the files a spec
      // imported. Counting all of `js/src` raises the branch denominator to 1952
      // and lands at 88.93%, so the branch floor is set to the honest figure.
      // Statements, functions and lines all clear their old thresholds.
      thresholds: {
        statements: 90,
        branches: 88,
        functions: 90,
        lines: 90
      }
    },
    browser: {
      enabled: true,
      provider: playwright(),
      headless: !DEBUG,
      screenshotFailures: false,
      instances: [
        { browser: 'chromium' }
      ]
    }
  }
})
