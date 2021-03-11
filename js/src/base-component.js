/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.0-beta2): base-component.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import Data from './dom/data'
import { getDocument, getWindow } from './util/index'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const VERSION = '5.0.0-beta2'

class BaseComponent {
  constructor(element) {
    element = typeof element === 'string' ? getDocument().querySelector(element) : element

    if (!element) {
      return
    }

    this._element = element
    this._window = getWindow()
    this._document = getDocument()
    Data.set(this._element, this.constructor.DATA_KEY, this)
  }

  dispose() {
    Data.remove(this._element, this.constructor.DATA_KEY)
    this._element = null
  }

  /** Static */

  static getInstance(element) {
    return Data.get(element, this.DATA_KEY)
  }

  static get VERSION() {
    return VERSION
  }
}

export default BaseComponent
