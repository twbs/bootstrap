/**
 * --------------------------------------------------------------------------
 * Bootstrap dom/data.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * Constants
 */

const elementMap = new Map<Element, Map<string, unknown>>()

export default {
  set(element: Element, key: string, instance: unknown): void {
    if (!elementMap.has(element)) {
      elementMap.set(element, new Map())
    }

    const instanceMap = elementMap.get(element)!

    // make it clear we only want one instance per element
    // can be removed later when multiple key/instances are fine to be used
    if (!instanceMap.has(key) && instanceMap.size !== 0) {
      // eslint-disable-next-line no-console
      console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${[...instanceMap.keys()][0]}.`)
      return
    }

    instanceMap.set(key, instance)
  },

  get(element: Element | null, key: string): any {
    if (element && elementMap.has(element)) {
      return elementMap.get(element)!.get(key) || null
    }

    return null
  },

  getAny(element: Element | null): any {
    if (element && elementMap.has(element)) {
      return elementMap.get(element)!.values().next().value || null
    }

    return null
  },

  remove(element: Element, key: string): void {
    if (!elementMap.has(element)) {
      return
    }

    const instanceMap = elementMap.get(element)!

    instanceMap.delete(key)

    // free up element references if there are no instances left for an element
    if (instanceMap.size === 0) {
      elementMap.delete(element)
    }
  }
}
