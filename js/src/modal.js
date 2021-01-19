/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.6.0): modal.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import $ from 'jquery'
import Util from './util'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'modal'
const VERSION = '4.6.0'
const DATA_KEY = 'bs.modal'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'
const JQUERY_NO_CONFLICT = $.fn[NAME]
const ESCAPE_KEYCODE = 27 // KeyboardEvent.which value for Escape (Esc) key

const Default = {
  backdrop: true,
  keyboard: true,
  focus: true,
  show: true
}

const DefaultType = {
  backdrop: '(boolean|string)',
  keyboard: 'boolean',
  focus: 'boolean',
  show: 'boolean'
}

const EVENT_HIDE = `hide${EVENT_KEY}`
const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY}`
const EVENT_HIDDEN = `hidden${EVENT_KEY}`
const EVENT_SHOW = `show${EVENT_KEY}`
const EVENT_SHOWN = `shown${EVENT_KEY}`
const EVENT_FOCUSIN = `focusin${EVENT_KEY}`
const EVENT_RESIZE = `resize${EVENT_KEY}`
const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY}`
const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY}`
const EVENT_MOUSEUP_DISMISS = `mouseup.dismiss${EVENT_KEY}`
const EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY}`
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`

const CLASS_NAME_SCROLLABLE = 'modal-dialog-scrollable'
const CLASS_NAME_SCROLLBAR_MEASURER = 'modal-scrollbar-measure'
const CLASS_NAME_BACKDROP = 'modal-backdrop'
const CLASS_NAME_OPEN = 'modal-open'
const CLASS_NAME_FADE = 'fade'
const CLASS_NAME_SHOW = 'show'
const CLASS_NAME_STATIC = 'modal-static'

const SELECTOR_DIALOG = '.modal-dialog'
const SELECTOR_MODAL_BODY = '.modal-body'
const SELECTOR_DATA_TOGGLE = '[data-toggle="modal"]'
const SELECTOR_DATA_DISMISS = '[data-dismiss="modal"]'
const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top'
const SELECTOR_STICKY_CONTENT = '.sticky-top'

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Modal {
  constructor(element, config) {
    this._config = this._getConfig(config)
    this._element = element
    this._dialog = element.querySelector(SELECTOR_DIALOG)
    this._backdrop = null
    this._isShown = false
    this._isBodyOverflowing = false
    this._ignoreBackdropClick = false
    this._isTransitioning = false
    this._scrollbarWidth = 0
  }

  // Getters

  static get VERSION() {
    return VERSION
  }

  static get Default() {
    return Default
  }

  // Public

  toggle(relatedTarget) {
    return this._isShown ? this.hide() : this.show(relatedTarget)
  }

  show(relatedTarget) {
    if (this._isShown || this._isTransitioning) {
      return
    }

    if ($(this._element).hasClass(CLASS_NAME_FADE)) {
      this._isTransitioning = true
    }

    const showEvent = $.Event(EVENT_SHOW, {
      relatedTarget
    })

    $(this._element).trigger(showEvent)

    if (this._isShown || showEvent.isDefaultPrevented()) {
      return
    }

    this._isShown = true

    this._checkScrollbar()
    this._setScrollbar()

    this._adjustDialog()

    this._setEscapeEvent()
    this._setResizeEvent()

    $(this._element).on(
      EVENT_CLICK_DISMISS,
      SELECTOR_DATA_DISMISS,
      event => this.hide(event)
    )

    $(this._dialog).on(EVENT_MOUSEDOWN_DISMISS, () => {
      $(this._element).one(EVENT_MOUSEUP_DISMISS, event => {
        if ($(event.target).is(this._element)) {
          this._ignoreBackdropClick = true
        }
      })
    })

    this._showBackdrop(() => this._showElement(relatedTarget))
  }

  hide(event) {
    if (event) {
      event.preventDefault()
    }

    if (!this._isShown || this._isTransitioning) {
      return
    }

    const hideEvent = $.Event(EVENT_HIDE)

    $(this._element).trigger(hideEvent)

    if (!this._isShown || hideEvent.isDefaultPrevented()) {
      return
    }

    this._isShown = false
    const transition = $(this._element).hasClass(CLASS_NAME_FADE)

    if (transition) {
      this._isTransitioning = true
    }

    this._setEscapeEvent()
    this._setResizeEvent()

    $(document).off(EVENT_FOCUSIN)

    $(this._element).removeClass(CLASS_NAME_SHOW)

    $(this._element).off(EVENT_CLICK_DISMISS)
    $(this._dialog).off(EVENT_MOUSEDOWN_DISMISS)

    if (transition) {
      const transitionDuration = Util.getTransitionDurationFromElement(this._element)

      $(this._element)
        .one(Util.TRANSITION_END, event => this._hideModal(event))
        .emulateTransitionEnd(transitionDuration)
    } else {
      this._hideModal()
    }
  }

  dispose() {
    [window, this._element, this._dialog]
      .forEach(htmlElement => $(htmlElement).off(EVENT_KEY))

    /**
     * `document` has 2 events `EVENT_FOCUSIN` and `EVENT_CLICK_DATA_API`
     * Do not move `document` in `htmlElements` array
     * It will remove `EVENT_CLICK_DATA_API` event that should remain
     */
    $(document).off(EVENT_FOCUSIN)

    $.removeData(this._element, DATA_KEY)

    this._config = null
    this._element = null
    this._dialog = null
    this._backdrop = null
    this._isShown = null
    this._isBodyOverflowing = null
    this._ignoreBackdropClick = null
    this._isTransitioning = null
    this._scrollbarWidth = null
  }

  handleUpdate() {
    this._adjustDialog()
  }

  // Private

  _getConfig(config) {
    config = {
      ...Default,
      ...config
    }
    Util.typeCheckConfig(NAME, config, DefaultType)
    return config
  }

  _triggerBackdropTransition() {
    const hideEventPrevented = $.Event(EVENT_HIDE_PREVENTED)

    $(this._element).trigger(hideEventPrevented)
    if (hideEventPrevented.isDefaultPrevented()) {
      return
    }

    const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight

    if (!isModalOverflowing) {
      this._element.style.overflowY = 'hidden'
    }

    this._element.classList.add(CLASS_NAME_STATIC)

    const modalTransitionDuration = Util.getTransitionDurationFromElement(this._dialog)
    $(this._element).off(Util.TRANSITION_END)

    $(this._element).one(Util.TRANSITION_END, () => {
      this._element.classList.remove(CLASS_NAME_STATIC)
      if (!isModalOverflowing) {
        $(this._element).one(Util.TRANSITION_END, () => {
          this._element.style.overflowY = ''
        })
          .emulateTransitionEnd(this._element, modalTransitionDuration)
      }
    })
      .emulateTransitionEnd(modalTransitionDuration)
    this._element.focus()
  }

  _showElement(relatedTarget) {
    const transition = $(this._element).hasClass(CLASS_NAME_FADE)
    const modalBody = this._dialog ? this._dialog.querySelector(SELECTOR_MODAL_BODY) : null

    if (!this._element.parentNode ||
        this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
      // Don't move modal's DOM position
      document.body.appendChild(this._element)
    }

    this._element.style.display = 'block'
    this._element.removeAttribute('aria-hidden')
    this._element.setAttribute('aria-modal', true)
    this._element.setAttribute('role', 'dialog')

    if ($(this._dialog).hasClass(CLASS_NAME_SCROLLABLE) && modalBody) {
      modalBody.scrollTop = 0
    } else {
      this._element.scrollTop = 0
    }

    if (transition) {
      Util.reflow(this._element)
    }

    $(this._element).addClass(CLASS_NAME_SHOW)

    if (this._config.focus) {
      this._enforceFocus()
    }

    const shownEvent = $.Event(EVENT_SHOWN, {
      relatedTarget
    })

    const transitionComplete = () => {
      if (this._config.focus) {
        this._element.focus()
      }

      this._isTransitioning = false
      $(this._element).trigger(shownEvent)
    }

    if (transition) {
      const transitionDuration = Util.getTransitionDurationFromElement(this._dialog)

      $(this._dialog)
        .one(Util.TRANSITION_END, transitionComplete)
        .emulateTransitionEnd(transitionDuration)
    } else {
      transitionComplete()
    }
  }

  _enforceFocus() {
    $(document)
      .off(EVENT_FOCUSIN) // Guard against infinite focus loop
      .on(EVENT_FOCUSIN, event => {
        if (document !== event.target &&
            this._element !== event.target &&
            $(this._element).has(event.target).length === 0) {
          this._element.focus()
        }
      })
  }

  _setEscapeEvent() {
    if (this._isShown) {
      $(this._element).on(EVENT_KEYDOWN_DISMISS, event => {
        if (this._config.keyboard && event.which === ESCAPE_KEYCODE) {
          event.preventDefault()
          this.hide()
        } else if (!this._config.keyboard && event.which === ESCAPE_KEYCODE) {
          this._triggerBackdropTransition()
        }
      })
    } else if (!this._isShown) {
      $(this._element).off(EVENT_KEYDOWN_DISMISS)
    }
  }

  _setResizeEvent() {
    if (this._isShown) {
      $(window).on(EVENT_RESIZE, event => this.handleUpdate(event))
    } else {
      $(window).off(EVENT_RESIZE)
    }
  }

  _hideModal() {
    this._element.style.display = 'none'
    this._element.setAttribute('aria-hidden', true)
    this._element.removeAttribute('aria-modal')
    this._element.removeAttribute('role')
    this._isTransitioning = false
    this._showBackdrop(() => {
      $(document.body).removeClass(CLASS_NAME_OPEN)
      this._resetAdjustments()
      this._resetScrollbar()
      $(this._element).trigger(EVENT_HIDDEN)
    })
  }

  _removeBackdrop() {
    if (this._backdrop) {
      $(this._backdrop).remove()
      this._backdrop = null
    }
  }

  _showBackdrop(callback) {
    const animate = $(this._element).hasClass(CLASS_NAME_FADE) ?
      CLASS_NAME_FADE : ''

    if (this._isShown && this._config.backdrop) {
      this._backdrop = document.createElement('div')
      this._backdrop.className = CLASS_NAME_BACKDROP

      if (animate) {
        this._backdrop.classList.add(animate)
      }

      $(this._backdrop).appendTo(document.body)

      $(this._element).on(EVENT_CLICK_DISMISS, event => {
        if (this._ignoreBackdropClick) {
          this._ignoreBackdropClick = false
          return
        }

        if (event.target !== event.currentTarget) {
          return
        }

        if (this._config.backdrop === 'static') {
          this._triggerBackdropTransition()
        } else {
          this.hide()
        }
      })

      if (animate) {
        Util.reflow(this._backdrop)
      }

      $(this._backdrop).addClass(CLASS_NAME_SHOW)

      if (!callback) {
        return
      }

      if (!animate) {
        callback()
        return
      }

      const backdropTransitionDuration = Util.getTransitionDurationFromElement(this._backdrop)

      $(this._backdrop)
        .one(Util.TRANSITION_END, callback)
        .emulateTransitionEnd(backdropTransitionDuration)
    } else if (!this._isShown && this._backdrop) {
      $(this._backdrop).removeClass(CLASS_NAME_SHOW)

      const callbackRemove = () => {
        this._removeBackdrop()
        if (callback) {
          callback()
        }
      }

      if ($(this._element).hasClass(CLASS_NAME_FADE)) {
        const backdropTransitionDuration = Util.getTransitionDurationFromElement(this._backdrop)

        $(this._backdrop)
          .one(Util.TRANSITION_END, callbackRemove)
          .emulateTransitionEnd(backdropTransitionDuration)
      } else {
        callbackRemove()
      }
    } else if (callback) {
      callback()
    }
  }

  // ----------------------------------------------------------------------
  // the following methods are used to handle overflowing modals
  // todo (fat): these should probably be refactored out of modal.js
  // ----------------------------------------------------------------------

  _adjustDialog() {
    const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight

    if (!this._isBodyOverflowing && isModalOverflowing) {
      this._element.style.paddingLeft = `${this._scrollbarWidth}px`
    }

    if (this._isBodyOverflowing && !isModalOverflowing) {
      this._element.style.paddingRight = `${this._scrollbarWidth}px`
    }
  }

  _resetAdjustments() {
    this._element.style.paddingLeft = ''
    this._element.style.paddingRight = ''
  }

  _checkScrollbar() {
    const rect = document.body.getBoundingClientRect()
    this._isBodyOverflowing = Math.round(rect.left + rect.right) < window.innerWidth
    this._scrollbarWidth = this._getScrollbarWidth()
  }

  _setScrollbar() {
    if (this._isBodyOverflowing) {
      // Note: DOMNode.style.paddingRight returns the actual value or '' if not set
      //   while $(DOMNode).css('padding-right') returns the calculated value or 0 if not set
      const fixedContent = [].slice.call(document.querySelectorAll(SELECTOR_FIXED_CONTENT))
      const stickyContent = [].slice.call(document.querySelectorAll(SELECTOR_STICKY_CONTENT))

      // Adjust fixed content padding
      $(fixedContent).each((index, element) => {
        const actualPadding = element.style.paddingRight
        const calculatedPadding = $(element).css('padding-right')
        $(element)
          .data('padding-right', actualPadding)
          .css('padding-right', `${parseFloat(calculatedPadding) + this._scrollbarWidth}px`)
      })

      // Adjust sticky content margin
      $(stickyContent).each((index, element) => {
        const actualMargin = element.style.marginRight
        const calculatedMargin = $(element).css('margin-right')
        $(element)
          .data('margin-right', actualMargin)
          .css('margin-right', `${parseFloat(calculatedMargin) - this._scrollbarWidth}px`)
      })

      // Adjust body padding
      const actualPadding = document.body.style.paddingRight
      const calculatedPadding = $(document.body).css('padding-right')
      $(document.body)
        .data('padding-right', actualPadding)
        .css('padding-right', `${parseFloat(calculatedPadding) + this._scrollbarWidth}px`)
    }

    $(document.body).addClass(CLASS_NAME_OPEN)
  }

  _resetScrollbar() {
    // Restore fixed content padding
    const fixedContent = [].slice.call(document.querySelectorAll(SELECTOR_FIXED_CONTENT))
    $(fixedContent).each((index, element) => {
      const padding = $(element).data('padding-right')
      $(element).removeData('padding-right')
      element.style.paddingRight = padding ? padding : ''
    })

    // Restore sticky content
    const elements = [].slice.call(document.querySelectorAll(`${SELECTOR_STICKY_CONTENT}`))
    $(elements).each((index, element) => {
      const margin = $(element).data('margin-right')
      if (typeof margin !== 'undefined') {
        $(element).css('margin-right', margin).removeData('margin-right')
      }
    })

    // Restore body padding
    const padding = $(document.body).data('padding-right')
    $(document.body).removeData('padding-right')
    document.body.style.paddingRight = padding ? padding : ''
  }

  _getScrollbarWidth() { // thx d.walsh
    const scrollDiv = document.createElement('div')
    scrollDiv.className = CLASS_NAME_SCROLLBAR_MEASURER
    document.body.appendChild(scrollDiv)
    const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth
    document.body.removeChild(scrollDiv)
    return scrollbarWidth
  }

  // Static

  static _jQueryInterface(config, relatedTarget) {
    return this.each(function () {
      let data = $(this).data(DATA_KEY)
      const _config = {
        ...Default,
        ...$(this).data(),
        ...(typeof config === 'object' && config ? config : {})
      }

      if (!data) {
        data = new Modal(this, _config)
        $(this).data(DATA_KEY, data)
      }

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`)
        }

        data[config](relatedTarget)
      } else if (_config.show) {
        data.show(relatedTarget)
      }
    })
  }
}

/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

$(document).on(EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  let target
  const selector = Util.getSelectorFromElement(this)

  if (selector) {
    target = document.querySelector(selector)
  }

  const config = $(target).data(DATA_KEY) ?
    'toggle' : {
      ...$(target).data(),
      ...$(this).data()
    }

  if (this.tagName === 'A' || this.tagName === 'AREA') {
    event.preventDefault()
  }

  const $target = $(target).one(EVENT_SHOW, showEvent => {
    if (showEvent.isDefaultPrevented()) {
      // Only register focus restorer if modal will actually get shown
      return
    }

    $target.one(EVENT_HIDDEN, () => {
      if ($(this).is(':visible')) {
        this.focus()
      }
    })
  })

  Modal._jQueryInterface.call($(target), config, this)
})

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 */

$.fn[NAME] = Modal._jQueryInterface
$.fn[NAME].Constructor = Modal
$.fn[NAME].noConflict = () => {
  $.fn[NAME] = JQUERY_NO_CONFLICT
  return Modal._jQueryInterface
}

export default Modal
