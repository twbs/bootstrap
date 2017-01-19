module.exports = {
  core: {
    options: {
      test() {
        return (!process.env.TWBS_TEST || process.env.TWBS_TEST === 'core') && process.env.TRAVIS_REPO_SLUG !==
          'twbs-savage/bootstrap'
      }
    },
    ifTrue: ['test-core']
  },
  'validate-html': {
    options: {
      test() {
        return (!process.env.TWBS_TEST || process.env.TWBS_TEST === 'validate-html') && (process.env.TWBS_DO_VALIDATOR ===
          undefined || process.env.TWBS_DO_VALIDATOR !== '0')
      }
    },
    ifTrue: ['test-validate-html']
  },
  'sauce-js': {
    options: {
      test() {
        return typeof process.env.SAUCE_ACCESS_KEY !== 'undefined' && (!process.env.TWBS_TEST || process.env.TWBS_TEST ===
          'sauce-js') && (process.env.TWBS_DO_SAUCE === undefined || process.env.TWBS_DO_SAUCE !== '0')
      }
    },
    ifTrue: ['test-sauce-js']
  }
}
