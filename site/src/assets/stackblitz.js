// NOTICE: Drives the "Open in StackBlitz" button on docs examples; bundles
// `partials/snippets.js` as raw text into the generated playground. Also opens
// the templates of the Examples page.

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

// StackBlitz runs `index.js` once the page is rendered, but its loader can't
// run Bootstrap's ES modules from a CDN URL, so the playground imports the
// bundle from the npm package, which also sets up the data API. The docs'
// scripts import it instead of the `@bootstrap` alias, which only exists in
// the docs build.
const BOOTSTRAP_JS = 'bootstrap/dist/js/bootstrap.bundle.js'
const importBootstrapPackage = code => code.replace(/from '@bootstrap'/g, `from '${BOOTSTRAP_JS}'`)

// Bootstrap starts these plugins from their data attributes on the window's
// `load` event, which has already fired when StackBlitz runs `index.js`
const LOAD_PLUGINS = {
  ScrollSpy: '[data-bs-spy="scroll"]',
  Carousel: '[data-bs-autoplay="true"]'
}

// These ones start on `DOMContentLoaded`, which has also fired by then. Bootstrap
// starts them at once when it loads after the page, but not 6.0.0-alpha.1, the
// version the playground installs
const READY_PLUGINS = {
  Chips: '[data-bs-chips]',
  Combobox: '[data-bs-toggle="combobox"]',
  Datepicker: '[data-bs-toggle="datepicker"][data-bs-inline="true"], [data-bs-toggle="datepicker"][data-bs-selected-dates]',
  NavOverflow: '[data-bs-toggle="nav-overflow"]',
  OtpInput: '[data-bs-otp]',
  Range: '.form-range',
  Strength: '[data-bs-strength]'
}

const STARTED_PLUGINS = { ...LOAD_PLUGINS, ...READY_PLUGINS }

const startLoadPlugins = (root, plugins) => plugins
  .filter(plugin => root.querySelector(STARTED_PLUGINS[plugin]) !== null)
  .map(plugin => `
import { ${plugin} } from '${BOOTSTRAP_JS}'

document.querySelectorAll('${STARTED_PLUGINS[plugin]}').forEach(element => {
  ${plugin}.getOrCreateInstance(element)
})
`)
  .join('')

// Open in StackBlitz logic
export default () => {
  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', () => {
      const codeSnippet = btn.closest('.bd-code-snippet')
      const exampleEl = codeSnippet.querySelector('.bd-example')

      const htmlSnippet = getPlaygroundMarkup(exampleEl, codeSnippet.querySelector('template.bd-example-source'))
      // Examples marked `addStackblitzJs` also get the docs snippets
      const jsSnippet = btn.hasAttribute('data-sb-js-snippet')
      // Get extra classes for this example
      const classes = [...exampleEl.classList].join(' ')
      // The snippets start the docs' other carousels themselves
      const loadPluginsJs = startLoadPlugins(exampleEl, ['ScrollSpy', ...Object.keys(READY_PLUGINS)])

      openBootstrapSnippet(htmlSnippet, jsSnippet, classes, getDocsStyles(exampleEl), loadPluginsJs)
    })
  })
}

