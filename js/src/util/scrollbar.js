/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.0-beta2): util/scrollBar.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import SelectorEngine from '../dom/selector-engine'
import Manipulator from '../dom/manipulator'

const CLASS_NAME_SCROLLBAR_MEASURER = 'modal-scrollbar-measure'
const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top'
const SELECTOR_STICKY_CONTENT = '.sticky-top'

const getWidth = () => { // thx d.walsh
  const scrollDiv = document.createElement('div')
  scrollDiv.className = CLASS_NAME_SCROLLBAR_MEASURER
  document.body.appendChild(scrollDiv)
  const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth
  document.body.removeChild(scrollDiv)
  return scrollbarWidth
}

const setCustom = width => {
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

export {
  getWidth,
  setCustom,
  reset
}
