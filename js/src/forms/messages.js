/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.1): util/messages.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
import TemplateFactory from '../util/template-factory'

class Messages extends Map {
  constructor(templateConfig) {
    super()
    this._templateConfig = templateConfig
  }

  set(key, message) {
    const config = { ...this._templateConfig, ...{ content: { div: message } } }
    super.set(key, new TemplateFactory(config))
  }

  getAllAsTextArray() {
    return Array.from(this.values()).map(message => message.getContent().join(', '))
  }

  getFirst() {
    const first = this.values().next()
    return first ? first.value : null
  }

  count() {
    return this.size
  }
}

export default Messages
