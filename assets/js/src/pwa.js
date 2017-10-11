/* eslint no-console:off */

(function setupSW() {
  'use strict'

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(registration => { // eslint-disable-line compat/compat
        console.log('ServiceWorker registration successful with scope: ', registration.scope)
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          installingWorker.onstatechange = () => {
            switch (installingWorker.state) {
              case 'installed':
                if (navigator.serviceWorker.controller) { // eslint-disable-line compat/compat
                  console.log('new update available')
                  window.location.reload(true)
                }
                break

              default:
            }
          }
        }
      }).catch((err) => {
        console.log('ServiceWorker registration failed: ', err)
      })
    })
  }
}())
