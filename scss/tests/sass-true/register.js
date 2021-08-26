'use strict'

const path = require('node:path')

const runnerPath = path.join(__dirname, 'runner').replace(/\\/g, '/')

// eslint-disable-next-line n/no-deprecated-api
require.extensions['.scss'] = (module, filename) => {
  const normalizedFilename = filename.replace(/\\/g, '/')

  return module._compile(`
    const runner = require('${runnerPath}')
    runner('${normalizedFilename}', { describe, it })
    `, filename)
}
