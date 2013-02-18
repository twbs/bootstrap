// ==========================================
// RECESS
// COMPILE: remove units from 0 values
// ==========================================
// Copyright 2012 Twitter, Inc
// Licensed under the Apache License v2.0
// http://www.apache.org/licenses/LICENSE-2.0
// ==========================================

'use strict'

var less = require('less')
  , toCSS
  , units = [
      '%'
    , 'in'
    , 'cm'
    , 'mm'
    , 'em'
    , 'ex'
    , 'pt'
    , 'pc'
    , 'px'
    ]
  , UNITS = new RegExp('\\b0\\s?(' + units.join('|') + ')')

function compile () {
  // strip units from 0 values
  var props = toCSS.apply(this, arguments)

  // don't strip chars from hex codes
  return /#/.test(props) ? props : props.replace(UNITS, '0')
}

module.exports.on = function () {
  toCSS = less.tree.Value.prototype.toCSS
  less.tree.Value.prototype.toCSS = compile
}

module.exports.off = function () {
  less.tree.Value.prototype.toCSS = toCSS
}