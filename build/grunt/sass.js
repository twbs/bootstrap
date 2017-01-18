module.exports = {
  options: {
    outputStyle: 'expanded',
    precision: 6,
    sourceMap: true
  },
  main: {
    files: {
      '<%= path.dist.css %>/<%= pkg.name %>.css': '<%= path.src.scss %>/<%= pkg.name %>.scss'
    }
  },
  grid: {
    files: {
      '<%= path.dist.css %>/<%= pkg.name %>-grid.css': '<%= path.src.scss %>/<%= pkg.name %>-grid.scss'
    }
  },
  reboot: {
    files: {
      '<%= path.dist.css %>/<%= pkg.name %>-reboot.css': '<%= path.src.scss %>/<%= pkg.name %>-reboot.scss'
    }
  },
  docs: {
    files: {
      '<%= path.dist.docs.css %>/docs.css': '<%= path.src.docs.scss %>/docs.scss'
    }
  }
}
