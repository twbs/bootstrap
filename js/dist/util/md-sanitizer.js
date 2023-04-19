/*!
  * Bootstrap md-sanitizer.js v5.3.0-alpha3 (https://getbootstrap.com/)
  * Copyright 2011-2023 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.MdSanitizer = {}));
})(this, (function (exports) { 'use strict';

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.0-beta2): util/sanitizer.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  const uriAttrs = new Set(['background', 'cite', 'href', 'itemtype', 'longdesc', 'poster', 'src', 'xlink:href']);
  const ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;

  /**
   * A pattern that recognizes a commonly useful subset of URLs that are safe.
   *
   * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
   */
  const SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file):|[^#&/:?]*(?:[#/?]|$))/gi;

  /**
   * A pattern that matches safe data URLs. Only matches image, video and audio types.
   *
   * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
   */
  const DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i;
  const allowedAttribute = (attr, allowedAttributeList) => {
    const attrName = attr.nodeName.toLowerCase();
    if (allowedAttributeList.includes(attrName)) {
      if (uriAttrs.has(attrName)) {
        return Boolean(attr.nodeValue.match(SAFE_URL_PATTERN) || attr.nodeValue.match(DATA_URL_PATTERN));
      }
      return true;
    }
    const regExp = allowedAttributeList.filter(attrRegex => attrRegex instanceof RegExp);

    // Check if a regular expression validates the attribute.
    for (let i = 0, len = regExp.length; i < len; i++) {
      if (regExp[i].test(attrName)) {
        return true;
      }
    }
    return false;
  };
  const DefaultWhitelist = {
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
  };
  function sanitizeHtml(unsafeHtml, whiteList, sanitizeFn) {
    if (!unsafeHtml.length) {
      return unsafeHtml;
    }
    if (sanitizeFn && typeof sanitizeFn === 'function') {
      return sanitizeFn(unsafeHtml);
    }
    const domParser = new window.DOMParser();
    const createdDocument = domParser.parseFromString(unsafeHtml, 'text/html');
    const whitelistKeys = Object.keys(whiteList);
    const elements = [].concat(...createdDocument.body.querySelectorAll('*'));
    for (let i = 0, len = elements.length; i < len; i++) {
      const el = elements[i];
      const elName = el.nodeName.toLowerCase();
      if (whitelistKeys.indexOf(elName) === -1) {
        el.parentNode.removeChild(el);
        continue;
      }
      const attributeList = [].concat(...el.attributes);
      const whitelistedAttributes = [].concat(whiteList['*'] || [], whiteList[elName] || []);
      attributeList.forEach(attr => {
        if (!allowedAttribute(attr, whitelistedAttributes)) {
          el.removeAttribute(attr.nodeName);
        }
      });
    }
    return createdDocument.body.innerHTML;
  }

  exports.DefaultWhitelist = DefaultWhitelist;
  exports.sanitizeHtml = sanitizeHtml;

  Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

}));
//# sourceMappingURL=md-sanitizer.js.map
