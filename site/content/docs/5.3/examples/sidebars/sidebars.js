/* global bootstrap: false */
(() => {
  'use strict'
  const tooltipTriggerList = [...document.querySelectorAll('[data-bs-toggle="tooltip"]')]
  for (const tooltipTriggerEl of tooltipTriggerList) {
    new bootstrap.Tooltip(tooltipTriggerEl)
  }
})()
