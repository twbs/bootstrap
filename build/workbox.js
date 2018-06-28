/*!
 * Script to generate our docs service worker.
 * Copyright 2017-2018 The Bootstrap Authors
 * Copyright 2017-2018 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

'use strict'

const fs = require('fs')
const swBuild = require('workbox-build')
const config = require('./workbox.config.json')

const buildPrefix = '_gh_pages/'

const updateUrl = (manifestEntries) => {
  const manifest = manifestEntries.map((entry) => {
    if (entry.url.startsWith(buildPrefix)) {
      const regex = new RegExp(buildPrefix, 'g')
      entry.url = entry.url.replace(regex, '')
    }
    return entry
  })
  return {
    manifest,
    warnings: []
  }
}

config.manifestTransforms = [updateUrl]

swBuild.injectManifest(config).then(({
  count,
  size
}) => {
  const wbSwRegex = /{workboxVersion}/g
  fs.readFile(config.swDest, 'utf8', (err, data) => {
    if (err) {
      throw err
    }
    swBuild.copyWorkboxLibraries(`${buildPrefix}assets/js/vendor/workbox`).then((wbPath) => {
      const swFileContents = data.replace(wbSwRegex, `${wbPath}`)
      fs.writeFile(config.swDest, swFileContents, () => {
        console.log(`Pre-cache Manifest generated. Pre-cached ${count} files, totalling ${size} bytes.`)
      })
    })
  })
}).catch((error) => {
  console.error(`Something went wrong: ${error}`)
})
