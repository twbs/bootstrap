import $ from 'jquery'

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): helper.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Helper = (() => {


  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const DATA_KEY  = 'bs.helper'
  const EVENT_KEY = `.${DATA_KEY}`

  const Selector = {
    CUSTOMFILE : '.custom-file input[type="file"]'
  }

  const Event = {
    INPUTCHANGE : `change${EVENT_KEY}`
  }

  const ClassName = {
    CUSTOMFILECONTROL : 'custom-file-control'
  }

  function handleInputChange() {
    const $fileControl = $(this).parent().find(`.${ClassName.CUSTOMFILECONTROL}`)
    if ($fileControl.length === 1) {
      $fileControl.text(this.value)
    }
  }

  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  $(document).on(Event.INPUTCHANGE, Selector.CUSTOMFILE, handleInputChange)
})(jQuery)

export default Helper
