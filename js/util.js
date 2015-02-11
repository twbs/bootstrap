/** =======================================================================
 * Bootstrap: util.js v4.0.0
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ========================================================================
 * @fileoverview - Bootstrap's private util helper. Adds private util
 * helpers for things like accesibility and transitions. These methods are
 * shared across all bootstrap plugins.
 * ========================================================================
 */

'use strict';


/**
 * @type {Object}
 */
var Bootstrap = {}


/**
 * @const
 * @type {string}
 */
Bootstrap.TRANSITION_END = 'bsTransitionEnd'


/**
 * @const
 * @type {Object}
 */
Bootstrap.TransitionEndEvent = {
  'WebkitTransition' : 'webkitTransitionEnd',
  'MozTransition'    : 'transitionend',
  'OTransition'      : 'oTransitionEnd otransitionend',
  'transition'       : 'transitionend'
}


/**
 * @param {Function} childConstructor
 * @param {Function} parentConstructor
 */
Bootstrap.inherits = function(childConstructor, parentConstructor) {
  /** @constructor */
  function tempConstructor() {}
  tempConstructor.prototype = parentConstructor.prototype
  childConstructor.prototype = new tempConstructor()
  /** @override */
  childConstructor.prototype.constructor = childConstructor
}


/**
 * @param {Element} element
 * @return {string|null}
 */
Bootstrap.getSelectorFromElement = function (element) {
  var selector = element.getAttribute('data-target')

  if (!selector) {
    selector = element.getAttribute('href') || ''
    selector = /^#[a-z]/i.test(selector) ? selector : null
  }

  return selector
}


/**
 * @param {string} prefix
 * @return {string}
 */
Bootstrap.getUID = function (prefix) {
  do prefix += ~~(Math.random() * 1000000)
  while (document.getElementById(prefix))
  return prefix
}


/**
 * @return {Object}
 */
Bootstrap.getSpecialTransitionEndEvent = function () {
  return {
    bindType: Bootstrap.transition.end,
    delegateType: Bootstrap.transition.end,
    handle: /** @param {jQuery.Event} event */ (function (event) {
      if ($(event.target).is(this)) {
        return event.handleObj.handler.apply(this, arguments)
      }
    })
  }
}


/**
 * @param {Element} element
 */
Bootstrap.reflow = function (element) {
  new Function('bs',"return bs")(element.offsetHeight)
}


/**
 * @return {Object|boolean}
 */
Bootstrap.transitionEndTest = function () {
  if (window['QUnit']) {
    return false
  }

  var el = document.createElement('bootstrap')
  for (var name in Bootstrap.TransitionEndEvent) {
    if (el.style[name] !== undefined) {
      return { end: Bootstrap.TransitionEndEvent[name] }
    }
  }
  return false
}


/**
 * @param {number} duration
 * @this {Element}
 * @return {Object}
 */
Bootstrap.transitionEndEmulator = function (duration) {
  var called = false

  $(this).one(Bootstrap.TRANSITION_END, function () {
    called = true
  })

  var callback = function () {
    if (!called) {
      $(this).trigger(Bootstrap.transition.end)
    }
  }.bind(this)

  setTimeout(callback, duration)

  return this
}


/**
 * ------------------------------------------------------------------------
 * jQuery Interface
 * ------------------------------------------------------------------------
 */

$.fn.emulateTransitionEnd = Bootstrap.transitionEndEmulator

$(function () {
  Bootstrap.transition = Bootstrap.transitionEndTest()

  if (!Bootstrap.transition) {
    return
  }

  $.event.special[Bootstrap.TRANSITION_END] = Bootstrap.getSpecialTransitionEndEvent()
})
