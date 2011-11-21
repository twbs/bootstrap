$(function () {

  module("bootstrap-modal")

    test("should be defined on jquery object", function () {
      var div = $("<div id='modal-test'></div>")
      ok(div.modal, 'modal method is defined')
    })

    test("should return element", function () {
      var div = $("<div id='modal-test'></div>")
      ok(div.modal() == div, 'div element returned')
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
        .bind("shown", function () {
          ok($('#modal-test').length, 'modal insterted into dom')
          start()
          div.remove()
        })
        .modal("show")
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

     test("should not .close modal when closing an .alert-message in the modal", function () {
       stop()
       $.support.transition = false
       var div = $('<div id="modal-test"><span class="close"></span>'
          + '<div class="alert-message warning fade in">'
          + '<a class="close" id="close-alert" href="#">×</a>'
          + '<p><strong>Holy guacamole!</strong> Best check yo self, you’re not looking too good.</p>'
          + '</div>'
          + '</div>')
       div
         .modal()
         .bind("shown", function () {
           ok($('#modal-test').is(":visible"), 'modal visible')
           ok($('#modal-test').length, 'modal insterted into dom')
           div.find('#close-alert').click()
           ok($('#modal-test').is(":visible"), 'modal visible')
           start()
           div.remove()
         })
         .modal('show')
     })

     test("should .close modal even if it have an .alert-message in it", function () {
       stop()
       $.support.transition = false
       var div = $('<div id="modal-test"><span class="close" id="close-modal"></span>'
          + '<div class="alert-message warning fade in">'
          + '<a class="close" href="#">×</a>'
          + '<p><strong>Holy guacamole!</strong> Best check yo self, you’re not looking too good.</p>'
          + '</div>'
          + '</div>')
       div
         .modal()
         .bind("shown", function () {
           ok($('#modal-test').is(":visible"), 'modal visible')
           ok($('#modal-test').length, 'modal insterted into dom')
           div.find('#close-modal').click()
         })
         .bind("hidden", function() {
           ok(!$('#modal-test').is(":visible"), 'modal hidden')
           start()
           div.remove()
         })
         .modal("toggle")
     })

     test("should add backdrop when desired", function () {
       stop()
       $.support.transition = false
       var div = $("<div id='modal-test'></div>")
       div
         .modal({ backdrop:true })
         .bind("shown", function () {
           equal($('.modal-backdrop').length, 1, 'modal backdrop inserted into dom')
           start()
           div.remove()
           $('.modal-backdrop').remove()
         })
        .modal("show")
     })

     test("should not add backdrop when not desired", function () {
       stop()
       $.support.transition = false
       var div = $("<div id='modal-test'></div>")
       div
         .modal({backdrop:false})
         .bind("shown", function () {
           equal($('.modal-backdrop').length, 0, 'modal backdrop not inserted into dom')
           start()
           div.remove()
         })
         .modal("show")
     })

     test("should close backdrop when clicked", function () {
       stop()
       $.support.transition = false
       var div = $("<div id='modal-test'></div>")
       div
         .modal({backdrop:true})
         .bind("shown", function () {
           equal($('.modal-backdrop').length, 1, 'modal backdrop inserted into dom')
           $('.modal-backdrop').click()
           equal($('.modal-backdrop').length, 0, 'modal backdrop removed from dom')
           start()
           div.remove()
         })
         .modal("show")
     })

     test("should not close backdrop when click disabled", function () {
       stop()
       $.support.transition = false
       var div = $("<div id='modal-test'></div>")
       div
         .modal({backdrop: 'static'})
         .bind("shown", function () {
           equal($('.modal-backdrop').length, 1, 'modal backdrop inserted into dom')
           $('.modal-backdrop').click()
           equal($('.modal-backdrop').length, 1, 'modal backdrop still in dom')
           start()
           div.remove()
           $('.modal-backdrop').remove()
         })
         .modal("show")
     })
})
