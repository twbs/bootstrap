#!/usr/bin/env node

/*!
 * Script to run vnu-jar if Java is available.
 * Copyright 2017-2018 The Bootstrap Authors
 * Copyright 2017-2018 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

'use strict'

const childProcess = require('child_process')
const vnu = require('vnu-jar')

childProcess.exec('java -version', (error, stdout, stderr) => {
  if (error) {
    console.error('Skipping vnu-jar test; Java is missing.')
    return
  }

  const is32bitJava = !stderr.match(/64-Bit/)

  // vnu-jar accepts multiple ignores joined with a `|`.
  // Also note that the ignores are regular expressions.
  const ignores = [
    // "autocomplete" is included in <button> and checkboxes and radio <input>s due to
    // Firefox's non-standard autocomplete behavior - see https://bugzilla.mozilla.org/show_bug.cgi?id=654072
    'Attribute “autocomplete” is only allowed when the input type is.*',
    'Attribute “autocomplete” not allowed on element “button” at this point.',
    // We use holder.js with `data-src` and no `src` to avoid 404 errors;
    // we could work around this, but I'm not sure it's worth it.
    'Element “img” is missing required attribute “src”.',
    // Markup used in Components → Forms → Layout → Form grid → Horizontal form is currently invalid,
    // but used this way due to lack of support for flexbox layout on <fieldset> element in most browsers
    'Element “legend” not allowed as child of element “div” in this context.*',
    // Content → Reboot uses various date/time inputs as a visual example.
    // Documentation does not rely on them being usable.
    'The “date” input type is not supported in all browsers.*',
    'The “time” input type is not supported in all browsers.*',
    // IE11 doesn't recognise <main> / give the element an implicit "main" landmark.
    // Explicit role="main" is redundant for other modern browsers, but still valid.
    'The “main” role is unnecessary for element “main”.',
    // Ignore the wrong lanuage code warnings for now; they happen randomly.
    'This document appears to be written in.*'
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
