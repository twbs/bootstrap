// ==========================================
// RECESS
// UTIL: simple output util methods
// ==========================================
// Copyright 2012 Twitter, Inc
// Licensed under the Apache License v2.0
// http://www.apache.org/licenses/LICENSE-2.0
// ==========================================

'use strict'

var _ = require('underscore')

module.exports = {

  // set fail output object
  throwError: function (def, err) {
    def.errors = def.errors || []
    err.message = err.message.cyan
    def.errors.push(err)
  }

  // set line padding
, padLine: function (line) {
    var num = (line + '. ')
      , space = ''
      _.times(10 - num.length, function () { space += ' ' })
    return (space + num).grey
  }

  // get line number from data
, getLine: function (index, data) {
    return (data.slice(0, index).match(/\n/g) || "").length + 1;
  }

  // error counter
, countErrors: function (definitions) {
    var fails = 0
    definitions.forEach(function (def) {
      def.errors
        && def.errors.length
        && def.errors.forEach(function (err) { fails++ })
    })
    return fails
  }

}