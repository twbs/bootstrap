/*!
 * Script to build our plugins to use them separately.
 * Copyright 2018 The Bootstrap Authors
 * Copyright 2018 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

const path    = require('path')
const rollup  = require('rollup')
const babel   = require('rollup-plugin-babel')
const banner  = require('./banner.js')

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

function build(plugin) {
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

  rollup.rollup({
    input: bsPlugins[plugin],
    plugins,
    external
  }).then((bundle) => {
    bundle.write({
      banner: banner(pluginFilename),
      format: 'umd',
      name: plugin,
      sourcemap: true,
      globals,
      file: path.resolve(__dirname, `${rootPath}${pluginFilename}`)
    })
      .then(() => console.log(`Building ${plugin} plugin... Done!`))
      .catch((err) => console.error(`${plugin}: ${err}`))
  })
}

Object.keys(bsPlugins).forEach((plugin) => build(plugin))
