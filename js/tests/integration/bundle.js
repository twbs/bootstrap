import { Tooltip } from '../../../dist/js/bootstrap.esm.js'

window.addEventListener('load', () => {
  [].slice.call(document.querySelectorAll('[data-toggle="tooltip"]'))
    .map(tooltipNode => new Tooltip(tooltipNode))
})
