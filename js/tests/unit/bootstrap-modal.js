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

      test("should insert into dom when modal:show event is called", function () {
        stop()
        $.support.transition = false
        var div = $("<div id='modal-test'></div>")
        div
          .modal()
          .trigger("modal:show")
          .bind("modal:shown", function () {
            ok($('#modal-test').length, 'modal insterted into dom')
            start()
            div.remove()
          })
      })

      test("should remove from dom when modal:hide is called", function () {
        stop()
        $.support.transition = false
        var div = $("<div id='modal-test'></div>")
        div
          .modal()
          .trigger("modal:show")
          .bind("modal:shown", function () {
            ok($('#modal-test').length, 'modal insterted into dom')
            div.trigger("modal:hide")
          })
          .bind("modal:hidden", function() {
            ok(!$('#modal-test').length, 'modal removed from dom')
            start()
            div.remove()
          })
      })

      test("should toggle when toggle is called", function () {
        stop()
        $.support.transition = false
        var div = $("<div id='modal-test'></div>")
        div
          .modal()
          .trigger("modal:toggle")
          .bind("modal:shown", function () {
            ok($('#modal-test').length, 'modal insterted into dom')
            div.trigger("modal:toggle")
          })
          .bind("modal:hidden", function() {
            ok(!$('#modal-test').length, 'modal removed from dom')
            start()
            div.remove()
          })
      })

      test("should remove from dom when click .close", function () {
        stop()
        $.support.transition = false
        var div = $("<div id='modal-test'><span class='close'></span></div>")
        div
          .modal()
          .trigger("modal:toggle")
          .bind("modal:shown", function () {
            ok($('#modal-test').length, 'modal insterted into dom')
            div.find('.close').click()
          })
          .bind("modal:hidden", function() {
            ok(!$('#modal-test').length, 'modal removed from dom')
            start()
            div.remove()
          })
      })
})