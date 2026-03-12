import { Tooltip, Popover, Toast } from '../../dist/js/bootstrap.bundle.js'

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
  .forEach(toastNode => {
    const toast = new Toast(toastNode, {
      autohide: false
    })

    toast.show()
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
