import 'popper.js'
import bootstrap from '../../../dist/js/bootstrap'

window.addEventListener('load', () => {
  document.getElementById('resultUID').innerHTML = bootstrap.Util.getUID('bs')

  bootstrap.Util.makeArray(document.querySelectorAll('[data-toggle="tooltip"]'))
    .map((tooltipNode) => new bootstrap.Tooltip(tooltipNode))
})
