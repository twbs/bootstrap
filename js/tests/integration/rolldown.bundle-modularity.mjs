import { defineConfig } from 'rolldown'
import browserTargets from '../../../build/browser-targets.mjs'

// Same as `rolldown.bundle.mjs`, but it imports single plugins from `js/dist/`
// instead of the whole bundle. This proves the per-plugin entry points work.
export default defineConfig({
  input: 'js/tests/integration/bundle-modularity.js',
  transform: {
    target: browserTargets,
    define: {
      'process.env.NODE_ENV': '"production"'
    }
  },
  output: {
    file: 'js/coverage/bundle-modularity.js',
    format: 'iife'
  }
})
