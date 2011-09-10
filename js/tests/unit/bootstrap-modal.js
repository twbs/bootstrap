$(function () {

    module("bootstrap-modal")

      test("should be defined on jquery object", function () {
        ok($(document.body).modal, 'modal method is defined')
      })

      test("should not return element", function () {
        ok(!$(document.body).modal()[0], 'document.body not returned')
      })

      test("should return instance of modal class", function () {
        ok($(document.body).modal() instanceof $.fn.modal.Modal, 'document.body returned')
      })

      test("should expose defaults var for settings", {
        ok(!!$.fn.modal.default, 'default object exposed')
      })

      test("should insert into dom when open is called", function () {
        var div = $("<div></div>")
        div.modal().open()
      })

      test("should remove from dom when close is called", function () {
        $.support.transition = false
        re
      })

      test("should remove from dom when click .close")
})