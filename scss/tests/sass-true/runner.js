/* eslint-env node */

const sassTrue = require('sass-true')
const fs = require('fs')
const path = require('path')

module.exports = function (filename, { describe, it }) {
  const data = fs.readFileSync(filename, { encoding: 'utf8' })
  const TRUE_SETUP = '$true-terminal-output: false; @import \'true\';'

  sassTrue.runSass({
    data: TRUE_SETUP + data,
    includePaths: [path.dirname(filename)],
    sass: require('sass') }, { describe, it })
}
