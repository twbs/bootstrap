'use strict'

const path = require('path')
const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const banner = require('./banner.js')

const BUNDLE = process.env.BUNDLE === 'true'
const ESM = process.env.ESM === 'true'

let fileDest = `bootstrap${ESM ? '.esm' : ''}.js`
const indexPath = ESM ? '../js/index.esm.js' : '../js/index.umd.js'
const external = ['popper.js']
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
const globals = {
  'popper.js': 'Popper'
}

if (BUNDLE) {
  fileDest = `bootstrap${ESM ? '.esm' : ''}.bundle.js`
  // Remove last entry in external array to bundle Popper
  external.pop()
  delete globals['popper.js']
  plugins.push(resolve())
}

const rollupConfig = {
  input: path.resolve(__dirname, indexPath),
  output: {
    banner,
    file: path.resolve(__dirname, `../dist/js/${fileDest}`),
    format: ESM ? 'esm' : 'umd',
    globals
  },
  external,
  plugins
}

if (!ESM) {
  rollupConfig.output.name = 'bootstrap'
}

module.exports = rollupConfig
