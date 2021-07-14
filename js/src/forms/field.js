/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.1): util/field.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
import { isElement, typeCheckConfig } from '../util/index'
import Messages from './messages'
import Manipulator from '../dom/manipulator'
import EventHandler from '../dom/event-handler'
import BaseComponent from '../base-component'
import SelectorEngine from '../dom/selector-engine'

const NAME = 'field'
const DATA_KEY = 'bs.field'
const EVENT_KEY = `.${DATA_KEY}`
const EVENT_INPUT = `input${EVENT_KEY}`
const CLASS_PREFIX_ERROR = 'invalid'
const CLASS_PREFIX_INFO = 'info'
const CLASS_PREFIX_SUCCESS = 'valid'
const CLASS_FIELD_ERROR = 'is-invalid'
const CLASS_FIELD_SUCCESS = 'is-valid'

const ARIA_DESCRIBED_BY = 'aria-describedby'
const Default = {
  name: null,
  type: 'feedback', // or tooltip
  valid: '', // valid message to add
  invalid: '' // invalid message to add
}

const DefaultType = {
  name: 'string',
  type: 'string',
  valid: 'string',
  invalid: 'string'
}

class Field extends BaseComponent {
  constructor(element, config) {
    super(element)
    if (!isElement(this._element)) {
      throw new TypeError(`field "${this._config.name}" not found`)
    }

    this._config = this._getConfig(config)

    this._errorMessages = this._getNewMessagesCollection(CLASS_PREFIX_ERROR, CLASS_FIELD_ERROR)
    this._helpMessages = this._getNewMessagesCollection(CLASS_PREFIX_INFO, '')
    this._successMessages = this._getNewMessagesCollection(CLASS_PREFIX_SUCCESS, CLASS_FIELD_SUCCESS)

    this._initializeMessageCollections()
    EventHandler.on(this._element, EVENT_INPUT, () => {
      this.clearAppended()
    })
  }

  static get NAME() {
    return NAME
  }

  getElement() {
    return this._element
  }

  clearAppended() {
    const appendedFeedback = SelectorEngine.findOne(`[class*=-${this._config.type}], ${this._getId()}`, this._element.parentNode)
    if (!appendedFeedback) {
      return
    }

    appendedFeedback.remove()

    this._element.classList.remove(CLASS_FIELD_ERROR, CLASS_FIELD_SUCCESS)

    const initialDescribedBy = this._initialDescribedBy()
    if (initialDescribedBy) {
      this._element.setAttribute(ARIA_DESCRIBED_BY, initialDescribedBy)
    } else {
      this._element.removeAttribute(ARIA_DESCRIBED_BY)
    }
  }

  dispose() {
    EventHandler.off(this._element, EVENT_KEY)
    Object.getOwnPropertyNames(this).forEach(propertyName => {
      this[propertyName] = null
    })
  }

  errorMessages() {
    return this._errorMessages
  }

  helpMessages() {
    return this._helpMessages
  }

  successMessages() {
    return this._successMessages
  }

  _getConfig(config) {
    config = {
      ...Default,
      ...Manipulator.getDataAttributes(this._element),
      ...(typeof config === 'object' ? config : {})
    }

    typeCheckConfig(NAME, config, DefaultType)
    return config
  }

  _appendFeedback(htmlElement, elementClass) {
    if (!isElement(htmlElement)) {
      return
    }

    this.clearAppended()

    const feedbackElement = htmlElement

    this._element.parentNode.append(feedbackElement)
    feedbackElement.id = this._getId()

    this._element.classList.add(elementClass)
    const initialDescribedBy = this._initialDescribedBy()
    const describedBy = initialDescribedBy ? `${initialDescribedBy} ` : ''
    this._element.setAttribute(ARIA_DESCRIBED_BY, `${describedBy}${feedbackElement.id}`)
  }

  _getId() {
    return `${this._config.name}-formTip`
  }

  _getNewMessagesCollection(classPrefix, elementClass) {
    const config = {
      appendFunction: html => this._appendFeedback(html, elementClass),
      extraClass: `${classPrefix}-${this._config.type}`
    }
    return new Messages(config)
  }

  _initialDescribedBy() {
    return (this._element.getAttribute(ARIA_DESCRIBED_BY) || '').replaceAll(this._getId(), '').trim()
  }

  _initializeMessageCollections() {
    if (this._config.invalid) {
      this.errorMessages().set('default', this._config.invalid)
    }

    if (this._config.valid) {
      this.successMessages().set('default', this._config.valid)
    }
  }
}

export default Field
