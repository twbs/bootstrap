import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'rolldown'
import banner from './banner.mjs'
import browserTargets from './browser-targets.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const BUNDLE = process.env.BUNDLE === 'true'

let destinationFile = 'bootstrap'
const external = ['@floating-ui/dom', 'vanilla-calendar-pro']
const define = {}

if (BUNDLE) {
  destinationFile += '.bundle'
  // Bundle all dependencies (Floating UI, Vanilla Calendar Pro, etc.)
  external.length = 0
  define['process.env.NODE_ENV'] = '"production"'
}

export default defineConfig({
  input: path.resolve(__dirname, '../js/src/index.ts'),
  external,
  resolve: {
    // Our TS sources import siblings with the ESM-style `.js` extension;
    // map those specifiers to the `.ts` files on disk
    extensionAlias: { '.js': ['.ts', '.js'] }
  },
  transform: {
    target: browserTargets,
    define
  },
  output: {
    banner: banner(),
    file: path.resolve(__dirname, `../dist/js/${destinationFile}.js`),
    format: 'esm'
  }
})
