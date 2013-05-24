$(function () {

    module("modal")

      test("should provide no conflict", function () {
        var modal = $.fn.modal.noConflict()
        ok(!$.fn.modal, 'modal was set back to undefined (org value)')
        $.fn.modal = modal
      })

      test("should be defined on jquery object", function () {
        var div = $("<div id='modal-test'></div>")
        ok(div.modal, 'modal method is defined')
      })

      test("should return element", function () {
        var div = $("<div id='modal-test'></div>")
        ok(div.modal() == div, 'document.body returned')
        $('#modal-test').remove()
      })

      test("should expose defaults var for settings", function () {
        ok($.fn.modal.Constructor.DEFAULTS, 'default object exposed')
      })

      test("should insert into dom when show method is called", function () {
        stop()
        $.support.transition = false
        $("<div id='modal-test'></div>")
          .on("shown.bs.modal", function () {
            ok($('#modal-test').length, 'modal inserted into dom')
            $(this).remove()
            start()
          })
          .modal("show")
      })

      test("should fire show event", function () {
        stop()
        $.support.transition = false
        $("<div id='modal-test'></div>")
          .on("show.bs.modal", function () {
            ok(true, "show was called")
          })
          .on("shown.bs.modal", function () {
            $(this).remove()
            start()
          })
          .modal("show")
      })

      test("should not fire shown when default prevented", function () {
        stop()
        $.support.transition = false
        $("<div id='modal-test'></div>")
          .on("show.bs.modal", function (e) {
            e.preventDefault()
            ok(true, "show was called")
            start()
          })
          .on("shown.bs.modal", function () {
            ok(false, "shown was called")
          })
          .modal("show")
      })

      test("should call shown and insert into dom when refresh method is called", function () {
        stop()
        $.support.transition = false
        $("<div id='modal-test'></div>")
          .on("shown.bs.modal", function () {
            ok($('#modal-test').length, 'modal insterted into dom')
            $(this).remove()
            start()
          })
          .modal("refresh")
      })

      test("should fire refresh event", function () {
        stop()
        $.support.transition = false
        $("<div id='modal-test'></div>")
          .on("refresh.bs.modal", function () {
            ok(true, "refresh was called")
          })
          .on("shown.bs.modal", function () {
            $(this).remove()
            start()
          })
          .modal("refresh")
      })

      test("should update content when refresh is called", function () {
        stop()
        $.support.transition = false
        $("<div id='modal-test'><div class='modal-body'>content</div></div>")
          .on('shown.bs.modal', function(){
            ok($(this).find('.modal-body').html()=='<h1>Modal Example 1</h1>\n', 'content was updated')
            $(this).remove()
            start()
          })
          .modal({
            show: true,
            refresh: true,
            remote: 'http://localhost:3000/modal/example1.html'
          })
      })

      test("should not update content when refresh is called without a remote", function () {
        stop()
        $.support.transition = false
        $("<div id='modal-test'>content</div>")
          .on("shown.bs.modal", function () {
            ok($('#modal-test').html()=='content', 'content was not updated')
          })
          .on("shown.bs.modal", function () {
            $(this).remove()
            start()
          })
          .modal("refresh")
      })

      test("should not fire refreshed when default prevented", function () {
        stop()
        $.support.transition = false
        $("<div id='modal-test'></div>")
          .on("refresh.bs.modal", function (e) {
            e.preventDefault()
            ok(true, "refresh was called")
            start()
          })
          .on("refreshed.bs.modal", function () {
            ok(false, "refreshed was called")
          })
          .modal("refresh")
      })

      test("should hide modal when hide is called", function () {
        stop()
        $.support.transition = false

        $("<div id='modal-test'></div>")
          .on("shown.bs.modal", function () {
            ok($('#modal-test').is(":visible"), 'modal visible')
            ok($('#modal-test').length, 'modal inserted into dom')
            $(this).modal("hide")
          })
          .on("hidden.bs.modal", function() {
            ok(!$('#modal-test').is(":visible"), 'modal hidden')
            $('#modal-test').remove()
            start()
          })
          .modal("show")
      })

      test("should toggle when toggle is called", function () {
        stop()
        $.support.transition = false
        var div = $("<div id='modal-test'></div>")
        div
          .on("shown.bs.modal", function () {
            ok($('#modal-test').is(":visible"), 'modal visible')
            ok($('#modal-test').length, 'modal inserted into dom')
            div.modal("toggle")
          })
          .on("hidden.bs.modal", function() {
            ok(!$('#modal-test').is(":visible"), 'modal hidden')
            div.remove()
            start()
          })
          .modal("toggle")
      })

      test("should remove from dom when click [data-dismiss=modal]", function () {
        stop()
        $.support.transition = false
        var div = $("<div id='modal-test'><span class='close' data-dismiss='modal'></span></div>")
        div
          .on("shown.bs.modal", function () {
            ok($('#modal-test').is(":visible"), 'modal visible')
            ok($('#modal-test').length, 'modal inserted into dom')
            div.find('.close').click()
          })
          .on("hidden.bs.modal", function() {
            ok(!$('#modal-test').is(":visible"), 'modal hidden')
            div.remove()
            start()
          })
          .modal("toggle")
      })

      test("should allow modal close with 'backdrop:false'", function () {
        stop()
        $.support.transition = false
        var div = $("<div>", { id: 'modal-test', "data-backdrop": false })
        div
          .on("shown.bs.modal", function () {
            ok($('#modal-test').is(":visible"), 'modal visible')
            div.modal("hide")
          })
          .on("hidden.bs.modal", function() {
            ok(!$('#modal-test').is(":visible"), 'modal hidden')
            div.remove()
            start()
          })
          .modal("show")
      })
})
