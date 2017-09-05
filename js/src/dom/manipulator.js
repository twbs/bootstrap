/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): dom/manipulator.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Manipulator = {
  setChecked(input, val) {
    if (input instanceof HTMLInputElement) {
      input.checked = val
      input.bsChecked = val
    }
  },

  isChecked(input) {
    if (input instanceof HTMLInputElement) {
      return input.bsChecked || input.checked
    }
    throw new Error('INPUT parameter is not an HTMLInputElement')
  }
}

export default Manipulator
