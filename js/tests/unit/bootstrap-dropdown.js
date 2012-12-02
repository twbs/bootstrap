$(function () {

    module("bootstrap-dropdowns")

      test("should be defined on jquery object", function () {
        ok($(document.body).dropdown, 'dropdown method is defined')
      })

      test("should return element", function () {
        var el = $("<div />")
        ok(el.dropdown()[0] === el[0], 'same element returned')
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

      test("should remove open class if body clicked, with multiple drop downs", function () {
          var dropdownHTML = 
            '<ul class="nav">'
            + '    <li><a href="#menu1">Menu 1</a></li>'
            + '    <li class="dropdown" id="testmenu">'
            + '      <a class="dropdown-toggle" data-toggle="dropdown" href="#testmenu">Test menu <b class="caret"></b></a>'
            + '      <ul class="dropdown-menu" role="menu">'
            + '        <li><a href="#sub1">Submenu 1</a></li>'
            + '      </ul>'
            + '    </li>'
            + '</ul>'
            + '<div class="btn-group">'
            + '    <button class="btn">Actions</button>'
            + '    <button class="btn dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>'
            + '    <ul class="dropdown-menu">'
            + '        <li><a href="#">Action 1</a></li>'
            + '    </ul>'
            + '</div>'
          , dropdowns = $(dropdownHTML).appendTo('#qunit-fixture').find('[data-toggle="dropdown"]')
          , first = dropdowns.first()
          , last = dropdowns.last()

        ok(dropdowns.length == 2, "Should be two dropdowns")
          
        first.click()
        ok(first.parents('.open').length == 1, 'open class added on click')
        ok($('#qunit-fixture .open').length == 1, 'only one object is open')
        $('body').click()
        ok($("#qunit-fixture .open").length === 0, 'open class removed')

        last.click()
        ok(last.parent('.open').length == 1, 'open class added on click')
        ok($('#qunit-fixture .open').length == 1, 'only one object is open')
        $('body').click()
        ok($("#qunit-fixture .open").length === 0, 'open class removed')

        $("#qunit-fixture").html("")
      })

      test("should trigger open event when clicked", function ()
      {
        var dropdownHTML = 
          '<ul class="nav">'
          + '    <li><a href="#menu1">Menu 1</a></li>'
          + '    <li class="dropdown" id="testmenu">'
          + '      <a class="dropdown-toggle" data-toggle="dropdown" href="#testmenu">Test menu <b class="caret"></b></a>'
          + '      <ul class="dropdown-menu" role="menu">'
          + '        <li><a href="#sub1">Submenu 1</a></li>'
          + '      </ul>'
          + '    </li>'
          + '</ul>'
          + '<div class="btn-group">'
          + '    <button class="btn">Actions</button>'
          + '    <button class="btn dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>'
          + '    <ul class="dropdown-menu">'
          + '        <li><a href="#">Action 1</a></li>'
          + '    </ul>'
          + '</div>'
        , dropdowns = $(dropdownHTML).appendTo('#qunit-fixture').find('[data-toggle="dropdown"]')
        , first = dropdowns.first()
        , last = dropdowns.last()
        , firstDropDownOpenEventFired = false
        , lastDropDownOpenEventFired = false


        ok(dropdowns.length == 2, "Should be two dropdowns")

        first.on('open', function (e) {
          firstDropDownOpenEventFired = true
        })
          
        first.click()

        ok(firstDropDownOpenEventFired === true, 'first dropdown open event fired')

        last.on('open', function (e) {
          lastDropDownOpenEventFired = true
          e.preventDefault()
        })

        last.click() // would open if it weren't for preventDefault()

        ok(last.parent('.open').length === 0, 'last dropdown prevented from opening by event')

        ok(lastDropDownOpenEventFired === true, 'last dropdown open event fired')

        $("#qunit-fixture").html("")
      })

      test("should trigger close event when clicked", function ()
      {
        var dropdownHTML = 
          '<ul class="nav">'
          + '    <li><a href="#menu1">Menu 1</a></li>'
          + '    <li class="dropdown" id="testmenu">'
          + '      <a class="dropdown-toggle" data-toggle="dropdown" href="#testmenu">Test menu <b class="caret"></b></a>'
          + '      <ul class="dropdown-menu" role="menu">'
          + '        <li><a href="#sub1">Submenu 1</a></li>'
          + '      </ul>'
          + '    </li>'
          + '</ul>'
          + '<div class="btn-group">'
          + '    <button class="btn">Actions</button>'
          + '    <button class="btn dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>'
          + '    <ul class="dropdown-menu">'
          + '        <li><a href="#">Action 1</a></li>'
          + '    </ul>'
          + '</div>'
        , dropdowns = $(dropdownHTML).appendTo('#qunit-fixture').find('[data-toggle="dropdown"]')
        , first = dropdowns.first()
        , last = dropdowns.last()
        , firstDropDownCloseEventFired = false
        , lastDropDownCloseEventFired = false


        ok(dropdowns.length == 2, "Should be two dropdowns")

        first.on('close', function (e) {
          firstDropDownCloseEventFired = true
        })
          
        first.click() // open menu
        first.click() // close menu

        ok(firstDropDownCloseEventFired === true, 'close event fired on first dropdown')

        last.on('close', function (e) {
          lastDropDownCloseEventFired = true
          e.preventDefault()
        })

        last.click() // open dropdown
        last.click() // would close (if it weren't for close event handler)

        ok(last.parent('.open').length === 1, 'last dropdown prevented from closing by event')


        ok(lastDropDownCloseEventFired === true, 'close event fired in second dropdown')

        $("#qunit-fixture").html("")
      })

      test("should trigger open, opened and close, closed event in correct order when clicked", function ()
      {
        var dropdownHTML = 
          '<ul class="nav">'
          + '    <li><a href="#menu1">Menu 1</a></li>'
          + '    <li class="dropdown" id="testmenu">'
          + '      <a class="dropdown-toggle" data-toggle="dropdown" href="#testmenu">Test menu <b class="caret"></b></a>'
          + '      <ul class="dropdown-menu" role="menu">'
          + '        <li><a href="#sub1">Submenu 1</a></li>'
          + '      </ul>'
          + '    </li>'
          + '</ul>'
          + '<div class="btn-group">'
          + '    <button class="btn">Actions</button>'
          + '    <button class="btn dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>'
          + '    <ul class="dropdown-menu">'
          + '        <li><a href="#">Action 1</a></li>'
          + '    </ul>'
          + '</div>'
        , dropdowns = $(dropdownHTML).appendTo('#qunit-fixture').find('[data-toggle="dropdown"]')
        , first = dropdowns.first()
        , last = dropdowns.last()
        , openFired
        , openedFired
        , closeFired
        , closedFired


        ok(dropdowns.length == 2, "Should be two dropdowns")

        first.on('open', function (e) {
          openFired = true
        })

        first.on('opened', function (e) {
          ok(openFired === true, "open fired before opened")
          openedFired = true
        })
          
        first.click() // open menu

        ok(openedFired, "opened fired")

        last.on('close', function (e) {
          closeFired = true
        })

        last.on('closed', function (e) {
          ok(closeFired === true, "close fired before closed")
          closedFired = true
        })

        last.click() // open menu
        last.click() // close menu

        ok(closedFired === true, 'closed fired')

        $("#qunit-fixture").html("")
      })

      test("should trigger close, closed when body is clicked with open dropdowns", function ()
      {
        var dropdownHTML = 
          '<ul class="nav">'
          + '    <li><a href="#menu1">Menu 1</a></li>'
          + '    <li class="dropdown" id="testmenu">'
          + '      <a class="dropdown-toggle" data-toggle="dropdown" href="#testmenu">Test menu <b class="caret"></b></a>'
          + '      <ul class="dropdown-menu" role="menu">'
          + '        <li><a href="#sub1">Submenu 1</a></li>'
          + '      </ul>'
          + '    </li>'
          + '</ul>'
          + '<div class="btn-group">'
          + '    <button class="btn">Actions</button>'
          + '    <button class="btn dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>'
          + '    <ul class="dropdown-menu">'
          + '        <li><a href="#">Action 1</a></li>'
          + '    </ul>'
          + '</div>'
        , dropdowns = $(dropdownHTML).appendTo('#qunit-fixture').find('[data-toggle="dropdown"]')
        , first = dropdowns.first()
        , last = dropdowns.last()
        , firstCloseFired
        , firstClosedFired
        , lastCloseFired
        , lastClosedFired


        ok(dropdowns.length == 2, "Should be two dropdowns")

        // open both menus
        first.click()
        last.click()

        first.on('close', function (e) {
          firstCloseFired = true
        })

        first.on('closed', function (e) {
          firstClosedFired = true
        })

        last.on('close', function (e) {
          lastCloseFired = true
        })

        last.on('closed', function (e) {
          lastClosedFired = true
        })

        // close them
        first.click()
        last.click()

        ok(firstCloseFired === true, "close fired for first dropdown")
        ok(firstClosedFired === true, "closed fired for first dropdown")
        ok(lastCloseFired === true, "close fired for last dropdown")
        ok(lastClosedFired === true, "closed fired for last dropdown")

        $("#qunit-fixture").html("")
      })
})