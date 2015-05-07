/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0): util.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Util = (() => {


  /**
   * ------------------------------------------------------------------------
   * Private TransitionEnd Helpers
   * ------------------------------------------------------------------------
   */

  let transition = false

  const TransitionEndEvent = {
    WebkitTransition : 'webkitTransitionEnd',
    MozTransition    : 'transitionend',
    OTransition      : 'oTransitionEnd otransitionend',
    transition       : 'transitionend'
  }

  function getSpecialTransitionEndEvent() {
    return {
      bindType: transition.end,
      delegateType: transition.end,
      handle: function (event) {
        if ($(event.target).is(this)) {
          return event.handleObj.handler.apply(this, arguments)
        }
      }
    }
  }

  function transitionEndTest() {
    if (window.QUnit) {
      return false
    }

    let el = document.createElement('bootstrap')

    for (var name in TransitionEndEvent) {
      if (el.style[name] !== undefined) {
        return { end: TransitionEndEvent[name] }
      }
    }

    return false
  }

  function transitionEndEmulator(duration) {
    let called = false

    $(this).one(Util.TRANSITION_END, function () {
      called = true
    })

    setTimeout(() => {
      if (!called) {
        $(this).trigger(transition.end)
      }
    }, duration)

    return this
  }

  function setTransitionEndSupport() {
    transition = transitionEndTest()

    $.fn.emulateTransitionEnd = transitionEndEmulator

    if (Util.supportsTransitionEnd()) {
      $.event.special[Util.TRANSITION_END] = getSpecialTransitionEndEvent()
    }
  }


  /**
   * --------------------------------------------------------------------------
   * Public Util Api
   * --------------------------------------------------------------------------
   */

  let Util = {

    TRANSITION_END: 'bsTransitionEnd',

    getUID(prefix) {
      do prefix += ~~(Math.random() * 1000000)
      while (document.getElementById(prefix))
      return prefix
    },

    getSelectorFromElement(element) {
      let selector = element.getAttribute('data-target')

      if (!selector) {
        selector = element.getAttribute('href') || ''
        selector = /^#[a-z]/i.test(selector) ? selector : null
      }

      return selector
    },

    reflow(element) {
      new Function('bs', 'return bs')(element.offsetHeight)
    },

    supportsTransitionEnd() {
      return !!transition
    }

  }

  setTransitionEndSupport()

  return Util

})()

export default Util
