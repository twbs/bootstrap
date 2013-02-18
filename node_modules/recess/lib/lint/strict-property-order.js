// ==========================================
// RECESS
// RULE: Must use correct property ordering
// ==========================================
// Copyright 2012 Twitter, Inc
// Licensed under the Apache License v2.0
// http://www.apache.org/licenses/LICENSE-2.0
// ==========================================

'use strict'

var _ = require('underscore')
  , util = require('../util')
  , RULE = {
      type: 'strictPropertyOrder'
    , message: 'Incorrect property order for rule'
    }

  // vendor prefix order
  , vendorPrefixes = [
      '-webkit-'
    , '-khtml-'
    , '-epub-'
    , '-moz-'
    , '-ms-'
    , '-o-'
    ]

  // hack prefix order
  , hackPrefixes = [
      '_' // ie7
    , '*' // ie6
    ]

  // css property order
  , order = [
      'position'
    , 'top'
    , 'right'
    , 'bottom'
    , 'left'
    , 'z-index'
    , 'display'
    , 'float'
    , 'width'
    , 'height'
    , 'max-width'
    , 'max-height'
    , 'min-width'
    , 'min-height'
    , 'padding'
    , 'padding-top'
    , 'padding-right'
    , 'padding-bottom'
    , 'padding-left'
    , 'margin'
    , 'margin-top'
    , 'margin-right'
    , 'margin-bottom'
    , 'margin-left'
    , 'margin-collapse'
    , 'margin-top-collapse'
    , 'margin-right-collapse'
    , 'margin-bottom-collapse'
    , 'margin-left-collapse'
    , 'overflow'
    , 'overflow-x'
    , 'overflow-y'
    , 'clip'
    , 'clear'
    , 'font'
    , 'font-family'
    , 'font-size'
    , 'font-smoothing'
    , 'font-style'
    , 'font-weight'
    , 'hyphens'
    , 'src'
    , 'line-height'
    , 'letter-spacing'
    , 'word-spacing'
    , 'color'
    , 'text-align'
    , 'text-decoration'
    , 'text-indent'
    , 'text-overflow'
    , 'text-rendering'
    , 'text-size-adjust'
    , 'text-shadow'
    , 'text-transform'
    , 'word-break'
    , 'word-wrap'
    , 'white-space'
    , 'vertical-align'
    , 'list-style'
    , 'list-style-type'
    , 'list-style-position'
    , 'list-style-image'
    , 'pointer-events'
    , 'cursor'
    , 'background'
    , 'background-attachment'
    , 'background-color'
    , 'background-image'
    , 'background-position'
    , 'background-repeat'
    , 'background-size'
    , 'border'
    , 'border-collapse'
    , 'border-top'
    , 'border-right'
    , 'border-bottom'
    , 'border-left'
    , 'border-color'
    , 'border-top-color'
    , 'border-right-color'
    , 'border-bottom-color'
    , 'border-left-color'
    , 'border-spacing'
    , 'border-style'
    , 'border-top-style'
    , 'border-right-style'
    , 'border-bottom-style'
    , 'border-left-style'
    , 'border-width'
    , 'border-top-width'
    , 'border-right-width'
    , 'border-bottom-width'
    , 'border-left-width'
    , 'border-radius'
    , 'border-top-right-radius'
    , 'border-bottom-right-radius'
    , 'border-bottom-left-radius'
    , 'border-top-left-radius'
    , 'border-radius-topright'
    , 'border-radius-bottomright'
    , 'border-radius-bottomleft'
    , 'border-radius-topleft'
    , 'content'
    , 'quotes'
    , 'outline'
    , 'outline-offset'
    , 'opacity'
    , 'filter'
    , 'visibility'
    , 'size'
    , 'zoom'
    , 'transform'
    , 'box-align'
    , 'box-flex'
    , 'box-orient'
    , 'box-pack'
    , 'box-shadow'
    , 'box-sizing'
    , 'table-layout'
    , 'animation'
    , 'animation-delay'
    , 'animation-duration'
    , 'animation-iteration-count'
    , 'animation-name'
    , 'animation-play-state'
    , 'animation-timing-function'
    , 'animation-fill-mode'
    , 'transition'
    , 'transition-delay'
    , 'transition-duration'
    , 'transition-property'
    , 'transition-timing-function'
    , 'background-clip'
    , 'backface-visibility'
    , 'resize'
    , 'appearance'
    , 'user-select'
    , 'interpolation-mode'
    , 'direction'
    , 'marks'
    , 'page'
    , 'set-link-source'
    , 'unicode-bidi'
    ]

  // regex tests
  , HACK_PREFIX = new RegExp('^(' + hackPrefixes.join('|').replace(/[-[\]{}()*+?.,\\^$#\s]/g, "\\$&") + ')')
  , VENDOR_PREFIX = new RegExp('^(' + vendorPrefixes.join('|').replace(/[-[\]{}()*+?.,\\^$#\s]/g, "\\$&") + ')')


// validation method
module.exports = function (def, data) {

  // // default validation to true
  var isValid = true
    , dict = {}
    , index = 0
    , cleanRules
    , sortedRules
    , firstLine
    , extract
    , selector

  // return if no rules to validate
  if (!def.rules) return isValid

  // recurse over nested rulesets
  def.rules.forEach(function (rule) {
    if (rule.selectors) module.exports(rule, data)
  })

  cleanRules = def.rules.map(function (rule) {
    return rule.name && rule
  }).filter(function (item) { return item })

  // sort rules
  sortedRules = _.sortBy(cleanRules, function (rule) {

    // pad value of each rule position to account for vendor prefixes
    var padding = (vendorPrefixes.length + 1) * 10
      , root
      , val

    // strip vendor prefix and hack prefix from rule name to find root
    root = rule.name
      .replace(VENDOR_PREFIX, '')
      .replace(HACK_PREFIX, '')

    // find value of order of the root css property
    val = order.indexOf(root)

    // if property is not found, exit with property not found error
    if (!~val) {
      return util.throwError(def, {
        type: 'propertyNotFound'
      , message: 'Unknown property name: "' + rule.name + '"'
      })
    }

    // pad value
    val  = (val * padding) + 10

    // adjust value based on prefix
    val += VENDOR_PREFIX.exec(rule.name) ? vendorPrefixes.indexOf(RegExp.$1) : (vendorPrefixes.length + 1)

    // adjust value based on css hack
    val += HACK_PREFIX.exec(rule.name) ? (hackPrefixes.indexOf(RegExp.$1)) : 0

    // return sort value
    return val
  })

  // check to see if sortedRules has same order as provided rules
  isValid = _.isEqual(sortedRules, cleanRules)

  // return if sort is correct
  if (isValid) return isValid

  // get the line number of the first rule
  firstLine = util.getLine(def.rules[0].index, data)

  // generate a extract what the correct sorted rules would look like
  extract = sortedRules.map(function (rule) {
    if (!rule.name) return
    return util.padLine(firstLine + index++)
      + ' ' + rule.name + ': '
      + (typeof rule.value == 'string' ? rule.value : rule.value.toCSS({}))
      + ';'
  }).filter(function (item) { return item }).join('\n')

  // extract selector for error message
  selector = (' "' + def.selectors.map(function (selector) {
    return selector.toCSS && selector.toCSS({}).replace(/^\s/, '')
  }).join(', ') + '"').magenta

  // set error object on defintion token
  util.throwError(def, {
    type: RULE.type
  , message: RULE.message + selector + '\n\n  Correct order below:\n'.grey
  , extract: extract
  , sortedRules: sortedRules
  })

  // return valid state
  return isValid
}
