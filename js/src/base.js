import { executeAfterTransition } from './util/index'
import Manipulator from './dom/manipulator'

class Base extends HTMLElement {
  constructor(config) {
    super()

    this._config = this._mergeConfigObj(config, this)
  }

  _queueCallback(callback, element, isAnimated = true) {
    executeAfterTransition(callback, element, isAnimated)
  }

  static get DATA_KEY() {
    return `bs.${this.NAME}`
  }

  static get EVENT_KEY() {
    return `.${this.DATA_KEY}`
  }

  _mergeConfigObj(config, element) {
    const jsonConfig = Manipulator.getDataAttribute(element, 'config') // try to parse

    return {
      ...this.constructor.Default,
      ...(typeof jsonConfig === 'object' ? jsonConfig : {}),
      ...Manipulator.getDataAttributes(element),
      ...(typeof config === 'object' ? config : {})
    }
  }
}

export default Base
