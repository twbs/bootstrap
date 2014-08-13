$(function () {
  'use strict';

  module('tooltip plugin')

  test('should be defined on jquery object', function () {
    ok($(document.body).tooltip, 'popover method is defined')
  })

  module('tooltip', {
    setup: function () {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.bootstrapTooltip = $.fn.tooltip.noConflict()
    },
    teardown: function () {
      $.fn.tooltip = $.fn.bootstrapTooltip
      delete $.fn.bootstrapTooltip
    }
  })

  test('should provide no conflict', function () {
    strictEqual($.fn.tooltip, undefined, 'tooltip was set back to undefined (org value)')
  })

  test('should return jquery collection containing the element', function () {
    var $el = $('<div/>')
    var $tooltip = $el.bootstrapTooltip()
    ok($tooltip instanceof $, 'returns jquery collection')
    strictEqual($tooltip[0], $el[0], 'collection contains element')
  })

  test('should expose default settings', function () {
    ok($.fn.bootstrapTooltip.Constructor.DEFAULTS, 'defaults is defined')
  })

  test('should empty title attribute', function () {
    var $trigger = $('<a href="#" rel="tooltip" title="Another tooltip"/>').bootstrapTooltip()
    strictEqual($trigger.attr('title'), '', 'title attribute was emptied')
  })

  test('should add data attribute for referencing original title', function () {
    var $trigger = $('<a href="#" rel="tooltip" title="Another tooltip"/>').bootstrapTooltip()
    strictEqual($trigger.attr('data-original-title'), 'Another tooltip', 'original title preserved in data attribute')
  })

  test('should add aria-describedby to the trigger on show', function () {
    var $trigger = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .bootstrapTooltip()
      .appendTo('#qunit-fixture')
      .bootstrapTooltip('show')

    var id = $('.tooltip').attr('id')

    strictEqual($('#' + id).length, 1, 'has a unique id')
    strictEqual($('.tooltip').attr('aria-describedby'), $trigger.attr('id'), 'tooltip id and aria-describedby on trigger match')
    ok($trigger[0].hasAttribute('aria-describedby'), 'trigger has aria-describedby')
  })

  test('should remove aria-describedby from trigger on hide', function () {
    var $trigger = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .bootstrapTooltip()
      .appendTo('#qunit-fixture')

    $trigger.bootstrapTooltip('show')
    ok($trigger[0].hasAttribute('aria-describedby'), 'trigger has aria-describedby')

    $trigger.bootstrapTooltip('hide')
    ok(!$trigger[0].hasAttribute('aria-describedby'), 'trigger does not have aria-describedby')
  })

  test('should assign a unique id tooltip element', function () {
    $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip('show')

    var id = $('.tooltip').attr('id')

    strictEqual($('#' + id).length, 1, 'tooltip has unique id')
    strictEqual(id.indexOf('tooltip'), 0, 'tooltip id has prefix')
  })

  test('should place tooltips relative to placement option', function () {
    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({ placement: 'bottom' })

    $tooltip.bootstrapTooltip('show')
    ok($('.tooltip').is('.fade.bottom.in'), 'has correct classes applied')

    $tooltip.bootstrapTooltip('hide')
    equal($('.tooltip').length, 0, 'tooltip removed')
  })

  test('should allow html entities', function () {
    var $tooltip = $('<a href="#" rel="tooltip" title="&lt;b&gt;@fat&lt;/b&gt;"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({ html: true })

    $tooltip.bootstrapTooltip('show')
    notEqual($('.tooltip b').length, 0, 'b tag was inserted')

    $tooltip.bootstrapTooltip('hide')
    equal($('.tooltip').length, 0, 'tooltip removed')
  })

  test('should respect custom classes', function () {
    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({ template: '<div class="tooltip some-class"><div class="tooltip-arrow"/><div class="tooltip-inner"/></div>' })

    $tooltip.bootstrapTooltip('show')
    ok($('.tooltip').hasClass('some-class'), 'custom class is present')

    $tooltip.bootstrapTooltip('hide')
    equal($('.tooltip').length, 0, 'tooltip removed')
  })

  test('should fire show event', function () {
    stop()

    $('<div title="tooltip title"/>')
      .on('show.bs.tooltip', function () {
        ok(true, 'show event fired')
        start()
      })
      .bootstrapTooltip('show')
  })

  test('should fire shown event', function () {
    stop()

    $('<div title="tooltip title"></div>')
      .appendTo('#qunit-fixture')
      .on('shown.bs.tooltip', function () {
        ok(true, 'shown was called')
        start()
      })
      .bootstrapTooltip('show')
  })

  test('should not fire shown event when show was prevented', function () {
    stop()

    $('<div title="tooltip title"/>')
      .on('show.bs.tooltip', function (e) {
        e.preventDefault()
        ok(true, 'show event fired')
        start()
      })
      .on('shown.bs.tooltip', function () {
        ok(false, 'shown event fired')
      })
      .bootstrapTooltip('show')
  })

  test('should fire hide event', function () {
    stop()

    $('<div title="tooltip title"/>')
      .appendTo('#qunit-fixture')
      .on('shown.bs.tooltip', function () {
        $(this).bootstrapTooltip('hide')
      })
      .on('hide.bs.tooltip', function () {
        ok(true, 'hide event fired')
        start()
      })
      .bootstrapTooltip('show')
  })

  test('should fire hidden event', function () {
    stop()

    $('<div title="tooltip title"/>')
      .appendTo('#qunit-fixture')
      .on('shown.bs.tooltip', function () {
        $(this).bootstrapTooltip('hide')
      })
      .on('hidden.bs.tooltip', function () {
        ok(true, 'hidden event fired')
        start()
      })
      .bootstrapTooltip('show')
  })

  test('should not fire hidden event when hide was prevented', function () {
    stop()

    $('<div title="tooltip title"/>')
      .appendTo('#qunit-fixture')
      .on('shown.bs.tooltip', function () {
        $(this).bootstrapTooltip('hide')
      })
      .on('hide.bs.tooltip', function (e) {
        e.preventDefault()
        ok(true, 'hide event fired')
        start()
      })
      .on('hidden.bs.tooltip', function () {
        ok(false, 'hidden event fired')
      })
      .bootstrapTooltip('show')
  })

  test('should destroy tooltip', function () {
    var $tooltip = $('<div/>')
      .bootstrapTooltip()
      .on('click.foo', function () {})

    ok($tooltip.data('bs.tooltip'), 'tooltip has data')
    ok($._data($tooltip[0], 'events').mouseover && $._data($tooltip[0], 'events').mouseout, 'tooltip has hover events')
    equal($._data($tooltip[0], 'events').click[0].namespace, 'foo', 'tooltip has extra click.foo event')

    $tooltip.bootstrapTooltip('show')
    $tooltip.bootstrapTooltip('destroy')

    ok(!$tooltip.hasClass('in'), 'tooltip is hidden')
    ok(!$._data($tooltip[0], 'bs.tooltip'), 'tooltip does not have data')
    equal($._data($tooltip[0], 'events').click[0].namespace, 'foo', 'tooltip still has click.foo')
    ok(!$._data($tooltip[0], 'events').mouseover && !$._data($tooltip[0], 'events').mouseout, 'tooltip does not have hover events')
  })

  test('should show tooltip with delegate selector on click', function () {
    var $div = $('<div><a href="#" rel="tooltip" title="Another tooltip"/></div>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        selector: 'a[rel="tooltip"]',
        trigger: 'click'
      })

    $div.find('a').click()
    ok($('.tooltip').is('.fade.in'), 'tooltip is faded in')

    $div.find('a').click()
    equal($('.tooltip').length, 0, 'tooltip was removed from dom')
  })

  test('should show tooltip when toggle is called', function () {
    $('<a href="#" rel="tooltip" title="tooltip on toggle"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({ trigger: 'manual' })
      .bootstrapTooltip('toggle')

    ok($('.tooltip').is('.fade.in'), 'tooltip is faded in')
  })

  test('should hide previously shown tooltip when toggle is called on tooltip', function () {
    $('<a href="#" rel="tooltip" title="tooltip on toggle">@ResentedHook</a>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({ trigger: 'manual' })
      .bootstrapTooltip('show')

    $('.tooltip').bootstrapTooltip('toggle')
    ok($('.tooltip').not('.fade.in'), 'tooltip was faded out')
  })

  test('should place tooltips inside body when container is body', function () {
    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({ container: 'body' })
      .bootstrapTooltip('show')

    notEqual($('body > .tooltip').length, 0, 'tooltip is direct descendant of body')
    equal($('#qunit-fixture > .tooltip').length, 0, 'tooltip is not in parent')

    $tooltip.bootstrapTooltip('hide')
    equal($('body > .tooltip').length, 0, 'tooltip was removed from dom')
  })

  test('should add position class before positioning so that position-specific styles are taken into account', function () {
    var styles = '<style>'
        + '.tooltip.right { white-space: nowrap; }'
        + '.tooltip.right .tooltip-inner { max-width: none; }'
        + '</style>'
    var $styles = $(styles).appendTo('head')

    var $container = $('<div/>').appendTo('#qunit-fixture')
    var $target = $('<a href="#" rel="tooltip" title="very very very very very very very very long tooltip in one line"/>')
      .appendTo($container)
      .bootstrapTooltip({
        placement: 'right',
        viewport: null
      })
      .bootstrapTooltip('show')
    var $tooltip = $container.find('.tooltip')

    // this is some dumb hack shit because sub pixels in firefox
    var top = Math.round($target.offset().top + ($target[0].offsetHeight / 2) - ($tooltip[0].offsetHeight / 2))
    var top2 = Math.round($tooltip.offset().top)
    var topDiff = top - top2
    ok(topDiff <= 1 && topDiff >= -1)
    $target.bootstrapTooltip('hide')

    $container.remove()
    $styles.remove()
  })

  test('should use title attribute for tooltip text', function () {
    var $tooltip = $('<a href="#" rel="tooltip" title="Simple tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip()

    $tooltip.bootstrapTooltip('show')
    equal($('.tooltip').children('.tooltip-inner').text(), 'Simple tooltip', 'title from title attribute is set')

    $tooltip.bootstrapTooltip('hide')
    equal($('.tooltip').length, 0, 'tooltip removed from dom')
  })

  test('should prefer title attribute over title option', function () {
    var $tooltip = $('<a href="#" rel="tooltip" title="Simple tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        title: 'This is a tooltip with some content'
      })

    $tooltip.bootstrapTooltip('show')
    equal($('.tooltip').children('.tooltip-inner').text(), 'Simple tooltip', 'title is set from title attribute while preferred over title option')

    $tooltip.bootstrapTooltip('hide')
    equal($('.tooltip').length, 0, 'tooltip removed from dom')
  })

  test('should use title option', function () {
    var $tooltip = $('<a href="#" rel="tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        title: 'This is a tooltip with some content'
      })

    $tooltip.bootstrapTooltip('show')
    equal($('.tooltip').children('.tooltip-inner').text(), 'This is a tooltip with some content', 'title from title option is set')

    $tooltip.bootstrapTooltip('hide')
    equal($('.tooltip').length, 0, 'tooltip removed from dom')
  })

  test('should be placed dynamically with the dynamic placement option', function () {
    var $style = $('<style> a[rel="tooltip"] { display: inline-block; position: absolute; } </style>')
    var $container = $('<div/>')
      .css({
        position: 'absolute',
        overflow: 'hidden',
        width: 600,
        height: 400,
        top: 0,
        left: 0
      })
      .appendTo(document.body)

    var $topTooltip = $('<div style="left: 0; top: 0;" rel="tooltip" title="Top tooltip">Top Dynamic Tooltip</div>')
      .appendTo($container)
      .bootstrapTooltip({ placement: 'auto' })

    $topTooltip.bootstrapTooltip('show')
    ok($('.tooltip').is('.bottom'), 'top positioned tooltip is dynamically positioned to bottom')

    $topTooltip.bootstrapTooltip('hide')
    equal($('.tooltip').length, 0, 'top positioned tooltip removed from dom')

    var $rightTooltip = $('<div style="right: 0;" rel="tooltip" title="Right tooltip">Right Dynamic Tooltip</div>')
      .appendTo($container)
      .bootstrapTooltip({ placement: 'right auto' })

    $rightTooltip.bootstrapTooltip('show')
    ok($('.tooltip').is('.left'), 'right positioned tooltip is dynamically positioned left')

    $rightTooltip.bootstrapTooltip('hide')
    equal($('.tooltip').length, 0, 'right positioned tooltip removed from dom')

    var $leftTooltip = $('<div style="left: 0;" rel="tooltip" title="Left tooltip">Left Dynamic Tooltip</div>')
      .appendTo($container)
      .bootstrapTooltip({ placement: 'auto left' })

    $leftTooltip.bootstrapTooltip('show')
    ok($('.tooltip').is('.right'), 'left positioned tooltip is dynamically positioned right')

    $leftTooltip.bootstrapTooltip('hide')
    equal($('.tooltip').length, 0, 'left positioned tooltip removed from dom')

    $container.remove()
    $style.remove()
  })

  test('should adjust the tip\'s top position when up against the top of the viewport', function () {
    var styles = '<style>'
        + '.tooltip .tooltip-inner { width: 200px; height: 200px; max-width: none; }'
        + 'a[rel="tooltip"] { position: fixed; }'
        + '</style>'
    var $styles = $(styles).appendTo('head')

    var $container = $('<div/>').appendTo('#qunit-fixture')
    var $target = $('<a href="#" rel="tooltip" title="tip" style="top: 0px; left: 0px;"/>')
      .appendTo($container)
      .bootstrapTooltip({
        placement: 'right',
        viewport: {
          selector: 'body',
          padding: 12
        }
      })

    $target.bootstrapTooltip('show')
    equal(Math.round($container.find('.tooltip').offset().top), 12)

    $target.bootstrapTooltip('hide')
    equal($('.tooltip').length, 0, 'tooltip removed from dom')

    $styles.remove()
  })

  test('should adjust the tip\'s top position when up against the bottom of the viewport', function () {
    var styles = '<style>'
        + '.tooltip .tooltip-inner { width: 200px; height: 200px; max-width: none; }'
        + 'a[rel="tooltip"] { position: fixed; }'
        + '</style>'
    var $styles = $(styles).appendTo('head')

    var $container = $('<div/>').appendTo('#qunit-fixture')
    var $target = $('<a href="#" rel="tooltip" title="tip" style="bottom: 0px; left: 0px;"/>')
      .appendTo($container)
      .bootstrapTooltip({
        placement: 'right',
        viewport: {
          selector: 'body',
          padding: 12
        }
      })

    $target.bootstrapTooltip('show')
    var $tooltip = $container.find('.tooltip')
    strictEqual(Math.round($tooltip.offset().top), Math.round($(window).height() - 12 - $tooltip[0].offsetHeight))

    $target.bootstrapTooltip('hide')
    equal($('.tooltip').length, 0, 'tooltip removed from dom')

    $container.remove()
    $styles.remove()
  })

  test('should adjust the tip\'s left position when up against the left of the viewport', function () {
    var styles = '<style>'
        + '.tooltip .tooltip-inner { width: 200px; height: 200px; max-width: none; }'
        + 'a[rel="tooltip"] { position: fixed; }'
        + '</style>'
    var $styles = $(styles).appendTo('head')

    var $container = $('<div/>').appendTo('#qunit-fixture')
    var $target = $('<a href="#" rel="tooltip" title="tip" style="top: 0px; left: 0px;"/>')
      .appendTo($container)
      .bootstrapTooltip({
        placement: 'bottom',
        viewport: {
          selector: 'body',
          padding: 12
        }
      })

    $target.bootstrapTooltip('show')
    strictEqual(Math.round($container.find('.tooltip').offset().left), 12)

    $target.bootstrapTooltip('hide')
    equal($('.tooltip').length, 0, 'tooltip removed from dom')

    $container.remove()
    $styles.remove()
  })

  test('should adjust the tip\'s left position when up against the right of the viewport', function () {
    var styles = '<style>'
        + '.tooltip .tooltip-inner { width: 200px; height: 200px; max-width: none; }'
        + 'a[rel="tooltip"] { position: fixed; }'
        + '</style>'
    var $styles = $(styles).appendTo('head')

    var $container = $('<div/>').appendTo('body')
    var $target = $('<a href="#" rel="tooltip" title="tip" style="top: 0px; right: 0px;"/>')
      .appendTo($container)
      .bootstrapTooltip({
        placement: 'bottom',
        viewport: {
          selector: 'body',
          padding: 12
        }
      })

    $target.bootstrapTooltip('show')
    var $tooltip = $container.find('.tooltip')
    strictEqual(Math.round($tooltip.offset().left), Math.round($(window).width() - 12 - $tooltip[0].offsetWidth))

    $target.bootstrapTooltip('hide')
    equal($('.tooltip').length, 0, 'tooltip removed from dom')

    $container.remove()
    $styles.remove()
  })

  test('should adjust the tip when up against the right of an arbitrary viewport', function () {
    var styles = '<style>'
        + '.tooltip, .tooltip .tooltip-inner { width: 200px; height: 200px; max-width: none; }'
        + '.container-viewport { position: absolute; top: 50px; left: 60px; width: 300px; height: 300px; }'
        + 'a[rel="tooltip"] { position: fixed; }'
        + '</style>'
    var $styles = $(styles).appendTo('head')

    var $container = $('<div class="container-viewport"/>').appendTo(document.body)
    var $target = $('<a href="#" rel="tooltip" title="tip" style="top: 50px; left: 350px;"/>')
      .appendTo($container)
      .bootstrapTooltip({
        placement: 'bottom',
        viewport: '.container-viewport'
      })

    $target.bootstrapTooltip('show')
    var $tooltip = $container.find('.tooltip')
    strictEqual(Math.round($tooltip.offset().left), Math.round(60 + $container.width() - $tooltip[0].offsetWidth))

    $target.bootstrapTooltip('hide')
    equal($('.tooltip').length, 0, 'tooltip removed from dom')

    $container.remove()
    $styles.remove()
  })

  test('should not error when trying to show an auto-placed tooltip that has been removed from the dom', function () {
    var passed = true
    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .one('show.bs.tooltip', function () {
        $(this).remove()
      })
      .bootstrapTooltip({ placement: 'auto' })

    try {
      $tooltip.bootstrapTooltip('show')
    } catch (err) {
      passed = false
      console.log(err)
    }

    ok(passed, '.tooltip(\'show\') should not throw an error if element no longer is in dom')
  })

  test('should place tooltip on top of element', function () {
    stop()

    var containerHTML = '<div>'
        + '<p style="margin-top: 200px">'
        + '<a href="#" title="very very very very very very very long tooltip">Hover me</a>'
        + '</p>'
        + '</div>'

    var $container = $(containerHTML)
      .css({
        position: 'absolute',
        bottom: 0,
        left: 0,
        textAlign: 'right',
        width: 300,
        height: 300
      })
      .appendTo('#qunit-fixture')

    var $trigger = $container
      .find('a')
      .css('margin-top', 200)
      .bootstrapTooltip({
        placement: 'top',
        animate: false
      })
      .bootstrapTooltip('show')

    var $tooltip = $container.find('.tooltip')

    setTimeout(function () {
      ok(Math.round($tooltip.offset().top + $tooltip.outerHeight()) <= Math.round($trigger.offset().top))
      start()
    }, 0)
  })

  test('should place tooltip inside viewport', function () {
    stop()

    var $container = $('<div/>')
      .css({
        position: 'absolute',
        width: 200,
        height: 200,
        bottom: 0,
        left: 0
      })
      .appendTo('#qunit-fixture')

    $('<a href="#" title="Very very very very very very very very long tooltip">Hover me</a>')
      .css({
        position: 'absolute',
        top: 0,
        left: 0
      })
      .appendTo($container)
      .bootstrapTooltip({
        placement: 'top'
      })
      .bootstrapTooltip('show')

    setTimeout(function () {
      ok($('.tooltip').offset().left >= 0)
      start()
    }, 0)
  })

  test('should show tooltip if leave event hasn\'t occured before delay expires', function () {
    stop()

    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({ delay: 15 })

    setTimeout(function () {
      ok(!$('.tooltip').is('.fade.in'), '10ms: tooltip is not faded in')
    }, 10)

    setTimeout(function () {
      ok($('.tooltip').is('.fade.in'), '20ms: tooltip is faded in')
      start()
    }, 20)

    $tooltip.trigger('mouseenter')
  })

  test('should not show tooltip if leave event occurs before delay expires', function () {
    stop()

    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({ delay: 15 })

    setTimeout(function () {
      ok(!$('.tooltip').is('.fade.in'), '10ms: tooltip not faded in')
      $tooltip.trigger('mouseout')
    }, 10)

    setTimeout(function () {
      ok(!$('.tooltip').is('.fade.in'), '20ms: tooltip not faded in')
      start()
    }, 20)

    $tooltip.trigger('mouseenter')
  })

  test('should not hide tooltip if leave event occurs and enter event occurs within the hide delay', function () {
    stop()

    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({ delay: { show: 0, hide: 15 }})

    setTimeout(function () {
      ok($('.tooltip').is('.fade.in'), '1ms: tooltip faded in')
      $tooltip.trigger('mouseout')

      setTimeout(function () {
        ok($('.tooltip').is('.fade.in'), '10ms: tooltip still faded in')
        $tooltip.trigger('mouseenter')
      }, 10)

      setTimeout(function () {
        ok($('.tooltip').is('.fade.in'), '20ms: tooltip still faded in')
        start()
      }, 20)
    }, 0)

    $tooltip.trigger('mouseenter')
  })

  test('should not show tooltip if leave event occurs before delay expires', function () {
    stop()

    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({ delay: 15 })

    setTimeout(function () {
      ok(!$('.tooltip').is('.fade.in'), '10ms: tooltip not faded in')
      $tooltip.trigger('mouseout')
    }, 10)

    setTimeout(function () {
      ok(!$('.tooltip').is('.fade.in'), '20ms: tooltip not faded in')
      start()
    }, 20)

    $tooltip.trigger('mouseenter')
  })

  test('should not show tooltip if leave event occurs before delay expires, even if hide delay is 0', function () {
    stop()

    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({ delay: { show: 15, hide: 0 }})

    setTimeout(function () {
      ok(!$('.tooltip').is('.fade.in'), '10ms: tooltip not faded in')
      $tooltip.trigger('mouseout')
    }, 10)

    setTimeout(function () {
      ok(!$('.tooltip').is('.fade.in'), '25ms: tooltip not faded in')
      start()
    }, 25)

    $tooltip.trigger('mouseenter')
  })

  test('should wait 20ms before hiding the tooltip', function () {
    stop()

    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({ delay: { show: 0, hide: 15 }})

    setTimeout(function () {
      ok($tooltip.data('bs.tooltip').$tip.is('.fade.in'), '1ms: tooltip faded in')

      $tooltip.trigger('mouseout')

      setTimeout(function () {
        ok($tooltip.data('bs.tooltip').$tip.is('.fade.in'), '10ms: tooltip still faded in')
      }, 10)

      setTimeout(function () {
        ok(!$tooltip.data('bs.tooltip').$tip.is('.in'), '20ms: tooltip removed')
        start()
      }, 20)

    }, 0)

    $tooltip.trigger('mouseenter')
  })

  test('should correctly position tooltips on SVG elements', function () {
    if (!window.SVGElement) {
      // Skip IE8 since it doesn't support SVG
      expect(0)
      return
    }

    stop()

    var styles = '<style>'
        + '.tooltip, .tooltip *, .tooltip *:before, .tooltip *:after { box-sizing: border-box; }'
        + '.tooltip { position: absolute; }'
        + '.tooltip .tooltip-inner { width: 24px; height: 24px; font-family: Helvetica; }'
        + '</style>'
    var $styles = $(styles).appendTo('head')

    $('#qunit-fixture').append(
        '<div style="position: fixed; top: 0; left: 0;">'
      + '  <svg width="200" height="200">'
      + '    <circle cx="100" cy="100" r="10" title="m" id="theCircle" />'
      + '  </svg>'
      + '</div>')
    var $circle = $('#theCircle')

    $circle
      .on('shown.bs.tooltip', function () {
        var offset = $('.tooltip').offset()
        $styles.remove()
        ok(Math.abs(offset.left - 88) <= 1, 'tooltip has correct horizontal location')
        start()
      })
      .bootstrapTooltip({ container: 'body', placement: 'top', trigger: 'manual' })

    $circle.bootstrapTooltip('show')
  })

})
