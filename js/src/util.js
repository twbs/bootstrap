/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.3.1): util.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import EventHandler from './dom/eventHandler'

/**
 * ------------------------------------------------------------------------
 * Private TransitionEnd Helpers
 * ------------------------------------------------------------------------
 */

const TRANSITION_END = 'transitionend'
const MAX_UID = 1000000
const MILLISECONDS_MULTIPLIER = 1000

// Shoutout AngusCroll (https://goo.gl/pxwQGp)
function toType(obj) {
  return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase()
}

function normalizeData(val) {
  if (val === 'true') {
    return true
  } else if (val === 'false') {
    return false
  } else if (val === 'null') {
    return null
  } else if (val === Number(val).toString()) {
    return Number(val)
  }

  return val
}

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
    let transitionDuration = element.style.transitionDuration
    let transitionDelay = element.style.transitionDelay

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
  },

  extend(obj1, ...others) {
    const obj2 = others.shift()
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

    if (others.length) {
      this.extend(obj1, ...others)
    }

    return obj1
  },

  makeArray(nodeList) {
    if (typeof nodeList === 'undefined' || nodeList === null) {
      return []
    }

    const strRepresentation = Object.prototype.toString.call(nodeList)
    if (strRepresentation === '[object NodeList]' ||
      strRepresentation === '[object HTMLCollection]' || strRepresentation === '[object Array]') {
      return Array.prototype.slice.call(nodeList)
    }

    return [nodeList]
  },

  getDataAttributes(element) {
    if (typeof element === 'undefined' || element === null) {
      return {}
    }

    let attributes
    if (Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'dataset')) {
      attributes = this.extend({}, element.dataset)
    } else {
      attributes = {}
      for (let i = 0; i < element.attributes.length; i++) {
        const attribute = element.attributes[i]
        if (attribute.nodeName.indexOf('data-') !== -1) {
          // remove 'data-' part of the attribute name
          const attributeName = attribute.nodeName.substring('data-'.length).replace(/-./g, (str) => str.charAt(1).toUpperCase())
          attributes[attributeName] = attribute.nodeValue
        }
      }
    }

    for (const key in attributes) {
      if (!Object.prototype.hasOwnProperty.call(attributes, key)) {
        continue
      }

      attributes[key] = normalizeData(attributes[key])
    }

    return attributes
  },

  getDataAttribute(element, key) {
    return normalizeData(element.getAttribute(`data-${key.replace(/[A-Z]/g, (chr) => `-${chr.toLowerCase()}`)}`))
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

  // eslint-disable-next-line no-empty-function
  noop() {
  },

  get jQuery() {
    return window.$ || window.jQuery
  }
}

export default Util
