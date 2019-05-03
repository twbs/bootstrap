// Polyfills for our unit tests
(function () {
  'use strict'

  // Event constructor shim
  if (!window.Event || typeof window.Event !== 'function') {
    var origEvent = window.Event
    window.Event = function (inType, params) {
      params = params || {}
      var e = document.createEvent('Event')
      e.initEvent(inType, Boolean(params.bubbles), Boolean(params.cancelable))
      return e
    }

    window.Event.prototype = origEvent.prototype
  }

  if (typeof window.CustomEvent !== 'function') {
    window.CustomEvent = function (event, params) {
      params = params || { bubbles: false, cancelable: false, detail: null }
      var evt = document.createEvent('CustomEvent')
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
      return evt
    }

    CustomEvent.prototype = window.Event.prototype
  }
})()
