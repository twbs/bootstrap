/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.1.3): dom/manipulator.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const regexDataKey = /[A-Z]/g

function normalizeData(val) {
  if (val === 'true') {
    return true
  } else if (val === 'false') {
    return false
  } else if (val === 'null') {
    return null
  } else if (val === Number(val).toString()) {
    return Number(val)
  } else if (val === '') {
    return null
  }

  return val
}

function normalizeDataKey(key) {
  return key.replace(regexDataKey, (chr) => chr.toLowerCase())
}

const Manipulator = {
  setDataAttribute(element, key, value) {
    element.setAttribute(`data-${normalizeDataKey(key)}`, value)
  },

  removeDataAttribute(element, key) {
    element.removeAttribute(`data-${normalizeDataKey(key)}`)
  },

  getDataAttributes(element) {
    if (typeof element === 'undefined' || element === null) {
      return {}
    }

    let attributes
    if (Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'dataset')) {
      attributes = {
        ...element.dataset
      }
    } else {
      attributes = {}
      for (let i = 0; i < element.attributes.length; i++) {
        const attribute = element.attributes[i]

        if (attribute.nodeName.indexOf('data-') !== -1) {
          // remove 'data-' part of the attribute name
          const attributeName = attribute
            .nodeName
            .substring('data-'.length)
            .replace(/-./g, (str) => str.charAt(1).toUpperCase())

          attributes[attributeName] = attribute.nodeValue
        }
      }
    }

    Object.keys(attributes)
      .forEach((key) => {
        attributes[key] = normalizeData(attributes[key])
      })

    return attributes
  },

  getDataAttribute(element, key) {
    return normalizeData(element
      .getAttribute(`data-${normalizeDataKey(key)}`)
    )
  },

  offset(element) {
    const rect = element.getBoundingClientRect()

    return {
      top: rect.top + document.body.scrollTop,
      left: rect.left + document.body.scrollLeft
    }
  },

  position(element) {
    return {
      top: element.offsetTop,
      left: element.offsetLeft
    }
  },

  toggleClass(element, className) {
    if (typeof element === 'undefined' || element === null) {
      return
    }

    if (element.classList.contains(className)) {
      element.classList.remove(className)
    } else {
      element.classList.add(className)
    }
  }
}

export default Manipulator
