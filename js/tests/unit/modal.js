$(function () {
  'use strict';

  module('modal plugin')

  test('should be defined on jquery object', function () {
    ok($(document.body).modal, 'modal method is defined')
  })

  module('modal', {
    setup: function () {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.bootstrapModal = $.fn.modal.noConflict()
    },
    teardown: function () {
      $.fn.modal = $.fn.bootstrapModal
      delete $.fn.bootstrapModal
    }
  })

  test('should provide no conflict', function () {
    strictEqual($.fn.modal, undefined, 'modal was set back to undefined (orig value)')
  })

  test('should return jquery collection containing the element', function () {
    var $el = $('<div id="modal-test"/>')
    var $modal = $el.bootstrapModal()
    ok($modal instanceof $, 'returns jquery collection')
    strictEqual($modal[0], $el[0], 'collection contains element')
  })

  test('should expose defaults var for settings', function () {
    ok($.fn.bootstrapModal.Constructor.DEFAULTS, 'default object exposed')
  })

  test('should insert into dom when show method is called', function (assert) {
    var done = assert.async()

    $('<div id="modal-test"/>')
      .on('shown.bs.modal', function () {
        notEqual($('#modal-test').length, 0, 'modal inserted into dom')
        done()
      })
      .bootstrapModal('show')
  })

  test('should fire show event', function (assert) {
    var done = assert.async()

    $('<div id="modal-test"/>')
      .on('show.bs.modal', function () {
        ok(true, 'show event fired')
        done()
      })
      .bootstrapModal('show')
  })

  test('should not fire shown when show was prevented', function (assert) {
    var done = assert.async()

    $('<div id="modal-test"/>')
      .on('show.bs.modal', function (e) {
        e.preventDefault()
        ok(true, 'show event fired')
        done()
      })
      .on('shown.bs.modal', function () {
        ok(false, 'shown event fired')
      })
      .bootstrapModal('show')
  })

  test('should hide modal when hide is called', function (assert) {
    var done = assert.async()

    $('<div id="modal-test"/>')
      .on('shown.bs.modal', function () {
        ok($('#modal-test').is(':visible'), 'modal visible')
        notEqual($('#modal-test').length, 0, 'modal inserted into dom')
        $(this).bootstrapModal('hide')
      })
      .on('hidden.bs.modal', function () {
        ok(!$('#modal-test').is(':visible'), 'modal hidden')
        done()
      })
      .bootstrapModal('show')
  })

  test('should toggle when toggle is called', function (assert) {
    var done = assert.async()

    $('<div id="modal-test"/>')
      .on('shown.bs.modal', function () {
        ok($('#modal-test').is(':visible'), 'modal visible')
        notEqual($('#modal-test').length, 0, 'modal inserted into dom')
        $(this).bootstrapModal('toggle')
      })
      .on('hidden.bs.modal', function () {
        ok(!$('#modal-test').is(':visible'), 'modal hidden')
        done()
      })
      .bootstrapModal('toggle')
  })

  test('should remove from dom when click [data-dismiss="modal"]', function (assert) {
    var done = assert.async()

    $('<div id="modal-test"><span class="close" data-dismiss="modal"/></div>')
      .on('shown.bs.modal', function () {
        ok($('#modal-test').is(':visible'), 'modal visible')
        notEqual($('#modal-test').length, 0, 'modal inserted into dom')
        $(this).find('.close').click()
      })
      .on('hidden.bs.modal', function () {
        ok(!$('#modal-test').is(':visible'), 'modal hidden')
        done()
      })
      .bootstrapModal('toggle')
  })

  test('should allow modal close with "backdrop:false"', function (assert) {
    var done = assert.async()

    $('<div id="modal-test" data-backdrop="false"/>')
      .on('shown.bs.modal', function () {
        ok($('#modal-test').is(':visible'), 'modal visible')
        $(this).bootstrapModal('hide')
      })
      .on('hidden.bs.modal', function () {
        ok(!$('#modal-test').is(':visible'), 'modal hidden')
        done()
      })
      .bootstrapModal('show')
  })

  test('should close modal when clicking outside of modal-content', function (assert) {
    var done = assert.async()

    $('<div id="modal-test"><div class="contents"/></div>')
      .on('shown.bs.modal', function () {
        notEqual($('#modal-test').length, 0, 'modal insterted into dom')
        $('.contents').click()
        ok($('#modal-test').is(':visible'), 'modal visible')
        $('#modal-test .modal-backdrop').click()
      })
      .on('hidden.bs.modal', function () {
        ok(!$('#modal-test').is(':visible'), 'modal hidden')
        done()
      })
      .bootstrapModal('show')
  })

  test('should close modal when escape key is pressed via keydown', function (assert) {
    var done = assert.async()

    var div = $('<div id="modal-test"/>')
    div
      .on('shown.bs.modal', function () {
        ok($('#modal-test').length, 'modal insterted into dom')
        ok($('#modal-test').is(':visible'), 'modal visible')
        div.trigger($.Event('keydown', { which: 27 }))

        setTimeout(function () {
          ok(!$('#modal-test').is(':visible'), 'modal hidden')
          div.remove()
          done()
        }, 0)
      })
      .bootstrapModal('show')
  })

  test('should not close modal when escape key is pressed via keyup', function (assert) {
    var done = assert.async()

    var div = $('<div id="modal-test"/>')
    div
      .on('shown.bs.modal', function () {
        ok($('#modal-test').length, 'modal insterted into dom')
        ok($('#modal-test').is(':visible'), 'modal visible')
        div.trigger($.Event('keyup', { which: 27 }))

        setTimeout(function () {
          ok($('#modal-test').is(':visible'), 'modal still visible')
          div.remove()
          done()
        }, 0)
      })
      .bootstrapModal('show')
  })

  test('should trigger hide event once when clicking outside of modal-content', function (assert) {
    var done = assert.async()

    var triggered

    $('<div id="modal-test"><div class="contents"/></div>')
      .on('shown.bs.modal', function () {
        triggered = 0
        $('#modal-test .modal-backdrop').click()
      })
      .on('hide.bs.modal', function () {
        triggered += 1
        strictEqual(triggered, 1, 'modal hide triggered once')
        done()
      })
      .bootstrapModal('show')
  })

  test('should close reopened modal with [data-dismiss="modal"] click', function (assert) {
    var done = assert.async()

    $('<div id="modal-test"><div class="contents"><div id="close" data-dismiss="modal"/></div></div>')
      .one('shown.bs.modal', function () {
        $('#close').click()
      })
      .one('hidden.bs.modal', function () {
        // after one open-close cycle
        ok(!$('#modal-test').is(':visible'), 'modal hidden')
        $(this)
          .one('shown.bs.modal', function () {
            $('#close').click()
          })
          .one('hidden.bs.modal', function () {
            ok(!$('#modal-test').is(':visible'), 'modal hidden')
            done()
          })
          .bootstrapModal('show')
      })
      .bootstrapModal('show')
  })

  test('should restore focus to toggling element when modal is hidden after having been opened via data-api', function (assert) {
    var done = assert.async()

    var $toggleBtn = $('<button data-toggle="modal" data-target="#modal-test"/>').appendTo('#qunit-fixture')

    $('<div id="modal-test"><div class="contents"><div id="close" data-dismiss="modal"/></div></div>')
      .on('hidden.bs.modal', function () {
        setTimeout(function () {
          ok($(document.activeElement).is($toggleBtn), 'toggling element is once again focused')
          done()
        }, 0)
      })
      .on('shown.bs.modal', function () {
        $('#close').click()
      })
      .appendTo('#qunit-fixture')

    $toggleBtn.click()
  })

  test('should not restore focus to toggling element if the associated show event gets prevented', function (assert) {
    var done = assert.async()
    var $toggleBtn = $('<button data-toggle="modal" data-target="#modal-test"/>').appendTo('#qunit-fixture')
    var $otherBtn = $('<button id="other-btn"/>').appendTo('#qunit-fixture')

    $('<div id="modal-test"><div class="contents"><div id="close" data-dismiss="modal"/></div>')
      .one('show.bs.modal', function (e) {
        e.preventDefault()
        $otherBtn.focus()
        setTimeout($.proxy(function () {
          $(this).bootstrapModal('show')
        }, this), 0)
      })
      .on('hidden.bs.modal', function () {
        setTimeout(function () {
          ok($(document.activeElement).is($otherBtn), 'focus returned to toggling element')
          done()
        }, 0)
      })
      .on('shown.bs.modal', function () {
        $('#close').click()
      })
      .appendTo('#qunit-fixture')

    $toggleBtn.click()
  })
})
