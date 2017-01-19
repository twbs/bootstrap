module.exports = {
  // Compile, optimize and minify the 3 version of Bootstrap css
  'dist-css': [
    ['sass:main', 'postcss:main', 'cssmin:main'],
    ['sass:grid', 'postcss:grid', 'cssmin:grid'],
    ['sass:reboot', 'postcss:reboot', 'cssmin:reboot']
  ],
  // Produce the induvidual modules and the bundled version of Bootstrap Javascript modules
  'dist-js': [
    ['clean:dev-js', 'babel:dev'],
    ['clean:js', 'concat:js', 'babel:dist', 'stamp:js', 'uglify:dist']
  ],
  // Produce documentation csss and JS
  'dist-docs': [
    ['sass:docs', 'postcss:docs', 'cssmin:docs'],
    ['uglify:docs']
  ],
  // Produce css and js and execute unit test
  'dist-css-js': [
    ['concurrent:dist-js'],
    ['clean:css', 'concurrent:dist-css']
  ],
  // Produce css, js, docs, docs css and js, and lint
  'dist-lint-doc-test': [['dist', 'qunit'], 'docs', 'lint'],
  // Run all linters
  lint: ['eslint:js', 'eslint:grunt', 'eslint:docs', 'stylelint:scss', 'stylelint:docs', 'htmlhint:docs', 'htmlhint'],
  // Build dev and dist JS in parallel
  'watch-js': [
    ['clean:dev-js', 'babel:dev'], ['concat:js', 'babel:dist', 'copy:docs-js']
  ],
  watch: {
    options: {
      logConcurrentOutput: true
    },
    // Watch for docs changes and run watch in parallel
    tasks: ['watch', 'jekyll:watch']
  }
}
