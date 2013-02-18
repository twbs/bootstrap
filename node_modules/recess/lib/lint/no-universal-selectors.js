// ===========================================
// RECESS
// RULE: Universal selectors should be avoided
// ===========================================
// Copyright 2012 Twitter, Inc
// Licensed under the Apache License v2.0
// http://www.apache.org/licenses/LICENSE-2.0
// ===========================================

'use strict'

var util = require('../util')
  , RULE = {
      type: 'noUniversalSelectors'
    , exp: /\*/g
    , message: 'Universal selectors should be avoided'
    }

// validation method
module.exports = function (def, data) {

  // default validation to true
  var isValid = true

  // return if no rules to validate
  if (!def.selectors) return isValid

  // loop over selectors
  def.selectors.forEach(function (selector) {

    // loop over selector entities
    selector.elements.forEach(function (element) {

      var extract

      // continue to next element if no underscore
      if (!RULE.exp.test(element.value)) return

      // calculate line number for the extract
      extract = util.getLine(element.index - element.value.length, data)
      extract = util.padLine(extract)

      // highlight the invalid use of a universal selector
      extract += selector.toCSS({}).replace(RULE.exp, '*'.magenta)

      // set invalid flag to false
      isValid = false

      // set error object on defintion token
      util.throwError(def, {
        type: RULE.type
      , message: RULE.message
      , extract: extract
      })

    })
  })

  // return valid state
  return isValid

}