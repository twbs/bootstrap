$(function () {
  'use strict'

  var Tooltip = typeof window.bootstrap === 'undefined' ? window.Tooltip : window.bootstrap.Tooltip

  QUnit.module('tooltip plugin')

  QUnit.test('should be defined on jquery object', function (assert) {
    assert.expect(1)
    assert.ok($(document.body).tooltip, 'tooltip method is defined')
  })

  QUnit.module('tooltip', {
    beforeEach: function () {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.bootstrapTooltip = $.fn.tooltip.noConflict()
    },
    afterEach: function () {
      $.fn.tooltip = $.fn.bootstrapTooltip
      delete $.fn.bootstrapTooltip
      $('.tooltip').remove()
      $('#qunit-fixture').html('')
    }
  })

  QUnit.test('should provide no conflict', function (assert) {
    assert.expect(1)
    assert.strictEqual(typeof $.fn.tooltip, 'undefined', 'tooltip was set back to undefined (org value)')
  })

  QUnit.test('should throw explicit error on undefined method', function (assert) {
    assert.expect(1)
    var $el = $('<div/>')
    $el.bootstrapTooltip()
    try {
      $el.bootstrapTooltip('noMethod')
    } catch (error) {
      assert.strictEqual(error.message, 'No method named "noMethod"')
    }
  })

  QUnit.test('should return jquery collection containing the element', function (assert) {
    assert.expect(2)
    var $el = $('<div/>')
    var $tooltip = $el.bootstrapTooltip()
    assert.ok($tooltip instanceof $, 'returns jquery collection')
    assert.strictEqual($tooltip[0], $el[0], 'collection contains element')
  })

  QUnit.test('should expose default settings', function (assert) {
    assert.expect(1)
    assert.ok($.fn.bootstrapTooltip.Constructor.Default, 'defaults is defined')
  })

  QUnit.test('should empty title attribute', function (assert) {
    assert.expect(1)
    var $trigger = $('<a href="#" rel="tooltip" title="Another tooltip"/>').bootstrapTooltip()
    assert.strictEqual($trigger.attr('title'), '', 'title attribute was emptied')
  })

  QUnit.test('should add data attribute for referencing original title', function (assert) {
    assert.expect(1)
    var $trigger = $('<a href="#" rel="tooltip" title="Another tooltip"/>').bootstrapTooltip()
    assert.strictEqual($trigger.attr('data-original-title'), 'Another tooltip', 'original title preserved in data attribute')
  })

  QUnit.test('should add aria-describedby to the trigger on show', function (assert) {
    assert.expect(3)
    var $trigger = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .bootstrapTooltip()
      .appendTo('#qunit-fixture')
      .bootstrapTooltip('show')

    var id = $('.tooltip').attr('id')

    assert.strictEqual($('#' + id).length, 1, 'has a unique id')
    assert.strictEqual($('.tooltip').attr('aria-describedby'), $trigger.attr('id'), 'tooltip id and aria-describedby on trigger match')
    assert.ok($trigger[0].hasAttribute('aria-describedby'), 'trigger has aria-describedby')
  })

  QUnit.test('should remove aria-describedby from trigger on hide', function (assert) {
    assert.expect(2)
    var done = assert.async()
    var $trigger = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .bootstrapTooltip()
      .appendTo('#qunit-fixture')

    $trigger
      .one('shown.bs.tooltip', function () {
        assert.ok($trigger[0].hasAttribute('aria-describedby'), 'trigger has aria-describedby')
        $trigger.bootstrapTooltip('hide')
      })
      .one('hidden.bs.tooltip', function () {
        assert.ok(!$trigger[0].hasAttribute('aria-describedby'), 'trigger does not have aria-describedby')
        done()
      })
      .bootstrapTooltip('show')
  })

  QUnit.test('should assign a unique id tooltip element', function (assert) {
    assert.expect(2)
    $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip('show')

    var id = $('.tooltip').attr('id')

    assert.strictEqual($('#' + id).length, 1, 'tooltip has unique id')
    assert.strictEqual(id.indexOf('tooltip'), 0, 'tooltip id has prefix')
  })

  QUnit.test('should place tooltips relative to placement option', function (assert) {
    assert.expect(2)
    var done = assert.async()
    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        placement: 'bottom'
      })

    $tooltip
      .one('shown.bs.tooltip', function () {
        assert.ok($('.tooltip').is('.fade.bs-tooltip-bottom.show'), 'has correct classes applied')
        $tooltip.bootstrapTooltip('hide')
      })
      .one('hidden.bs.tooltip', function () {
        assert.strictEqual(Tooltip._getInstance($tooltip[0]).tip.parentNode, null, 'tooltip removed')
        done()
      })
      .bootstrapTooltip('show')
  })

  QUnit.test('should allow html entities', function (assert) {
    assert.expect(2)
    var done = assert.async()
    var $tooltip = $('<a href="#" rel="tooltip" title="&lt;b&gt;@fat&lt;/b&gt;"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        html: true
      })

    $tooltip
      .one('shown.bs.tooltip', function () {
        assert.notEqual($('.tooltip b').length, 0, 'b tag was inserted')
        $tooltip.bootstrapTooltip('hide')
      })
      .one('hidden.bs.tooltip', function () {
        assert.strictEqual(Tooltip._getInstance($tooltip[0]).tip.parentNode, null, 'tooltip removed')
        done()
      })
      .bootstrapTooltip('show')
  })

  QUnit.test('should allow DOMElement title (html: false)', function (assert) {
    assert.expect(3)
    var done = assert.async()
    var title = document.createTextNode('<3 writing tests')
    var $tooltip = $('<a href="#" rel="tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        title: title
      })

    $tooltip
      .one('shown.bs.tooltip', function () {
        assert.notEqual($('.tooltip').length, 0, 'tooltip inserted')
        assert.strictEqual($('.tooltip').text(), '<3 writing tests', 'title inserted')
        assert.ok(!$.contains($('.tooltip').get(0), title), 'title node copied, not moved')
        done()
      })
      .bootstrapTooltip('show')
  })

  QUnit.test('should allow DOMElement title (html: true)', function (assert) {
    assert.expect(3)
    var done = assert.async()
    var title = document.createTextNode('<3 writing tests')
    var $tooltip = $('<a href="#" rel="tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        html: true,
        title: title
      })

    $tooltip
      .one('shown.bs.tooltip', function () {
        assert.notEqual($('.tooltip').length, 0, 'tooltip inserted')
        assert.strictEqual($('.tooltip').text(), '<3 writing tests', 'title inserted')
        assert.ok($.contains($('.tooltip').get(0), title), 'title node moved, not copied')
        done()
      })
      .bootstrapTooltip('show')
  })

  QUnit.test('should respect custom classes', function (assert) {
    assert.expect(2)
    var done = assert.async()
    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        template: '<div class="tooltip some-class"><div class="tooltip-arrow"/><div class="tooltip-inner"/></div>'
      })

    $tooltip
      .one('shown.bs.tooltip', function () {
        assert.ok($('.tooltip').hasClass('some-class'), 'custom class is present')
        $tooltip.bootstrapTooltip('hide')
      })
      .one('hidden.bs.tooltip', function () {
        assert.strictEqual(Tooltip._getInstance($tooltip[0]).tip.parentNode, null, 'tooltip removed')
        done()
      })
      .bootstrapTooltip('show')
  })

  QUnit.test('should fire show event', function (assert) {
    assert.expect(1)
    var done = assert.async()

    $('<div title="tooltip title"/>')
      .on('show.bs.tooltip', function () {
        assert.ok(true, 'show event fired')
        done()
      })
      .bootstrapTooltip('show')
  })

  QUnit.test('should throw an error when show is called on hidden elements', function (assert) {
    assert.expect(1)
    var done = assert.async()

    try {
      $('<div title="tooltip title" style="display: none"/>').bootstrapTooltip('show')
    } catch (error) {
      assert.strictEqual(error.message, 'Please use show on visible elements')
      done()
    }
  })

  QUnit.test('should fire inserted event', function (assert) {
    assert.expect(2)
    var done = assert.async()

    $('<div title="tooltip title"/>')
      .appendTo('#qunit-fixture')
      .on('inserted.bs.tooltip', function () {
        assert.notEqual($('.tooltip').length, 0, 'tooltip was inserted')
        assert.ok(true, 'inserted event fired')
        done()
      })
      .bootstrapTooltip('show')
  })

  QUnit.test('should fire shown event', function (assert) {
    assert.expect(1)
    var done = assert.async()

    $('<div title="tooltip title"></div>')
      .appendTo('#qunit-fixture')
      .on('shown.bs.tooltip', function () {
        assert.ok(true, 'shown was called')
        done()
      })
      .bootstrapTooltip('show')
  })

  QUnit.test('should not fire shown event when show was prevented', function (assert) {
    assert.expect(1)
    var done = assert.async()

    $('<div title="tooltip title"/>')
      .on('show.bs.tooltip', function (e) {
        e.preventDefault()
        assert.ok(true, 'show event fired')
        done()
      })
      .on('shown.bs.tooltip', function () {
        assert.ok(false, 'shown event fired')
      })
      .bootstrapTooltip('show')
  })

  QUnit.test('should fire hide event', function (assert) {
    assert.expect(1)
    var done = assert.async()

    $('<div title="tooltip title"/>')
      .appendTo('#qunit-fixture')
      .on('shown.bs.tooltip', function () {
        $(this).bootstrapTooltip('hide')
      })
      .on('hide.bs.tooltip', function () {
        assert.ok(true, 'hide event fired')
        done()
      })
      .bootstrapTooltip('show')
  })

  QUnit.test('should fire hidden event', function (assert) {
    assert.expect(1)
    var done = assert.async()

    $('<div title="tooltip title"/>')
      .appendTo('#qunit-fixture')
      .on('shown.bs.tooltip', function () {
        $(this).bootstrapTooltip('hide')
      })
      .on('hidden.bs.tooltip', function () {
        assert.ok(true, 'hidden event fired')
        done()
      })
      .bootstrapTooltip('show')
  })

  QUnit.test('should not fire hidden event when hide was prevented', function (assert) {
    assert.expect(1)
    var done = assert.async()

    $('<div title="tooltip title"/>')
      .appendTo('#qunit-fixture')
      .on('shown.bs.tooltip', function () {
        $(this).bootstrapTooltip('hide')
      })
      .on('hide.bs.tooltip', function (e) {
        e.preventDefault()
        assert.ok(true, 'hide event fired')
        done()
      })
      .on('hidden.bs.tooltip', function () {
        assert.ok(false, 'hidden event fired')
      })
      .bootstrapTooltip('show')
  })

  QUnit.test('should destroy tooltip', function (assert) {
    assert.expect(3)
    var $tooltip = $('<div/>')
      .bootstrapTooltip()
      .on('click.foo', function () {}) // eslint-disable-line no-empty-function

    assert.ok(Tooltip._getInstance($tooltip[0]), 'tooltip has data')

    $tooltip.bootstrapTooltip('show')
    $tooltip.bootstrapTooltip('dispose')

    assert.ok(!$tooltip.hasClass('show'), 'tooltip is hidden')
    assert.ok(!Tooltip._getInstance($tooltip[0]), 'tooltip does not have data')
  })

  // QUnit.test('should show tooltip with delegate selector on click', function (assert) {
  //   assert.expect(2)
  //   var $div = $('<div><a href="#" rel="tooltip" title="Another tooltip"/></div>')
  //     .appendTo('#qunit-fixture')
  //     .bootstrapTooltip({
  //       selector: 'a[rel="tooltip"]',
  //       trigger: 'click'
  //     })

  //   $div.find('a').trigger('click')
  //   assert.ok($('.tooltip').is('.fade.in'), 'tooltip is faded in')

  //   $div.find('a').trigger('click')
  //   assert.strictEqual($div.data('bs.tooltip').tip.parentNode, null, 'tooltip removed')
  // })

  QUnit.test('should show tooltip when toggle is called', function (assert) {
    assert.expect(1)
    $('<a href="#" rel="tooltip" title="tooltip on toggle"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        trigger: 'manual'
      })
      .bootstrapTooltip('toggle')

    assert.ok($('.tooltip').is('.fade.show'), 'tooltip is faded active')
  })

  QUnit.test('should hide previously shown tooltip when toggle is called on tooltip', function (assert) {
    assert.expect(1)
    $('<a href="#" rel="tooltip" title="tooltip on toggle">@ResentedHook</a>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        trigger: 'manual'
      })
      .bootstrapTooltip('show')

    $('.tooltip').bootstrapTooltip('toggle')
    assert.ok($('.tooltip').not('.fade.show'), 'tooltip was faded out')
  })

  QUnit.test('should place tooltips inside body when container is body', function (assert) {
    assert.expect(3)
    var done = assert.async()
    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        container: 'body'
      })

    $tooltip
      .one('shown.bs.tooltip', function () {
        assert.notEqual($('body > .tooltip').length, 0, 'tooltip is direct descendant of body')
        assert.strictEqual($('#qunit-fixture > .tooltip').length, 0, 'tooltip is not in parent')
        $tooltip.bootstrapTooltip('hide')
      })
      .one('hidden.bs.tooltip', function () {
        assert.strictEqual($('body > .tooltip').length, 0, 'tooltip was removed from dom')
        done()
      })
      .bootstrapTooltip('show')
  })

  QUnit.test('should place tooltips inside a specific container when container is an element', function (assert) {
    assert.expect(3)
    var done = assert.async()
    var $container = $('<div></div>').appendTo('#qunit-fixture')
    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        container: $container[0]
      })

    $tooltip
      .one('shown.bs.tooltip', function () {
        assert.strictEqual($container.find('.tooltip').length, 1)
        assert.strictEqual($('#qunit-fixture > .tooltip').length, 0, 'tooltip is not in parent')
        $tooltip.bootstrapTooltip('hide')
      })
      .one('hidden.bs.tooltip', function () {
        assert.strictEqual($container.find('.tooltip').length, 0, 'tooltip was removed from dom')
        done()
      })
      .bootstrapTooltip('show')
  })

  QUnit.test('should place tooltips inside a specific container when container is a selector', function (assert) {
    assert.expect(3)
    var done = assert.async()
    var $container = $('<div id="container"></div>').appendTo('#qunit-fixture')
    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        container: '#container'
      })

    $tooltip
      .one('shown.bs.tooltip', function () {
        assert.strictEqual($container.find('.tooltip').length, 1)
        assert.strictEqual($('#qunit-fixture > .tooltip').length, 0, 'tooltip is not in parent')
        $tooltip.bootstrapTooltip('hide')
      })
      .one('hidden.bs.tooltip', function () {
        assert.strictEqual($container.find('.tooltip').length, 0, 'tooltip was removed from dom')
        done()
      })
      .bootstrapTooltip('show')
  })

  QUnit.test('should add position class before positioning so that position-specific styles are taken into account', function (assert) {
    assert.expect(2)
    var done = assert.async()
    var styles = '<style>' +
      '.bs-tooltip-right { white-space: nowrap; }' +
      '.bs-tooltip-right .tooltip-inner { max-width: none; }' +
      '</style>'
    var $styles = $(styles).appendTo('head')

    var $container = $('<div/>').appendTo('#qunit-fixture')
    $('<a href="#" rel="tooltip" title="very very very very very very very very long tooltip in one line"/>')
      .appendTo($container)
      .bootstrapTooltip({
        placement: 'right',
        trigger: 'manual'
      })
      .on('inserted.bs.tooltip', function () {
        var $tooltip = $(Tooltip._getInstance(this).tip)
        assert.ok($tooltip.hasClass('bs-tooltip-right'))
        assert.ok(typeof $tooltip.attr('style') === 'undefined')
        $styles.remove()
        done()
      })
      .bootstrapTooltip('show')
  })

  QUnit.test('should use title attribute for tooltip text', function (assert) {
    assert.expect(2)
    var done = assert.async()
    var $tooltip = $('<a href="#" rel="tooltip" title="Simple tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip()

    $tooltip
      .one('shown.bs.tooltip', function () {
        assert.strictEqual($('.tooltip').children('.tooltip-inner').text(), 'Simple tooltip', 'title from title attribute is set')
        $tooltip.bootstrapTooltip('hide')
      })
      .one('hidden.bs.tooltip', function () {
        assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')
        done()
      })
      .bootstrapTooltip('show')
  })

  QUnit.test('should prefer title attribute over title option', function (assert) {
    assert.expect(2)
    var done = assert.async()
    var $tooltip = $('<a href="#" rel="tooltip" title="Simple tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        title: 'This is a tooltip with some content'
      })

    $tooltip
      .one('shown.bs.tooltip', function () {
        assert.strictEqual($('.tooltip').children('.tooltip-inner').text(), 'Simple tooltip', 'title is set from title attribute while preferred over title option')
        $tooltip.bootstrapTooltip('hide')
      })
      .one('hidden.bs.tooltip', function () {
        assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')
        done()
      })
      .bootstrapTooltip('show')
  })

  QUnit.test('should use title option', function (assert) {
    assert.expect(2)
    var done = assert.async()
    var $tooltip = $('<a href="#" rel="tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        title: 'This is a tooltip with some content'
      })

    $tooltip
      .one('shown.bs.tooltip', function () {
        assert.strictEqual($('.tooltip').children('.tooltip-inner').text(), 'This is a tooltip with some content', 'title from title option is set')
        $tooltip.bootstrapTooltip('hide')
      })
      .one('hidden.bs.tooltip', function () {
        assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')
        done()
      })
      .bootstrapTooltip('show')
  })

  QUnit.test('should not error when trying to show an top-placed tooltip that has been removed from the dom', function (assert) {
    assert.expect(1)
    var passed = true
    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .one('show.bs.tooltip', function () {
        $(this).remove()
      })
      .bootstrapTooltip({
        placement: 'top'
      })

    try {
      $tooltip.bootstrapTooltip('show')
    } catch (error) {
      passed = false
    }

    assert.ok(passed, '.tooltip(\'show\') should not throw an error if element no longer is in dom')
  })

  QUnit.test('should show tooltip if leave event hasn\'t occurred before delay expires', function (assert) {
    assert.expect(2)
    var done = assert.async()

    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        delay: 150
      })

    setTimeout(function () {
      assert.ok(!$('.tooltip').is('.fade.show'), '100ms: tooltip is not faded active')
    }, 100)

    setTimeout(function () {
      assert.ok($('.tooltip').is('.fade.show'), '200ms: tooltip is faded active')
      done()
    }, 200)

    $tooltip[0].dispatchEvent(new Event('mouseover'))
  })

  QUnit.test('should not show tooltip if leave event occurs before delay expires', function (assert) {
    assert.expect(2)
    var done = assert.async()

    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        delay: 150
      })

    setTimeout(function () {
      assert.ok(!$('.tooltip').is('.fade.show'), '100ms: tooltip not faded active')
      $tooltip[0].dispatchEvent(new Event('mouseout'))
    }, 100)

    setTimeout(function () {
      assert.ok(!$('.tooltip').is('.fade.show'), '200ms: tooltip not faded active')
      done()
    }, 200)

    $tooltip[0].dispatchEvent(new Event('mouseover'))
  })

  QUnit.test('should not hide tooltip if leave event occurs and enter event occurs within the hide delay', function (assert) {
    assert.expect(3)
    var done = assert.async()

    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        delay: {
          show: 0,
          hide: 150
        }
      })

    setTimeout(function () {
      assert.ok($('.tooltip').is('.fade.show'), '1ms: tooltip faded active')
      $tooltip[0].dispatchEvent(new Event('mouseout'))

      setTimeout(function () {
        assert.ok($('.tooltip').is('.fade.show'), '100ms: tooltip still faded active')
        $tooltip[0].dispatchEvent(new Event('mouseover'))
      }, 100)

      setTimeout(function () {
        assert.ok($('.tooltip').is('.fade.show'), '200ms: tooltip still faded active')
        done()
      }, 200)
    }, 0)

    $tooltip[0].dispatchEvent(new Event('mouseover'))
  })

  QUnit.test('should not show tooltip if leave event occurs before delay expires', function (assert) {
    assert.expect(2)
    var done = assert.async()

    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        delay: 150
      })

    setTimeout(function () {
      assert.ok(!$('.tooltip').is('.fade.show'), '100ms: tooltip not faded active')
      $tooltip[0].dispatchEvent(new Event('mouseout'))
    }, 100)

    setTimeout(function () {
      assert.ok(!$('.tooltip').is('.fade.show'), '200ms: tooltip not faded active')
      done()
    }, 200)

    $tooltip[0].dispatchEvent(new Event('mouseover'))
  })

  QUnit.test('should not show tooltip if leave event occurs before delay expires, even if hide delay is 0', function (assert) {
    assert.expect(2)
    var done = assert.async()

    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        delay: {
          show: 150,
          hide: 0
        }
      })

    setTimeout(function () {
      assert.ok(!$('.tooltip').is('.fade.show'), '100ms: tooltip not faded active')
      $tooltip[0].dispatchEvent(new Event('mouseout'))
    }, 100)

    setTimeout(function () {
      assert.ok(!$('.tooltip').is('.fade.show'), '250ms: tooltip not faded active')
      done()
    }, 250)

    $tooltip[0].dispatchEvent(new Event('mouseover'))
  })

  QUnit.test('should wait 200ms before hiding the tooltip', function (assert) {
    assert.expect(3)
    var done = assert.async()

    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        delay: {
          show: 0,
          hide: 150
        }
      })

    setTimeout(function () {
      assert.ok($(Tooltip._getInstance($tooltip[0]).tip).is('.fade.show'), '1ms: tooltip faded active')

      $tooltip[0].dispatchEvent(new Event('mouseout'))

      setTimeout(function () {
        assert.ok($(Tooltip._getInstance($tooltip[0]).tip).is('.fade.show'), '100ms: tooltip still faded active')
      }, 100)

      setTimeout(function () {
        assert.ok(!$(Tooltip._getInstance($tooltip[0]).tip).is('.show'), '200ms: tooltip removed')
        done()
      }, 200)
    }, 0)

    $tooltip[0].dispatchEvent(new Event('mouseover'))
  })

  QUnit.test('should not reload the tooltip on subsequent mouseenter events', function (assert) {
    assert.expect(1)
    var fakeId = 1
    var titleHtml = function () {
      var uid = fakeId
      fakeId++
      return '<p id="tt-content">' + uid + '</p><p>' + uid + '</p><p>' + uid + '</p>'
    }

    var $tooltip = $('<span id="tt-outer" rel="tooltip" data-trigger="hover" data-placement="top">some text</span>')
      .appendTo('#qunit-fixture')

    $tooltip.bootstrapTooltip({
      html: true,
      animation: false,
      trigger: 'hover',
      delay: {
        show: 0,
        hide: 500
      },
      container: $tooltip,
      title: titleHtml
    })

    $('#tt-outer')[0].dispatchEvent(new Event('mouseover'))

    var currentUid = $('#tt-content').text()

    $('#tt-outer')[0].dispatchEvent(new Event('mouseover'))
    assert.strictEqual(currentUid, $('#tt-content').text())
  })

  QUnit.test('should not reload the tooltip if the mouse leaves and re-enters before hiding', function (assert) {
    assert.expect(4)

    var fakeId = 1
    var titleHtml = function () {
      var uid = 'tooltip' + fakeId
      fakeId++
      return '<p id="tt-content">' + uid + '</p><p>' + uid + '</p><p>' + uid + '</p>'
    }

    var $tooltip = $('<span id="tt-outer" rel="tooltip" data-trigger="hover" data-placement="top">some text</span>')
      .appendTo('#qunit-fixture')

    $tooltip.bootstrapTooltip({
      html: true,
      animation: false,
      trigger: 'hover',
      delay: {
        show: 0,
        hide: 500
      },
      title: titleHtml
    })

    var obj = Tooltip._getInstance($tooltip[0])

    $('#tt-outer')[0].dispatchEvent(new Event('mouseover'))

    var currentUid = $('#tt-content').text()

    $('#tt-outer')[0].dispatchEvent(new Event('mouseout'))
    assert.strictEqual(currentUid, $('#tt-content').text())

    assert.ok(obj._hoverState === 'out', 'the tooltip hoverState should be set to "out"')

    $('#tt-outer')[0].dispatchEvent(new Event('mouseover'))
    assert.ok(obj._hoverState === 'show', 'the tooltip hoverState should be set to "show"')

    assert.strictEqual(currentUid, $('#tt-content').text())
  })

  QUnit.test('should do nothing when an attempt is made to hide an uninitialized tooltip', function (assert) {
    assert.expect(1)

    var $tooltip = $('<span data-toggle="tooltip" title="some tip">some text</span>')
      .appendTo('#qunit-fixture')
      .on('hidden.bs.tooltip shown.bs.tooltip', function () {
        assert.ok(false, 'should not fire any tooltip events')
      })
      .bootstrapTooltip('hide')
    assert.ok(Tooltip._getInstance($tooltip[0]) === null, 'should not initialize the tooltip')
  })

  QUnit.test('should not remove tooltip if multiple triggers are set and one is still active', function (assert) {
    assert.expect(41)
    var $el = $('<button>Trigger</button>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        trigger: 'click hover focus',
        animation: false
      })

    var tooltip = Tooltip._getInstance($el[0])
    var $tooltip = $(tooltip.getTipElement())

    function showingTooltip() {
      return $tooltip.hasClass('show') || tooltip._hoverState === 'show'
    }

    var tests = [
      ['mouseover', 'mouseout'],

      ['focusin', 'focusout'],

      ['click', 'click'],

      ['mouseover', 'focusin', 'focusout', 'mouseout'],
      ['mouseover', 'focusin', 'mouseout', 'focusout'],

      ['focusin', 'mouseover', 'mouseout', 'focusout'],
      ['focusin', 'mouseover', 'focusout', 'mouseout'],

      ['click', 'focusin', 'mouseover', 'focusout', 'mouseout', 'click'],
      ['mouseover', 'click', 'focusin', 'focusout', 'mouseout', 'click'],
      ['mouseover', 'focusin', 'click', 'click', 'mouseout', 'focusout']
    ]

    assert.ok(!showingTooltip())

    $.each(tests, function (idx, triggers) {
      for (var i = 0, len = triggers.length; i < len; i++) {
        $el[0].dispatchEvent(new Event(triggers[i]))
        assert.equal(i < len - 1, showingTooltip())
      }
    })
  })

  QUnit.test('should show on first trigger after hide', function (assert) {
    assert.expect(3)
    var $el = $('<a href="#" rel="tooltip" title="Test tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        trigger: 'click hover focus',
        animation: false
      })

    var tooltip = Tooltip._getInstance($el[0])
    var $tooltip = $(tooltip.getTipElement())

    function showingTooltip() {
      return $tooltip.hasClass('show') || tooltip._hoverState === 'show'
    }

    $el[0].click()
    assert.ok(showingTooltip(), 'tooltip is faded in')

    $el.bootstrapTooltip('hide')
    assert.ok(!showingTooltip(), 'tooltip was faded out')

    $el[0].click()
    assert.ok(showingTooltip(), 'tooltip is faded in again')
  })

  QUnit.test('should hide tooltip when their containing modal is closed', function (assert) {
    assert.expect(1)
    var done = assert.async()
    var templateHTML = '<div id="modal-test" class="modal">' +
                          '<div class="modal-dialog" role="document">' +
                            '<div class="modal-content">' +
                              '<div class="modal-body">' +
                                '<a id="tooltipTest" href="#" data-toggle="tooltip" title="Some tooltip text!">Tooltip</a>' +
                              '</div>' +
                            '</div>' +
                          '</div>' +
                        '</div>'

    $(templateHTML).appendTo('#qunit-fixture')
    $('#tooltipTest')
      .bootstrapTooltip({
        trigger: 'manuel'
      })
      .on('shown.bs.tooltip', function () {
        $('#modal-test').modal('hide')
      })
      .on('hide.bs.tooltip', function () {
        assert.ok(true, 'tooltip hide')
        done()
      })

    $('#modal-test')
      .on('shown.bs.modal', function () {
        $('#tooltipTest').bootstrapTooltip('show')
      })
      .modal('show')
  })

  QUnit.test('should allow to close modal if the tooltip element is detached', function (assert) {
    assert.expect(1)
    var done = assert.async()
    var templateHTML = [
      '<div id="modal-test" class="modal">',
      '  <div class="modal-dialog" role="document">',
      '    <div class="modal-content">',
      '      <div class="modal-body">',
      '        <a id="tooltipTest" href="#" data-toggle="tooltip" title="Some tooltip text!">Tooltip</a>',
      '      </div>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('')

    $(templateHTML).appendTo('#qunit-fixture')
    var $tooltip = $('#tooltipTest')
    var $modal = $('#modal-test')

    $tooltip.on('shown.bs.tooltip', function () {
      $tooltip.detach()
      $tooltip.bootstrapTooltip('dispose')
      $modal.modal('hide')
    })

    $modal.on('shown.bs.modal', function () {
      $tooltip.bootstrapTooltip({
        trigger: 'manuel'
      })
        .bootstrapTooltip('show')
    })
      .on('hidden.bs.modal', function () {
        assert.ok(true, 'modal hidden')
        done()
      })
      .modal('show')
  })

  QUnit.test('should reset tip classes when hidden event triggered', function (assert) {
    assert.expect(2)
    var done = assert.async()
    var $el = $('<a href="#" rel="tooltip" title="Test tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip('show')
      .on('hidden.bs.tooltip', function () {
        var tooltip = Tooltip._getInstance($el[0])
        var $tooltip = $(tooltip.getTipElement())
        assert.ok($tooltip.hasClass('tooltip'))
        assert.ok($tooltip.hasClass('fade'))
        done()
      })

    $el.bootstrapTooltip('hide')
  })

  QUnit.test('should convert number in title to string', function (assert) {
    assert.expect(1)
    var done = assert.async()
    var $el = $('<a href="#" rel="tooltip" title="7"/>')
      .appendTo('#qunit-fixture')
      .on('shown.bs.tooltip', function () {
        var tooltip = Tooltip._getInstance($el[0])
        var $tooltip = $(tooltip.getTipElement())
        assert.strictEqual($tooltip.children().text(), '7')
        done()
      })

    $el.bootstrapTooltip('show')
  })

  QUnit.test('tooltip should be shown right away after the call of disable/enable', function (assert) {
    assert.expect(2)
    var done = assert.async()

    var $trigger = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip()
      .on('shown.bs.tooltip', function () {
        assert.strictEqual($('.tooltip').hasClass('show'), true)
        done()
      })

    $trigger.bootstrapTooltip('disable')
    $trigger[0].click()
    setTimeout(function () {
      assert.strictEqual($('.tooltip').length === 0, true)
      $trigger.bootstrapTooltip('enable')
      $trigger[0].click()
    }, 200)
  })

  QUnit.test('should call Popper.js to update', function (assert) {
    assert.expect(2)

    var $tooltip = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip()

    var tooltip = Tooltip._getInstance($tooltip[0])
    tooltip.show()
    assert.ok(tooltip._popper)

    var spyPopper = sinon.spy(tooltip._popper, 'scheduleUpdate')
    tooltip.update()
    assert.ok(spyPopper.called)
  })

  QUnit.test('should not call Popper.js to update', function (assert) {
    assert.expect(1)

    var $tooltip = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip()

    var tooltip = Tooltip._getInstance($tooltip[0])
    tooltip.update()

    assert.ok(tooltip._popper === null)
  })

  QUnit.test('should use Popper.js to get the tip on placement change', function (assert) {
    assert.expect(1)

    var $tooltip = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip()

    var $tipTest = $('<div class="bs-tooltip" />')
      .appendTo('#qunit-fixture')

    var tooltip = Tooltip._getInstance($tooltip[0])
    tooltip.tip = null

    tooltip._handlePopperPlacementChange({
      instance: {
        popper: $tipTest[0]
      },
      placement: 'auto'
    })

    assert.ok(tooltip.tip === $tipTest[0])
  })

  QUnit.test('should toggle enabled', function (assert) {
    assert.expect(3)

    var $tooltip = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip()

    var tooltip = Tooltip._getInstance($tooltip[0])

    assert.strictEqual(tooltip._isEnabled, true)

    tooltip.toggleEnabled()

    assert.strictEqual(tooltip._isEnabled, false)

    tooltip.toggleEnabled()

    assert.strictEqual(tooltip._isEnabled, true)
  })

  QUnit.test('should create offset modifier correctly when offset option is a function', function (assert) {
    assert.expect(2)

    var getOffset = function (offsets) {
      return offsets
    }

    var $trigger = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        offset: getOffset
      })

    var tooltip = Tooltip._getInstance($trigger[0])
    var offset = tooltip._getOffset()

    assert.ok(typeof offset.offset === 'undefined')
    assert.ok(typeof offset.fn === 'function')
  })

  QUnit.test('should create offset modifier correctly when offset option is not a function', function (assert) {
    assert.expect(2)

    var myOffset = 42
    var $trigger = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        offset: myOffset
      })

    var tooltip = Tooltip._getInstance($trigger[0])
    var offset = tooltip._getOffset()

    assert.strictEqual(offset.offset, myOffset)
    assert.ok(typeof offset.fn === 'undefined')
  })

  QUnit.test('should disable sanitizer', function (assert) {
    assert.expect(1)

    var $trigger = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        sanitize: false
      })

    var tooltip = Tooltip._getInstance($trigger[0])
    assert.strictEqual(tooltip.config.sanitize, false)
  })

  QUnit.test('should sanitize template by removing disallowed tags', function (assert) {
    assert.expect(1)

    var $trigger = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        template: [
          '<div>',
          '  <script>console.log("oups script inserted")</script>',
          '  <span>Some content</span>',
          '</div>'
        ].join('')
      })

    var tooltip = Tooltip._getInstance($trigger[0])
    assert.strictEqual(tooltip.config.template.indexOf('script'), -1)
  })

  QUnit.test('should sanitize template by removing disallowed attributes', function (assert) {
    assert.expect(1)

    var $trigger = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        template: [
          '<div>',
          '  <img src="x" onError="alert(\'test\')">Some content</img>',
          '</div>'
        ].join('')
      })

    var tooltip = Tooltip._getInstance($trigger[0])
    assert.strictEqual(tooltip.config.template.indexOf('onError'), -1)
  })

  QUnit.test('should allow custom sanitization rules', function (assert) {
    assert.expect(2)

    var $trigger = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        template: [
          '<a href="javascript:alert(7)">Click me</a>',
          '<span>Some content</span>'
        ].join(''),
        whiteList: {
          span: null
        }
      })

    var tooltip = Tooltip._getInstance($trigger[0])

    assert.strictEqual(tooltip.config.template.indexOf('<a'), -1)
    assert.ok(tooltip.config.template.indexOf('span') !== -1)
  })

  QUnit.test('should allow passing a custom function for sanitization', function (assert) {
    assert.expect(1)

    var $trigger = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        template: [
          '<span>Some content</span>'
        ].join(''),
        sanitizeFn: function (input) {
          return input
        }
      })

    var tooltip = Tooltip._getInstance($trigger[0])

    assert.ok(tooltip.config.template.indexOf('span') !== -1)
  })

  QUnit.test('should allow passing aria attributes', function (assert) {
    assert.expect(1)

    var $trigger = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        template: [
          '<span aria-pressed="true">Some content</span>'
        ].join('')
      })

    var tooltip = Tooltip._getInstance($trigger[0])

    assert.ok(tooltip.config.template.indexOf('aria-pressed') !== -1)
  })

  QUnit.test('should not sanitize element content', function (assert) {
    assert.expect(1)

    var $element = $('<div />').appendTo('#qunit-fixture')
    var content = '<script>var test = 1;</script>'

    var $trigger = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        template: [
          '<span aria-pressed="true">Some content</span>'
        ].join(''),
        html: true,
        sanitize: false
      })

    var tooltip = Tooltip._getInstance($trigger[0])
    tooltip.setElementContent($element[0], content)

    assert.strictEqual($element[0].innerHTML, content)
  })

  QUnit.test('should not take into account sanitize in data attributes', function (assert) {
    assert.expect(1)

    var $trigger = $('<a href="#" rel="tooltip" data-sanitize="false" data-trigger="click" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        template: [
          '<span aria-pressed="true">Some content</span>'
        ].join('')
      })

    var tooltip = Tooltip._getInstance($trigger[0])

    assert.strictEqual(tooltip.config.sanitize, true)
  })

  QUnit.test('should return the version', function (assert) {
    assert.expect(1)
    assert.strictEqual(typeof Tooltip.VERSION, 'string')
  })
})
