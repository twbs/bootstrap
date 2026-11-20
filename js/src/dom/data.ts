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

    instanceMap.set(key, instance)
  },

  get(element: Element | null, key: string): any {
    if (element && elementMap.has(element)) {
      return elementMap.get(element)!.get(key) || null
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
