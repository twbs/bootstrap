/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.3.1): util.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * ------------------------------------------------------------------------
 * Private TransitionEnd Helpers
 * ------------------------------------------------------------------------
 */

const MAX_UID = 1000000
const MILLISECONDS_MULTIPLIER = 1000

// Shoutout AngusCroll (https://goo.gl/pxwQGp)
function toType(obj) {
  return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase()
}

/**
 * --------------------------------------------------------------------------
 * Public Util Api
 * --------------------------------------------------------------------------
 */

const Util = {
  TRANSITION_END: 'transitionend',

  getUID(prefix) {
    do {
      // eslint-disable-next-line no-bitwise
      prefix += ~~(Math.random() * MAX_UID) // "~~" acts like a faster Math.floor() here
    } while (document.getElementById(prefix))
    return prefix
  },

  getSelectorFromElement(element) {
    let selector = element.getAttribute('data-target')

    if (!selector || selector === '#') {
      const hrefAttr = element.getAttribute('href')
      selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : ''
    }

    try {
      return document.querySelector(selector) ? selector : null
    } catch (err) {
      return null
    }
  },

  getTransitionDurationFromElement(element) {
    if (!element) {
      return 0
    }

    // Get transition-duration of the element
    let transitionDuration = window.getComputedStyle(element).transitionDuration
    let transitionDelay = window.getComputedStyle(element).transitionDelay

    const floatTransitionDuration = parseFloat(transitionDuration)
    const floatTransitionDelay = parseFloat(transitionDelay)

    // Return 0 if element or transition duration is not found
    if (!floatTransitionDuration && !floatTransitionDelay) {
      return 0
    }

    // If multiple durations are defined, take the first
    transitionDuration = transitionDuration.split(',')[0]
    transitionDelay = transitionDelay.split(',')[0]

    return (parseFloat(transitionDuration) + parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER
  },

  reflow(element) {
    return element.offsetHeight
  },

  triggerTransitionEnd(element) {
    element.dispatchEvent(new Event(Util.TRANSITION_END))
  },

  isElement(obj) {
    return (obj[0] || obj).nodeType
  },

  emulateTransitionEnd(element, duration) {
    let called = false
    const durationPadding = 5
    const emulatedDuration = duration + durationPadding
    function listener() {
      called = true
      element.removeEventListener(Util.TRANSITION_END, listener)
    }

    element.addEventListener(Util.TRANSITION_END, listener)
    setTimeout(() => {
      if (!called) {
        Util.triggerTransitionEnd(element)
      }
    }, emulatedDuration)
  },

  typeCheckConfig(componentName, config, configTypes) {
    for (const property in configTypes) {
      if (Object.prototype.hasOwnProperty.call(configTypes, property)) {
        const expectedTypes = configTypes[property]
        const value         = config[property]
        const valueType     = value && Util.isElement(value)
          ? 'element' : toType(value)

        if (!new RegExp(expectedTypes).test(valueType)) {
          throw new Error(
            `${componentName.toUpperCase()}: ` +
            `Option "${property}" provided type "${valueType}" ` +
            `but expected type "${expectedTypes}".`)
        }
      }
    }
  },

  makeArray(nodeList) {
    if (typeof nodeList === 'undefined' || nodeList === null) {
      return []
    }

    return [].slice.call(nodeList)
  },

  isVisible(element) {
    if (typeof element === 'undefined' || element === null) {
      return false
    }

    if (element.style !== null && element.parentNode !== null && typeof element.parentNode.style !== 'undefined') {
      return element.style.display !== 'none' &&
        element.parentNode.style.display !== 'none' &&
        element.style.visibility !== 'hidden'
    }
    return false
  },

  findShadowRoot(element) {
    if (!document.documentElement.attachShadow) {
      return null
    }

    // Can find the shadow root otherwise it'll return the document
    if (typeof element.getRootNode === 'function') {
      const root = element.getRootNode()
      return root instanceof ShadowRoot ? root : null
    }

    if (element instanceof ShadowRoot) {
      return element
    }

    // when we don't find a shadow root
    if (!element.parentNode) {
      return null
    }

    return Util.findShadowRoot(element.parentNode)
  },

  noop() {
    // eslint-disable-next-line no-empty-function
    return function () {}
  },

  get jQuery() {
    return window.jQuery
  }
}

export default Util
