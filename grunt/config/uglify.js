// https://github.com/gruntjs/grunt-contrib-uglify
module.exports = {
  options: {
    preserveComments: 'some'
  },
  dist: {
    files: {
      '<%= paths.dist %>assets/js/foundation.min.js': ['<%= files.js %>'],
      '<%= paths.dist %>docs/assets/js/modernizr.js': ['<%= paths.vendor %>modernizr/modernizr.js'],
      '<%= paths.dist %>docs/assets/js/all.js': ['<%= paths.vendor %>jquery/dist/jquery.js', '<%= paths.vendor %>lodash/dist/lodash.min.js','<%= paths.vendor %>fastclick/lib/fastclick.js', '<%= paths.vendor %>jquery-placeholder/jquery.placeholder.js', '<%= paths.vendor %>jquery.autocomplete/dist/jquery.autocomplete.js', '<%= files.js %>', '<%= paths.doc %>assets/js/docs.js']
    }
  },
  vendor: {
    files: {
      '<%= paths.dist %>assets/js/vendor/placeholder.js': '<%= paths.vendor %>jquery-placeholder/jquery.placeholder.js',
      '<%= paths.dist %>assets/js/vendor/fastclick.js': '<%= paths.vendor %>fastclick/lib/fastclick.js',
      '<%= paths.dist %>assets/js/vendor/jquery.cookie.js': '<%= paths.vendor %>jquery.cookie/jquery.cookie.js',
      '<%= paths.dist %>assets/js/vendor/jquery.js': '<%= paths.vendor %>jquery/dist/jquery.js',
      '<%= paths.dist %>assets/js/vendor/modernizr.js': '<%= paths.vendor %>modernizr/modernizr.js'
    }
  }
};