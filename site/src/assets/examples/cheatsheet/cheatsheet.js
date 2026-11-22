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

  const link = [...document.querySelectorAll('.bd-aside a')].find(anchor => anchor.hash === hash)

  if (!link) {
    return
  }

  const active = document.querySelector('.bd-aside .active')
  const parent = link.closest('details.collapse')

  parent.open = true

  if (active === link) {
    return
  }

  link.classList.add('active')

  if (!active) {
    return
  }

  const expanded = active.closest('details.collapse')

  active.classList.remove('active')

  if (expanded && parent !== expanded) {
    expanded.open = false
  }
}

setActiveItem()
window.addEventListener('hashchange', setActiveItem)
