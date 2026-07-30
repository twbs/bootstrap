import { Tooltip, Popover, Toast } from '@bootstrap'

document.querySelectorAll('.tooltip-demo')
  .forEach(tooltip => {
    new Tooltip(tooltip, {
      selector: '[data-bs-toggle="tooltip"]'
    })
  })

document.querySelectorAll('[data-bs-toggle="popover"]')
  .forEach(popover => {
    new Popover(popover)
  })

document.querySelectorAll('.toast')
  .forEach(toast => {
    const toastInstance = new Toast(toast, {
      autohide: false
    })
    toastInstance.show()
  })

document.querySelectorAll('[href="#"], [type="submit"]')
  .forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault()
    })
  })

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

  if (parent.getAttribute('aria-expanded') === 'false') {
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
