$(function () {
  'use strict'

  if (typeof bootstrap !== 'undefined') {
    window.Toast = bootstrap.Toast
  }

  QUnit.module('toast plugin')

  QUnit.test('should be defined on jquery object', function (assert) {
    assert.expect(1)
    assert.ok($(document.body).toast, 'toast method is defined')
  })

  QUnit.module('toast', {
    beforeEach: function () {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.bootstrapToast = $.fn.toast.noConflict()
    },
    afterEach: function () {
      $.fn.toast = $.fn.bootstrapToast
      delete $.fn.bootstrapToast
      $('#qunit-fixture').html('')
    }
  })

  QUnit.test('should provide no conflict', function (assert) {
    assert.expect(1)
    assert.strictEqual(typeof $.fn.toast, 'undefined', 'toast was set back to undefined (org value)')
  })

  QUnit.test('should return the current version', function (assert) {
    assert.expect(1)
    assert.strictEqual(typeof Toast.VERSION, 'string')
  })

  QUnit.test('should throw explicit error on undefined method', function (assert) {
    assert.expect(1)
    var $el = $('<div/>')
    $el.bootstrapToast()

    try {
      $el.bootstrapToast('noMethod')
    } catch (err) {
      assert.strictEqual(err.message, 'No method named "noMethod"')
    }
  })

  QUnit.test('should return jquery collection containing the element', function (assert) {
    assert.expect(2)

    var $el = $('<div/>')
    var $toast = $el.bootstrapToast()
    assert.ok($toast instanceof $, 'returns jquery collection')
    assert.strictEqual($toast[0], $el[0], 'collection contains element')
  })

  QUnit.test('should auto hide', function (assert) {
    assert.expect(1)
    var done = assert.async()

    var toastHtml =
      '<div class="toast" data-delay="1">' +
        '<div class="toast-body">' +
          'a simple toast' +
        '</div>' +
      '</div>'

    var $toast = $(toastHtml)
      .bootstrapToast()
      .appendTo($('#qunit-fixture'))

    $toast.on('hidden.bs.toast', function () {
      assert.strictEqual($toast.hasClass('show'), false)
      done()
    })
      .bootstrapToast('show')
  })

  QUnit.test('should not add fade class', function (assert) {
    assert.expect(1)
    var done = assert.async()

    var toastHtml =
      '<div class="toast" data-delay="1" data-animation="false">' +
        '<div class="toast-body">' +
          'a simple toast' +
        '</div>' +
      '</div>'

    var $toast = $(toastHtml)
      .bootstrapToast()
      .appendTo($('#qunit-fixture'))

    $toast.on('shown.bs.toast', function () {
      assert.strictEqual($toast.hasClass('fade'), false)
      done()
    })
      .bootstrapToast('show')
  })

  QUnit.test('should allow to hide toast manually', function (assert) {
    assert.expect(1)
    var done = assert.async()

    var toastHtml =
      '<div class="toast" data-delay="1" data-autohide="false">' +
        '<div class="toast-body">' +
          'a simple toast' +
        '</div>' +
      '</div>'

    var $toast = $(toastHtml)
      .bootstrapToast()
      .appendTo($('#qunit-fixture'))

    $toast
      .on('shown.bs.toast', function () {
        $toast.bootstrapToast('hide')
      })
      .on('hidden.bs.toast', function () {
        assert.strictEqual($toast.hasClass('show'), false)
        done()
      })
      .bootstrapToast('show')
  })

  QUnit.test('should do nothing when we call hide on a non shown toast', function (assert) {
    assert.expect(1)

    var $toast = $('<div />')
      .bootstrapToast()
      .appendTo($('#qunit-fixture'))

    var spy = sinon.spy($toast[0].classList, 'contains')

    $toast.bootstrapToast('hide')

    assert.strictEqual(spy.called, true)
  })

  QUnit.test('should allow to destroy toast', function (assert) {
    assert.expect(2)

    var $toast = $('<div />')
      .bootstrapToast()
      .appendTo($('#qunit-fixture'))

    assert.ok(typeof $toast.data('bs.toast') !== 'undefined')

    $toast.bootstrapToast('dispose')

    assert.ok(typeof $toast.data('bs.toast') === 'undefined')
  })

  QUnit.test('should allow to destroy toast and hide it before that', function (assert) {
    assert.expect(4)
    var done = assert.async()

    var toastHtml =
      '<div class="toast" data-delay="0" data-autohide="false">' +
        '<div class="toast-body">' +
          'a simple toast' +
        '</div>' +
      '</div>'

    var $toast = $(toastHtml)
      .bootstrapToast()
      .appendTo($('#qunit-fixture'))

    $toast.one('shown.bs.toast', function () {
      setTimeout(function () {
        assert.ok($toast.hasClass('show'))
        assert.ok(typeof $toast.data('bs.toast') !== 'undefined')

        $toast.bootstrapToast('dispose')

        assert.ok(typeof $toast.data('bs.toast') === 'undefined')
        assert.ok($toast.hasClass('show') === false)

        done()
      }, 1)
    })
      .bootstrapToast('show')
  })

  QUnit.test('should allow to config in js', function (assert) {
    assert.expect(1)
    var done = assert.async()

    var toastHtml =
      '<div class="toast">' +
        '<div class="toast-body">' +
          'a simple toast' +
        '</div>' +
      '</div>'

    var $toast = $(toastHtml)
      .bootstrapToast({
        delay: 1
      })
      .appendTo($('#qunit-fixture'))

    $toast.on('shown.bs.toast', function () {
      assert.strictEqual($toast.hasClass('show'), true)
      done()
    })
      .bootstrapToast('show')
  })


  QUnit.test('should close toast when close element with data-dismiss attribute is set', function (assert) {
    assert.expect(2)
    var done = assert.async()

    var toastHtml =
      '<div class="toast" data-delay="1" data-autohide="false" data-animation="false">' +
        '<button type="button" class="ml-2 mb-1 close" data-dismiss="toast">' +
          'close' +
        '</button>' +
      '</div>'

    var $toast = $(toastHtml)
      .bootstrapToast()
      .appendTo($('#qunit-fixture'))

    $toast
      .on('shown.bs.toast', function () {
        assert.strictEqual($toast.hasClass('show'), true)
        var button = $toast.find('.close')
        button.trigger('click')
      })
      .on('hidden.bs.toast', function () {
        assert.strictEqual($toast.hasClass('show'), false)
        done()
      })
      .bootstrapToast('show')
  })

  QUnit.test('should expose default setting to allow to override them', function (assert) {
    assert.expect(1)

    var defaultDelay = 1000
    Toast.Default.delay = defaultDelay

    var toastHtml =
      '<div class="toast" data-autohide="false" data-animation="false">' +
        '<button type="button" class="ml-2 mb-1 close" data-dismiss="toast">' +
          'close' +
        '</button>' +
      '</div>'

    var $toast = $(toastHtml)
      .bootstrapToast()

    var toast = $toast.data('bs.toast')
    assert.strictEqual(toast._config.delay, defaultDelay)
  })

  QUnit.test('should not trigger shown if show is prevented', function (assert) {
    assert.expect(1)
    var done = assert.async()

    var toastHtml =
      '<div class="toast" data-delay="1" data-autohide="false">' +
        '<div class="toast-body">' +
          'a simple toast' +
        '</div>' +
      '</div>'

    var $toast = $(toastHtml)
      .bootstrapToast()
      .appendTo($('#qunit-fixture'))

    var shownCalled = false
    function assertDone() {
      setTimeout(function () {
        assert.strictEqual(shownCalled, false)
        done()
      }, 20)
    }

    $toast
      .on('show.bs.toast', function (event) {
        event.preventDefault()
        assertDone()
      })
      .on('shown.bs.toast', function () {
        shownCalled = true
      })
      .bootstrapToast('show')
  })

  QUnit.test('should not trigger hidden if hide is prevented', function (assert) {
    assert.expect(1)
    var done = assert.async()

    var toastHtml =
      '<div class="toast" data-delay="1" data-autohide="false">' +
        '<div class="toast-body">' +
          'a simple toast' +
        '</div>' +
      '</div>'

    var $toast = $(toastHtml)
      .bootstrapToast()
      .appendTo($('#qunit-fixture'))

    var hiddenCalled = false
    function assertDone() {
      setTimeout(function () {
        assert.strictEqual(hiddenCalled, false)
        done()
      }, 20)
    }

    $toast
      .on('shown.bs.toast', function () {
        $toast.bootstrapToast('hide')
      })
      .on('hide.bs.toast', function (event) {
        event.preventDefault()
        assertDone()
      })
      .on('hidden.bs.toast', function () {
        hiddenCalled = true
      })
      .bootstrapToast('show')
  })
})
