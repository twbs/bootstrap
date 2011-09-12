$(function () {

    module("bootstrap-modal")

      test("should be defined on jquery object", function () {
        var div = $("<div id='modal-test'></div>")
        ok(div.modal, 'modal method is defined')
      })

      test("should return element", function () {
        var div = $("<div id='modal-test'></div>")
        ok(div.modal() == div, 'document.body returned')
      })

      test("should expose defaults var for settings", function () {
        ok($.fn.modal.defaults, 'default object exposed')
      })

      test("should insert into dom when show method is called", function () {
        stop()
        $.support.transition = false
        var div = $("<div id='modal-test'></div>")
        div
          .modal()
          .modal("show")
          .bind("shown", function () {
            ok($('#modal-test').length, 'modal insterted into dom')
            start()
            div.remove()
          })
      })

      test("should hide modal when hide is called", function () {
        stop()
        $.support.transition = false
        var div = $("<div id='modal-test'></div>")
        div
          .modal()
          .bind("shown", function () {
            ok($('#modal-test').is(":visible"), 'modal visible')
            ok($('#modal-test').length, 'modal insterted into dom')
            div.modal("hide")
          })
          .bind("hidden", function() {
            ok(!$('#modal-test').is(":visible"), 'modal hidden')
            start()
            div.remove()
          })
          .modal("show")
      })

      test("should toggle when toggle is called", function () {
        stop()
        $.support.transition = false
        var div = $("<div id='modal-test'></div>")
        div
          .modal()
          .bind("shown", function () {
            ok($('#modal-test').is(":visible"), 'modal visible')
            ok($('#modal-test').length, 'modal insterted into dom')
            div.modal("toggle")
          })
          .bind("hidden", function() {
            ok(!$('#modal-test').is(":visible"), 'modal hidden')
            start()
            div.remove()
          })
          .modal("toggle")
      })

      test("should remove from dom when click .close", function () {
        stop()
        $.support.transition = false
        var div = $("<div id='modal-test'><span class='close'></span></div>")
        div
          .modal()
          .bind("shown", function () {
            ok($('#modal-test').is(":visible"), 'modal visible')
            ok($('#modal-test').length, 'modal insterted into dom')
            div.find('.close').click()
          })
          .bind("hidden", function() {
            ok(!$('#modal-test').is(":visible"), 'modal hidden')
            start()
            div.remove()
          })
          .modal("toggle")
      })
})