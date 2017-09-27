#!/usr/bin/env node

/*!
 * Script to run vnu-jar if Java is available.
 * Copyright 2017 The Bootstrap Authors
 * Copyright 2017 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

'use strict'

const childProcess = require('child_process')
const vnu = require('vnu-jar')

childProcess.exec('java -version', function (error) {
  if (error) {
    console.error('Skipping HTML lint test; Java is missing.')
    return
  }

  const ignores = [
    'Attribute “autocomplete” is only allowed when the input type is “color”, “date”, “datetime-local”, “email”, “hidden”, “month”, “number”, “password”, “range”, “search”, “tel”, “text”, “time”, “url”, or “week”.',
    'Attribute “autocomplete” not allowed on element “button” at this point.',
    'Attribute “title” not allowed on element “circle” at this point.',
    'Bad value “tablist” for attribute “role” on element “nav”.',
    'Element “img” is missing required attribute “src”.',
    'Element “legend” not allowed as child of element “div” in this context.*'
  ].join('|')

  const args = [
    '-jar',
    vnu,
    '--asciiquotes',
    '--errors-only',
    '--skip-non-html',
    `--filterpattern "${ignores}"`,
    '_gh_pages/',
    'js/tests/'
  ]

  return childProcess.spawn('java', args, {
    shell: true,
    stdio: 'inherit'
  })
  .on('exit', process.exit)
})
