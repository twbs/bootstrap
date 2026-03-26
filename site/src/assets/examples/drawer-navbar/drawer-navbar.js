(() => {
  'use strict'

  document.querySelector('#navbarSideCollapse').addEventListener('click', () => {
    document.querySelector('.drawer-collapse').classList.toggle('open')
  })
})()
