/*!
 * Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2023 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 */

(() => {
  'use strict'

  const storedTheme = localStorage.getItem('theme')

  const getPreferredTheme = () => {
    if (storedTheme) {
      return storedTheme
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  const setTheme = function (theme) {
    if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-bs-theme', 'dark')
    } else {
      document.documentElement.setAttribute('data-bs-theme', theme)
    }
  }

  setTheme(getPreferredTheme())

  const showActiveTheme = (theme, focus = false) => {
    const themeSwitcher = document.querySelector('#bd-theme')
    const themeSwitcherText = document.querySelector('#bd-theme-text')

    if (!themeSwitcher || !themeSwitcherText) {
      return
    }

    const activeThemeIcon = document.querySelector('.theme-icon-active use')
    const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`)
    const svgOfActiveBtn = btnToActive.querySelector('svg use').getAttribute('href')

    document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
      element.classList.remove('active')
      element.setAttribute('aria-pressed', 'false')
    })

    btnToActive.classList.add('active')
    btnToActive.setAttribute('aria-pressed', 'true')
    activeThemeIcon.setAttribute('href', svgOfActiveBtn)
    const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`
    themeSwitcher.setAttribute('aria-label', themeSwitcherLabel)

    if (focus) {
      themeSwitcher.focus()
    }
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (storedTheme !== 'light' || storedTheme !== 'dark') {
      setTheme(getPreferredTheme())
    }
  })

  window.addEventListener('DOMContentLoaded', () => {
    showActiveTheme(getPreferredTheme())

    document.querySelectorAll('[data-bs-theme-value]')
      .forEach(toggle => {
        toggle.addEventListener('click', () => {
          const theme = toggle.getAttribute('data-bs-theme-value')
          localStorage.setItem('theme', theme)
          setTheme(theme)
          showActiveTheme(theme, true)
        })
      })
  })
})()

// const storageKey = 'theme-preference';
// document.addEventListener('keypress', (e) => {
//   const keyName = e.key
//   if ((keyName === 'd') || (keyName === 'D')) {
//     onClick()
//   }
// });
// const onClick = () => {
//   theme.value = theme.value === 'light' ? 'dark' : 'light'
//   document.body.classList.add('app-transition')
//   setPreference()
// }
//
// const getColorPreference = () => {
//   // window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
//   if (localStorage.getItem(storageKey)) {
//     return localStorage.getItem(storageKey);
//   } else {
//     return localStorage.setItem('theme-preference', 'light') ? 'dark' : 'light';
//   }
// };
// const setPreference = () => {
//   localStorage.setItem(storageKey, theme.value);
//   setTimeout(function () {
//     document.body.classList.remove('app-transition');
//   }, 1000);
//   reflectPreference();
// };
//
// const reflectPreference = () => {
//   document.firstElementChild.setAttribute('data-bs-theme', theme.value);
//   document.querySelector('#theme-toggle')?.setAttribute('aria-label', theme.value);
// };
//
// const theme = {
//   value: getColorPreference(),
// }
// reflectPreference()
// window.addEventListener('load', () => {
//   reflectPreference();
//   if (document.querySelector('#theme-toggle') !== null) {
//     document.querySelector('#theme-toggle').addEventListener('click', onClick);
//   }
// });
//
// window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ({matches: isDark}) => {
//   theme.value = isDark ? 'dark' : 'light'
//   setPreference();
// })
