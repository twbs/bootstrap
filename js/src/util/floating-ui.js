/**
 * --------------------------------------------------------------------------
 * Bootstrap floating-ui.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import { autoUpdate, computePosition } from '@floating-ui/dom'
import Manipulator from '../dom/manipulator.js'
import { getElement, isElement } from './index.js'

/**
 * Class definition
 */
class FloatingUi {
  constructor(element) {
    if (typeof computePosition === 'undefined') {
      throw new TypeError('Bootstrap\'s tooltips and dropdowns require Floating UI (https://floating-ui.com/)')
    }

    this._element = element
    this._cleanup = null
  }

  calculate(reference, floatingEl, config, extraCss = {}) {
    this._cleanup = autoUpdate(reference, floatingEl, () => {
      computePosition(reference, floatingEl, config)
        .then(({ x, y, placement, middlewareData }) => {
          const positionCss = {
            left: `${x}px`,
            top: `${y}px`
          }

          if (middlewareData.hide) {
            const { referenceHidden } = middlewareData.hide

            Object.assign(floatingEl.style, {
              visibility: referenceHidden ? 'hidden' : 'visible'
            })
          }

          Object.assign(floatingEl.style, { ...positionCss, ...extraCss })
          Manipulator.setDataAttribute(floatingEl, 'placement', placement)
        })
    })
  }

  stop() {
    if (this._cleanup) {
      this._cleanup()
    }
  }

  getReferenceElement(reference, parent, PluginName) {
    if (reference === 'parent') {
      return parent
    }

    if (isElement(reference)) {
      return getElement(reference)
    }

    if (typeof reference === 'object') {
      if (typeof reference.getBoundingClientRect !== 'function') {
        throw new TypeError(`${PluginName.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`)
      }

      return reference
    }

    return this._element
  }

  parseOffset(value) {
    if (typeof value === 'function') {
      return popperData => value(popperData, this._element)
    }

    if (typeof value === 'string') {
      const values = value.split(',')
      value = [
        Number.parseInt(values[0], 10),
        Number.parseInt(values[1] || 0, 10)
      ]
    }

    if (Array.isArray(value)) {
      return {
        mainAxis: value[0],
        crossAxis: value[1] || 0
      }
    }

    return value
  }
}

export default FloatingUi
