const path    = require('path')
const babel   = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const BUNDLE  = process.env.BUNDLE === 'true'

var fileDest  = 'bootstrap.js'
var external  = ['jquery', 'popper.js']
const plugins = [
  babel({
    exclude: 'node_modules/**', // only transpile our source code
    externalHelpersWhitelist: [ // include only required helpers
      'typeof',
      'classCallCheck',
      'createClass',
      'inherits',
      'possibleConstructorReturn'
    ]
  })
]
const globals = {
  jquery: '$',
  'popper.js': 'Popper'
}

if (BUNDLE) {
  fileDest = 'bootstrap.bundle.js'
  // remove last entry in external array to bundle Popper
  external.pop()
  delete globals['popper.js']
  plugins.push(resolve())
}

module.exports = {
  input: path.resolve(__dirname, '../js/src/index.js'),
  output: {
    file: path.resolve(__dirname, `../dist/js/${fileDest}`),
    format: 'iife'
  },
  name: 'bootstrap',
  external: external,
  globals: globals,
  plugins: plugins
}
