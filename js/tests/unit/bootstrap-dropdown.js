$(function () {

    module("bootstrap-dropdowns")

      test("should be defined on jquery object", function () {
        ok($(document.body).dropdown, 'dropdown method is defined')
      })

      test("should return element", function () {
        ok($(document.body).dropdown()[0] == document.body, 'document.body returned')
      })

      test("should not open dropdown if target is disabled", function () {
        var dropdownHTML = '<ul class="tabs">'
          + '<li class="dropdown">'
          + '<button disabled href="#" class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>'
          + '<ul class="dropdown-menu">'
          + '<li><a href="#">Secondary link</a></li>'
          + '<li><a href="#">Something else here</a></li>'
          + '<li class="divider"></li>'
          + '<li><a href="#">Another link</a></li>'
          + '</ul>'
          + '</li>'
          + '</ul>'
          , dropdown = $(dropdownHTML).find('[data-toggle="dropdown"]').dropdown().click()

        ok(!dropdown.parent('.dropdown').hasClass('open'), 'open class added on click')
      })

      test("should not open dropdown if target is disabled", function () {
        var dropdownHTML = '<ul class="tabs">'
          + '<li class="dropdown">'
          + '<button href="#" class="btn dropdown-toggle disabled" data-toggle="dropdown">Dropdown</button>'
          + '<ul class="dropdown-menu">'
          + '<li><a href="#">Secondary link</a></li>'
          + '<li><a href="#">Something else here</a></li>'
          + '<li class="divider"></li>'
          + '<li><a href="#">Another link</a></li>'
          + '</ul>'
          + '</li>'
          + '</ul>'
          , dropdown = $(dropdownHTML).find('[data-toggle="dropdown"]').dropdown().click()

        ok(!dropdown.parent('.dropdown').hasClass('open'), 'open class added on click')
      })

      test("should add class open to menu if clicked", function () {
        var dropdownHTML = '<ul class="tabs">'
          + '<li class="dropdown">'
          + '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>'
          + '<ul class="dropdown-menu">'
          + '<li><a href="#">Secondary link</a></li>'
          + '<li><a href="#">Something else here</a></li>'
          + '<li class="divider"></li>'
          + '<li><a href="#">Another link</a></li>'
          + '</ul>'
          + '</li>'
          + '</ul>'
          , dropdown = $(dropdownHTML).find('[data-toggle="dropdown"]').dropdown().click()

        ok(dropdown.parent('.dropdown').hasClass('open'), 'open class added on click')
      })

      test("should add class open to menu if clicked, using only attributes", function () {
        var dropdownHTML = '<ul class="tabs">'
          + '<li class="dropdown">'
          + '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>'
          + '<ul class="dropdown-menu">'
          + '<li><a href="#">Secondary link</a></li>'
          + '<li><a href="#">Something else here</a></li>'
          + '<li class="divider"></li>'
          + '<li><a href="#">Another link</a></li>'
          + '</ul>'
          + '</li>'
          + '</ul>'
          , dropdown = $(dropdownHTML).appendTo('#qunit-fixture').find('[data-toggle="dropdown"]').click()

        ok(dropdown.parent('.dropdown').hasClass('open'), 'open class added on click')
        dropdown.remove()
      })

      test("should test if element has a # before assuming it's a selector", function () {
        var dropdownHTML = '<ul class="tabs">'
          + '<li class="dropdown">'
          + '<a href="/foo/" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>'
          + '<ul class="dropdown-menu">'
          + '<li><a href="#">Secondary link</a></li>'
          + '<li><a href="#">Something else here</a></li>'
          + '<li class="divider"></li>'
          + '<li><a href="#">Another link</a></li>'
          + '</ul>'
          + '</li>'
          + '</ul>'
          , dropdown = $(dropdownHTML).find('[data-toggle="dropdown"]').dropdown().click()

        ok(dropdown.parent('.dropdown').hasClass('open'), 'open class added on click')
      })


      test("should remove open class if body clicked", function () {
        var dropdownHTML = '<ul class="tabs">'
          + '<li class="dropdown">'
          + '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>'
          + '<ul class="dropdown-menu">'
          + '<li><a href="#">Secondary link</a></li>'
          + '<li><a href="#">Something else here</a></li>'
          + '<li class="divider"></li>'
          + '<li><a href="#">Another link</a></li>'
          + '</ul>'
          + '</li>'
          + '</ul>'
          , dropdown = $(dropdownHTML)
            .appendTo('#qunit-fixture')
            .find('[data-toggle="dropdown"]')
            .dropdown()
            .click()
        ok(dropdown.parent('.dropdown').hasClass('open'), 'open class added on click')
        $('body').click()
        ok(!dropdown.parent('.dropdown').hasClass('open'), 'open class removed')
        dropdown.remove()
      })

      test("should remove open class from second open dropdown if html clicked", function () {
        var dropdown1HTML = '<ul class="tabs">'
          + '<li class="dropdown" id="dropdown1">'
          + '<a href="#dropdown1" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>'
          + '<ul class="dropdown-menu">'
          + '<li><a href="#">Secondary link</a></li>'
          + '<li><a href="#">Something else here</a></li>'
          + '<li class="divider"></li>'
          + '<li><a href="#">Another link</a></li>'
          + '</ul>'
          + '</li>'
          + '</ul>';
       
        var dropdown2HTML = '<ul class="tabs">'
          + '<li class="dropdown" id="dropdown2">'
          + '<button data-target="#dropdown2" class="dropdown-toggle" data-toggle="dropdown">Dropdown</button>'
          + '<ul class="dropdown-menu">'
          + '<li><a href="#">Secondary link</a></li>'
          + '<li><a href="#">Something else here</a></li>'
          + '<li class="divider"></li>'
          + '<li><a href="#">Another link</a></li>'
          + '</ul>'
          + '</li>'
          + '</ul>';

        var multipleDropdowns = '<div id="firstDropdownWithAnchorAndHref">' 
          + dropdown1HTML 
          + '</div><div id="secondDropdownWithButtonAndDataTarget">'
          + dropdown2HTML
          + '</div>';

        dropdowns = $(multipleDropdowns)
            .appendTo('#qunit-fixture');
       
        $("#secondDropdownWithButtonAndDataTarget")
          .find('[data-toggle="dropdown"]')
          .click();
          
        ok($("#secondDropdownWithButtonAndDataTarget").find('.dropdown').hasClass('open'), 'open class added to second dropdown on click')
        ok(!$("#firstDropdownWithAnchorAndHref").find('.dropdown').hasClass('open'), 'open class not added to first dropdown on click')
        $('html').click()
        ok(!$("#secondDropdownWithButtonAndDataTarget").find('.dropdown').hasClass('open'), 'open class removed')
        dropdowns.remove()
      })
})