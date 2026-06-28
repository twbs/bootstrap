// NOTICE: Internal docs helpers — not shipped in Bootstrap; not for reuse.

/*
 * JavaScript for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2026 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 * For details, see https://creativecommons.org/licenses/by/3.0/.
 */

import { Drawer } from '@bootstrap'

export default () => {
  const tocSidebar = document.querySelector('#bdTocSidebar')

  if (!tocSidebar) {
    return
  }

  tocSidebar.addEventListener('click', event => {
    if (event.target.closest('.nav-link')) {
      Drawer.getInstance('#bdTocSidebar')?.hide()
    }
  })
}
