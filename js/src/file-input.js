/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.0-alpha2): file-input.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import { getjQuery } from './util/index'
import Data from './dom/data'
import EventHandler from './dom/event-handler'
import SelectorEngine from './dom/selector-engine'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'fileInput'
const VERSION = '5.0.0-alpha2'
const DATA_KEY = 'bs.file-input'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'

const SELECTOR_DATA_TOGGLE = '[data-toggle="file-input"]'
const SELECTOR_FILE_INPUT = '.form-file-input'
const SELECTOR_FILE_INPUT_LABEL = '.form-file-text'
const SELECTOR_FORM = 'form'

const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`
const EVENT_CHANGE_DATA_API = `change${EVENT_KEY}${DATA_API_KEY}`
const EVENT_RESET_DATA_API = `reset${EVENT_KEY}${DATA_API_KEY}`

// TODO: remove when we drop Opera Mini support
const HAS_FILE_API = Boolean(window.File)
const FAKE_PATH = 'fakepath'
const FAKE_PATH_SEPARATOR = '\\'

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class FileInput {
  constructor(element) {
    this._element = element
    this._labelInput = SelectorEngine.findOne(SELECTOR_FILE_INPUT_LABEL, this._element)
    this._input = SelectorEngine.findOne(SELECTOR_FILE_INPUT, this._element)
    this._defaultText = this._labelInput.textContent

    EventHandler.on(this._input, EVENT_CHANGE_DATA_API, () => this._handleChange())
    Data.setData(element, DATA_KEY, this)
  }

  // Getters

  static get VERSION() {
    return VERSION
  }

  // Public

  dispose() {
    [window, this._element].forEach(htmlElement => EventHandler.off(htmlElement, EVENT_KEY))

    Data.removeData(this._element, DATA_KEY)
    this._element = null
  }

  restoreDefaultText() {
    this._labelInput.textContent = this._defaultText
  }

  // Private

  _handleChange() {
    const inputValue = this._getSelectedFiles()

    if (inputValue.length) {
      this._labelInput.textContent = inputValue
    } else {
      this.restoreDefaultText()
    }
  }

  _getSelectedFiles() {
    if (this._input.hasAttribute('multiple') && HAS_FILE_API) {
      return [].slice.call(this._input.files)
        .map(file => file.name)
        .join(', ')
    }

    if (this._input.value.indexOf(FAKE_PATH) !== -1) {
      const splitValue = this._input.value.split(FAKE_PATH_SEPARATOR)

      return splitValue[splitValue.length - 1]
    }

    return this._input.value
  }

  // Static

  static jQueryInterface() {
    return this.each(function () {
      FileInput.createInstance(this)
    })
  }

  static getInstance(element) {
    return Data.getData(element, DATA_KEY)
  }

  static createInstance(element) {
    return Data.getData(element, DATA_KEY) ?
      Data.getData(element, DATA_KEY) :
      new FileInput(element)
  }
}

/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */
EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, event => {
  FileInput.createInstance(event.target.closest(SELECTOR_DATA_TOGGLE))
})

EventHandler.on(document, EVENT_RESET_DATA_API, SELECTOR_FORM, event => {
  const form = event.target

  SelectorEngine.find(SELECTOR_DATA_TOGGLE, form)
    .filter(inputFileNode => FileInput.getInstance(inputFileNode))
    .forEach(inputFileNode => {
      const inputFile = FileInput.getInstance(inputFileNode)

      inputFile.restoreDefaultText()
    })
})

const $ = getjQuery()

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .fileInput to jQuery only if jQuery is present
 */

/* istanbul ignore if */
if ($) {
  const JQUERY_NO_CONFLICT = $.fn[NAME]
  $.fn[NAME] = FileInput.jQueryInterface
  $.fn[NAME].Constructor = FileInput
  $.fn[NAME].noConflict = () => {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return FileInput.jQueryInterface
  }
}

export default FileInput
