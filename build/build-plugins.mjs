#!/usr/bin/env node

/*!
 * Script to build our plugins to use them separately.
 * Copyright 2020-2026 The Bootstrap Authors
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { babel } from '@rollup/plugin-babel'
import { globby } from 'globby'
import { rollup } from 'rollup'
import banner from './banner.mjs'
import tsResolve from './rollup-plugin-ts-resolve.cjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const sourcePath = path.resolve(__dirname, '../js/src/').replace(/\\/g, '/')
const distPath = path.resolve(__dirname, '../js/dist/').replace(/\\/g, '/')
const tsFiles = await globby(`${sourcePath}/**/*.ts`)

// Array which holds the resolved plugins
const resolvedPlugins = []

for (const file of tsFiles) {
  resolvedPlugins.push({
    src: file,
    dist: file.replace(sourcePath, distPath).replace(/\.ts$/, '.js'),
    fileName: path.basename(file).replace(/\.ts$/, '.js')
  })
}

const build = async (plugin, outputOptions = {}) => {
  const bundle = await rollup({
    input: plugin.src,
    plugins: [
      tsResolve(),
      babel({
        // Only transpile our source code
        exclude: 'node_modules/**',
        // Transpile the TypeScript sources too
        extensions: ['.js', '.mjs', '.ts'],
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
    file: plugin.dist,
    ...outputOptions
  })

  console.log(`Built ${plugin.fileName}`)
}

// Build the package entry point next to the plugins. Its re-exports point at
// `./src/*.ts` sources, so rewrite them to the sibling compiled plugins, and
// derive the entry's type declarations the same way (the plugins' own
// declarations are emitted by `js-compile-types`).
const buildIndex = async () => {
  const src = path.resolve(__dirname, '../js/index.ts')

  await build(
    { src, dist: path.resolve(__dirname, '../js/dist/index.js'), fileName: 'index.js' },
    // The re-exported `./src/*.js` modules live next to the built index —
    // point at them by filename regardless of how Rollup normalized the ids
    { paths: id => `./${path.basename(id)}` }
  )

  const source = await fs.readFile(src, 'utf8')
  const declarations = source.replace(/'\.\/src\//g, '\'./').replace('Bootstrap index.ts', 'Bootstrap index.d.ts')
  await fs.writeFile(path.resolve(__dirname, '../js/dist/index.d.ts'), declarations)
  console.log('Built index.d.ts')
}

(async () => {
  try {
    const basename = path.basename(__filename)
    const timeLabel = `[${basename}] finished`

    console.log('Building individual plugins...')
    console.time(timeLabel)

    await Promise.all([...resolvedPlugins.map(plugin => build(plugin)), buildIndex()])

    console.timeEnd(timeLabel)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
})()
