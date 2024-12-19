/**
 * --------------------------------------------------------------------------
 * Bootstrap base-component.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import Data from './dom/data.js'
import EventHandler from './dom/event-handler.js'
import Config from './util/config.js'
import { executeAfterTransition, getElement } from './util/index.js'

/**
 * Constants
 */

const VERSION = '5.3.4'

/**
 * Class definition
 */

class BaseComponent extends Config {
  constructor(element, config) {
    super()

    element = getElement(element)
    if (!element) {
      return
    }

    this._element = element
    this._config = this._getConfig(config)

    Data.set(this._element, this.constructor.DATA_KEY, this)
  }

  // Public
  dispose() {
    Data.remove(this._element, this.constructor.DATA_KEY)
    EventHandler.off(this._element, this.constructor.EVENT_KEY)

    for (const propertyName of Object.getOwnPropertyNames(this)) {
      this[propertyName] = null
    }
  }

  _queueCallback(callback, element, isAnimated = true) {
    executeAfterTransition(callback, element, isAnimated)
  }

  _getConfig(config) {
    config = this._mergeConfigObj(config, this._element)
    config = this._configAfterMerge(config)
    this._typeCheckConfig(config)
    return config
  }

  // Static
  static getInstance(element) {
    return Data.get(getElement(element), this.DATA_KEY)
  }

  static getOrCreateInstance(element, config = {}) {
    return this.getInstance(element) || new this(element, typeof config === 'object' ? config : null)
  }

  static get VERSION() {
    return VERSION
  }

  static get DATA_KEY() {
    return `bs.${this.NAME}`
  }

  static get EVENT_KEY() {
    return `.${this.DATA_KEY}`
  }

  static eventName(name) {
    return `${name}${this.EVENT_KEY}`
  }
}

export default BaseComponent
