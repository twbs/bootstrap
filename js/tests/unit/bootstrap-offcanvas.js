$(function () {

    module("bootstrap-offcanvas")

      test("should provide no conflict", function () {
        var offcanvas = $.fn.offcanvas.noConflict()
        ok(!$.fn.offcanvas, 'offcanvas was set back to undefined (org value)')
        $.fn.offcanvas = offcanvas
      })

      test("should be defined on jquery object", function () {
        ok($(document.body).offcanvas, 'offcanvas method is defined')
      })

      test("should return element", function () {
        var el = $("<div />")
        ok(el.offcanvas()[0] === el[0], 'same element returned')
      })

      test("should add active class to wrapper if clicked", function () {
        var offcanvasHTML = '<div class="row row-offcanvas row-offcanvas-right">'
          + '<div class="span9">'
          + '<p class="visible-phone"><a href="#sidebar" class="btn btn-offcanvas" data-toggle="offcanvas">More</a></p>'
          + '<p>Lorem ipsum</p>'
          + '</div>'
          + '<nav class="span3 sidebar-offcanvas sidebar-offcanvas-right" id="sidebar" role="navigation">'
          + '<p>Off Canvas Sidebar</p>'
          + '</nav>'
          + '</div>'
          , offcanvas = $(offcanvasHTML).find('[data-toggle="offcanvas"]').offcanvas().click()

        ok(offcanvas.parents('.row-offcanvas').hasClass('active'), 'active class added on click')
      })

      test("should add active class to toggler if clicked", function () {
        var offcanvasHTML = '<div class="row row-offcanvas row-offcanvas-right">'
          + '<div class="span9">'
          + '<p class="visible-phone"><a href="#sidebar" class="btn btn-offcanvas" data-toggle="offcanvas">More</a></p>'
          + '<p>Lorem ipsum</p>'
          + '</div>'
          + '<nav class="span3 sidebar-offcanvas sidebar-offcanvas-right" id="sidebar" role="navigation">'
          + '<p>Off Canvas Sidebar</p>'
          + '</nav>'
          + '</div>'
          , offcanvas = $(offcanvasHTML).find('[data-toggle="offcanvas"]').offcanvas().click()

        ok(offcanvas.hasClass('active'), 'active class added on click')
      })

      test("should remove active class from wrapper if toggler clicked while active", function () {
        var offcanvasHTML = '<div class="row row-offcanvas row-offcanvas-right">'
          + '<div class="span9">'
          + '<p class="visible-phone"><a href="#sidebar" class="btn btn-offcanvas" data-toggle="offcanvas">More</a></p>'
          + '<p>Lorem ipsum</p>'
          + '</div>'
          + '<nav class="span3 sidebar-offcanvas sidebar-offcanvas-right" id="sidebar" role="navigation">'
          + '<p>Off Canvas Sidebar</p>'
          + '</nav>'
          + '</div>'
          , offcanvas = $(offcanvasHTML).find('[data-toggle="offcanvas"]').offcanvas().click()

        ok(offcanvas.parents('.row-offcanvas').hasClass('active'), 'active class added on click')
        offcanvas.click()
        ok(!offcanvas.parents('.row-offcanvas').hasClass('active'), 'active class still present after click')
      })

      test("should remove active class from toggler if toggler clicked while active", function () {
        var offcanvasHTML = '<div class="row row-offcanvas row-offcanvas-right">'
          + '<div class="span9">'
          + '<p class="visible-phone"><a href="#sidebar" class="btn btn-offcanvas" data-toggle="offcanvas">More</a></p>'
          + '<p>Lorem ipsum</p>'
          + '</div>'
          + '<nav class="span3 sidebar-offcanvas sidebar-offcanvas-right" id="sidebar" role="navigation">'
          + '<p>Off Canvas Sidebar</p>'
          + '</nav>'
          + '</div>'
          , offcanvas = $(offcanvasHTML).find('[data-toggle="offcanvas"]').offcanvas().click()

        ok(offcanvas.hasClass('active'), 'active class added on click')
        offcanvas.click()
        ok(!offcanvas.hasClass('active'), 'active class still present after click')
      })

})