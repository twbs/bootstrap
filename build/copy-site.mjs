#!/usr/bin/env node

/*!
 * Copy the built Astro site to the deployment directory.
 * Copyright 2026 The Bootstrap Authors
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')
const sourceDir = path.join(rootDir, 'site/dist')
const destinationDir = path.join(rootDir, '_site')

await fs.rm(destinationDir, { force: true, recursive: true })
await fs.cp(sourceDir, destinationDir, { recursive: true })
