$(function () {
  'use strict';

  var isOldIE = function () {
    return /MSIE\s/.test(navigator.userAgent) && parseFloat(navigator.appVersion.split('MSIE')[1]) < 10
  }

  QUnit.module('spinner plugin')

  QUnit.test('should be defined on jquery object', function (assert) {
    assert.expect(1)
    assert.ok($(document.body).spinner, 'spinner method is defined')
  })

  QUnit.module('spinner', {
    beforeEach: function () {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.bootstrapSpinner = $.fn.spinner.noConflict()
    },
    afterEach: function () {
      $.fn.spinner = $.fn.bootstrapSpinner
      delete $.fn.bootstrapSpinner
    }
  })

  QUnit.test('should provide no conflict', function (assert) {
    assert.expect(1)
    assert.strictEqual($.fn.spinner, undefined, 'spinner was set back to undefined (org value)')
  })

  QUnit.test('should throw explicit error on undefined method', function (assert) {
    assert.expect(1)
    var $el = $('<div/>')
    $el.bootstrapSpinner()
    try {
      $el.bootstrapSpinner('noMethod')
    }
    catch (err) {
      assert.strictEqual(err.message, 'No method named "noMethod"')
    }
  })

  QUnit.test('should return jquery collection containing the element', function (assert) {
    assert.expect(2)
    var $el = $('<div/>')
    var $spinner = $el.bootstrapSpinner()
    assert.ok($spinner instanceof $, 'returns jquery collection')
    assert.strictEqual($spinner[0], $el[0], 'collection contains element')
  })

  QUnit.test('should create fallback elements', function (assert) {
    if (!isOldIE()) {
      // Skip browsers other than IE9 since they support animations natively
      assert.expect(0)
      return
    }

    assert.expect(3)
    var $el = $('<div/>')
    var $spinner = $el.bootstrapSpinner()
    var $spin = $el.children('div')
    assert.ok($el.hasClass('spinner-fallback'), '"spinner-fallback" class added to the element')
    assert.strictEqual($spin.length, 1, 'fallback spinner was created inside of the element')
    assert.ok($spin.hasClass('spinner-fallback-spin'), '"spinner-fallback-spin" class added to the fallback spinner element')
  })

  QUnit.test('should destroy spinner fallback', function (assert) {
    if (!isOldIE()) {
      // Skip browsers other than IE9 since they support animations natively
      assert.expect(0)
      return
    }

    assert.expect(5)
    var $el = $('<div/>')
    var $spinner = $el.bootstrapSpinner()
    var $spin = $el.children('div')
    assert.ok($el.hasClass('spinner-fallback'), '"spinner-fallback" class added to the element')
    assert.strictEqual($spin.length, 1, 'fallback spinner was created inside of the element')
    assert.ok($spin.hasClass('spinner-fallback-spin'), '"spinner-fallback-spin" class added to the fallback spinner element')
    $el.bootstrapSpinner('destroy')
    $spin = $el.children('div')
    assert.ok(!$el.hasClass('spinner-fallback'), '"spinner-fallback" class removed from the element')
    assert.strictEqual($spin.length, 0, 'fallback spinner was removed from the element')
  })

})
