/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.0-beta3): util/backdrop.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import EventHandler from '../dom/event-handler'
import { emulateTransitionEnd, execute, getTransitionDurationFromElement, reflow, typeCheckConfig } from './index'

const Default = {
  isVisible: true, // if false, we use the backdrop helper without adding any element to the dom
  isAnimated: false,
  rootElement: document.body // give the choice to place backdrop under different elements
}

const DefaultType = {
  isVisible: 'boolean',
  isAnimated: 'boolean',
  rootElement: 'element'
}
const NAME = 'backdrop'
const CLASS_NAME_BACKDROP = 'modal-backdrop'
const CLASS_NAME_FADE = 'fade'
const CLASS_NAME_SHOW = 'show'

class Backdrop {
  constructor(config) {
    this._config = this._getConfig(config)
    this._isAppended = false
    this._element = null
  }

  show(callback) {
    if (!this._config.isVisible) {
      execute(callback)
      return
    }

    this._append()

    if (this._config.isAnimated) {
      reflow(this._getElement())
    }

    this._getElement().classList.add(CLASS_NAME_SHOW)

    this._emulateAnimation(() => {
      execute(callback)
    })
  }

  hide(callback) {
    if (!this._config.isVisible) {
      execute(callback)
      return
    }

    this._getElement().classList.remove(CLASS_NAME_SHOW)

    this._emulateAnimation(() => {
      this.dispose()
      execute(callback)
    })
  }

  // Private

  _getElement() {
    if (!this._element) {
      const backdrop = document.createElement('div')
      backdrop.className = CLASS_NAME_BACKDROP
      if (this._config.isAnimated) {
        backdrop.classList.add(CLASS_NAME_FADE)
      }

      this._element = backdrop
    }

    return this._element
  }

  _getConfig(config) {
    config = {
      ...Default,
      ...(typeof config === 'object' ? config : {})
    }
    typeCheckConfig(NAME, config, DefaultType)
    return config
  }

  _append() {
    if (this._isAppended) {
      return
    }

    this._config.rootElement.appendChild(this._getElement())

    this._isAppended = true
  }

  dispose() {
    if (!this._isAppended) {
      return
    }

    this._getElement().parentNode.removeChild(this._element)
    this._isAppended = false
  }

  _emulateAnimation(callback) {
    if (!this._config.isAnimated) {
      execute(callback)
      return
    }

    const backdropTransitionDuration = getTransitionDurationFromElement(this._getElement())
    EventHandler.one(this._getElement(), 'transitionend', () => execute(callback))
    emulateTransitionEnd(this._getElement(), backdropTransitionDuration)
  }
}

export default Backdrop
