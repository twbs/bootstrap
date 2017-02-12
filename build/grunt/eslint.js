module.exports = {
  js: {
    options: {
      configFile: 'js/.eslintrc.json'
    },
    src: ['js/src/*.js']
  },
  grunt: {
    options: {
      configFile: 'build/grunt/.eslintrc.json'
    },
    src: ['build/grunt/*.js', 'Gruntfile.js']
  },
  docs: {
    options: {
      configFile: 'js/tests/.eslintrc.json'
    },
    src: ['docs/js/src/*.js']
  }
}
