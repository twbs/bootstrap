#!/usr/bin/env node

/*!
 * Script to create the built examples zip archive;
 * requires the `zip` command to be present!
 * Copyright 2020 The Bootstrap Authors
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 */

'use strict'

const path = require('path')
const sh = require('shelljs')

const { version, version_short: versionShort } = require('../package.json')

const folderName = `bootstrap-${version}-examples`

sh.config.fatal = true

if (!sh.test('-d', '_gh_pages')) {
  throw new Error('The "_gh_pages" folder does not exist, did you forget building the docs?')
}

// switch to the root dir
sh.cd(path.join(__dirname, '..'))

// remove any previously created folder with the same name
sh.rm('-rf', folderName)
// create any folders so that `cp` works
sh.mkdir('-p', folderName)
sh.mkdir('-p', `${folderName}/assets/brand/`)

sh.cp('-Rf', `_gh_pages/docs/${versionShort}/examples/*`, folderName)
sh.cp('-Rf', `_gh_pages/docs/${versionShort}/dist/`, `${folderName}/assets/`)
// also copy the two brand images we use in the examples
sh.cp('-f', [
  `_gh_pages/docs/${versionShort}/assets/brand/bootstrap-logo.svg`,
  `_gh_pages/docs/${versionShort}/assets/brand/bootstrap-logo-white.svg`
], `${folderName}/assets/brand/`)
sh.rm(`${folderName}/index.html`)

// get all examples' HTML files
sh.find(`${folderName}/**/*.html`).forEach(file => {
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
sh.exec(`zip -r9 "${folderName}.zip" "${folderName}"`, { fatal: true })

// remove the folder we created
sh.rm('-rf', folderName)
