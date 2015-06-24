$(function () {
  'use strict';

  QUnit.module('button plugin')

  QUnit.test('should be defined on jquery object', function (assert) {
    assert.expect(1)
    assert.ok($(document.body).button, 'button method is defined')
  })

  QUnit.module('button', {
    beforeEach: function () {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.bootstrapButton = $.fn.button.noConflict()
    },
    afterEach: function () {
      $.fn.button = $.fn.bootstrapButton
      delete $.fn.bootstrapButton
    }
  })

  QUnit.test('should provide no conflict', function (assert) {
    assert.expect(1)
    assert.strictEqual($.fn.button, undefined, 'button was set back to undefined (org value)')
  })

  QUnit.test('should return jquery collection containing the element', function (assert) {
    assert.expect(2)
    var $el = $('<div/>')
    var $button = $el.bootstrapButton()
    assert.ok($button instanceof $, 'returns jquery collection')
    assert.strictEqual($button[0], $el[0], 'collection contains element')
  })

  QUnit.test('should return set state to loading', function (assert) {
    assert.expect(4)
    var $btn = $('<button class="btn" data-loading-text="fat">mdo</button>')
    assert.strictEqual($btn.html(), 'mdo', 'btn text equals mdo')
    $btn.bootstrapButton('loading')
    var done = assert.async()
    setTimeout(function () {
      assert.strictEqual($btn.html(), 'fat', 'btn text equals fat')
      assert.ok($btn[0].hasAttribute('disabled'), 'btn is disabled')
      assert.ok($btn.hasClass('disabled'), 'btn has disabled class')
      done()
    }, 0)
  })

  QUnit.test('should return reset state', function (assert) {
    assert.expect(7)
    var $btn = $('<button class="btn" data-loading-text="fat">mdo</button>')
    assert.strictEqual($btn.html(), 'mdo', 'btn text equals mdo')
    $btn.bootstrapButton('loading')
    var doneOne = assert.async()
    setTimeout(function () {
      assert.strictEqual($btn.html(), 'fat', 'btn text equals fat')
      assert.ok($btn[0].hasAttribute('disabled'), 'btn is disabled')
      assert.ok($btn.hasClass('disabled'), 'btn has disabled class')
      doneOne()
      var doneTwo = assert.async()
      $btn.bootstrapButton('reset')
      setTimeout(function () {
        assert.strictEqual($btn.html(), 'mdo', 'btn text equals mdo')
        assert.ok(!$btn[0].hasAttribute('disabled'), 'btn is not disabled')
        assert.ok(!$btn.hasClass('disabled'), 'btn does not have disabled class')
        doneTwo()
      }, 0)
    }, 0)
  })

  QUnit.test('should work with an empty string as reset state', function (assert) {
    assert.expect(7)
    var $btn = $('<button class="btn" data-loading-text="fat"/>')
    assert.strictEqual($btn.html(), '', 'btn text equals ""')
    $btn.bootstrapButton('loading')
    var doneOne = assert.async()
    setTimeout(function () {
      assert.strictEqual($btn.html(), 'fat', 'btn text equals fat')
      assert.ok($btn[0].hasAttribute('disabled'), 'btn is disabled')
      assert.ok($btn.hasClass('disabled'), 'btn has disabled class')
      doneOne()
      var doneTwo = assert.async()
      $btn.bootstrapButton('reset')
      setTimeout(function () {
        assert.strictEqual($btn.html(), '', 'btn text equals ""')
        assert.ok(!$btn[0].hasAttribute('disabled'), 'btn is not disabled')
        assert.ok(!$btn.hasClass('disabled'), 'btn does not have disabled class')
        doneTwo()
      }, 0)
    }, 0)
  })

  QUnit.test('should toggle active', function (assert) {
    assert.expect(2)
    var $btn = $('<button class="btn" data-toggle="button">mdo</button>')
    assert.ok(!$btn.hasClass('active'), 'btn does not have active class')
    $btn.bootstrapButton('toggle')
    assert.ok($btn.hasClass('active'), 'btn has class active')
  })

  QUnit.test('should toggle active when btn children are clicked', function (assert) {
    assert.expect(2)
    var $btn = $('<button class="btn" data-toggle="button">mdo</button>')
    var $inner = $('<i/>')
    $btn
      .append($inner)
      .appendTo('#qunit-fixture')
    assert.ok(!$btn.hasClass('active'), 'btn does not have active class')
    $inner.trigger('click')
    assert.ok($btn.hasClass('active'), 'btn has class active')
  })

  QUnit.test('should toggle aria-pressed', function (assert) {
    assert.expect(2)
    var $btn = $('<button class="btn" data-toggle="button" aria-pressed="false">redux</button>')
    assert.strictEqual($btn.attr('aria-pressed'), 'false', 'btn aria-pressed state is false')
    $btn.bootstrapButton('toggle')
    assert.strictEqual($btn.attr('aria-pressed'), 'true', 'btn aria-pressed state is true')
  })

  QUnit.test('should toggle aria-pressed when btn children are clicked', function (assert) {
    assert.expect(2)
    var $btn = $('<button class="btn" data-toggle="button" aria-pressed="false">redux</button>')
    var $inner = $('<i/>')
    $btn
      .append($inner)
      .appendTo('#qunit-fixture')
    assert.strictEqual($btn.attr('aria-pressed'), 'false', 'btn aria-pressed state is false')
    $inner.trigger('click')
    assert.strictEqual($btn.attr('aria-pressed'), 'true', 'btn aria-pressed state is true')
  })

  QUnit.test('should check for closest matching toggle', function (assert) {
    assert.expect(12)
    var groupHTML = '<div class="btn-group" data-toggle="buttons">'
      + '<label class="btn btn-primary active">'
      + '<input type="radio" name="options" id="option1" checked="true"> Option 1'
      + '</label>'
      + '<label class="btn btn-primary">'
      + '<input type="radio" name="options" id="option2"> Option 2'
      + '</label>'
      + '<label class="btn btn-primary">'
      + '<input type="radio" name="options" id="option3"> Option 3'
      + '</label>'
      + '</div>'
    var $group = $(groupHTML).appendTo('#qunit-fixture')

    var $btn1 = $group.children().eq(0)
    var $btn2 = $group.children().eq(1)

    assert.ok($btn1.hasClass('active'), 'btn1 has active class')
    assert.ok($btn1.find('input').prop('checked'), 'btn1 is checked')
    assert.ok(!$btn2.hasClass('active'), 'btn2 does not have active class')
    assert.ok(!$btn2.find('input').prop('checked'), 'btn2 is not checked')
    $btn2.find('input').trigger('click')
    assert.ok(!$btn1.hasClass('active'), 'btn1 does not have active class')
    assert.ok(!$btn1.find('input').prop('checked'), 'btn1 is not checked')
    assert.ok($btn2.hasClass('active'), 'btn2 has active class')
    assert.ok($btn2.find('input').prop('checked'), 'btn2 is checked')

    $btn2.find('input').trigger('click') // clicking an already checked radio should not un-check it
    assert.ok(!$btn1.hasClass('active'), 'btn1 does not have active class')
    assert.ok(!$btn1.find('input').prop('checked'), 'btn1 is not checked')
    assert.ok($btn2.hasClass('active'), 'btn2 has active class')
    assert.ok($btn2.find('input').prop('checked'), 'btn2 is checked')
  })

})
