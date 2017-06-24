const path = require('path')
const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const BUNDLE = process.env.BUNDLE === 'true'

var fileDest = 'bootstrap.js'
var external = ['popper.js', 'jquery']
const plugins = [
  babel({
    exclude: 'node_modules/**' // only transpile our source code
  })
]

if (BUNDLE) {
  fileDest = 'bootstrap.bundle.js'
  // remove last entry in external array, because we don't want to bundle jquery
  external.pop()
  plugins.push(resolve())
}

module.exports = {
  entry: path.resolve(__dirname, '../js/src/index.js'),
  format: 'umd',
  moduleName: 'bootstrap',
  dest: path.resolve(__dirname, `../dist/js/${fileDest}`),
  external: external,
  globals: {
	  jquery: '$',
    'popper.js': 'Popper'
  },
  plugins: plugins
}
