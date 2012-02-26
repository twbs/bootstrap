$(function () {

    module("bootstrap-combobox")

      test("should be defined on jquery object", function () {
        ok($(document.body).combobox, 'combobox method is defined')
      })

      test("should return element", function () {
        var $select = $('<select />')
        ok($($select).combobox()[0] == $select[0], 'select returned')
      })

      test("should build combobox from a select", function() {
        var $select = $('<select />')
        $select.combobox()
        ok($select.data('combobox').$container, 'has a container')
        ok($select.data('combobox').$element, 'has a input element')
        ok($select.data('combobox').$button, 'has a button')
        ok($select.data('combobox').$target, 'has a target select')
      })

      test("should listen to an input", function () {
        var $select = $('<select />')
          , $input = $select.combobox().data('combobox').$element
        ok($input.data('events').blur, 'has a blur event')
        ok($input.data('events').keypress, 'has a keypress event')
        ok($input.data('events').keyup, 'has a keyup event')
        if ($.browser.webkit || $.browser.msie) {
          ok($input.data('events').keydown, 'has a keydown event')
        } else {
          ok($input.data('events').keydown, 'does not have a keydown event')
        }
      })

      test("should listen to an button", function () {
        var $select = $('<select />')
          , $button = $select.combobox().data('combobox').$button
        ok($button.data('events').click, 'has a click event')
      })

      test("should create a menu", function () {
        var $select = $('<select />')
        ok($select.combobox().data('combobox').$menu, 'has a menu')
      })

      test("should listen to the menu", function () {
        var $select = $('<select />')
          , $menu = $select.combobox().data('combobox').$menu

        ok($menu.data('events').mouseover, 'has a mouseover(pseudo: mouseenter)')
        ok($menu.data('events').click, 'has a click')
      })

      test("should show menu when query entered", function () {
        var $select = $('<select><option></option><option>aa</option><option>ab</option><option>ac</option></select>')
          , $input = $select.combobox().data('combobox').$element
          , combobox = $select.data('combobox')

        $input.val('a')
        combobox.lookup()

        ok(combobox.$menu.is(":visible"), 'menu is visible')
        equals(combobox.$menu.find('li').length, 3, 'has 3 items in menu')
        equals(combobox.$menu.find('.active').length, 1, 'one item is active')

        combobox.$menu.remove()
      })

      test("should hide menu when query entered", function () {
        stop()
        var $select = $('<select><option></option><option>aa</option><option>ab</option><option>ac</option></select>')
          , $input = $select.combobox().data('combobox').$element
          , combobox = $select.data('combobox')

        $input.val('a')
        combobox.lookup()

        ok(combobox.$menu.is(":visible"), 'menu is visible')
        equals(combobox.$menu.find('li').length, 3, 'has 3 items in menu')
        equals(combobox.$menu.find('.active').length, 1, 'one item is active')

        $input.blur()

        setTimeout(function () {
          ok(!combobox.$menu.is(":visible"), "menu is no longer visible")
          start()
        }, 200)

        combobox.$menu.remove()
      })

      test("should set next item when down arrow is pressed", function () {
        var $select = $('<select><option></option><option>aa</option><option>ab</option><option>ac</option></select>')
          , $input = $select.combobox().data('combobox').$element
          , combobox = $select.data('combobox')

        $input.val('a')
        combobox.lookup()

        ok(combobox.$menu.is(":visible"), 'menu is visible')
        equals(combobox.$menu.find('li').length, 3, 'has 3 items in menu')
        equals(combobox.$menu.find('.active').length, 1, 'one item is active')
        ok(combobox.$menu.find('li').first().hasClass('active'), "first item is active")

        $input.trigger({
          type: 'keypress'
        , keyCode: 40
        })

        ok(combobox.$menu.find('li').first().next().hasClass('active'), "second item is active")


        $input.trigger({
          type: 'keypress'
        , keyCode: 38
        })

        ok(combobox.$menu.find('li').first().hasClass('active'), "first item is active")

        combobox.$menu.remove()
      })


      test("should set input and select value to selected item", function () {
        var $select = $('<select><option></option><option>aa</option><option>ab</option><option>ac</option></select>')
          , $input = $select.combobox().data('combobox').$element
          , combobox = $select.data('combobox')

        $input.val('a')
        combobox.lookup()

        $(combobox.$menu.find('li')[2]).mouseover().click()

        equals($input.val(), 'ac', 'input value was correctly set')
        equals($select.val(), 'ac', 'select value was correctly set')
        ok(!combobox.$menu.is(':visible'), 'the menu was hidden')

        combobox.$menu.remove()
      })

      test("should show menu when no item is selected and button is clicked", function () {
        var $select = $('<select><option></option><option>aa</option><option>ab</option><option>ac</option></select>')
          , $button = $select.combobox().data('combobox').$button
          , combobox = $select.data('combobox')

        $button.click()

        ok(combobox.$menu.is(":visible"), 'menu is visible')
        equals(combobox.$menu.find('li').length, 3, 'has 3 items in menu')
        equals(combobox.$menu.find('.active').length, 1, 'one item is active')

        combobox.$menu.remove()
      })

      test("should add class to container when an item is selected", function () {
        var $select = $('<select><option></option><option>aa</option><option>ab</option><option>ac</option></select>')
          , $input = $select.combobox().data('combobox').$element
          , combobox = $select.data('combobox')

        $input.val('a')
        combobox.lookup()

        $(combobox.$menu.find('li')[2]).mouseover().click()

        ok(combobox.$container.hasClass('combobox-selected'), 'container has selected class')
        combobox.$menu.remove()
      })

      test("should clear input and select and remove class from container when button is clicked when item is selected", function () {
        var $select = $('<select><option></option><option>aa</option><option>ab</option><option>ac</option></select>')
          , $input = $select.combobox().data('combobox').$element
          , combobox = $select.data('combobox')

        $input.val('a')
        combobox.lookup()

        $(combobox.$menu.find('li')[2]).mouseover().click()

        equals($input.val(), 'ac', 'input value was correctly set')
        equals($select.val(), 'ac', 'select value was correctly set')

        combobox.$button.mouseover().click()

        equals($input.val(), '', 'input value was cleared correctly')
        equals($select.val(), '', 'select value was cleared correctly')
        combobox.$menu.remove()
      })

      test("should set as selected if select was selected before load", function () {
        var $select = $('<select><option></option><option>aa</option><option selected>ab</option><option>ac</option></select>')
          , $input = $select.combobox().data('combobox').$element
          , combobox = $select.data('combobox')

        equals($input.val(), 'ab', 'input value was correctly set')
        equals($select.val(), 'ab', 'select value was correctly set')
      })
})
