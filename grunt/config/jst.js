// https://github.com/gruntjs/grunt-contrib-jst
module.exports = {
  compile: {
    files: {
      '<%= paths.dist %>docs/assets/js/templates.js': [ '<%= paths.doc %>templates/*.html' ]
    }
  }
};