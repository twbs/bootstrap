// NOTICE: Internal docs helpers — not shipped in Bootstrap; not for reuse.

/*
 * JavaScript for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2026 The Bootstrap Authors
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
