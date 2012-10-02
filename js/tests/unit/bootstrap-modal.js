$(function () {

    module("bootstrap-modal")

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
        ok($.fn.modal.defaults, 'default object exposed')
      })

      test("should insert into dom when show method is called", function () {
        stop()
        $.support.transition = false
        $("<div id='modal-test'></div>")
          .bind("shown", function () {
            ok($('#modal-test').length, 'modal insterted into dom')
            $(this).remove()
            start()
          })
          .modal("show")
      })

      test("should fire show event", function () {
        stop()
        $.support.transition = false
        $("<div id='modal-test'></div>")
          .bind("show", function () {
            ok(true, "show was called")
          })
          .bind("shown", function () {
            $(this).remove()
            start()
          })
          .modal("show")
      })

      test("should not fire shown when default prevented", function () {
        stop()
        $.support.transition = false
        $("<div id='modal-test'></div>")
          .bind("show", function (e) {
            e.preventDefault()
            ok(true, "show was called")
            start()
          })
          .bind("shown", function () {
            ok(false, "shown was called")
          })
          .modal("show")
      })

      test("should hide modal when hide is called", function () {
        stop()
        $.support.transition = false

        $("<div id='modal-test'></div>")
          .bind("shown", function () {
            ok($('#modal-test').is(":visible"), 'modal visible')
            ok($('#modal-test').length, 'modal insterted into dom')
            $(this).modal("hide")
          })
          .bind("hidden", function() {
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
          .bind("shown", function () {
            ok($('#modal-test').is(":visible"), 'modal visible')
            ok($('#modal-test').length, 'modal insterted into dom')
            div.modal("toggle")
          })
          .bind("hidden", function() {
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
          .bind("shown", function () {
            ok($('#modal-test').is(":visible"), 'modal visible')
            ok($('#modal-test').length, 'modal insterted into dom')
            div.find('.close').click()
          })
          .bind("hidden", function() {
            ok(!$('#modal-test').is(":visible"), 'modal hidden')
            div.remove()
            start()
          })
          .modal("toggle")
      })

      test("should refresh when data-remote is changed", function () {
        stop()
        $.support.transition = false
        var modalHTML = "<div id='modal-test'></div>"
          + "<a id='link-test-1' href='#' data-remote='unit/bootstrap-modal.js' data-target='#modal-test' data-toggle='modal'></a>"
          + "<a id='link-test-2' href='#' data-remote='unit/bootstrap-popover.js' data-target='#modal-test' data-toggle='modal'></a>"
        $(modalHTML).appendTo('#qunit-fixture')
        var div = $('#qunit-fixture').find('#modal-test')
          , a1 = $('#qunit-fixture').find('#link-test-1')
          , a2 = $('#qunit-fixture').find('#link-test-2')

        div
          .bind("shown", function () {
            ok(div.hasClass('in'), 'in class added on shown')
            equals($('#modal-test').data('modal').options.remote, "unit/bootstrap-modal.js", 'modal remote correct')
            ok($('#modal-test').length, 'modal insterted into dom')
            div.modal("toggle")
          })
          .bind("hidden", function() {
            ok(!div.hasClass('in'), 'in class removed on hidden')
          })
        a1.click()

        div.unbind("shown")
        div.unbind("hidden")
        div
          .bind("shown", function () {
            ok(div.hasClass('in'), 'in class added on shown')
            equals($('#modal-test').data('modal').options.remote, "unit/bootstrap-popover.js", 'modal remote updated')
            ok($('#modal-test').length, 'modal insterted into dom')
            div.modal("toggle")
          })
          .bind("hidden", function() {
            ok(!div.hasClass('in'), 'in class removed on hidden')
            div.remove()
            a1.remove()
            a2.remove()
            start()
          })
        a2.click()
      })

      test("should refresh when href is changed", function () {
        stop()
        $.support.transition = false
        var modalHTML = "<div id='modal-test'></div>"
          + "<a id='link-test-1' href='unit/bootstrap-modal.js' data-target='#modal-test' data-toggle='modal'></a>"
          + "<a id='link-test-2' href='unit/bootstrap-popover.js' data-target='#modal-test' data-toggle='modal'></a>"
        $(modalHTML).appendTo('#qunit-fixture')
        var div = $('#qunit-fixture').find('#modal-test')
          , a1 = $('#qunit-fixture').find('#link-test-1')
          , a2 = $('#qunit-fixture').find('#link-test-2')

        div
          .bind("shown", function () {
            ok(div.hasClass('in'), 'in class added on shown')
            equals($('#modal-test').data('modal').options.remote, "unit/bootstrap-modal.js", 'modal remote correct')
            ok($('#modal-test').length, 'modal insterted into dom')
            div.modal("toggle")
          })
          .bind("hidden", function() {
            ok(!div.hasClass('in'), 'in class removed on hidden')
          })
        a1.click()

        div.unbind("shown")
        div.unbind("hidden")
        div
          .bind("shown", function () {
            ok(div.hasClass('in'), 'in class added on shown')
            equals($('#modal-test').data('modal').options.remote, "unit/bootstrap-popover.js", 'modal remote updated')
            ok($('#modal-test').length, 'modal insterted into dom')
            div.modal("toggle")
          })
          .bind("hidden", function() {
            ok(!div.hasClass('in'), 'in class removed on hidden')
            div.remove()
            a1.remove()
            a2.remove()
            start()
          })
        a2.click()
      })

      test("should not refresh when href is unchanged", function () {
        stop()
        $.support.transition = false
        var modalHTML = "<div id='modal-test'></div>"
          + "<a id='link-test-1' href='unit/bootstrap-modal.js' data-target='#modal-test' data-toggle='modal'></a>"
          + "<a id='link-test-2' href='#' data-target='#modal-test' data-toggle='modal'></a>"
        $(modalHTML).appendTo('#qunit-fixture')
        var div = $('#qunit-fixture').find('#modal-test')
          , a1 = $('#qunit-fixture').find('#link-test-1')
          , a2 = $('#qunit-fixture').find('#link-test-2')

        div
          .bind("shown", function () {
            ok(div.hasClass('in'), 'in class added on shown')
            equals($('#modal-test').data('modal').options.remote, "unit/bootstrap-modal.js", 'modal remote correct')
            ok($('#modal-test').length, 'modal insterted into dom')
            div.modal("toggle")
          })
          .bind("hidden", function() {
            ok(!div.hasClass('in'), 'in class removed on hidden')
          })
        a1.click()

        div.unbind("shown")
        div.unbind("hidden")
        div
          .bind("shown", function () {
            ok(div.hasClass('in'), 'in class added on shown')
            equals($('#modal-test').data('modal').options.remote, "unit/bootstrap-modal.js", 'modal remote unchanged')
            ok($('#modal-test').length, 'modal insterted into dom')
            div.modal("toggle")
          })
          .bind("hidden", function() {
            ok(!div.hasClass('in'), 'in class removed on hidden')
            div.remove()
            a1.remove()
            a2.remove()
            start()
          })
        a2.click()
      })
})