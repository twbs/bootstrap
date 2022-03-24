#!/usr/bin/env node

/*!
 * Script to build our plugins to use them separately.
 * Copyright 2020-2022 The Bootstrap Authors
 * Copyright 2020-2022 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 */

'use strict'

const path = require('path')
const rollup = require('rollup')
const { babel } = require('@rollup/plugin-babel')
const banner = require('./banner.js')

const TEST = process.env.NODE_ENV === 'test'
const plugins = [
  babel({
    // Only transpile our source code
    exclude: 'node_modules/**',
    // Include the helpers in each file, at most one copy of each
    babelHelpers: 'bundled'
  })
]
const bsPlugins = {
  Alert: path.resolve(__dirname, '../js/src/alert.js'),
  Button: path.resolve(__dirname, '../js/src/button.js'),
  Carousel: path.resolve(__dirname, '../js/src/carousel.js'),
  Collapse: path.resolve(__dirname, '../js/src/collapse.js'),
  Dropdown: path.resolve(__dirname, '../js/src/dropdown.js'),
  Modal: path.resolve(__dirname, '../js/src/modal.js'),
  Popover: path.resolve(__dirname, '../js/src/popover.js'),
  ScrollSpy: path.resolve(__dirname, '../js/src/scrollspy.js'),
  Tab: path.resolve(__dirname, '../js/src/tab.js'),
  Toast: path.resolve(__dirname, '../js/src/toast.js'),
  Tooltip: path.resolve(__dirname, '../js/src/tooltip.js'),
  Util: path.resolve(__dirname, '../js/src/util.js')
}
const rootPath = TEST ? '../js/coverage/dist/' : '../js/dist/'

const build = async plugin => {
  console.log(`Building ${plugin} plugin...`)

  const external = ['jquery', 'popper.js']
  const globals = {
    jquery: 'jQuery', // Ensure we use jQuery which is always available even in noConflict mode
    'popper.js': 'Popper'
  }

  // Do not bundle Util in plugins
  if (plugin !== 'Util') {
    external.push(bsPlugins.Util)
    globals[bsPlugins.Util] = 'Util'
  }

  // Do not bundle Tooltip in Popover
  if (plugin === 'Popover') {
    external.push(bsPlugins.Tooltip)
    globals[bsPlugins.Tooltip] = 'Tooltip'
  }

  const pluginFilename = `${plugin.toLowerCase()}.js`
  const bundle = await rollup.rollup({
    input: bsPlugins[plugin],
    plugins,
    external
  })

  await bundle.write({
    banner: banner(pluginFilename),
    format: 'umd',
    name: plugin,
    sourcemap: true,
    globals,
    file: path.resolve(__dirname, `${rootPath}${pluginFilename}`)
  })

  console.log(`Building ${plugin} plugin... Done!`)
}

const main = async () => {
  try {
    await Promise.all(Object.keys(bsPlugins).map(plugin => build(plugin)))
  } catch (error) {
    console.error(error)

    process.exit(1)
  }
}

main()
