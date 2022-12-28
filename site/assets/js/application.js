// NOTICE!! DO NOT USE ANY OF THIS JAVASCRIPT
// IT'S ALL JUST JUNK FOR OUR DOCS!
// ++++++++++++++++++++++++++++++++++++++++++

/*!
 * JavaScript for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2022 The Bootstrap Authors
 * Copyright 2011-2022 Twitter, Inc.
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 * For details, see https://creativecommons.org/licenses/by/3.0/.
 */

(() => {
  'use strict'

  // Scroll the active sidebar link into view
  const sidenav = document.querySelector('.bd-sidebar')
  if (sidenav) {
    const sidenavHeight = sidenav.clientHeight
    const sidenavActiveLink = document.querySelector('.bd-links-nav .active')
    const sidenavActiveLinkTop = sidenavActiveLink.offsetTop
    const sidenavActiveLinkHeight = sidenavActiveLink.clientHeight
    const viewportTop = sidenavActiveLinkTop
    const viewportBottom = viewportTop - sidenavHeight + sidenavActiveLinkHeight

    if (sidenav.scrollTop > viewportTop || sidenav.scrollTop < viewportBottom) {
      sidenav.scrollTop = viewportTop - (sidenavHeight / 2) + (sidenavActiveLinkHeight / 2)
    }
  }
})()
