module.exports = {
  options: {
    'attr-name-style': false,
    'id-class-style': false,
    'indent-style': 'spaces',
    'indent-width': false,
    'attr-bans': ['align', 'background', 'bgcolor', 'border', 'frameborder', 'longdesc', 'marginwidth', 'marginheight', 'scrolling'],
    'img-req-alt': false,
    'img-req-src': false,
    'label-req-for': false,
    'tag-bans': ['b', 'i'],
    ignore: [
      'Attribute “autocomplete” is only allowed when the input type is “color”, “date”, “datetime”, “datetime-local”, “email”, “hidden”, “month”, “number”, “password”, “range”, “search”, “tel”, “text”, “time”, “url”, or “week”.',
      'Attribute “autocomplete” not allowed on element “button” at this point.',
      'Consider using the “h1” element as a top-level heading only (all “h1” elements are treated as top-level headings by many screen readers and other tools).',
      'Element “div” not allowed as child of element “progress” in this context. (Suppressing further errors from this subtree.)',
      'Element “img” is missing required attribute “src”.',
      'The “color” input type is not supported in all browsers. Please be sure to test, and consider using a polyfill.',
      'The “date” input type is not supported in all browsers. Please be sure to test, and consider using a polyfill.',
      'The “datetime” input type is not supported in all browsers. Please be sure to test, and consider using a polyfill.',
      'The “datetime-local” input type is not supported in all browsers. Please be sure to test, and consider using a polyfill.',
      'The “month” input type is not supported in all browsers. Please be sure to test, and consider using a polyfill.',
      'The “time” input type is not supported in all browsers. Please be sure to test, and consider using a polyfill.',
      'The “week” input type is not supported in all browsers. Please be sure to test, and consider using a polyfill.'
    ]
  },
  src: ['_gh_pages/**/*.html', 'js/tests/visual/**/*.html']
}
