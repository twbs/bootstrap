/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.0-beta3): util/sanitizer.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

const uriAttrs = new Set([
  'background',
  'cite',
  'href',
  'itemtype',
  'longdesc',
  'poster',
  'src',
  'xlink:href'
])

const ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i

/**
 * A pattern that recognizes a commonly useful subset of URLs that are safe.
 *
 * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
 */
const SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file):|[^#&/:?]*(?:[#/?]|$))/i

/**
 * A pattern that matches safe data URLs. Only matches image, video and audio types.
 *
 * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
 */
const DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i

const allowedAttribute = (attr, allowedAttributeList) => {
  const attrName = attr.nodeName.toLowerCase()

  if (allowedAttributeList.includes(attrName)) {
    if (uriAttrs.has(attrName)) {
      return Boolean(SAFE_URL_PATTERN.test(attr.nodeValue) || DATA_URL_PATTERN.test(attr.nodeValue))
    }

    return true
  }

  const regExp = allowedAttributeList.filter(attrRegex => attrRegex instanceof RegExp)

  // Check if a regular expression validates the attribute.
  for (let i = 0, len = regExp.length; i < len; i++) {
    if (regExp[i].test(attrName)) {
      return true
    }
  }

  return false
}

export const DefaultAllowlist = {
  // Global attributes allowed on any supplied element below.
  '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
  a: ['target', 'href', 'title', 'rel'],
  area: [],
  b: [],
  br: [],
  col: [],
  code: [],
  div: [],
  em: [],
  hr: [],
  h1: [],
  h2: [],
  h3: [],
  h4: [],
  h5: [],
  h6: [],
  i: [],
  img: ['src', 'srcset', 'alt', 'title', 'width', 'height'],
  li: [],
  ol: [],
  p: [],
  pre: [],
  s: [],
  small: [],
  span: [],
  sub: [],
  sup: [],
  strong: [],
  u: [],
  ul: []
}

export function sanitizeHtml(unsafeHtml, allowList, sanitizeFn) {
  if (!unsafeHtml.length) {
    return unsafeHtml
  }

  if (sanitizeFn && typeof sanitizeFn === 'function') {
    return sanitizeFn(unsafeHtml)
  }

  const domParser = new window.DOMParser()
  const createdDocument = domParser.parseFromString(unsafeHtml, 'text/html')
  const allowlistKeys = Object.keys(allowList)
  const elements = [].concat(...createdDocument.body.querySelectorAll('*'))

  for (let i = 0, len = elements.length; i < len; i++) {
    const el = elements[i]
    const elName = el.nodeName.toLowerCase()

    if (!allowlistKeys.includes(elName)) {
      el.parentNode.removeChild(el)

      continue
    }

    const attributeList = [].concat(...el.attributes)
    const allowedAttributes = [].concat(allowList['*'] || [], allowList[elName] || [])

    attributeList.forEach(attr => {
      if (!allowedAttribute(attr, allowedAttributes)) {
        el.removeAttribute(attr.nodeName)
      }
    })
  }

  return createdDocument.body.innerHTML
}
