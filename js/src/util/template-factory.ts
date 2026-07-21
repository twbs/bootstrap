/**
 * --------------------------------------------------------------------------
 * Bootstrap util/template-factory.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import SelectorEngine from '../dom/selector-engine.js'
import Config, { type ComponentConfig } from './config.js'
import { DefaultAllowlist, sanitizeHtml, type SanitizerAllowList } from './sanitizer.js'
import { execute, getElement, isElement } from './index.js'

/**
 * Constants
 */

const NAME = 'TemplateFactory'

type TemplateContentEntry = string | Element | ((...args: any[]) => string | Element | null) | null

type TemplateFactoryConfig = {
  allowList: SanitizerAllowList
  content: Record<string, TemplateContentEntry>
  extraClass: string | ((...args: any[]) => string)
  html: boolean
  sanitize: boolean
  sanitizeFn: ((unsafeHtml: string) => string) | null
  template: string
}

const Default: TemplateFactoryConfig = {
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
  declare _config: TemplateFactoryConfig

  constructor(config?: Partial<TemplateFactoryConfig> | null) {
    super()
    this._config = this._getConfig(config) as TemplateFactoryConfig
  }

  // Getters
  static override get Default(): TemplateFactoryConfig {
    return Default
  }

  static override get DefaultType(): ComponentConfig {
    return DefaultType
  }

  static override get NAME(): string {
    return NAME
  }

  // Public
  getContent(): Array<string | Element> {
    return Object.values(this._config.content)
      .map(config => this._resolvePossibleFunction(config))
      .filter(Boolean) as Array<string | Element>
  }

  hasContent(): boolean {
    return this.getContent().length > 0
  }

  changeContent(content: Record<string, TemplateContentEntry>): this {
    this._checkContent(content)
    this._config.content = { ...this._config.content, ...content }
    return this
  }

  toHtml(): HTMLElement {
    const templateWrapper = document.createElement('div')
    templateWrapper.innerHTML = this._maybeSanitize(this._config.template)

    for (const [selector, text] of Object.entries(this._config.content)) {
      this._setContent(templateWrapper, text, selector)
    }

    const template = templateWrapper.children[0] as HTMLElement
    const extraClass = this._resolvePossibleFunction(this._config.extraClass)

    if (extraClass) {
      template.classList.add(...extraClass.split(' '))
    }

    return template
  }

  // Private
  override _typeCheckConfig(config: ComponentConfig): void {
    super._typeCheckConfig(config)
    this._checkContent(config.content)
  }

  _checkContent(arg: Record<string, TemplateContentEntry>): void {
    for (const [selector, content] of Object.entries(arg)) {
      super._typeCheckConfig({ selector, entry: content }, DefaultContentType)
    }
  }

  _setContent(template: Element, content: TemplateContentEntry, selector: string): void {
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
      this._putElementInTemplate(getElement(content)!, templateElement)
      return
    }

    if (this._config.html) {
      templateElement.innerHTML = this._maybeSanitize(content)
      return
    }

    templateElement.textContent = content
  }

  _maybeSanitize(arg: string): string {
    return this._config.sanitize ? sanitizeHtml(arg, this._config.allowList, this._config.sanitizeFn) : arg
  }

  _resolvePossibleFunction<T>(arg: T | ((...args: any[]) => T)): T {
    return execute(arg, [undefined, this])
  }

  _putElementInTemplate(element: Element, templateElement: Element): void {
    if (this._config.html) {
      templateElement.innerHTML = ''
      templateElement.append(element)
      return
    }

    templateElement.textContent = element.textContent
  }
}

export default TemplateFactory
export type { TemplateFactoryConfig, TemplateContentEntry }
