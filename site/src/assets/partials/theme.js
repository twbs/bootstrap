// NOTICE: Internal docs helpers — not shipped in Bootstrap; not for reuse.

/*
 * JavaScript for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2026 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 * For details, see https://creativecommons.org/licenses/by/3.0/.
 */

import { Menu } from '@bootstrap'

export default () => {
  const themeSwitcher = document.getElementById('bd-theme')

  if (!themeSwitcher) {
    return
  }

  document.addEventListener('click', event => {
    const toggle = event.target.closest('[data-bs-theme-value]')

    if (!toggle) {
      return
    }

    Menu.getOrCreateInstance(themeSwitcher).hide()
  }, true)
}
