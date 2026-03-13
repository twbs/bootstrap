import { Tooltip } from '../../dist/js/bootstrap.bundle.js'

const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
tooltipTriggerList.forEach(tooltipTriggerEl => {
  new Tooltip(tooltipTriggerEl)
})
