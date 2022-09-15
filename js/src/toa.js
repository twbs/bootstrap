/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.1): toa.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
import Base from './base'
//
// const TEMPLATE = '<slot></slot>'

export default class Toa extends Base {
  constructor() {
    super()
    this.autohide = this.getAttribute('autohide') !== 'false'
    console.log(this.autohide) // eslint-disable-line no-console
    this.classList.add('toast', 'bg-danger', 'p-2')
    this.setAttribute('role', 'alert')
    this.ariaLive = 'assertlive'
    this.ariaAtomic = 'true'
  }

  show() {
    this.classList.add('show')
    this.style.display = 'block'
    if (this.autohide) {
      setTimeout(() => this.hide(), this.constructor.properties.delay.value)
    }
  }

  hide() {
    if (this._hasMouseInteraction) {
      setTimeout(() => this.hide(), this.constructor.properties.delay.value)
      return
    }

    this.style.removeProperty('display')
    this.classList.remove('show')
  }

  // Button's properties.
  static get properties() {
    return {
      animation: {
        type: Boolean,
        value: true
      },
      autohide: {
        type: Boolean,
        value: true
      },
      delay: {
        type: Number,
        value: 3000
      }
    }
  }

  connectedCallback() {
    this.show()

    this.addEventListener('pointerenter', event => this._onInteraction(event, true))
    this.addEventListener('pointerleave', event => this._onInteraction(event, false))
  }

  _onInteraction(event, isInteracting) {
    switch (event.type) {
      case 'pointerenter':
      case 'pointerleave':
        this._hasMouseInteraction = isInteracting
        break
      default:
        break
    }
  }
}
