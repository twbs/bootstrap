#!/usr/bin/env node

/*!
 * Script to build our plugins to use them separately.
 * Copyright 2020-2021 The Bootstrap Authors
 * Copyright 2020-2021 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 */

'use strict'

const path = require('path')
const rollup = require('rollup')
const glob = require('glob')
const { babel } = require('@rollup/plugin-babel')
const banner = require('./banner.js')

const srcPath = path.resolve(__dirname, '../js/src/')
const jsFiles = glob.sync(srcPath + '/**/*.js') // path.posix.normalize(srcPath)

// Array which holds the resolved plugins
const resolved = []

const filenameToEntity = filename => filename.replace(/(?:^|-)[a-z]/g, char => char.slice(-1).toUpperCase())

for (const file of jsFiles) {
  resolved.push({
    src: file.replace('.js', ''),
    dist: file.replace('src', 'dist'),
    relativePath: path.relative(srcPath, file),
    name: filenameToEntity(path.basename(file, '.js'))
  })
}

const build = async plugin => {
  const globals = {}

  const bundle = await rollup.rollup({
    input: plugin.src,
    plugins: [
      babel({
        // Only transpile our source code
        exclude: 'node_modules/**',
        // Include the helpers in each file, at most one copy of each
        babelHelpers: 'bundled'
      })
    ],
    external: source => {
      // Replace starting with ./ or ../
      const pattern = /^(\.+)\//

      // It's probably a Node.js package
      if (!pattern.test(source)) {
        globals[source] = source
        return true
      }

      const usedPlugin = resolved.find(plugin => {
        return plugin.src.includes(source.replace(pattern, ''))
      })

      if (!usedPlugin) {
        throw new Error(`Source ${source} is not mapped!`)
      }

      globals[path.normalize(usedPlugin.src)] = usedPlugin.name
      return true
    }
  })

  await bundle.write({
    banner: banner(path.basename(plugin.relativePath)),
    format: 'umd',
    name: plugin.name,
    sourcemap: true,
    globals,
    generatedCode: 'es2015',
    file: plugin.dist
  })

  console.log(`Built ${plugin.name}`)
}

(async () => {
  try {
    const basename = path.basename(__filename)
    const timeLabel = `[${basename}] finished`

    console.log('Building individual plugins...')
    console.time(timeLabel)

    await Promise.all(Object.values(resolved).map(plugin => build(plugin)))

    console.timeEnd(timeLabel)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
})()
