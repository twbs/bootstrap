$(function () {

  module('modal plugin')

  test('should be defined on jquery object', function () {
    var div = $('<div id="modal-test"></div>')
    ok(div.modal, 'modal method is defined')
  })

  module('modal', {
    setup: function() {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.bootstrapModal = $.fn.modal.noConflict()
    },
    teardown: function() {
      $.fn.modal = $.fn.bootstrapModal
      delete $.fn.bootstrapModal
    }
  })

  test('should provide no conflict', function () {
    ok(!$.fn.modal, 'modal was set back to undefined (org value)')
  })

  test('should return element', function () {
    var div = $('<div id="modal-test"></div>')
    ok(div.bootstrapModal() == div, 'document.body returned')
    $('#modal-test').remove()
  })

  test('should expose defaults var for settings', function () {
    ok($.fn.bootstrapModal.Constructor.DEFAULTS, 'default object exposed')
  })

  test('should insert into dom when show method is called', function () {
    stop()
    $.support.transition = false
    $('<div id="modal-test"></div>')
      .on('shown.bs.modal', function () {
        ok($('#modal-test').length, 'modal inserted into dom')
        $(this).remove()
        start()
      })
      .bootstrapModal('show')
  })

  test('should fire show event', function () {
    stop()
    $.support.transition = false
    $('<div id="modal-test"></div>')
      .on('show.bs.modal', function () {
        ok(true, 'show was called')
      })
      .on('shown.bs.modal', function () {
        $(this).remove()
        start()
      })
      .bootstrapModal('show')
  })

  test('should not fire shown when default prevented', function () {
    stop()
    $.support.transition = false
    $('<div id="modal-test"></div>')
      .on('show.bs.modal', function (e) {
        e.preventDefault()
        ok(true, 'show was called')
        start()
      })
      .on('shown.bs.modal', function () {
        ok(false, 'shown was called')
      })
      .bootstrapModal('show')
  })

  test('should hide modal when hide is called', function () {
    stop()
    $.support.transition = false

    $('<div id="modal-test"></div>')
      .on('shown.bs.modal', function () {
        ok($('#modal-test').is(':visible'), 'modal visible')
        ok($('#modal-test').length, 'modal inserted into dom')
        $(this).bootstrapModal('hide')
      })
      .on('hidden.bs.modal', function () {
        ok(!$('#modal-test').is(':visible'), 'modal hidden')
        $('#modal-test').remove()
        start()
      })
      .bootstrapModal('show')
  })

  test('should toggle when toggle is called', function () {
    stop()
    $.support.transition = false
    var div = $('<div id="modal-test"></div>')
    div
      .on('shown.bs.modal', function () {
        ok($('#modal-test').is(':visible'), 'modal visible')
        ok($('#modal-test').length, 'modal inserted into dom')
        div.bootstrapModal('toggle')
      })
      .on('hidden.bs.modal', function () {
        ok(!$('#modal-test').is(':visible'), 'modal hidden')
        div.remove()
        start()
      })
      .bootstrapModal('toggle')
  })

  test('should remove from dom when click [data-dismiss="modal"]', function () {
    stop()
    $.support.transition = false
    var div = $('<div id="modal-test"><span class="close" data-dismiss="modal"></span></div>')
    div
      .on('shown.bs.modal', function () {
        ok($('#modal-test').is(':visible'), 'modal visible')
        ok($('#modal-test').length, 'modal inserted into dom')
        div.find('.close').click()
      })
      .on('hidden.bs.modal', function () {
        ok(!$('#modal-test').is(':visible'), 'modal hidden')
        div.remove()
        start()
      })
      .bootstrapModal('toggle')
  })

  test('should allow modal close with "backdrop:false"', function () {
    stop()
    $.support.transition = false
    var div = $('<div>', { id: 'modal-test', 'data-backdrop': false })
    div
      .on('shown.bs.modal', function () {
        ok($('#modal-test').is(':visible'), 'modal visible')
        div.bootstrapModal('hide')
      })
      .on('hidden.bs.modal', function () {
        ok(!$('#modal-test').is(':visible'), 'modal hidden')
        div.remove()
        start()
      })
      .bootstrapModal('show')
  })

  test('should close modal when clicking outside of modal-content', function () {
    stop()
    $.support.transition = false
    var div = $('<div id="modal-test"><div class="contents"></div></div>')
    div
      .on('shown.bs.modal', function () {
        ok($('#modal-test').length, 'modal insterted into dom')
        $('.contents').click()
        ok($('#modal-test').is(':visible'), 'modal visible')
        $('#modal-test').click()
      })
      .on('hidden.bs.modal', function () {
        ok(!$('#modal-test').is(':visible'), 'modal hidden')
        div.remove()
        start()
      })
      .bootstrapModal('show')
  })

  test('should trigger hide event once when clicking outside of modal-content', function () {
    stop()
    $.support.transition = false

    var triggered
    var div = $('<div id="modal-test"><div class="contents"></div></div>')

    div
      .on('shown.bs.modal', function () {
        triggered = 0
        $('#modal-test').click()
      })
      .on('hide.bs.modal', function () {
        triggered += 1
        ok(triggered === 1, 'modal hide triggered once')
        start()
      })
      .bootstrapModal('show')
  })

  test('should close reopened modal with [data-dismiss="modal"] click', function () {
    stop()
    $.support.transition = false
    var div = $('<div id="modal-test"><div class="contents"><div id="close" data-dismiss="modal"></div></div></div>')
    div
      .on('shown.bs.modal', function () {
        $('#close').click()
        ok(!$('#modal-test').is(':visible'), 'modal hidden')
      })
      .one('hidden.bs.modal', function () {
        div.one('hidden.bs.modal', function () {
          start()
        }).bootstrapModal('show')
      })
      .bootstrapModal('show')

    div.remove()
  })

  test('should restore focus to toggling element when modal is hidden after having been opened via data-api', function () {
    stop()
    $.support.transition = false
    var toggleBtn = $('<button data-toggle="modal" data-target="#modal-test">Launch modal</button>').appendTo('#qunit-fixture')
    var div = $('<div id="modal-test"><div class="contents"><div id="close" data-dismiss="modal"></div></div></div>')
    div
      .on('hidden.bs.modal', function () {
        window.setTimeout(function () { // give the focus restoration callback a chance to run
          equal(document.activeElement, toggleBtn[0], 'toggling element is once again focused')
          div.remove()
          toggleBtn.remove()
          start()
        }, 0)
      })
      .on('shown.bs.modal', function () {
        $('#close').click()
      })
      .appendTo('#qunit-fixture')
    toggleBtn.click()
  })

  test('should not restore focus to toggling element if the associated show event gets prevented', function () {
    stop()
    $.support.transition = false
    var toggleBtn = $('<button data-toggle="modal" data-target="#modal-test">Launch modal</button>').appendTo('#qunit-fixture')
    var otherBtn = $('<button id="other-btn">Golden boy</button>').appendTo('#qunit-fixture')
    var div = $('<div id="modal-test"><div class="contents"><div id="close" data-dismiss="modal"></div></div></div>')
    div
      .one('show.bs.modal', function (e) {
        e.preventDefault()
        otherBtn.focus()
        window.setTimeout(function () { // give the focus event from the previous line a chance to run
          div.bootstrapModal('show')
        }, 0)
      })
      .on('hidden.bs.modal', function () {
        window.setTimeout(function () { // give the focus restoration callback a chance to run (except it shouldn't run in this case)
          equal(document.activeElement, otherBtn[0], 'show was prevented, so focus should not have been restored to toggling element')
          div.remove()
          toggleBtn.remove()
          otherBtn.remove()
          start()
        }, 0)
      })
      .on('shown.bs.modal', function () {
        $('#close').click()
      })
      .appendTo('#qunit-fixture')
    toggleBtn.click()
  })
})
