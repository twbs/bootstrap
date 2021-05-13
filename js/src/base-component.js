/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.1): base-component.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import Data from './dom/data'
import {
  emulateTransitionEnd,
  execute,
  getElement,
  getTransitionDurationFromElement
} from './util/index'
import EventHandler from './dom/event-handler'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const VERSION = '5.0.1'

class BaseComponent {
  constructor(element) {
    element = getElement(element)

    if (!element) {
      return
    }

    this._element = element
    Data.set(this._element, this.constructor.DATA_KEY, this)
  }

  dispose() {
    Data.remove(this._element, this.constructor.DATA_KEY)
    EventHandler.off(this._element, this.constructor.EVENT_KEY)

    Object.getOwnPropertyNames(this).forEach(propertyName => {
      this[propertyName] = null
    })
  }

  _queueCallback(callback, element, isAnimated = true) {
    if (!isAnimated) {
      execute(callback)
      return
    }

    const transitionDuration = getTransitionDurationFromElement(element)
    EventHandler.one(element, 'transitionend', () => execute(callback))

    emulateTransitionEnd(element, transitionDuration)
  }

  /** Static */

  static getInstance(element) {
    return Data.get(element, this.DATA_KEY)
  }

  static get VERSION() {
    return VERSION
  }

  static get NAME() {
    throw new Error('You have to implement the static method "NAME", for each component!')
  }

  static get DATA_KEY() {
    return `bs.${this.NAME}`
  }

  static get EVENT_KEY() {
    return `.${this.DATA_KEY}`
  }
}

export default BaseComponent
