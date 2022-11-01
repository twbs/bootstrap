/* eslint-env node */

const runnerPath = require('node:path').join(__dirname, 'runner')

require.extensions['.scss'] = function (module, filename) {
  return module._compile(`
    const runner = require('${runnerPath}')
    runner('${filename}',{describe, it})
    `, filename)
}
