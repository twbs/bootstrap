'use strict'

const fs = require('fs')
const readLine = require('readline')
const Stream = require('stream')
const execFile = require('child_process').execFile
const stylelintLineRegex = /^\s*?\/\/\s?stylelint/
const stylelintCommentToRemoveRegex = /\s*?\/\/\s?stylelint.*/

let mixinName
let mixin
let mixinDocumentation = ''
let inMixin = false
let output = ''

// Find all files in mixins folder
execFile('find', ['./scss/mixins'], (err, stdout) => {
  if (err) {
    console.error(err)
  }

  const fileList = stdout.split('\n')

  // Loop through all files in mixin folders
  fileList.forEach((file) => {
    // Only process .scss files
    if (file.endsWith('.scss')) {
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
          mixin += `${line.replace(stylelintCommentToRemoveRegex, '')}\n`

          // End of the mixin:
          if (line === '}') {
            output += `## ${mixinName}\n\n`
            // slice to remove leading ./
            output += `<p class="small">File: <code>${file.slice(2)}</code></p>\n\n`
            if (mixinDocumentation !== '') {
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
    }
  })
})
