#!/usr/bin/env node

/*!
 * Script to find unused Sass variables.
 *
 * Copyright 2017-2018 The Bootstrap Authors
 * Copyright 2017-2018 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

'use strict'

const fs = require('fs')
const path = require('path')
const glob = require('glob')

// Blame TC39... https://github.com/benjamingr/RegExp.escape/issues/37
function regExpQuote(str) {
  return str.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&')
}

let globalSuccess = true

function findUnusedVars(dir) {
  if (!(fs.existsSync(dir) && fs.statSync(dir).isDirectory())) {
    console.log(`"${dir}": Not a valid directory!`)
    process.exit(1)
  }

  console.log(`Finding unused variables in "${dir}"...`)

  // A variable to handle success/failure message in this function
  let unusedVarsFound = false

  // Array of all Sass files' content
  const sassFiles = glob.sync(path.join(dir, '**/*.scss'))
  // String of all Sass files' content
  let sassFilesString = ''

  sassFiles.forEach((file) => {
    sassFilesString += fs.readFileSync(file, 'utf8')
  })

  // Array of all Sass variables
  const variables = sassFilesString.match(/(^\$[a-zA-Z0-9_-]+[^:])/gm)

  console.log(`Found ${variables.length} total variables.`)

  // Loop through each variable
  variables.forEach((variable) => {
    const re = new RegExp(regExpQuote(variable), 'g')
    const count = (sassFilesString.match(re) || []).length

    if (count === 1) {
      console.log(`Variable "${variable}" is not being used.`)
      unusedVarsFound = true
      globalSuccess = false
    }
  })

  if (unusedVarsFound === false) {
    console.log(`No unused variables found in "${dir}".`)
  }
}

function main(args) {
  if (args.length < 1) {
    console.log('Wrong arguments!')
    console.log('Usage: lint-vars.js folder [, folder2...]')
    process.exit(1)
  }

  args.forEach((arg) => {
    findUnusedVars(arg)
  })

  if (globalSuccess === false) {
    process.exit(1)
  }
}

// The first and second args are: path/to/node script.js
main(process.argv.slice(2))
