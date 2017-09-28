const JSUnitSaucelabs = require('jsunitsaucelabs')

const jsUnitSaucelabs = new JSUnitSaucelabs({
  username: process.env.SAUCE_USERNAME,
  password: process.env.SAUCE_ACCESS_KEY,
  build:    process.env.TRAVIS_JOB_ID
})


// TODO : get all the browsers in sauce_browsers.yml
// Docs: https://wiki.saucelabs.com/display/DOCS/Platform+Configurator
// Mac Opera is not currently supported by Sauce Labs
// Win Opera 15+ is not currently supported by Sauce Labs
// iOS Chrome is not currently supported by Sauce Labs

const testURL = 'http://localhost:3000/js/tests/index.html?hidepassed'

jsUnitSaucelabs.start([
  ['Windows 8', 'internet explorer', '10']
], testURL, 'qunit', (error, success) => {
  if (typeof success !== 'undefined') {
    const taskIds = success['js tests']
    if (!taskIds || !taskIds.length) {
      throw new Error('Error starting tests through SauceLabs API')
    }

    const waitingCallback = (error, success) => {
      if (error) {
        console.error(error)
        return
      }

      if (typeof success !== 'undefined') {
        if (!success.completed) {
          jsUnitSaucelabs.getStatus(taskIds[0], waitingCallback)
        } else {
          const test = success['js tests'][0]
          let passed = false
          if (test.result !== null) {
            passed = test.result.total === test.result.passed
          }
          console.log(`Tested ${testURL}`)
          console.log(`Platform: ${test.platform.join(',')}`)
          console.log(`Passed: ${passed.toString()}`)
          console.log(`Url ${test.url}`)
        }
      }
    }

    taskIds.forEach((id) => {
      jsUnitSaucelabs.getStatus(id, waitingCallback)
    })
  }
})
