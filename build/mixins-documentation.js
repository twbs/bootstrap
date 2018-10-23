'use strict'

const fs = require('fs')
const readLine = require('readline')
const sh = require('shelljs')
const Stream = require('stream')

const stylelintLineRegex = /\s*?\/\/\s?stylelint.*/

let mixinName
let mixin
let mixinDocumentation = ''
let inMixin = false
let output = ''

sh.config.fatal = true

// Find all files in mixins folder; returns Array
const scss = sh.find('./scss/mixins/**/*.scss')

scss.forEach((file) => {
  const inStream = fs.createReadStream(file)
  const OutStream = new Stream()
  const rl = readLine.createInterface(inStream, OutStream)

  // Loop through all lines
  rl.on('line', (line) => {
    if (!inMixin) {
      // Add documentation
      if (line.startsWith('//')) {
        // Ignore stylelint comments
        if (!stylelintLineRegex.test(line)) {
          mixinDocumentation += `${line.slice(2).trim()}\n`
        }
      } else if (line === '') {
        // Clear documentation
        mixinDocumentation = ''
      } else if (line.startsWith('@mixin ')) {
        if (line.includes('(')) {
          // If mixin has parameters
          mixinName = line.slice(6, line.indexOf('('))
        } else {
          // If mixin has no parameters
          mixinName = line.slice(6, -2)
        }
        inMixin = true
        mixin = `${line}\n`
      }
    } else if (!stylelintLineRegex.test(line)) {
      mixin += `${line.replace(stylelintLineRegex, '')}\n`

      // End of the mixin:
      if (line === '}') {
        output += `## ${mixinName.trim()}\n\n`
        // slice to remove leading ./
        output += `<p class="small">File: <code>${file.slice(2)}</code></p>\n\n`
        if (mixinDocumentation !== '') {
          mixinDocumentation = `${mixinDocumentation.replace(/(\bhttps?:\/\/\S+)/g, '[$1]($1)')}\n`
          output += `${mixinDocumentation}\n\n`
        }
        output += `\`\`\`scss\n${mixin}\`\`\`\n\n`
        inMixin = false
        mixinDocumentation = ''
      }
    }
  })

  rl.on('close', () => {
    // Output after each file, and clear output before reading a new file
    console.log(output)
    output = ''
  })
})
