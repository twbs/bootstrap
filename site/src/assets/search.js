// NOTICE!! DO NOT USE ANY OF THIS JAVASCRIPT
// IT'S ALL JUST JUNK FOR OUR DOCS!
// ++++++++++++++++++++++++++++++++++++++++++

/*!
 * JavaScript for Bootstrap's docs search (https://getbootstrap.com/)
 * Copyright 2024-2026 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 * For details, see https://creativecommons.org/licenses/by/3.0/.
 */

// Custom Pagefind integration. We use `@pagefind/component-ui` only for its
// instance manager / search engine; the trigger, dialog, input, and results
// list are all built from Bootstrap primitives (Dialog, .form-control,
// .list-group). No `<pagefind-*>` element is ever rendered — those custom
// elements still self-register when the package loads, but stay unused.

import { getInstanceManager } from '@pagefind/component-ui'
import { Dialog } from '../../../dist/js/bootstrap.bundle.js'

const DIALOG_SELECTOR = '#bdSearchDialog'
const SUB_RESULTS_LIMIT = 3
// How long a search may take before we replace the previous results with the
// loading skeleton. Most queries resolve in well under this, so the skeleton
// stays hidden and the UI doesn't flash on every keystroke.
const LOADING_SKELETON_DELAY_MS = 200

const instance = getInstanceManager().getInstance('default')

const HTML_ESCAPES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#39;'
}

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => HTML_ESCAPES[char])

class BdSearchInput extends HTMLElement {
  connectedCallback() {
    this.input = this.querySelector('input')
    if (!this.input) {
      return
    }

    this.inputEl = this.input
    instance.registerInput(this, { keyboardNavigation: true })

    this._onInput = this._onInput.bind(this)
    this._onKeydown = this._onKeydown.bind(this)
    this.input.addEventListener('input', this._onInput)
    this.input.addEventListener('keydown', this._onKeydown)

    this.input.addEventListener('focus', () => {
      instance.triggerLoad()
    }, { once: true })
  }

  disconnectedCallback() {
    this.input?.removeEventListener('input', this._onInput)
    this.input?.removeEventListener('keydown', this._onKeydown)
  }

  _onInput(event) {
    instance.triggerSearch(event.target.value)
  }

  _onKeydown(event) {
    // ArrowDown jumps focus to the first link in the next results component.
    if (event.key === 'ArrowDown' && instance.focusNextResults(this)) {
      event.preventDefault()
      return
    }

    // Enter follows the first result link — this matches the command-palette
    // pattern where the top result is always the implicit Enter target.
    if (event.key === 'Enter') {
      const dialogEl = this.closest('dialog')
      const firstLink = dialogEl?.querySelector('.bd-search-result-link')
      if (firstLink) {
        event.preventDefault()
        firstLink.click()
      }
    }
  }

  focus() {
    this.input?.focus()
  }
}

class BdSearchResults extends HTMLElement {
  connectedCallback() {
    instance.registerResults(this, { keyboardNavigation: true })

    instance.on('loading', () => this._renderLoading(), this)
    instance.on('results', result => this._renderResults(result), this)
    instance.on('error', error => this._renderError(error), this)

    this._onKeydown = this._onKeydown.bind(this)
    this.addEventListener('keydown', this._onKeydown)

    this._renderEmpty()
  }

  disconnectedCallback() {
    this.removeEventListener('keydown', this._onKeydown)
    this._clearLoadingTimer()
  }

  _getLinks() {
    return [...this.querySelectorAll('.bd-search-result-link, .bd-search-subresult')]
  }

