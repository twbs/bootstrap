$(function () {
  'use strict'

  QUnit.module('manipulator')

  QUnit.test('should be defined', function (assert) {
    assert.expect(1)
    assert.ok(Manipulator, 'Manipulator is defined')
  })

  QUnit.test('should set data attribute', function (assert) {
    assert.expect(1)

    var $div = $('<div />').appendTo('#qunit-fixture')

    Manipulator.setDataAttribute($div[0], 'test', 'test')

    assert.strictEqual($div[0].getAttribute('data-test'), 'test')
  })

  QUnit.test('should set data attribute in lower case', function (assert) {
    assert.expect(1)

    var $div = $('<div />').appendTo('#qunit-fixture')

    Manipulator.setDataAttribute($div[0], 'tEsT', 'test')

    assert.strictEqual($div[0].getAttribute('data-test'), 'test')
  })

  QUnit.test('should get data attribute', function (assert) {
    assert.expect(2)

    var $div = $('<div data-test="null" />').appendTo('#qunit-fixture')

    assert.strictEqual(Manipulator.getDataAttribute($div[0], 'test'), null)

    var $div2 = $('<div data-test2="js" />').appendTo('#qunit-fixture')

    assert.strictEqual(Manipulator.getDataAttribute($div2[0], 'tEst2'), 'js')
  })

  QUnit.test('should get data attributes', function (assert) {
    assert.expect(4)

    var $div = $('<div data-test="js" data-test2="js2" />').appendTo('#qunit-fixture')
    var $div2 = $('<div data-test3="js" data-test4="js2" />').appendTo('#qunit-fixture')
    var $div3 = $('<div attri="1" />').appendTo('#qunit-fixture')

    assert.propEqual(Manipulator.getDataAttributes($div[0]), {
      test: 'js',
      test2: 'js2'
    })

    assert.propEqual(Manipulator.getDataAttributes(null), {})
    assert.propEqual(Manipulator.getDataAttributes($div2[0]), {
      test3: 'js',
      test4: 'js2'
    })
    assert.propEqual(Manipulator.getDataAttributes($div3[0]), {})
  })

  QUnit.test('should remove data attribute', function (assert) {
    assert.expect(2)

    var $div = $('<div />').appendTo('#qunit-fixture')

    Manipulator.setDataAttribute($div[0], 'test', 'test')

    assert.strictEqual($div[0].getAttribute('data-test'), 'test')

    Manipulator.removeDataAttribute($div[0], 'test')

    assert.strictEqual($div[0].getAttribute('data-test'), null)
  })

  QUnit.test('should remove data attribute in lower case', function (assert) {
    assert.expect(2)

    var $div = $('<div />').appendTo('#qunit-fixture')

    Manipulator.setDataAttribute($div[0], 'test', 'test')

    assert.strictEqual($div[0].getAttribute('data-test'), 'test')

    Manipulator.removeDataAttribute($div[0], 'tESt')

    assert.strictEqual($div[0].getAttribute('data-test'), null)
  })

  QUnit.test('should return element offsets', function (assert) {
    assert.expect(2)

    var $div = $('<div />').appendTo('#qunit-fixture')

    var offset = Manipulator.offset($div[0])

    assert.ok(typeof offset.top === 'number')
    assert.ok(typeof offset.left === 'number')
  })

  QUnit.test('should return element position', function (assert) {
    assert.expect(2)

    var $div = $('<div />').appendTo('#qunit-fixture')

    var offset = Manipulator.position($div[0])

    assert.ok(typeof offset.top === 'number')
    assert.ok(typeof offset.left === 'number')
  })

  QUnit.test('should toggle class', function (assert) {
    assert.expect(2)

    var $div = $('<div class="test" />').appendTo('#qunit-fixture')

    Manipulator.toggleClass($div[0], 'test')

    assert.ok(!$div.hasClass('test'))

    Manipulator.toggleClass($div[0], 'test')

    assert.ok($div.hasClass('test'))

    Manipulator.toggleClass(null)
  })
})
