$(function () {
  'use strict'

  window.Util = typeof bootstrap !== 'undefined' ? bootstrap.Util : Util

  QUnit.module('util', {
    afterEach: function () {
      $('#qunit-fixture').html('')
    }
  })

  QUnit.test('Util.getSelectorFromElement should return the correct element', function (assert) {
    assert.expect(2)

    var $el = $('<div data-target="body"></div>').appendTo($('#qunit-fixture'))
    assert.strictEqual(Util.getSelectorFromElement($el[0]), 'body')

    // Not found element
    var $el2 = $('<div data-target="#fakeDiv"></div>').appendTo($('#qunit-fixture'))
    assert.strictEqual(Util.getSelectorFromElement($el2[0]), null)
  })

  QUnit.test('Util.getSelectorFromElement should throw error when there is a bad selector', function (assert) {
    assert.expect(2)

    var $el = $('<div data-target="#1"></div>').appendTo($('#qunit-fixture'))

    try {
      assert.ok(true, 'trying to use a bad selector')
      Util.getSelectorFromElement($el[0])
    } catch (e) {
      assert.ok(e instanceof DOMException)
    }
  })

  QUnit.test('Util.typeCheckConfig should thrown an error when a bad config is passed', function (assert) {
    assert.expect(1)
    var namePlugin = 'collapse'
    var defaultType = {
      toggle: 'boolean',
      parent: '(string|element)'
    }
    var config = {
      toggle: true,
      parent: 777
    }

    try {
      Util.typeCheckConfig(namePlugin, config, defaultType)
    } catch (err) {
      assert.strictEqual(err.message, 'COLLAPSE: Option "parent" provided type "number" but expected type "(string|element)".')
    }
  })

  QUnit.test('Util.isElement should check if we passed an element or not', function (assert) {
    assert.expect(3)
    var $div = $('<div id="test"></div>').appendTo($('#qunit-fixture'))

    assert.strictEqual(Util.isElement($div), 1)
    assert.strictEqual(Util.isElement($div[0]), 1)
    assert.strictEqual(typeof Util.isElement({}) === 'undefined', true)
  })

  QUnit.test('Util.getTransitionDurationFromElement should accept transition durations in milliseconds', function (assert) {
    assert.expect(1)
    var $div = $('<div style="transition: all 300ms ease-out;"></div>').appendTo($('#qunit-fixture'))

    assert.strictEqual(Util.getTransitionDurationFromElement($div[0]), 300)
  })

  QUnit.test('Util.getTransitionDurationFromElement should accept transition durations in seconds', function (assert) {
    assert.expect(1)
    var $div = $('<div style="transition: all .4s ease-out;"></div>').appendTo($('#qunit-fixture'))

    assert.strictEqual(Util.getTransitionDurationFromElement($div[0]), 400)
  })

  QUnit.test('Util.getTransitionDurationFromElement should return the addition of transition-delay and transition-duration', function (assert) {
    assert.expect(2)
    var $fixture = $('#qunit-fixture')
    var $div = $('<div style="transition: all 0s 150ms ease-out;"></div>').appendTo($fixture)
    var $div2 = $('<div style="transition: all .25s 30ms ease-out;"></div>').appendTo($fixture)

    assert.strictEqual(Util.getTransitionDurationFromElement($div[0]), 150)
    assert.strictEqual(Util.getTransitionDurationFromElement($div2[0]), 280)
  })

  QUnit.test('Util.getTransitionDurationFromElement should get the first transition duration if multiple transition durations are defined', function (assert) {
    assert.expect(1)
    var $div = $('<div style="transition: transform .3s ease-out, opacity .2s;"></div>').appendTo($('#qunit-fixture'))

    assert.strictEqual(Util.getTransitionDurationFromElement($div[0]), 300)
  })

  QUnit.test('Util.getTransitionDurationFromElement should return 0 if transition duration is not defined', function (assert) {
    assert.expect(1)
    var $div = $('<div></div>').appendTo($('#qunit-fixture'))

    assert.strictEqual(Util.getTransitionDurationFromElement($div[0]), 0)
  })

  QUnit.test('Util.getTransitionDurationFromElement should return 0 if element is not found in DOM', function (assert) {
    assert.expect(1)
    var $div = $('#fake-id')

    assert.strictEqual(Util.getTransitionDurationFromElement($div[0]), 0)
  })

  QUnit.test('Util.getUID should generate a new id uniq', function (assert) {
    assert.expect(2)
    var id = Util.getUID('test')
    var id2 = Util.getUID('test')

    assert.ok(id !== id2, id + ' !== ' + id2)

    id = Util.getUID('test')
    $('<div id="' + id + '"></div>').appendTo($('#qunit-fixture'))

    id2 = Util.getUID('test')
    assert.ok(id !== id2, id + ' !== ' + id2)
  })

  QUnit.test('Util.supportsTransitionEnd should return true', function (assert) {
    assert.expect(1)
    assert.ok(Util.supportsTransitionEnd())
  })
})
