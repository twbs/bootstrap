/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.0-alpha2): dom/polyfill.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import { getUID } from '../util/index'

let find = Element.prototype.querySelectorAll
let findOne = Element.prototype.querySelector

const scopeSelectorRegex = /:scope\b/
const supportsScopeQuery = (() => {
  const element = document.createElement('div')

  try {
    element.querySelectorAll(':scope *')
  } catch (_) {
    return false
  }

  return true
})()

if (!supportsScopeQuery) {
  find = function (selector) {
    if (!scopeSelectorRegex.test(selector)) {
      return this.querySelectorAll(selector)
    }

    const hasId = Boolean(this.id)

    if (!hasId) {
      this.id = getUID('scope')
    }

    let nodeList = null
    try {
      selector = selector.replace(scopeSelectorRegex, `#${this.id}`)
      nodeList = this.querySelectorAll(selector)
    } finally {
      if (!hasId) {
        this.removeAttribute('id')
      }
    }

    return nodeList
  }

  findOne = function (selector) {
    if (!scopeSelectorRegex.test(selector)) {
      return this.querySelector(selector)
    }

    const matches = find.call(this, selector)

    return matches[0] ? matches[0] : null
  }
}

export {
  find,
  findOne
}
