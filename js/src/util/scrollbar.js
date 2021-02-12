/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.0-beta2): util/scrollBar.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import SelectorEngine from '../dom/selector-engine'
import Manipulator from '../dom/manipulator'

const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top'
const SELECTOR_STICKY_CONTENT = '.sticky-top'

const getWidth = () => {
  // https://muffinman.io/blog/get-scrollbar-width-in-javascript/
  return Math.abs(window.innerWidth - document.documentElement.clientWidth)
}

const hide = (width = getWidth()) => {
  document.body.style.overflow = 'hidden'
  _setElementAttributes(SELECTOR_FIXED_CONTENT, 'paddingRight', calculatedValue => calculatedValue + width)
  _setElementAttributes(SELECTOR_STICKY_CONTENT, 'marginRight', calculatedValue => calculatedValue - width)
  _setElementAttributes('body', 'paddingRight', calculatedValue => calculatedValue + width)
}

const _setElementAttributes = (selector, styleProp, callback) => {
  SelectorEngine.find(selector)
    .forEach(element => {
      const actualValue = element.style[styleProp]
      const calculatedValue = window.getComputedStyle(element)[styleProp]
      Manipulator.setDataAttribute(element, styleProp, actualValue)
      element.style[styleProp] = callback(Number.parseFloat(calculatedValue)) + 'px'
    })
}

const reset = () => {
  document.body.style.overflow = 'auto'
  _resetElementAttributes(SELECTOR_FIXED_CONTENT, 'paddingRight')
  _resetElementAttributes(SELECTOR_STICKY_CONTENT, 'marginRight')
  _resetElementAttributes('body', 'paddingRight')
}

const _resetElementAttributes = (selector, styleProp) => {
  SelectorEngine.find(selector).forEach(element => {
    const value = Manipulator.getDataAttribute(element, styleProp)
    if (typeof value === 'undefined' && element === document.body) {
      element.style[styleProp] = ''
    } else {
      Manipulator.removeDataAttribute(element, styleProp)
      element.style[styleProp] = value
    }
  })
}

const isBodyOverflowing = () => {
  // maybe getWidth > 0
  const rect = document.body.getBoundingClientRect()
  return Math.round(rect.left + rect.right) < window.innerWidth
}

export {
  getWidth,
  hide,
  isBodyOverflowing,
  reset
}
