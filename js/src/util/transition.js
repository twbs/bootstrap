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
  constructor(element, transitionName) {
    this._element = element
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

  startEnter() {
    if (this._transitionName) {
      this._element.classList.add(this._transitionClass.enter)
      this._element.classList.add(this._transitionClass.enterActive)
    }

    this._transitionDuration = getTransitionDurationFromElement(this._element)

    if (this._transitionName) {
      nextAnimationFrame(() => {
        this._element.classList.remove(this._transitionClass.enter)
        this._element.classList.add(this._transitionClass.enterTo)
      })
    }
  }

  startLeave() {
    if (this._transitionName) {
      this._element.classList.add(this._transitionClass.leave)
      this._element.classList.add(this._transitionClass.leaveActive)
    }

    this._transitionDuration = getTransitionDurationFromElement(this._element)

    if (this._transitionName) {
      nextAnimationFrame(() => {
        this._element.classList.remove(this._transitionClass.leave)
        this._element.classList.add(this._transitionClass.leaveTo)
      })
    }
  }

  endEnter(callback) {
    this._endEnterLeave(callback, [this._transitionClass.enterActive, this._transitionClass.enterTo])
  }

  endLeave(callback) {
    this._endEnterLeave(callback, [this._transitionClass.leaveActive, this._transitionClass.leaveTo])
  }

  // Private

  _endEnterLeave(callback, classList) {
    const transitionEnd = () => {
      classList.forEach(className => this._element.classList.remove(className))
      callback()
    }

    if (this._transitionDuration) {
      EventHandler.one(this._element, TRANSITION_END, transitionEnd)
      emulateTransitionEnd(this._element, this._transitionDuration)
    } else {
      transitionEnd()
    }
  }
}

export default Transition
