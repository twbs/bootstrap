module.exports = {
  js: {
    options: {
      configFile: 'js/.eslintrc.json'
    },
    src: ['<%= path.src.js.src %>/*.js']
  },
  grunt: {
    options: {
      configFile: 'build/grunt/.eslintrc.json'
    },
    src: ['build/grunt/*.js', 'Gruntfile.js']
  },
  docs: {
    options: {
      configFile: '<%= path.src.js.tests %>/.eslintrc.json'
    },
    src: ['<%= path.src.docs.js.src %>/*.js']
  }
}
