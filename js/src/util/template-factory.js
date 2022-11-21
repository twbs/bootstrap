/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.3): util/template-factory.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import { DefaultAllowlist, sanitizeHtml } from './sanitizer'
import { getElement, isElement } from '../util/index'
import SelectorEngine from '../dom/selector-engine'
import Config from './config'

/**
 * Constants
 */

const NAME = 'TemplateFactory'

const Default = {
  allowList: DefaultAllowlist,
  content: {}, // { selector : text ,  selector2 : text2 , }
  extraClass: '',
  html: false,
  sanitize: true,
  sanitizeFn: null,
  template: '<div></div>'
}

const DefaultType = {
  allowList: 'object',
  content: 'object',
  extraClass: '(string|function)',
  html: 'boolean',
  sanitize: 'boolean',
  sanitizeFn: '(null|function)',
  template: 'string'
}

const DefaultContentType = {
  entry: '(string|element|function|null)',
  selector: '(string|element)'
}

/**
 * Class definition
 */

class TemplateFactory extends Config {
  constructor(config) {
    super()
    this._config = this._getConfig(config)
  }

  // Getters
  static get Default() {
    return Default
  }

  static get DefaultType() {
    return DefaultType
  }

  static get NAME() {
    return NAME
  }

  // Public
  getContent() {
    return Object.values(this._config.content)
      .map(config => this._resolvePossibleFunction(config))
      .filter(Boolean)
  }

  hasContent() {
    return this.getContent().length > 0
  }

  changeContent(content) {
    this._checkContent(content)
    this._config.content = { ...this._config.content, ...content }
    return this
  }

  toHtml() {
    const templateWrapper = document.createElement('div')
    templateWrapper.innerHTML = this._maybeSanitize(this._config.template)

    for (const [selector, text] of Object.entries(this._config.content)) {
      this._setContent(templateWrapper, text, selector)
    }

    const template = templateWrapper.children[0]
    const extraClass = this._resolvePossibleFunction(this._config.extraClass)

    if (extraClass) {
      template.classList.add(...extraClass.split(' '))
    }

    return template
  }

  // Private
  _typeCheckConfig(config) {
    super._typeCheckConfig(config)
    this._checkContent(config.content)
  }

  _checkContent(arg) {
    for (const [selector, content] of Object.entries(arg)) {
      super._typeCheckConfig({ selector, entry: content }, DefaultContentType)
    }
  }

  _setContent(template, content, selector) {
    const templateElement = SelectorEngine.findOne(selector, template)

    if (!templateElement) {
      return
    }

    content = this._resolvePossibleFunction(content)

    if (!content) {
      templateElement.remove()
      return
    }

    if (isElement(content)) {
      this._putElementInTemplate(getElement(content), templateElement)
      return
    }

    if (this._config.html) {
      templateElement.innerHTML = this._maybeSanitize(content)
      return
    }

    templateElement.textContent = content
  }

  _maybeSanitize(arg) {
    return this._config.sanitize ? sanitizeHtml(arg, this._config.allowList, this._config.sanitizeFn) : arg
  }

  _resolvePossibleFunction(arg) {
    return typeof arg === 'function' ? arg(this) : arg
  }

  _putElementInTemplate(element, templateElement) {
    if (this._config.html) {
      templateElement.innerHTML = ''
      templateElement.append(element)
      return
    }

    templateElement.textContent = element.textContent
  }
}

export default TemplateFactory
