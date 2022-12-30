/* eslint-env node */

'use strict'

const { runSass } = require('sass-true')
const fs = require('node:fs')
const path = require('node:path')

module.exports = (filename, { describe, it }) => {
  const data = fs.readFileSync(filename, 'utf8')
  const TRUE_SETUP = '$true-terminal-output: false; @import "true";'
  const sassString = TRUE_SETUP + data

  runSass(
    { describe, it, sourceType: 'string' },
    sassString,
    { loadPaths: [path.dirname(filename)] }
  )
}
