import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { babel } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import banner from './banner.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const BUNDLE = process.env.BUNDLE === 'true'
const ESM = process.env.ESM === 'true'

let destinationFile = `bootstrap${ESM ? '.esm' : ''}`
const external = ['@floating-ui/dom', 'vanilla-calendar-pro']
const plugins = [
  babel({
    // Only transpile our source code
    exclude: 'node_modules/**',
    // Include the helpers in the bundle, at most one copy of each
    babelHelpers: 'bundled'
  })
]
const globals = {
  '@floating-ui/dom': 'FloatingUIDOM',
  'vanilla-calendar-pro': 'VanillaCalendarPro'
}

if (BUNDLE) {
  destinationFile += '.bundle'
  // Remove all entries in external array to bundle Floating UI and Vanilla Calendar Pro
  external.length = 0
  delete globals['@floating-ui/dom']
  delete globals['vanilla-calendar-pro']
  plugins.push(
    replace({
      'process.env.NODE_ENV': '"production"',
      preventAssignment: true
    }),
    nodeResolve()
  )
}

const rollupConfig = {
  input: path.resolve(__dirname, `../js/index.${ESM ? 'esm' : 'umd'}.js`),
  output: {
    banner: banner(),
    file: path.resolve(__dirname, `../dist/js/${destinationFile}.js`),
    format: ESM ? 'esm' : 'umd',
    globals,
    generatedCode: 'es2015'
  },
  external,
  plugins
}

if (!ESM) {
  rollupConfig.output.name = 'bootstrap'
}

export default rollupConfig
