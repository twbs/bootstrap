/* eslint-env node */

const path = require('node:path')

module.exports = {
  spec_dir: 'scss' /* eslint-disable-line camelcase */,

  // Make Mocha look for `.test.scss` files
  spec_files: ['**/*.{test,spec}.scss'] /* eslint-disable-line camelcase */,

  // Compile them into JS scripts running `sass-true`
  requires: [path.join(__dirname, 'sass-true/register')],

  // Ensure we use `require` so that the require.extensions works
  // as `import` completely bypasses it
  jsLoader: 'require'
}
