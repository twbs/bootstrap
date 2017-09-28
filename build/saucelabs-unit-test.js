const JSUnitSaucelabs = require('jsunitsaucelabs')

var jsUnitSaucelabs = new JSUnitSaucelabs({
  username: process.env.SAUCE_USERNAME,
  password: process.env.SAUCE_ACCESS_KEY
})


// TODO : get all the browsers in sauce_browsers.yml

var testURL = 'http://localhost:3000/js/tests/index.html?hidepassed'
jsUnitSaucelabs.start([
  ['Windows 8', 'internet explorer', '10']
], testURL, 'qunit', function (error, success) {
  if (typeof success !== 'undefined') {
    var taskIds = success['js tests']
    if (!taskIds || !taskIds.length) {
      throw new Error('Error starting tests through SauceLabs API')
    }

    var waitingCallback = function (error, success) {
      if (error) {
        console.error(error)
        return
      }

      if (typeof success !== 'undefined') {
        if (!success.completed) {
          jsUnitSaucelabs.getStatus(taskIds[0], waitingCallback)
        } else {
          var test = success['js tests'][0]
          var passed = false
          if (test.result !== null) {
            passed = test.result.total === test.result.passed
          }
          console.log('Tested ' + testURL)
          console.log('Platform: ' + test.platform.join(','))
          console.log('Passed: ' + passed.toString())
          console.log('Url ' + test.url)
        }
      }
    }

    taskIds.forEach(function (id) {
      jsUnitSaucelabs.getStatus(id, waitingCallback)
    })
  }
})
