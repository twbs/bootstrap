/*!
 * Script to build our plugins to use them separately.
 * Copyright 2018 The Bootstrap Authors
 * Copyright 2018 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

'use strict'

const rollup  = require('rollup')
const path    = require('path')
const babel   = require('rollup-plugin-babel')
const TEST    = process.env.NODE_ENV === 'test'

const plugins = [
  babel({
    exclude: 'node_modules/**', // Only transpile our source code
    externalHelpersWhitelist: [ // Include only required helpers
      'defineProperties',
      'createClass',
      'inheritsLoose',
      'defineProperty',
      'objectSpread'
    ]
  })
]

const format = 'umd'
const rootPath = !TEST ? '../js/dist/' : '../js/coverage/dist/'
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
  Tooltip: path.resolve(__dirname, '../js/src/tooltip.js'),
  Util: path.resolve(__dirname, '../js/src/util.js')
}

Object.keys(bsPlugins)
  .forEach((pluginKey) => {
    console.log(`Building ${pluginKey} plugin...`)

    const external = ['jquery', 'popper.js']
    const globals = {
      jquery: 'jQuery', // Ensure we use jQuery which is always available even in noConflict mode
      'popper.js': 'Popper'
    }

    // Do not bundle Util in plugins
    if (pluginKey !== 'Util') {
      external.push(bsPlugins.Util)
      globals[bsPlugins.Util] = 'Util'
    }

    // Do not bundle Tooltip in Popover
    if (pluginKey === 'Popover') {
      external.push(bsPlugins.Tooltip)
      globals[bsPlugins.Tooltip] = 'Tooltip'
    }

    rollup.rollup({
      input: bsPlugins[pluginKey],
      plugins,
      external
    }).then((bundle) => {
      bundle.write({
        format,
        name: pluginKey,
        sourcemap: true,
        globals,
        file: path.resolve(__dirname, `${rootPath}${pluginKey.toLowerCase()}.js`)
      })
        .then(() => console.log(`Building ${pluginKey} plugin... Done !`))
        .catch((err) => console.error(`${pluginKey}: ${err}`))
    })
  })
