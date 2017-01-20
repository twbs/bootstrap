module.exports = {
  // Create distribution, each stream in parallel
  'dist-all': [
    // Create bootstrap.css + minified version + sourcemaps
    ['sass:main', 'postcss:main', 'cssmin:main'],
    // Create bootstrap-grid.css + minified version + sourcemaps
    ['sass:grid', 'postcss:grid', 'cssmin:grid'],
    // Create bootstrap-reboot.css + minified version + sourcemaps
    ['sass:reboot', 'postcss:reboot', 'cssmin:reboot'],
    // Create individual JS modules
    ['babel:js-dev'],
    // Create bootstrap.js + minified version + sourcemaps
    ['concat:js', 'babel:js', 'concat:banner-footer', 'uglify:dist'],
    // Create doc.css + minified version + sourcemaps
    ['sass:docs', 'postcss:docs', 'cssmin:docs'],
    // Create doc.js + minified version + sourcemaps
    ['uglify:docs']
  ],
  // Run all linters in parallel
  lint: ['eslint:js', 'eslint:grunt', 'eslint:docs', 'stylelint:scss', 'stylelint:docs'],
  watch: {
    options: {
      logConcurrentOutput: true
    },
    // Run regular watch and Jekyll watch in parallel
    tasks: ['watch', 'jekyll:watch']
  }
}
