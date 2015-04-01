// https://github.com/gruntjs/grunt-contrib-concat
module.exports = {
  dist: {
    files: {
      '<%= paths.dist %>assets/js/foundation.js': '<%= files.js %>'
    }
  }
};