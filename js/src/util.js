/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-alpha.3): util.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Util = (($) => {


  /**
   * ------------------------------------------------------------------------
   * Private TransitionEnd Helpers
   * ------------------------------------------------------------------------
   */

  let transition = false

  const MAX_UID = 1000000

  const TransitionEndEvent = {
    WebkitTransition : 'webkitTransitionEnd',
    MozTransition    : 'transitionend',
    OTransition      : 'oTransitionEnd otransitionend',
    transition       : 'transitionend'
  }

  // shoutout AngusCroll (https://goo.gl/pxwQGp)
  function toType(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
  }

  function isElement(obj) {
    return (obj[0] || obj).nodeType
  }

  function getSpecialTransitionEndEvent() {
    return {
      bindType: transition.end,
      delegateType: transition.end,
      handle(event) {
        if ($(event.target).is(this)) {
          return event.handleObj.handler.apply(this, arguments) // eslint-disable-line prefer-rest-params
        }
        return undefined
      }
    }
  }

  function transitionEndTest() {
    if (window.QUnit) {
      return false
    }

    let el = document.createElement('bootstrap')

    for (let name in TransitionEndEvent) {
      if (el.style[name] !== undefined) {
        return { end: TransitionEndEvent[name] }
      }
    }

    return false
  }

  function transitionEndEmulator(duration) {
    let called = false

    $(this).one(Util.TRANSITION_END, () => {
      called = true
    })

    setTimeout(() => {
      if (!called) {
        Util.triggerTransitionEnd(this)
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
      do {
        /* eslint-disable no-bitwise */
        prefix += ~~(Math.random() * MAX_UID) // "~~" acts like a faster Math.floor() here
        /* eslint-enable no-bitwise */
      } while (document.getElementById(prefix))
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

    triggerTransitionEnd(element) {
      $(element).trigger(transition.end)
    },

    supportsTransitionEnd() {
      return Boolean(transition)
    },

    typeCheckConfig(componentName, config, configTypes) {
      for (let property in configTypes) {
        if (configTypes.hasOwnProperty(property)) {
          let expectedTypes = configTypes[property]
          let value         = config[property]
          let valueType

          if (value && isElement(value)) {
            valueType = 'element'
          } else {
            valueType = toType(value)
          }

          if (!new RegExp(expectedTypes).test(valueType)) {
            throw new Error(
              `${componentName.toUpperCase()}: ` +
              `Option "${property}" provided type "${valueType}" ` +
              `but expected type "${expectedTypes}".`)
          }
        }
      }
    }
  }

  setTransitionEndSupport()

  return Util

})(jQuery)

export default Util
