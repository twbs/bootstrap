// https://github.com/gruntjs/grunt-contrib-connect
module.exports = {
  server: {
    options: {
      port: 9001,
      base: '<%= paths.dist %>'
    }
  }
};