$(function () {
  'use strict'

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
<<<<<<< HEAD
      $('.tooltip').remove()
      $('#qunit-fixture').html('')
||||||| merged common ancestors
=======
      $('#qunit-fixture').html('')
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc
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
    } catch (err) {
      assert.strictEqual(err.message, 'No method named "noMethod"')
    }
  })

  QUnit.test('should return jquery collection containing the element', function (assert) {
    assert.expect(2)
    var $el = $('<div/>').appendTo('#qunit-fixture')
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
    var $trigger = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip()

    assert.strictEqual($trigger.attr('title'), '', 'title attribute was emptied')
  })

  QUnit.test('should add data attribute for referencing original title', function (assert) {
    assert.expect(1)
    var $trigger = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip()

    assert.strictEqual($trigger.attr('data-original-title'), 'Another tooltip', 'original title preserved in data attribute')
  })

  QUnit.test('should add aria-describedby to the trigger on show', function (assert) {
    assert.expect(3)
    var done = assert.async()

    var $trigger = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')

    $trigger
      .bootstrapTooltip()
      .on('shown.bs.tooltip', function () {
        var id = $('.tooltip').attr('id')

        assert.strictEqual($('#' + id).length, 1, 'has a unique id')
        assert.strictEqual($('.tooltip').attr('aria-describedby'), $trigger.attr('id'), 'tooltip id and aria-describedby on trigger match')
        assert.ok($trigger[0].hasAttribute('aria-describedby'), 'trigger has aria-describedby')
        done()
      })
      .bootstrapTooltip('show')
  })

  QUnit.test('should remove aria-describedby from trigger on hide', function (assert) {
    assert.expect(2)
<<<<<<< HEAD
    var done = assert.async()
||||||| merged common ancestors
=======
    var done = assert.async()

>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc
    var $trigger = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .bootstrapTooltip()
      .appendTo('#qunit-fixture')

<<<<<<< HEAD
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
||||||| merged common ancestors
    $trigger.bootstrapTooltip('show')
    assert.ok($trigger[0].hasAttribute('aria-describedby'), 'trigger has aria-describedby')

    $trigger.bootstrapTooltip('hide')
    assert.ok(!$trigger[0].hasAttribute('aria-describedby'), 'trigger does not have aria-describedby')
=======
    $trigger.one('shown.bs.tooltip', function () {
      assert.ok($trigger[0].hasAttribute('aria-describedby'), 'trigger has aria-describedby')
      $trigger.bootstrapTooltip('hide')
    })
    .one('hidden.bs.tooltip', function () {
      assert.ok(!$trigger[0].hasAttribute('aria-describedby'), 'trigger does not have aria-describedby')
      done()
    })
    .bootstrapTooltip('show')
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc
  })

  QUnit.test('should assign a unique id tooltip element', function (assert) {
    assert.expect(2)
    var done = assert.async()

    $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .on('shown.bs.tooltip', function () {
        var id = $('.tooltip').attr('id')

        assert.strictEqual($('#' + id).length, 1, 'tooltip has unique id')
        assert.strictEqual(id.indexOf('tooltip'), 0, 'tooltip id has prefix')
        done()
      })
      .bootstrapTooltip('show')
  })

  QUnit.test('should place tooltips relative to placement option', function (assert) {
    assert.expect(2)
<<<<<<< HEAD
    var done = assert.async()
||||||| merged common ancestors
=======
    var done = assert.async()

>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc
    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
<<<<<<< HEAD
      .bootstrapTooltip({
        placement: 'bottom'
      })
||||||| merged common ancestors
      .bootstrapTooltip({ placement: 'bottom' })
=======
      .on('shown.bs.tooltip', function () {
        assert.ok($('.tooltip').is('.fade.bottom.in'), 'has correct classes applied')
        $tooltip.bootstrapTooltip('hide')
      })
      .on('hidden.bs.tooltip', function () {
        assert.strictEqual($('.tooltip').length, 0, 'tooltip removed')
        done()
      })
      .bootstrapTooltip({ placement: 'bottom' })
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc

<<<<<<< HEAD
    $tooltip
      .one('shown.bs.tooltip', function () {
        assert.ok($('.tooltip')
          .is('.fade.bs-tooltip-bottom.show'), 'has correct classes applied')

        $tooltip.bootstrapTooltip('hide')
      })
      .one('hidden.bs.tooltip', function () {
        assert.strictEqual($tooltip.data('bs.tooltip').tip.parentNode, null, 'tooltip removed')
        done()
      })
      .bootstrapTooltip('show')
||||||| merged common ancestors
    $tooltip.bootstrapTooltip('show')
    assert.ok($('.tooltip').is('.fade.bottom.in'), 'has correct classes applied')

    $tooltip.bootstrapTooltip('hide')
    assert.strictEqual($('.tooltip').length, 0, 'tooltip removed')
=======
    $tooltip.bootstrapTooltip('show')
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc
  })

  QUnit.test('should allow html entities', function (assert) {
    assert.expect(2)
<<<<<<< HEAD
    var done = assert.async()
||||||| merged common ancestors
=======
    var done = assert.async()

>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc
    var $tooltip = $('<a href="#" rel="tooltip" title="&lt;b&gt;@fat&lt;/b&gt;"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        html: true
      })

<<<<<<< HEAD
    $tooltip
      .one('shown.bs.tooltip', function () {
        assert.notEqual($('.tooltip b').length, 0, 'b tag was inserted')
        $tooltip.bootstrapTooltip('hide')
      })
      .one('hidden.bs.tooltip', function () {
        assert.strictEqual($tooltip.data('bs.tooltip').tip.parentNode, null, 'tooltip removed')
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
||||||| merged common ancestors
    $tooltip.bootstrapTooltip('show')
    assert.notEqual($('.tooltip b').length, 0, 'b tag was inserted')

    $tooltip.bootstrapTooltip('hide')
    assert.strictEqual($('.tooltip').length, 0, 'tooltip removed')
=======
    $tooltip.one('shown.bs.tooltip', function () {
      assert.notEqual($('.tooltip b').length, 0, 'b tag was inserted')
      $tooltip.bootstrapTooltip('hide')
    })
    .one('hidden.bs.tooltip', function () {
      assert.strictEqual($('.tooltip').length, 0, 'tooltip removed')
      done()
    })
    .bootstrapTooltip('show')
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc
  })

  QUnit.test('should respect custom classes', function (assert) {
    assert.expect(2)
<<<<<<< HEAD
    var done = assert.async()
||||||| merged common ancestors
=======
    var done = assert.async()

>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc
    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
<<<<<<< HEAD
      .bootstrapTooltip({
        template: '<div class="tooltip some-class"><div class="tooltip-arrow"/><div class="tooltip-inner"/></div>'
      })

    $tooltip
      .one('shown.bs.tooltip', function () {
        assert.ok($('.tooltip').hasClass('some-class'), 'custom class is present')
        $tooltip.bootstrapTooltip('hide')
      })
      .one('hidden.bs.tooltip', function () {
        assert.strictEqual($tooltip.data('bs.tooltip').tip.parentNode, null, 'tooltip removed')
        done()
      })
      .bootstrapTooltip('show')
||||||| merged common ancestors
      .bootstrapTooltip({ template: '<div class="tooltip some-class"><div class="tooltip-arrow"/><div class="tooltip-inner"/></div>' })

    $tooltip.bootstrapTooltip('show')
    assert.ok($('.tooltip').hasClass('some-class'), 'custom class is present')

    $tooltip.bootstrapTooltip('hide')
    assert.strictEqual($('.tooltip').length, 0, 'tooltip removed')
=======
      .bootstrapTooltip({ template: '<div class="tooltip some-class"><div class="tooltip-arrow"/><div class="tooltip-inner"/></div>' })

    $tooltip.one('shown.bs.tooltip', function () {
      assert.ok($('.tooltip').hasClass('some-class'), 'custom class is present')
      $tooltip.bootstrapTooltip('hide')
    })
    .one('hidden.bs.tooltip', function () {
      assert.strictEqual($('.tooltip').length, 0, 'tooltip removed')
      done()
    })
    .bootstrapTooltip('show')
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc
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
    } catch (err) {
      assert.strictEqual(err.message, 'Please use show on visible elements')
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
    assert.expect(7)
    var $tooltip = $('<div/>')
      .bootstrapTooltip()
      .on('click.foo', function () {})  // eslint-disable-line no-empty-function

    assert.ok($tooltip.data('bs.tooltip'), 'tooltip has data')
    assert.ok($._data($tooltip[0], 'events').mouseover && $._data($tooltip[0], 'events').mouseout, 'tooltip has hover events')
    assert.strictEqual($._data($tooltip[0], 'events').click[0].namespace, 'foo', 'tooltip has extra click.foo event')

    $tooltip.bootstrapTooltip('show')
    $tooltip.bootstrapTooltip('dispose')

    assert.ok(!$tooltip.hasClass('show'), 'tooltip is hidden')
    assert.ok(!$._data($tooltip[0], 'bs.tooltip'), 'tooltip does not have data')
    assert.strictEqual($._data($tooltip[0], 'events').click[0].namespace, 'foo', 'tooltip still has click.foo')
    assert.ok(!$._data($tooltip[0], 'events').mouseover && !$._data($tooltip[0], 'events').mouseout, 'tooltip does not have hover events')
  })

<<<<<<< HEAD
  // QUnit.test('should show tooltip with delegate selector on click', function (assert) {
  //   assert.expect(2)
  //   var $div = $('<div><a href="#" rel="tooltip" title="Another tooltip"/></div>')
  //     .appendTo('#qunit-fixture')
  //     .bootstrapTooltip({
  //       selector: 'a[rel="tooltip"]',
  //       trigger: 'click'
  //     })
||||||| merged common ancestors
  QUnit.test('should show tooltip with delegate selector on click', function (assert) {
    assert.expect(2)
    var $div = $('<div><a href="#" rel="tooltip" title="Another tooltip"/></div>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        selector: 'a[rel="tooltip"]',
        trigger: 'click'
      })
=======
  QUnit.test('should show tooltip with delegate selector on click', function (assert) {
    assert.expect(2)
    var done = assert.async()

    var $div = $('<div><a href="#" rel="tooltip" title="Another tooltip"/></div>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        selector: 'a[rel="tooltip"]',
        trigger: 'click'
      })
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc

<<<<<<< HEAD
  //   $div.find('a').trigger('click')
  //   assert.ok($('.tooltip').is('.fade.in'), 'tooltip is faded in')
||||||| merged common ancestors
    $div.find('a').trigger('click')
    assert.ok($('.tooltip').is('.fade.in'), 'tooltip is faded in')
=======
    $div.one('shown.bs.tooltip', function () {
      assert.ok($('.tooltip').is('.fade.in'), 'tooltip is faded in')
      $div.find('a').trigger('click')
    })
    .one('hidden.bs.tooltip', function () {
      assert.strictEqual($('.tooltip').length, 0, 'tooltip was removed from dom')
      done()
    })
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc

<<<<<<< HEAD
  //   $div.find('a').trigger('click')
  //   assert.strictEqual($div.data('bs.tooltip').tip.parentNode, null, 'tooltip removed')
  // })
||||||| merged common ancestors
    $div.find('a').trigger('click')
    assert.strictEqual($('.tooltip').length, 0, 'tooltip was removed from dom')
  })
=======
    $div.find('a').trigger('click')
  })
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc

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
<<<<<<< HEAD
    var done = assert.async()
    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
