'use strict'

/*!
 * Rollup plugin that resolves relative `.js` import specifiers to their
 * TypeScript sources. Our TS files import siblings with the standard
 * ESM-style `.js` extension (the same way tsc resolves them), so when Rollup
 * bundles straight from `js/src`, a specifier like `./util/index.js` must be
 * mapped to the `./util/index.ts` file on disk.
 * Copyright 2011-2026 The Bootstrap Authors
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 */

const fs = require('node:fs')
const path = require('node:path')

const tsResolve = () => {
  return {
    name: 'ts-resolve',
    resolveId(source, importer) {
      if (!importer || !source.startsWith('.') || !source.endsWith('.js')) {
        return null
      }

      const tsPath = path.resolve(path.dirname(importer), `${source.slice(0, -3)}.ts`)
      return fs.existsSync(tsPath) ? tsPath : null
    }
  }
}

module.exports = tsResolve
