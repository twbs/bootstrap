import { Tooltip } from '../../../dist/js/bootstrap.esm.js'

// eslint-disable-next-line ssr-friendly/no-dom-globals-in-module-scope
window.addEventListener('load', () => {
  [].concat(...document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    .map(tooltipNode => new Tooltip(tooltipNode))
})
