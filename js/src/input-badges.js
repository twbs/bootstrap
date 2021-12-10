/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): input-badges.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import {
  defineJQueryPlugin,
  typeCheckConfig
} from './util/index'
import Manipulator from './dom/manipulator'
import EventHandler from './dom/event-handler'
import BaseComponent from './base-component'
import Badge from './badge'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'input-badges'
const DefaultType = {
  rounded: 'boolean',
  colour: 'string'
}

const Default = {
  rounded: false,
  colour: 'primary'
}

const COLOUR_VALUES = [
  'primary',
  'secondary',
  'success',
  'danger',
  'warning',
  'info',
  'light',
  'dark'
]

const DATA_KEY = 'bs.input-badges'
const EVENT_KEY = `.${DATA_KEY}`

const EVENT_BADGE_ADD = `add${EVENT_KEY}`
const EVENT_BADGE_ADDED = `added${EVENT_KEY}`
const EVENT_BADGE_REMOVED = `removed${EVENT_KEY}`

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class InputBadges extends BaseComponent {
  constructor(element, config) {
    super(element)

    // Protected
    this._config = this._getConfig(config)

    const wrapperDiv = document.createElement('div')
    for (let i = 0; i < this._element.classList.length; i++) {
      const className = this._element.classList[i]
      wrapperDiv.classList.add(className)
    }

    this._element.parentNode.insertBefore(wrapperDiv, this._element)
    wrapperDiv.append(this._element)
    this._element.classList.add('d-none')

    const visibleInput = document.createElement('INPUT')
    visibleInput.setAttribute('type', 'text')
    visibleInput.classList.add('border-0', 'w-25', 'form-control-plaintext', 'py-0', 'd-inline')
    wrapperDiv.append(visibleInput)

    wrapperDiv.style.cursor = 'text'

    wrapperDiv.addEventListener('click', () => {
      visibleInput.focus()
    })

    visibleInput.addEventListener('keyup', event => {
      if (event.key !== 'Backspace' || visibleInput.value !== '') {
        return
      }

      const existingBadges = Array.from(wrapperDiv.childNodes).filter(item => {
        return item.nodeName === 'SPAN'
      })

      if (existingBadges.length > 0) {
        Badge.getOrCreateInstance(existingBadges[existingBadges.length - 1]).close()
        // eslint-disable-next-line no-console
        console.log(this._element.value)
        EventHandler.trigger(this._element, EVENT_BADGE_REMOVED)
      }
    })

    visibleInput.addEventListener('keyup', event => {
      if (event.key !== 'Enter') {
        return
      }

      if (visibleInput.value === '') {
        return
      }

      const existingValue = this._element.value.split(',').find(value => value === encodeURIComponent(visibleInput.value))
      if (existingValue) {
        return
      }

      const addBadgeEvent = EventHandler.trigger(this._element, EVENT_BADGE_ADD)

      if (addBadgeEvent.defaultPrevented) {
        return
      }

      const newBadge = document.createElement('span')
      newBadge.classList.add('badge', `bg-${this._config.colour}`, 'badge-dismissable')
      if (this._config.rounded) {
        newBadge.classList.add('rounded-pill')
      }

      this._element.value += `${encodeURIComponent(visibleInput.value)},`
      newBadge.textContent = visibleInput.value
      const closeButton = document.createElement('button')
      closeButton.setAttribute('type', 'button')
      closeButton.classList.add('btn-close')
      closeButton.setAttribute('data-bs-dismiss', 'badge')
      closeButton.setAttribute('aria-label', 'Close')
      newBadge.append(closeButton)
      Badge.getOrCreateInstance(newBadge)
      newBadge.addEventListener('closed.bs.badge', () => {
        this._element.value = this._element.value.replace(`${encodeURIComponent(newBadge.textContent)},`, '')
        // eslint-disable-next-line no-console
        console.log(this._element.value)
        EventHandler.trigger(this._element, EVENT_BADGE_REMOVED)
      })
      visibleInput.value = ''
      visibleInput.before(newBadge)
      // eslint-disable-next-line no-console
      console.log(this._element.value)
      EventHandler.trigger(this._element, EVENT_BADGE_ADDED)
    })
  }

  // Getters

  static get NAME() {
    return NAME
  }

  static get Default() {
    return Default
  }

  static get DefaultType() {
    return DefaultType
  }

  // Private

  _getConfig(config) {
    const dataAttributes = Manipulator.getDataAttributes(this._element)

    config = {
      ...this.constructor.Default,
      ...dataAttributes,
      ...(typeof config === 'object' && config ? config : {})
    }

    typeCheckConfig(NAME, config, this.constructor.DefaultType)

    config.colour = COLOUR_VALUES.find(col => col === config.colour) || Default.colour

    return config
  }

  // Static

  static jQueryInterface(config) {
    return this.each(function () {
      const data = InputBadges.getOrCreateInstance(this, config)

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`)
        }

        data[config]()
      }
    })
  }
}

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .input-badges to jQuery only if jQuery is present
 */

defineJQueryPlugin(InputBadges)

export default InputBadges
