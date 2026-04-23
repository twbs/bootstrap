import { Tooltip } from '../../dist/js/bootstrap.bundle.js'

const tooltipTriggerList = [...document.querySelectorAll('[data-bs-toggle="tooltip"]')]
tooltipTriggerList.forEach(tooltipTriggerEl => {
  new Tooltip(tooltipTriggerEl)
})
