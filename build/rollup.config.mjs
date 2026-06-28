import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { babel } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import banner from './banner.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const BUNDLE = process.env.BUNDLE === 'true'

let destinationFile = 'bootstrap'
const external = ['@floating-ui/dom', 'vanilla-calendar-pro']
const plugins = [
  babel({
    // Only transpile our source code
    exclude: 'node_modules/**',
    // Include the helpers in the bundle, at most one copy of each
    babelHelpers: 'bundled'
  })
]

if (BUNDLE) {
  destinationFile += '.bundle'
  // Bundle all dependencies (Floating UI, Vanilla Calendar Pro, etc.)
  external.length = 0
  plugins.push(
    replace({
      'process.env.NODE_ENV': '"production"',
      preventAssignment: true
    }),
    nodeResolve()
  )
}

const rollupConfig = {
  input: path.resolve(__dirname, '../js/index.js'),
  output: {
    banner: banner(),
    file: path.resolve(__dirname, `../dist/js/${destinationFile}.js`),
    format: 'esm',
    generatedCode: 'es2015'
  },
  external,
  plugins
}

export default rollupConfig
