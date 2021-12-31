#!/usr/bin/env node

/*!
 * Script to run vnu-jar if Java is available.
 * Copyright 2017-2022 The Bootstrap Authors
 * Copyright 2017-2022 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 */

'use strict'

const { execFile, spawn } = require('child_process')
const vnu = require('vnu-jar')

execFile('java', ['-version'], (error, stdout, stderr) => {
  if (error) {
    console.error('Skipping vnu-jar test; Java is missing.')
    return
  }

  const is32bitJava = !/64-Bit/.test(stderr)

  // vnu-jar accepts multiple ignores joined with a `|`.
  // Also note that the ignores are string regular expressions.
  const ignores = [
    // "autocomplete" is included in <button> and checkboxes and radio <input>s due to
    // Firefox's non-standard autocomplete behavior - see https://bugzilla.mozilla.org/show_bug.cgi?id=654072
    'Attribute “autocomplete” is only allowed when the input type is.*',
    'Attribute “autocomplete” not allowed on element “button” at this point.',
    // Per https://www.w3.org/TR/html-aria/#docconformance having "aria-disabled" on a link is
    // NOT RECOMMENDED, but it's still valid - we explain in the docs that it's not ideal,
    // and offer more robust alternatives, but also need to show a less-than-ideal example
    'An “aria-disabled” attribute whose value is “true” should not be specified on an “a” element that has an “href” attribute.'
  ].join('|')

  const args = [
    '-jar',
    `"${vnu}"`,
    '--asciiquotes',
    '--skip-non-html',
    '--Werror',
    `--filterpattern "${ignores}"`,
    '_site/',
    'js/tests/'
  ]

  // For the 32-bit Java we need to pass `-Xss512k`
  if (is32bitJava) {
    args.splice(0, 0, '-Xss512k')
  }

  return spawn('java', args, {
    shell: true,
    stdio: 'inherit'
  })
    .on('exit', process.exit)
})
