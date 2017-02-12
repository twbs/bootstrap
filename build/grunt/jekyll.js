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
  dev: {
    options: {
      dest: '_gh_pages',
      raw: 'livereload: true\nlivereload_port: <%= watch.docs.options.livereload %>'
    }
  },
  watch: {
    options: {
      watch: true,
      incremental: true,
      dest: '_gh_pages',
      raw: 'livereload: true\nlivereload_port: <%= watch.docs.options.livereload %>'
    }
  }
}
