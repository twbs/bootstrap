// NOTICE: Internal docs helpers — not shipped in Bootstrap; not for reuse.

/*
 * JavaScript for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2026 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 * For details, see https://creativecommons.org/licenses/by/3.0/.
 */

export default () => {
  const sidebar = document.querySelector('#bdTocSidebar')

  if (!sidebar) {
    return
  }

  // Length of the fade at each edge, in pixels.
  const fade = 24

  let ticking = false

  const update = () => {
    ticking = false

    const { scrollTop, scrollHeight, clientHeight } = sidebar
    const maxScroll = scrollHeight - clientHeight

    // No overflow → no fade at either edge.
    const top = maxScroll > 1 ? Math.min(scrollTop, fade) : 0
    const bottom = maxScroll > 1 ? Math.min(maxScroll - scrollTop, fade) : 0

    sidebar.style.setProperty('--bd-toc-fade-top', `${top}px`)
    sidebar.style.setProperty('--bd-toc-fade-bottom', `${bottom}px`)
  }

  const requestUpdate = () => {
    if (!ticking) {
      ticking = true
      window.requestAnimationFrame(update)
    }
  }

  update()
  sidebar.addEventListener('scroll', requestUpdate, { passive: true })
  window.addEventListener('resize', requestUpdate, { passive: true })
}
