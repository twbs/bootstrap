module.exports = {
  options: {
    configFile: 'scss/.stylelintrc',
    syntax: 'scss',
    maxWarnings: -1
  },
  scss: {
    src: ['scss/*.scss', '!scss/_normalize.scss']
  },
  docs: {
    src: ['docs/assets/scss/*.scss', '!docs/assets/scss/docs.scss']
  }
}
