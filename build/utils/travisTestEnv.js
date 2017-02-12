module.exports = function () {

  function runSubset(subset) {
    return !process.env.TWBS_TEST || process.env.TWBS_TEST === subset
  }

  function isUndefOrNonZero(val) {
    return val === undefined || val !== '0'
  }

  function isTravis() {
    return 'TRAVIS' in process.env && 'CI' in process.env;
  }

  return {
    // Skip core tests if running a different subset
    // of the test suite or if this is a Savage build
    isCore() {
      return runSubset('core') && process.env.TRAVIS_REPO_SLUG !== 'twbs-savage/bootstrap'
    },
    // Skip HTML validation if running a different subset of the test suite
    // or [skip validator] is in the commit message
    isValidateHtml() {
      return isTravis() && runSubset('validate-html') && isUndefOrNonZero(process.env.TWBS_DO_VALIDATOR)
    },
    // Only run Sauce Labs tests if there's a Sauce access key
    // and skip Sauce if running a different subset of the test suite
    isSauceJs() {
      return typeof process.env.SAUCE_ACCESS_KEY !== 'undefined' && runSubset('sauce-js-unit')
    },
    // Skip Sauce on Travis when [skip sauce] is in the commit message
    isDoSauceJs() {
      return this.isSauceJs() && isUndefOrNonZero(process.env.TWBS_DO_SAUCE)
    }
  }
}
