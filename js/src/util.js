/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-alpha.6): util.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Util = (($) => {

  /**
   * ------------------------------------------------------------------------
   * Private Transition Helpers
   * ------------------------------------------------------------------------
   */

  const MAX_UID = 1000000

  const MILLIS = 1000

  // shoutout AngusCroll (https://goo.gl/pxwQGp)
  function toType(obj) {
    return {}.toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
  }

  function isElement(obj) {
    return (obj[0] || obj).nodeType
  }

  function getCssTransitionDuration(element) {
    // let duration
    let durationArray = []
    element.each(() => {
      const durationValues = element.css('transition-duration') || element.css('-webkit-transition-duration') || element.css('-moz-transition-duration') || element.css('-ms-transition-duration') || element.css('-o-transition-duration')
      if (durationValues) {
        durationArray = durationArray.concat(durationValues.split(','))
      }
    })
    $.each(durationArray,
      (index, value) => {
        durationArray[index] = parseFloat(value)
      }
    )
    return durationArray.sort((a, b) => {
      return b - a
    })[0]
  }

  function transitionEmulator(start, complete) {
    // determine the longest transition duration (in case there is a transition on multiple attributes) from the css
    const duration = getCssTransitionDuration(this)
    // if there is a non 0 transition duration
    if (duration) {
      // set a timeout to call complete (instead of using transitionend that is sometimes not triggered). This way we can guarantee complete is always called
      setTimeout(() => {
        executeCallback(complete)
      }, duration * MILLIS)
      // execute the start transition function, after setting the timeout
      executeCallback(start)
    } else {
      executeCallback(start)
      executeCallback(complete)
    }
    return this
  }

  function executeCallback(callback) {
    if (callback) {
      callback()
    }
  }

  function setTransitionEmulator() {
    $.fn.transition = transitionEmulator
  }


  /**
   * --------------------------------------------------------------------------
   * Public Util Api
   * --------------------------------------------------------------------------
   */

  const Util = {

    getUID(prefix) {
      do {
        // eslint-disable-next-line no-bitwise
        prefix += ~~(Math.random() * MAX_UID) // "~~" acts like a faster Math.floor() here
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
      return element.offsetHeight
    },

    typeCheckConfig(componentName, config, configTypes) {
      for (const property in configTypes) {
        if (configTypes.hasOwnProperty(property)) {
          const expectedTypes = configTypes[property]
          const value         = config[property]
          const valueType     = value && isElement(value) ?
                                'element' : toType(value)

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

  setTransitionEmulator()

  return Util

})(jQuery)

export default Util
