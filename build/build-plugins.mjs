#!/usr/bin/env node

/*!
 * Script to build our plugins to use them separately.
 * Copyright 2020-2026 The Bootstrap Authors
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 */

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { babel } from '@rollup/plugin-babel'
import { globby } from 'globby'
import { rollup } from 'rollup'
import banner from './banner.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const sourcePath = path.resolve(__dirname, '../js/src/').replace(/\\/g, '/')
const jsFiles = await globby(`${sourcePath}/**/*.js`)

// Array which holds the resolved plugins
const resolvedPlugins = []

for (const file of jsFiles) {
  resolvedPlugins.push({
    src: file,
    dist: file.replace('src', 'dist'),
    fileName: path.basename(file)
  })
}

const build = async plugin => {
  const bundle = await rollup({
    input: plugin.src,
    plugins: [
      babel({
        // Only transpile our source code
        exclude: 'node_modules/**',
        // Include the helpers in each file, at most one copy of each
        babelHelpers: 'bundled'
      })
    ],
    external: () => true
  })

  await bundle.write({
    banner: banner(plugin.fileName),
    format: 'esm',
    sourcemap: true,
    generatedCode: 'es2015',
    file: plugin.dist
  })

  console.log(`Built ${plugin.fileName}`)
}

;(async () => {
  try {
    const basename = path.basename(__filename)
    const timeLabel = `[${basename}] finished`

    console.log('Building individual plugins...')
    console.time(timeLabel)

    await Promise.all(Object.values(resolvedPlugins).map(plugin => build(plugin)))

    console.timeEnd(timeLabel)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
})()
