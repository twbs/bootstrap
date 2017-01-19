module.exports = {
  options: {
    advanced: false,
    sourceMap: true,
    keepSpecialComments: '*',
    sourceMapInlineSources: true
  },
  main: {
    files: {
      'dist/css/<%= pkg.name %>.min.css': 'dist/css/<%= pkg.name %>.css'
    }
  },
  grid: {
    files: {
      'dist/css/<%= pkg.name %>-grid.min.css': 'dist/css/<%= pkg.name %>-grid.css'
    }
  },
  reboot: {
    files: {
      'dist/css/<%= pkg.name %>-reboot.min.css': 'dist/css/<%= pkg.name %>-reboot.css'
    }
  },
  docs: {
    files: {
      'docs/assets/css/docs.min.css': 'docs/assets/css/docs.css'
    }
  }
}
