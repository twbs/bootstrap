$(function () {
  'use strict'

  QUnit.module('data')

  QUnit.test('should be defined', function (assert) {
    assert.expect(1)
    assert.ok(Data, 'Data is defined')
  })

  QUnit.test('should set data in a element', function (assert) {
    assert.expect(1)

    var $div = $('<div />').appendTo('#qunit-fixture')
    var data = {
      test: 'bsData'
    }
    Data.setData($div[0], 'test', data)

    assert.ok($div[0].key, 'element have a data key')
  })

  QUnit.test('should get data from an element', function (assert) {
    assert.expect(1)

    var $div = $('<div />').appendTo('#qunit-fixture')
    var data = {
      test: 'bsData'
    }
    Data.setData($div[0], 'test', data)

    assert.strictEqual(Data.getData($div[0], 'test'), data)
  })

  QUnit.test('should return null if nothing is stored', function (assert) {
    assert.expect(1)
    assert.ok(Data.getData(document.body, 'test') === null)
  })

  QUnit.test('should return null if nothing is stored with an existing key', function (assert) {
    assert.expect(1)

    var $div = $('<div />').appendTo('#qunit-fixture')
    $div[0].key = {
      key: 'test2',
      data: 'woot woot'
    }

    assert.ok(Data.getData($div[0], 'test') === null)
  })

  QUnit.test('should delete data', function (assert) {
    assert.expect(2)

    var $div = $('<div />').appendTo('#qunit-fixture')
    var data = {
      test: 'bsData'
    }
    Data.setData($div[0], 'test', data)
    assert.ok(Data.getData($div[0], 'test') !== null)

    Data.removeData($div[0], 'test')
    assert.ok(Data.getData($div[0], 'test') === null)
  })

  QUnit.test('should delete nothing if there are nothing', function (assert) {
    assert.expect(0)

    Data.removeData(document.body, 'test')
  })

  QUnit.test('should delete nothing if not the good key', function (assert) {
    assert.expect(0)

    var $div = $('<div />').appendTo('#qunit-fixture')
    $div[0].key = {
      key: 'test2',
      data: 'woot woot'
    }

    Data.removeData($div[0], 'test')
  })
})
