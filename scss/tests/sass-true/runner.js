'use strict'

const fs = require('node:fs')
const path = require('node:path')
const { runSass } = require('sass-true')

module.exports = (filename, { describe, it }) => {
  const data = fs.readFileSync(filename, 'utf8')
  const TRUE_SETUP = '$true-terminal-output: false; @use "true" as *;'
  const sassString = TRUE_SETUP + data

  runSass(
    { describe, it, sourceType: 'string' },
    sassString,
    { loadPaths: [path.dirname(filename)] }
  )
}
