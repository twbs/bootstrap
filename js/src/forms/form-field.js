/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.3.0): forms/field.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import { getUID, isElement } from '../util/index'
import EventHandler from '../dom/event-handler'
import BaseComponent from '../base-component'
import SelectorEngine from '../dom/selector-engine'
import TemplateFactory from '../util/template-factory'

const NAME = 'formField'
const DATA_KEY = 'bs.field'
const EVENT_KEY = `.${DATA_KEY}`
const EVENT_INPUT = `input${EVENT_KEY}`
const CLASS_FIELD_ERROR = 'is-invalid'
const CLASS_FIELD_SUCCESS = 'is-valid'

const ARIA_DESCRIBED_BY = 'aria-describedby'
const Default = {
  invalid: '', // invalid message to add
  name: null,
  valid: '', // valid message to add
  type: 'feedback' // or tooltip
}

const DefaultType = {
  invalid: 'string',
  name: 'string',
  valid: 'string',
  type: 'string'
}

const MessageTypes = {
  ERROR: { prefix: 'invalid', class: CLASS_FIELD_ERROR },
  INFO: { prefix: 'info', class: '' },
  SUCCESS: { prefix: 'valid', class: CLASS_FIELD_SUCCESS }
}

class FormField extends BaseComponent {
  constructor(element, config) {
    super(element, config)
    if (!isElement(this._element)) {
      throw new TypeError(`field "${this._config.name}" not found`)
    }

    this._tipId = getUID(`${this._config.name}-formTip-`)
    this._initialDescribedBy = this._element.getAttribute(ARIA_DESCRIBED_BY) || ''

    EventHandler.on(this._element, EVENT_INPUT, () => {
      this.clearAppended()
    })
  }

  static get NAME() {
    return NAME
  }

  static get Default() {
    return Default
  }

  static get DefaultType() {
    return DefaultType
  }

  static get MessageTypes() {
    return MessageTypes
  }

  getElement() {
    return this._element
  }

  clearAppended() {
    const appendedFeedback = SelectorEngine.findOne(`#${this._tipId}`, this._element.parentNode)
    if (!appendedFeedback) {
      return
    }

    appendedFeedback.remove()

    this._element.classList.remove(CLASS_FIELD_ERROR, CLASS_FIELD_SUCCESS)

    if (this._initialDescribedBy) {
      this._element.setAttribute(ARIA_DESCRIBED_BY, this._initialDescribedBy)
      return
    }

    this._element.removeAttribute(ARIA_DESCRIBED_BY)
  }

  appendError(message = this._config.invalid) {
    return this.appendFeedback(message, this.constructor.MessageTypes.ERROR)
  }

  appendSuccess(message = this._config.valid) {
    return this.appendFeedback(message, this.constructor.MessageTypes.SUCCESS)
  }

  appendFeedback(feedback, classes = this.constructor.MessageTypes.INFO) {
    if (!feedback) {
      return false
    }

    this.clearAppended()

    const config = {
      extraClass: `${classes.prefix}-${this._config.type} ${classes.class}`,
      content: { div: feedback }
    }
    feedback = new TemplateFactory(config)

    const feedbackElement = feedback.toHtml()
    feedbackElement.id = this._tipId

    this._element.parentNode.append(feedbackElement)

    const describedBy = `${this._initialDescribedBy} ${feedbackElement.id}`.trim()
    this._element.setAttribute(ARIA_DESCRIBED_BY, describedBy)
    return true
  }
}

export default FormField
