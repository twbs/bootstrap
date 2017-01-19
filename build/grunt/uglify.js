module.exports = {
  options: {
    compress: {
      warnings: false
    },
    sourceMap: true,
    mangle: true,
    preserveComments: /^!|@preserve|@license|@cc_on/i,
    mangleProperties: {
      regex: /^_/
    }
  },
  dist: {
    src: '<%= concat.js.dest %>',
    dest: 'dist/js/<%= pkg.name %>.min.js'
  },
  docs: {
    src: [
      'docs/assets/js/vendor/anchor.min.js',
      'docs/assets/js/vendor/clipboard.min.js',
      'docs/assets/js/vendor/holder.min.js',
      'docs/assets/js/src/application.js'
    ],
    dest: 'docs/assets/js/docs.min.js'
  }
}
