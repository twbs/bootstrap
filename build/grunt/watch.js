module.exports = {
  js: {
    files: '<%= concat.js.src %>',
    tasks: ['watch-task:js']
  },
  sass: {
    files: 'scss/**/*.scss',
    tasks: ['watch-task:css']
  },
  'docs-scss': {
    files: 'docs/assets/scss/**/*.scss',
    tasks: ['watch-task:docs:css']
  },
  'docs-js': {
    files: 'docs/assets/js/**/*.js',
    tasks: ['watch-task:docs:js']
  },
  'docs-pages': {
    options: {
      livereload: true
    },
    files: '_gh_pages/**/*'
  }
}
