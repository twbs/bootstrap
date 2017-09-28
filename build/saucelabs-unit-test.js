'use strict'

const path = require('path')
const JSUnitSaucelabs = require('jsunitsaucelabs')

// Docs: https://wiki.saucelabs.com/display/DOCS/Platform+Configurator
// Mac Opera is not currently supported by Sauce Labs
// Win Opera 15+ is not currently supported by Sauce Labs
// iOS Chrome is not currently supported by Sauce Labs

const jsUnitSaucelabs = new JSUnitSaucelabs({
  username: process.env.SAUCE_USERNAME,
  password: process.env.SAUCE_ACCESS_KEY,
  build:    process.env.TRAVIS_JOB_ID
})

const testURL      = 'http://localhost:3000/js/tests/index.html?hidepassed'
const browsersFile = require(path.resolve(__dirname, './sauce_browsers.json'))
let jobsDone       = 0
let jobsSuccess    = 0

const waitingCallback = (error, body, id) => {
  if (error) {
    console.error(error)
    process.exit(1)
    return
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

      if (test.result !== null) {
        passed = test.result.total === test.result.passed
      }

      console.log(`Tested ${testURL}`)
      console.log(`Platform: ${test.platform.join(',')}`)
      console.log(`Passed: ${passed.toString()}`)
      console.log(`Url ${test.url} \n`)

      if (passed) {
        jobsSuccess++
      }
      jobsDone++

      // Exit
      if (jobsDone === browsersFile.length - 1) {
        jsUnitSaucelabs.stop()
        process.exit(jobsDone === jobsSuccess ? 0 : 1)
      }
    }
  }
}

jsUnitSaucelabs.on('tunnelCreated', () => {
  browsersFile.forEach((tmpBrowser) => {
    const broPlatform = typeof tmpBrowser.platform === 'undefined' ? tmpBrowser.platformName : tmpBrowser.platform
    const arrayBro    = [broPlatform, tmpBrowser.browserName, tmpBrowser.version]
    jsUnitSaucelabs.start([arrayBro], testURL, 'qunit', (error, success) => {
      if (typeof success !== 'undefined') {
        const taskIds = success['js tests']

        if (!taskIds || !taskIds.length) {
          throw new Error('Error starting tests through SauceLabs API')
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
