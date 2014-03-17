$(function () {
  'use strict';

  module('tooltip plugin')

  test('should be defined on jquery object', function () {
    var div = $('<div></div>')
    ok(div.tooltip, 'popover method is defined')
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
    ok(!$.fn.tooltip, 'tooltip was set back to undefined (org value)')
  })

  test('should return element', function () {
    var div = $('<div></div>')
    ok(div.bootstrapTooltip() == div, 'document.body returned')
  })

  test('should expose default settings', function () {
    ok(!!$.fn.bootstrapTooltip.Constructor.DEFAULTS, 'defaults is defined')
  })

  test('should empty title attribute', function () {
    var tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"></a>').bootstrapTooltip()
    ok(tooltip.attr('title') === '', 'title attribute was emptied')
  })

  test('should add data attribute for referencing original title', function () {
    var tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"></a>').bootstrapTooltip()
    equal(tooltip.attr('data-original-title'), 'Another tooltip', 'original title preserved in data attribute')
  })

  test('should add set set aria describedby to the element called on show', function () {
    var tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"></a>').bootstrapTooltip()
      .appendTo('#qunit-fixture')
      .bootstrapTooltip('show')
    ok(tooltip.attr('aria-describedby'), 'has the right attributes')
    var id = $('.tooltip').attr('id')

    ok($('#' + id).length == 1, 'has a unique id')
    ok($('.tooltip').attr('aria-describedby') === tooltip.attr('id'), 'they match!')
    ok(tooltip.attr('aria-describedby') !== undefined, 'has the right attributes')
  })

  test('should remove the aria-describedby attributes on hide', function () {
    var tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"></a>').bootstrapTooltip()
      .appendTo('#qunit-fixture')
      .bootstrapTooltip('show')
    ok(tooltip.attr('aria-describedby'), 'has the right attributes')
    tooltip.bootstrapTooltip('hide')
    ok(!tooltip.attr('aria-describedby'), 'removed the attributes on hide')
  })

  test('should assign a unique id tooltip element', function () {
    $('<a href="#" rel="tooltip" title="Another tooltip"></a>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip('show')
    var id = $('.tooltip').attr('id')

    ok($('#' + id).length == 1 && id.indexOf('tooltip') === 0, 'generated prefixed and unique tooltip id')
  })

  test('should place tooltips relative to placement option', function () {
    $.support.transition = false
    var tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"></a>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({ placement: 'bottom' })
      .bootstrapTooltip('show')

    ok($('.tooltip').is('.fade.bottom.in'), 'has correct classes applied')
    tooltip.bootstrapTooltip('hide')
  })

  test('should allow html entities', function () {
    $.support.transition = false
    var tooltip = $('<a href="#" rel="tooltip" title="<b>@fat</b>"></a>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({ html: true })
      .bootstrapTooltip('show')

    ok($('.tooltip b').length, 'b tag was inserted')
    tooltip.bootstrapTooltip('hide')
    ok(!$('.tooltip').length, 'tooltip removed')
  })

  test('should respect custom classes', function () {
    var tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"></a>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({ template: '<div class="tooltip some-class"><div class="tooltip-arrow"/><div class="tooltip-inner"/></div>' })
      .bootstrapTooltip('show')

    ok($('.tooltip').hasClass('some-class'), 'custom class is present')
    tooltip.bootstrapTooltip('hide')
    ok(!$('.tooltip').length, 'tooltip removed')
  })

  test('should fire show event', function () {
    stop()
    $('<div title="tooltip title"></div>')
      .on('show.bs.tooltip', function () {
        ok(true, 'show was called')
        start()
      })
      .bootstrapTooltip('show')
  })

  test('should fire shown event', function () {
    stop()
    $('<div title="tooltip title"></div>')
      .on('shown.bs.tooltip', function () {
        ok(true, 'shown was called')
        start()
      })
      .bootstrapTooltip('show')
  })

  test('should not fire shown event when default prevented', function () {
    stop()
    $('<div title="tooltip title"></div>')
      .on('show.bs.tooltip', function (e) {
        e.preventDefault()
        ok(true, 'show was called')
        start()
      })
      .on('shown.bs.tooltip', function () {
        ok(false, 'shown was called')
      })
      .bootstrapTooltip('show')
  })

  test('should fire hide event', function () {
    stop()
    $('<div title="tooltip title"></div>')
      .on('shown.bs.tooltip', function () {
        $(this).bootstrapTooltip('hide')
      })
      .on('hide.bs.tooltip', function () {
        ok(true, 'hide was called')
        start()
      })
      .bootstrapTooltip('show')
  })

  test('should fire hidden event', function () {
    stop()
    $('<div title="tooltip title"></div>')
      .on('shown.bs.tooltip', function () {
        $(this).bootstrapTooltip('hide')
      })
      .on('hidden.bs.tooltip', function () {
        ok(true, 'hidden was called')
        start()
      })
      .bootstrapTooltip('show')
  })

  test('should not fire hidden event when default prevented', function () {
    stop()
    $('<div title="tooltip title"></div>')
      .on('shown.bs.tooltip', function () {
        $(this).bootstrapTooltip('hide')
      })
      .on('hide.bs.tooltip', function (e) {
        e.preventDefault()
        ok(true, 'hide was called')
        start()
      })
      .on('hidden.bs.tooltip', function () {
        ok(false, 'hidden was called')
      })
      .bootstrapTooltip('show')
  })

  test('should not show tooltip if leave event occurs before delay expires', function () {
    var tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"></a>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({ delay: 200 })

    stop()

    tooltip.trigger('mouseenter')

    setTimeout(function () {
      ok(!$('.tooltip').is('.fade.in'), 'tooltip is not faded in')
      tooltip.trigger('mouseout')
      setTimeout(function () {
        ok(!$('.tooltip').is('.fade.in'), 'tooltip is not faded in')
        start()
      }, 200)
    }, 100)
  })

  test('should not show tooltip if leave event occurs before delay expires, even if hide delay is 0', function () {
    var tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"></a>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({ delay: { show: 200, hide: 0 }})

    stop()

    tooltip.trigger('mouseenter')

    setTimeout(function () {
      ok(!$('.tooltip').is('.fade.in'), 'tooltip is not faded in')
      tooltip.trigger('mouseout')
      setTimeout(function () {
        ok(!$('.tooltip').is('.fade.in'), 'tooltip is not faded in')
        start()
      }, 200)
    }, 100)
  })

  test('should wait 200 ms before hiding the tooltip', 3, function () {
    var tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"></a>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({ delay: { show: 0, hide: 200 }})

    stop()

    tooltip.trigger('mouseenter')

    setTimeout(function () {
      ok($('.tooltip').is('.fade.in'), 'tooltip is faded in')
      tooltip.trigger('mouseout')
      setTimeout(function () {
        ok($('.tooltip').is('.fade.in'), '100ms:tooltip is still faded in')
        setTimeout(function () {
          ok(!$('.tooltip').is('.in'), 'tooltip removed')
          start()
        }, 150)
      }, 100)
    }, 1)
  })

  test('should not hide tooltip if leave event occurs, then tooltip is show immediately again', function () {
    var tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"></a>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({ delay: { show: 0, hide: 200 }})

    stop()

    tooltip.trigger('mouseenter')

    setTimeout(function () {
      ok($('.tooltip').is('.fade.in'), 'tooltip is faded in')
      tooltip.trigger('mouseout')
      setTimeout(function () {
        ok($('.tooltip').is('.fade.in'), '100ms:tooltip is still faded in')
        tooltip.trigger('mouseenter')
        setTimeout(function () {
          ok($('.tooltip').is('.in'), 'tooltip removed')
          start()
        }, 150)
      }, 100)
    }, 1)
  })

  test('should not show tooltip if leave event occurs before delay expires', function () {
    var tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"></a>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({ delay: 100 })
    stop()
    tooltip.trigger('mouseenter')
    setTimeout(function () {
      ok(!$('.tooltip').is('.fade.in'), 'tooltip is not faded in')
      tooltip.trigger('mouseout')
      setTimeout(function () {
        ok(!$('.tooltip').is('.fade.in'), 'tooltip is not faded in')
        start()
      }, 100)
    }, 50)
  })

  test('should show tooltip if leave event hasn\'t occured before delay expires', function () {
    var tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"></a>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({ delay: 150 })
    stop()
    tooltip.trigger('mouseenter')
    setTimeout(function () {
      ok(!$('.tooltip').is('.fade.in'), 'tooltip is not faded in')
    }, 100)
    setTimeout(function () {
      ok($('.tooltip').is('.fade.in'), 'tooltip has faded in')
      start()
    }, 200)
  })

  test('should destroy tooltip', function () {
    var tooltip = $('<div/>').bootstrapTooltip().on('click.foo', function () {})
    ok(tooltip.data('bs.tooltip'), 'tooltip has data')
    ok($._data(tooltip[0], 'events').mouseover && $._data(tooltip[0], 'events').mouseout, 'tooltip has hover event')
    ok($._data(tooltip[0], 'events').click[0].namespace == 'foo', 'tooltip has extra click.foo event')
    tooltip.bootstrapTooltip('show')
    tooltip.bootstrapTooltip('destroy')
    ok(!tooltip.hasClass('in'), 'tooltip is hidden')
    ok(!$._data(tooltip[0], 'bs.tooltip'), 'tooltip does not have data')
    ok($._data(tooltip[0], 'events').click[0].namespace == 'foo', 'tooltip still has click.foo')
    ok(!$._data(tooltip[0], 'events').mouseover && !$._data(tooltip[0], 'events').mouseout, 'tooltip does not have any events')
  })

  test('should show tooltip with delegate selector on click', function () {
    var div = $('<div><a href="#" rel="tooltip" title="Another tooltip"></a></div>')
    div.appendTo('#qunit-fixture')
                     .bootstrapTooltip({ selector: 'a[rel="tooltip"]', trigger: 'click' })
    div.find('a').trigger('click')
    ok($('.tooltip').is('.fade.in'), 'tooltip is faded in')
  })

  test('should show tooltip when toggle is called', function () {
    $('<a href="#" rel="tooltip" title="tooltip on toggle"></a>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({ trigger: 'manual' })
      .bootstrapTooltip('toggle')
    ok($('.tooltip').is('.fade.in'), 'tooltip should be toggled in')
  })

  test('should hide shown tooltip when toggle is called on tooltip', function () {
    var tooltip = $('<a href="#" rel="tooltip" title="tooltip on toggle">@ResentedHook</a>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({ trigger: 'manual' })
      .bootstrapTooltip('toggle')
    $('.tooltip', '#qunit-fixture').bootstrapTooltip('toggle')
    ok($('.tooltip').not('.fade.in'), 'tooltip should be toggled out')
    tooltip.bootstrapTooltip('hide')
    $('#qunit-fixture').empty()
  })

  test('should place tooltips inside the body', function () {
    var tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"></a>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({ container: 'body' })
      .bootstrapTooltip('show')
    ok($('body > .tooltip').length, 'inside the body')
    ok(!$('#qunit-fixture > .tooltip').length, 'not found in parent')
    tooltip.bootstrapTooltip('hide')
  })

  test('should place tooltip inside window', function () {
    var container = $('<div />').appendTo('body')
        .css({ position: 'absolute', width: 200, height: 200, bottom: 0, left: 0 })
    $('<a href="#" title="Very very very very very very very very long tooltip">Hover me</a>')
      .css({ position: 'absolute', top: 0, left: 0 })
      .appendTo(container)
      .bootstrapTooltip({ placement: 'top', animate: false })
      .bootstrapTooltip('show')

    stop()

    setTimeout(function () {
      ok($('.tooltip').offset().left >= 0)

      start()
      container.remove()
    }, 100)
  })

  test('should place tooltip on top of element', function () {
    var container = $('<div />').appendTo('body')
          .css({ position: 'absolute', bottom: 0, left: 0, textAlign: 'right', width: 300, height: 300 })
    var p = $('<p style="margin-top:200px" />').appendTo(container)
    var tooltiped = $('<a href="#" title="very very very very very very very long tooltip">Hover me</a>')
            .css({ marginTop: 200 })
            .appendTo(p)
            .bootstrapTooltip({ placement: 'top', animate: false })
            .bootstrapTooltip('show')

    stop()

    setTimeout(function () {
      var tooltip = container.find('.tooltip')

      start()
      ok(Math.round(tooltip.offset().top + tooltip.outerHeight()) <= Math.round(tooltiped.offset().top))
      container.remove()
    }, 100)
  })

  test('should add position class before positioning so that position-specific styles are taken into account', function () {
    $('head').append('<style id="test"> .tooltip.right { white-space: nowrap; } .tooltip.right .tooltip-inner { max-width: none; } </style>')

    var container = $('<div />').appendTo('body')
    var target = $('<a href="#" rel="tooltip" title="very very very very very very very very long tooltip in one line"></a>')
          .appendTo(container)
          .bootstrapTooltip({ placement: 'right', viewport: null })
          .bootstrapTooltip('show')
    var tooltip = container.find('.tooltip')

    // this is some dumb hack shit because sub pixels in firefox
    var top = Math.round(target.offset().top + (target[0].offsetHeight / 2) - (tooltip[0].offsetHeight / 2))
    var top2 = Math.round(tooltip.offset().top)
    var topDiff = top - top2
    ok(topDiff <= 1 && topDiff >= -1)
    target.bootstrapTooltip('hide')
    $('head #test').remove()
  })

  test('tooltip title test #1', function () {
    var tooltip = $('<a href="#" rel="tooltip" title="Simple tooltip" style="display: inline-block; position: absolute; top: 0; left: 0;"></a>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({})
      .bootstrapTooltip('show')
    equal($('.tooltip').children('.tooltip-inner').text(), 'Simple tooltip', 'title from title attribute is set')
    tooltip.bootstrapTooltip('hide')
    ok(!$('.tooltip').length, 'tooltip removed')
  })

  test('tooltip title test #2', function () {
    var tooltip = $('<a href="#" rel="tooltip" title="Simple tooltip" style="display: inline-block; position: absolute; top: 0; left: 0;"></a>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        title: 'This is a tooltip with some content'
      })
      .bootstrapTooltip('show')
    equal($('.tooltip').children('.tooltip-inner').text(), 'Simple tooltip', 'title is set from title attribute while prefered over title option')
    tooltip.bootstrapTooltip('hide')
    ok(!$('.tooltip').length, 'tooltip removed')
  })

  test('tooltip title test #3', function () {
    var tooltip = $('<a href="#" rel="tooltip" style="display: inline-block; position: absolute; top: 0; left: 0;"></a>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        title: 'This is a tooltip with some content'
      })
      .bootstrapTooltip('show')
    equal($('.tooltip').children('.tooltip-inner').text(), 'This is a tooltip with some content', 'title from title option is set')
    tooltip.bootstrapTooltip('hide')
    ok(!$('.tooltip').length, 'tooltip removed')
  })

  test('tooltips should be placed dynamically, with the dynamic placement option', function () {
    $.support.transition = false
    var ttContainer = $('<div id="dynamic-tt-test"/>').css({
      height : 400,
      overflow : 'hidden',
      position : 'absolute',
      top : 0,
      left : 0,
      width : 600
    })
    .appendTo('body')

    var topTooltip = $('<div style="display: inline-block; position: absolute; left: 0; top: 0;" rel="tooltip" title="Top tooltip">Top Dynamic Tooltip</div>')
      .appendTo('#dynamic-tt-test')
      .bootstrapTooltip({ placement: 'auto' })
      .bootstrapTooltip('show')

    ok($('.tooltip').is('.bottom'), 'top positioned tooltip is dynamically positioned bottom')

    topTooltip.bootstrapTooltip('hide')

    var rightTooltip = $('<div style="display: inline-block; position: absolute; right: 0;" rel="tooltip" title="Right tooltip">Right Dynamic Tooltip</div>')
      .appendTo('#dynamic-tt-test')
      .bootstrapTooltip({ placement: 'right auto' })
      .bootstrapTooltip('show')

    ok($('.tooltip').is('.left'), 'right positioned tooltip is dynamically positioned left')
    rightTooltip.bootstrapTooltip('hide')

    var leftTooltip = $('<div style="display: inline-block; position: absolute; left: 0;" rel="tooltip" title="Left tooltip">Left Dynamic Tooltip</div>')
      .appendTo('#dynamic-tt-test')
      .bootstrapTooltip({ placement: 'auto left' })
      .bootstrapTooltip('show')

    ok($('.tooltip').is('.right'), 'left positioned tooltip is dynamically positioned right')
    leftTooltip.bootstrapTooltip('hide')

    ttContainer.remove()
  })

  test('should adjust the tip\'s top when up against the top of the viewport', function () {
    $('head').append('<style id="test"> .tooltip .tooltip-inner { width: 200px; height: 200px; max-width: none; } </style>')

    var container = $('<div />').appendTo('body')
    var target = $('<a href="#" rel="tooltip" title="tip" style="position: fixed; top: 0px; left: 0px;"></a>')
          .appendTo(container)
          .bootstrapTooltip({ placement: 'right', viewport: { selector: 'body', padding: 12 }})
          .bootstrapTooltip('show')
    var tooltip = container.find('.tooltip')

    ok(Math.round(tooltip.offset().top) === 12)
    target.bootstrapTooltip('hide')
    $('head #test').remove()
  })

  test('should adjust the tip\'s top when up against the bottom of the viewport', function () {
    $('head').append('<style id="test"> .tooltip .tooltip-inner { width: 200px; height: 200px; max-width: none; } </style>')

    var container = $('<div />').appendTo('body')
    var target = $('<a href="#" rel="tooltip" title="tip" style="position: fixed; bottom: 0px; left: 0px;"></a>')
          .appendTo(container)
          .bootstrapTooltip({ placement: 'right', viewport: { selector: 'body', padding: 12 }})
          .bootstrapTooltip('show')
    var tooltip = container.find('.tooltip')

    ok(Math.round(tooltip.offset().top) === Math.round($(window).height() - 12 - tooltip[0].offsetHeight))
    target.bootstrapTooltip('hide')
    $('head #test').remove()
  })

  test('should adjust the tip\'s left when up against the left of the viewport', function () {
    $('head').append('<style id="test"> .tooltip .tooltip-inner { width: 200px; height: 200px; max-width: none; } </style>')

    var container = $('<div />').appendTo('body')
    var target = $('<a href="#" rel="tooltip" title="tip" style="position: fixed; top: 0px; left: 0px;"></a>')
          .appendTo(container)
          .bootstrapTooltip({ placement: 'bottom', viewport: { selector: 'body', padding: 12 }})
          .bootstrapTooltip('show')
    var tooltip = container.find('.tooltip')

    ok(Math.round(tooltip.offset().left) === 12)
    target.bootstrapTooltip('hide')
    $('head #test').remove()
  })

  test('should adjust the tip\'s left when up against the right of the viewport', function () {
    $('head').append('<style id="test"> .tooltip .tooltip-inner { width: 200px; height: 200px; max-width: none; } </style>')

    var container = $('<div />').appendTo('body')
    var target = $('<a href="#" rel="tooltip" title="tip" style="position: fixed; top: 0px; right: 0px;"></a>')
          .appendTo(container)
          .bootstrapTooltip({ placement: 'bottom', viewport: { selector: 'body', padding: 12 }})
          .bootstrapTooltip('show')
    var tooltip = container.find('.tooltip')

    ok(Math.round(tooltip.offset().left) === Math.round($(window).width() - 12 - tooltip[0].offsetWidth))
    target.bootstrapTooltip('hide')
    $('head #test').remove()
  })

  test('should adjust the tip when up against the right of an arbitrary viewport', function () {
    $('head').append('<style id="test"> .tooltip, .tooltip .tooltip-inner { width: 200px; height: 200px; max-width: none; } </style>')
    $('head').append('<style id="viewport-style"> .container-viewport { position: absolute; top: 50px; left: 60px; width: 300px; height: 300px; } </style>')

    var container = $('<div />', { 'class': 'container-viewport' }).appendTo('body')
    var target = $('<a href="#" rel="tooltip" title="tip" style="position: fixed; top: 50px; left: 350px;"></a>')
          .appendTo(container)
          .bootstrapTooltip({ placement: 'bottom', viewport: '.container-viewport' })
          .bootstrapTooltip('show')
    var tooltip = container.find('.tooltip')

    ok(Math.round(tooltip.offset().left) === Math.round(60 + container.width() - tooltip[0].offsetWidth))
    target.bootstrapTooltip('hide')
    $('head #test').remove()
    $('head #viewport-style').remove()
  })
})