// The playground has neither the docs' icon sprite nor its files, so the
// example takes the icons it uses along, and links to the docs' files with
// absolute URLs. Elements its buttons open but the page keeps outside of it,
// like the dialogs of the dialog sizes example, come along too. The example
// comes from its source markup when the page keeps one: the preview has been
// changed by the plugins (a range's fill and ticks…), which the playground
// starts again.
const getPlaygroundMarkup = (exampleEl, sourceTemplate) => {
  let example = exampleEl.cloneNode(true)
  if (sourceTemplate) {
    example = document.createElement('div')
    example.append(sourceTemplate.content.cloneNode(true))
  }

  const targetIds = new Set([...example.querySelectorAll('[data-bs-target^="#"]')]
    .map(el => el.getAttribute('data-bs-target').slice(1)))
  for (const id of targetIds) {
    const target = document.getElementById(id)
    if (target && !exampleEl.contains(target) && !target.contains(exampleEl)) {
      example.append('\n', target.cloneNode(true))
    }
  }

  absolutizeUrls(example, window.location.href, value => value.startsWith('/') && !value.startsWith('//'))

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

// Gives the `src`, `href` and inline style `url()` values that `isDocsLink`
// accepts an absolute URL, resolved against `baseUrl`
const absolutizeUrls = (root, baseUrl, isDocsLink) => {
  for (const attribute of ['src', 'href']) {
    root.querySelectorAll(`[${attribute}]`).forEach(el => {
      const value = el.getAttribute(attribute)
      if (isDocsLink(value)) {
        el.setAttribute(attribute, new URL(value, baseUrl).href)
      }
    })
  }

  root.querySelectorAll('[style*="url("]').forEach(el => {
    const style = el.getAttribute('style').replace(/url\((["']?)(.+?)\1\)/g, (match, quote, value) => {
      return isDocsLink(value) ? `url(${quote}${new URL(value, baseUrl).href}${quote})` : match
    })
    el.setAttribute('style', style)
  })
}

// Splits a selector list on its top-level commas, or a declaration block on
// its semicolons, leaving `:is(.a, .b)`, `url(a;b)` and strings whole
const splitTopLevel = (text, separator) => {
  const parts = []
  let depth = 0
  let quote = null
  let start = 0

  // Code units rather than code points, so the indexes match `slice()`
  for (let index = 0; index < text.length; index++) {
    const char = text[index]

    if (quote) {
      if (char === quote && text[index - 1] !== '\\') {
        quote = null
      }

      continue
    }

    switch (char) {
      case '"':
      case '\'': {
        quote = char
        break
      }

      case '(': {
        depth++
        break
      }

      case ')': {
        depth--
        break
      }

      case separator: {
        if (depth === 0) {
          parts.push(text.slice(start, index).trim())
          start = index + 1
        }

        break
      }

      default: {
        break
      }
    }
  }

  parts.push(text.slice(start).trim())
  return parts.filter(Boolean)
}

// Some examples are styled by the docs' own CSS (grid rows, flex boxes, custom
// tooltips…), so the playground gets the docs rules that apply to the example:
// their classes are all in it, and they match one of its elements once the
// states (`:hover`, `::before`…) are left aside. Rules that only target
// `.bd-example` are left out: they frame the example in the docs, and the
// playground's `<body>` carries its classes. The docs custom properties these
// rules use come along with their current values. Bootstrap's own stylesheet
// is already in the playground; other origins' rules can't be read.
const getDocsStyles = (exampleEl, sheets = [...document.styleSheets].filter(sheet => !sheet.href?.includes('/dist/css/'))) => {
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
      const selectors = splitTopLevel(rule.selectorText, ',').filter(appliesToExample)
      const declarations = splitTopLevel(rule.style.cssText, ';').map(declaration => `  ${declaration};`)
      return selectors.length > 0 && declarations.length > 0 ?
        [`${selectors.join(', ')} {\n${declarations.join('\n')}\n}`] :
        []
    }

    // `@media`, `@supports`, `@container`, `@layer` blocks
    if (rule.cssRules) {
      const innerRules = collect(rule.cssRules)
      const prelude = rule.cssText.slice(0, rule.cssText.indexOf('{')).trim()
      return innerRules.length > 0 ? [`${prelude} {\n${innerRules.join('\n').replace(/^/gm, '  ')}\n}`] : []
    }

    return []
  })

  const rules = sheets.flatMap(sheet => {
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

const openBootstrapSnippet = (htmlSnippet, jsSnippet, classes, docsStyles, loadPluginsJs) => {
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

  const indexJs = jsSnippet ?
    `${importBootstrapPackage(snippetsContent)
      .replace('export default () => {', 'const snippets = () => {')
      .trimEnd()}

snippets()
` :
    `import '${BOOTSTRAP_JS}'\n`

  const project = {
    files: {
      'index.html': indexHtml,
      'index.js': `${indexJs}${loadPluginsJs}`
    },
    title: 'Bootstrap Example',
    description: `Official example from ${window.location.href}`,
    template: 'javascript',
    dependencies: { bootstrap: CONFIG.currentVersion },
    tags: ['bootstrap']
  }

  sdk.openProject(project, { openFile: 'index.html' })
}

// Templates of the Examples page
// ------------------------------
// A template is a whole page, so its playground is that page as the docs serve
// it, with Bootstrap's CSS from the CDN. The template's own CSS and JS files
// become files of the project, which `index.js` imports in the page's order:
// StackBlitz only serves `index.html` and what `index.js` imports.

const PRINT_WIDTH = 120
// Elements whose content is kept exactly as it is
const RAW_ELEMENTS = new Set(['pre', 'script', 'style', 'textarea', 'title'])

const fetchText = async url => {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`)
  }

  return response.text()
}

// Astro serves the page on a single line, so the playground indents it again.
// An element is split over several lines only when it's too long and holds no
// text of its own, so the spaces between words and inline elements stay as
// they are.
const formatHtml = (node, depth = 0) => {
  const indent = '  '.repeat(depth)

  if (node.nodeType === Node.COMMENT_NODE) {
    return `${indent}<!--${node.data}-->`
  }

  const children = [...node.childNodes].filter(child => child.nodeType !== Node.TEXT_NODE || child.textContent.trim() !== '')
  const canSplit = indent.length + node.outerHTML.length > PRINT_WIDTH &&
    !RAW_ELEMENTS.has(node.localName) &&
    children.length > 0 &&
    children.every(child => child.nodeType !== Node.TEXT_NODE)

  if (!canSplit) {
    return `${indent}${node.outerHTML}`
  }

  const closingTag = `</${node.localName}>`
  const openingTag = node.cloneNode(false).outerHTML.slice(0, -closingTag.length)

  return [
    `${indent}${openingTag}`,
    ...children.map(child => formatHtml(child, depth + 1)),
    `${indent}${closingTag}`
  ].join('\n')
}

const isFromDocs = url => url.origin === window.location.origin

const getExampleProject = async exampleUrl => {
  const doc = new DOMParser().parseFromString(await fetchText(exampleUrl), 'text/html')
  const exampleDir = new URL('./', exampleUrl).pathname
  const files = {}
  const imports = [BOOTSTRAP_JS]
  const docsCss = []
  const fetches = []

  // The parts of the page that only make sense in the docs: the theme toggler
  // (and the edit button), the canonical URL, the icons and the inline scripts
  doc.querySelectorAll('[data-sb-ignore], head link:not([rel~="stylesheet"]), meta[name="generator"], meta[name="theme-color"], script:not([src])')
    .forEach(el => el.remove())

  // Bootstrap's CSS moves to the CDN and its JS to `index.js`. The template's
  // files move to the project, and the docs' own CSS is kept aside to pick the
  // rules the template uses. Scripts from other origins move to `index.js` too,
  // since StackBlitz only runs the page's scripts after it; stylesheets from
  // other origins stay.
  for (const el of doc.querySelectorAll('link[rel~="stylesheet"], script[src]')) {
    const url = new URL(el.getAttribute(el.localName === 'script' ? 'src' : 'href'), exampleUrl)

    if (!isFromDocs(url)) {
      if (el.localName === 'script') {
        imports.push(url.href)
        el.remove()
      }

      continue
    }

    if (url.pathname.includes('/dist/css/')) {
      el.setAttribute('href', CONFIG.cssCdn)
      continue
    }

    if (url.pathname.startsWith(exampleDir)) {
      const fileName = url.pathname.slice(exampleDir.length)
      imports.push(`./${fileName}`)
      fetches.push(fetchText(url).then(text => {
        files[fileName] = fileName.endsWith('.js') ? importBootstrapPackage(text) : text
      }))
    } else if (el.localName === 'link') {
      fetches.push(fetchText(url).then(text => docsCss.push(text)))
    }

    el.remove()
  }

  doc.querySelectorAll('style').forEach(el => {
    docsCss.push(el.textContent)
    el.remove()
  })

  // Without the docs' color mode script, `auto` means nothing: the playground
  // is light, as a page without that script is
  if (doc.documentElement.dataset.bsTheme === 'auto') {
    delete doc.documentElement.dataset.bsTheme
  }

  await Promise.all(fetches)

  const docsStyles = getDocsStyles(doc.body, docsCss.map(text => {
    const sheet = new CSSStyleSheet()
    sheet.replaceSync(text)
    return sheet
  }))

  if (docsStyles) {
    const style = doc.createElement('style')
    style.textContent = `\n${docsStyles.replace(/^/gm, '      ')}\n    `
    doc.head.querySelector(`link[href="${CONFIG.cssCdn}"]`).after(style)
  }

  absolutizeUrls(doc, exampleUrl, value => value !== '' && !value.startsWith('#'))

  return {
    files: {
      'index.html': `<!doctype html>\n${formatHtml(doc.documentElement)}\n`,
      'index.js': `${imports.map(path => `import '${path}'\n`).join('')}${startLoadPlugins(doc.body, Object.keys(STARTED_PLUGINS))}`,
      ...files
    },
    title: doc.title,
    description: `Official example from ${exampleUrl.href}`,
    template: 'javascript',
    dependencies: { bootstrap: CONFIG.currentVersion },
    tags: ['bootstrap']
  }
}

const openingExamples = new WeakSet()

// The button's `data-sb-example` holds the template's URL
export const openExample = async btn => {
  if (openingExamples.has(btn)) {
    return
  }

  openingExamples.add(btn)

  try {
    const project = await getExampleProject(new URL(btn.dataset.sbExample, window.location.href))
    sdk.openProject(project, { openFile: 'index.html' })
  } finally {
    openingExamples.delete(btn)
  }
}
