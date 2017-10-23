$(function () {
  'use strict'

  QUnit.module('Util')

  QUnit.test('Util.jQuery should find window.jQuery if window.$ is not available', function (assert) {
    assert.expect(1)
    delete window.$
    assert.strictEqual(Util.jQuery, window.jQuery)
    window.$ = Util.jQuery
  })

  QUnit.test('Util.jQuery should find window.$ if window.jQuery is not available', function (assert) {
    assert.expect(1)
    delete window.jQuery
    assert.strictEqual(Util.jQuery, window.$)
    window.jQuery = Util.jQuery
  })
})
