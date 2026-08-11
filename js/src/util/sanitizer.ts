/**
 * --------------------------------------------------------------------------
 * Bootstrap util/sanitizer.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

type SanitizerAllowList = Record<string, Array<string | RegExp>>

// js-docs-start allow-list
const ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i

export const DefaultAllowlist: SanitizerAllowList = {
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

// js-docs-start icon-allow-list
/**
 * Allowlist for icon HTML options (Chips `dismissIcon`, NavOverflow `moreIcon`,
 * and markup supplied via `[data-bs-overflow-icon]`). Covers the default SVG
 * icons plus common inline-icon markup. Event-handler attributes and tags not
 * listed here are stripped by `sanitizeHtml`.
 */
export const DefaultIconAllowlist: SanitizerAllowList = {
  '*': ['class', 'role', ARIA_ATTRIBUTE_PATTERN],
  // Attribute names are matched lowercased (see allowedAttribute). `viewBox` is
  // listed as `viewbox` so the default SVG icons keep their coordinate system.
  svg: ['xmlns', 'width', 'height', 'viewbox', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'focusable'],
  path: ['d', 'fill', 'stroke', 'stroke-width', 'fill-rule', 'clip-rule'],
  line: ['x1', 'y1', 'x2', 'y2', 'stroke', 'stroke-width', 'stroke-linecap'],
  circle: ['cx', 'cy', 'r', 'fill', 'stroke', 'stroke-width'],
  rect: ['x', 'y', 'width', 'height', 'rx', 'ry', 'fill', 'stroke', 'stroke-width'],
  polyline: ['points', 'fill', 'stroke', 'stroke-width'],
  polygon: ['points', 'fill', 'stroke', 'stroke-width'],
  g: ['fill', 'stroke', 'stroke-width', 'transform'],
  // No `use` here: `href` / `xlink:href` on <use> can load external SVG
  // fragments. Apps that need sprites can extend this allowlist deliberately.
  span: [],
  i: []
}
// js-docs-end icon-allow-list

const uriAttributes = new Set([
  'background',
  'cite',
  'href',
  'itemtype',
  'longdesc',
  'poster',
  'src',
  'xlink:href'
])

/**
 * A pattern that recognizes URLs that are safe wrt. XSS in URL navigation
 * contexts.
 *
 * Shout-out to Angular https://github.com/angular/angular/blob/15.2.8/packages/core/src/sanitization/url_sanitizer.ts#L38
 */
const SAFE_URL_PATTERN = /^(?!(?:javascript|data|vbscript):)(?:[a-z0-9+.-]+:|[^&:/?#]*(?:[/?#]|$))/i

/**
 * A pattern that matches safe data URLs. Only matches image, video and audio
 * types — notably NOT `data:text/html`, which is an XSS vector.
 *
 * Shout-out to Angular https://github.com/angular/angular/blob/15.2.8/packages/core/src/sanitization/url_sanitizer.ts#L49
 */
const DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z=]+$/i

const allowedAttribute = (attribute: Attr, allowedAttributeList: Array<string | RegExp>): boolean => {
  const attributeName = attribute.nodeName.toLowerCase()

  if (allowedAttributeList.includes(attributeName)) {
    if (uriAttributes.has(attributeName)) {
      return Boolean(SAFE_URL_PATTERN.test(attribute.nodeValue!) || DATA_URL_PATTERN.test(attribute.nodeValue!))
    }

    return true
  }

  // Check if a regular expression validates the attribute.
  return allowedAttributeList.filter(attributeRegex => attributeRegex instanceof RegExp)
    .some(regex => regex.test(attributeName))
}

export function sanitizeHtml(unsafeHtml: string, allowList: SanitizerAllowList, sanitizeFunction?: ((unsafeHtml: string) => string) | null): string {
  if (!unsafeHtml.length) {
    return unsafeHtml
  }

  if (sanitizeFunction && typeof sanitizeFunction === 'function') {
    return sanitizeFunction(unsafeHtml)
  }

  const domParser = new window.DOMParser()
  const createdDocument = domParser.parseFromString(unsafeHtml, 'text/html')
  const elements = [...createdDocument.body.querySelectorAll('*')]

  for (const element of elements) {
    const elementName = element.nodeName.toLowerCase()

    if (!Object.keys(allowList).includes(elementName)) {
      element.remove()
      continue
    }

    const attributeList = [...element.attributes]
    const allowedAttributes = [...(allowList['*'] || []), ...(allowList[elementName] || [])]

    for (const attribute of attributeList) {
      if (!allowedAttribute(attribute, allowedAttributes)) {
        element.removeAttribute(attribute.nodeName)
      }
    }
  }

  return createdDocument.body.innerHTML
}

export type { SanitizerAllowList }
