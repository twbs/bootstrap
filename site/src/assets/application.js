// NOTICE: Internal docs helpers — not shipped in Bootstrap; not for reuse.

/*!
 * JavaScript for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2026 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 * For details, see https://creativecommons.org/licenses/by/3.0/.
 */

import sidebarScroll from './partials/sidebar.js'
import snippets from './partials/snippets.js'
import stickyNav from './partials/sticky.js'
import tocDrawer from './partials/toc.js'

export default () => {
  sidebarScroll()
  snippets()
  stickyNav()
  tocDrawer()
}
