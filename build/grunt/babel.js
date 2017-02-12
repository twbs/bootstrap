module.exports = {
  options: {
    sourceMap: true
  },
  'js-dev': {
    files: [{
      expand: true,
      cwd: 'js/src/',
      src: ['*.js'],
      dest: 'js/dist/'
    }]
  },
  js: {
    options: {
      extends: '../../js/.babelrc'
    },
    files: {
      '<%= concat.js.dest %>': '<%= concat.js.dest %>'
    }
  }
}
