module.exports = {
  compress: {
    main: {
      options: {
        archive: 'bootstrap-<%= pkg.version %>-dist.zip',
        mode: 'zip',
        level: 9,
        pretty: true
      },
      files: [{
        expand: true,
        cwd: 'dist/',
        src: ['**'],
        dest: 'bootstrap-<%= pkg.version %>-dist'
      }]
    }
  }
}
