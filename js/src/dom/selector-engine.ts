/**
 * --------------------------------------------------------------------------
 * Bootstrap dom/selector-engine.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import { isDisabled, isVisible, parseSelector } from '../util/index.js'

const getSelector = (element: Element): string | null => {
  let selector = element.getAttribute('data-bs-target')

  if (!selector || selector === '#') {
    let hrefAttribute = element.getAttribute('href')

    // The only valid content that could double as a selector are IDs or classes,
    // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
    // `document.querySelector` will rightfully complain it is invalid.
    // See https://github.com/twbs/bootstrap/issues/32273
    if (!hrefAttribute || (!hrefAttribute.includes('#') && !hrefAttribute.startsWith('.'))) {
      return null
    }

    // Just in case some CMS puts out a full URL with the anchor appended
    if (hrefAttribute.includes('#') && !hrefAttribute.startsWith('#')) {
      hrefAttribute = `#${hrefAttribute.split('#')[1]}`
    }

    selector = hrefAttribute && hrefAttribute !== '#' ? hrefAttribute.trim() : null
  }

  return selector ? selector.split(',').map(sel => parseSelector(sel)).join(',') : null
}

const SelectorEngine = {
  find<T extends Element = HTMLElement>(selector: string, element: ParentNode = document.documentElement): T[] {
    return [...Element.prototype.querySelectorAll.call(element as Element, selector)] as T[]
  },

  findOne<T extends Element = HTMLElement>(selector: string, element: ParentNode = document.documentElement): T | null {
    return Element.prototype.querySelector.call(element as Element, selector) as T | null
  },

  children<T extends Element = HTMLElement>(element: Element, selector: string): T[] {
    return [...element.children].filter(child => child.matches(selector)) as T[]
  },

  parents(element: Element, selector: string): Element[] {
    const parents = []
    let ancestor = (element.parentNode as Element).closest(selector)

    while (ancestor) {
      parents.push(ancestor)
      ancestor = (ancestor.parentNode as Element).closest(selector)
    }

    return parents
  },

  closest<T extends Element = HTMLElement>(element: Element, selector: string): T | null {
    return Element.prototype.closest.call(element, selector) as T | null
  },

  prev(element: Element, selector: string): Element[] {
    let previous = element.previousElementSibling

    while (previous) {
      if (previous.matches(selector)) {
        return [previous]
      }

      previous = previous.previousElementSibling
    }

    return []
  },

  // TODO: this is now unused; remove along with prev()
  next(element: Element, selector: string): Element[] {
    let next = element.nextElementSibling

    while (next) {
      if (next.matches(selector)) {
        return [next]
      }

      next = next.nextElementSibling
    }

    return []
  },

  focusableChildren(element: Element): HTMLElement[] {
    const focusables = [
      'a',
      'button',
      'input',
      'textarea',
      'select',
      'details',
      '[tabindex]',
      '[contenteditable="true"]'
    ].map(selector => `${selector}:not([tabindex^="-"])`).join(',')

    return this.find(focusables, element).filter(el => !isDisabled(el) && isVisible(el))
  },

  getSelectorFromElement(element: Element): string | null {
    const selector = getSelector(element)

    if (selector) {
      return SelectorEngine.findOne(selector) ? selector : null
    }

    return null
  },

  getElementFromSelector(element: Element): HTMLElement | null {
    const selector = getSelector(element)

    return selector ? SelectorEngine.findOne(selector) : null
  },

  getMultipleElementsFromSelector(element: Element): HTMLElement[] {
    const selector = getSelector(element)

    return selector ? SelectorEngine.find(selector) : []
  }
}

export default SelectorEngine
