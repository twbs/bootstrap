module.exports = {
  // Make Mocha look for `.test.scss` files
  'spec': "scss/**/*.{test,spec}.scss",
  // Compile them into JS scripts running `sass-true`
  require: 'scss/tests/sass-true/register',
  // Watch any changes in the scss folder so the tests
  // run again when saving any scss file (test or actual code)
  'watch-files': "scss/**/*",
}
