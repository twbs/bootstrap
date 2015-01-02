$(function () {
  'use strict';

  module('input-group')

  test('inputs and button heights should be the same', function () {
    var $styles = $('<style>'
       + '.btn-lg, .btn-group-lg > .btn {'
       + 'padding: 10px 16px;'
       + 'font-size: 18px;'
       + 'line-height: 1.34;'
       + 'border-radius: 6px;'
       + 'border: 1px solid transparent;'
       + '}'
       + '.input-lg {'
       + 'height: 46px;'
       + 'padding: 10px 16px;'
       + 'font-size: 18px;'
       + 'line-height: 1.33;'
       + 'border-radius: 6px;'
       + '}'
       + '.input-group-addon, .input-group-btn, .input-group .form-control {'
       + 'display: table-cell;'
       + '}'
       + '</style>').appendTo('head')
    var $htmlTemplate = $('<div class="input-group">'
        + '<div class="input-group-btn">'
        + '<button id="lg-btn" type="submit" class="btn btn-lg">?</button>'
        + '</div>'
        + '<input id="lg-input" type="text" class="form-control input-lg"/>'
        + '</div>'
        + '</div>').appendTo(document.body)
    var $btn = $('#lg-btn').css('height')
    var $input = $('#lg-input').css('height')
    equal($btn, $input, 'not the same height')
    $styles.remove()
    $htmlTemplate.remove()
  })
})
