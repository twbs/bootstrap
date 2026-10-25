// NOTICE: Drives the "Open in StackBlitz" button on docs examples; bundles
// `partials/snippets.js` as raw text into the generated playground.

/*!
 * JavaScript for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2024-2026 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 * For details, see https://creativecommons.org/licenses/by/3.0/.
 */

import sdk from '@stackblitz/sdk'
import snippetsContent from './partials/snippets.js?raw'

// These values will be replaced by Astro's Vite plugin
const CONFIG = {
  cssCdn: '__CSS_CDN__',
  currentVersion: '__CURRENT_VERSION__'
}

// Open in StackBlitz logic
export default () => {
  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', () => {
      const codeSnippet = btn.closest('.bd-code-snippet')
      const exampleEl = codeSnippet.querySelector('.bd-example')

      const htmlSnippet = getPlaygroundMarkup(exampleEl)
      // Examples marked `addStackblitzJs` also get the docs snippets
      const jsSnippet = btn.hasAttribute('data-sb-js-snippet')
      // Get extra classes for this example
      const classes = [...exampleEl.classList].join(' ')
      const hasScrollspy = exampleEl.querySelector('[data-bs-spy="scroll"]') !== null

      openBootstrapSnippet(htmlSnippet, jsSnippet, classes, getDocsStyles(exampleEl), hasScrollspy)
    })
  })
}

// The playground has neither the docs' icon sprite nor its files, so the
// example takes the icons it uses along, and links to the docs' files with
// absolute URLs. Elements its buttons open but the page keeps outside of it,
// like the dialogs of the dialog sizes example, come along too.
const getPlaygroundMarkup = exampleEl => {
  const example = exampleEl.cloneNode(true)

  const targetIds = new Set([...example.querySelectorAll('[data-bs-target^="#"]')]
    .map(el => el.getAttribute('data-bs-target').slice(1)))
  for (const id of targetIds) {
    const target = document.getElementById(id)
    if (target && !exampleEl.contains(target) && !target.contains(exampleEl)) {
      example.append('\n', target.cloneNode(true))
    }
  }

  for (const attribute of ['src', 'href']) {
    example.querySelectorAll(`[${attribute}^="/"]:not([${attribute}^="//"])`).forEach(el => {
      el.setAttribute(attribute, new URL(el.getAttribute(attribute), window.location.href).href)
    })
  }

  const iconIds = new Set([...example.querySelectorAll('use[href^="#"]')].map(use => use.getAttribute('href').slice(1)))
  const symbols = [...iconIds]
    .map(id => document.getElementById(id))
    .filter(symbol => symbol?.tagName.toLowerCase() === 'symbol')
    .map(symbol => symbol.outerHTML)

  const sprite = symbols.length > 0 ?
    `<svg xmlns="http://www.w3.org/2000/svg" class="d-none">\n${symbols.join('\n')}\n</svg>\n` :
    ''

  return `${sprite}${example.innerHTML.trimStart()}`
}

// Splits a selector list on its top-level commas, leaving `:is(.a, .b)` whole
const splitSelectors = selectorText => {
  const selectors = []
  let depth = 0
  let start = 0

  for (const [index, char] of [...selectorText].entries()) {
    if (char === '(') {
      depth++
    } else if (char === ')') {
      depth--
    } else if (char === ',' && depth === 0) {
      selectors.push(selectorText.slice(start, index).trim())
      start = index + 1
    }
  }

  selectors.push(selectorText.slice(start).trim())
  return selectors
}

