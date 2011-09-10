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
        $.support.transition = false
        var div = $("<div id='modal-test'></div>")
        div.modal().trigger("modal:show")
        ok($('#modal-test').length, 'modal insterted into dom')
        div.remove()
      })

      test("should remove from dom when close is called", function () {
        $.support.transition = false
        var div = $("<div id='modal-test'></div>")
        div.modal().trigger("modal:show")
        ok($('#modal-test').length, 'modal insterted into dom')
        div.trigger("modal:hide")
        ok(!$('#modal-test').length, 'modal removed from dom')
        div.remove()
      })

      test("should toggle when toggle is called", function () {
        $.support.transition = false
        var div = $("<div id='modal-test'></div>")
        div.modal().trigger("modal:toggle")
        ok($('#modal-test').length, 'modal insterted into dom')
        div.trigger("modal:toggle")
        ok(!$('#modal-test').length, 'modal removed from dom')
        div.remove()
      })

      test("should remove from dom when click .close", function () {
        $.support.transition = false
        var div = $("<div id='modal-test'><span class='close'></span></div>")
        div.modal().trigger("modal:toggle")
        ok($('#modal-test').length, 'modal insterted into dom')
        div.find('.close').click()
        ok(!$('#modal-test').length, 'modal removed from dom')
        div.remove()
      })
})