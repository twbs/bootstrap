// NOTICE: Internal docs helpers — not shipped in Bootstrap; not for reuse.

/*
 * JavaScript for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2026 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 * For details, see https://creativecommons.org/licenses/by/3.0/.
 */

const normalize = text => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

// The text of a link or heading, without its "New" badge
const ownText = element => [...element.childNodes]
  .filter(node => node.nodeType === Node.TEXT_NODE)
  .map(node => node.textContent)
  .join(' ')

const filterPanel = (panel, query) => {
  const term = normalize(query)
  let panelMatches = 0

  for (const group of panel.querySelectorAll('[data-bd-filter-group]')) {
    const heading = group.querySelector('.bd-links-heading')
    const groupMatches = term !== '' && heading !== null && normalize(ownText(heading)).includes(term)
    let groupCount = 0

    for (const subgroup of group.querySelectorAll('[data-bd-filter-subgroup]')) {
      const subgroupMatches = groupMatches || normalize(ownText(subgroup.querySelector('.bd-links-subgroup'))).includes(term)
      let subgroupCount = 0

      for (const item of subgroup.querySelectorAll('[data-bd-filter-item]')) {
        const visible = subgroupMatches || normalize(ownText(item.querySelector('a'))).includes(term)
        item.hidden = !visible
        subgroupCount += visible ? 1 : 0
      }

      subgroup.hidden = subgroupCount === 0
      groupCount += subgroupCount
    }

    for (const item of group.querySelectorAll('[data-bd-filter-item]')) {
      if (item.closest('[data-bd-filter-subgroup]')) {
        continue
      }

      const visible = groupMatches || normalize(ownText(item.querySelector('a'))).includes(term)
      item.hidden = !visible
      groupCount += visible ? 1 : 0
    }

    group.hidden = groupCount === 0
    panelMatches += groupCount
  }

  const empty = panel.querySelector('.bd-links-empty')
  empty.hidden = panelMatches > 0
  empty.querySelector('[data-bd-filter-query]').textContent = query.trim()
}

export default () => {
  const nav = document.querySelector('#bd-docs-nav')

  if (!nav) {
    return
  }

  const tabs = [...nav.querySelectorAll('[data-bd-universe]')]
  const panels = [...nav.querySelectorAll('[data-bd-universe-panel]')]
  const input = nav.querySelector('#bd-links-filter-input')
  const activePanel = () => panels.find(panel => !panel.hidden)

  const selectUniverse = (tab, { focus = false } = {}) => {
    for (const other of tabs) {
      const selected = other === tab
      other.classList.toggle('active', selected)
      other.setAttribute('aria-selected', selected ? 'true' : 'false')
      other.tabIndex = selected ? 0 : -1
    }

    for (const panel of panels) {
      panel.hidden = panel.dataset.bdUniversePanel !== tab.dataset.bdUniverse
    }

    // Each universe starts unfiltered
    input.value = ''
    filterPanel(activePanel(), '')

    if (focus) {
      tab.focus()
    }
  }

  for (const tab of tabs) {
    tab.addEventListener('click', () => selectUniverse(tab))

    // Vertical tablist: arrow keys, Home and End move between universes
    tab.addEventListener('keydown', event => {
      const index = tabs.indexOf(tab)
      const next = {
        ArrowDown: tabs[(index + 1) % tabs.length],
        ArrowUp: tabs[(index - 1 + tabs.length) % tabs.length],
        Home: tabs[0],
        End: tabs.at(-1)
      }[event.key]

      if (next) {
        event.preventDefault()
        selectUniverse(next, { focus: true })
      }
    })
  }

  input.addEventListener('input', () => filterPanel(activePanel(), input.value))

  input.addEventListener('keydown', event => {
    const firstLink = activePanel().querySelector('[data-bd-filter-item]:not([hidden]) a')

    if (event.key === 'Enter' && firstLink && input.value.trim() !== '') {
      event.preventDefault()
      firstLink.click()
    } else if (event.key === 'ArrowDown' && firstLink) {
      event.preventDefault()
      firstLink.focus()
    } else if (event.key === 'Escape' && input.value !== '') {
      event.preventDefault()
      event.stopPropagation()
      input.value = ''
      filterPanel(activePanel(), '')
    }
  })
}
