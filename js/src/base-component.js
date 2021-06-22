/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.2): base-component.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import Data from './dom/data'
import {
  executeAfterTransition,
  getElement
} from './util/index'
import EventHandler from './dom/event-handler'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const VERSION = '5.0.2'

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
    executeAfterTransition(callback, element, isAnimated)
  }

  /** Static */

  static getInstance(element) {
    return Data.get(element, this.DATA_KEY)
  }

  static getOrCreateInstance(element, config = {}) {
    return this.getInstance(element) || new this(element, typeof config === 'object' ? config : null)
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
