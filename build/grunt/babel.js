module.exports = {
  options: {
    sourceMap: true
  },
  dev: {
    files: [{
      expand: true,
      cwd: 'js/src/',
      src: ['*.js'],
      dest: 'js/dist/'
    }]
  },
  dist: {
    options: {
      extends: '../../js/.babelrc'
    },
    files: {
      '<%= concat.js.dest %>' : '<%= concat.js.dest %>'
    }
  }
}
