// import {computePosition, flip, shift} from '@floating-ui/dom'
//
//
import { autoUpdate, computePosition } from '@floating-ui/dom'
import { getElement, isElement } from './index'
import Manipulator from '../dom/manipulator'

class FloatingUi {
  constructor(element) {
    if (typeof computePosition === 'undefined') {
      throw new TypeError('Bootstrap\'s tooltips require Popper (https://popper.js.org)')
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
          console.log(middlewareData) // eslint-disable-line no-console
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
    console.log(value) // eslint-disable-line no-console
    if (typeof value === 'function') {
      return popperData => value(popperData, this._element)
    }

    if (typeof value === 'string') {
      console.log('offset', value) // eslint-disable-line no-console
      value = [
        Number.parseInt(value.split(',')[0], 10),
        Number.parseInt(value.split(',')[1] || 0, 10)
      ]
    }

    if (Array.isArray(value)) {
      return {
        mainAxis: value[0],
        alignmentAxis: value[1]
      }
    }

    return value
  }
}

export default FloatingUi
