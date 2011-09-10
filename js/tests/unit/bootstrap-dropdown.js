$(function () {

    module("bootstrap-dropdowns")

      test("should be defined on jquery object", function () {
        ok($(document.body).dropdown, 'dropdown method is defined')
      })

      test("should return element", function () {
        ok($(document.body).dropdown()[0] == document.body, 'document.body returned')
      })

      test("should add class open to menu if clicked", function () {
        var dropdownHTML = '<ul class="tabs">'
          + '<li class="dropdown">'
          + '<a href="#" class="dropdown-toggle">Dropdown</a>'
          + '<ul class="dropdown-menu">'
          + '<li><a href="#">Secondary link</a></li>'
          + '<li><a href="#">Something else here</a></li>'
          + '<li class="divider"></li>'
          + '<li><a href="#">Another link</a></li>'
          + '</ul>'
          + '</li>'
          + '</ul>'
          , dropdown = $(dropdownHTML).dropdown()

        dropdown.find('.dropdown-toggle').click()
        ok(dropdown.find('.dropdown').hasClass('open'), 'open class added on click')
      })

      test("should remove open class if body clicked", function () {
        var dropdownHTML = '<ul class="tabs">'
          + '<li class="dropdown">'
          + '<a href="#" class="dropdown-toggle">Dropdown</a>'
          + '<ul class="dropdown-menu">'
          + '<li><a href="#">Secondary link</a></li>'
          + '<li><a href="#">Something else here</a></li>'
          + '<li class="divider"></li>'
          + '<li><a href="#">Another link</a></li>'
          + '</ul>'
          + '</li>'
          + '</ul>'
          , dropdown = $(dropdownHTML).dropdown().appendTo('#qunit-runoff')

        dropdown.find('.dropdown-toggle').click()
        ok(dropdown.find('.dropdown').hasClass('open'), 'open class added on click')
        $('body').click()
        ok(!dropdown.find('.dropdown').hasClass('open'), 'open class removed')
        dropdown.remove()
      })

})