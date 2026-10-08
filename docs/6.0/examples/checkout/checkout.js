// Example starter JavaScript for preventing form submissions when there are invalid fields
(() => {
  'use strict'

  const forms = document.querySelectorAll('form[data-bs-validate]')

  for (const form of forms) {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }
    })
  }
})()
