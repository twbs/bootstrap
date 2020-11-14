/* eslint-env node */

const { babel } = require('@rollup/plugin-babel')
const { nodeResolve } = require('@rollup/plugin-node-resolve')

module.exports = {
  input: 'js/tests/integration/bundle.js',
  output: {
    file: 'js/coverage/bundle.js',
    format: 'iife'
  },
  plugins: [
    nodeResolve(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled'
    })
  ]
}
