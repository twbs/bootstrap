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

const paths = glob.sync(srcPath + '/**/*.js')

const filenameToEntity = filename => filename.replace(/(?:^|-)[a-z]/g, char => char.slice(-1).toUpperCase())

const resolved = {}
for (const filePath of paths) {
  resolved[filenameToEntity(path.basename(filePath, '.js'))] = {
    src: filePath.replace('.js', ''),
    dist: filePath.replace('src', 'dist'),
    name: filePath.replace(`${srcPath}/`, '')
  }
}

const plugins = [
  babel({
    // Only transpile our source code
    exclude: 'node_modules/**',
    // Include the helpers in each file, at most one copy of each
    babelHelpers: 'bundled'
  })
]

const build = async pluginKey => {
  console.log(`Building ${pluginKey} plugin...`)
  const plugin = resolved[pluginKey]

  const globals = {}
  const bundle = await rollup.rollup({
    input: plugin.src,
    plugins,
    external: source => {
      const pattern = /^(\.+)\// // replace starting with ./ or ../

      if (!pattern.test(source)) { // is probably a node plugin
        globals[source] = source
        return true
      }

      // eslint-disable-next-line no-unused-vars
      const usedPlugin = Object.entries(resolved).find(([key, path]) => {
        return path.src.includes(source.replace(pattern, ''))
      })

      if (!usedPlugin) {
        console.warn(`Source ${source} is not mapped`)
        return false
      }

      globals[usedPlugin[1].src] = usedPlugin[0]
      return true
    }
  })

  await bundle.write({
    banner: banner(plugin.name),
    format: 'umd',
    name: pluginKey,
    sourcemap: true,
    globals,
    generatedCode: 'es2015',
    file: plugin.dist
  })

  console.log(`Building ${pluginKey} plugin... Done!`)
}

const main = () => {
  try {
    Promise.all(Object.keys(resolved).map(plugin => build(plugin)))
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

main()
