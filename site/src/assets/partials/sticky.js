// NOTICE!! DO NOT USE ANY OF THIS JAVASCRIPT
// IT'S ALL JUST JUNK FOR OUR DOCS!
// ++++++++++++++++++++++++++++++++++++++++++

/*
 * JavaScript for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2025 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 * For details, see https://creativecommons.org/licenses/by/3.0/.
 */

export default () => {
  const navbar = document.querySelector('.bd-sticky-navbar')

  if (!navbar) {
    return
  }

  const handleScroll = () => {
    navbar.classList.toggle('is-stuck', window.scrollY > 0)
  }

  // Check initial state
  handleScroll()

  // Update on scroll
  window.addEventListener('scroll', handleScroll, { passive: true })
}
