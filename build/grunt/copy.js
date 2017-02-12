module.exports = {
  'docs-js': {
    expand: true,
    cwd: 'dist/js',
    src: [
      '**/*'
    ],
    dest: 'docs/dist/js/'
  },
  'docs-css': {
    expand: true,
    cwd: 'dist/css',
    src: [
      '**/*'
    ],
    dest: 'docs/dist/css/'
  }
}
