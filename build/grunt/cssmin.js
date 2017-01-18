module.exports = {
  options: {
    level: 1,
    sourceMap: true
  },
  main: {
    files: {
      '<%= path.dist.css %>/<%= pkg.name %>.min.css': '<%= path.dist.css %>/<%= pkg.name %>.css'
    }
  },
  grid: {
    files: {
      '<%= path.dist.css %>/<%= pkg.name %>-grid.min.css': '<%= path.dist.css %>/<%= pkg.name %>-grid.css'
    }
  },
  reboot: {
    files: {
      '<%= path.dist.css %>/<%= pkg.name %>-reboot.min.css': '<%= path.dist.css %>/<%= pkg.name %>-reboot.css'
    }
  },
  docs: {
    files: {
      '<%= path.dist.docs.css %>/docs.min.css': '<%= path.dist.docs.css %>/docs.css'
    }
  }
}
