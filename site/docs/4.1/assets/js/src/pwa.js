// NOTICE!! DO NOT USE ANY OF THIS JAVASCRIPT
// IT'S ALL JUST JUNK FOR OUR DOCS!
// ++++++++++++++++++++++++++++++++++++++++++

/* eslint no-console:off */

(function () {
  'use strict'

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').then(function (registration) {
        console.log('ServiceWorker registration successful with scope: ', registration.scope)
      }).catch(function (err) {
        console.log('ServiceWorker registration failed: ', err)
      })
    })
  } else {
    console.log('Service workers are not supported.')
  }
}())
