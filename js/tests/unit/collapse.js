$(function () {
  'use strict';

  module('collapse plugin')

  test('should be defined on jquery object', function () {
    ok($(document.body).collapse, 'collapse method is defined')
  })

  module('collapse', {
    setup: function () {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.bootstrapCollapse = $.fn.collapse.noConflict()
    },
    teardown: function () {
      $.fn.collapse = $.fn.bootstrapCollapse
      delete $.fn.bootstrapCollapse
    }
  })

  test('should provide no conflict', function () {
    strictEqual($.fn.collapse, undefined, 'collapse was set back to undefined (org value)')
  })

  test('should return jquery collection containing the element', function () {
    var $el = $('<div/>')
    var $collapse = $el.bootstrapCollapse()
    ok($collapse instanceof $, 'returns jquery collection')
    strictEqual($collapse[0], $el[0], 'collection contains element')
  })

  test('should show a collapsed element', function () {
    var $el = $('<div class="collapse"/>').bootstrapCollapse('show')

    ok($el.hasClass('in'), 'has class "in"')
    ok(!/height/i.test($el.attr('style')), 'has height reset')
  })

  test('should hide a collapsed element', function () {
    var $el = $('<div class="collapse"/>').bootstrapCollapse('hide')

    ok(!$el.hasClass('in'), 'does not have class "in"')
    ok(/height/i.test($el.attr('style')), 'has height set')
  })

  test('should not fire shown when show is prevented', function () {
    stop()

    $('<div class="collapse"/>')
      .on('show.bs.collapse', function (e) {
        e.preventDefault()
        ok(true, 'show event fired')
        start()
      })
      .on('shown.bs.collapse', function () {
        ok(false, 'shown event fired')
      })
      .bootstrapCollapse('show')
  })

  test('should reset style to auto after finishing opening collapse', function () {
    stop()

    $('<div class="collapse" style="height: 0px"/>')
      .on('show.bs.collapse', function () {
        equal(this.style.height, '0px', 'height is 0px')
      })
      .on('shown.bs.collapse', function () {
        strictEqual(this.style.height, '', 'height is auto')
        start()
      })
      .bootstrapCollapse('show')
  })

  test('should remove "collapsed" class from target when collapse is shown', function () {
    stop()

    var $target = $('<a data-toggle="collapse" href="#test1"/>').appendTo('#qunit-fixture')

    $('<div id="test1"/>')
      .appendTo('#qunit-fixture')
      .on('show.bs.collapse', function () {
        ok(!$target.hasClass('collapsed'))
        start()
      })

    $target.click()
  })

  test('should add "collapsed" class to target when collapse is hidden', function () {
    stop()

    var $target = $('<a data-toggle="collapse" href="#test1"/>').appendTo('#qunit-fixture')

    $('<div id="test1" class="in"/>')
      .appendTo('#qunit-fixture')
      .on('hide.bs.collapse', function () {
        ok($target.hasClass('collapsed'))
        start()
      })

    $target.click()
  })

  test('should not close a collapse when initialized with "show" if already shown', function () {
    stop()

    expect(0)

    var $test = $('<div id="test1" class="in"/>')
      .appendTo('#qunit-fixture')
      .on('hide.bs.collapse', function () {
        ok(false)
      })

    $test.bootstrapCollapse('show')

    setTimeout(start, 0)
  })

  test('should open a collapse when initialized with "show" if not already shown', function () {
    stop()

    expect(1)

    var $test = $('<div id="test1" />')
      .appendTo('#qunit-fixture')
      .on('show.bs.collapse', function () {
        ok(true)
      })

    $test.bootstrapCollapse('show')

    setTimeout(start, 0)
  })

  test('should remove "collapsed" class from active accordion target', function () {
    stop()

    var accordionHTML = '<div id="accordion">'
        + '<div class="accordion-group"/>'
        + '<div class="accordion-group"/>'
        + '<div class="accordion-group"/>'
        + '</div>'
    var $groups = $(accordionHTML).appendTo('#qunit-fixture').find('.accordion-group')

    var $target1 = $('<a data-toggle="collapse" href="#body1" data-parent="#accordion"/>').appendTo($groups.eq(0))

    $('<div id="body1" class="in"/>').appendTo($groups.eq(0))

    var $target2 = $('<a class="collapsed" data-toggle="collapse" href="#body2" data-parent="#accordion"/>').appendTo($groups.eq(1))

    $('<div id="body2"/>').appendTo($groups.eq(1))

    var $target3 = $('<a class="collapsed" data-toggle="collapse" href="#body3" data-parent="#accordion"/>').appendTo($groups.eq(2))

    $('<div id="body3"/>')
      .appendTo($groups.eq(2))
      .on('show.bs.collapse', function () {
        ok($target1.hasClass('collapsed'), 'inactive target 1 does have class "collapsed"')
        ok($target2.hasClass('collapsed'), 'inactive target 2 does have class "collapsed"')
        ok(!$target3.hasClass('collapsed'), 'active target 3 does not have class "collapsed"')

        start()
      })

    $target3.click()
  })

  test('should allow dots in data-parent', function () {
    stop()

    var accordionHTML = '<div class="accordion">'
        + '<div class="accordion-group"/>'
        + '<div class="accordion-group"/>'
        + '<div class="accordion-group"/>'
        + '</div>'
    var $groups = $(accordionHTML).appendTo('#qunit-fixture').find('.accordion-group')

    var $target1 = $('<a data-toggle="collapse" href="#body1" data-parent=".accordion"/>').appendTo($groups.eq(0))

    $('<div id="body1" class="in"/>').appendTo($groups.eq(0))

    var $target2 = $('<a class="collapsed" data-toggle="collapse" href="#body2" data-parent=".accordion"/>').appendTo($groups.eq(1))

    $('<div id="body2"/>').appendTo($groups.eq(1))

    var $target3 = $('<a class="collapsed" data-toggle="collapse" href="#body3" data-parent=".accordion"/>').appendTo($groups.eq(2))

    $('<div id="body3"/>')
      .appendTo($groups.eq(2))
      .on('show.bs.collapse', function () {
        ok($target1.hasClass('collapsed'), 'inactive target 1 does have class "collapsed"')
        ok($target2.hasClass('collapsed'), 'inactive target 2 does have class "collapsed"')
        ok(!$target3.hasClass('collapsed'), 'active target 3 does not have class "collapsed"')

        start()
      })

    $target3.click()
  })

})
