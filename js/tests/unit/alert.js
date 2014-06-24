$(function () {

  module('alert plugin')

  test('should be defined on jquery object', function () {
    ok($(document.body).alert, 'alert method is defined')
  })

  module('alert', {
    setup: function() {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.bootstrapAlert = $.fn.alert.noConflict()
    },
    teardown: function() {
      $.fn.alert = $.fn.bootstrapAlert
      delete $.fn.bootstrapAlert
    }
  })

  test('should provide no conflict', function () {
    ok(!$.fn.alert, 'alert was set back to undefined (org value)')
  })

  test('should return element', function () {
    ok($(document.body).bootstrapAlert()[0] == document.body, 'document.body returned')
  })

  test('should fade element out on clicking .close', function () {
    var alertHTML = '<div class="alert-message warning fade in">' +
        '<a class="close" href="#" data-dismiss="alert">×</a>' +
        '<p><strong>Holy guacamole!</strong> Best check yo self, you\'re not looking too good.</p>' +
        '</div>',
      alert = $(alertHTML).bootstrapAlert()

    alert.find('.close').click()

    ok(!alert.hasClass('in'), 'remove .in class on .close click')
  })

  test('should remove element when clicking .close', function () {
    $.support.transition = false

    var alertHTML = '<div class="alert-message warning fade in">' +
        '<a class="close" href="#" data-dismiss="alert">×</a>' +
        '<p><strong>Holy guacamole!</strong> Best check yo self, you\'re not looking too good.</p>' +
        '</div>',
      alert = $(alertHTML).appendTo('#qunit-fixture').bootstrapAlert()

    ok($('#qunit-fixture').find('.alert-message').length, 'element added to dom')

    alert.find('.close').click()

    ok(!$('#qunit-fixture').find('.alert-message').length, 'element removed from dom')
  })

  test('should not fire closed when close is prevented', function () {
    $.support.transition = false
    stop()
    $('<div class="alert"/>')
      .on('close.bs.alert', function (e) {
        e.preventDefault()
        ok(true)
        start()
      })
      .on('closed.bs.alert', function () {
        ok(false)
      })
      .bootstrapAlert('close')
  })

})
