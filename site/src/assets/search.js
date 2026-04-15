/*!
 * JavaScript for Bootstrap's docs search (https://getbootstrap.com/)
 * Copyright 2024-2026 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 * For details, see https://creativecommons.org/licenses/by/3.0/.
 */

(() => {
  const btn = document.getElementById('bd-search-btn')
  const dialog = document.getElementById('bd-search-dialog')
  const searchRoot = document.getElementById('bd-search')

  if (!btn || !dialog || !searchRoot) {
    return
  }

  let pagefindLoaded = false

  function sanitizeResultHtml(html) {
    const template = document.createElement('template')
    template.innerHTML = html

    for (const element of template.content.querySelectorAll('*')) {
      if (element.tagName === 'MARK') {
        continue
      }

      element.replaceWith(document.createTextNode(element.textContent || ''))
    }

    return template.innerHTML.replace(/\s+/g, ' ').trim()
  }

  function sanitizeResult(result) {
    const subResults = Array.isArray(result.sub_results) ?
      result.sub_results.map(subResult => ({
        ...subResult,
        excerpt: sanitizeResultHtml(subResult.excerpt || '')
      })) :
      result.sub_results

    return {
      ...result,
      excerpt: sanitizeResultHtml(result.excerpt || ''),
      sub_results: subResults // eslint-disable-line camelcase
    }
  }

  async function loadPagefindUi() {
    if (window.PagefindUI) {
      return window.PagefindUI
    }

    const existingScript = document.getElementById('bd-pagefind-ui-js')

    if (existingScript) {
      await new Promise((resolve, reject) => {
        existingScript.addEventListener('load', resolve, { once: true })
        existingScript.addEventListener('error', reject, { once: true })
      })

      return window.PagefindUI
    }

    await new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.id = 'bd-pagefind-ui-js'
      script.src = '/pagefind/pagefind-ui.js'
      script.defer = true
      script.addEventListener('load', resolve, { once: true })
      script.addEventListener('error', reject, { once: true })
      document.head.append(script)
    })

    return window.PagefindUI
  }

  function renderUnavailableMessage(message) {
    searchRoot.innerHTML = `<p class="bd-search-unavailable">${message}</p>`
  }

  async function openSearch() {
    dialog.showModal()

    if (pagefindLoaded) {
      requestAnimationFrame(() => {
        dialog.querySelector('.pagefind-ui__search-input')?.focus()
      })

      return
    }

    try {
      const PagefindUI = await loadPagefindUi()

      new PagefindUI({
        element: '#bd-search',
        excerptLength: 15,
        processResult: sanitizeResult,
        showImages: false,
        showSubResults: true,
        resetStyles: false
      })

      pagefindLoaded = true

      requestAnimationFrame(() => {
        dialog.querySelector('.pagefind-ui__search-input')?.focus()
      })
    } catch {
      // Search index not available (expected during development before a build)
      renderUnavailableMessage('Search is not available until the docs are built. Run <code>npm run docs-build</code> first.')
    }
  }

  btn.addEventListener('click', openSearch)

  // Keyboard shortcut: ⌘K / Ctrl+K
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      openSearch()
    }
  })

  // Close on backdrop click
  dialog.addEventListener('click', e => {
    if (e.target === dialog) {
      dialog.close()
    }
  })

  // Reset input on dialog close
  dialog.addEventListener('close', () => {
    const input = dialog.querySelector('.pagefind-ui__search-input')

    if (input) {
      input.value = ''
      input.dispatchEvent(new Event('input'))
    }
  })
})()
