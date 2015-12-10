/*
 * grunt-contrib-qunit
 * http://gruntjs.com/
 *
 * Copyright (c) 2014 "Cowboy" Ben Alman, contributors
 * Licensed under the MIT license.
 */

(function () {
  'use strict';

  // Don't re-order tests.
  QUnit.config.reorder = false
  // Run tests serially, not in parallel.
  QUnit.config.autorun = false

  // Send messages to the parent PhantomJS process via alert! Good times!!
  function sendMessage() {
    var args = [].slice.call(arguments)
    alert(JSON.stringify(args))
  }

  // These methods connect QUnit to PhantomJS.
  QUnit.log(function (obj) {
    // What is this I don’t even
    if (obj.message === '[object Object], undefined:undefined') { return }

    // Parse some stuff before sending it.
    var actual
    var expected
    if (!obj.result) {
      // Dumping large objects can be very slow, and the dump isn't used for
      // passing tests, so only dump if the test failed.
      actual = QUnit.dump.parse(obj.actual)
      expected = QUnit.dump.parse(obj.expected)
    }
    // Send it.
    sendMessage('qunit.log', obj.result, actual, expected, obj.message, obj.source)
  })

  QUnit.testStart(function (obj) {
    sendMessage('qunit.testStart', obj.name)
  })

  QUnit.testDone(function (obj) {
    sendMessage('qunit.testDone', obj.name, obj.failed, obj.passed, obj.total, obj.duration)
  })

  QUnit.moduleStart(function (obj) {
    sendMessage('qunit.moduleStart', obj.name)
  })

  QUnit.moduleDone(function (obj) {
    if (obj.failed === 0) {
      console.log('\r\u221A All tests passed in "' + obj.name + '" module')
    } else {
      console.log('\u00D7 ' + obj.failed + ' tests failed in "' + obj.name + '" module')
    }
    sendMessage('qunit.moduleDone', obj.name, obj.failed, obj.passed, obj.total)
  })

  QUnit.begin(function () {
    sendMessage('qunit.begin')
    console.log('\n\nStarting test suite')
    console.log('================================================\n')
  })

  QUnit.done(function (obj) {
    sendMessage('qunit.done', obj.failed, obj.passed, obj.total, obj.runtime)
  })

}())


// bind polyfill
// shoutout mdn: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Polyfill

if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1)
    var fToBind = this
    var FNOP    = function () {}
    var fBound  = function () {
      return fToBind.apply(this instanceof FNOP ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)))
    }

    if (this.prototype) {
      // native functions don't have a prototype
      FNOP.prototype = this.prototype
    }
    fBound.prototype = new FNOP()

    return fBound
  }
}
