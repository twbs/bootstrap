$(function () {
  'use strict'

  QUnit.module('selectorEngine')

  QUnit.test('should be defined', function (assert) {
    assert.expect(1)
    assert.ok(SelectorEngine, 'Manipulator is defined')
  })

  QUnit.test('should determine if an element match the selector', function (assert) {
    assert.expect(2)
    $('<input type="checkbox" /> <button class="btn"></button>').appendTo('#qunit-fixture')

    assert.ok(!SelectorEngine.matches($('#qunit-fixture')[0], '.btn'))
    assert.ok(SelectorEngine.matches($('.btn')[0], '.btn'))
  })

  QUnit.test('should find the selector, according to an element or not', function (assert) {
    assert.expect(3)
    $('<input type="checkbox" /> <button class="btn"></button>').appendTo('#qunit-fixture')

    var btn = $('.btn').first()[0]
    assert.strictEqual(SelectorEngine.find($('.btn')), null)
    assert.equal(SelectorEngine.find('.btn')[0], btn)
    assert.equal(SelectorEngine.find('.btn', $('#qunit-fixture')[0])[0], btn)
  })

  QUnit.test('should find the first element which match the selector, according to an element or not', function (assert) {
    assert.expect(3)
    $('<button class="btn">btn1</button> <button class="btn">btn2</button>').appendTo('#qunit-fixture')

    var btn = $('.btn').first()[0]
    assert.strictEqual(SelectorEngine.findOne($('.btn')), null)
    assert.equal(SelectorEngine.findOne('.btn'), btn)
    assert.equal(SelectorEngine.findOne('.btn', $('#qunit-fixture')[0]), btn)
  })

  QUnit.test('should find children', function (assert) {
    assert.expect(2)
    $('<button class="btn">btn1</button> <button class="btn">btn2</button> <input type="text" />').appendTo('#qunit-fixture')

    assert.strictEqual(SelectorEngine.children($('.btn')), null)
    assert.equal(SelectorEngine.children($('#qunit-fixture')[0], '.btn').length, 2)
  })

  QUnit.test('should find the selector in parents', function (assert) {
    assert.expect(2)

    $('<input type="text" />').appendTo('#qunit-fixture')
    assert.strictEqual(SelectorEngine.parents($('.container')[0], {}), null)
    assert.strictEqual(SelectorEngine.parents($('input')[0], 'body').length, 1)
  })

  QUnit.test('should find the closest element according to the selector', function (assert) {
    assert.expect(2)
    var html =
      '<div class="test">' +
      '  <button class="btn"></button>' +
      '</div>'

    $(html).appendTo('#qunit-fixture')
    assert.strictEqual(SelectorEngine.closest($('.btn')[0], {}), null)
    assert.strictEqual(SelectorEngine.closest($('.btn')[0], '.test'), $('.test')[0])
  })

  QUnit.test('should fin previous element', function (assert) {
    assert.expect(2)
    var html =
      '<div class="test"></div>' +
      '<button class="btn"></button>'

    $(html).appendTo('#qunit-fixture')
    assert.strictEqual(SelectorEngine.prev($('.btn')[0], {}), null)
    assert.strictEqual(SelectorEngine.prev($('.btn')[0], '.test')[0], $('.test')[0])
  })
})
