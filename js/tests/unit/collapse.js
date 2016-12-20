$(function () {
  'use strict';

  QUnit.module('collapse plugin')

  QUnit.test('should be defined on jquery object', function (assert) {
    assert.expect(1)
    assert.ok($(document.body).collapse, 'collapse method is defined')
  })

  QUnit.module('collapse', {
    beforeEach: function () {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.bootstrapCollapse = $.fn.collapse.noConflict()
    },
    afterEach: function () {
      $.fn.collapse = $.fn.bootstrapCollapse
      delete $.fn.bootstrapCollapse
    }
  })

  QUnit.test('should provide no conflict', function (assert) {
    assert.expect(1)
    assert.strictEqual($.fn.collapse, undefined, 'collapse was set back to undefined (org value)')
  })

  QUnit.test('should throw explicit error on undefined method', function (assert) {
    assert.expect(1)
    var $el = $('<div/>')
    $el.bootstrapCollapse()
    try {
      $el.bootstrapCollapse('noMethod')
    }
    catch (err) {
      assert.strictEqual(err.message, 'No method named "noMethod"')
    }
  })

  QUnit.test('should return jquery collection containing the element', function (assert) {
    assert.expect(2)
    var $el = $('<div/>')
    var $collapse = $el.bootstrapCollapse()
    assert.ok($collapse instanceof $, 'returns jquery collection')
    assert.strictEqual($collapse[0], $el[0], 'collection contains element')
  })

  QUnit.test('should show a collapsed element', function (assert) {
    assert.expect(2)
    var $el = $('<div class="collapse"/>').bootstrapCollapse('show')

    assert.ok($el.hasClass('in'), 'has class "in"')
    assert.ok(!/height/i.test($el.attr('style')), 'has height reset')
  })

  QUnit.test('should hide a collapsed element', function (assert) {
    assert.expect(1)
    var $el = $('<div class="collapse"/>').bootstrapCollapse('hide')

    assert.ok(!$el.hasClass('in'), 'does not have class "in"')
  })

  QUnit.test('should not fire shown when show is prevented', function (assert) {
    assert.expect(1)
    var done = assert.async()

    $('<div class="collapse"/>')
      .on('show.bs.collapse', function (e) {
        e.preventDefault()
        assert.ok(true, 'show event fired')
        done()
      })
      .on('shown.bs.collapse', function () {
        assert.ok(false, 'shown event fired')
      })
      .bootstrapCollapse('show')
  })

  QUnit.test('should reset style to auto after finishing opening collapse', function (assert) {
    assert.expect(2)
    var done = assert.async()

    $('<div class="collapse" style="height: 0px"/>')
      .on('show.bs.collapse', function () {
        assert.strictEqual(this.style.height, '0px', 'height is 0px')
      })
      .on('shown.bs.collapse', function () {
        assert.strictEqual(this.style.height, '', 'height is auto')
        done()
      })
      .bootstrapCollapse('show')
  })

  QUnit.test('should remove "collapsed" class from target when collapse is shown', function (assert) {
    assert.expect(1)
    var done = assert.async()

    var $target = $('<a role="button" data-toggle="collapse" class="collapsed" href="#test1"/>').appendTo('#qunit-fixture')

    $('<div id="test1"/>')
      .appendTo('#qunit-fixture')
      .on('shown.bs.collapse', function () {
        assert.ok(!$target.hasClass('collapsed'), 'target does not have collapsed class')
        done()
      })

    $target.trigger('click')
  })

  QUnit.test('should add "collapsed" class to target when collapse is hidden', function (assert) {
    assert.expect(1)
    var done = assert.async()

    var $target = $('<a role="button" data-toggle="collapse" href="#test1"/>').appendTo('#qunit-fixture')

    $('<div id="test1" class="in"/>')
      .appendTo('#qunit-fixture')
      .on('hidden.bs.collapse', function () {
        assert.ok($target.hasClass('collapsed'), 'target has collapsed class')
        done()
      })

    $target.trigger('click')
  })

  QUnit.test('should remove "collapsed" class from all triggers targeting the collapse when the collapse is shown', function (assert) {
    assert.expect(2)
    var done = assert.async()

    var $target = $('<a role="button" data-toggle="collapse" class="collapsed" href="#test1"/>').appendTo('#qunit-fixture')
    var $alt = $('<a role="button" data-toggle="collapse" class="collapsed" href="#test1"/>').appendTo('#qunit-fixture')

    $('<div id="test1"/>')
      .appendTo('#qunit-fixture')
      .on('shown.bs.collapse', function () {
        assert.ok(!$target.hasClass('collapsed'), 'target trigger does not have collapsed class')
        assert.ok(!$alt.hasClass('collapsed'), 'alt trigger does not have collapsed class')
        done()
      })

    $target.trigger('click')
  })

  QUnit.test('should add "collapsed" class to all triggers targeting the collapse when the collapse is hidden', function (assert) {
    assert.expect(2)
    var done = assert.async()

    var $target = $('<a role="button" data-toggle="collapse" href="#test1"/>').appendTo('#qunit-fixture')
    var $alt = $('<a role="button" data-toggle="collapse" href="#test1"/>').appendTo('#qunit-fixture')

    $('<div id="test1" class="in"/>')
      .appendTo('#qunit-fixture')
      .on('hidden.bs.collapse', function () {
        assert.ok($target.hasClass('collapsed'), 'target has collapsed class')
        assert.ok($alt.hasClass('collapsed'), 'alt trigger has collapsed class')
        done()
      })

    $target.trigger('click')
  })

  QUnit.test('should not close a collapse when initialized with "show" option if already shown', function (assert) {
    assert.expect(0)
    var done = assert.async()

    var $test = $('<div id="test1" class="in"/>')
      .appendTo('#qunit-fixture')
      .on('hide.bs.collapse', function () {
        assert.ok(false)
      })

    $test.bootstrapCollapse('show')

    setTimeout(done, 0)
  })

  QUnit.test('should open a collapse when initialized with "show" option if not already shown', function (assert) {
    assert.expect(1)
    var done = assert.async()

    var $test = $('<div id="test1" />')
      .appendTo('#qunit-fixture')
      .on('show.bs.collapse', function () {
        assert.ok(true)
      })

    $test.bootstrapCollapse('show')

    setTimeout(done, 0)
  })

  QUnit.test('should not show a collapse when initialized with "hide" option if already hidden', function (assert) {
    assert.expect(0)
    var done = assert.async()

    $('<div class="collapse"></div>')
      .appendTo('#qunit-fixture')
      .on('show.bs.collapse', function () {
        assert.ok(false, 'showing a previously-uninitialized hidden collapse when the "hide" method is called')
      })
      .bootstrapCollapse('hide')

    setTimeout(done, 0)
  })

  QUnit.test('should hide a collapse when initialized with "hide" option if not already hidden', function (assert) {
    assert.expect(1)
    var done = assert.async()

    $('<div class="collapse in"></div>')
      .appendTo('#qunit-fixture')
      .on('hide.bs.collapse', function () {
        assert.ok(true, 'hiding a previously-uninitialized shown collapse when the "hide" method is called')
      })
      .bootstrapCollapse('hide')

    setTimeout(done, 0)
  })

  QUnit.test('should remove "collapsed" class from active accordion target', function (assert) {
    assert.expect(3)
    var done = assert.async()

    var accordionHTML = '<div class="panel-group" id="accordion">'
        + '<div class="panel"/>'
        + '<div class="panel"/>'
        + '<div class="panel"/>'
        + '</div>'
    var $groups = $(accordionHTML).appendTo('#qunit-fixture').find('.panel')

    var $target1 = $('<a role="button" data-toggle="collapse" href="#body1" data-parent="#accordion"/>').appendTo($groups.eq(0))

    $('<div id="body1" class="in"/>').appendTo($groups.eq(0))

    var $target2 = $('<a class="collapsed" data-toggle="collapse" role="button" href="#body2" data-parent="#accordion"/>').appendTo($groups.eq(1))

    $('<div id="body2"/>').appendTo($groups.eq(1))

    var $target3 = $('<a class="collapsed" data-toggle="collapse" role="button" href="#body3" data-parent="#accordion"/>').appendTo($groups.eq(2))

    $('<div id="body3"/>')
      .appendTo($groups.eq(2))
      .on('shown.bs.collapse', function () {
        assert.ok($target1.hasClass('collapsed'), 'inactive target 1 does have class "collapsed"')
        assert.ok($target2.hasClass('collapsed'), 'inactive target 2 does have class "collapsed"')
        assert.ok(!$target3.hasClass('collapsed'), 'active target 3 does not have class "collapsed"')

        done()
      })

    $target3.trigger('click')
  })

  QUnit.test('should allow dots in data-parent', function (assert) {
    assert.expect(3)
    var done = assert.async()

    var accordionHTML = '<div class="panel-group accordion">'
        + '<div class="panel"/>'
        + '<div class="panel"/>'
        + '<div class="panel"/>'
        + '</div>'
    var $groups = $(accordionHTML).appendTo('#qunit-fixture').find('.panel')

    var $target1 = $('<a role="button" data-toggle="collapse" href="#body1" data-parent=".accordion"/>').appendTo($groups.eq(0))

    $('<div id="body1" class="in"/>').appendTo($groups.eq(0))

    var $target2 = $('<a class="collapsed" data-toggle="collapse" role="button" href="#body2" data-parent=".accordion"/>').appendTo($groups.eq(1))

    $('<div id="body2"/>').appendTo($groups.eq(1))

    var $target3 = $('<a class="collapsed" data-toggle="collapse" role="button" href="#body3" data-parent=".accordion"/>').appendTo($groups.eq(2))

    $('<div id="body3"/>')
      .appendTo($groups.eq(2))
      .on('shown.bs.collapse', function () {
        assert.ok($target1.hasClass('collapsed'), 'inactive target 1 does have class "collapsed"')
        assert.ok($target2.hasClass('collapsed'), 'inactive target 2 does have class "collapsed"')
        assert.ok(!$target3.hasClass('collapsed'), 'active target 3 does not have class "collapsed"')

        done()
      })

    $target3.trigger('click')
  })

  QUnit.test('should set aria-expanded="true" on target when collapse is shown', function (assert) {
    assert.expect(1)
    var done = assert.async()

    var $target = $('<a role="button" data-toggle="collapse" class="collapsed" href="#test1" aria-expanded="false"/>').appendTo('#qunit-fixture')

    $('<div id="test1"/>')
      .appendTo('#qunit-fixture')
      .on('shown.bs.collapse', function () {
        assert.strictEqual($target.attr('aria-expanded'), 'true', 'aria-expanded on target is "true"')
        done()
      })

    $target.trigger('click')
  })

  QUnit.test('should set aria-expanded="false" on target when collapse is hidden', function (assert) {
    assert.expect(1)
    var done = assert.async()

    var $target = $('<a role="button" data-toggle="collapse" href="#test1" aria-expanded="true"/>').appendTo('#qunit-fixture')

    $('<div id="test1" class="in"/>')
      .appendTo('#qunit-fixture')
      .on('hidden.bs.collapse', function () {
        assert.strictEqual($target.attr('aria-expanded'), 'false', 'aria-expanded on target is "false"')
        done()
      })

    $target.trigger('click')
  })

  QUnit.test('should set aria-expanded="true" on all triggers targeting the collapse when the collapse is shown', function (assert) {
    assert.expect(2)
    var done = assert.async()

    var $target = $('<a role="button" data-toggle="collapse" class="collapsed" href="#test1" aria-expanded="false"/>').appendTo('#qunit-fixture')
    var $alt = $('<a role="button" data-toggle="collapse" class="collapsed" href="#test1" aria-expanded="false"/>').appendTo('#qunit-fixture')

    $('<div id="test1"/>')
      .appendTo('#qunit-fixture')
      .on('shown.bs.collapse', function () {
        assert.strictEqual($target.attr('aria-expanded'), 'true', 'aria-expanded on target is "true"')
        assert.strictEqual($alt.attr('aria-expanded'), 'true', 'aria-expanded on alt is "true"')
        done()
      })

    $target.trigger('click')
  })

  QUnit.test('should set aria-expanded="false" on all triggers targeting the collapse when the collapse is hidden', function (assert) {
    assert.expect(2)
    var done = assert.async()

    var $target = $('<a role="button" data-toggle="collapse" href="#test1" aria-expanded="true"/>').appendTo('#qunit-fixture')
    var $alt = $('<a role="button" data-toggle="collapse" href="#test1" aria-expanded="true"/>').appendTo('#qunit-fixture')

    $('<div id="test1" class="in"/>')
      .appendTo('#qunit-fixture')
      .on('hidden.bs.collapse', function () {
        assert.strictEqual($target.attr('aria-expanded'), 'false', 'aria-expanded on target is "false"')
        assert.strictEqual($alt.attr('aria-expanded'), 'false', 'aria-expanded on alt is "false"')
        done()
      })

    $target.trigger('click')
  })

  QUnit.test('should change aria-expanded from active accordion target to "false" and set the newly active one to "true"', function (assert) {
    assert.expect(3)
    var done = assert.async()

    var accordionHTML = '<div class="panel-group" id="accordion">'
        + '<div class="panel"/>'
        + '<div class="panel"/>'
        + '<div class="panel"/>'
        + '</div>'
    var $groups = $(accordionHTML).appendTo('#qunit-fixture').find('.panel')

    var $target1 = $('<a role="button" data-toggle="collapse" href="#body1" data-parent="#accordion"/>').appendTo($groups.eq(0))

    $('<div id="body1" aria-expanded="true" class="in"/>').appendTo($groups.eq(0))

    var $target2 = $('<a role="button" data-toggle="collapse" href="#body2" data-parent="#accordion" class="collapsed" />').appendTo($groups.eq(1))

    $('<div id="body2" aria-expanded="false"/>').appendTo($groups.eq(1))

    var $target3 = $('<a class="collapsed" data-toggle="collapse" role="button" href="#body3" data-parent="#accordion"/>').appendTo($groups.eq(2))

    $('<div id="body3" aria-expanded="false"/>')
      .appendTo($groups.eq(2))
      .on('shown.bs.collapse', function () {
        assert.strictEqual($target1.attr('aria-expanded'), 'false', 'inactive target 1 has aria-expanded="false"')
        assert.strictEqual($target2.attr('aria-expanded'), 'false', 'inactive target 2 has aria-expanded="false"')
        assert.strictEqual($target3.attr('aria-expanded'), 'true', 'active target 3 has aria-expanded="false"')

        done()
      })

    $target3.trigger('click')
  })

  QUnit.test('should not fire show event if show is prevented because other element is still transitioning', function (assert) {
    assert.expect(1)
    var done = assert.async()

    var accordionHTML = '<div id="accordion">'
        + '<div class="panel"/>'
        + '<div class="panel"/>'
        + '</div>'
    var showFired = false
    var $groups   = $(accordionHTML).appendTo('#qunit-fixture').find('.panel')

    var $target1 = $('<a role="button" data-toggle="collapse" href="#body1" data-parent="#accordion"/>').appendTo($groups.eq(0))

    $('<div id="body1" class="collapse"/>')
      .appendTo($groups.eq(0))
      .on('show.bs.collapse', function () {
        showFired = true
      })

    var $target2 = $('<a role="button" data-toggle="collapse" href="#body2" data-parent="#accordion"/>').appendTo($groups.eq(1))
    var $body2   = $('<div id="body2" class="collapse"/>').appendTo($groups.eq(1))

    $target2.trigger('click')

    $body2
      .toggleClass('in collapsing')
      .data('bs.collapse')._isTransitioning = 1

    $target1.trigger('click')

    setTimeout(function () {
      assert.ok(!showFired, 'show event did not fire')
      done()
    }, 1)
  })

  QUnit.test('should add "collapsed" class to target when collapse is hidden via manual invocation', function (assert) {
    assert.expect(1)
    var done = assert.async()

    var $target = $('<a role="button" data-toggle="collapse" href="#test1"/>').appendTo('#qunit-fixture')

    $('<div id="test1" class="in"/>')
      .appendTo('#qunit-fixture')
      .on('hidden.bs.collapse', function () {
        assert.ok($target.hasClass('collapsed'))
        done()
      })
      .bootstrapCollapse('hide')
  })

  QUnit.test('should remove "collapsed" class from target when collapse is shown via manual invocation', function (assert) {
    assert.expect(1)
    var done = assert.async()

    var $target = $('<a role="button" data-toggle="collapse" class="collapsed" href="#test1"/>').appendTo('#qunit-fixture')

    $('<div id="test1"/>')
      .appendTo('#qunit-fixture')
      .on('shown.bs.collapse', function () {
        assert.ok(!$target.hasClass('collapsed'))
        done()
      })
      .bootstrapCollapse('show')
  })

})
