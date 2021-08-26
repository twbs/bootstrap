/* eslint-disable import/extensions, n/file-extension-in-import, import/no-unassigned-import */

import Tooltip from '../../dist/tooltip'
import '../../dist/carousel'

window.addEventListener('load', () => {
  [].concat(...document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    .map(tooltipNode => new Tooltip(tooltipNode))
})
