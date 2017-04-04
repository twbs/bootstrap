$(function () {
  'use strict'

  QUnit.module('modal plugin')

  QUnit.test('should be defined on jquery object', function (assert) {
    assert.expect(1)
    assert.ok($(document.body).modal, 'modal method is defined')
  })

  QUnit.module('modal', {
    before: function () {
      // Enable the scrollbar measurer
      $('<style type="text/css"> .modal-scrollbar-measure { position: absolute; top: -9999px; width: 50px; height: 50px; overflow: scroll; } </style>').appendTo('head')
      // Function to calculate the scrollbar width which is then compared to the padding or margin changes
      $.fn.getScrollbarWidth = function () {
        var scrollDiv = document.createElement('div')
        scrollDiv.className = 'modal-scrollbar-measure'
        document.body.appendChild(scrollDiv)
        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
        document.body.removeChild(scrollDiv)
        return scrollbarWidth
      }
    },
    beforeEach: function () {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.bootstrapModal = $.fn.modal.noConflict()
    },
    afterEach: function () {
      $.fn.modal = $.fn.bootstrapModal
      delete $.fn.bootstrapModal
    }
  })

  QUnit.test('should provide no conflict', function (assert) {
    assert.expect(1)
    assert.strictEqual($.fn.modal, undefined, 'modal was set back to undefined (orig value)')
  })

  QUnit.test('should throw explicit error on undefined method', function (assert) {
    assert.expect(1)
    var $el = $('<div id="modal-test"/>')
    $el.bootstrapModal()
    try {
      $el.bootstrapModal('noMethod')
    }
    catch (err) {
      assert.strictEqual(err.message, 'No method named "noMethod"')
    }
  })

  QUnit.test('should return jquery collection containing the element', function (assert) {
    assert.expect(2)
    var $el = $('<div id="modal-test"/>')
    var $modal = $el.bootstrapModal()
    assert.ok($modal instanceof $, 'returns jquery collection')
    assert.strictEqual($modal[0], $el[0], 'collection contains element')
  })

  QUnit.test('should expose defaults var for settings', function (assert) {
    assert.expect(1)
    assert.ok($.fn.bootstrapModal.Constructor.Default, 'default object exposed')
  })

  QUnit.test('should insert into dom when show method is called', function (assert) {
    assert.expect(1)
    var done = assert.async()

    $('<div id="modal-test"/>')
      .on('shown.bs.modal', function () {
        assert.notEqual($('#modal-test').length, 0, 'modal inserted into dom')
        done()
      })
      .bootstrapModal('show')
  })

  QUnit.test('should fire show event', function (assert) {
    assert.expect(1)
    var done = assert.async()

    $('<div id="modal-test"/>')
      .on('show.bs.modal', function () {
        assert.ok(true, 'show event fired')
        done()
      })
      .bootstrapModal('show')
  })

  QUnit.test('should not fire shown when show was prevented', function (assert) {
    assert.expect(1)
    var done = assert.async()

    $('<div id="modal-test"/>')
      .on('show.bs.modal', function (e) {
        e.preventDefault()
        assert.ok(true, 'show event fired')
        done()
      })
      .on('shown.bs.modal', function () {
        assert.ok(false, 'shown event fired')
      })
      .bootstrapModal('show')
  })

  QUnit.test('should hide modal when hide is called', function (assert) {
    assert.expect(3)
    var done = assert.async()

    $('<div id="modal-test"/>')
      .on('shown.bs.modal', function () {
        assert.ok($('#modal-test').is(':visible'), 'modal visible')
        assert.notEqual($('#modal-test').length, 0, 'modal inserted into dom')
        $(this).bootstrapModal('hide')
      })
      .on('hidden.bs.modal', function () {
        assert.ok(!$('#modal-test').is(':visible'), 'modal hidden')
        done()
      })
      .bootstrapModal('show')
  })

  QUnit.test('should toggle when toggle is called', function (assert) {
    assert.expect(3)
    var done = assert.async()

    $('<div id="modal-test"/>')
      .on('shown.bs.modal', function () {
        assert.ok($('#modal-test').is(':visible'), 'modal visible')
        assert.notEqual($('#modal-test').length, 0, 'modal inserted into dom')
        $(this).bootstrapModal('toggle')
      })
      .on('hidden.bs.modal', function () {
        assert.ok(!$('#modal-test').is(':visible'), 'modal hidden')
        done()
      })
      .bootstrapModal('toggle')
  })

  QUnit.test('should remove from dom when click [data-dismiss="modal"]', function (assert) {
    assert.expect(3)
    var done = assert.async()

    $('<div id="modal-test"><span class="close" data-dismiss="modal"/></div>')
      .on('shown.bs.modal', function () {
        assert.ok($('#modal-test').is(':visible'), 'modal visible')
        assert.notEqual($('#modal-test').length, 0, 'modal inserted into dom')
        $(this).find('.close').trigger('click')
      })
      .on('hidden.bs.modal', function () {
        assert.ok(!$('#modal-test').is(':visible'), 'modal hidden')
        done()
      })
      .bootstrapModal('toggle')
  })

  QUnit.test('should allow modal close with "backdrop:false"', function (assert) {
    assert.expect(2)
    var done = assert.async()

    $('<div id="modal-test" data-backdrop="false"/>')
      .on('shown.bs.modal', function () {
        assert.ok($('#modal-test').is(':visible'), 'modal visible')
        $(this).bootstrapModal('hide')
      })
      .on('hidden.bs.modal', function () {
        assert.ok(!$('#modal-test').is(':visible'), 'modal hidden')
        done()
      })
      .bootstrapModal('show')
  })

  QUnit.test('should close modal when clicking outside of modal-content', function (assert) {
    assert.expect(3)
    var done = assert.async()

    $('<div id="modal-test"><div class="contents"/></div>')
      .on('shown.bs.modal', function () {
        assert.notEqual($('#modal-test').length, 0, 'modal inserted into dom')
        $('.contents').trigger('click')
        assert.ok($('#modal-test').is(':visible'), 'modal visible')
        $('#modal-test').trigger('click')
      })
      .on('hidden.bs.modal', function () {
        assert.ok(!$('#modal-test').is(':visible'), 'modal hidden')
        done()
      })
      .bootstrapModal('show')
  })

  QUnit.test('should not close modal when clicking outside of modal-content if data-backdrop="true"', function (assert) {
    assert.expect(1)
    var done = assert.async()

    $('<div id="modal-test" data-backdrop="false"><div class="contents"/></div>')
      .on('shown.bs.modal', function () {
        $('#modal-test').trigger('click')
        assert.ok($('#modal-test').is(':visible'), 'modal not hidden')
        done()
      })
      .bootstrapModal('show')
  })

  QUnit.test('should close modal when escape key is pressed via keydown', function (assert) {
    assert.expect(3)
    var done = assert.async()

    var $div = $('<div id="modal-test"/>')
    $div
      .on('shown.bs.modal', function () {
        assert.ok($('#modal-test').length, 'modal inserted into dom')
        assert.ok($('#modal-test').is(':visible'), 'modal visible')
        $div.trigger($.Event('keydown', { which: 27 }))

        setTimeout(function () {
          assert.ok(!$('#modal-test').is(':visible'), 'modal hidden')
          $div.remove()
          done()
        }, 0)
      })
      .bootstrapModal('show')
  })

  QUnit.test('should not close modal when escape key is pressed via keyup', function (assert) {
    assert.expect(3)
    var done = assert.async()

    var $div = $('<div id="modal-test"/>')
    $div
      .on('shown.bs.modal', function () {
        assert.ok($('#modal-test').length, 'modal inserted into dom')
        assert.ok($('#modal-test').is(':visible'), 'modal visible')
        $div.trigger($.Event('keyup', { which: 27 }))

        setTimeout(function () {
          assert.ok($div.is(':visible'), 'modal still visible')
          $div.remove()
          done()
        }, 0)
      })
      .bootstrapModal('show')
  })

  QUnit.test('should trigger hide event once when clicking outside of modal-content', function (assert) {
    assert.expect(1)
    var done = assert.async()

    var triggered

    $('<div id="modal-test"><div class="contents"/></div>')
      .on('shown.bs.modal', function () {
        triggered = 0
        $('#modal-test').trigger('click')
      })
      .on('hide.bs.modal', function () {
        triggered += 1
        assert.strictEqual(triggered, 1, 'modal hide triggered once')
        done()
      })
      .bootstrapModal('show')
  })

  QUnit.test('should remove aria-hidden attribute when shown, add it back when hidden', function (assert) {
    assert.expect(3)
    var done = assert.async()

    $('<div id="modal-test" aria-hidden="true"/>')
      .on('shown.bs.modal', function () {
        assert.notOk($('#modal-test').is('[aria-hidden]'), 'aria-hidden attribute removed')
        $(this).bootstrapModal('hide')
      })
      .on('hidden.bs.modal', function () {
        assert.ok($('#modal-test').is('[aria-hidden]'), 'aria-hidden attribute added')
        assert.strictEqual($('#modal-test').attr('aria-hidden'), 'true', 'correct aria-hidden="true" added')
        done()
      })
      .bootstrapModal('show')
  })

  QUnit.test('should close reopened modal with [data-dismiss="modal"] click', function (assert) {
    assert.expect(2)
    var done = assert.async()

    $('<div id="modal-test"><div class="contents"><div id="close" data-dismiss="modal"/></div></div>')
      .one('shown.bs.modal', function () {
        $('#close').trigger('click')
      })
      .one('hidden.bs.modal', function () {
        // after one open-close cycle
        assert.ok(!$('#modal-test').is(':visible'), 'modal hidden')
        $(this)
          .one('shown.bs.modal', function () {
            $('#close').trigger('click')
          })
          .one('hidden.bs.modal', function () {
            assert.ok(!$('#modal-test').is(':visible'), 'modal hidden')
            done()
          })
          .bootstrapModal('show')
      })
      .bootstrapModal('show')
  })

  QUnit.test('should restore focus to toggling element when modal is hidden after having been opened via data-api', function (assert) {
    assert.expect(1)
    var done = assert.async()

    var $toggleBtn = $('<button data-toggle="modal" data-target="#modal-test"/>').appendTo('#qunit-fixture')

    $('<div id="modal-test"><div class="contents"><div id="close" data-dismiss="modal"/></div></div>')
      .on('hidden.bs.modal', function () {
        setTimeout(function () {
          assert.ok($(document.activeElement).is($toggleBtn), 'toggling element is once again focused')
          done()
        }, 0)
      })
      .on('shown.bs.modal', function () {
        $('#close').trigger('click')
      })
      .appendTo('#qunit-fixture')

    $toggleBtn.trigger('click')
  })

  QUnit.test('should not restore focus to toggling element if the associated show event gets prevented', function (assert) {
    assert.expect(1)
    var done = assert.async()
    var $toggleBtn = $('<button data-toggle="modal" data-target="#modal-test"/>').appendTo('#qunit-fixture')
    var $otherBtn = $('<button id="other-btn"/>').appendTo('#qunit-fixture')

    $('<div id="modal-test"><div class="contents"><div id="close" data-dismiss="modal"/></div>')
      .one('show.bs.modal', function (e) {
        e.preventDefault()
        $otherBtn.trigger('focus')
        setTimeout($.proxy(function () {
          $(this).bootstrapModal('show')
        }, this), 0)
      })
      .on('hidden.bs.modal', function () {
        setTimeout(function () {
          assert.ok($(document.activeElement).is($otherBtn), 'focus returned to toggling element')
          done()
        }, 0)
      })
      .on('shown.bs.modal', function () {
        $('#close').trigger('click')
      })
      .appendTo('#qunit-fixture')

    $toggleBtn.trigger('click')
  })

  QUnit.test('should adjust the inline body padding when opening and restore when closing', function (assert) {
    assert.expect(2)
    var done = assert.async()
    var $body = $(document.body)
    var originalPadding = $body.css('padding-right')

    $('<div id="modal-test"/>')
      .on('hidden.bs.modal', function () {
        var currentPadding = $body.css('padding-right')
        assert.strictEqual(currentPadding, originalPadding, 'body padding should be reset after closing')
        $body.removeAttr('style')
        done()
      })
      .on('shown.bs.modal', function () {
        var expectedPadding = parseFloat(originalPadding) + $(this).getScrollbarWidth() + 'px'
        var currentPadding = $body.css('padding-right')
        assert.strictEqual(currentPadding, expectedPadding, 'body padding should be adjusted while opening')
        $(this).bootstrapModal('hide')
      })
      .bootstrapModal('show')
  })

  QUnit.test('should store the original body padding in data-padding-right before showing', function (assert) {
    assert.expect(2)
    var done = assert.async()
    var $body = $(document.body)
    var originalPadding = '0px'
    $body.css('padding-right', originalPadding)

    $('<div id="modal-test"/>')
      .on('hidden.bs.modal', function () {
        assert.strictEqual($body.data('padding-right'), undefined, 'data-padding-right should be cleared after closing')
        $body.removeAttr('style')
        done()
      })
      .on('shown.bs.modal', function () {
        assert.strictEqual($body.data('padding-right'), originalPadding, 'original body padding should be stored in data-padding-right')
        $(this).bootstrapModal('hide')
      })
      .bootstrapModal('show')
  })

  QUnit.test('should adjust the inline padding of fixed elements when opening and restore when closing', function (assert) {
    assert.expect(2)
    var done = assert.async()
    var $element = $('<div class="fixed-top"></div>').appendTo('#qunit-fixture')
    var originalPadding = $element.css('padding-right')

    $('<div id="modal-test"/>')
      .on('hidden.bs.modal', function () {
        var currentPadding = $element.css('padding-right')
        assert.strictEqual(currentPadding, originalPadding, 'fixed element padding should be reset after closing')
        $element.remove()
        done()
      })
      .on('shown.bs.modal', function () {
        var expectedPadding = parseFloat(originalPadding) + $(this).getScrollbarWidth() + 'px'
        var currentPadding = $element.css('padding-right')
        assert.strictEqual(currentPadding, expectedPadding, 'fixed element padding should be adjusted while opening')
        $(this).bootstrapModal('hide')
      })
      .bootstrapModal('show')
  })

  QUnit.test('should store the original padding of fixed elements in data-padding-right before showing', function (assert) {
    assert.expect(2)
    var done = assert.async()
    var $element = $('<div class="fixed-top"></div>').appendTo('#qunit-fixture')
    var originalPadding = '0px'
    $element.css('padding-right', originalPadding)

    $('<div id="modal-test"/>')
      .on('hidden.bs.modal', function () {
        assert.strictEqual($element.data('padding-right'), undefined, 'data-padding-right should be cleared after closing')
        $element.remove()
        done()
      })
      .on('shown.bs.modal', function () {
        assert.strictEqual($element.data('padding-right'), originalPadding, 'original fixed element padding should be stored in data-padding-right')
        $(this).bootstrapModal('hide')
      })
      .bootstrapModal('show')
  })

  QUnit.test('should adjust the inline margin of the navbar-toggler when opening and restore when closing', function (assert) {
    assert.expect(2)
    var done = assert.async()
    var $element = $('<div class="navbar-toggler"></div>').appendTo('#qunit-fixture')
    var originalMargin = $element.css('margin-right')

    $('<div id="modal-test"/>')
      .on('hidden.bs.modal', function () {
        var currentMargin = $element.css('margin-right')
        assert.strictEqual(currentMargin, originalMargin, 'navbar-toggler margin should be reset after closing')
        $element.remove()
        done()
      })
      .on('shown.bs.modal', function () {
        var expectedMargin = parseFloat(originalMargin) + $(this).getScrollbarWidth() + 'px'
        var currentMargin = $element.css('margin-right')
        assert.strictEqual(currentMargin, expectedMargin, 'navbar-toggler margin should be adjusted while opening')
        $(this).bootstrapModal('hide')
      })
      .bootstrapModal('show')
  })

  QUnit.test('should store the original margin of the navbar-toggler in data-margin-right before showing', function (assert) {
    assert.expect(2)
    var done = assert.async()
    var $element = $('<div class="navbar-toggler"></div>').appendTo('#qunit-fixture')
    var originalMargin = '0px'
    $element.css('margin-right', originalMargin)

    $('<div id="modal-test"/>')
      .on('hidden.bs.modal', function () {
        assert.strictEqual($element.data('margin-right'), undefined, 'data-margin-right should be cleared after closing')
        $element.remove()
        done()
      })
      .on('shown.bs.modal', function () {
        assert.strictEqual($element.data('margin-right'), originalMargin, 'original navbar-toggler margin should be stored in data-margin-right')
        $(this).bootstrapModal('hide')
      })
      .bootstrapModal('show')
  })

  QUnit.test('should ignore values set via CSS when trying to restore body padding after closing', function (assert) {
    assert.expect(1)
    var done = assert.async()
    var $body = $(document.body)
    var $style = $('<style>body { padding-right: 42px; }</style>').appendTo('head')

    $('<div id="modal-test"/>')
      .on('hidden.bs.modal', function () {
        assert.ok(!$body.attr('style'), 'body does not have inline padding set')
        $style.remove()
        done()
      })
      .on('shown.bs.modal', function () {
        $(this).bootstrapModal('hide')
      })
      .bootstrapModal('show')
  })

  QUnit.test('should ignore other inline styles when trying to restore body padding after closing', function (assert) {
    assert.expect(2)
    var done = assert.async()
    var $body = $(document.body)
    var $style = $('<style>body { padding-right: 42px; }</style>').appendTo('head')

    $body.css('color', 'red')

    $('<div id="modal-test"/>')
      .on('hidden.bs.modal', function () {
        assert.strictEqual($body[0].style.paddingRight, '', 'body does not have inline padding set')
        assert.strictEqual($body[0].style.color, 'red', 'body still has other inline styles set')
        $body.removeAttr('style')
        $style.remove()
        done()
      })
      .on('shown.bs.modal', function () {
        $(this).bootstrapModal('hide')
      })
      .bootstrapModal('show')
  })

  QUnit.test('should properly restore non-pixel inline body padding after closing', function (assert) {
    assert.expect(1)
    var done = assert.async()
    var $body = $(document.body)

    $body.css('padding-right', '5%')

    $('<div id="modal-test"/>')
      .on('hidden.bs.modal', function () {
        assert.strictEqual($body[0].style.paddingRight, '5%', 'body does not have inline padding set')
        $body.removeAttr('style')
        done()
      })
      .on('shown.bs.modal', function () {
        $(this).bootstrapModal('hide')
      })
      .bootstrapModal('show')
  })

  QUnit.test('should not follow link in area tag', function (assert) {
    assert.expect(2)
    var done = assert.async()

    $('<map><area id="test" shape="default" data-toggle="modal" data-target="#modal-test" href="demo.html"/></map>')
      .appendTo('#qunit-fixture')

    $('<div id="modal-test"><div class="contents"><div id="close" data-dismiss="modal"/></div></div>')
      .appendTo('#qunit-fixture')

    $('#test')
      .on('click.bs.modal.data-api', function (event) {
        assert.notOk(event.isDefaultPrevented(), 'navigating to href will happen')

        setTimeout(function () {
          assert.ok(event.isDefaultPrevented(), 'model shown instead of navigating to href')
          done()
        }, 1)
      })
      .trigger('click')
  })
})
