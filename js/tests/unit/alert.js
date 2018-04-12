$(function () {
  'use strict'

  QUnit.module('alert plugin')

  QUnit.test('should be defined on jquery object', function (assert) {
    assert.expect(1)
    assert.ok($(document.body).alert, 'alert method is defined')
  })

  QUnit.module('alert', {
    beforeEach: function () {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.bootstrapAlert = $.fn.alert.noConflict()
    },
    afterEach: function () {
      $.fn.alert = $.fn.bootstrapAlert
      delete $.fn.bootstrapAlert
    }
  })

  QUnit.test('should provide no conflict', function (assert) {
    assert.expect(1)
    assert.strictEqual(typeof $.fn.alert, 'undefined', 'alert was set back to undefined (org value)')
  })

  QUnit.test('should return jquery collection containing the element', function (assert) {
    assert.expect(2)
    var $el = $('<div/>')
    var $alert = $el.bootstrapAlert()
    assert.ok($alert instanceof $, 'returns jquery collection')
    assert.strictEqual($alert[0], $el[0], 'collection contains element')
  })

  QUnit.test('should fade element out on clicking .close', function (assert) {
    assert.expect(1)
    var alertHTML = '<div class="alert alert-danger fade show">' +
        '<a class="close" href="#" data-dismiss="alert">×</a>' +
        '<p><strong>Holy guacamole!</strong> Best check yo self, you\'re not looking too good.</p>' +
        '</div>'

    var $alert = $(alertHTML).bootstrapAlert().appendTo($('#qunit-fixture'))

    $alert.find('.close').trigger('click')

    assert.strictEqual($alert.hasClass('show'), false, 'remove .show class on .close click')
  })

  QUnit.test('should remove element when clicking .close', function (assert) {
    assert.expect(2)
    var done = assert.async()
    var alertHTML = '<div class="alert alert-danger fade show">' +
        '<a class="close" href="#" data-dismiss="alert">×</a>' +
        '<p><strong>Holy guacamole!</strong> Best check yo self, you\'re not looking too good.</p>' +
        '</div>'
    var $alert = $(alertHTML).appendTo('#qunit-fixture').bootstrapAlert()

    assert.notEqual($('#qunit-fixture').find('.alert').length, 0, 'element added to dom')

    $alert
      .one('closed.bs.alert', function () {
        assert.strictEqual($('#qunit-fixture').find('.alert').length, 0, 'element removed from dom')
        done()
      })
      .find('.close')
      .trigger('click')
  })

  QUnit.test('should not fire closed when close is prevented', function (assert) {
    assert.expect(1)
    var done = assert.async()
    $('<div class="alert"/>')
      .on('close.bs.alert', function (e) {
        e.preventDefault()
        assert.ok(true, 'close event fired')
        done()
      })
      .on('closed.bs.alert', function () {
        assert.ok(false, 'closed event fired')
      })
      .bootstrapAlert('close')
  })

  QUnit.test('close should use internal _element if no element provided', function (assert) {
    assert.expect(1)

    var done = assert.async()
    var $el = $('<div/>')
    var $alert = $el.bootstrapAlert()
    var alertInstance = $alert.data('bs.alert')

    $alert.one('closed.bs.alert', function () {
      assert.ok('alert closed')
      done()
    })

    alertInstance.close()
  })

  QUnit.test('dispose should remove data and the element', function (assert) {
    assert.expect(2)

    var $el = $('<div/>')
    var $alert = $el.bootstrapAlert()

    assert.ok(typeof $alert.data('bs.alert') !== 'undefined')

    $alert.data('bs.alert').dispose()

    assert.ok(typeof $alert.data('bs.button') === 'undefined')
  })

  QUnit.test('should return alert version', function (assert) {
    assert.expect(1)

    if (typeof Alert !== 'undefined') {
      assert.ok(typeof Alert.VERSION === 'string')
    } else {
      assert.notOk()
    }
  })
})
