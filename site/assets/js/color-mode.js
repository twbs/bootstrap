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

  const root = document.documentElement
  const activeTheme = localStorage.getItem('theme')
  const activeThemeIcon = document.querySelector('.theme-icon-active use')

  const checkSystemTheme = function () {
    // if OS dark mode is set, and there's no stored theme, set the theme to dark (but don't store it)
    if (window.matchMedia('(prefers-color-scheme: dark)').matches && !activeTheme) {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      // otherwise, set the theme to the default (light)
      document.documentElement.removeAttribute('data-theme')
    }
  }

  const setTheme = function (theme) {
    document.querySelectorAll('[data-theme-value]').forEach(element => {
      element.classList.remove('active')
    })

    // const btnToActive = document.querySelector('[data-theme-value="' + theme + '"]')
    const btnToActive = document.querySelector(`[data-theme-value="${theme}"]`)
    const svgOfActiveBtn = btnToActive.querySelector('svg use').getAttribute('href')

    btnToActive.classList.add('active')
    activeThemeIcon.setAttribute('href', svgOfActiveBtn)
  }

  document.querySelectorAll('[data-theme-value]')
    .forEach(toggle => {
      toggle.addEventListener('click', () => {
        const theme = toggle.getAttribute('data-theme-value')

        setTheme(theme)

        if (theme === 'auto') {
          root.removeAttribute('data-theme')
          localStorage.removeItem('theme')
          checkSystemTheme()
        } else {
          root.setAttribute('data-theme', theme)
          localStorage.setItem('theme', theme)
        }
      })
    })

  if (activeTheme) {
    root.setAttribute('data-theme', activeTheme)
    setTheme(activeTheme)
  } else {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      checkSystemTheme()
    })
    checkSystemTheme()
  }
})()
