module.exports = {
  options: {
    bundleExec: true,
    config: '_config.yml',
    incremental: false
  },
  docs: {},
  github: {
    options: {
      raw: 'github: true'
    }
  },
  watch: { // Another target
    options: {
      watch: true,
      incremental: true,
      dest: '_gh_pages'
    }
  }
}
