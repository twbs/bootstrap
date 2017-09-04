import EventHandler from './dom/eventHandler'

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0): util.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Util = (() => {

  const transition = EventHandler.getBrowserTransitionEnd()

  const MAX_UID = 1000000

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
        const elements = document.querySelectorAll(selector)
        return elements.length > 0 ? selector : null
      } catch (error) {
        return null
      }
    },

    reflow(element) {
      return element.offsetHeight
    },

    triggerTransitionEnd(element) {
      EventHandler.trigger(element, Util.TRANSITION_END)
    },

    supportsTransitionEnd() {
      return Boolean(transition)
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
    },

    extend(obj1, obj2) {
      for (const secondProp in obj2) {
        if (Object.prototype.hasOwnProperty.call(obj2, secondProp)) {
          const secondVal = obj2[secondProp]
          // Is this value an object?  If so, iterate over its properties, copying them over
          if (secondVal && Object.prototype.toString.call(secondVal) === '[object Object]') {
            obj1[secondProp] = obj1[secondProp] || {}
            Util.extend(obj1[secondProp], secondVal)
          } else {
            obj1[secondProp] = secondVal
          }
        }
      }
      return obj1
    },

    makeArray(nodeList) {
      if (typeof nodeList === 'undefined' || nodeList === null) {
        return []
      }
      return Array.prototype.slice.call(nodeList)
    },

    getDataAttributes(element) {
      if (typeof element === 'undefined' || element === null) {
        return {}
      }

      const attributes = {}
      for (let i = 0; i < element.attributes.length; i++) {
        const attribute = element.attributes[i]
        if (attribute.nodeName.indexOf('data-') !== -1) {
          // remove 'data-' part of the attribute name
          const attributeName = attribute.nodeName.substring('data-'.length)
          attributes[attributeName] = attribute.nodeValue
        }
      }
      return attributes
    },

    isVisible(element) {
      if (typeof element === 'undefined' || element === null) {
        return false
      }

      if (element.style !== null && element.parentNode !== null && typeof element.parentNode.style !== 'undefined') {
        return element.style.display !== 'none'
          && element.parentNode.style.display !== 'none'
          && element.style.visibility !== 'hidden'
      }
      return false
    }
  }

  return Util

})()

export default Util