||||||| merged common ancestors
    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
=======
    var done = assert.async()

    $('<a href="#" rel="tooltip" title="Another tooltip"/>')
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc
      .appendTo('#qunit-fixture')
<<<<<<< HEAD
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
||||||| merged common ancestors
      .bootstrapTooltip({ container: 'body' })
      .bootstrapTooltip('show')

    assert.notEqual($('body > .tooltip').length, 0, 'tooltip is direct descendant of body')
    assert.strictEqual($('#qunit-fixture > .tooltip').length, 0, 'tooltip is not in parent')

    $tooltip.bootstrapTooltip('hide')
    assert.strictEqual($('body > .tooltip').length, 0, 'tooltip was removed from dom')
=======
      .bootstrapTooltip({ container: 'body' })
      .one('shown.bs.tooltip', function () {
        assert.notEqual($('body > .tooltip').length, 0, 'tooltip is direct descendant of body')
        assert.strictEqual($('#qunit-fixture > .tooltip').length, 0, 'tooltip is not in parent')

        $(this).bootstrapTooltip('hide')
      })
      .one('hidden.bs.tooltip', function () {
        assert.strictEqual($('body > .tooltip').length, 0, 'tooltip was removed from dom')
        done()
      })
      .bootstrapTooltip('show')
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc
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
        var $tooltip = $($(this).data('bs.tooltip').tip)
        assert.ok($tooltip.hasClass('bs-tooltip-right'))
        assert.ok(typeof $tooltip.attr('style') === 'undefined')
        $styles.remove()
        done()
      })
      .bootstrapTooltip('show')
  })

  QUnit.test('should use title attribute for tooltip text', function (assert) {
    assert.expect(2)
<<<<<<< HEAD
    var done = assert.async()
    var $tooltip = $('<a href="#" rel="tooltip" title="Simple tooltip"/>')
||||||| merged common ancestors
    var $tooltip = $('<a href="#" rel="tooltip" title="Simple tooltip"/>')
=======
    var done = assert.async()

    $('<a href="#" rel="tooltip" title="Simple tooltip"/>')
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc
      .appendTo('#qunit-fixture')
      .bootstrapTooltip()
      .one('shown.bs.tooltip', function () {
        assert.strictEqual($('.tooltip').children('.tooltip-inner').text(), 'Simple tooltip', 'title from title attribute is set')

<<<<<<< HEAD
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
||||||| merged common ancestors
    $tooltip.bootstrapTooltip('show')
    assert.strictEqual($('.tooltip').children('.tooltip-inner').text(), 'Simple tooltip', 'title from title attribute is set')

    $tooltip.bootstrapTooltip('hide')
    assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')
=======
        $(this).bootstrapTooltip('hide')
      })
      .one('hidden.bs.tooltip', function () {
        assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')
        done()
      })
      .bootstrapTooltip('show')

>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc
  })

  QUnit.test('should prefer title attribute over title option', function (assert) {
    assert.expect(2)
<<<<<<< HEAD
    var done = assert.async()
    var $tooltip = $('<a href="#" rel="tooltip" title="Simple tooltip"/>')
||||||| merged common ancestors
    var $tooltip = $('<a href="#" rel="tooltip" title="Simple tooltip"/>')
=======
    var done = assert.async()

    $('<a href="#" rel="tooltip" title="Simple tooltip"/>')
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        title: 'This is a tooltip with some content'
      })
<<<<<<< HEAD

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
||||||| merged common ancestors

    $tooltip.bootstrapTooltip('show')
    assert.strictEqual($('.tooltip').children('.tooltip-inner').text(), 'Simple tooltip', 'title is set from title attribute while preferred over title option')

    $tooltip.bootstrapTooltip('hide')
    assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')
=======
      .one('shown.bs.tooltip', function () {
        assert.strictEqual($('.tooltip').children('.tooltip-inner').text(), 'Simple tooltip', 'title is set from title attribute while preferred over title option')
        $(this).bootstrapTooltip('hide')
      })
      .one('hidden.bs.tooltip', function () {
        assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')
        done()
      })
      .bootstrapTooltip('show')
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc
  })

  QUnit.test('should use title option', function (assert) {
    assert.expect(2)
<<<<<<< HEAD
    var done = assert.async()
    var $tooltip = $('<a href="#" rel="tooltip"/>')
||||||| merged common ancestors
    var $tooltip = $('<a href="#" rel="tooltip"/>')
=======
    var done = assert.async()

    $('<a href="#" rel="tooltip"/>')
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        title: 'This is a tooltip with some content'
      })
