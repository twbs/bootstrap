$(function () {

  module('collapse plugin')

  test('should be defined on jquery object', function () {
    ok($(document.body).collapse, 'collapse method is defined')
  })

  module('collapse', {
    setup: function() {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.bootstrapCollapse = $.fn.collapse.noConflict()
    },
    teardown: function() {
      $.fn.collapse = $.fn.bootstrapCollapse
      delete $.fn.bootstrapCollapse
    }
  })

  test('should provide no conflict', function () {
    ok(!$.fn.collapse, 'collapse was set back to undefined (org value)')
  })

  test('should return element', function () {
    ok($(document.body).bootstrapCollapse()[0] == document.body, 'document.body returned')
  })

  test('should show a collapsed element', function () {
    var el = $('<div class="collapse"></div>').bootstrapCollapse('show')
    ok(el.hasClass('in'), 'has class in')
    ok(!/height/.test(el.attr('style')), 'has height reset')
  })

  test('should hide a collapsed element', function () {
    var el = $('<div class="collapse"></div>').bootstrapCollapse('hide')
    ok(!el.hasClass('in'), 'does not have class in')
    ok(/height/.test(el.attr('style')), 'has height set')
  })

  test('should not fire shown when show is prevented', function () {
    $.support.transition = false
    stop()
    $('<div class="collapse"/>')
      .on('show.bs.collapse', function (e) {
        e.preventDefault()
        ok(true)
        start()
      })
      .on('shown.bs.collapse', function () {
        ok(false)
      })
      .bootstrapCollapse('show')
  })

  test('should reset style to auto after finishing opening collapse', function () {
    $.support.transition = false
    stop()
    $('<div class="collapse" style="height: 0px"/>')
      .on('show.bs.collapse', function () {
        ok(this.style.height == '0px')
      })
      .on('shown.bs.collapse', function () {
        ok(this.style.height === '')
        start()
      })
      .bootstrapCollapse('show')
  })

  test('should add active class to target when collapse shown', function () {
    $.support.transition = false
    stop()

    var target = $('<a data-toggle="collapse" href="#test1"></a>')
      .appendTo($('#qunit-fixture'))

    $('<div id="test1"></div>')
      .appendTo($('#qunit-fixture'))
      .on('show.bs.collapse', function () {
        ok(!target.hasClass('collapsed'))
        start()
      })

    target.click()
  })

  test('should remove active class to target when collapse hidden', function () {
    $.support.transition = false
    stop()

    var target = $('<a data-toggle="collapse" href="#test1"></a>')
      .appendTo($('#qunit-fixture'))

    $('<div id="test1" class="in"></div>')
      .appendTo($('#qunit-fixture'))
      .on('hide.bs.collapse', function () {
        ok(target.hasClass('collapsed'))
        start()
      })

    target.click()
  })

  test('should remove active class from inactive accordion targets', function () {
    $.support.transition = false
    stop()

    var accordion = $('<div id="accordion"><div class="accordion-group"></div><div class="accordion-group"></div><div class="accordion-group"></div></div>')
      .appendTo($('#qunit-fixture'))

    var target1 = $('<a data-toggle="collapse" href="#body1" data-parent="#accordion"></a>')
      .appendTo(accordion.find('.accordion-group').eq(0))

    $('<div id="body1" class="in"></div>')
      .appendTo(accordion.find('.accordion-group').eq(0))

    var target2 = $('<a class="collapsed" data-toggle="collapse" href="#body2" data-parent="#accordion"></a>')
      .appendTo(accordion.find('.accordion-group').eq(1))

    $('<div id="body2"></div>')
      .appendTo(accordion.find('.accordion-group').eq(1))

    var target3 = $('<a class="collapsed" data-toggle="collapse" href="#body3" data-parent="#accordion"></a>')
      .appendTo(accordion.find('.accordion-group').eq(2))

    $('<div id="body3"></div>')
      .appendTo(accordion.find('.accordion-group').eq(2))
      .on('show.bs.collapse', function () {
        ok(target1.hasClass('collapsed'))
        ok(target2.hasClass('collapsed'))
        ok(!target3.hasClass('collapsed'))

        start()
      })

    target3.click()
  })

  test('should allow dots in data-parent', function () {
    $.support.transition = false
    stop()

    var accordion = $('<div class="accordion"><div class="accordion-group"></div><div class="accordion-group"></div><div class="accordion-group"></div></div>')
      .appendTo($('#qunit-fixture'))

    var target1 = $('<a data-toggle="collapse" href="#body1" data-parent=".accordion"></a>')
      .appendTo(accordion.find('.accordion-group').eq(0))

    $('<div id="body1" class="in"></div>')
      .appendTo(accordion.find('.accordion-group').eq(0))

    var target2 = $('<a class="collapsed" data-toggle="collapse" href="#body2" data-parent=".accordion"></a>')
      .appendTo(accordion.find('.accordion-group').eq(1))

    $('<div id="body2"></div>')
      .appendTo(accordion.find('.accordion-group').eq(1))

    var target3 = $('<a class="collapsed" data-toggle="collapse" href="#body3" data-parent=".accordion"></a>')
      .appendTo(accordion.find('.accordion-group').eq(2))

    $('<div id="body3"></div>')
      .appendTo(accordion.find('.accordion-group').eq(2))
      .on('show.bs.collapse', function () {
        ok(target1.hasClass('collapsed'))
        ok(target2.hasClass('collapsed'))
        ok(!target3.hasClass('collapsed'))

        start()
      })

    target3.click()
  })

})
