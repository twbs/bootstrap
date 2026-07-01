// NOTICE: Internal docs helpers — not shipped in Bootstrap; not for reuse.

/*
 * JavaScript for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2026 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 * For details, see https://creativecommons.org/licenses/by/3.0/.
 */

export default () => {
  const toc = document.querySelector('.bd-toc')
  const footer = document.querySelector('.bd-footer')

  if (!toc || !footer) {
    return
  }

  let ticking = false

  const update = () => {
    ticking = false

    // How far the footer has scrolled up into the viewport. When the footer is
    // still below the fold this is negative, so clamp to 0.
    const overlap = window.innerHeight - footer.getBoundingClientRect().top

    toc.style.setProperty('--bd-toc-footer-overlap', `${Math.max(0, overlap)}px`)
  }

  const requestUpdate = () => {
    if (!ticking) {
      ticking = true
      window.requestAnimationFrame(update)
    }
  }

  update()
  window.addEventListener('scroll', requestUpdate, { passive: true })
  window.addEventListener('resize', requestUpdate, { passive: true })
}
