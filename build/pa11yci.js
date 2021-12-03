'use strict'

module.exports = {
  standard: 'WCAG2AA',
  level: 'error',
  concurrency: 4,
  defaults: {
    reporters: [
      'cli',
      'pa11y-reporter-html'
    ],
    runners: [
      'htmlcs'
    ],
    hideElements: '.bd-search'
  }
}
