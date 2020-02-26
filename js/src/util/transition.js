/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.3.1): util/transition.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import {
  TRANSITION_END,
  emulateTransitionEnd,
  getTransitionDurationFromElement,
  nextAnimationFrame
} from './index'
import EventHandler from '../dom/event-handler'

class Transition {
  constructor(transitionName) {
    this._transitionName = transitionName
    this._transitionClass = {
      enter: `${this._transitionName}-enter`,
      enterTo: `${this._transitionName}-enter-to`,
      enterActive: `${this._transitionName}-enter-active`,
      leave: `${this._transitionName}-leave`,
      leaveTo: `${this._transitionName}-leave-to`,
      leaveActive: `${this._transitionName}-leave-active`
    }
    this._transitionDuration = 0
  }

  // Public

  startEnter(element) {
    this._clearClass(element)
    this._cancelCallback(element)

    if (this._transitionName) {
      element.classList.add(this._transitionClass.enter)
      element.classList.add(this._transitionClass.enterActive)
    }

    this._transitionDuration = getTransitionDurationFromElement(element)

    if (this._transitionName) {
      nextAnimationFrame(() => {
        element.classList.remove(this._transitionClass.enter)
        element.classList.add(this._transitionClass.enterTo)
      })
    }
  }

  startLeave(element) {
    this._clearClass(element)
    this._cancelCallback(element)

    if (this._transitionName) {
      element.classList.add(this._transitionClass.leave)
      element.classList.add(this._transitionClass.leaveActive)
    }

    this._transitionDuration = getTransitionDurationFromElement(element)

    if (this._transitionName) {
      nextAnimationFrame(() => {
        element.classList.remove(this._transitionClass.leave)
        element.classList.add(this._transitionClass.leaveTo)
      })
    }
  }

  endEnter(element, callback) {
    this._endEnterLeave(element, [this._transitionClass.enterActive, this._transitionClass.enterTo], callback)
  }

  endLeave(element, callback) {
    this._endEnterLeave(element, [this._transitionClass.leaveActive, this._transitionClass.leaveTo], callback)
  }

  // Private

  _endEnterLeave(element, classList, callback) {
    const transitionEnd = () => {
      classList.forEach(className => element.classList.remove(className))
      if (callback) {
        callback()
      }
    }

    if (this._transitionDuration) {
      EventHandler.one(element, TRANSITION_END, transitionEnd)
      emulateTransitionEnd(element, this._transitionDuration)
    } else {
      transitionEnd()
    }
  }

  _clearClass(element) {
    Object.keys(this._transitionClass).forEach(key => {
      element.classList.remove(this._transitionClass[key])
    })
  }

  _cancelCallback(element) {
    EventHandler.off(element, TRANSITION_END)
  }
}

export default Transition
