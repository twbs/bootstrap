$(function () {
  'use strict'

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
    assert.strictEqual(typeof $.fn.collapse, 'undefined', 'collapse was set back to undefined (org value)')
  })

  QUnit.test('should throw explicit error on undefined method', function (assert) {
    assert.expect(1)
    var $el = $('<div/>')
    $el.bootstrapCollapse()
    try {
      $el.bootstrapCollapse('noMethod')
    } catch (err) {
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

    assert.ok($el.hasClass('show'), 'has class "show"')
    assert.ok(!/height/i.test($el.attr('style')), 'has height reset')
  })

  QUnit.test('should show multiple collapsed elements', function (assert) {
    assert.expect(4)
    var done = assert.async()
    var $target = $('<a role="button" data-toggle="collapse" class="collapsed" href=".multi"/>').appendTo('#qunit-fixture')
    var $el = $('<div class="collapse multi"/>').appendTo('#qunit-fixture')
    var $el2 = $('<div class="collapse multi"/>').appendTo('#qunit-fixture')
    $el.one('shown.bs.collapse', function () {
      assert.ok($el.hasClass('show'), 'has class "show"')
      assert.ok(!/height/i.test($el.attr('style')), 'has height reset')
    })
    $el2.one('shown.bs.collapse', function () {
      assert.ok($el2.hasClass('show'), 'has class "show"')
      assert.ok(!/height/i.test($el2.attr('style')), 'has height reset')
      done()
    })
    EventHandler.trigger($target[0], 'click')
  })

  QUnit.test('should collapse only the first collapse', function (assert) {
    assert.expect(2)
    var done = assert.async()
    var html = [
      '<div class="panel-group" id="accordion1">',
      '<div class="panel">',
      '<div id="collapse1" class="collapse"/>',
      '</div>',
      '</div>',
      '<div class="panel-group" id="accordion2">',
      '<div class="panel">',
      '<div id="collapse2" class="collapse show"/>',
      '</div>',
      '</div>'
    ].join('')
    $(html).appendTo('#qunit-fixture')
    var $el1 = $('#collapse1')
    var $el2 = $('#collapse2')
    $el1.one('shown.bs.collapse', function () {
      assert.ok($el1.hasClass('show'))
      assert.ok($el2.hasClass('show'))
      done()
    }).bootstrapCollapse('show')
  })

  QUnit.test('should hide a collapsed element', function (assert) {
    assert.expect(1)
    var $el = $('<div class="collapse"/>').bootstrapCollapse('hide')

    assert.ok(!$el.hasClass('show'), 'does not have class "show"')
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

  QUnit.test('should reset style to auto after finishing closing collapse', function (assert) {
    assert.expect(1)
    var done = assert.async()

    $('<div class="collapse"/>')
      .on('shown.bs.collapse', function () {
        $(this).bootstrapCollapse('hide')
      })
      .on('hidden.bs.collapse', function () {
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

    EventHandler.trigger($target[0], 'click')
  })

  QUnit.test('should add "collapsed" class to target when collapse is hidden', function (assert) {
    assert.expect(1)
    var done = assert.async()

    var $target = $('<a role="button" data-toggle="collapse" href="#test1"/>').appendTo('#qunit-fixture')

    $('<div id="test1" class="show"/>')
      .appendTo('#qunit-fixture')
      .on('hidden.bs.collapse', function () {
        assert.ok($target.hasClass('collapsed'), 'target has collapsed class')
        done()
      })

    EventHandler.trigger($target[0], 'click')
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

    EventHandler.trigger($target[0], 'click')
  })

  QUnit.test('should add "collapsed" class to all triggers targeting the collapse when the collapse is hidden', function (assert) {
    assert.expect(2)
    var done = assert.async()

    var $target = $('<a role="button" data-toggle="collapse" href="#test1"/>').appendTo('#qunit-fixture')
    var $alt = $('<a role="button" data-toggle="collapse" href="#test1"/>').appendTo('#qunit-fixture')

    $('<div id="test1" class="show"/>')
      .appendTo('#qunit-fixture')
      .on('hidden.bs.collapse', function () {
        assert.ok($target.hasClass('collapsed'), 'target has collapsed class')
        assert.ok($alt.hasClass('collapsed'), 'alt trigger has collapsed class')
        done()
      })

    EventHandler.trigger($target[0], 'click')
  })

  QUnit.test('should not close a collapse when initialized with "show" option if already shown', function (assert) {
    assert.expect(0)
    var done = assert.async()

    var $test = $('<div id="test1" class="show"/>')
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

    $('<div class="collapse show"></div>')
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

    var accordionHTML = '<div id="accordion">' +
        '<div class="card"/>' +
        '<div class="card"/>' +
        '<div class="card"/>' +
        '</div>'
    var $groups = $(accordionHTML).appendTo('#qunit-fixture').find('.card')

    var $target1 = $('<a role="button" data-toggle="collapse" href="#body1" />').appendTo($groups.eq(0))

    $('<div id="body1" class="show" data-parent="#accordion"/>').appendTo($groups.eq(0))

    var $target2 = $('<a class="collapsed" data-toggle="collapse" role="button" href="#body2" />').appendTo($groups.eq(1))

    $('<div id="body2" data-parent="#accordion"/>').appendTo($groups.eq(1))

    var $target3 = $('<a class="collapsed" data-toggle="collapse" role="button" href="#body3" />').appendTo($groups.eq(2))

    $('<div id="body3" data-parent="#accordion"/>')
      .appendTo($groups.eq(2))
      .on('shown.bs.collapse', function () {
        assert.ok($target1.hasClass('collapsed'), 'inactive target 1 does have class "collapsed"')
        assert.ok($target2.hasClass('collapsed'), 'inactive target 2 does have class "collapsed"')
        assert.ok(!$target3.hasClass('collapsed'), 'active target 3 does not have class "collapsed"')

        done()
      })

    EventHandler.trigger($target3[0], 'click')
  })

  QUnit.test('should allow dots in data-parent', function (assert) {
    assert.expect(3)
    var done = assert.async()

    var accordionHTML = '<div class="accordion">' +
        '<div class="card"/>' +
        '<div class="card"/>' +
        '<div class="card"/>' +
        '</div>'
    var $groups = $(accordionHTML).appendTo('#qunit-fixture').find('.card')

    var $target1 = $('<a role="button" data-toggle="collapse" href="#body1"/>').appendTo($groups.eq(0))

    $('<div id="body1" class="show" data-parent=".accordion"/>').appendTo($groups.eq(0))

    var $target2 = $('<a class="collapsed" data-toggle="collapse" role="button" href="#body2"/>').appendTo($groups.eq(1))

    $('<div id="body2" data-parent=".accordion"/>').appendTo($groups.eq(1))

    var $target3 = $('<a class="collapsed" data-toggle="collapse" role="button" href="#body3"/>').appendTo($groups.eq(2))

    $('<div id="body3" data-parent=".accordion"/>')
      .appendTo($groups.eq(2))
      .on('shown.bs.collapse', function () {
        assert.ok($target1.hasClass('collapsed'), 'inactive target 1 does have class "collapsed"')
        assert.ok($target2.hasClass('collapsed'), 'inactive target 2 does have class "collapsed"')
        assert.ok(!$target3.hasClass('collapsed'), 'active target 3 does not have class "collapsed"')

        done()
      })

    EventHandler.trigger($target3[0], 'click')
  })

  QUnit.test('should set aria-expanded="true" on trigger/control when collapse is shown', function (assert) {
    assert.expect(1)
    var done = assert.async()

    var $target = $('<a role="button" data-toggle="collapse" class="collapsed" href="#test1" aria-expanded="false"/>').appendTo('#qunit-fixture')

    $('<div id="test1"/>')
      .appendTo('#qunit-fixture')
      .on('shown.bs.collapse', function () {
        assert.strictEqual($target.attr('aria-expanded'), 'true', 'aria-expanded on target is "true"')
        done()
      })

    EventHandler.trigger($target[0], 'click')
  })

  QUnit.test('should set aria-expanded="false" on trigger/control when collapse is hidden', function (assert) {
    assert.expect(1)
    var done = assert.async()

    var $target = $('<a role="button" data-toggle="collapse" href="#test1" aria-expanded="true"/>').appendTo('#qunit-fixture')

    $('<div id="test1" class="show"/>')
      .appendTo('#qunit-fixture')
      .on('hidden.bs.collapse', function () {
        assert.strictEqual($target.attr('aria-expanded'), 'false', 'aria-expanded on target is "false"')
        done()
      })

    EventHandler.trigger($target[0], 'click')
  })

  QUnit.test('should set aria-expanded="true" on all triggers targeting the collapse when the collapse is shown', function (assert) {
    assert.expect(2)
    var done = assert.async()

    var $target = $('<a role="button" data-toggle="collapse" class="collapsed" href="#test1" aria-expanded="false"/>').appendTo('#qunit-fixture')
    var $alt = $('<a role="button" data-toggle="collapse" class="collapsed" href="#test1" aria-expanded="false"/>').appendTo('#qunit-fixture')

    $('<div id="test1"/>')
      .appendTo('#qunit-fixture')
      .on('shown.bs.collapse', function () {
        assert.strictEqual($target.attr('aria-expanded'), 'true', 'aria-expanded on trigger/control is "true"')
        assert.strictEqual($alt.attr('aria-expanded'), 'true', 'aria-expanded on alternative trigger/control is "true"')
        done()
      })

    EventHandler.trigger($target[0], 'click')
  })

  QUnit.test('should set aria-expanded="false" on all triggers targeting the collapse when the collapse is hidden', function (assert) {
    assert.expect(2)
    var done = assert.async()

    var $target = $('<a role="button" data-toggle="collapse" href="#test1" aria-expanded="true"/>').appendTo('#qunit-fixture')
    var $alt = $('<a role="button" data-toggle="collapse" href="#test1" aria-expanded="true"/>').appendTo('#qunit-fixture')

    $('<div id="test1" class="show"/>')
      .appendTo('#qunit-fixture')
      .on('hidden.bs.collapse', function () {
        assert.strictEqual($target.attr('aria-expanded'), 'false', 'aria-expanded on trigger/control is "false"')
        assert.strictEqual($alt.attr('aria-expanded'), 'false', 'aria-expanded on alternative trigger/control is "false"')
        done()
      })

    EventHandler.trigger($target[0], 'click')
  })

  QUnit.test('should change aria-expanded from active accordion trigger/control to "false" and set the trigger/control for the newly active one to "true"', function (assert) {
    assert.expect(3)
    var done = assert.async()

    var accordionHTML = '<div id="accordion">' +
        '<div class="card"/>' +
        '<div class="card"/>' +
        '<div class="card"/>' +
        '</div>'
    var $groups = $(accordionHTML).appendTo('#qunit-fixture').find('.card')

    var $target1 = $('<a role="button" data-toggle="collapse" aria-expanded="true" href="#body1"/>').appendTo($groups.eq(0))

    $('<div id="body1" class="show" data-parent="#accordion"/>').appendTo($groups.eq(0))

    var $target2 = $('<a role="button" data-toggle="collapse" aria-expanded="false" href="#body2" class="collapsed" aria-expanded="false" />').appendTo($groups.eq(1))

    $('<div id="body2" data-parent="#accordion"/>').appendTo($groups.eq(1))

    var $target3 = $('<a class="collapsed" data-toggle="collapse" aria-expanded="false" role="button" href="#body3"/>').appendTo($groups.eq(2))

    $('<div id="body3" data-parent="#accordion"/>')
      .appendTo($groups.eq(2))
      .on('shown.bs.collapse', function () {
        assert.strictEqual($target1.attr('aria-expanded'), 'false', 'inactive trigger/control 1 has aria-expanded="false"')
        assert.strictEqual($target2.attr('aria-expanded'), 'false', 'inactive trigger/control 2 has aria-expanded="false"')
        assert.strictEqual($target3.attr('aria-expanded'), 'true', 'active trigger/control 3 has aria-expanded="true"')

        done()
      })

    EventHandler.trigger($target3[0], 'click')
  })

  QUnit.test('should not fire show event if show is prevented because other element is still transitioning', function (assert) {
    assert.expect(1)
    var done = assert.async()

    var accordionHTML = '<div id="accordion">' +
        '<div class="card"/>' +
        '<div class="card"/>' +
        '</div>'
    var showFired = false
    var $groups   = $(accordionHTML).appendTo('#qunit-fixture').find('.card')

    var $target1 = $('<a role="button" data-toggle="collapse" href="#body1"/>').appendTo($groups.eq(0))

    $('<div id="body1" class="collapse" data-parent="#accordion"/>')
      .appendTo($groups.eq(0))
      .on('show.bs.collapse', function () {
        showFired = true
      })

    var $target2 = $('<a role="button" data-toggle="collapse" href="#body2"/>').appendTo($groups.eq(1))
    var $body2   = $('<div id="body2" class="collapse" data-parent="#accordion"/>').appendTo($groups.eq(1))

    EventHandler.trigger($target2[0], 'click')

    $body2.toggleClass('show collapsing')
    Data.getData($body2[0], 'bs.collapse')._isTransitioning = true

    EventHandler.trigger($target1[0], 'click')

    setTimeout(function () {
      assert.ok(!showFired, 'show event did not fire')
      done()
    }, 1)
  })

  QUnit.test('should add "collapsed" class to target when collapse is hidden via manual invocation', function (assert) {
    assert.expect(1)
    var done = assert.async()

    var $target = $('<a role="button" data-toggle="collapse" href="#test1"/>').appendTo('#qunit-fixture')

    $('<div id="test1" class="show"/>')
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

  QUnit.test('should allow accordion to use children other than card', function (assert) {
    assert.expect(4)
    var done = assert.async()
    var accordionHTML = '<div id="accordion">' +
        '<div class="item">' +
        '<a id="linkTrigger" data-toggle="collapse" href="#collapseOne" aria-expanded="false" aria-controls="collapseOne"></a>' +
        '<div id="collapseOne" class="collapse" role="tabpanel" aria-labelledby="headingThree" data-parent="#accordion"></div>' +
        '</div>' +
        '<div class="item">' +
        '<a id="linkTriggerTwo" data-toggle="collapse" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo"></a>' +
        '<div id="collapseTwo" class="collapse show" role="tabpanel" aria-labelledby="headingTwo" data-parent="#accordion"></div>' +
        '</div>' +
        '</div>'

    $(accordionHTML).appendTo('#qunit-fixture')
    var $trigger = $('#linkTrigger')
    var $triggerTwo = $('#linkTriggerTwo')
    var $collapseOne = $('#collapseOne')
    var $collapseTwo = $('#collapseTwo')
    $collapseOne.on('shown.bs.collapse', function () {
      assert.ok($collapseOne.hasClass('show'), '#collapseOne is shown')
      assert.ok(!$collapseTwo.hasClass('show'), '#collapseTwo is not shown')
      $collapseTwo.on('shown.bs.collapse', function () {
        assert.ok(!$collapseOne.hasClass('show'), '#collapseOne is not shown')
        assert.ok($collapseTwo.hasClass('show'), '#collapseTwo is shown')
        done()
      })
      EventHandler.trigger($triggerTwo[0], 'click')
    })
    EventHandler.trigger($trigger[0], 'click')
  })

  QUnit.test('should allow accordion to contain nested elements', function (assert) {
    assert.expect(4)
    var done = assert.async()
    var accordionHTML = '<div id="accordion">' +
        '<div class="row">' +
        '<div class="col-lg-6">' +
        '<div class="item">' +
        '<a id="linkTrigger" data-toggle="collapse" href="#collapseOne" aria-expanded="false" aria-controls="collapseOne"></a>' +
        '<div id="collapseOne" class="collapse" role="tabpanel" aria-labelledby="headingThree" data-parent="#accordion"></div>' +
        '</div>' +
        '</div>' +
        '<div class="col-lg-6">' +
        '<div class="item">' +
        '<a id="linkTriggerTwo" data-toggle="collapse" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo"></a>' +
        '<div id="collapseTwo" class="collapse show" role="tabpanel" aria-labelledby="headingTwo" data-parent="#accordion"></div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>'

    $(accordionHTML).appendTo('#qunit-fixture')
    var $trigger = $('#linkTrigger')
    var $triggerTwo = $('#linkTriggerTwo')
    var $collapseOne = $('#collapseOne')
    var $collapseTwo = $('#collapseTwo')

    $collapseOne.on('shown.bs.collapse', function () {
      assert.ok($collapseOne.hasClass('show'), '#collapseOne is shown')
      assert.ok(!$collapseTwo.hasClass('show'), '#collapseTwo is not shown')

      $collapseTwo.on('shown.bs.collapse', function () {
        assert.ok(!$collapseOne.hasClass('show'), '#collapseOne is not shown')
        assert.ok($collapseTwo.hasClass('show'), '#collapseTwo is shown')
        done()
      })
      EventHandler.trigger($triggerTwo[0], 'click')
    })
    EventHandler.trigger($trigger[0], 'click')
  })

  QUnit.test('should allow accordion to target multiple elements', function (assert) {
    assert.expect(8)
    var done = assert.async()
    var accordionHTML = '<div id="accordion">' +
      '<a id="linkTriggerOne" data-toggle="collapse" data-target=".collapseOne" href="#" aria-expanded="false" aria-controls="collapseOne"></a>' +
      '<a id="linkTriggerTwo" data-toggle="collapse" data-target=".collapseTwo" href="#" aria-expanded="false" aria-controls="collapseTwo"></a>' +
      '<div id="collapseOneOne" class="collapse collapseOne" role="tabpanel" data-parent="#accordion"></div>' +
      '<div id="collapseOneTwo" class="collapse collapseOne" role="tabpanel" data-parent="#accordion"></div>' +
      '<div id="collapseTwoOne" class="collapse collapseTwo" role="tabpanel" data-parent="#accordion"></div>' +
      '<div id="collapseTwoTwo" class="collapse collapseTwo" role="tabpanel" data-parent="#accordion"></div>' +
      '</div>'

    $(accordionHTML).appendTo('#qunit-fixture')
    var $trigger = $('#linkTriggerOne')
    var $triggerTwo = $('#linkTriggerTwo')
    var $collapseOneOne = $('#collapseOneOne')
    var $collapseOneTwo = $('#collapseOneTwo')
    var $collapseTwoOne = $('#collapseTwoOne')
    var $collapseTwoTwo = $('#collapseTwoTwo')
    var collapsedElements = {
      one : false,
      two : false
    }

    function firstTest() {
      assert.ok($collapseOneOne.hasClass('show'), '#collapseOneOne is shown')
      assert.ok($collapseOneTwo.hasClass('show'), '#collapseOneTwo is shown')
      assert.ok(!$collapseTwoOne.hasClass('show'), '#collapseTwoOne is not shown')
      assert.ok(!$collapseTwoTwo.hasClass('show'), '#collapseTwoTwo is not shown')
      EventHandler.trigger($triggerTwo[0], 'click')
    }

    function secondTest() {
      assert.ok(!$collapseOneOne.hasClass('show'), '#collapseOneOne is not shown')
      assert.ok(!$collapseOneTwo.hasClass('show'), '#collapseOneTwo is not shown')
      assert.ok($collapseTwoOne.hasClass('show'), '#collapseTwoOne is shown')
      assert.ok($collapseTwoTwo.hasClass('show'), '#collapseTwoTwo is shown')
      done()
    }

    $collapseOneOne.on('shown.bs.collapse', function () {
      if (collapsedElements.one) {
        firstTest()
      } else {
        collapsedElements.one = true
      }
    })

    $collapseOneTwo.on('shown.bs.collapse', function () {
      if (collapsedElements.one) {
        firstTest()
      } else {
        collapsedElements.one = true
      }
    })

    $collapseTwoOne.on('shown.bs.collapse', function () {
      if (collapsedElements.two) {
        secondTest()
      } else {
        collapsedElements.two = true
      }
    })

    $collapseTwoTwo.on('shown.bs.collapse', function () {
      if (collapsedElements.two) {
        secondTest()
      } else {
        collapsedElements.two = true
      }
    })

    EventHandler.trigger($trigger[0], 'click')
  })

  QUnit.test('should collapse accordion children but not nested accordion children', function (assert) {
    assert.expect(9)
    var done = assert.async()
    $('<div id="accordion">' +
        '<div class="item">' +
        '<a id="linkTrigger" data-toggle="collapse" href="#collapseOne" aria-expanded="false" aria-controls="collapseOne"></a>' +
        '<div id="collapseOne" data-parent="#accordion" class="collapse" role="tabpanel" aria-labelledby="headingThree">' +
        '<div id="nestedAccordion">' +
        '<div class="item">' +
        '<a id="nestedLinkTrigger" data-toggle="collapse" href="#nestedCollapseOne" aria-expanded="false" aria-controls="nestedCollapseOne"></a>' +
        '<div id="nestedCollapseOne" data-parent="#nestedAccordion" class="collapse" role="tabpanel" aria-labelledby="headingThree">' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="item">' +
        '<a id="linkTriggerTwo" data-toggle="collapse" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo"></a>' +
        '<div id="collapseTwo" data-parent="#accordion" class="collapse show" role="tabpanel" aria-labelledby="headingTwo"></div>' +
        '</div>' +
        '</div>').appendTo('#qunit-fixture')
    var $trigger = $('#linkTrigger')
    var $triggerTwo = $('#linkTriggerTwo')
    var $nestedTrigger = $('#nestedLinkTrigger')
    var $collapseOne = $('#collapseOne')
    var $collapseTwo = $('#collapseTwo')
    var $nestedCollapseOne = $('#nestedCollapseOne')

    EventHandler.one($collapseOne[0], 'shown.bs.collapse', function () {
      assert.ok($collapseOne.hasClass('show'), '#collapseOne is shown')
      assert.ok(!$collapseTwo.hasClass('show'), '#collapseTwo is not shown')
      assert.ok(!$('#nestedCollapseOne').hasClass('show'), '#nestedCollapseOne is not shown')

      EventHandler.one($nestedCollapseOne[0], 'shown.bs.collapse', function () {
        assert.ok($collapseOne.hasClass('show'), '#collapseOne is shown')
        assert.ok(!$collapseTwo.hasClass('show'), '#collapseTwo is not shown')
        assert.ok($nestedCollapseOne.hasClass('show'), '#nestedCollapseOne is shown')
        EventHandler.one($collapseTwo[0], 'shown.bs.collapse', function () {
          assert.ok(!$collapseOne.hasClass('show'), '#collapseOne is not shown')
          assert.ok($collapseTwo.hasClass('show'), '#collapseTwo is shown')
          assert.ok($nestedCollapseOne.hasClass('show'), '#nestedCollapseOne is shown')
          done()
        })
        EventHandler.trigger($triggerTwo[0], 'click')
      })
      EventHandler.trigger($nestedTrigger[0], 'click')
    })
    EventHandler.trigger($trigger[0], 'click')
  })

  QUnit.test('should not prevent event for input', function (assert) {
    assert.expect(3)
    var done = assert.async()
    var $target = $('<input type="checkbox" data-toggle="collapse" data-target="#collapsediv1" />').appendTo('#qunit-fixture')
    var $collapse = $('<div id="collapsediv1"/>').appendTo('#qunit-fixture')

    EventHandler.one($collapse[0], 'shown.bs.collapse', function () {
      assert.ok($collapse.hasClass('show'))
      assert.ok($target.attr('aria-expanded') === 'true')
      assert.ok($target.prop('checked'))
      done()
    })

    $target.trigger($.Event('click'))
  })

  QUnit.test('should add "collapsed" class to triggers only when all the targeted collapse are hidden', function (assert) {
    assert.expect(9)
    var done = assert.async()

    var $trigger1 = $('<a role="button" data-toggle="collapse" href="#test1"/>').appendTo('#qunit-fixture')
    var $trigger2 = $('<a role="button" data-toggle="collapse" href="#test2"/>').appendTo('#qunit-fixture')
    var $trigger3 = $('<a role="button" data-toggle="collapse" href=".multi"/>').appendTo('#qunit-fixture')

    var $target1 = $('<div id="test1" class="multi"/>').appendTo('#qunit-fixture')
    var $target2 = $('<div id="test2" class="multi"/>').appendTo('#qunit-fixture')

    $target2.one('shown.bs.collapse', function () {
      assert.ok(!$trigger1.hasClass('collapsed'), 'trigger1 does not have collapsed class')
      assert.ok(!$trigger2.hasClass('collapsed'), 'trigger2 does not have collapsed class')
      assert.ok(!$trigger3.hasClass('collapsed'), 'trigger3 does not have collapsed class')
      $target2.one('hidden.bs.collapse', function () {
        assert.ok(!$trigger1.hasClass('collapsed'), 'trigger1 does not have collapsed class')
        assert.ok($trigger2.hasClass('collapsed'), 'trigger2 has collapsed class')
        assert.ok(!$trigger3.hasClass('collapsed'), 'trigger3 does not have collapsed class')
        $target1.one('hidden.bs.collapse', function () {
          assert.ok($trigger1.hasClass('collapsed'), 'trigger1 has collapsed class')
          assert.ok($trigger2.hasClass('collapsed'), 'trigger2 has collapsed class')
          assert.ok($trigger3.hasClass('collapsed'), 'trigger3 has collapsed class')
          done()
        })
        EventHandler.trigger($trigger1[0], 'click')
      })
      EventHandler.trigger($trigger2[0], 'click')
    })
    EventHandler.trigger($trigger3[0], 'click')
  })

  QUnit.test('should set aria-expanded="true" to triggers targeting shown collaspe and aria-expanded="false" only when all the targeted collapses are shown', function (assert) {
    assert.expect(9)
    var done = assert.async()

    var $trigger1 = $('<a role="button" data-toggle="collapse" href="#test1"/>').appendTo('#qunit-fixture')
    var $trigger2 = $('<a role="button" data-toggle="collapse" href="#test2"/>').appendTo('#qunit-fixture')
    var $trigger3 = $('<a role="button" data-toggle="collapse" href=".multi"/>').appendTo('#qunit-fixture')

    var $target1 = $('<div id="test1" class="multi collapse"/>').appendTo('#qunit-fixture')
    var $target2 = $('<div id="test2" class="multi collapse"/>').appendTo('#qunit-fixture')

    $target2.one('shown.bs.collapse', function () {
      assert.strictEqual($trigger1.attr('aria-expanded'), 'true', 'aria-expanded on trigger1 is "true"')
      assert.strictEqual($trigger2.attr('aria-expanded'), 'true', 'aria-expanded on trigger2 is "true"')
      assert.strictEqual($trigger3.attr('aria-expanded'), 'true', 'aria-expanded on trigger3 is "true"')
      $target2.one('hidden.bs.collapse', function () {
        assert.strictEqual($trigger1.attr('aria-expanded'), 'true', 'aria-expanded on trigger1 is "true"')
        assert.strictEqual($trigger2.attr('aria-expanded'), 'false', 'aria-expanded on trigger2 is "false"')
        assert.strictEqual($trigger3.attr('aria-expanded'), 'true', 'aria-expanded on trigger3 is "true"')
        $target1.one('hidden.bs.collapse', function () {
          assert.strictEqual($trigger1.attr('aria-expanded'), 'false', 'aria-expanded on trigger1 is "fasle"')
          assert.strictEqual($trigger2.attr('aria-expanded'), 'false', 'aria-expanded on trigger2 is "false"')
          assert.strictEqual($trigger3.attr('aria-expanded'), 'false', 'aria-expanded on trigger3 is "false"')
          done()
        })
        EventHandler.trigger($trigger1[0], 'click')
      })
      EventHandler.trigger($trigger2[0], 'click')
    })
    EventHandler.trigger($trigger3[0], 'click')
  })

  QUnit.test('should not prevent interactions inside the collapse element', function (assert) {
    assert.expect(2)
    var done = assert.async()

    var $target = $('<input type="checkbox" data-toggle="collapse" data-target="#collapsediv1" />').appendTo('#qunit-fixture')
    var htmlCollapse =
      '<div id="collapsediv1" class="collapse">' +
      ' <input type="checkbox" id="testCheckbox" />' +
      '</div>'
    var $collapse = $(htmlCollapse).appendTo('#qunit-fixture')

    EventHandler.one($collapse[0], 'shown.bs.collapse', function () {
      assert.ok($target.prop('checked'), '$trigger is checked')
      var $testCheckbox = $('#testCheckbox')
      $testCheckbox.trigger($.Event('click'))
      setTimeout(function () {
        assert.ok($testCheckbox.prop('checked'), '$testCheckbox is checked too')
        done()
      }, 5)
    })
    $target.trigger($.Event('click'))
  })

  QUnit.test('should allow jquery object in parent config', function (assert) {
    assert.expect(1)
    var html =
    '<div class="my-collapse">' +
    '  <div class="item">' +
    '    <a data-toggle="collapse" href="#">Toggle item</a>' +
    '    <div class="collapse">Lorem ipsum</div>' +
    '  </div>' +
    '</div>'

    $(html).appendTo('#qunit-fixture')
    try {
      $('[data-toggle="collapse"]').bootstrapCollapse({
        parent: $('.my-collapse')
      })
      assert.ok(true, 'collapse correctly created')
    } catch (err) {
      assert.ok(false, 'collapse not created')
    }
  })

  QUnit.test('should allow DOM object in parent config', function (assert) {
    assert.expect(1)
    var html =
    '<div class="my-collapse">' +
    '  <div class="item">' +
    '    <a data-toggle="collapse" href="#">Toggle item</a>' +
    '    <div class="collapse">Lorem ipsum</div>' +
    '  </div>' +
    '</div>'

    $(html).appendTo('#qunit-fixture')
    try {
      $('[data-toggle="collapse"]').bootstrapCollapse({
        parent: $('.my-collapse')[0]
      })
      assert.ok(true, 'collapse correctly created')
    } catch (err) {
      assert.ok(false, 'collapse not created')
    }
  })
})
