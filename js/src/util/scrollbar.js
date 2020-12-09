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

const getScrollBarWidth = () => { // thx d.walsh
  const scrollDiv = document.createElement('div')
  scrollDiv.className = CLASS_NAME_SCROLLBAR_MEASURER
  document.body.appendChild(scrollDiv)
  const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth
  document.body.removeChild(scrollDiv)
  return scrollbarWidth
}

const setScrollbar = width => {
  // Note: DOMNode.style.paddingRight returns the actual value or '' if not set
  //   while $(DOMNode).css('padding-right') returns the calculated value or 0 if not set

  // Adjust fixed content padding
  SelectorEngine.find(SELECTOR_FIXED_CONTENT)
    .forEach(element => {
      const actualPadding = element.style.paddingRight
      const calculatedPadding = window.getComputedStyle(element)['padding-right']
      Manipulator.setDataAttribute(element, 'padding-right', actualPadding)
      element.style.paddingRight = `${Number.parseFloat(calculatedPadding) + width}px`
    })

  // Adjust sticky content margin
  SelectorEngine.find(SELECTOR_STICKY_CONTENT)
    .forEach(element => {
      const actualMargin = element.style.marginRight
      const calculatedMargin = window.getComputedStyle(element)['margin-right']
      Manipulator.setDataAttribute(element, 'margin-right', actualMargin)
      element.style.marginRight = `${Number.parseFloat(calculatedMargin) - width}px`
    })

  // Adjust body padding
  const actualPadding = document.body.style.paddingRight
  const calculatedPadding = window.getComputedStyle(document.body)['padding-right']

  Manipulator.setDataAttribute(document.body, 'padding-right', actualPadding)
  document.body.style.paddingRight = `${Number.parseFloat(calculatedPadding) + width}px`
}

const resetScrollbar = () => {
  // Restore fixed content padding
  SelectorEngine.find(SELECTOR_FIXED_CONTENT)
    .forEach(element => {
      const padding = Manipulator.getDataAttribute(element, 'padding-right')
      if (typeof padding !== 'undefined') {
        Manipulator.removeDataAttribute(element, 'padding-right')
        element.style.paddingRight = padding
      }
    })

  // Restore sticky content and navbar-toggler margin
  SelectorEngine.find(`${SELECTOR_STICKY_CONTENT}`)
    .forEach(element => {
      const margin = Manipulator.getDataAttribute(element, 'margin-right')
      if (typeof margin !== 'undefined') {
        Manipulator.removeDataAttribute(element, 'margin-right')
        element.style.marginRight = margin
      }
    })

  // Restore body padding
  const padding = Manipulator.getDataAttribute(document.body, 'padding-right')
  if (typeof padding === 'undefined') {
    document.body.style.paddingRight = ''
  } else {
    Manipulator.removeDataAttribute(document.body, 'padding-right')
    document.body.style.paddingRight = padding
  }
}

export {
  getScrollBarWidth,
  setScrollbar,
  resetScrollbar
}
