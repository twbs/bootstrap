import { Tooltip } from '@bootstrap'

const tooltipTriggerList = [...document.querySelectorAll('[data-bs-toggle="tooltip"]')]
tooltipTriggerList.forEach(tooltipTriggerEl => {
  new Tooltip(tooltipTriggerEl)
})
