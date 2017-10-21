'use strict'

const fs = require('fs')
const path = require('path')
const swBuild = require('workbox-build')
const config = require('./workbox.config.json')
const buildPrefix = '_gh_pages/'

const workboxSWSrcPath = require.resolve('workbox-sw')
const wbFileName = path.basename(workboxSWSrcPath)
const workboxSWDestPath = buildPrefix + 'assets/js/vendor/' + wbFileName
const workboxSWSrcMapPath = `${workboxSWSrcPath}.map`
const workboxSWDestMapPath = `${workboxSWDestPath}.map`

fs.createReadStream(workboxSWSrcPath).pipe(fs.createWriteStream(workboxSWDestPath))
fs.createReadStream(workboxSWSrcMapPath).pipe(fs.createWriteStream(workboxSWDestMapPath))

const updateUrl = (manifestEntries) => manifestEntries.map((entry) => {
  if (entry.url.startsWith(buildPrefix)) {
    const regex = new RegExp(buildPrefix, 'g')
    entry.url = entry.url.replace(regex, '')
  }
  return entry
})

config.manifestTransforms = [updateUrl]

swBuild.injectManifest(config).then(() => {
  const wbSwRegex = /{fileName}/g
  fs.readFile(config.swDest, 'utf8', (err, data) => {
    if (err) {
      throw err
    }
    const swFileContents = data.replace(wbSwRegex, wbFileName)
    fs.writeFile(config.swDest, swFileContents, () => {
      console.log('Pre-cache Manifest generated.')
    })
  })
})
