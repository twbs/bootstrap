// NOTICE!! DO NOT USE ANY OF THIS JAVASCRIPT
// IT'S ALL JUST JUNK FOR OUR DOCS!
// ++++++++++++++++++++++++++++++++++++++++++

/*
 * JavaScript for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2025 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 * For details, see https://creativecommons.org/licenses/by/3.0/.
 */

/* global bootstrap: false */

import ClipboardJS from 'clipboard'

export default () => {
  // Insert copy to clipboard button before .highlight
  const btnTitle = 'Copy to clipboard'
  const btnEdit = 'Edit on StackBlitz'

  const btnHtml = [
    '<div class="bd-code-snippet">',
    '  <div class="d-flex align-items-center highlight-toolbar ps-3 pe-2 py-1">',
    '    <small class="font-monospace text-body-secondary text-uppercase">html</small>',
    '    <div class="d-flex ms-auto">',
    '      <button type="button" class="btn-clipboard mt-0 me-0">',
    '        <svg class="bi" aria-hidden="true"><use xlink:href="#clipboard"></use></svg>',
    '      </button>',
    '    </div>',
    '  </div>',
    '</div>'
  ].join('')

  // Wrap programmatically code blocks and add copy btn.
  document.querySelectorAll('.highlight')
    .forEach(element => {
      // Ignore examples made by shortcode
      if (!element.closest('.bd-example-snippet')) {
        element.insertAdjacentHTML('beforebegin', btnHtml)
        element.previousElementSibling.append(element)
        element.previousElementSibling.querySelector('small').textContent = element.querySelector('pre > code').getAttribute('data-lang')
      }
    })

  /**
   *
   * @param {string} selector
   * @param {string} title
   */
  function snippetButtonTooltip(selector, title) {
    document.querySelectorAll(selector).forEach(btn => {
      bootstrap.Tooltip.getOrCreateInstance(btn, { title })
    })
  }

  snippetButtonTooltip('.btn-clipboard', btnTitle)
  snippetButtonTooltip('.btn-edit', btnEdit)

  const clipboard = new ClipboardJS('.btn-clipboard', {
    target: trigger => trigger.closest('.bd-code-snippet').querySelector('.highlight'),
    text: trigger => trigger.closest('.bd-code-snippet').querySelector('.highlight').textContent.trimEnd()
  })

  clipboard.on('success', event => {
    const iconFirstChild = event.trigger.querySelector('.bi').firstElementChild
    const tooltipBtn = bootstrap.Tooltip.getInstance(event.trigger)
    const namespace = 'http://www.w3.org/1999/xlink'
    const originalXhref = iconFirstChild.getAttributeNS(namespace, 'href')
    const originalTitle = event.trigger.title
    const isCheckIconVisible = originalXhref === '#check2'

    if (isCheckIconVisible) {
      return
    }

    tooltipBtn.setContent({ '.tooltip-inner': 'Copied!' })
    event.trigger.addEventListener('hidden.bs.tooltip', () => {
      tooltipBtn.setContent({ '.tooltip-inner': btnTitle })
    }, { once: true })
    event.clearSelection()
    iconFirstChild.setAttributeNS(namespace, 'href', originalXhref.replace('clipboard', 'check2'))

    setTimeout(() => {
      iconFirstChild.setAttributeNS(namespace, 'href', originalXhref)
      event.trigger.title = originalTitle
    }, 2000)
  })

  clipboard.on('error', event => {
    const modifierKey = /mac/i.test(navigator.userAgent) ? '\u2318' : 'Ctrl-'
    const fallbackMsg = `Press ${modifierKey}C to copy`
    const tooltipBtn = bootstrap.Tooltip.getInstance(event.trigger)

    tooltipBtn.setContent({ '.tooltip-inner': fallbackMsg })
    event.trigger.addEventListener('hidden.bs.tooltip', () => {
      tooltipBtn.setContent({ '.tooltip-inner': btnTitle })
    }, { once: true })
  })
}
