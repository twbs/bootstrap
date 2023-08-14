#!/usr/bin/env node

/*!
 * Script to build our plugins to use them separately.
 * Copyright 2020-2023 The Bootstrap Authors
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 */

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { babel } from '@rollup/plugin-babel'
import globby from 'globby'
import { rollup } from 'rollup'
import banner from './banner.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const sourcePath = path.resolve(__dirname, '../js/src/').replace(/\\/g, '/')
const jsFiles = globby.sync(`${sourcePath}/**/*.js`)

// Array which holds the resolved plugins
const resolvedPlugins = []

// Trims the "js" extension and uppercases => first letter, hyphens, backslashes & slashes
const filenameToEntity = filename => filename.replace('.js', '')
  .replace(/(?:^|-|\/|\\)[a-z]/g, str => str.slice(-1).toUpperCase())

for (const file of jsFiles) {
  resolvedPlugins.push({
    src: file,
    dist: file.replace('src', 'dist'),
    fileName: path.basename(file),
    className: filenameToEntity(path.basename(file))
    // safeClassName: filenameToEntity(path.relative(sourcePath, file))
  })
}

const build = async plugin => {
  const globals = {}

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
    external(source) {
      // Pattern to identify local files
      const pattern = /^(\.{1,2})\//

      // It's not a local file, e.g a Node.js package
      if (!pattern.test(source)) {
        globals[source] = source
        return true
      }

      const usedPlugin = resolvedPlugins.find(plugin => {
        return plugin.src.includes(source.replace(pattern, ''))
      })

      if (!usedPlugin) {
        throw new Error(`Source ${source} is not mapped!`)
      }

      // We can change `Index` with `UtilIndex` etc if we use
      // `safeClassName` instead of `className` everywhere
      globals[path.normalize(usedPlugin.src)] = usedPlugin.className
      return true
    }
  })

  await bundle.write({
    banner: banner(plugin.fileName),
    format: 'umd',
    name: plugin.className,
    sourcemap: true,
    globals,
    generatedCode: 'es2015',
    file: plugin.dist
  })

  console.log(`Built ${plugin.className}`)
}

(async () => {
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
