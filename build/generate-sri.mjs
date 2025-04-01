#!/usr/bin/env node

/*!
 * Script to generate SRI hashes for use in our docs.
 * Remember to use the same vendor files as the CDN ones,
 * otherwise the hashes won't match!
 *
 * Copyright 2017-2025 The Bootstrap Authors
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 */

import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sh from 'shelljs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

sh.config.fatal = true

const configFile = path.join(__dirname, '../config.yml')

// Array of objects which holds the files to generate SRI hashes for.
// `file` is the path from the root folder
// `configPropertyName` is the config.yml variable's name of the file
const files = [
  {
    file: 'dist/css/bootstrap.min.css',
    configPropertyName: 'css_hash'
  },
  {
    file: 'dist/css/bootstrap.rtl.min.css',
    configPropertyName: 'css_rtl_hash'
  },
  {
    file: 'dist/js/bootstrap.min.js',
    configPropertyName: 'js_hash'
  },
  {
    file: 'dist/js/bootstrap.bundle.min.js',
    configPropertyName: 'js_bundle_hash'
  },
  {
    file: 'node_modules/@popperjs/core/dist/umd/popper.min.js',
    configPropertyName: 'popper_hash'
  }
]

for (const { file, configPropertyName } of files) {
  fs.readFile(file, 'utf8', (error, data) => {
    if (error) {
      throw error
    }

    const algorithm = 'sha384'
    const hash = crypto.createHash(algorithm).update(data, 'utf8').digest('base64')
    const integrity = `${algorithm}-${hash}`

    console.log(`${configPropertyName}: ${integrity}`)

    sh.sed('-i', new RegExp(`^(\\s+${configPropertyName}:\\s+["'])\\S*(["'])`), `$1${integrity}$2`, configFile)
  })
}
