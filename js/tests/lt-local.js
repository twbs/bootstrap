/* eslint-env node */
/* eslint-disable no-console */

'use strict'

const process = require('node:process')
const lambdaTunnel = require('@lambdatest/node-tunnel')

const tunnelInstance = new lambdaTunnel() // eslint-disable-line new-cap
const tunnelArguments = {
  user: process.env.LT_USERNAME,
  key: process.env.LT_ACCESS_KEY,
  tunnelName: process.env.LT_TUNNEL_NAME || 'jasmine',
  logFile: 'local.log'
}

if (process.env.LAMBDATEST === 'true') {
  // eslint-disable-next-line unicorn/prefer-top-level-await
  (async () => {
    try {
      await tunnelInstance.start(tunnelArguments)
      await new Promise(res => {
        setTimeout(res, 5000)
      })
    } catch (error) {
      console.log(error.message)
    }
  })()
}
