const path = require('path')
const fs = require('fs')
const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const BUNDLE = process.env.BUNDLE === 'true'
const year = new Date().getFullYear()

const dataPkg = fs.readFileSync(path.resolve(__dirname, '../package.json'))
const pkg = JSON.parse(dataPkg)

var fileDest = 'bootstrap.js'
var external = ['jquery', 'popper.js']
const plugins = [
  babel({
    exclude: 'node_modules/**' // only transpile our source code
  })
]

if (BUNDLE) {
  fileDest = 'bootstrap.bundle.js'
  // remove last entry in external array ton bundle Popper
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
  plugins: plugins,
  banner: `/*!
 * Bootstrap v${pkg.version} (${pkg.homepage})
 * Copyright 2011-${year} ${pkg.author}
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */
`
}
