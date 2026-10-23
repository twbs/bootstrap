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
  currentVersion: '__CURRENT_VERSION__',
  docsVersion: '__DOCS_VERSION__'
}

// Open in StackBlitz logic
export default () => {
  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', event => {
      const codeSnippet = event.target.closest('.bd-code-snippet')
      const exampleEl = codeSnippet.querySelector('.bd-example')

      const htmlSnippet = exampleEl.innerHTML
      // Get extra classes for this example
      const classes = [...exampleEl.classList].join(' ')

      openBootstrapSnippet(htmlSnippet, classes)
    })
  })
}

// The edit button only shows on examples with `addStackblitzJs`, so every
// playground gets the docs snippets
const openBootstrapSnippet = (htmlSnippet, classes) => {
  const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="${CONFIG.cssCdn}" rel="stylesheet">
    <link href="https://getbootstrap.com/docs/${CONFIG.docsVersion}/assets/css/docs.css" rel="stylesheet">
    <title>Bootstrap Example</title>
  </head>
  <body class="p-3 m-0 border-0 ${classes}">
    <!-- Example Code Start-->
${htmlSnippet.trimStart().replace(/^/gm, '    ').replace(/^ {4}$/gm, '').trimEnd()}
    <!-- Example Code End -->
  </body>
</html>`

  // StackBlitz runs `index.js` once the page is rendered, but its loader can't
  // run Bootstrap's ES modules from a CDN URL, so the snippets import the bundle
  // from the npm package instead of the `@bootstrap` alias, which only exists
  // in the docs build. Importing it also sets up the data API.
  const snippetsModule = `${snippetsContent
    .replace(/from '@bootstrap'/, 'from \'bootstrap/dist/js/bootstrap.bundle.js\'')
    .replace('export default () => {', 'const snippets = () => {')
    .trimEnd()}

snippets()
`

  const project = {
    files: {
      'index.html': indexHtml,
      'index.js': snippetsModule
    },
    title: 'Bootstrap Example',
    description: `Official example from ${window.location.href}`,
    template: 'javascript',
    dependencies: { bootstrap: CONFIG.currentVersion },
    tags: ['bootstrap']
  }

  sdk.openProject(project, { openFile: 'index.html' })
}
