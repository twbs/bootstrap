/* eslint-env node */

const { runSass } = require('sass-true')
const fs = require('node:fs')
const path = require('node:path')

module.exports = function (filename, { describe, it }) {
  const data = fs.readFileSync(filename, { encoding: 'utf8' })
  const TRUE_SETUP = '$true-terminal-output: false; @import \'true\';'

  runSass({
    data: TRUE_SETUP + data,
    includePaths: [path.dirname(filename)]
  }, { describe, it })
}
