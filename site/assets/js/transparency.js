// NOTICE!! DO NOT USE ANY OF THIS JAVASCRIPT
// IT'S ALL JUST JUNK FOR OUR DOCS!
// ++++++++++++++++++++++++++++++++++++++++++

/*!
 * JavaScript for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2024 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 * For details, see https://creativecommons.org/licenses/by/3.0/.
 */

(() => {
  const transparencyToggler = document.querySelector('.transparency-toggle')
  const examplesContainer = document.querySelector('.bd-content')

  transparencyToggler.addEventListener('click', () => {
    const altText = `Toggle examples' transparency (${examplesContainer.classList.contains('transparency') ? 'inactive' : 'active'})`
    transparencyToggler.title = altText
    transparencyToggler.querySelector('span.d-lg-none').textContent = altText
    transparencyToggler.setAttribute('aria-label', altText)
    examplesContainer.classList.toggle('transparency')
  })
})()
