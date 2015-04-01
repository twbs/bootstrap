// https://github.com/gruntjs/grunt-contrib-sass
module.exports = {
  dist: {
    options: {
      loadPath: ['<%= paths.sassLoad %>'],
      bundleExec: true
    },
    files: {
      '<%= paths.dist %>assets/css/foundation.css': '<%= files.scss %>',
      '<%= paths.dist %>assets/css/normalize.css': '<%= paths.scss %>normalize.scss',
      '<%= paths.dist %>docs/assets/css/docs.css': '<%= paths.doc %>assets/scss/docs.scss'
    }
  }
};