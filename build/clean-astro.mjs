#!/usr/bin/env node

/*!
 * Clean Astro's generated directories.
 * Copyright 2026 The Bootstrap Authors
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')
const generatedDirs = [
  path.join(rootDir, 'site/.astro'),
  path.join(rootDir, 'site/node_modules/.astro')
]

await Promise.all(generatedDirs.map(directory => fs.rm(directory, { force: true, recursive: true })))
