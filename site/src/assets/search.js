// NOTICE: Internal docs helpers — not shipped in Bootstrap; not for reuse.

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
const RECENT_STORAGE_KEY = 'bd:search:recent'
const RECENT_LIMIT = 5

const instance = getInstanceManager().getInstance('default')
let searchInitialized = false

// Recent visits — opt-out via Do Not Track and quietly no-op when storage is
// unavailable (private mode, quota, disabled cookies/storage).
const isDoNotTrackEnabled = () => {
  if (typeof navigator === 'undefined') {
    return false
  }

  return navigator.doNotTrack === '1' ||
    globalThis.doNotTrack === '1' ||
    navigator.msDoNotTrack === '1'
}

const getRecentVisits = () => {
  if (isDoNotTrackEnabled()) {
    return []
  }

  try {
    const raw = localStorage.getItem(RECENT_STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter(item => item && item.url) : []
  } catch {
    return []
  }
}

const saveRecentVisit = visit => {
  if (isDoNotTrackEnabled() || !visit?.url) {
    return
  }

  try {
    const existing = getRecentVisits().filter(item => item.url !== visit.url)
    const next = [visit, ...existing].slice(0, RECENT_LIMIT)
    localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Ignore — storage is best-effort.
  }
}

const clearRecentVisits = () => {
  try {
    localStorage.removeItem(RECENT_STORAGE_KEY)
  } catch {
    // Ignore — storage is best-effort.
  }
}

const HTML_ESCAPES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#39;'
}

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => HTML_ESCAPES[char])

