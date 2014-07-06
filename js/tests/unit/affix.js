$(function () {
  'use strict';

  module('affix plugin')

  test('should be defined on jquery object', function () {
    ok($(document.body).affix, 'affix method is defined')
  })

  module('affix', {
    setup: function () {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.bootstrapAffix = $.fn.affix.noConflict()
    },
    teardown: function () {
      $.fn.affix = $.fn.bootstrapAffix
      delete $.fn.bootstrapAffix
    }
  })

  test('should provide no conflict', function () {
    strictEqual($.fn.affix, undefined, 'affix was set back to undefined (org value)')
  })

  test('should return jquery collection containing the element', function () {
    var $el = $('<div/>')
    var $affix = $el.bootstrapAffix()
    ok($affix instanceof $, 'returns jquery collection')
    strictEqual($affix[0], $el[0], 'collection contains element')
  })

  test('should exit early if element is not visible', function () {
    var $affix = $('<div style="display: none"/>').bootstrapAffix()
    $affix.data('bs.affix').checkPosition()
    ok(!$affix.hasClass('affix'), 'affix class was not added')
  })

  test('should trigger affixed event after affix', function () {
    stop()

    var templateHTML = '<div id="affixTarget">' +
        '<ul>' +
        '<li>Please affix</li>' +
        '<li>And unaffix</li>' +
        '</ul>' +
        '</div>' +
        '<div id="affixAfter" style="height: 20000px; display: block;"/>'
    $(templateHTML).appendTo(document.body)

    $('#affixTarget').bootstrapAffix({
      offset: $('#affixTarget ul').position()
    })

    $('#affixTarget')
      .on('affix.bs.affix', function () {
        ok(true, 'affix event fired')
      }).on('affixed.bs.affix', function () {
        ok(true, 'affixed event fired')
        $('#affixTarget, #affixAfter').remove()
        start()
      })

    setTimeout(function () {
      window.scrollTo(0, document.body.scrollHeight)

      setTimeout(function () {
        window.scroll(0, 0)
      }, 16) // for testing in a browser
    }, 0)
  })
})
