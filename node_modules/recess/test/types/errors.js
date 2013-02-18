var assert = require('assert')
  , colors = require('colors')
  , RECESS = require('../../lib');

//error
!function () {

  RECESS('./foo.less', function (err, instance) {
    assert.ok(err.length == 1)
    assert.ok(/Error:/.test(err[0].toString()))
    assert.ok(!!instance)
	console.log("✓ erroring".green)
  })

}()