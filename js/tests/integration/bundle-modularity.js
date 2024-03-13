/* eslint-disable import/no-unassigned-import */

import Tooltip from '../../dist/tooltip.js'
import '../../dist/carousel.js'

window.addEventListener('load', () => {
  [].concat(...document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    .map(tooltipNode => new Tooltip(tooltipNode))
})
