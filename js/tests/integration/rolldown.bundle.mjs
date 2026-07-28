import { defineConfig } from 'rolldown'
import browserTargets from '../../../build/browser-targets.mjs'

// This bundles the built `dist/js/bootstrap.js`, so no TypeScript is involved.
// It proves a consumer can bundle Bootstrap and that tree shaking keeps it usable.
export default defineConfig({
  input: 'js/tests/integration/bundle.js',
  transform: {
    target: browserTargets,
    define: {
      'process.env.NODE_ENV': '"production"'
    }
  },
  output: {
    file: 'js/coverage/bundle.js',
    format: 'iife'
  }
})
