/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.0-beta2): util/backdrop.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import EventHandler from '../dom/event-handler'
import { execute, getTransitionDurationFromElement, reflow } from './index'

const CLASS_NAME_BACKDROP = 'modal-backdrop'
const CLASS_NAME_FADE = 'fade'
const CLASS_NAME_SHOW = 'show'

const EVENT_MOUSEDOWN = 'mousedown.bs.backdrop'

class Backdrop {
  constructor(isVisible = true, isAnimated = false) {
    this._isVisible = isVisible
    this._isAnimated = isAnimated
    this._isAppended = false
    this._elem = this._createElement()
  }

  _get() {
    return this._elem
  }

  onClick(callback) {
    this._clickCallback = callback
  }

  show(callback) {
    if (!this._isVisible) {
      execute(callback)
      return
    }

    if (this._isAnimated) {
      this._get().classList.add(CLASS_NAME_FADE)
    }

    this._append()

    if (this._isAnimated) {
      reflow(this._get())
    }

    this._get().classList.add(CLASS_NAME_SHOW)

    this._emulateAnimation(() => {
      execute(callback)
    })
  }

  hide(callback) {
    EventHandler.off(this._get(), EVENT_MOUSEDOWN)

    if (!this._isVisible) {
      execute(callback)
      return
    }

    this._get().classList.remove(CLASS_NAME_SHOW)

    this._emulateAnimation(() => {
      this._remove()
      execute(callback)
    })
  }

  _createElement() {
    const backdrop = document.createElement('div')
    backdrop.className = CLASS_NAME_BACKDROP

    return backdrop
  }

  _append() {
    if (this._isAppended) {
      return
    }

    document.body.appendChild(this._get())

    EventHandler.on(this._get(), EVENT_MOUSEDOWN, () => {
      execute(this._clickCallback)
    })

    this._isAppended = true
  }

  _remove() {
    if (!this._isAppended) {
      return
    }

    this._get().parentNode.removeChild(this._get())
    this._isAppended = false
  }

  _emulateAnimation(callback) {
    if (!this._isAnimated) {
      execute(callback)
      return
    }

    const backdropTransitionDuration = getTransitionDurationFromElement(this._get())
    setTimeout(() => execute(callback), backdropTransitionDuration + 5)
  }
}

export default Backdrop