<<<<<<< HEAD

    $tooltip
      .one('shown.bs.tooltip', function () {
        assert.strictEqual($('.tooltip').children('.tooltip-inner').text(), 'This is a tooltip with some content', 'title from title option is set')
        $tooltip.bootstrapTooltip('hide')
||||||| merged common ancestors

    $tooltip.bootstrapTooltip('show')
    assert.strictEqual($('.tooltip').children('.tooltip-inner').text(), 'This is a tooltip with some content', 'title from title option is set')

    $tooltip.bootstrapTooltip('hide')
    assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')
  })

  QUnit.test('should be placed dynamically to viewport with the dynamic placement option', function (assert) {
    assert.expect(6)
    var $style = $('<style> div[rel="tooltip"] { position: absolute; } #qunit-fixture { top: inherit; left: inherit } </style>').appendTo('head')
    var $container = $('<div/>')
      .css({
        position: 'relative',
        height: '100%'
=======
      .one('shown.bs.tooltip', function () {
        assert.strictEqual($('.tooltip').children('.tooltip-inner').text(), 'This is a tooltip with some content', 'title from title option is set')
        $(this).bootstrapTooltip('hide')
      })
      .one('hidden.bs.tooltip', function () {
        assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')
        done()
      })
      .bootstrapTooltip('show')
  })

  QUnit.test('should be placed dynamically to viewport with the dynamic placement option', function (assert) {
    assert.expect(6)
    var done = assert.async()

    var $style = $('<style> div[rel="tooltip"] { position: absolute; } #qunit-fixture { top: inherit; left: inherit } </style>').appendTo('head')
    var $container = $('<div/>')
      .css({
        position: 'relative',
        height: '100%'
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc
      })
<<<<<<< HEAD
      .one('hidden.bs.tooltip', function () {
        assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')
        done()
      })
      .bootstrapTooltip('show')
||||||| merged common ancestors
      .appendTo('#qunit-fixture')

    var $topTooltip = $('<div style="left: 0; top: 0;" rel="tooltip" title="Top tooltip">Top Dynamic Tooltip</div>')
      .appendTo($container)
      .bootstrapTooltip({ placement: 'auto', viewport: '#qunit-fixture' })

    $topTooltip.bootstrapTooltip('show')
    assert.ok($('.tooltip').is('.bottom'), 'top positioned tooltip is dynamically positioned to bottom')

    $topTooltip.bootstrapTooltip('hide')
    assert.strictEqual($('.tooltip').length, 0, 'top positioned tooltip removed from dom')

    var $rightTooltip = $('<div style="right: 0;" rel="tooltip" title="Right tooltip">Right Dynamic Tooltip</div>')
      .appendTo($container)
      .bootstrapTooltip({ placement: 'right auto', viewport: '#qunit-fixture' })

    $rightTooltip.bootstrapTooltip('show')
    assert.ok($('.tooltip').is('.left'), 'right positioned tooltip is dynamically positioned left')

    $rightTooltip.bootstrapTooltip('hide')
    assert.strictEqual($('.tooltip').length, 0, 'right positioned tooltip removed from dom')

    var $leftTooltip = $('<div style="left: 0;" rel="tooltip" title="Left tooltip">Left Dynamic Tooltip</div>')
      .appendTo($container)
      .bootstrapTooltip({ placement: 'auto left', viewport: '#qunit-fixture' })

    $leftTooltip.bootstrapTooltip('show')
    assert.ok($('.tooltip').is('.right'), 'left positioned tooltip is dynamically positioned right')

    $leftTooltip.bootstrapTooltip('hide')
    assert.strictEqual($('.tooltip').length, 0, 'left positioned tooltip removed from dom')

    $container.remove()
    $style.remove()
=======
      .appendTo('#qunit-fixture')

    var $topTooltip = $('<div style="left: 0; top: 0;" rel="tooltip" title="Top tooltip">Top Dynamic Tooltip</div>')
      .appendTo($container)
      .bootstrapTooltip({ placement: 'auto', viewport: '#qunit-fixture' })

    var topDone = false
    var rightDone = false
    var leftDone = false

    function isDone() {
      if (topDone && rightDone && leftDone) {
        $container.remove()
        $style.remove()
        done()
      }
    }

    function leftTooltip() {
      var $leftTooltip = $('<div style="left: 0;" rel="tooltip" title="Left tooltip">Left Dynamic Tooltip</div>')
        .appendTo($container)
        .bootstrapTooltip({ placement: 'auto left', viewport: '#qunit-fixture' })

      $leftTooltip
        .one('shown.bs.tooltip', function () {
          assert.ok($('.tooltip').is('.right'), 'left positioned tooltip is dynamically positioned right')
          $leftTooltip.bootstrapTooltip('hide')
        })
        .one('hidden.bs.tooltip', function () {
          assert.strictEqual($('.tooltip').length, 0, 'left positioned tooltip removed from dom')
          leftDone = true
          isDone()
        })
        .bootstrapTooltip('show')
    }

    function rightTooltip() {
      var $rightTooltip = $('<div style="right: 0;" rel="tooltip" title="Right tooltip">Right Dynamic Tooltip</div>')
        .appendTo($container)
        .bootstrapTooltip({ placement: 'right auto', viewport: '#qunit-fixture' })

      $rightTooltip
        .one('shown.bs.tooltip', function () {
          assert.ok($('.tooltip').is('.in'), 'right positioned tooltip is dynamically positioned left')
          $rightTooltip.bootstrapTooltip('hide')
        })
        .one('hidden.bs.tooltip', function () {
          assert.strictEqual($('.tooltip').length, 0, 'right positioned tooltip removed from dom')
          rightDone = true
          leftTooltip()
        })
        .bootstrapTooltip('show')
    }

    $topTooltip
      .one('shown.bs.tooltip', function () {
        assert.ok($('.tooltip').is('.bottom'), 'top positioned tooltip is dynamically positioned to bottom')
        $topTooltip.bootstrapTooltip('hide')
      })
      .one('hidden.bs.tooltip', function () {
        assert.strictEqual($('.tooltip').length, 0, 'top positioned tooltip removed from dom')
        topDone = true
        rightTooltip()
      })
      .bootstrapTooltip('show')
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc
  })

<<<<<<< HEAD
  QUnit.test('should not error when trying to show an top-placed tooltip that has been removed from the dom', function (assert) {
    assert.expect(1)
    var passed = true
    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .one('show.bs.tooltip', function () {
        $(this).remove()
      })
||||||| merged common ancestors
  QUnit.test('should position tip on top if viewport has enough space and placement is "auto top"', function (assert) {
    assert.expect(2)
    var styles = '<style>'
        + 'body { padding-top: 100px; }'
        + '#section { height: 300px; border: 1px solid red; padding-top: 50px }'
        + 'div[rel="tooltip"] { width: 150px; border: 1px solid blue; }'
        + '</style>'
    var $styles = $(styles).appendTo('head')

    var $container = $('<div id="section"/>').appendTo('#qunit-fixture')
    var $target = $('<div rel="tooltip" title="tip"/>')
      .appendTo($container)
=======
  QUnit.test('should position tip on top if viewport has enough space and placement is "auto top"', function (assert) {
    assert.expect(2)
    var done = assert.async()

    var styles = '<style>'
        + 'body { padding-top: 100px; }'
        + '#section { height: 300px; border: 1px solid red; padding-top: 50px }'
        + 'div[rel="tooltip"] { width: 150px; border: 1px solid blue; }'
        + '</style>'
    var $styles = $(styles).appendTo('head')

    var $container = $('<div id="section"/>').appendTo('#qunit-fixture')
    var $target = $('<div rel="tooltip" title="tip"/>')
      .appendTo($container)
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc
      .bootstrapTooltip({
        placement: 'top'
      })

<<<<<<< HEAD
    try {
      $tooltip.bootstrapTooltip('show')
    } catch (err) {
      passed = false
      console.log(err)
    }

    assert.ok(passed, '.tooltip(\'show\') should not throw an error if element no longer is in dom')
||||||| merged common ancestors
    $target.bootstrapTooltip('show')
    assert.ok($('.tooltip').is('.top'), 'top positioned tooltip is dynamically positioned to top')

    $target.bootstrapTooltip('hide')
    assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')

    $styles.remove()
=======
    $target
      .on('shown.bs.tooltip', function () {
        assert.ok($('.tooltip').is('.top'), 'top positioned tooltip is dynamically positioned to top')
        $target.bootstrapTooltip('hide')
      })
      .on('hidden.bs.tooltip', function () {
        assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')
        $styles.remove()
        done()
      })
      .bootstrapTooltip('show')
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc
  })

  QUnit.test('should show tooltip if leave event hasn\'t occurred before delay expires', function (assert) {
    assert.expect(2)
<<<<<<< HEAD
    var done = assert.async()
||||||| merged common ancestors
    var styles = '<style>'
        + '#section { height: 300px; border: 1px solid red; margin-top: 100px; }'
        + 'div[rel="tooltip"] { width: 150px; border: 1px solid blue; }'
        + '</style>'
    var $styles = $(styles).appendTo('head')
=======
    var done = assert.async()

    var styles = '<style>'
        + '#section { height: 300px; border: 1px solid red; margin-top: 100px; }'
        + 'div[rel="tooltip"] { width: 150px; border: 1px solid blue; }'
        + '</style>'
    var $styles = $(styles).appendTo('head')
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc

    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        delay: 150
      })

<<<<<<< HEAD
    setTimeout(function () {
      assert.ok(!$('.tooltip').is('.fade.show'), '100ms: tooltip is not faded active')
    }, 100)

    setTimeout(function () {
      assert.ok($('.tooltip').is('.fade.show'), '200ms: tooltip is faded active')
      done()
    }, 200)

    $tooltip.trigger('mouseenter')
||||||| merged common ancestors
    $target.bootstrapTooltip('show')
    assert.ok($('.tooltip').is('.top'), 'top positioned tooltip is dynamically positioned to top')

    $target.bootstrapTooltip('hide')
    assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')

    $styles.remove()
=======
    $target
      .on('shown.bs.tooltip', function () {
        assert.ok($('.tooltip').is('.top'), 'top positioned tooltip is dynamically positioned to top')
        $target.bootstrapTooltip('hide')
      })
      .on('hidden.bs.tooltip', function () {
        assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')
        $styles.remove()
        done()
      })
      .bootstrapTooltip('show')
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc
  })

  QUnit.test('should not show tooltip if leave event occurs before delay expires', function (assert) {
    assert.expect(2)
<<<<<<< HEAD
    var done = assert.async()
||||||| merged common ancestors
    var styles = '<style>'
        + 'body { padding-top: 100px; }'
        + '#section { height: 300px; border: 1px solid red; }'
        + 'div[rel="tooltip"] { width: 150px; border: 1px solid blue; }'
        + '</style>'
    var $styles = $(styles).appendTo('head')
=======
    var done = assert.async()

    var styles = '<style>'
        + 'body { padding-top: 100px; }'
        + '#section { height: 300px; border: 1px solid red; }'
        + 'div[rel="tooltip"] { width: 150px; border: 1px solid blue; }'
        + '</style>'
    var $styles = $(styles).appendTo('head')
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc

    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        delay: 150
      })

<<<<<<< HEAD
    setTimeout(function () {
      assert.ok(!$('.tooltip').is('.fade.show'), '100ms: tooltip not faded active')
      $tooltip.trigger('mouseout')
    }, 100)

    setTimeout(function () {
      assert.ok(!$('.tooltip').is('.fade.show'), '200ms: tooltip not faded active')
      done()
    }, 200)

    $tooltip.trigger('mouseenter')
||||||| merged common ancestors
    $target.bootstrapTooltip('show')
    assert.ok($('.tooltip').is('.bottom'), 'top positioned tooltip is dynamically positioned to bottom')

    $target.bootstrapTooltip('hide')
    assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')

    $styles.remove()
=======
    $target
      .on('shown.bs.tooltip', function () {
        assert.ok($('.tooltip').is('.bottom'), 'top positioned tooltip is dynamically positioned to bottom')
        $target.bootstrapTooltip('hide')
      })
      .on('hidden.bs.tooltip', function () {
        assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')
        $styles.remove()
        done()
      })
      .bootstrapTooltip('show')
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc
  })

<<<<<<< HEAD
  QUnit.test('should not hide tooltip if leave event occurs and enter event occurs within the hide delay', function (assert) {
    assert.expect(3)
    var done = assert.async()
||||||| merged common ancestors
  QUnit.test('should display the tip on top whenever scrollable viewport has enough room if the given placement is "auto top"', function (assert) {
    assert.expect(2)
    var styles = '<style>'
        + '#scrollable-div { height: 200px; overflow: auto; }'
        + '.tooltip-item { margin: 200px 0 400px; width: 150px; }'
        + '</style>'
    var $styles = $(styles).appendTo('head')
=======
  QUnit.test('should display the tip on top whenever scrollable viewport has enough room if the given placement is "auto top"', function (assert) {
    assert.expect(2)
    var done = assert.async()

    var styles = '<style>'
        + '#scrollable-div { height: 200px; overflow: auto; }'
        + '.tooltip-item { margin: 200px 0 400px; width: 150px; }'
        + '</style>'
    var $styles = $(styles).appendTo('head')
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc

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
      $tooltip.trigger('mouseout')

<<<<<<< HEAD
      setTimeout(function () {
        assert.ok($('.tooltip').is('.fade.show'), '100ms: tooltip still faded active')
        $tooltip.trigger('mouseenter')
      }, 100)

      setTimeout(function () {
        assert.ok($('.tooltip').is('.fade.show'), '200ms: tooltip still faded active')
        done()
      }, 200)
    }, 0)

    $tooltip.trigger('mouseenter')
||||||| merged common ancestors
    $target.bootstrapTooltip('show')
    assert.ok($('.tooltip').is('.fade.top.in'), 'has correct classes applied')

    $target.bootstrapTooltip('hide')
    assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')

    $styles.remove()
=======
    $target
      .on('shown.bs.tooltip', function () {
        assert.ok($('.tooltip').is('.fade.top.in'), 'has correct classes applied')
        $target.bootstrapTooltip('hide')
      })
      .on('hidden.bs.tooltip', function () {
        assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')
        $styles.remove()
        done()
      })
      .bootstrapTooltip('show')
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc
  })

  QUnit.test('should not show tooltip if leave event occurs before delay expires', function (assert) {
    assert.expect(2)
<<<<<<< HEAD
    var done = assert.async()
||||||| merged common ancestors
    var styles = '<style>'
        + '#scrollable-div { height: 200px; overflow: auto; }'
        + '.tooltip-item { padding: 200px 0 400px; width: 150px; }'
        + '</style>'
    var $styles = $(styles).appendTo('head')
=======
    var done = assert.async()

    var styles = '<style>'
        + '#scrollable-div { height: 200px; overflow: auto; }'
        + '.tooltip-item { padding: 200px 0 400px; width: 150px; }'
        + '</style>'
    var $styles = $(styles).appendTo('head')
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc

    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        delay: 150
      })

<<<<<<< HEAD
    setTimeout(function () {
      assert.ok(!$('.tooltip').is('.fade.show'), '100ms: tooltip not faded active')
      $tooltip.trigger('mouseout')
    }, 100)

    setTimeout(function () {
      assert.ok(!$('.tooltip').is('.fade.show'), '200ms: tooltip not faded active')
      done()
    }, 200)

    $tooltip.trigger('mouseenter')
||||||| merged common ancestors
    $('#scrollable-div').scrollTop(200)

    $target.bootstrapTooltip('show')
    assert.ok($('.tooltip').is('.fade.bottom.in'), 'has correct classes applied')

    $target.bootstrapTooltip('hide')
    assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')

    $styles.remove()
=======
    $('#scrollable-div').scrollTop(200)

    $target
      .on('shown.bs.tooltip', function () {
        assert.ok($('.tooltip').is('.fade.bottom.in'), 'has correct classes applied')
        $target.bootstrapTooltip('hide')
      })
      .on('hidden.bs.tooltip', function () {
        assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')
        $styles.remove()
        done()
      })
      .bootstrapTooltip('show')
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc
  })

  QUnit.test('should not show tooltip if leave event occurs before delay expires, even if hide delay is 0', function (assert) {
    assert.expect(2)
<<<<<<< HEAD
    var done = assert.async()
||||||| merged common ancestors
    var styles = '<style>'
        + '#scrollable-div { height: 200px; overflow: auto; }'
        + '.spacer { height: 400px; }'
        + '.spacer:first-child { height: 200px; }'
        + '.tooltip-item { width: 150px; }'
        + '</style>'
    var $styles = $(styles).appendTo('head')
=======
    var done = assert.async()

    var styles = '<style>'
        + '#scrollable-div { height: 200px; overflow: auto; }'
        + '.spacer { height: 400px; }'
        + '.spacer:first-child { height: 200px; }'
        + '.tooltip-item { width: 150px; }'
        + '</style>'
    var $styles = $(styles).appendTo('head')
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc

    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        delay: {
          show: 150,
          hide: 0
        }
      })

<<<<<<< HEAD
    setTimeout(function () {
      assert.ok(!$('.tooltip').is('.fade.show'), '100ms: tooltip not faded active')
      $tooltip.trigger('mouseout')
    }, 100)

    setTimeout(function () {
      assert.ok(!$('.tooltip').is('.fade.show'), '250ms: tooltip not faded active')
      done()
    }, 250)

    $tooltip.trigger('mouseenter')
||||||| merged common ancestors
    $('#scrollable-div').scrollTop(200)

    $target.bootstrapTooltip('show')
    assert.ok($('.tooltip').is('.fade.bottom.in'), 'has correct classes applied')

    $target.bootstrapTooltip('hide')
    assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')

    $styles.remove()
=======
    $('#scrollable-div').scrollTop(200)

    $target
      .on('shown.bs.tooltip', function () {
        assert.ok($('.tooltip').is('.fade.bottom.in'), 'has correct classes applied')
        $target.bootstrapTooltip('hide')
      })
      .on('hidden.bs.tooltip', function () {
        assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')
        $styles.remove()
        done()
      })
      .bootstrapTooltip('show')
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc
  })

