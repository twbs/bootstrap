/*!
 * Script to build our plugins to use them separately.
 * Copyright 2019 The Bootstrap Authors
 * Copyright 2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

'use strict'

const path = require('path')
const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const banner = require('./banner.js')

const TEST = process.env.NODE_ENV === 'test'
const plugins = [
  babel({
    // Only transpile our source code
    exclude: 'node_modules/**',
    // Include only required helpers
    externalHelpersWhitelist: [
      'defineProperties',
      'createClass',
      'inheritsLoose',
      'defineProperty',
      'objectSpread'
    ]
  })
]
const bsPlugins = {
  Data: path.resolve(__dirname, '../js/src/dom/data.js'),
  EventHandler: path.resolve(__dirname, '../js/src/dom/event-handler.js'),
  Manipulator: path.resolve(__dirname, '../js/src/dom/manipulator.js'),
  Polyfill: path.resolve(__dirname, '../js/src/dom/polyfill.js'),
  SelectorEngine: path.resolve(__dirname, '../js/src/dom/selector-engine.js'),
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
  Tooltip: path.resolve(__dirname, '../js/src/tooltip.js')
}
const rootPath = TEST ? '../js/coverage/dist/' : '../js/dist/'

if (TEST) {
  bsPlugins.Util = path.resolve(__dirname, '../js/src/util/index.js')
  bsPlugins.Sanitizer = path.resolve(__dirname, '../js/src/util/sanitizer.js')
}

const defaultPluginConfig = {
  external: [
    bsPlugins.Data,
    bsPlugins.EventHandler,
    bsPlugins.SelectorEngine
  ],
  globals: {
    [bsPlugins.Data]: 'Data',
    [bsPlugins.EventHandler]: 'EventHandler',
    [bsPlugins.SelectorEngine]: 'SelectorEngine'
  }
}

function getConfigByPluginKey(pluginKey) {
  if (
    pluginKey === 'Data' ||
    pluginKey === 'Manipulator' ||
    pluginKey === 'EventHandler' ||
    pluginKey === 'Polyfill' ||
    pluginKey === 'SelectorEngine' ||
    pluginKey === 'Util' ||
    pluginKey === 'Sanitizer'
  ) {
    return {
      external: [bsPlugins.Polyfill],
      globals: {
        [bsPlugins.Polyfill]: 'Polyfill'
      }
    }
  }

  if (pluginKey === 'Alert' || pluginKey === 'Tab') {
    return defaultPluginConfig
  }

  if (
    pluginKey === 'Button' ||
    pluginKey === 'Carousel' ||
    pluginKey === 'Collapse' ||
    pluginKey === 'Modal' ||
    pluginKey === 'ScrollSpy'
  ) {
    const config = Object.assign(defaultPluginConfig)
    config.external.push(bsPlugins.Manipulator)
    config.globals[bsPlugins.Manipulator] = 'Manipulator'
    return config
  }

  if (pluginKey === 'Dropdown' || pluginKey === 'Tooltip') {
    const config = Object.assign(defaultPluginConfig)
    config.external.push(bsPlugins.Manipulator, 'popper.js')
    config.globals[bsPlugins.Manipulator] = 'Manipulator'
    config.globals['popper.js'] = 'Popper'
    return config
  }

  if (pluginKey === 'Popover') {
    return {
      external: [
        bsPlugins.Data,
        bsPlugins.SelectorEngine,
        bsPlugins.Tooltip
      ],
      globals: {
        [bsPlugins.Data]: 'Data',
        [bsPlugins.SelectorEngine]: 'SelectorEngine',
        [bsPlugins.Tooltip]: 'Tooltip'
      }
    }
  }

  if (pluginKey === 'Toast') {
    return {
      external: [
        bsPlugins.Data,
        bsPlugins.EventHandler,
        bsPlugins.Manipulator
      ],
      globals: {
        [bsPlugins.Data]: 'Data',
        [bsPlugins.EventHandler]: 'EventHandler',
        [bsPlugins.Manipulator]: 'Manipulator'
      }
    }
  }
}

const utilObjects = [
  'Util',
  'Sanitizer'
]

const domObjects = [
  'Data',
  'EventHandler',
  'Manipulator',
  'Polyfill',
  'SelectorEngine'
]

function build(plugin) {
  console.log(`Building ${plugin} plugin...`)

  const { external, globals } = getConfigByPluginKey(plugin)
  const pluginFilename = path.basename(bsPlugins[plugin])
  let pluginPath = rootPath

  if (utilObjects.includes(plugin)) {
    pluginPath = `${rootPath}/util/`
  }

  if (domObjects.includes(plugin)) {
    pluginPath = `${rootPath}/dom/`
  }

  rollup.rollup({
    input: bsPlugins[plugin],
    plugins,
    external
  }).then(bundle => {
    bundle.write({
      banner: banner(pluginFilename),
      format: 'umd',
      name: plugin,
      sourcemap: true,
      globals,
      file: path.resolve(__dirname, `${pluginPath}${pluginFilename}`)
    })
      .then(() => console.log(`Building ${plugin} plugin... Done!`))
      .catch(error => console.error(`${plugin}: ${error}`))
  })
}

Object.keys(bsPlugins)
  .forEach(plugin => build(plugin))
