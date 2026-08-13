/**
 * --------------------------------------------------------------------------
 * Bootstrap util/sanitizer.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

// js-docs-start allow-list
const ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i

export const DefaultAllowlist = {
  // Global attributes allowed on any supplied element below.
  '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
  a: ['target', 'href', 'title', 'rel'],
  area: [],
  b: [],
  br: [],
  col: [],
  code: [],
  dd: [],
  div: [],
  dl: [],
  dt: [],
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
// js-docs-end allow-list

const uriAttributes = new Set([
  'background',
  'cite',
  'href',
  'itemtype',
  'longdesc',
  'poster',
  'src',
  'srcset',
  'xlink:href'
])

/**
 * A pattern that recognizes URLs that are safe wrt. XSS in URL navigation
 * contexts.
 *
 * Shout-out to Angular https://github.com/angular/angular/blob/15.2.8/packages/core/src/sanitization/url_sanitizer.ts#L38
 */
const SAFE_URL_PATTERN = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:/?#]*(?:[/?#]|$))/i

const isSafeUrl = url => Boolean(SAFE_URL_PATTERN.test(url))

// `srcset` is a comma-separated list of candidates. Commas also appear inside
// `data:` URLs, so the whole attribute string cannot be checked as one URI.
const SRCSET_DESCRIPTOR = /\s+[\d.]+[wx]\s*(?:,|$)/i

const extractSrcsetUrls = value => {
  const urls = []
  let rest = String(value).trim()

  while (rest) {
    if (/^data:/i.test(rest)) {
      const descriptor = rest.match(SRCSET_DESCRIPTOR)

      if (descriptor) {
        urls.push(rest.slice(0, descriptor.index).trim())
        rest = rest.slice(descriptor.index + descriptor[0].length).replace(/^,/, '').trim()
      } else {
        urls.push(rest)
        rest = ''
      }

      continue
    }

    const commaIndex = rest.indexOf(',')
    const candidate = (commaIndex === -1 ? rest : rest.slice(0, commaIndex)).trim()
    const url = candidate.split(/\s+/, 1)[0]

    if (url) {
      urls.push(url)
    }

    rest = commaIndex === -1 ? '' : rest.slice(commaIndex + 1).trim()
  }

  return urls
}

const allowedAttribute = (attribute, allowedAttributeList) => {
  const attributeName = attribute.nodeName.toLowerCase()

  if (allowedAttributeList.includes(attributeName)) {
    if (attributeName === 'srcset') {
      const urls = extractSrcsetUrls(attribute.nodeValue)
      return urls.length > 0 && urls.every(url => isSafeUrl(url))
    }

    if (uriAttributes.has(attributeName)) {
      return isSafeUrl(attribute.nodeValue)
    }

    return true
  }

  // Check if a regular expression validates the attribute.
  return allowedAttributeList.filter(attributeRegex => attributeRegex instanceof RegExp)
    .some(regex => regex.test(attributeName))
}

export function sanitizeHtml(unsafeHtml, allowList, sanitizeFunction) {
  if (!unsafeHtml.length) {
    return unsafeHtml
  }

  if (sanitizeFunction && typeof sanitizeFunction === 'function') {
    return sanitizeFunction(unsafeHtml)
  }

  // Fail closed if the parser is missing, clobbered, or throws. Returning the
  // original string here would skip sanitization (the Bootstrap 3 DOM-clobber
  // pattern). Returning an empty string drops the HTML instead.
  let createdDocument

  try {
    if (typeof window.DOMParser !== 'function') {
      return ''
    }

    createdDocument = new window.DOMParser().parseFromString(unsafeHtml, 'text/html')

    if (!createdDocument || !createdDocument.body) {
      return ''
    }
  } catch {
    return ''
  }

  const elements = [].concat(...createdDocument.body.querySelectorAll('*'))

  for (const element of elements) {
    const elementName = element.nodeName.toLowerCase()

    if (!Object.keys(allowList).includes(elementName)) {
      element.remove()
      continue
    }

    const attributeList = [].concat(...element.attributes)
    const allowedAttributes = [].concat(allowList['*'] || [], allowList[elementName] || [])

    for (const attribute of attributeList) {
      if (!allowedAttribute(attribute, allowedAttributes)) {
        element.removeAttribute(attribute.nodeName)
      }
    }
  }

  return createdDocument.body.innerHTML
}