<<<<<<< HEAD
  QUnit.test('should wait 200ms before hiding the tooltip', function (assert) {
    assert.expect(3)
    var done = assert.async()
||||||| merged common ancestors
  QUnit.test('should display the tip on top whenever scrollable viewport doesn\'t have enough room if the given placement is "auto bottom"', function (assert) {
    assert.expect(2)
    var styles = '<style>'
        + '#scrollable-div { height: 200px; overflow: auto; }'
        + '.tooltip-item { margin-top: 400px; width: 150px; }'
        + '</style>'
    var $styles = $(styles).appendTo('head')
=======
  QUnit.test('should display the tip on top whenever scrollable viewport doesn\'t have enough room if the given placement is "auto bottom"', function (assert) {
    assert.expect(2)
    var done = assert.async()

    var styles = '<style>'
        + '#scrollable-div { height: 200px; overflow: auto; }'
        + '.tooltip-item { margin-top: 400px; width: 150px; }'
        + '</style>'
    var $styles = $(styles).appendTo('head')
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc

    var $tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        delay: {
          show: 0,
          hide: 150
        }
      })

    setTimeout(function () {
      assert.ok($($tooltip.data('bs.tooltip').tip).is('.fade.show'), '1ms: tooltip faded active')

      $tooltip.trigger('mouseout')

<<<<<<< HEAD
      setTimeout(function () {
        assert.ok($($tooltip.data('bs.tooltip').tip).is('.fade.show'), '100ms: tooltip still faded active')
      }, 100)

      setTimeout(function () {
        assert.ok(!$($tooltip.data('bs.tooltip').tip).is('.show'), '200ms: tooltip removed')
        done()
      }, 200)
    }, 0)

    $tooltip.trigger('mouseenter')
||||||| merged common ancestors
    $target.bootstrapTooltip('show')
    assert.ok($('.tooltip').is('.fade.top.in'), 'has correct classes applied')

    $target.bootstrapTooltip('hide')
    assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')

    $styles.remove()
=======
    $target
      .on('shown.bs.tooltip', function () {
        assert.ok($('.tooltip').is('.fade.top.in'), 'has correct classes applied')
        $target.bootstrapTooltip('hide')
      })
      .on('hidden.bs.tooltip', function () {
        assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')
        $styles.remove()
        done()
      })
      .bootstrapTooltip('show')
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc
  })

<<<<<<< HEAD
  QUnit.test('should not reload the tooltip on subsequent mouseenter events', function (assert) {
    assert.expect(1)
    var titleHtml = function () {
      var uid = Util.getUID('tooltip')
      return '<p id="tt-content">' + uid + '</p><p>' + uid + '</p><p>' + uid + '</p>'
    }
||||||| merged common ancestors
  QUnit.test('should adjust the tip\'s top position when up against the top of the viewport', function (assert) {
    assert.expect(2)
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
    assert.strictEqual(Math.round($container.find('.tooltip').offset().top), 12)

    $target.bootstrapTooltip('hide')
    assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')

    $styles.remove()
  })
=======
  QUnit.test('should adjust the tip\'s top position when up against the top of the viewport', function (assert) {
    assert.expect(2)
    var done = assert.async()

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

    $target
      .on('shown.bs.tooltip', function () {
        assert.strictEqual(Math.round($container.find('.tooltip').offset().top), 12)
        $target.bootstrapTooltip('hide')
      })
      .on('hidden.bs.tooltip', function () {
        assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')
        $styles.remove()
        done()
      })
      .bootstrapTooltip('show')
  })
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc

<<<<<<< HEAD
    var $tooltip = $('<span id="tt-outer" rel="tooltip" data-trigger="hover" data-placement="top">some text</span>')
      .appendTo('#qunit-fixture')
||||||| merged common ancestors
  QUnit.test('should adjust the tip\'s top position when up against the bottom of the viewport', function (assert) {
    assert.expect(2)
    var styles = '<style>'
        + '.tooltip .tooltip-inner { width: 200px; height: 200px; max-width: none; }'
        + 'a[rel="tooltip"] { position: fixed; }'
        + '</style>'
    var $styles = $(styles).appendTo('head')
=======
  QUnit.test('should adjust the tip\'s top position when up against the bottom of the viewport', function (assert) {
    assert.expect(2)
    var done = assert.async()

    var styles = '<style>'
        + '.tooltip .tooltip-inner { width: 200px; height: 200px; max-width: none; }'
        + 'a[rel="tooltip"] { position: fixed; }'
        + '</style>'
    var $styles = $(styles).appendTo('head')
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc

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

<<<<<<< HEAD
    $('#tt-outer').trigger('mouseenter')

    var currentUid = $('#tt-content').text()

    $('#tt-content').trigger('mouseenter')
    assert.strictEqual(currentUid, $('#tt-content').text())
||||||| merged common ancestors
    $target.bootstrapTooltip('show')
    var $tooltip = $container.find('.tooltip')
    assert.strictEqual(Math.round($tooltip.offset().top), Math.round($(window).height() - 12 - $tooltip[0].offsetHeight))

    $target.bootstrapTooltip('hide')
    assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')

    $container.remove()
    $styles.remove()
=======
    $target
      .on('shown.bs.tooltip', function () {
        var $tooltip = $container.find('.tooltip')
        var padding = 50
        var result = Math.round($tooltip.offset().top)
        var resultMax = result + padding
        var resultMin = result - padding
        var expected = Math.round($(window).height() - 12 - $tooltip[0].offsetHeight)

        assert.ok(expected < resultMax && expected > resultMin)
        $target.bootstrapTooltip('hide')
      })
      .on('hidden.bs.tooltip', function () {
        assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')
        $container.remove()
        $styles.remove()
        done()
      })
      .bootstrapTooltip('show')
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc
  })

<<<<<<< HEAD
  QUnit.test('should not reload the tooltip if the mouse leaves and re-enters before hiding', function (assert) {
    assert.expect(4)
||||||| merged common ancestors
  QUnit.test('should adjust the tip\'s left position when up against the left of the viewport', function (assert) {
    assert.expect(2)
    var styles = '<style>'
        + '.tooltip .tooltip-inner { width: 200px; height: 200px; max-width: none; }'
        + 'a[rel="tooltip"] { position: fixed; }'
        + '</style>'
    var $styles = $(styles).appendTo('head')
=======
  QUnit.test('should adjust the tip\'s left position when up against the left of the viewport', function (assert) {
    assert.expect(2)
    var done = assert.async()

    var styles = '<style>'
        + '.tooltip .tooltip-inner { width: 200px; height: 200px; max-width: none; }'
        + 'a[rel="tooltip"] { position: fixed; }'
        + '</style>'
    var $styles = $(styles).appendTo('head')
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc

    var titleHtml = function () {
      var uid = Util.getUID('tooltip')
      return '<p id="tt-content">' + uid + '</p><p>' + uid + '</p><p>' + uid + '</p>'
    }

<<<<<<< HEAD
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

    var obj = $tooltip.data('bs.tooltip')
||||||| merged common ancestors
    $target.bootstrapTooltip('show')
    assert.strictEqual(Math.round($container.find('.tooltip').offset().left), 12)

    $target.bootstrapTooltip('hide')
    assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')

    $container.remove()
    $styles.remove()
  })
=======
    $target
      .on('shown.bs.tooltip', function () {
        assert.strictEqual(Math.round($container.find('.tooltip').offset().left), 12)
        $target.bootstrapTooltip('hide')
      })
      .on('hidden.bs.tooltip', function () {
        assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')
        $container.remove()
        $styles.remove()
        done()
      })
      .bootstrapTooltip('show')
  })
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc

<<<<<<< HEAD
    $('#tt-outer').trigger('mouseenter')
||||||| merged common ancestors
  QUnit.test('should adjust the tip\'s left position when up against the right of the viewport', function (assert) {
    assert.expect(2)
    var styles = '<style>'
        + '.tooltip .tooltip-inner { width: 200px; height: 200px; max-width: none; }'
        + 'a[rel="tooltip"] { position: fixed; }'
        + '</style>'
    var $styles = $(styles).appendTo('head')
=======
  QUnit.test('should adjust the tip\'s left position when up against the right of the viewport', function (assert) {
    assert.expect(2)
    var done = assert.async()

    var styles = '<style>'
        + '.tooltip .tooltip-inner { width: 200px; height: 200px; max-width: none; }'
        + 'a[rel="tooltip"] { position: fixed; }'
        + '</style>'
    var $styles = $(styles).appendTo('head')
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc

    var currentUid = $('#tt-content').text()

<<<<<<< HEAD
    $('#tt-outer').trigger('mouseleave')
    assert.strictEqual(currentUid, $('#tt-content').text())

    assert.ok(obj._hoverState === 'out', 'the tooltip hoverState should be set to "out"')

    $('#tt-outer').trigger('mouseenter')
    assert.ok(obj._hoverState === 'show', 'the tooltip hoverState should be set to "show"')

    assert.strictEqual(currentUid, $('#tt-content').text())
||||||| merged common ancestors
    $target.bootstrapTooltip('show')
    var $tooltip = $container.find('.tooltip')
    assert.strictEqual(Math.round($tooltip.offset().left), Math.round($(window).width() - 12 - $tooltip[0].offsetWidth))

    $target.bootstrapTooltip('hide')
    assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')

    $container.remove()
    $styles.remove()
=======
    $target
      .on('shown.bs.tooltip', function () {
        var $tooltip = $container.find('.tooltip')
        assert.strictEqual(Math.round($tooltip.offset().left), Math.round($(window).width() - 12 - $tooltip[0].offsetWidth))
        $target.bootstrapTooltip('hide')
      })
      .on('hidden.bs.tooltip', function () {
        assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')
        $container.remove()
        $styles.remove()
        done()
      })
      .bootstrapTooltip('show')
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc
  })

<<<<<<< HEAD
  QUnit.test('should do nothing when an attempt is made to hide an uninitialized tooltip', function (assert) {
    assert.expect(1)
||||||| merged common ancestors
  QUnit.test('should adjust the tip when up against the right of an arbitrary viewport', function (assert) {
    assert.expect(2)
    var styles = '<style>'
        + '.tooltip, .tooltip .tooltip-inner { width: 200px; height: 200px; max-width: none; }'
        + '.container-viewport { position: absolute; top: 50px; left: 60px; width: 300px; height: 300px; }'
        + 'a[rel="tooltip"] { position: fixed; }'
        + '</style>'
    var $styles = $(styles).appendTo('head')
=======
  QUnit.test('should adjust the tip when up against the right of an arbitrary viewport', function (assert) {
    assert.expect(2)
    var done = assert.async()

    var styles = '<style>'
        + '.tooltip, .tooltip .tooltip-inner { width: 200px; height: 200px; max-width: none; }'
        + '.container-viewport { position: absolute; top: 50px; left: 60px; width: 300px; height: 300px; }'
        + 'a[rel="tooltip"] { position: fixed; }'
        + '</style>'
    var $styles = $(styles).appendTo('head')
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc

    var $tooltip = $('<span data-toggle="tooltip" title="some tip">some text</span>')
      .appendTo('#qunit-fixture')
      .on('hidden.bs.tooltip shown.bs.tooltip', function () {
        assert.ok(false, 'should not fire any tooltip events')
      })
<<<<<<< HEAD
      .bootstrapTooltip('hide')
    assert.strictEqual(typeof $tooltip.data('bs.tooltip'), 'undefined', 'should not initialize the tooltip')
||||||| merged common ancestors

    $target.bootstrapTooltip('show')
    var $tooltip = $container.find('.tooltip')
    assert.strictEqual(Math.round($tooltip.offset().left), Math.round(60 + $container.width() - $tooltip[0].offsetWidth))

    $target.bootstrapTooltip('hide')
    assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')

    $container.remove()
    $styles.remove()
=======

    $target
      .on('shown.bs.tooltip', function () {
        var $tooltip = $container.find('.tooltip')
        assert.strictEqual(Math.round($tooltip.offset().left), Math.round(60 + $container.width() - $tooltip[0].offsetWidth))
        $target.bootstrapTooltip('hide')
      })
      .on('hidden.bs.tooltip', function () {
        assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')
        $container.remove()
        $styles.remove()
        done()
      })
      .bootstrapTooltip('show')
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc
  })

<<<<<<< HEAD
  QUnit.test('should not remove tooltip if multiple triggers are set and one is still active', function (assert) {
    assert.expect(41)
    var $el = $('<button>Trigger</button>')
      .appendTo('#qunit-fixture')
||||||| merged common ancestors
  QUnit.test('should get viewport element from function', function (assert) {
    assert.expect(3)
    var styles = '<style>'
        + '.tooltip, .tooltip .tooltip-inner { width: 200px; height: 200px; max-width: none; }'
        + '.container-viewport { position: absolute; top: 50px; left: 60px; width: 300px; height: 300px; }'
        + 'a[rel="tooltip"] { position: fixed; }'
        + '</style>'
    var $styles = $(styles).appendTo('head')

    var $container = $('<div class="container-viewport"/>').appendTo(document.body)
    var $target = $('<a href="#" rel="tooltip" title="tip" style="top: 50px; left: 350px;"/>').appendTo($container)
    $target
=======
  QUnit.test('should get viewport element from function', function (assert) {
    assert.expect(3)
    var done = assert.async()

    var styles = '<style>'
        + '.tooltip, .tooltip .tooltip-inner { width: 200px; height: 200px; max-width: none; }'
        + '.container-viewport { position: absolute; top: 50px; left: 60px; width: 300px; height: 300px; }'
        + 'a[rel="tooltip"] { position: fixed; }'
        + '</style>'
    var $styles = $(styles).appendTo('head')

    var $container = $('<div class="container-viewport"/>').appendTo(document.body)
    var $target = $('<a href="#" rel="tooltip" title="tip" style="top: 50px; left: 350px;"/>').appendTo($container)
    $target
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc
      .bootstrapTooltip({
        trigger: 'click hover focus',
        animation: false
      })
    var tooltip = $el.data('bs.tooltip')
    var $tooltip = $(tooltip.getTipElement())

<<<<<<< HEAD
    function showingTooltip() {
      return $tooltip.hasClass('show') || tooltip._hoverState === 'show'
    }

    var tests = [
      ['mouseenter', 'mouseleave'],

      ['focusin', 'focusout'],
||||||| merged common ancestors
    $target.bootstrapTooltip('show')
    var $tooltip = $container.find('.tooltip')
    assert.strictEqual(Math.round($tooltip.offset().left), Math.round(60 + $container.width() - $tooltip[0].offsetWidth))

    $target.bootstrapTooltip('hide')
    assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')

    $container.remove()
    $styles.remove()
  })
=======
    $target
      .on('shown.bs.tooltip', function () {
        var $tooltip = $container.find('.tooltip')
        assert.strictEqual(Math.round($tooltip.offset().left), Math.round(60 + $container.width() - $tooltip[0].offsetWidth))
        $target.bootstrapTooltip('hide')
      })
      .on('hidden.bs.tooltip', function () {
        assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')
        $container.remove()
        $styles.remove()
        done()
      })
      .bootstrapTooltip('show')
  })
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc

<<<<<<< HEAD
      ['click', 'click'],
||||||| merged common ancestors
  QUnit.test('should not misplace the tip when the right edge offset is greater or equal than the viewport width', function (assert) {
    assert.expect(2)
    var styles = '<style>'
        + '.tooltip, .tooltip *, .tooltip *:before, .tooltip *:after { box-sizing: border-box; }'
        + '.container-viewport, .container-viewport *, .container-viewport *:before, .container-viewport *:after { box-sizing: border-box; }'
        + '.tooltip, .tooltip .tooltip-inner { width: 50px; height: 50px; max-width: none; background: red; }'
        + '.container-viewport { padding: 100px; margin-left: 100px; width: 100px; }'
        + '</style>'
    var $styles = $(styles).appendTo('head')
=======
  QUnit.test('should not misplace the tip when the right edge offset is greater or equal than the viewport width', function (assert) {
    assert.expect(2)
    var done = assert.async()

    var styles = '<style>'
        + '.tooltip, .tooltip *, .tooltip *:before, .tooltip *:after { box-sizing: border-box; }'
        + '.container-viewport, .container-viewport *, .container-viewport *:before, .container-viewport *:after { box-sizing: border-box; }'
        + '.tooltip, .tooltip .tooltip-inner { width: 50px; height: 50px; max-width: none; background: red; }'
        + '.container-viewport { padding: 100px; margin-left: 100px; width: 100px; }'
        + '</style>'
    var $styles = $(styles).appendTo('head')
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc

      ['mouseenter', 'focusin', 'focusout', 'mouseleave'],
      ['mouseenter', 'focusin', 'mouseleave', 'focusout'],

<<<<<<< HEAD
      ['focusin', 'mouseenter', 'mouseleave', 'focusout'],
      ['focusin', 'mouseenter', 'focusout', 'mouseleave'],

      ['click', 'focusin', 'mouseenter', 'focusout', 'mouseleave', 'click'],
      ['mouseenter', 'click', 'focusin', 'focusout', 'mouseleave', 'click'],
      ['mouseenter', 'focusin', 'click', 'click', 'mouseleave', 'focusout']
    ]

    assert.ok(!showingTooltip())

    $.each(tests, function (idx, triggers) {
      for (var i = 0, len = triggers.length; i < len; i++) {
        $el.trigger(triggers[i])
        assert.equal(i < len - 1, showingTooltip())
      }
    })
||||||| merged common ancestors
    $target.bootstrapTooltip('show')
    var $tooltip = $container.find('.tooltip')
    assert.strictEqual(Math.round($tooltip.offset().left), Math.round($target.position().left + $target.width() / 2 - $tooltip[0].offsetWidth / 2))

    $target.bootstrapTooltip('hide')
    assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')

    $container.remove()
    $styles.remove()
=======
    $target
      .on('shown.bs.tooltip', function () {
        var $tooltip = $container.find('.tooltip')
        var expected = Math.round($target.position().left + $target.width() / 2 - $tooltip[0].offsetWidth / 2)
        var result = Math.round($tooltip.offset().left)
        assert.ok(result === (expected - 1) || result === expected)
        $target.bootstrapTooltip('hide')
      })
      .on('hidden.bs.tooltip', function () {
        assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')
        $container.remove()
        $styles.remove()
        done()
      })
      .bootstrapTooltip('show')
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc
  })

  QUnit.test('should show on first trigger after hide', function (assert) {
    assert.expect(3)
    var $el = $('<a href="#" rel="tooltip" title="Test tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip({
        trigger: 'click hover focus',
        animation: false
      })

    var tooltip = $el.data('bs.tooltip')
    var $tooltip = $(tooltip.getTipElement())

    function showingTooltip() {
      return $tooltip.hasClass('show') || tooltip._hoverState === 'show'
    }

    $el.trigger('click')
    assert.ok(showingTooltip(), 'tooltip is faded in')

    $el.bootstrapTooltip('hide')
    assert.ok(!showingTooltip(), 'tooltip was faded out')

    $el.trigger('click')
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

  QUnit.test('should reset tip classes when hidden event triggered', function (assert) {
    assert.expect(2)
    var done = assert.async()
    var $el = $('<a href="#" rel="tooltip" title="Test tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip('show')
      .on('hidden.bs.tooltip', function () {
        var tooltip = $el.data('bs.tooltip')
        var $tooltip = $(tooltip.getTipElement())
        assert.ok($tooltip.hasClass('tooltip'))
        assert.ok($tooltip.hasClass('fade'))
        done()
      })

    $el.bootstrapTooltip('hide')
  })

<<<<<<< HEAD
  QUnit.test('should convert number in title to string', function (assert) {
    assert.expect(1)
||||||| merged common ancestors
  QUnit.test('should wait 200ms before hiding the tooltip', function (assert) {
    assert.expect(3)
=======
  QUnit.test('should wait 200ms before hiding the tooltip', function (assert) {
    if (window.__karma__) {
      assert.expect(0)
      return
    }

    assert.expect(3)
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc
    var done = assert.async()
    var $el = $('<a href="#" rel="tooltip" title="7"/>')
      .appendTo('#qunit-fixture')
<<<<<<< HEAD
||||||| merged common ancestors
      .bootstrapTooltip({ delay: { show: 0, hide: 150 }})

    setTimeout(function () {
      assert.ok($tooltip.data('bs.tooltip').$tip.is('.fade.in'), '1ms: tooltip faded in')

      $tooltip.trigger('mouseout')

      setTimeout(function () {
        assert.ok($tooltip.data('bs.tooltip').$tip.is('.fade.in'), '100ms: tooltip still faded in')
      }, 100)

      setTimeout(function () {
        assert.ok(!$tooltip.data('bs.tooltip').$tip.is('.in'), '200ms: tooltip removed')
        done()
      }, 200)

    }, 0)

    $tooltip.trigger('mouseenter')
  })

  QUnit.test('should correctly position tooltips on SVG elements', function (assert) {
    if (!window.SVGElement) {
      // Skip IE8 since it doesn't support SVG
      assert.expect(0)
      return
    }
    assert.expect(2)

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
=======
      .bootstrapTooltip({ delay: { show: 0, hide: 150 }})

    setTimeout(function () {
      assert.ok($tooltip.data('bs.tooltip').$tip.is('.fade.in'), '1ms: tooltip faded in')

      $tooltip.trigger('mouseout')

      setTimeout(function () {
        assert.ok($tooltip.data('bs.tooltip').$tip.is('.fade.in'), '100ms: tooltip still faded in')
      }, 100)

      setTimeout(function () {
        assert.ok(!$tooltip.data('bs.tooltip').$tip.is('.in'), '200ms: tooltip removed')
        done()
      }, 200)

    }, 0)

    $tooltip.trigger('mouseenter')
  })

  QUnit.test('should correctly position tooltips on SVG elements', function (assert) {
    if (!window.SVGElement) {
      // Skip IE8 since it doesn't support SVG
      assert.expect(0)
      return
    }
    assert.expect(2)

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
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc
      .on('shown.bs.tooltip', function () {
<<<<<<< HEAD
        var tooltip = $el.data('bs.tooltip')
        var $tooltip = $(tooltip.getTipElement())
        assert.strictEqual($tooltip.children().text(), '7')
||||||| merged common ancestors
        var offset = $('.tooltip').offset()
        $styles.remove()
        assert.ok(Math.abs(offset.left - 88) <= 1, 'tooltip has correct horizontal location')
        $circle.bootstrapTooltip('hide')
        assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')
=======
        var offset = $('.tooltip').offset()
        $styles.remove()
        assert.ok(Math.abs(offset.left - 88) <= 1, 'tooltip has correct horizontal location')
        $circle.bootstrapTooltip('hide')

      })
      .on('hidden.bs.tooltip', function () {
        assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc
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
    $trigger.trigger($.Event('click'))
    setTimeout(function () {
      assert.strictEqual($('.tooltip').length === 0, true)
      $trigger.bootstrapTooltip('enable')
      $trigger.trigger($.Event('click'))
    }, 200)
  })

  QUnit.test('should call Popper.js to update', function (assert) {
    assert.expect(2)

    var $tooltip = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip()

    var tooltip = $tooltip.data('bs.tooltip')
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

<<<<<<< HEAD
    var tooltip = $tooltip.data('bs.tooltip')
    tooltip.update()
||||||| merged common ancestors
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
    assert.strictEqual(currentUid, $('#tt-content').text())

    assert.ok(obj.hoverState == 'out', 'the tooltip hoverState should be set to "out"')

    $('#tt-content').trigger('mouseenter')
    assert.ok(obj.hoverState == 'in', 'the tooltip hoverState should be set to "in"')

    assert.strictEqual(currentUid, $('#tt-content').text())
  })

  QUnit.test('should position arrow correctly when tooltip is moved to not appear offscreen', function (assert) {
    assert.expect(2)
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
        assert.ok(/left/i.test(arrowStyles) && !/top/i.test(arrowStyles), 'arrow positioned correctly')
        $(this).bootstrapTooltip('hide')
      })
      .on('hidden.bs.tooltip', function () {
        $styles.remove()
        $(this).remove()
        assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')
        done()
      })
      .bootstrapTooltip({
        container: 'body',
        placement: 'top',
        trigger: 'manual'
      })
      .bootstrapTooltip('show')
  })

  QUnit.test('should correctly position tooltips on transformed elements', function (assert) {
    var styleProps = document.documentElement.style
    if (!('transform' in styleProps) && !('webkitTransform' in styleProps) && !('msTransform' in styleProps)) {
      assert.expect(0)
      return
    }
    assert.expect(2)

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
        assert.ok(Math.abs(offset.left - 88) <= 1, 'tooltip has correct horizontal location')
        assert.ok(Math.abs(offset.top - 126) <= 1, 'tooltip has correct vertical location')
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
=======
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
    assert.strictEqual(currentUid, $('#tt-content').text())

    assert.ok(obj.hoverState == 'out', 'the tooltip hoverState should be set to "out"')

    $('#tt-content').trigger('mouseenter')
    assert.ok(obj.hoverState == 'in', 'the tooltip hoverState should be set to "in"')

    assert.strictEqual(currentUid, $('#tt-content').text())
  })

  QUnit.test('should position arrow correctly when tooltip is moved to not appear offscreen', function (assert) {
    assert.expect(2)
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
        assert.ok(/left/i.test(arrowStyles) && !/top/i.test(arrowStyles), 'arrow positioned correctly')
        $(this).bootstrapTooltip('hide')
      })
      .on('hidden.bs.tooltip', function () {
        $styles.remove()
        $(this).remove()
        assert.strictEqual($('.tooltip').length, 0, 'tooltip removed from dom')
        done()
      })
      .bootstrapTooltip({
        container: 'body',
        placement: 'top',
        trigger: 'manual'
      })
      .bootstrapTooltip('show')
  })

  QUnit.test('should correctly position tooltips on transformed elements', function (assert) {
    var styleProps = document.documentElement.style
    if ((!('transform' in styleProps) && !('webkitTransform' in styleProps) && !('msTransform' in styleProps)) || window.__karma__) {
      assert.expect(0)
      return
    }

    assert.expect(2)

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
        assert.ok(Math.abs(offset.left - 88) <= 1, 'tooltip has correct horizontal location')
        assert.ok(Math.abs(offset.top - 126) <= 1, 'tooltip has correct vertical location')
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
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc

    assert.ok(tooltip._popper === null)
  })

  QUnit.test('should use Popper.js to get the tip on placement change', function (assert) {
    assert.expect(1)

    var $tooltip = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>')
      .appendTo('#qunit-fixture')
      .bootstrapTooltip()

    var $tipTest = $('<div class="bs-tooltip" />')
      .appendTo('#qunit-fixture')
<<<<<<< HEAD
||||||| merged common ancestors
      .bootstrapTooltip({ trigger: 'click hover focus', animation: false })
    var tooltip = $el.data('bs.tooltip')
    var $tooltip = tooltip.tip()

    function showingTooltip() { return $tooltip.hasClass('in') || tooltip.hoverState == 'in' }

    var tests = [
        ['mouseenter', 'mouseleave'],
=======
      .bootstrapTooltip({ trigger: 'click hover focus', animation: false })
    var tooltip = $el.data('bs.tooltip')
    var $tooltip = tooltip.tip()

    function showingTooltip() { return $tooltip.hasClass('in') || tooltip.hoverState == 'in' }

    var tests = [
      ['mouseenter', 'mouseleave'],
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc

<<<<<<< HEAD
    var tooltip = $tooltip.data('bs.tooltip')
    tooltip.tip = null
||||||| merged common ancestors
        ['focusin', 'focusout'],
=======
      ['focusin', 'focusout'],
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc

<<<<<<< HEAD
    tooltip._handlePopperPlacementChange({
      instance: {
        popper: $tipTest[0]
      },
      placement: 'auto'
||||||| merged common ancestors
        ['click', 'click'],

        ['mouseenter', 'focusin', 'focusout', 'mouseleave'],
        ['mouseenter', 'focusin', 'mouseleave', 'focusout'],

        ['focusin', 'mouseenter', 'mouseleave', 'focusout'],
        ['focusin', 'mouseenter', 'focusout', 'mouseleave'],

        ['click', 'focusin', 'mouseenter', 'focusout', 'mouseleave', 'click'],
        ['mouseenter', 'click', 'focusin', 'focusout', 'mouseleave', 'click'],
        ['mouseenter', 'focusin', 'click', 'click', 'mouseleave', 'focusout']
    ]

    assert.ok(!showingTooltip())

    $.each(tests, function (idx, triggers) {
      for (var i = 0, len = triggers.length; i < len; i++) {
        $el.trigger(triggers[i]);
        assert.equal(i < (len - 1), showingTooltip())
      }
=======
      ['click', 'click'],

      ['mouseenter', 'focusin', 'focusout', 'mouseleave'],
      ['mouseenter', 'focusin', 'mouseleave', 'focusout'],

      ['focusin', 'mouseenter', 'mouseleave', 'focusout'],
      ['focusin', 'mouseenter', 'focusout', 'mouseleave'],

      ['click', 'focusin', 'mouseenter', 'focusout', 'mouseleave', 'click'],
      ['mouseenter', 'click', 'focusin', 'focusout', 'mouseleave', 'click'],
      ['mouseenter', 'focusin', 'click', 'click', 'mouseleave', 'focusout']
    ]

    assert.ok(!showingTooltip())

    $.each(tests, function (idx, triggers) {
      for (var i = 0, len = triggers.length; i < len; i++) {
        $el.trigger(triggers[i])
        assert.equal(i < (len - 1), showingTooltip())
      }
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc
    })
<<<<<<< HEAD

    assert.ok(tooltip.tip === $tipTest[0])
  })
||||||| merged common ancestors
  })

=======
  })
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc
})
