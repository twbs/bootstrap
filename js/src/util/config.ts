/**
 * --------------------------------------------------------------------------
 * Bootstrap util/config.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import Manipulator from '../dom/manipulator.js'
import { isElement, toType } from './index.js'

/**
 * Types
 */

type ComponentConfig = Record<string, any>

/**
 * Class definition
 */

class Config {
  // Getters
  static get Default(): ComponentConfig {
    return {}
  }

  static get DefaultType(): ComponentConfig {
    return {}
  }

  static get NAME(): string {
    throw new Error('You have to implement the static method "NAME", for each component!')
  }

  _getConfig(config?: ComponentConfig | null): ComponentConfig {
    config = this._mergeConfigObj(config)
    config = this._configAfterMerge(config)
    this._typeCheckConfig(config)
    return config
  }

  _configAfterMerge(config: ComponentConfig): ComponentConfig {
    return config
  }

  _mergeConfigObj(config?: ComponentConfig | null, element?: Element): ComponentConfig {
    const jsonConfig = isElement(element) ? Manipulator.getDataAttribute(element, 'config') : {} // try to parse

    return {
      ...(this.constructor as typeof Config).Default,
      ...(typeof jsonConfig === 'object' ? jsonConfig : {}),
      ...(isElement(element) ? Manipulator.getDataAttributes(element as HTMLElement) : {}),
      ...(typeof config === 'object' ? config : {})
    }
  }

  _typeCheckConfig(config: ComponentConfig, configTypes: ComponentConfig = (this.constructor as typeof Config).DefaultType): void {
    for (const [property, expectedTypes] of Object.entries(configTypes)) {
      const value = config[property]
      const valueType = isElement(value) ? 'element' : toType(value)

      if (!new RegExp(expectedTypes).test(valueType)) {
        throw new TypeError(
          `${(this.constructor as typeof Config).NAME.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`
        )
      }
    }
  }
}

export default Config
export type { ComponentConfig }
