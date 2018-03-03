const path     = require('path')
const babel    = require('rollup-plugin-babel')
const resolve  = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const banner   = require('./banner.js')

const BUNDLE  = process.env.BUNDLE === 'true'

let fileDest   = 'bootstrap.js'
const external = ['jquery', 'hammerjs', 'popper.js']
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
const globals = {
  jquery: 'jQuery', // Ensure we use jQuery which is always available even in noConflict mode
  hammerjs: 'Hammer',
  'popper.js': 'Popper'
}

if (BUNDLE) {
  fileDest = 'bootstrap.bundle.js'
  // We just keep jQuery as external
  external.length = 1
  delete globals['popper.js']
  delete globals.hammerjs
  plugins.push(
    commonjs({
      include: 'node_modules/**'
    }),
    resolve()
  )
}

module.exports = {
  input: path.resolve(__dirname, '../js/src/index.js'),
  output: {
    banner,
    file: path.resolve(__dirname, `../dist/js/${fileDest}`),
    format: 'umd',
    globals,
    name: 'bootstrap'
  },
  external,
  plugins
}
