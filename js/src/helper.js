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
    CUSTOMFILE : '.custom-file input[type="file"]',
    FORM: 'form'
  }

  const Event = {
    INPUTCHANGE : `change${EVENT_KEY}`,
    FORMRESET   : `reset${EVENT_KEY}`
  }

  const ClassName = {
    CUSTOMFILE : 'custom-file',
    CUSTOMFILECONTROL : 'custom-file-control'
  }

  function handleInputChange() {
    const $fileControl = $(this).parent().find(`.${ClassName.CUSTOMFILECONTROL}`)
    if ($fileControl.length === 1) {
      $fileControl.text(this.value)
    }
  }

  function handleFormReset() {
    const $filesControl = $(this).find(`.${ClassName.CUSTOMFILE}`).children(`.${ClassName.CUSTOMFILECONTROL}`)
    if ($filesControl.length > 0) {
      $filesControl.text('')
    }
  }

  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  $(document).on(Event.INPUTCHANGE, Selector.CUSTOMFILE, handleInputChange)
  $(document).on(Event.FORMRESET, Selector.FORM, handleFormReset)
})($)

export default Helper
