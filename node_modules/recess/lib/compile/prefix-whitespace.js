// ==========================================
// RECESS
// COMPILE: whitespace for vendor prefixes
// ==========================================
// Copyright 2012 Twitter, Inc
// Licensed under the Apache License v2.0
// http://www.apache.org/licenses/LICENSE-2.0
// ==========================================

'use strict'

var less = require('less')
  , toCSS

  // vendor prfixes
  , vendorPrefixes = [
    '-webkit-'
  , '-khtml-'
  , '-epub-'
  , '-moz-'
  , '-ms-'
  , '-o-'
  ]
  , VENDOR_PREFIX = new RegExp('^(\\s*(?:' + vendorPrefixes.join('|').replace(/[-[\]{}()*+?.,\\^$#\s]/g, "\\$&") + '))')


// space defintion
function space(rules, i) {
  var rule = rules[i]
    , j = i - 1
    , peek = rules[j]
    , result = ''
    , ruleRoot
    , peekRoot
    , ruleVal
    , peekVal

  // skip if not peak, rule, or rule.name
  if (!peek || !rule || !rule.name) return

  // if previous rule is not a css property, try searching up tree for nearest rule
  while (!peek.name) {
    peek = rules[j--]

    // if none, then exit
    if (!peek) return
  }

  // check to see if name has a vnedor prefix
  if (VENDOR_PREFIX.test(peek.name)) {

    // strip vendor prefix from rule and prior rule
    ruleRoot = rule.name.replace(VENDOR_PREFIX, '')
    peekRoot = peek.name.replace(VENDOR_PREFIX, '')


    // if they share the same root calculte the offset in spacing
    if (ruleRoot === peekRoot) {

      // calculate the rules val
      ruleVal = rule.name.match(VENDOR_PREFIX)
      ruleVal = (ruleVal && ruleVal[0].length) || 0

      // calculate the peeks val
      peekVal = peek.name.match(VENDOR_PREFIX)
      peekVal = (peekVal && peekVal[0].length) || 0

      // if peek has a value, offset the rule val
      if (peekVal) {
        ruleVal = peekVal - ruleVal
        while (ruleVal--) result += ' '
      }

    }
  }

  // prefix the rule with the white space offset
  rule.name = result + rule.name
}

function compile (context, env) {
  // iterate over rules and space each property
  for (var i = 0; i < this.rules.length; i++) {
    space(this.rules, i)
  }

  // apply to base CSS
  return toCSS.apply(this, arguments)
}

module.exports.on = function () {
  toCSS = less.tree.Ruleset.prototype.toCSS
  less.tree.Ruleset.prototype.toCSS = compile
}

module.exports.off = function () {
  less.tree.Ruleset.prototype.toCSS = toCSS
}