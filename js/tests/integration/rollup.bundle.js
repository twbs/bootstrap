/* eslint-env node */

const resolve = require('@rollup/plugin-node-resolve')
const { babel } = require('@rollup/plugin-babel')
const replace = require('@rollup/plugin-replace')

module.exports = {
  input: 'js/tests/integration/bundle.js',
  output: {
    file: 'js/coverage/bundle.js',
    format: 'iife'
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': '"production"'
    }),
    resolve(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled'
    })
  ]
}
