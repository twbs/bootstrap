'use strict'

module.exports = {
  standard: 'WCAG2AA',
  level: 'error',
  concurrency: 4,
  defaults: {
    reporters: [
      'cli',
      ['json', { fileName: './pa11y-ci-results.json' }]
    ],
    runners: [
      'htmlcs'
    ],
    hideElements: '.bd-search'
  }
}
