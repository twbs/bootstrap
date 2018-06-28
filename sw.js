/* global workbox:false */

self.importScripts('assets/js/vendor/workbox/{workboxVersion}/workbox-sw.js')

workbox.setConfig({
  modulePathPrefix: '/assets/js/vendor/workbox/{workboxVersion}/'
})

workbox.precaching.precacheAndRoute([])
