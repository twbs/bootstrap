import EventHandler from './dom/eventHandler'

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.1.3): util.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Util = (($) => {
  /**
   * ------------------------------------------------------------------------
   * Private TransitionEnd Helpers
   * ------------------------------------------------------------------------
   */

  const TRANSITION_END = 'transitionend'
  const MAX_UID = 1000000
  const MILLISECONDS_MULTIPLIER = 1000

  // shoutout AngusCroll (https://goo.gl/pxwQGp)
  function toType(obj) {
    return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase()
  }

  /**
   * --------------------------------------------------------------------------
   * Public Util Api
   * --------------------------------------------------------------------------
   */

  const Util = {

    TRANSITION_END: 'bsTransitionEnd',

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
        selector = element.getAttribute('href') || ''
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
      let transitionDuration = $(element).css('transition-duration')
      const floatTransitionDuration = parseFloat(transitionDuration)

      // Return 0 if element or transition duration is not found
      if (!floatTransitionDuration) {
        return 0
      }

      // If multiple durations are defined, take the first
      transitionDuration = transitionDuration.split(',')[0]

      return parseFloat(transitionDuration) * MILLISECONDS_MULTIPLIER
    },

    reflow(element) {
      return element.offsetHeight
    },

    triggerTransitionEnd(element) {
      EventHandler.trigger(element, Util.TRANSITION_END)
    },

    // TODO: Remove in v5
    supportsTransitionEnd() {
      return Boolean(TRANSITION_END)
    },

    isElement(obj) {
      return (obj[0] || obj).nodeType
    },

    emulateTransitionEnd(element, duration) {
      setTimeout(() => {
        Util.triggerTransitionEnd(element)
      }, duration)
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
    }
  }

  return Util
})()

export default Util
