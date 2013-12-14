$(function () {

  module('modal')

    test('should provide no conflict', function () {
      var modal = $.fn.modal.noConflict()
      ok(!$.fn.modal, 'modal was set back to undefined (org value)')
      $.fn.modal = modal
    })

    test('should be defined on jquery object', function () {
      var div = $('<div id="modal-test"></div>')
      ok(div.modal, 'modal method is defined')
    })

    test('should return element', function () {
      var div = $('<div id="modal-test"></div>')
      ok(div.modal() == div, 'document.body returned')
      $('#modal-test').remove()
    })

    test('should expose defaults var for settings', function () {
      ok($.fn.modal.Constructor.DEFAULTS, 'default object exposed')
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
        .modal('show')
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
        .modal('show')
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
        .modal('show')
    })

    test('should hide modal when hide is called', function () {
      stop()
      $.support.transition = false

      $('<div id="modal-test"></div>')
        .on('shown.bs.modal', function () {
          ok($('#modal-test').is(':visible'), 'modal visible')
          ok($('#modal-test').length, 'modal inserted into dom')
          $(this).modal('hide')
        })
        .on('hidden.bs.modal', function () {
          ok(!$('#modal-test').is(':visible'), 'modal hidden')
          $('#modal-test').remove()
          start()
        })
        .modal('show')
    })

    test('should toggle when toggle is called', function () {
      stop()
      $.support.transition = false
      var div = $('<div id="modal-test"></div>')
      div
        .on('shown.bs.modal', function () {
          ok($('#modal-test').is(':visible'), 'modal visible')
          ok($('#modal-test').length, 'modal inserted into dom')
          div.modal('toggle')
        })
        .on('hidden.bs.modal', function () {
          ok(!$('#modal-test').is(':visible'), 'modal hidden')
          div.remove()
          start()
        })
        .modal('toggle')
    })

    test('should remove from dom when click [data-dismiss=modal]', function () {
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
        .modal('toggle')
    })

    test('should allow modal close with "backdrop:false"', function () {
      stop()
      $.support.transition = false
      var div = $('<div>', { id: 'modal-test', 'data-backdrop': false })
      div
        .on('shown.bs.modal', function () {
          ok($('#modal-test').is(':visible'), 'modal visible')
          div.modal('hide')
        })
        .on('hidden.bs.modal', function () {
          ok(!$('#modal-test').is(':visible'), 'modal hidden')
          div.remove()
          start()
        })
        .modal('show')
    })

    test('should close modal when clicking outside of modal-content', function () {
      stop()
      $.support.transition = false
      var div = $('<div id="modal-test"><div class="contents"></div></div>')
      div
        .bind('shown.bs.modal', function () {
          ok($('#modal-test').length, 'modal insterted into dom')
          $('.contents').click()
          ok($('#modal-test').is(':visible'), 'modal visible')
          $('#modal-test').click()
        })
        .bind('hidden.bs.modal', function () {
          ok(!$('#modal-test').is(':visible'), 'modal hidden')
          div.remove()
          start()
        })
        .modal('show')
    })

    test('should trigger hide event once when clicking outside of modal-content', function () {
      stop()
      $.support.transition = false
      var div = $('<div id="modal-test"><div class="contents"></div></div>')
      var triggered
      div
        .bind('shown.bs.modal', function () {
          triggered = 0
          $('#modal-test').click()
        })
        .one('hidden.bs.modal', function () {
          div.modal('show')
        })
        .bind('hide.bs.modal', function () {
          triggered += 1
          ok(triggered === 1, 'modal hide triggered once')
          start()
        })
        .modal('show')
    })

    test('should close reopened modal with [data-dismiss=modal] click', function () {
      stop()
      $.support.transition = false
      var div = $('<div id="modal-test"><div class="contents"><div id="close" data-dismiss="modal"></div></div></div>')
      div
        .bind('shown.bs.modal', function () {
          $('#close').click()
          ok(!$('#modal-test').is(':visible'), 'modal hidden')
        })
        .one('hidden.bs.modal', function () {
          div.one('hidden.bs.modal', function () {
            start()
          }).modal('show')
        })
        .modal('show')

      div.remove()
    })
})
