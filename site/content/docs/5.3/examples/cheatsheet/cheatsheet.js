/* global bootstrap: false */

(() => {
  'use strict'

  // Tooltip and popover demos
  for (const tooltip of document.querySelectorAll('.tooltip-demo')) {
    new bootstrap.Tooltip(tooltip, {
      selector: '[data-bs-toggle="tooltip"]'
    })
  }

  for (const popover of document.querySelectorAll('[data-bs-toggle="popover"]')) {
    new bootstrap.Popover(popover)
  }

  for (const toastEl of document.querySelectorAll('.toast')) {
    const toast = new bootstrap.Toast(toastEl, {
      autohide: false
    })

    toast.show()
  }

  // Disable empty links and submit buttons
  for (const link of document.querySelectorAll('[href="#"], [type="submit"]')) {
    link.addEventListener('click', event => {
      event.preventDefault()
    })
  }

  function setActiveItem() {
    const { hash } = window.location

    if (hash === '') {
      return
    }

    const link = document.querySelector(`.bd-aside a[href="${hash}"]`)

    if (!link) {
      return
    }

    const active = document.querySelector('.bd-aside .active')
    const parent = link.parentNode.parentNode.previousElementSibling

    link.classList.add('active')

    if (parent.classList.contains('collapsed')) {
      parent.click()
    }

    if (!active) {
      return
    }

    const expanded = active.parentNode.parentNode.previousElementSibling

    active.classList.remove('active')

    if (expanded && parent !== expanded) {
      expanded.click()
    }
  }

  setActiveItem()
  window.addEventListener('hashchange', setActiveItem)
})()
