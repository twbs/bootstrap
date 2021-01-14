#!/usr/bin/env node

/*!
 * Script to create the built examples zip archive;
 * requires the `zip` command to be present!
 * Copyright 2020-2021 The Bootstrap Authors
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 */

'use strict'

const path = require('path')
const sh = require('shelljs')

const pkg = require('../package.json')

const versionShort = pkg.config.version_short
const distFolder = `bootstrap-${pkg.version}-examples`
const rootDocsDir = '_gh_pages'
const docsDir = `${rootDocsDir}/docs/${versionShort}/`

// these are the files we need in the examples
const cssFiles = [
  'bootstrap.min.css',
  'bootstrap.min.css.map'
]
const jsFiles = [
  'bootstrap.bundle.min.js',
  'bootstrap.bundle.min.js.map'
]
const imgFiles = [
  'bootstrap-outline.svg',
  'bootstrap-solid.svg'
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
  `${distFolder}/assets/dist/js/`
])

sh.cp('-Rf', `${docsDir}/examples/*`, distFolder)

cssFiles.forEach(file => {
  sh.cp('-f', `${docsDir}/dist/css/${file}`, `${distFolder}/assets/dist/css/`)
})

jsFiles.forEach(file => {
  sh.cp('-f', `${docsDir}/dist/js/${file}`, `${distFolder}/assets/dist/js/`)
})

imgFiles.forEach(file => {
  sh.cp('-f', `${docsDir}/assets/brand/${file}`, `${distFolder}/assets/brand/`)
})

sh.rm(`${distFolder}/index.html`)

// get all examples' HTML files
sh.find(`${distFolder}/**/*.html`).forEach(file => {
  const fileContents = sh.cat(file)
    .toString()
    .replace(new RegExp(`"/docs/${versionShort}/`, 'g'), '"../')
    .replace(/"..\/dist\//g, '"../assets/dist/')
    .replace(/(<link href="\.\.\/.*) integrity=".*>/g, '$1>')
    .replace(/(<script src="\.\.\/.*) integrity=".*>/g, '$1></script>')
    .replace(/( +)<!-- favicons(.|\n)+<style>/i, '    <style>')
  new sh.ShellString(fileContents).to(file)
})

// create the zip file
sh.exec(`zip -r9 "${distFolder}.zip" "${distFolder}"`)

// remove the folder we created
sh.rm('-rf', distFolder)
