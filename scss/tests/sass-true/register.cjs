'use strict'

const path = require('node:path')

const runnerPath = path.join(__dirname, 'runner.cjs').replace(/\\/g, '/')

require.extensions['.scss'] = (module, filename) => {
  const normalizedFilename = filename.replace(/\\/g, '/')

  return module._compile(`
    const runner = require('${runnerPath}')
    runner('${normalizedFilename}', { describe, it })
    `, filename)
}
