/* eslint-env node */

const resolve = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')

module.exports = {
  input: 'js/tests/integration/bundle.js',
  output: {
    file: 'coverage/bundle.js',
    format: 'iife'
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**'
    })
  ]
}
