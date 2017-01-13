import Tooltip from './tooltip'


/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-alpha.6): popover.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Popover = (($) => {


  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME                = 'popover'
  const VERSION             = '4.0.0-alpha.6'
  const DATA_KEY            = 'bs.popover'
  const EVENT_KEY           = `.${DATA_KEY}`
  const JQUERY_NO_CONFLICT  = $.fn[NAME]

  const Default = $.extend({}, Tooltip.Default, {
    placement : 'right',
    trigger   : 'click',
    content   : '',
    template  : '<div class="popover" role="tooltip">'
              + '<h3 class="popover-title"></h3>'
              + '<div class="popover-content"></div></div>'
  })

  const DefaultType = $.extend({}, Tooltip.DefaultType, {
    content : '(string|element|function)'
  })

  const CLASS_NAME_FADE = 'fade'
  const CLASS_NAME_SHOW = 'show'

  const SELECTOR_TITLE = '.popover-title'
  const SELECTOR_CONTENT = '.popover-content'


  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Popover extends Tooltip {


    // getters

    static get VERSION() {
      return VERSION
    }

    static get Default() {
      return Default
    }

    static get NAME() {
      return NAME
    }

    static get DATA_KEY() {
      return DATA_KEY
    }

    static getEvent(eventName) {
      return `${eventName}${EVENT_KEY}`
    }

    static get EVENT_KEY() {
      return EVENT_KEY
    }

    static get DefaultType() {
      return DefaultType
    }


    // overrides

    isWithContent() {
      return this.getTitle() || this._getContent()
    }

    getTipElement() {
      return this.tip = this.tip || $(this.config.template)[0]
    }

    setContent() {
      const $tip = $(this.getTipElement())

      // we use append for html objects to maintain js events
      this.setElementContent($tip.find(SELECTOR_TITLE), this.getTitle())
      this.setElementContent($tip.find(SELECTOR_CONTENT), this._getContent())

      $tip.removeClass(`${CLASS_NAME_FADE} ${CLASS_NAME_SHOW}`)

      this.cleanupTether()
    }

    // private

    _getContent() {
      return this.element.getAttribute('data-content')
        || (typeof this.config.content === 'function' ?
              this.config.content.call(this.element) :
              this.config.content)
    }


    // static

    static _jQueryInterface(config) {
      return this.each(function () {
        let data      = $(this).data(DATA_KEY)
        const _config = typeof config === 'object' ? config : null

        if (!data && /destroy|hide/.test(config)) {
          return
        }

        if (!data) {
          data = new Popover(this, _config)
          $(this).data(DATA_KEY, data)
        }

        if (typeof config === 'string') {
          if (data[config] === undefined) {
            throw new Error(`No method named "${config}"`)
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
   */

  $.fn[NAME]             = Popover._jQueryInterface
  $.fn[NAME].Constructor = Popover
  $.fn[NAME].noConflict  = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Popover._jQueryInterface
  }

  return Popover

})(jQuery)

export default Popover
