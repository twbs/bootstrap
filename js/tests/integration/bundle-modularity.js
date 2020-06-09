import 'popper.js'
import Tooltip from '../../dist/tooltip'

window.addEventListener('load', () => {
  [...document.querySelectorAll('[data-bs-toggle="tooltip"]')]
    .map(tooltipNode => new Tooltip(tooltipNode))
})