  _onKeydown(event) {
    const link = event.target.closest('.bd-search-result-link, .bd-search-subresult')
    if (!link) {
      return
    }

    const links = this._getLinks()
    const index = links.indexOf(link)

    switch (event.key) {
      case 'ArrowDown': {
        const next = links[index + 1]
        if (next) {
          event.preventDefault()
          next.focus()
        }

        break
      }

      case 'ArrowUp': {
        event.preventDefault()
        if (index === 0) {
          instance.focusPreviousInput(this)
        } else {
          links[index - 1].focus()
        }

        break
      }

      case 'Home': {
        if (links[0]) {
          event.preventDefault()
          links[0].focus()
        }

        break
      }

      case 'End': {
        const last = links.at(-1)
        if (last) {
          event.preventDefault()
          last.focus()
        }

        break
      }

      case 'Backspace': {
        event.preventDefault()
        instance.focusInputAndDelete(this)
        break
      }

      default: {
        // Single printable character — redirect to the input and keep typing there.
        if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
          event.preventDefault()
          instance.focusInputAndType(this, event.key)
        }
      }
    }
  }

  _clearLoadingTimer() {
    if (this._loadingTimer) {
      clearTimeout(this._loadingTimer)
      this._loadingTimer = null
    }
  }

  _renderEmpty() {
    this._clearLoadingTimer()

    if (instance.searchTerm) {
      return
    }

    this.innerHTML = `
      <div class="bd-search-empty">Start typing to search…</div>
    `
  }

  _renderLoading() {
    // Defer the skeleton paint — most searches finish well before this fires,
    // so the previous results stay on screen instead of flashing to skeletons
    // on every keystroke.
    this._clearLoadingTimer()
    this._loadingTimer = setTimeout(() => {
      this._loadingTimer = null
      this._paintLoading()
    }, LOADING_SKELETON_DELAY_MS)
  }

  _paintLoading() {
    this.innerHTML = `
      <div class="bd-search-loading placeholder-glow" role="status" aria-live="polite">
        <span class="visually-hidden">${escapeHtml(instance.translate('searching') || 'Searching…')}</span>
        ${Array.from({ length: 3 }, () => `
          <div class="bd-search-skeleton">
            <span class="placeholder col-4"></span>
            <span class="placeholder col-12"></span>
            <span class="placeholder col-10"></span>
          </div>
        `).join('')}
      </div>
    `
  }

  _renderError(error) {
    this._clearLoadingTimer()

    const message = error?.message || instance.translate('error_text') || 'Something went wrong with search.'
    this.innerHTML = `
      <div class="bd-search-error" role="alert">
        ${escapeHtml(message)}
      </div>
    `
  }

  async _renderResults(searchResult) {
    this._clearLoadingTimer()

    const term = instance.searchTerm

    if (!term) {
      this._renderEmpty()
      return
    }

    const rawResults = searchResult?.results ?? []

    if (rawResults.length === 0) {
      const zero = instance.translate('zero_results', { SEARCH_TERM: term }) || `No results for "${term}"`
      this.innerHTML = `
        <div class="bd-search-empty">${escapeHtml(zero)}</div>
      `
      return
    }

    const top = rawResults.slice(0, 5)
    const settled = await Promise.all(top.map(raw => raw.data().catch(() => null)))
    const data = settled.filter(Boolean)

    if (instance.searchTerm !== term) {
      // A newer search has started while we were resolving — drop these.
      return
    }

    this.innerHTML = `
      <ol class="list-group list-group-flush bd-search-results-list">
        ${data.map(result => this._renderResult(result)).join('')}
      </ol>
    `
  }

  _renderResult(result) {
    const title = result.meta?.title || result.url
    const subResults = instance.getDisplaySubResults(result, SUB_RESULTS_LIMIT)

    const subResultsHtml = subResults.length === 0 ?
      '' :
      `
        <ul class="bd-search-subresults list-unstyled">
          ${subResults.map(sub => `
            <li>
              <a class="list-group-item list-group-item-action bd-search-subresult" href="${escapeHtml(sub.url)}">
                <span class="bd-search-subresult-title">${escapeHtml(sub.title)}</span>
                <span class="bd-search-subresult-excerpt">${sub.excerpt}</span>
              </a>
            </li>
          `).join('')}
        </ul>
      `

    return `
      <li class="bd-search-result">
        <a class="list-group-item list-group-item-action bd-search-result-link" href="${escapeHtml(result.url)}">
          <span class="bd-search-result-title">${escapeHtml(title)}</span>
          <span class="bd-search-result-excerpt">${result.excerpt}</span>
        </a>
        ${subResultsHtml}
      </li>
    `
  }
}

customElements.define('bd-search-input', BdSearchInput)
customElements.define('bd-search-results', BdSearchResults)

const isEditableTarget = target => {
  if (!target) {
    return false
  }

  if (target.isContentEditable) {
    return true
  }

  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'
}

const openSearchDialog = () => {
  const dialogEl = document.querySelector(DIALOG_SELECTOR)
  if (!dialogEl) {
    return
  }

  const dialog = Dialog.getOrCreateInstance(dialogEl)
  dialog.show()
  // Focus the input on the next frame so the dialog is in the top layer.
  requestAnimationFrame(() => {
    dialogEl.querySelector('bd-search-input')?.focus()
  })
}

// Global Cmd/Ctrl + K shortcut to open the search dialog.
document.addEventListener('keydown', event => {
  if ((event.metaKey || event.ctrlKey) && !event.altKey && !event.shiftKey && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    openSearchDialog()
    return
  }

  // `/` opens search when not typing in another field — common docs shortcut.
  if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey && !isEditableTarget(event.target)) {
    event.preventDefault()
    openSearchDialog()
  }
})

const setupDialogResetOnClose = () => {
  const dialogEl = document.querySelector(DIALOG_SELECTOR)
  if (!dialogEl) {
    return
  }

  dialogEl.addEventListener('hidden.bs.dialog', () => {
    const inputEl = dialogEl.querySelector('bd-search-input input')
    if (inputEl) {
      inputEl.value = ''
    }

    instance.triggerSearch('')
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupDialogResetOnClose, { once: true })
} else {
  setupDialogResetOnClose()
}

// Result links should close the dialog when clicked (so the user lands on the
// destination page with the modal already gone).
document.addEventListener('click', event => {
  const link = event.target.closest('.bd-search-result-link, .bd-search-subresult')
  if (!link) {
    return
  }

  const dialogEl = link.closest(DIALOG_SELECTOR)
  if (!dialogEl) {
    return
  }

  Dialog.getInstance(dialogEl)?.hide()
})
