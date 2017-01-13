import Util from './util'


/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-alpha.6): modal.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Modal = (($) => {


  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME                         = 'modal'
  const VERSION                      = '4.0.0-alpha.6'
  const DATA_KEY                     = 'bs.modal'
  const EVENT_KEY                    = `.${DATA_KEY}`
  const DATA_API_KEY                 = '.data-api'
  const JQUERY_NO_CONFLICT           = $.fn[NAME]
  const TRANSITION_DURATION          = 300
  const BACKDROP_TRANSITION_DURATION = 150
  const ESCAPE_KEYCODE               = 27 // KeyboardEvent.which value for Escape (Esc) key

  const Default = {
    backdrop : true,
    keyboard : true,
    focus    : true,
    show     : true
  }

  const DefaultType = {
    backdrop : '(boolean|string)',
    keyboard : 'boolean',
    focus    : 'boolean',
    show     : 'boolean'
  }

  const EVENT_HIDE = `hide${EVENT_KEY}`
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

  const CLASS_NAME_SCROLLBAR_MEASURER = 'modal-scrollbar-measure'
  const CLASS_NAME_BACKDROP = 'modal-backdrop'
  const CLASS_NAME_OPEN = 'modal-open'
  const CLASS_NAME_FADE = 'fade'
  const CLASS_NAME_SHOW = 'show'

  const SELECTOR_DIALOG = '.modal-dialog'
  const SELECTOR_DATA_TOGGLE = '[data-toggle="modal"]'
  const SELECTOR_DATA_DISMISS = '[data-dismiss="modal"]'
  const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top'


  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Modal {

    constructor(element, config) {
      this._config              = this._getConfig(config)
      this._element             = element
      this._dialog              = $(element).find(SELECTOR_DIALOG)[0]
      this._backdrop            = null
      this._isShown             = false
      this._isBodyOverflowing   = false
      this._ignoreBackdropClick = false
      this._isTransitioning     = false
      this._originalBodyPadding = 0
      this._scrollbarWidth      = 0
    }


    // getters

    static get VERSION() {
      return VERSION
    }

    static get Default() {
      return Default
    }


    // public

    toggle(relatedTarget) {
      return this._isShown ? this.hide() : this.show(relatedTarget)
    }

    show(relatedTarget) {
      if (this._isTransitioning) {
        throw new Error('Modal is transitioning')
      }

      if (Util.supportsTransitionEnd() &&
        $(this._element).hasClass(CLASS_NAME_FADE)) {
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

      $(document.body).addClass(CLASS_NAME_OPEN)

      this._setEscapeEvent()
      this._setResizeEvent()

      $(this._element).on(
        EVENT_CLICK_DISMISS,
        SELECTOR_DATA_DISMISS,
        (event) => this.hide(event)
      )

      $(this._dialog).on(EVENT_MOUSEDOWN_DISMISS, () => {
        $(this._element).one(EVENT_MOUSEUP_DISMISS, (event) => {
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

      if (this._isTransitioning) {
        throw new Error('Modal is transitioning')
      }

      const transition = Util.supportsTransitionEnd() &&
        $(this._element).hasClass(CLASS_NAME_FADE)
      if (transition) {
        this._isTransitioning = true
      }

      const hideEvent = $.Event(EVENT_HIDE)
      $(this._element).trigger(hideEvent)

      if (!this._isShown || hideEvent.isDefaultPrevented()) {
        return
      }

      this._isShown = false

      this._setEscapeEvent()
      this._setResizeEvent()

      $(document).off(EVENT_FOCUSIN)

      $(this._element).removeClass(CLASS_NAME_SHOW)

      $(this._element).off(EVENT_CLICK_DISMISS)
      $(this._dialog).off(EVENT_MOUSEDOWN_DISMISS)

      if (transition) {
        $(this._element)
          .one(Util.TRANSITION_END, (event) => this._hideModal(event))
          .emulateTransitionEnd(TRANSITION_DURATION)
      } else {
        this._hideModal()
      }
    }

    dispose() {
      $.removeData(this._element, DATA_KEY)

      $(window, document, this._element, this._backdrop).off(EVENT_KEY)

      this._config              = null
      this._element             = null
      this._dialog              = null
      this._backdrop            = null
      this._isShown             = null
      this._isBodyOverflowing   = null
      this._ignoreBackdropClick = null
      this._originalBodyPadding = null
      this._scrollbarWidth      = null
    }


    // private

    _getConfig(config) {
      config = $.extend({}, Default, config)
      Util.typeCheckConfig(NAME, config, DefaultType)
      return config
    }

    _showElement(relatedTarget) {
      const transition = Util.supportsTransitionEnd() &&
        $(this._element).hasClass(CLASS_NAME_FADE)

      if (!this._element.parentNode ||
         this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
        // don't move modals dom position
        document.body.appendChild(this._element)
      }

      this._element.style.display = 'block'
      this._element.removeAttribute('aria-hidden')
      this._element.scrollTop = 0

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
        $(this._dialog)
          .one(Util.TRANSITION_END, transitionComplete)
          .emulateTransitionEnd(TRANSITION_DURATION)
      } else {
        transitionComplete()
      }
    }

    _enforceFocus() {
      $(document)
        .off(EVENT_FOCUSIN) // guard against infinite focus loop
        .on(EVENT_FOCUSIN, (event) => {
          if (document !== event.target &&
              this._element !== event.target &&
              !$(this._element).has(event.target).length) {
            this._element.focus()
          }
        })
    }

    _setEscapeEvent() {
      if (this._isShown && this._config.keyboard) {
        $(this._element).on(EVENT_KEYDOWN_DISMISS, (event) => {
          if (event.which === ESCAPE_KEYCODE) {
            this.hide()
          }
        })

      } else if (!this._isShown) {
        $(this._element).off(EVENT_KEYDOWN_DISMISS)
      }
    }

    _setResizeEvent() {
      if (this._isShown) {
        $(window).on(EVENT_RESIZE, (event) => this._handleUpdate(event))
      } else {
        $(window).off(EVENT_RESIZE)
      }
    }

    _hideModal() {
      this._element.style.display = 'none'
      this._element.setAttribute('aria-hidden', 'true')
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
        const doAnimate = Util.supportsTransitionEnd() && animate

        this._backdrop = document.createElement('div')
        this._backdrop.className = CLASS_NAME_BACKDROP

        if (animate) {
          $(this._backdrop).addClass(animate)
        }

        $(this._backdrop).appendTo(document.body)

        $(this._element).on(EVENT_CLICK_DISMISS, (event) => {
          if (this._ignoreBackdropClick) {
            this._ignoreBackdropClick = false
            return
          }
          if (event.target !== event.currentTarget) {
            return
          }
          if (this._config.backdrop === 'static') {
            this._element.focus()
          } else {
            this.hide()
          }
        })

        if (doAnimate) {
          Util.reflow(this._backdrop)
        }

        $(this._backdrop).addClass(CLASS_NAME_SHOW)

        if (!callback) {
          return
        }

        if (!doAnimate) {
          callback()
          return
        }

        $(this._backdrop)
          .one(Util.TRANSITION_END, callback)
          .emulateTransitionEnd(BACKDROP_TRANSITION_DURATION)

      } else if (!this._isShown && this._backdrop) {
        $(this._backdrop).removeClass(CLASS_NAME_SHOW)

        const callbackRemove = () => {
          this._removeBackdrop()
          if (callback) {
            callback()
          }
        }

        if (Util.supportsTransitionEnd() &&
           $(this._element).hasClass(CLASS_NAME_FADE)) {
          $(this._backdrop)
            .one(Util.TRANSITION_END, callbackRemove)
            .emulateTransitionEnd(BACKDROP_TRANSITION_DURATION)
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

    _handleUpdate() {
      this._adjustDialog()
    }

    _adjustDialog() {
      const isModalOverflowing =
        this._element.scrollHeight > document.documentElement.clientHeight

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
      this._isBodyOverflowing = document.body.clientWidth < window.innerWidth
      this._scrollbarWidth = this._getScrollbarWidth()
    }

    _setScrollbar() {
      const bodyPadding = parseInt(
        $(SELECTOR_FIXED_CONTENT).css('padding-right') || 0,
        10
      )

      this._originalBodyPadding = document.body.style.paddingRight || ''

      if (this._isBodyOverflowing) {
        document.body.style.paddingRight =
          `${bodyPadding + this._scrollbarWidth}px`
      }
    }

    _resetScrollbar() {
      document.body.style.paddingRight = this._originalBodyPadding
    }

    _getScrollbarWidth() { // thx d.walsh
      const scrollDiv = document.createElement('div')
      scrollDiv.className = CLASS_NAME_SCROLLBAR_MEASURER
      document.body.appendChild(scrollDiv)
      const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
      document.body.removeChild(scrollDiv)
      return scrollbarWidth
    }


    // static

    static _jQueryInterface(config, relatedTarget) {
      return this.each(function () {
        let data      = $(this).data(DATA_KEY)
        const _config = $.extend(
          {},
          Modal.Default,
          $(this).data(),
          typeof config === 'object' && config
        )

        if (!data) {
          data = new Modal(this, _config)
          $(this).data(DATA_KEY, data)
        }

        if (typeof config === 'string') {
          if (data[config] === undefined) {
            throw new Error(`No method named "${config}"`)
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
      target = $(selector)[0]
    }

    const config = $(target).data(DATA_KEY) ?
      'toggle' : $.extend({}, $(target).data(), $(this).data())

    if (this.tagName === 'A' || this.tagName === 'AREA') {
      event.preventDefault()
    }

    const $target = $(target).one(EVENT_SHOW, (showEvent) => {
      if (showEvent.isDefaultPrevented()) {
        // only register focus restorer if modal will actually get shown
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

  $.fn[NAME]             = Modal._jQueryInterface
  $.fn[NAME].Constructor = Modal
  $.fn[NAME].noConflict  = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Modal._jQueryInterface
  }

  return Modal

})(jQuery)

export default Modal
