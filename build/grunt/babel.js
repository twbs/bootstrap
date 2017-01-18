module.exports = {
  options: {
    sourceMap: true
  },
  dev: {
    files: [{
      expand: true,
      cwd: '<%= path.src.js.src %>/',
      src: ['*.js'],
      dest: '<%= path.src.js.dist %>/'
    }]
  },
  dist: {
    options: {
      extends: '../../js/.babelrc'
    },
    files: {
      '<%= path.dist.js %>/<%= pkg.name %>.js': '<%= path.dist.js %>/<%= pkg.name %>.js'
    }
  }
}
