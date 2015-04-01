// https://github.com/erickrdch/grunt-string-replace
module.exports = {
  dist: {
    files: {
      '<%= paths.dist %>assets/': '<%= paths.dist %>assets/bower.json',
      '<%= paths.dist %>assets/css/': '<%= paths.dist %>assets/css/*.css',
      '<%= paths.dist %>assets/js/': '<%= paths.dist %>assets/js/*js',
      '<%= paths.dist %>assets/js/foundation/': '<%= paths.dist %>assets/js/foundation/*js',
      '<%= paths.dist %>assets/scss/foundation/components/': '<%= paths.dist %>assets/scss/foundation/components/*.scss',
      '<%= paths.dist %>docs/assets/css/': '<%= paths.dist %>docs/assets/css/*.css',
      '<%= paths.dist %>docs/assets/js/': '<%= paths.dist %>docs/assets/js/*.js'
    },
    options: {
      replacements: [{
        pattern: /{{\s*VERSION\s*}}/g,
        replacement: '<%= pkg.version %>'
      }]
    }
  }
};