module.exports = function () {
  const travis = require('../utils/travisTestEnv.js')()
  return {
    core: {
      options: {
        test() {
          return travis.isCore()
        }
      },
      ifTrue: ['test-core']
    },
    'validate-html': {
      options: {
        test() {
          return travis.isValidateHtml()
        }
      },
      ifTrue: ['test-validate-html']
    },
    'sauce-js': {
      options: {
        test() {
          return travis.isSauceJs()
        }
      },
      ifTrue: ['test-sauce-js']
    },
    'sauce-js-qunit': {
      options: {
        test() {
          return travis.isDoSauceJs()
        }
      },
      ifTrue: ['test-sauce-js-qunit']
    }
  }
}
