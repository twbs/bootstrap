/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.0-beta1): util/history.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import Config from './config'
import EventHandler from '../dom/event-handler'

/**
 * Constants
 */

const NAME = 'history'

const Default = {
  prefix: null
}

const DefaultType = {
  prefix: 'string'
}

/**
 * Class definition
 */

class HistoryHelper extends Config {
  constructor(element, config) {
    super()
    this._element = element
    this._config = this._getConfig(config)
  }

  // Getters
  static get Default() {
    return Default
  }

  static get DefaultType() {
    return DefaultType
  }

  static get NAME() {
    return NAME
  }

  add() {
    const url = new window.URL(window.location)
    url.hash = this._getHash()
    window.history.pushState({}, '', url)
  }

  remove() {
    if (window.location.hash === `#${this._getHash()}`) {
      const url = new window.URL(window.location)
      url.hash = ''
      window.history.replaceState({}, '', url)
    }
  }

  static onChange(plugin, callback) {
    const prefix = `bs-${plugin.NAME}-`
    const getHash = url => new window.URL(url)?.hash
    const sanitize = hash => hash.replace(prefix, '')

    EventHandler.on(window, 'load', () => {
      const hash = getHash(window.location)
      if (hash.includes(prefix)) {
        callback(sanitize(hash), '')
      }
    })

    EventHandler.on(window, 'hashchange', ev => {
      const oldHash = getHash(ev.oldURL)
      const newHash = getHash(ev.newURL)

      if (oldHash.includes(prefix) || newHash.includes(prefix)) {
        callback(sanitize(newHash), sanitize(oldHash))
      }
    })
  }

  _getHash() {
    return `bs-${this._config.prefix}-${this._element.id}`
  }
}

export default HistoryHelper
