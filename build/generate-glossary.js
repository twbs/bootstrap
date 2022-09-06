#!/usr/bin/env node

/*!
 * Script to update our glossary semi-automatically based on bootstrap.css.
 * Copyright 2017-2022 The Bootstrap Authors
 * Copyright 2017-2022 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 */

'use strict'

const fs = require('fs')

fs.readFile('../dist/css/bootstrap.css', 'utf8', (error, data) => {
  if (error) {
    throw error
  }

  // TODO: bootstrap.css should be stripped of its comments to avoid having .map and other elements in the array

  // TODO: previous re was /\.[a-zA-Z]([0-9a-zA-Z]*-)*[0-9a-zA-Z]*/gi, optimized
  const re = /\.[a-z]([\da-z]*-)*[\da-z]*/gi

  const matches = [...data.matchAll(re)]

  // Array.from will build an array with just the matching strings
  // .sort() will sort those matching strings in the array
  // Array.from(new Set(...)) will remove the duplicate entries
  const results = Array.from(new Set(Array.from(matches, m => m[0]).sort()))

  let newContent = ''

  for (const result of results) {
    newContent += result + ':\r\n'
  }

  // Create a temp file containing all classes names as keys and empty values
  fs.writeFile('../site/static/docs/5.2/assets/data/glossary.data.temp', newContent, error => {
    if (error) {
      throw error
    }
  })

  // Compare what's inside our glossary.data and the temp glossary to:
  // - remove in glossary.data what doesn't exist anymore
  // - add the keys in glossary.data that should be completed with the corresponding links manually
  fs.readFile('../site/static/docs/5.2/assets/data/glossary.data', 'utf8', (error, data) => {
    if (error) {
      throw error
    }

    const newContentSplit = newContent.split('\r\n')
    const finalContentArray = []

    // Find all elements that are already in our glossary
    // Remove elements that are not in the temp glossary
    for (const d of data.split('\r\n')) {
      const found = newContentSplit.find(elt => elt.split(':')[0] === d.split(':')[0])
      if (found) {
        // finalContent += d + '\r\n'
        finalContentArray.push(d + '\r\n')
      }
    }

    // Add elements that are new in the temp glossary
    for (const d of newContentSplit) {
      // Avoid adding empty lines
      if (d) {
        const found = data.split('\r\n').find(elt => elt.split(':')[0] === d.split(':')[0])
        if (!found) {
          // finalContent += d + '\r\n'
          finalContentArray.push(d + '\r\n')
        }
      }
    }

    fs.writeFile('../site/static/docs/5.2/assets/data/glossary.data', finalContentArray.sort().join(''), { flag: 'w' }, error => {
      if (error) {
        throw error
      }
    })

    fs.unlink('../site/static/docs/5.2/assets/data/glossary.data.temp', error => {
      if (error) {
        throw error
      }
    })
  })
})
