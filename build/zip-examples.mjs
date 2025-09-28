#!/usr/bin/env node

/*!
 * Script to create the built examples zip archive;
 * requires the `zip` command to be present!
 * Copyright 2020-2025 The Bootstrap Authors
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sh from 'shelljs'
import { format } from 'prettier'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const pkgJson = path.join(__dirname, '../package.json')
const pkg = JSON.parse(await fs.readFile(pkgJson, 'utf8'))

const versionShort = pkg.config.version_short
const distFolder = `bootstrap-${pkg.version}-examples`
const rootDocsDir = '_site'
const docsDir = `${rootDocsDir}/docs/${versionShort}/`

// these are the files we need in the examples
const cssFiles = [
  'bootstrap.min.css',
  'bootstrap.min.css.map',
  'bootstrap.rtl.min.css',
  'bootstrap.rtl.min.css.map'
]
const jsFiles = [
  'bootstrap.bundle.min.js',
  'bootstrap.bundle.min.js.map'
]
const imgFiles = [
  'bootstrap-logo.svg',
  'bootstrap-logo-white.svg'
]
const staticJsFiles = [
  'color-modes.js'
]

sh.config.fatal = true

if (!sh.test('-d', rootDocsDir)) {
  throw new Error(`The "${rootDocsDir}" folder does not exist, did you forget building the docs?`)
}

// switch to the root dir
sh.cd(path.join(__dirname, '..'))

// remove any previously created folder/zip with the same name
sh.rm('-rf', [distFolder, `${distFolder}.zip`])

// create any folders so that `cp` works
sh.mkdir('-p', [
  distFolder,
  `${distFolder}/assets/brand/`,
  `${distFolder}/assets/dist/css/`,
  `${distFolder}/assets/dist/js/`,
  `${distFolder}/assets/js/`
])

sh.cp('-Rf', `${docsDir}/examples/*`, distFolder)

for (const file of cssFiles) {
  sh.cp('-f', `${docsDir}/dist/css/${file}`, `${distFolder}/assets/dist/css/`)
}

for (const file of jsFiles) {
  sh.cp('-f', `${docsDir}/dist/js/${file}`, `${distFolder}/assets/dist/js/`)
}

for (const file of imgFiles) {
  sh.cp('-f', `${docsDir}/assets/brand/${file}`, `${distFolder}/assets/brand/`)
}

for (const file of staticJsFiles) {
  sh.cp('-f', `${docsDir}/assets/js/${file}`, `${distFolder}/assets/js/`)
}

sh.rm(`${distFolder}/index.html`)

// get all examples' HTML files
const htmlFiles = sh.find(`${distFolder}/**/*.html`)

const formatPromises = htmlFiles.map(async file => {
  const fileContents = sh.cat(file)
    .toString()
    .replace(new RegExp(`"/docs/${versionShort}/`, 'g'), '"../')
    .replace(/"..\/dist\//g, '"../assets/dist/')
    .replace(/(<link href="\.\.\/[^"]*"[^>]*) integrity="[^"]*"/g, '$1')
    .replace(/<link[^>]*href="\.\.\/assets\/img\/favicons\/[^"]*"[^>]*>/g, '')
    .replace(/(<script src="\.\.\/[^"]*"[^>]*) integrity="[^"]*"/g, '$1')

  let formattedHTML
  try {
    formattedHTML = await format(fileContents, {
      parser: 'html',
      filepath: file
    })
  } catch (error) {
    console.error(`\nError formatting ${file}:`)
    console.error(`Message: ${error.message}`)
    console.error('\nSkipping formatting for this file...\n')
    formattedHTML = fileContents
  }

  new sh.ShellString(formattedHTML).to(file)
})

await Promise.all(formatPromises)

// create the zip file
sh.exec(`zip -qr9 "${distFolder}.zip" "${distFolder}"`)

// remove the folder we created
sh.rm('-rf', distFolder)
