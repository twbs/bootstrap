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

childProcess.exec('java -version', (error, stdout, stderr) => {
  if (error) {
    console.error('Skipping HTML lint test; Java is missing.')
    return
  }

  const is32bitJava = !stderr.match(/64-Bit/)

  // vnu-jar accepts multiple ignores joined with a `|`
  const ignores = [
    // "autocomplete" is included in <button> and checkboxes and radio <input>s due to
    // Firefox's non-standard autocomplete behavior - see https://bugzilla.mozilla.org/show_bug.cgi?id=654072
    'Attribute “autocomplete” is only allowed when the input type is “color”, “date”, “datetime-local”, “email”, “hidden”, “month”, “number”, “password”, “range”, “search”, “tel”, “text”, “time”, “url”, or “week”.',
    'Attribute “autocomplete” not allowed on element “button” at this point.',
    'Attribute “title” not allowed on element “circle” at this point.',
    'Bad value “tablist” for attribute “role” on element “nav”.',
    // We use holder.js with `data-src` and no `src`; we could work around this, not sure it's worth it.
    'Element “img” is missing required attribute “src”.',
    // Markup used in Components > Forms > Layout > Form grid > Horizontal form is currently invalid,
    // but used this way due to lack of support for flexbox layout on <fieldset> element in most browsers
    'Element “legend” not allowed as child of element “div” in this context.*',
    'The “datetime-local” input type is not supported in all browsers. Please be sure to test, and consider using a polyfill.',
    // The next one we are using it because IE11 doesn't recognise <main>.
    // So, redundant for modern browsers, but not invalid.
    'The “main” role is unnecessary for element “main”.'
  ].join('|')

  const args = [
    '-jar',
    vnu,
    '--asciiquotes',
    '--skip-non-html',
    '--Werror',
    `--filterpattern "${ignores}"`,
    '_gh_pages/',
    'js/tests/'
  ]

  // For the 32-bit Java we need to pass `-Xss512k`
  if (is32bitJava) {
    args.splice(0, 0, '-Xss512k')
  }

  return childProcess.spawn('java', args, {
    shell: true,
    stdio: 'inherit'
  })
  .on('exit', process.exit)
})
