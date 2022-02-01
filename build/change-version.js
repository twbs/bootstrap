#!/usr/bin/env node

/*!
 * Script to update version number references in the project.
 * Copyright 2017-2022 The Bootstrap Authors
 * Copyright 2017-2022 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 */

'use strict'

const fs = require('fs').promises
const path = require('path')
const globby = require('globby')

const VERBOSE = process.argv.includes('--verbose')
const DRY_RUN = process.argv.includes('--dry') || process.argv.includes('--dry-run')

// These are the filetypes we only care about replacing the version
const GLOB = [
  '**/*.{css,html,js,json,md,scss,txt,yml}'
]
const GLOBBY_OPTIONS = {
  cwd: path.join(__dirname, '..'),
  gitignore: true
}

// Avoid modifying documentation content, **/dist files and dependencies in package*.json files matching the newVersion
const EXCLUDE_FILES_PATTERN = /^(site\/content\/docs\/|package\.json|package-lock\.json|(.*\/)?dist\/)/

// Blame TC39... https://github.com/benjamingr/RegExp.escape/issues/37
function regExpQuote(string) {
  return string.replace(/[$()*+-.?[\\\]^{|}]/g, '\\$&')
}

function regExpQuoteReplacement(string) {
  return string.replace(/\$/g, '$$')
}

async function replaceRecursively(file, oldVersion, newVersion, limitNumberOfReplacements = 0) {
  const originalString = await fs.readFile(file, 'utf8')
  let newString = originalString

  if (0 < limitNumberOfReplacements) {
    for (var i = 0 ; i < limitNumberOfReplacements ; i++) {
      newString = newString.replace(oldVersion, newVersion)
    }
  } else {
    newString = newString.replace(new RegExp(regExpQuote(oldVersion), 'g'), regExpQuoteReplacement(newVersion))
  }

  // No need to move any further if the strings are identical
  if (originalString === newString) {
    return
  }

  if (VERBOSE) {
    console.log(`FILE: ${file}`)
  }

  if (DRY_RUN) {
    return
  }

  await fs.writeFile(file, newString, 'utf8')
}

async function main(args) {
  let [oldVersion, newVersion] = args

  if (!oldVersion || !newVersion) {
    console.error('USAGE: change-version old_version new_version [--verbose] [--dry[-run]]')
    console.error('Got arguments:', args)
    process.exit(1)
  }

  // Strip any leading `v` from arguments because otherwise we will end up with duplicate `v`s
  [oldVersion, newVersion] = [oldVersion, newVersion].map(arg => arg.startsWith('v') ? arg.slice(1) : arg)

  try {
    const allFiles = await globby(GLOB, GLOBBY_OPTIONS)
    const filteredFiles = allFiles.filter(file => !EXCLUDE_FILES_PATTERN.test(file))

    // Modify specifically package*.json files to avoid modifying other dependencies versions
    const oldVersionJSONString = `"version": "${oldVersion}"`
    const newVersionJSONString = `"version": "${newVersion}"`

    await replaceRecursively('package.json', oldVersionJSONString, newVersionJSONString, 1);
    await replaceRecursively('package-lock.json', oldVersionJSONString, newVersionJSONString, 2);

    await Promise.all(filteredFiles.map(file => replaceRecursively(file, oldVersion, newVersion)))
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

main(process.argv.slice(2))
