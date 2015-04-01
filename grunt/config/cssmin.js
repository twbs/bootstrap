// https://github.com/gruntjs/grunt-contrib-cssmin
module.exports = {
  dist: {
    files: [{
      expand: true,
      cwd: '<%= paths.dist %>assets/css',
      src: ['*.css', '!*.min.css'],
      dest: '<%= paths.dist %>assets/css',
      ext: '.min.css'
    }]
  }
};