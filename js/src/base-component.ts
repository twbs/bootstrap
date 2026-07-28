/**
 * --------------------------------------------------------------------------
 * Bootstrap base-component.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import Data from './dom/data.js'
import EventHandler from './dom/event-handler.js'
import Config, { type ComponentConfig } from './util/config.js'
import { executeAfterTransition, getElement } from './util/index.js'

/**
 * Constants
 */

const VERSION = '6.0.0-alpha1'

/**
 * Class definition
 */

class BaseComponent extends Config {
  declare _element: HTMLElement
  declare _config: ComponentConfig

  constructor(element?: string | Element | null, config?: ComponentConfig | null) {
    super()

    element = getElement(element)
    if (!element) {
      return
    }

    this._element = element as HTMLElement
    this._config = this._getConfig(config)

    // Dispose any existing instance bound to this element before registering the new one,
    // so its event listeners and timers are cleaned up instead of leaking
    const existingInstance = Data.get(this._element, (this.constructor as typeof BaseComponent).DATA_KEY)
    if (existingInstance) {
      existingInstance.dispose()
    }

    Data.set(this._element, (this.constructor as typeof BaseComponent).DATA_KEY, this)
  }

  // Public
  dispose(): void {
    Data.remove(this._element, (this.constructor as typeof BaseComponent).DATA_KEY)
    EventHandler.off(this._element, (this.constructor as typeof BaseComponent).EVENT_KEY)

    for (const propertyName of Object.getOwnPropertyNames(this)) {
      (this as Record<string, any>)[propertyName] = null
    }
  }

  // Private
  _queueCallback(callback: () => void, element: Element, isAnimated = true): void {
    executeAfterTransition(() => {
      // Don't run the completion callback if the instance was disposed mid-transition
      if (!this._element) {
        return
      }

      callback()
    }, element, isAnimated)
  }

  override _getConfig(config?: ComponentConfig | null): ComponentConfig {
    config = this._mergeConfigObj(config, this._element)
    config = this._configAfterMerge(config)
    this._typeCheckConfig(config)
    return config
  }

  // Static
  static getInstance<T extends typeof BaseComponent>(this: T, element?: string | Element | null): InstanceType<T> | null {
    return Data.get(getElement(element), this.DATA_KEY)
  }

  static getOrCreateInstance<T extends typeof BaseComponent>(this: T, element?: string | Element | null, config: ComponentConfig | null = {}): InstanceType<T> {
    return this.getInstance(element) || (new this(element, typeof config === 'object' ? config : null) as InstanceType<T>)
  }

  static get VERSION(): string {
    return VERSION
  }

  static get DATA_KEY(): string {
    return `bs.${this.NAME}`
  }

  static get EVENT_KEY(): string {
    return `.${this.DATA_KEY}`
  }

  static eventName(name: string): string {
    return `${name}${this.EVENT_KEY}`
  }
}

export default BaseComponent
