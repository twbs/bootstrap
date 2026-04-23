// NOTICE: Internal docs helpers — not shipped in Bootstrap; not for reuse.

/*
 * JavaScript for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2026 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 * For details, see https://creativecommons.org/licenses/by/3.0/.
 */

export default () => {
  // Scroll the active sidebar link into view
  const sidenav = document.querySelector('.bd-sidebar')
  const sidenavActiveLink = document.querySelector('.bd-links-nav .active')

  if (!sidenav || !sidenavActiveLink) {
    return
  }

  const sidenavHeight = sidenav.clientHeight
  const sidenavActiveLinkTop = sidenavActiveLink.offsetTop
  const sidenavActiveLinkHeight = sidenavActiveLink.clientHeight
  const viewportTop = sidenavActiveLinkTop
  const viewportBottom = viewportTop - sidenavHeight + sidenavActiveLinkHeight

  if (sidenav.scrollTop > viewportTop || sidenav.scrollTop < viewportBottom) {
    sidenav.scrollTop = viewportTop - (sidenavHeight / 2) + (sidenavActiveLinkHeight / 2)
  }

  // Scroll the drawer body to the active link when the sidebar drawer opens.
  // Uses `show` + requestAnimationFrame so the scroll is set before the
  // slide-in transition renders, avoiding a visible jump.
  const bdSidebar = document.querySelector('#bdSidebar')

  if (bdSidebar) {
    bdSidebar.addEventListener('show.bs.drawer', () => {
      requestAnimationFrame(() => {
        const drawerBody = bdSidebar.querySelector('.drawer-body')
        const activeLink = bdSidebar.querySelector('.bd-links-nav .active')

        if (!drawerBody || !activeLink) {
          return
        }

        const activeLinkTop = activeLink.getBoundingClientRect().top - drawerBody.getBoundingClientRect().top + drawerBody.scrollTop
        const drawerBodyHeight = drawerBody.clientHeight
        const activeLinkHeight = activeLink.clientHeight

        drawerBody.scrollTop = activeLinkTop - (drawerBodyHeight / 2) + (activeLinkHeight / 2)
      })
    })
  }
}
