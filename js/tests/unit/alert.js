$(function () {
  'use strict';

  module('alert plugin')

  test('should be defined on jquery object', function () {
    ok($(document.body).alert, 'alert method is defined')
  })

  module('alert', {
    setup: function () {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.bootstrapAlert = $.fn.alert.noConflict()
    },
    teardown: function () {
      $.fn.alert = $.fn.bootstrapAlert
      delete $.fn.bootstrapAlert
    }
  })

  test('should provide no conflict', function () {
    strictEqual($.fn.alert, undefined, 'alert was set back to undefined (org value)')
  })

  test('should return jquery collection containing the element', function () {
    var $el = $('<div/>')
    var $alert = $el.bootstrapAlert()
    ok($alert instanceof $, 'returns jquery collection')
    strictEqual($alert[0], $el[0], 'collection contains element')
  })

  test('should fade element out on clicking .close', function () {
    var alertHTML = '<div class="alert alert-danger fade in">'
        + '<a class="close" href="#" data-dismiss="alert">×</a>'
        + '<p><strong>Holy guacamole!</strong> Best check yo self, you\'re not looking too good.</p>'
        + '</div>'
    var $alert = $(alertHTML).bootstrapAlert()

    $alert.find('.close').click()

    equal($alert.hasClass('in'), false, 'remove .in class on .close click')
  })

  test('should remove element when clicking .close', function () {
    var alertHTML = '<div class="alert alert-danger fade in">'
        + '<a class="close" href="#" data-dismiss="alert">×</a>'
        + '<p><strong>Holy guacamole!</strong> Best check yo self, you\'re not looking too good.</p>'
        + '</div>'
    var $alert = $(alertHTML).appendTo('#qunit-fixture').bootstrapAlert()

    notEqual($('#qunit-fixture').find('.alert').length, 0, 'element added to dom')

    $alert.find('.close').click()

    equal($('#qunit-fixture').find('.alert').length, 0, 'element removed from dom')
  })

  test('should not fire closed when close is prevented', function (assert) {
    var done = assert.async()
    $('<div class="alert"/>')
      .on('close.bs.alert', function (e) {
        e.preventDefault()
        ok(true, 'close event fired')
        done()
      })
      .on('closed.bs.alert', function () {
        ok(false, 'closed event fired')
      })
      .bootstrapAlert('close')
  })

})
