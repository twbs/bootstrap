import Tooltip from '../../dist/tooltip'
import '../../dist/carousel'

// eslint-disable-next-line ssr-friendly/no-dom-globals-in-module-scope
window.addEventListener('load', () => {
  [].concat(...document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    .map(tooltipNode => new Tooltip(tooltipNode))
})
