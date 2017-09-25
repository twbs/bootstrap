import Util from '../util'

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): dom/manipulator.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Manipulator = {
  setChecked(input, val) {
    if (input instanceof HTMLInputElement) {
      input.checked = val
      input.bsChecked = val
    }
  },

  isChecked(input) {
    if (input instanceof HTMLInputElement) {
      return input.bsChecked || input.checked
    }
    throw new Error('INPUT parameter is not an HTMLInputElement')
  },

  setDataAttribute(element, key, value) {
    const $ = Util.jQuery
    if (typeof $ !== 'undefined') {
      $(element).data(key, value)
    }

    element.setAttribute(`data-${key.replace(/[A-Z]/g, (chr) => `-${chr.toLowerCase()}`)}`, value)
  },

  removeDataAttribute(element, key) {
    const $ = Util.jQuery
    if (typeof $ !== 'undefined') {
      $(element).removeData(key)
    }

    element.removeAttribute(`data-${key.replace(/[A-Z]/g, (chr) => `-${chr.toLowerCase()}`)}`)
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