// Some examples are styled by the docs' own CSS (grid rows, flex boxes, custom
// tooltips…), so the playground gets the docs rules that apply to the example:
// their classes are all in it, and they match one of its elements once the
// states (`:hover`, `::before`…) are left aside. Rules that only target
// `.bd-example` are left out: they frame the example in the docs, and the
// playground's `<body>` carries its classes. The docs custom properties these
// rules use come along with their current values.
const getDocsStyles = exampleEl => {
  const classes = new Set([exampleEl, ...exampleEl.querySelectorAll('[class]')]
    .flatMap(el => [...el.classList]))

  // The docs define custom color modes, like the blue one of the Color modes
  // page, whose rules select the example by its `data-bs-theme` alone
  const customModes = new Set([exampleEl, ...exampleEl.querySelectorAll('[data-bs-theme]')]
    .map(el => el.getAttribute('data-bs-theme'))
    .filter(mode => mode && mode !== 'light' && mode !== 'dark'))
  const selectsCustomMode = selector => [...selector.matchAll(/\[data-bs-theme=["']?([\w-]+)/g)]
    .some(match => customModes.has(match[1]))

  const appliesToExample = selector => {
    // Classes in `:not()` don't have to be in the example
    const selectorClasses = [...selector.replace(/:not\([^)]*\)/g, '').matchAll(/\.(-?[_a-z][\w-]*)/gi)]
      .map(match => match[1])

    const targetsExample = (selectorClasses.some(name => name !== 'bd-example') || selectsCustomMode(selector)) &&
      selectorClasses.every(name => classes.has(name))
    if (!targetsExample) {
      return false
    }

    const structuralSelector = selector.replace(/::?[a-z-]+(?![a-z-]|\()/gi, '')
    try {
      return exampleEl.matches(structuralSelector) || exampleEl.querySelector(structuralSelector) !== null
    } catch {
      // What's left of the selector may not be valid on its own
      return true
    }
  }

  const collect = rules => [...rules].flatMap(rule => {
    if (rule instanceof CSSStyleRule) {
      const selectors = splitSelectors(rule.selectorText).filter(appliesToExample)
      return selectors.length > 0 ? [`${selectors.join(', ')} { ${rule.style.cssText} }`] : []
    }

    // `@media`, `@supports`, `@container`, `@layer` blocks
    if (rule.cssRules) {
      const innerRules = collect(rule.cssRules)
      const prelude = rule.cssText.slice(0, rule.cssText.indexOf('{')).trim()
      return innerRules.length > 0 ? [`${prelude} {\n${innerRules.join('\n').replace(/^/gm, '  ')}\n}`] : []
    }

    return []
  })

  // Bootstrap's own stylesheet is already in the playground; other origins'
  // rules can't be read
  const docsSheets = [...document.styleSheets].filter(sheet => !sheet.href?.includes('/dist/css/'))
  const rules = docsSheets.flatMap(sheet => {
    try {
      return collect(sheet.cssRules)
    } catch {
      return []
    }
  })

  if (rules.length === 0) {
    return ''
  }

  const computedStyle = getComputedStyle(exampleEl)
  const properties = [...new Set(rules.join('\n').match(/--bd-[\w-]+/g))]
    .map(name => [name, computedStyle.getPropertyValue(name).trim()])
    .filter(([, value]) => value)
    .map(([name, value]) => `  ${name}: ${value};`)

  return [
    ...(properties.length > 0 ? [`:root {\n${properties.join('\n')}\n}`] : []),
    ...rules
  ].join('\n')
}

const openBootstrapSnippet = (htmlSnippet, jsSnippet, classes, docsStyles, hasScrollspy) => {
  const styleTag = docsStyles ?
    `\n    <style>\n${docsStyles.replace(/^/gm, '      ')}\n    </style>` :
    ''

  const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="${CONFIG.cssCdn}" rel="stylesheet">${styleTag}
    <title>Bootstrap Example</title>
  </head>
  <body class="p-3 m-0 border-0 ${classes}">
    <!-- Example Code Start-->
${htmlSnippet.trimStart().replace(/^/gm, '    ').replace(/^ {4}$/gm, '').trimEnd()}
    <!-- Example Code End -->
  </body>
</html>`

  // StackBlitz runs `index.js` once the page is rendered, but its loader can't
  // run Bootstrap's ES modules from a CDN URL, so the playground imports the
  // bundle from the npm package, which also sets up the data API. The snippets
  // import it instead of the `@bootstrap` alias, which only exists in the docs
  // build.
  const indexJs = jsSnippet ?
    `${snippetsContent
      .replace(/from '@bootstrap'/, 'from \'bootstrap/dist/js/bootstrap.bundle.js\'')
      .replace('export default () => {', 'const snippets = () => {')
      .trimEnd()}

snippets()
` :
    'import \'bootstrap/dist/js/bootstrap.bundle.js\'\n'

  // Scrollspy starts from its data attributes on the window's `load` event,
  // which has already fired when StackBlitz runs `index.js`
  const scrollspyJs = hasScrollspy ?
    `
import { ScrollSpy } from 'bootstrap/dist/js/bootstrap.bundle.js'

document.querySelectorAll('[data-bs-spy="scroll"]').forEach(element => {
  ScrollSpy.getOrCreateInstance(element)
})
` :
    ''

  const project = {
    files: {
      'index.html': indexHtml,
      'index.js': `${indexJs}${scrollspyJs}`
    },
    title: 'Bootstrap Example',
    description: `Official example from ${window.location.href}`,
    template: 'javascript',
    dependencies: { bootstrap: CONFIG.currentVersion },
    tags: ['bootstrap']
  }

  sdk.openProject(project, { openFile: 'index.html' })
}
