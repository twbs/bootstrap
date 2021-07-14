import { DefaultAllowlist, sanitizeHtml } from './sanitizer'
import { getElement, isElement, typeCheckConfig } from '../util/index'
import SelectorEngine from '../dom/selector-engine'

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.1): util/template-factory.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
const NAME = 'TemplateFactory'
const Default = {
  appendFunction: null,
  extraClass: '',
  template: '<div></div>',
  content: {}, // { selector : text ,  selector2 : text2 , }
  html: false,
  sanitize: true,
  sanitizeFn: null,
  allowList: DefaultAllowlist
}

const DefaultType = {
  appendFunction: '(function|null)',
  extraClass: '(string|function)',
  template: 'string',
  content: 'object',
  html: 'boolean',
  sanitize: 'boolean',
  sanitizeFn: '(null|function)',
  allowList: 'object'
}
const DefaultContentType = {
  selector: '(string|element|function)',
  entry: '(string|element|function)'
}

class TemplateFactory {
  constructor(config) {
    this._config = this._getConfig(config)
  }

  // Getters

  static get NAME() {
    return NAME
  }

  static get Default() {
    return Default
  }

  // Public

  getContent() {
    return Object.values(this._config.content)
  }

  hasContent() {
    return this.getContent().length > 0
  }

  getHtml() {
    const templateWrapper = document.createElement('div')
    templateWrapper.innerHTML = this._maybeSanitize(this._config.template)

    for (const [selector, text] of Object.entries(this._config.content)) {
      this._setContent(templateWrapper, text, selector)
    }

    const template = templateWrapper.children[0]
    template.classList.add(...this._parseMaybeFunction(this._config.extraClass).split(' '))
    return template
  }

  append() {
    if (typeof this._config.appendFunction === 'function') {
      this._config.appendFunction(this.getHtml())
    }
  }

  // Private
  _getConfig(config) {
    config = {
      ...Default,
      ...(typeof config === 'object' ? config : {})
    }

    typeCheckConfig(NAME, config, DefaultType)

    for (const [selector, content] of Object.entries(config.content)) {
      typeCheckConfig(NAME, { selector, entry: content }, DefaultContentType)
    }

    return config
  }

  _setContent(template, content, selector) {
    const templateElement = SelectorEngine.findOne(selector, template)

    if (templateElement === null) {
      return
    }

    if (!content) {
      templateElement.remove()
      return
    }

    content = this._parseMaybeFunction(content)

    if (isElement(content)) {
      this._putElementInTemplate(content, templateElement)
      return
    }

    content = this._maybeSanitize(content)

    if (this._config.html) {
      templateElement.innerHTML = content
    } else {
      templateElement.textContent = content
    }
  }

  _maybeSanitize(content) {
    return this._config.sanitize ? sanitizeHtml(content, this._config.allowList, this._config.sanitizeFn) : content
  }

  _parseMaybeFunction(content) {
    return typeof content === 'function' ? content(this) : content
  }

  _putElementInTemplate(content, templateElement) {
    content = getElement(content)

    if (this._config.html) {
      if (content.parentNode !== templateElement) { // guess we are avoiding infinite loop
        templateElement.innerHTML = ''
        templateElement.appendChild(content)
      }
    } else {
      templateElement.textContent = content.textContent
    }
  }
}

export default TemplateFactory
