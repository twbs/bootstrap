import Tooltip from '../../dist/tooltip'
import '../../dist/carousel' // eslint-disable-line import/no-unassigned-import

window.addEventListener('load', () => {
  [].concat(...document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    .map(tooltipNode => new Tooltip(tooltipNode))
})
