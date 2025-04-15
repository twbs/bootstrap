/*!
 * Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2025 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 */

(() => {
  'use strict'

  const getStoredTheme = () => localStorage.getItem('theme')
  const setStoredTheme = theme => localStorage.setItem('theme', theme)

  const getPreferredTheme = () => {
    const storedTheme = getStoredTheme()
    if (storedTheme) {
      return storedTheme
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  const setTheme = (theme, element = document.documentElement) => {
    if (theme === 'auto') {
      element.setAttribute('data-bs-theme', (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
    } else {
      element.setAttribute('data-bs-theme', theme)
    }
  }

  setTheme(getPreferredTheme())

  const showActiveTheme = (theme, focus = false, selectedToggler = document.querySelector('#bd-theme')) => {
    const themeSwitcher = selectedToggler.closest('.dropdown')
    if (!themeSwitcher) {
      return
    }

    const themeSwitcherButton = themeSwitcher.querySelector('.dropdown-toggle')
    const themeSwitcherText = document.querySelector('#bd-theme-text')
    const activeThemeIcon = themeSwitcher.querySelector('.theme-icon-active use')
    const btnToActive = themeSwitcher.querySelector(`[data-bs-theme-value="${theme}"]`)
    const svgOfActiveBtn = btnToActive.querySelector('svg use').getAttribute('href')

    themeSwitcher.querySelectorAll('[data-bs-theme-value]').forEach(element => {
      element.classList.remove('active')
      element.setAttribute('aria-pressed', 'false')
    })

    btnToActive.classList.add('active')
    btnToActive.setAttribute('aria-pressed', 'true')
    activeThemeIcon.setAttribute('href', svgOfActiveBtn)
    const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})${btnToActive.closest('.highlight-toolbar') ? ' (local)' : ''}`
    themeSwitcherButton.setAttribute('aria-label', themeSwitcherLabel)

    if (focus) {
      themeSwitcherButton.focus()
    }
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const storedTheme = getStoredTheme()
    if (storedTheme !== 'light' && storedTheme !== 'dark') {
      setTheme(getPreferredTheme())
    }
  })

  window.addEventListener('DOMContentLoaded', () => {
    showActiveTheme(getPreferredTheme())

    document.querySelectorAll('[data-bs-theme-value]')
      .forEach(toggle => {
        toggle.addEventListener('click', () => {
          const theme = toggle.getAttribute('data-bs-theme-value')

          if (toggle.closest('.bd-code-snippet')) {
            setTheme(theme, toggle.closest('.bd-code-snippet').firstElementChild)
            showActiveTheme(theme, true, toggle.closest('.dropdown-menu').previousElementSibling)
          } else {
            setStoredTheme(theme)
            setTheme(theme)
            showActiveTheme(theme, true)
          }
        })
      })
  })
})()
