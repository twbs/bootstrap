module.exports = {
  options: {
    configFile: 'scss/.stylelintrc',
    syntax: 'scss',
    maxWarnings: -1
  },
  scss: {
    src: ['<%= path.src.scss %>/**/*.scss']
  },
  docs: {
    src: ['<%= path.src.docs.scss %>/**/*.scss']
  }
}