// Single template for every clickable row in the results list — top-level
// results, nested subresults, and recently visited items. The two variants
// only differ by icon and a `-sub` modifier that nudges the font size down.
// `title` and `excerpt` are inlined as-is so callers can either escape them
// (recents, plain text) or pass through Pagefind's pre-marked HTML excerpts.
const renderItem = ({ url, title, excerpt = '', icon, sub = false }) => `
  <a class="list-group-item list-group-item-action bd-search-item${sub ? ' bd-search-item-sub' : ''}" href="${escapeHtml(url)}">
    <svg class="bi bd-search-item-icon" width="16" height="16" aria-hidden="true">
      <use href="#${icon}"></use>
    </svg>
    <span class="bd-search-item-title">${title}</span>
    ${excerpt ? `<span class="bd-search-item-excerpt">${excerpt}</span>` : ''}
  </a>
`

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
    // Always preventDefault so the surrounding `<form role="search">` never
    // implicit-submits and reloads the page when no results are present
    // (loading / empty / error / zero-results states).
    if (event.key === 'Enter') {
      event.preventDefault()
      const dialogEl = this.closest('dialog')
      dialogEl?.querySelector('.bd-search-item')?.click()
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
    this._onClick = this._onClick.bind(this)
    this.addEventListener('keydown', this._onKeydown)
    this.addEventListener('click', this._onClick)

    this._renderEmpty()
  }

  disconnectedCallback() {
    this.removeEventListener('keydown', this._onKeydown)
    this.removeEventListener('click', this._onClick)
    this._clearLoadingTimer()
  }

  _onClick(event) {
    if (event.target.closest('[data-bd-search-clear-recent]')) {
      event.preventDefault()
      clearRecentVisits()
      this._renderEmpty()
      instance.focusInputAndType(this, '')
    }
  }

  _getLinks() {
    return [...this.querySelectorAll('.bd-search-item')]
  }

  _onKeydown(event) {
    const link = event.target.closest('.bd-search-item')
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

    const recents = getRecentVisits()
    if (recents.length === 0) {
      this.innerHTML = `
        <div class="bd-search-empty">Start typing to search…</div>
      `
      return
    }

    this.innerHTML = `
      <div class="bd-search-recent">
        <div class="bd-search-recent-header">
          <span class="bd-search-recent-label">Recently visited</span>
          <button type="button" class="bd-search-recent-clear" data-bd-search-clear-recent>
            Clear
          </button>
        </div>
        <ol class="list-group list-group-flush bd-search-results-list">
          ${recents.map(visit => {
            // URL fragment → in-page link (Pagefind subresult). Render with
            // the hash icon and smaller title to match the live results UI.
            const isSubLink = visit.url.includes('#')
            return `
              <li class="bd-search-result">
                ${renderItem({
                  url: visit.url,
                  title: escapeHtml(visit.title),
                  excerpt: escapeHtml(visit.excerpt),
                  icon: isSubLink ? 'hash' : 'file-earmark-richtext',
                  sub: isSubLink
                })}
              </li>
            `
          }).join('')}
        </ol>
      </div>
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
              ${renderItem({
                url: sub.url,
                title: escapeHtml(sub.title),
                excerpt: sub.excerpt,
                icon: 'hash',
                sub: true
              })}
            </li>
          `).join('')}
        </ul>
      `

    return `
      <li class="bd-search-result">
        ${renderItem({
          url: result.url,
          title: escapeHtml(title),
          excerpt: result.excerpt,
          icon: 'file-earmark-richtext'
        })}
        ${subResultsHtml}
      </li>
    `
  }
}

const defineSearchCustomElements = () => {
  if (!customElements.get('bd-search-input')) {
    customElements.define('bd-search-input', BdSearchInput)
  }

  if (!customElements.get('bd-search-results')) {
    customElements.define('bd-search-results', BdSearchResults)
  }
}

const isMac = () => {
  if (typeof navigator === 'undefined') {
    return false
  }

  const platform = navigator.userAgentData?.platform || navigator.platform || ''
  return /mac|iphone|ipad|ipod/i.test(platform)
}

// Populate every `.bd-search-trigger-shortcut` slot with the platform-correct
// shortcut and reveal it. Rendered empty/hidden by `SearchTrigger.astro` so
// non-JS visitors never see a misleading hint and JS visitors never see a
// flash of the wrong key.
const setupTriggerShortcuts = () => {
  const mac = isMac()
  const modifier = mac ? '⌘' : '⌃'
  const ariaKeyshortcut = mac ? 'Meta+K' : 'Control+K'

  for (const slot of document.querySelectorAll('.bd-search-trigger-shortcut')) {
    slot.innerHTML = `<kbd class="bd-search-trigger-key">${modifier}K</kbd>`
    slot.hidden = false
    slot.closest('.bd-search-trigger')?.setAttribute('aria-keyshortcuts', ariaKeyshortcut)
  }
}

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

const registerGlobalShortcuts = () => {
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
}

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

  // Re-render empty state on open so a freshly-saved visit shows up in the
  // "Recently visited" list without waiting for the user to type and clear.
  dialogEl.addEventListener('shown.bs.dialog', () => {
    if (!instance.searchTerm) {
      dialogEl.querySelector('bd-search-results')?._renderEmpty?.()
    }
  })
}

const onDomReady = () => {
  setupTriggerShortcuts()
  setupDialogResetOnClose()
}

const registerResultLinkHandler = () => {
  // Result links should close the dialog when clicked (so the user lands on the
  // destination page with the modal already gone) and have the visit recorded
  // so it can resurface in the empty-state "Recently visited" list.
  document.addEventListener('click', event => {
    const link = event.target.closest('.bd-search-item')
    if (!link) {
      return
    }

    const dialogEl = link.closest(DIALOG_SELECTOR)
    if (!dialogEl) {
      return
    }

    const titleEl = link.querySelector('.bd-search-item-title')
    const excerptEl = link.querySelector('.bd-search-item-excerpt')
    saveRecentVisit({
      url: link.getAttribute('href') || '',
      title: titleEl?.textContent.trim() || link.textContent.trim(),
      excerpt: excerptEl?.textContent.trim() || ''
    })

    Dialog.getInstance(dialogEl)?.hide()
  })
}

const initSearch = () => {
  if (searchInitialized) {
    return
  }

  searchInitialized = true
  defineSearchCustomElements()
  registerGlobalShortcuts()
  registerResultLinkHandler()

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onDomReady, { once: true })
  } else {
    onDomReady()
  }
}

export default initSearch
