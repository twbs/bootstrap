module.exports = {
  options: {
    outputStyle: 'expanded',
    precision: 6,
    sourceMap: true,
    sourceMapContents: true
  },
  main: {
    files: {
      'dist/css//<%= pkg.name %>.css': 'scss/<%= pkg.name %>.scss'
    }
  },
  grid: {
    files: {
      'dist/css//<%= pkg.name %>-grid.css': 'scss/<%= pkg.name %>-grid.scss'
    }
  },
  reboot: {
    files: {
      'dist/css//<%= pkg.name %>-reboot.css': 'scss/<%= pkg.name %>-reboot.scss'
    }
  },
  docs: {
    files: {
      'docs/assets/css/docs.css': 'docs/assets/scss/docs.scss'
    }
  }
}
