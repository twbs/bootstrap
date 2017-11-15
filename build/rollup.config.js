'use strict'

const path    = require('path')
const babel   = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const pkg     = require(path.resolve(__dirname, '../package.json'))
const BUNDLE  = process.env.BUNDLE === 'true'
const year    = new Date().getFullYear()

let fileDest  = 'bootstrap.js'
const external  = ['jquery', 'popper.js']
const plugins = [
  babel({
    exclude: 'node_modules/**', // only transpile our source code
    externalHelpersWhitelist: [ // include only required helpers
      'defineProperties',
      'createClass',
      'inheritsLoose',
      'extends'
    ]
  })
]
const globals = {
  jquery: 'jQuery', // ensure we use jQuery which is always available even in noConflict mode
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
  external,
  globals,
  plugins,
  banner: `/*!
  * Bootstrap v${pkg.version} (${pkg.homepage})
  * Copyright 2011-${year} ${pkg.author}
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
  */`
}
