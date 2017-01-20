module.exports = {
  default: ['dist'],

  // --------------------------------------------------------------------------
  // Main tasks
  // --------------------------------------------------------------------------

  // Produce the Bootstrap javascript and css and moves them to the documentation
  dist: ['clean', 'concurrent:dist-all', 'copy', 'jekyll:docs'],
  // Run all the tests (conditional, either test-core or test-validate-html or test-sauve-js)
  // If not on Travis core will run.
  test: ['if'],
  // Build, create the downloadable zip packages and create the production documentation
  'prep-release': ['dist', 'compress', 'jekyll:github'],
  // Publish production doc
  publish: ['buildcontrol:pages'],
  // Watch and serve the docs
  'watch-serve': ['connect:docs', 'concurrent:watch'],

  // --------------------------------------------------------------------------
  // Test suite
  // --------------------------------------------------------------------------

  // Run the core Travis test (if conditions match)
  'test-core': ['concurrent:lint', 'dist', 'qunit'],
  // Run the validate-html Travis test (if conditions match)
  'test-validate-html': ['sass:docs', 'postcss:docs', 'cssmin:docs', 'uglify:docs', 'jekyll:docs', 'htmlhint:docs', 'htmlhint'],
  // Run the sauce-js Travis test (if conditions match)
  'test-sauce-js': ['dist', 'connect', 'saucelabs-qunit'],

  // --------------------------------------------------------------------------
  // Watch
  // --------------------------------------------------------------------------

  // Run when Javascript on source change, Compile, concat, deploy
  'watch-task-js': ['concat:js', 'babel:js', 'copy:docs-js'],
  // Run when CSS on source change. Compile, prefix and deploy css.
  'watch-task-css': ['sass:main', 'postcss:main', 'copy:docs-css'],
  // Run when docs CSS on source change. Compile and prefix.
  'watch-task-docs-css': ['sass:docs', 'postcss:docs']
}
