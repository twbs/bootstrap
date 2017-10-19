/*!
 * Script to run our Sauce Labs tests.
 * Copyright 2017 The Bootstrap Authors
 * Copyright 2017 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

/*
Docs: https://wiki.saucelabs.com/display/DOCS/Platform+Configurator
Mac Opera is not currently supported by Sauce Labs
Win Opera 15+ is not currently supported by Sauce Labs
iOS Chrome is not currently supported by Sauce Labs
*/

'use strict'

const path = require('path')
const JSUnitSaucelabs = require('jsunitsaucelabs')

const jsUnitSaucelabs = new JSUnitSaucelabs({
  username: process.env.SAUCE_USERNAME,
  password: process.env.SAUCE_ACCESS_KEY,
  build: process.env.TRAVIS_JOB_ID
})

const testURL = 'http://localhost:3000/js/tests/index.html?hidepassed'
const browsersFile = require(path.resolve(__dirname, './sauce_browsers.json'))
let jobsDone = 0
let jobsSucceeded = 0

const waitingCallback = (error, body, id) => {
  if (error) {
    console.error(error)
    process.exit(1)
  }

  if (typeof body !== 'undefined') {
    if (!body.completed) {
      setTimeout(() => {
        jsUnitSaucelabs.getStatus(id, (error, body) => {
          waitingCallback(error, body, id)
        })
      }, 2000)
    } else {
      const test = body['js tests'][0]
      let passed = false
      let errorStr = false

      if (test.result !== null) {
        if (typeof test.result === 'string' && test.result === 'Test exceeded maximum duration') {
          errorStr = test.result
        } else {
          passed = test.result.total === test.result.passed
        }
      }

      console.log(`Tested ${testURL}`)
      console.log(`Platform: ${test.platform.join(', ')}`)
      console.log(`Passed: ${passed.toString()}`)
      console.log(`URL: ${test.url}\n`)
      if (errorStr) {
        console.error(errorStr)
      }

      if (passed) {
        jobsSucceeded++
      }
      jobsDone++

      // Exit
      if (jobsDone === browsersFile.length - 1) {
        jsUnitSaucelabs.stop()
        if (jobsDone > jobsSucceeded) {
          const failedTest = jobsDone - jobsSucceeded
          throw new Error(`Some test(s) failed (${failedTest})`)
        }

        console.log('All tests passed')
        process.exit(0)
      }
    }
  }
}

jsUnitSaucelabs.on('tunnelCreated', () => {
  browsersFile.forEach((tmpBrowser) => {
    const browsersPlatform = typeof tmpBrowser.platform === 'undefined' ? tmpBrowser.platformName : tmpBrowser.platform
    const browsersArray = [browsersPlatform, tmpBrowser.browserName, tmpBrowser.version]

    jsUnitSaucelabs.start([browsersArray], testURL, 'qunit', (error, success) => {
      if (typeof success !== 'undefined') {
        const taskIds = success['js tests']

        if (!taskIds || !taskIds.length) {
          throw new Error('Error starting tests through Sauce Labs API')
        }

        taskIds.forEach((id) => {
          jsUnitSaucelabs.getStatus(id, (error, body) => {
            waitingCallback(error, body, id)
          })
        })
      } else {
        console.error(error)
      }
    })
  })
})

jsUnitSaucelabs.initTunnel()
