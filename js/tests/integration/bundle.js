import 'popper.js'
import bootstrap from '../../../dist/js/bootstrap'

window.addEventListener('load', () => {
  [...document.querySelectorAll('[data-toggle="tooltip"]')]
    .map(tooltipNode => new bootstrap.Tooltip(tooltipNode))
})
