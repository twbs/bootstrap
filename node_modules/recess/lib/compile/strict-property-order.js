// ==========================================
// RECESS
// COMPILE: automatically sort properties
// ==========================================
// Copyright 2012 Twitter, Inc
// Licensed under the Apache License v2.0
// http://www.apache.org/licenses/LICENSE-2.0
// ==========================================

'use strict'

var less = require('less')
  , order = require('../lint/strict-property-order')
  , toCSS


function compile (context, env) {
  var l

  // test property order
  order(this, env.data)

  // search errors for sortedRules property
  if (this.errors) {
    for (l = this.errors.length; l--;) {

      // if sorted rule found apply it, then exit
      if (this.errors[l].sortedRules) {
        this.rules = this.errors[l].sortedRules
        break
      }

    }
  }

  // apply old toCSS method to updated object
  return toCSS.apply(this, arguments)
}

module.exports.on = function () {
  toCSS = less.tree.Ruleset.prototype.toCSS
  less.tree.Ruleset.prototype.toCSS = compile
}

module.exports.off = function () {
  less.tree.Ruleset.prototype.toCSS = toCSS
}