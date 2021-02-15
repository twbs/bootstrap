/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.0-beta2): base-component.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import Data from './dom/data'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const VERSION = '5.0.0-beta2'

class BaseComponent {
  constructor(element) {
    if (!element) {
      return
    }

    this._element = element
    Data.setData(element, this.constructor.DATA_KEY, this)
  }

  dispose() {
    Data.removeData(this._element, this.constructor.DATA_KEY)
    this._element = null
  }

  /** Static */

  static getInstance(element) {
    return Data.getData(element, this.DATA_KEY)
  }

  static get VERSION() {
    return VERSION
  }
}

export default BaseComponent
