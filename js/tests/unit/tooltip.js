$(function () {
  'use strict';

  module('tooltip plugin')

  test('should be defined on jquery object', function () {
    ok($(document.body).tooltip, 'tooltip method is defined')
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

  test('should fire show event', function (assert) {
    var done = assert.async()

    $('<div title="tooltip title"/>')
      .on('show.bs.tooltip', function () {
        ok(true, 'show event fired')
        done()
      })
      .bootstrapTooltip('show')
  })

  test('should fire shown event', function (assert) {
    var done = assert.async()

    $('<div title="tooltip title"></div>')
      .appendTo('#qunit-fixture')
      .on('shown.bs.tooltip', function () {
        ok(true, 'shown was called')
        done()
      })
      .bootstrapTooltip('show')
  })

  test('should not fire shown event when show was prevented', function (assert) {
    var done = assert.async()

    $('<div title="tooltip title"/>')
      .on('show.bs.tooltip', function (e) {
        e.preventDefault()
        ok(true, 'show event fired')
        done()
      })
      .on('shown.bs.tooltip', function () {
        ok(false, 'shown event fired')
      })
      .bootstrapTooltip('show')
  })

  test('should fire hide event', function (assert) {
    var done = assert.async()

    $('<div title="tooltip title"/>')
      .appendTo('#qunit-fixture')
      .on('shown.bs.tooltip', function () {
        $(this).bootstrapTooltip('hide')
      })
      .on('hide.bs.tooltip', function () {
        ok(true, 'hide event fired')
        done()
      })
      .bootstrapTooltip('show')
  })

  test('should fire hidden event', function (assert) {
    var done = assert.async()

    $('<div title="tooltip title"/>')
      .appendTo('#qunit-fixture')
      .on('shown.bs.tooltip', function () {
        $(this).bootstrapTooltip('hide')
      })
      .on('hidden.bs.tooltip', function () {
        ok(true, 'hidden event fired')
        done()
      })
      .bootstrapTooltip('show')
  })

  test('should not fire hidden event when hide was prevented', function (assert) {
    var done = assert.async()

    $('<div title="tooltip title"/>')
      .appendTo('#qunit-fixture')
      .on('shown.bs.tooltip', function () {
        $(this).bootstrapTooltip('hide')
      })
      .on('hide.bs.tooltip', function (e) {
        e.preventDefault()
        ok(true, 'hide event fired')
        done()
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

  test('should position tip on top if viewport has enough space and placement is "auto top"', function () {
    var styles = '<style>'
        + 'body { padding-top: 100px; }'
        + '#section { height: 300px; border: 1px solid red; padding-top: 50px }'
        + 'div[rel="tooltip"] { width: 150px; border: 1px solid blue; }'
        + '</style>'
    var $styles = $(styles).appendTo('head')

    var $container = $('<div id="section"/>').appendTo('#qunit-fixture')
    var $target = $('<div rel="tooltip" title="tip"/>')
      .appendTo($container)
      .bootstrapTooltip({
        placement: 'auto top',
        viewport: '#section'
      })

    $target.bootstrapTooltip('show')
    ok($('.tooltip').is('.top'), 'top positioned tooltip is dynamically positioned to top')

    $target.bootstrapTooltip('hide')
    equal($('.tooltip').length, 0, 'tooltip removed from dom')

    $styles.remove()
  })

  test('should position tip on bottom if the tip\'s dimension exceeds the viewport area and placement is "auto top"', function () {
    var styles = '<style>'
        + 'body { padding-top: 100px; }'
        + '#section { height: 300px; border: 1px solid red; }'
        + 'div[rel="tooltip"] { width: 150px; border: 1px solid blue; }'
        + '</style>'
    var $styles = $(styles).appendTo('head')

    var $container = $('<div id="section"/>').appendTo('#qunit-fixture')
    var $target = $('<div rel="tooltip" title="tip"/>')
      .appendTo($container)
      .bootstrapTooltip({
        placement: 'auto top',
        viewport: '#section'
      })

    $target.bootstrapTooltip('show')
    ok($('.tooltip').is('.bottom'), 'top positioned tooltip is dynamically positioned to bottom')

    $target.bootstrapTooltip('hide')
    equal($('.tooltip').length, 0, 'tooltip removed from dom')

    $styles.remove()
  })

  test('should display the tip on top whenever scrollable viewport has enough room if the given placement is "auto top"', function () {
    var styles = '<style>'
        + '#scrollable-div { height: 200px; overflow: auto; }'
        + '.tooltip-item { margin: 200px 0 400px; width: 150px; }'
        + '</style>'
    var $styles = $(styles).appendTo('head')

    var $container = $('<div id="scrollable-div"/>').appendTo('#qunit-fixture')
    var $target = $('<div rel="tooltip" title="tip" class="tooltip-item">Tooltip Item</div>')
      .appendTo($container)
      .bootstrapTooltip({
        placement: 'top auto',
        viewport: '#scrollable-div'
      })

    $('#scrollable-div').scrollTop(100)

    $target.bootstrapTooltip('show')
    ok($('.tooltip').is('.fade.top.in'), 'has correct classes applied')

    $target.bootstrapTooltip('hide')
    equal($('.tooltip').length, 0, 'tooltip removed from dom')

    $styles.remove()
  })

  test('should display the tip on bottom whenever scrollable viewport doesn\'t have enough room if the given placement is "auto top"', function () {
    var styles = '<style>'
        + '#scrollable-div { height: 200px; overflow: auto; }'
        + '.tooltip-item { padding: 200px 0 400px; width: 150px; }'
        + '</style>'
    var $styles = $(styles).appendTo('head')

    var $container = $('<div id="scrollable-div"/>').appendTo('#qunit-fixture')
    var $target = $('<div rel="tooltip" title="tip" class="tooltip-item">Tooltip Item</div>')
      .appendTo($container)
      .bootstrapTooltip({
        placement: 'top auto',
        viewport: '#scrollable-div'
      })

    $('#scrollable-div').scrollTop(200)

    $target.bootstrapTooltip('show')
    ok($('.tooltip').is('.fade.bottom.in'), 'has correct classes applied')

    $target.bootstrapTooltip('hide')
    equal($('.tooltip').length, 0, 'tooltip removed from dom')

    $styles.remove()
  })

  test('should display the tip on bottom whenever scrollable viewport has enough room if the given placement is "auto bottom"', function () {
    var styles = '<style>'
        + '#scrollable-div { height: 200px; overflow: auto; }'
        + '.spacer { height: 400px; }'
        + '.spacer:first-child { height: 200px; }'
        + '.tooltip-item { width: 150px; }'
        + '</style>'
    var $styles = $(styles).appendTo('head')

    var $container = $('<div id="scrollable-div"/>').appendTo('#qunit-fixture')
    var $target = $('<div rel="tooltip" title="tip" class="tooltip-item">Tooltip Item</div>')
      .appendTo($container)
      .before('<div class="spacer"/>')
      .after('<div class="spacer"/>')
      .bootstrapTooltip({
        placement: 'bottom auto',
        viewport: '#scrollable-div'
      })

    $('#scrollable-div').scrollTop(200)

    $target.bootstrapTooltip('show')
    ok($('.tooltip').is('.fade.bottom.in'), 'has correct classes applied')

    $target.bootstrapTooltip('hide')
    equal($('.tooltip').length, 0, 'tooltip removed from dom')

    $styles.remove()
  })

  test('should display the tip on top whenever scrollable viewport doesn\'t have enough room if the given placement is "auto bottom"', function () {
    var styles = '<style>'
        + '#scrollable-div { height: 200px; overflow: auto; }'
        + '.tooltip-item { margin-top: 400px; width: 150px; }'
        + '</style>'
    var $styles = $(styles).appendTo('head')

    var $container = $('<div id="scrollable-div"/>').appendTo('#qunit-fixture')
    var $target = $('<div rel="tooltip" title="tip" class="tooltip-item">Tooltip Item</div>')
      .appendTo($container)
      .bootstrapTooltip({
        placement: 'bottom auto',
        viewport: '#scrollable-div'
      })

    $('#scrollable-div').scrollTop(400)

    $target.bootstrapTooltip('show')
    ok($('.tooltip').is('.fade.top.in'), 'has correct classes applied')

    $target.bootstrapTooltip('hide')
    equal($('.tooltip').length, 0, 'tooltip removed from dom')

    $styles.remove()
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

  test('should place tooltip on top of element', function (assert) {
    var done = assert.async()

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
      done()
    }, 0)
  })

  test('should place tooltip inside viewport', function (assert) {
    var done = assert.async()

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
      done()
    }, 0)
  })

  test('should show tooltip if leave event hasn\'t occurred before delay expires', function (assert) {
    var done = assert.async()

    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({ delay: 150 })

    setTimeout(function () {
      ok(!$('.tooltip').is('.fade.in'), '100ms: tooltip is not faded in')
    }, 100)

    setTimeout(function () {
      ok($('.tooltip').is('.fade.in'), '200ms: tooltip is faded in')
      done()
    }, 200)

    $tooltip.trigger('mouseenter')
  })

  test('should not show tooltip if leave event occurs before delay expires', function (assert) {
    var done = assert.async()

    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({ delay: 150 })

    setTimeout(function () {
      ok(!$('.tooltip').is('.fade.in'), '100ms: tooltip not faded in')
      $tooltip.trigger('mouseout')
    }, 100)

    setTimeout(function () {
      ok(!$('.tooltip').is('.fade.in'), '200ms: tooltip not faded in')
      done()
    }, 200)

    $tooltip.trigger('mouseenter')
  })

  test('should not hide tooltip if leave event occurs and enter event occurs within the hide delay', function (assert) {
    var done = assert.async()

    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({ delay: { show: 0, hide: 150 }})

    setTimeout(function () {
      ok($('.tooltip').is('.fade.in'), '1ms: tooltip faded in')
      $tooltip.trigger('mouseout')

      setTimeout(function () {
        ok($('.tooltip').is('.fade.in'), '100ms: tooltip still faded in')
        $tooltip.trigger('mouseenter')
      }, 100)

      setTimeout(function () {
        ok($('.tooltip').is('.fade.in'), '200ms: tooltip still faded in')
        done()
      }, 200)
    }, 0)

    $tooltip.trigger('mouseenter')
  })

  test('should not show tooltip if leave event occurs before delay expires', function (assert) {
    var done = assert.async()

    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({ delay: 150 })

    setTimeout(function () {
      ok(!$('.tooltip').is('.fade.in'), '100ms: tooltip not faded in')
      $tooltip.trigger('mouseout')
    }, 100)

    setTimeout(function () {
      ok(!$('.tooltip').is('.fade.in'), '200ms: tooltip not faded in')
      done()
    }, 200)

    $tooltip.trigger('mouseenter')
  })

  test('should not show tooltip if leave event occurs before delay expires, even if hide delay is 0', function (assert) {
    var done = assert.async()

    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({ delay: { show: 150, hide: 0 }})

    setTimeout(function () {
      ok(!$('.tooltip').is('.fade.in'), '100ms: tooltip not faded in')
      $tooltip.trigger('mouseout')
    }, 100)

    setTimeout(function () {
      ok(!$('.tooltip').is('.fade.in'), '250ms: tooltip not faded in')
      done()
    }, 250)

    $tooltip.trigger('mouseenter')
  })

  test('should wait 200ms before hiding the tooltip', function (assert) {
    var done = assert.async()

    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({ delay: { show: 0, hide: 150 }})

    setTimeout(function () {
      ok($tooltip.data('bs.tooltip').$tip.is('.fade.in'), '1ms: tooltip faded in')

      $tooltip.trigger('mouseout')

      setTimeout(function () {
        ok($tooltip.data('bs.tooltip').$tip.is('.fade.in'), '100ms: tooltip still faded in')
      }, 100)

      setTimeout(function () {
        ok(!$tooltip.data('bs.tooltip').$tip.is('.in'), '200ms: tooltip removed')
        done()
      }, 200)

    }, 0)

    $tooltip.trigger('mouseenter')
  })

  test('should correctly position tooltips on SVG elements', function (assert) {
    if (!window.SVGElement) {
      // Skip IE8 since it doesn't support SVG
      expect(0)
      return
    }

    var done = assert.async()

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
        $circle.bootstrapTooltip('hide')
        equal($('.tooltip').length, 0, 'tooltip removed from dom')
        done()
      })
      .bootstrapTooltip({ container: 'body', placement: 'top', trigger: 'manual' })

    $circle.bootstrapTooltip('show')
  })

  test('should correctly determine auto placement based on container rather than parent', function (assert) {
    var done = assert.async()

    var styles = '<style>'
        + '.tooltip, .tooltip *, .tooltip *:before, .tooltip *:after { box-sizing: border-box; }'
        + '.tooltip { position: absolute; display: block; font-size: 12px; line-height: 1.4; }'
        + '.tooltip .tooltip-inner { max-width: 200px; padding: 3px 8px; font-family: Helvetica; text-align: center; }'
        + '#trigger-parent {'
        + '  position: fixed;'
        + '  top: 100px;'
        + '  right: 17px;'
        + '}'
        + '</style>'
    var $styles = $(styles).appendTo('head')

    $('#qunit-fixture').append('<span id="trigger-parent"><a id="tt-trigger" title="If a_larger_text is written here, it won\'t fit using older broken version of BS">HOVER OVER ME</a></span>')
    var $trigger = $('#tt-trigger')

    $trigger
      .on('shown.bs.tooltip', function () {
        var $tip = $('.tooltip-inner')
        var tipXrightEdge = $tip.offset().left + $tip.width()
        var triggerXleftEdge = $trigger.offset().left
        ok(tipXrightEdge < triggerXleftEdge, 'tooltip with auto left placement, when near the right edge of the viewport, gets left placement')
        $trigger.bootstrapTooltip('hide')
      })
      .on('hidden.bs.tooltip', function () {
        $styles.remove()
        $(this).remove()
        equal($('.tooltip').length, 0, 'tooltip removed from dom')
        done()
      })
      .bootstrapTooltip({
        container: 'body',
        placement: 'auto left',
        trigger: 'manual'
      })

    $trigger.bootstrapTooltip('show')
  })

  test('should not reload the tooltip on subsequent mouseenter events', function () {
    var titleHtml = function () {
      var uid = $.fn.bootstrapTooltip.Constructor.prototype.getUID('tooltip')
      return '<p id="tt-content">' + uid + '</p><p>' + uid + '</p><p>' + uid + '</p>'
    }

    var $tooltip = $('<span id="tt-outer" rel="tooltip" data-trigger="hover" data-placement="top">some text</span>')
      .appendTo('#qunit-fixture')

    $tooltip.bootstrapTooltip({
      html: true,
      animation: false,
      trigger: 'hover',
      delay: { show: 0, hide: 500 },
      container: $tooltip,
      title: titleHtml
    })

    $('#tt-outer').trigger('mouseenter')

    var currentUid = $('#tt-content').text()

    $('#tt-content').trigger('mouseenter')
    equal(currentUid, $('#tt-content').text())
  })

  test('should not reload the tooltip if the mouse leaves and re-enters before hiding', function () {
    var titleHtml = function () {
      var uid = $.fn.bootstrapTooltip.Constructor.prototype.getUID('tooltip')
      return '<p id="tt-content">' + uid + '</p><p>' + uid + '</p><p>' + uid + '</p>'
    }

    var $tooltip = $('<span id="tt-outer" rel="tooltip" data-trigger="hover" data-placement="top">some text</span>')
      .appendTo('#qunit-fixture')

    $tooltip.bootstrapTooltip({
      html: true,
      animation: false,
      trigger: 'hover',
      delay: { show: 0, hide: 500 },
      container: $tooltip,
      title: titleHtml
    })

    var obj = $tooltip.data('bs.tooltip')

    $('#tt-outer').trigger('mouseenter')

    var currentUid = $('#tt-content').text()

    $('#tt-outer').trigger('mouseleave')
    equal(currentUid, $('#tt-content').text())

    ok(obj.hoverState == 'out', 'the tooltip hoverState should be set to "out"')

    $('#tt-content').trigger('mouseenter')
    ok(obj.hoverState == 'in', 'the tooltip hoverState should be set to "in"')

    equal(currentUid, $('#tt-content').text())
  })

  test('should position arrow correctly when tooltip is moved to not appear offscreen', function (assert) {
    var done = assert.async()

    var styles = '<style>'
        + '.tooltip, .tooltip *, .tooltip *:before, .tooltip *:after { box-sizing: border-box; }'
        + '.tooltip { position: absolute; }'
        + '.tooltip-arrow { position: absolute; width: 0; height: 0; }'
        + '.tooltip .tooltip-inner { max-width: 200px; padding: 3px 8px; }'
        + '</style>'
    var $styles = $(styles).appendTo('head')

    $('<a href="#" title="tooltip title" style="position: absolute; bottom: 0; right: 0;">Foobar</a>')
      .appendTo('body')
      .on('shown.bs.tooltip', function () {
        var arrowStyles = $(this).data('bs.tooltip').$tip.find('.tooltip-arrow').attr('style')
        ok(/left/i.test(arrowStyles) && !/top/i.test(arrowStyles), 'arrow positioned correctly')
        $(this).bootstrapTooltip('hide')
      })
      .on('hidden.bs.tooltip', function () {
        $styles.remove()
        $(this).remove()
        equal($('.tooltip').length, 0, 'tooltip removed from dom')
        done()
      })
      .bootstrapTooltip({
        container: 'body',
        placement: 'top',
        trigger: 'manual'
      })
      .bootstrapTooltip('show')
  })

  test('should correctly position tooltips on transformed elements', function (assert) {
    var styleProps = document.documentElement.style
    if (!('transform' in styleProps) && !('webkitTransform' in styleProps) && !('msTransform' in styleProps)) {
      expect(0)
      return
    }

    var done = assert.async()

    var styles = '<style>'
        + '#qunit-fixture { top: 0; left: 0; }'
        + '.tooltip, .tooltip *, .tooltip *:before, .tooltip *:after { box-sizing: border-box; }'
        + '.tooltip { position: absolute; }'
        + '.tooltip .tooltip-inner { width: 24px; height: 24px; font-family: Helvetica; }'
        + '#target { position: absolute; top: 100px; left: 50px; width: 100px; height: 200px; -webkit-transform: rotate(270deg); -ms-transform: rotate(270deg); transform: rotate(270deg); }'
        + '</style>'
    var $styles = $(styles).appendTo('head')

    var $element = $('<div id="target" title="1"/>').appendTo('#qunit-fixture')

    $element
      .on('shown.bs.tooltip', function () {
        var offset = $('.tooltip').offset()
        $styles.remove()
        ok(Math.abs(offset.left - 88) <= 1, 'tooltip has correct horizontal location')
        ok(Math.abs(offset.top - 126) <= 1, 'tooltip has correct vertical location')
        $element.bootstrapTooltip('hide')
        done()
      })
      .bootstrapTooltip({
        container: 'body',
        placement: 'top',
        trigger: 'manual'
      })

    $element.bootstrapTooltip('show')
  })

  test('should throw an error when initializing tooltip on the document object without specifying a delegation selector', function () {
    throws(function () {
      $(document).bootstrapTooltip({ title: 'What am I on?' })
    }, new Error('`selector` option must be specified when initializing tooltip on the window.document object!'))
  })

})
