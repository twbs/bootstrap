$(function () {
  'use strict'

  var Button = typeof window.bootstrap === 'undefined' ? window.Button : window.bootstrap.Button

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
      $('#qunit-fixture').html('')
    }
  })

  QUnit.test('should provide no conflict', function (assert) {
    assert.expect(1)
    assert.strictEqual(typeof $.fn.button, 'undefined', 'button was set back to undefined (org value)')
  })

  QUnit.test('should return jquery collection containing the element', function (assert) {
    assert.expect(2)
    var $el = $('<div/>')
    var $button = $el.bootstrapButton()
    assert.ok($button instanceof $, 'returns jquery collection')
    assert.strictEqual($button[0], $el[0], 'collection contains element')
  })

  QUnit.test('should toggle active and aria-pressed (testing using bootStrapButton(\'toggle\') rather than click())', function (assert) {
    assert.expect(4)
    var $btn = $('<button class="btn" data-toggle="button" aria-pressed="false">mdo</button>')
    assert.ok(!$btn.hasClass('active'), 'initial btn does not have active class')
    assert.strictEqual($btn.attr('aria-pressed'), 'false', 'initial btn aria-pressed state is false')
    $btn.bootstrapButton('toggle')
    assert.ok($btn.hasClass('active'), 'after toggle btn has class active')
    assert.strictEqual($btn.attr('aria-pressed'), 'true', 'after toggle btn aria-pressed state is true')
  })

  QUnit.test('should toggle active and aria-pressed for <button>', function (assert) {
    assert.expect(4)
    var $btn = $('<button class="btn" data-toggle="button" aria-pressed="false">mdo</button>')
    $btn.appendTo('#qunit-fixture')
    assert.ok(!$btn.hasClass('active'), 'initial btn does not have active class')
    assert.strictEqual($btn.attr('aria-pressed'), 'false', 'initial btn aria-pressed state is false')
    $btn[0].click()
    assert.ok($btn.hasClass('active'), 'after click btn has class active')
    assert.strictEqual($btn.attr('aria-pressed'), 'true', 'after click btn aria-pressed state is true')
  })

  QUnit.test('should toggle active and aria-pressed for <div> faked button', function (assert) {
    assert.expect(4)
    var $btn = $('<div tabindex="0" role="button" class="btn" data-toggle="button" aria-pressed="false">faker</div>')
    $btn.appendTo('#qunit-fixture')
    assert.ok(!$btn.hasClass('active'), 'initial btn does not have active class')
    assert.strictEqual($btn.attr('aria-pressed'), 'false', 'initial btn aria-pressed state is false')
    $btn[0].click() // in real-world use, authors will need to add custom keyboard handling to actually fire the click() when pressing ENTER/SPACE
    assert.ok($btn.hasClass('active'), 'after click btn has class active')
    assert.strictEqual($btn.attr('aria-pressed'), 'true', 'after click btn aria-pressed state is true')
  })

  QUnit.test('should toggle active and aria-pressed for <a href="#"> faked button', function (assert) {
    assert.expect(4)
    var $btn = $('<a href="#" tabindex="0" role="button" class="btn" data-toggle="button" aria-pressed="false">faker</a>')
    $btn.appendTo('#qunit-fixture')
    assert.ok(!$btn.hasClass('active'), 'initial btn does not have active class')
    assert.strictEqual($btn.attr('aria-pressed'), 'false', 'initial btn aria-pressed state is false')
    $btn[0].click()
    assert.ok($btn.hasClass('active'), 'after click btn has class active')
    assert.strictEqual($btn.attr('aria-pressed'), 'true', 'after click btn aria-pressed state is true')
  })

  QUnit.test('should toggle active and aria-pressed when btn children are clicked', function (assert) {
    assert.expect(4)
    var $btn = $('<button class="btn" data-toggle="button" aria-pressed="false">mdo</button>')
    var $inner = $('<i/>')
    $btn
      .append($inner)
      .appendTo('#qunit-fixture')
    assert.ok(!$btn.hasClass('active'), 'initial btn does not have active class')
    assert.strictEqual($btn.attr('aria-pressed'), 'false', 'initial btn aria-pressed state is false')
    $inner[0].click()
    assert.ok($btn.hasClass('active'), 'after click btn has class active')
    assert.strictEqual($btn.attr('aria-pressed'), 'true', 'after click btn aria-pressed state is true')
  })

  QUnit.test('should add aria-pressed and set to true if original button didn\'t have it', function (assert) {
    assert.expect(1)
    var $btn = $('<button class="btn" data-toggle="button">forgetful</button>')
    $btn.appendTo('#qunit-fixture')
    $btn[0].click()
    assert.strictEqual($btn.attr('aria-pressed'), 'true', 'btn has aria-pressed and it\'s set to true')
  })

  QUnit.test('should not toggle active nor aria-pressed on buttons with disabled class', function (assert) {
    assert.expect(4)
    var $btn = $('<button class="btn disabled" data-toggle="button" aria-pressed="false">redux</button>')
    $btn.appendTo('#qunit-fixture')
    assert.ok(!$btn.hasClass('active'), 'initial btn does not have active class')
    assert.strictEqual($btn.attr('aria-pressed'), 'false', 'initial btn aria-pressed state is false')
    $btn[0].click()
    assert.ok(!$btn.hasClass('active'), 'after click btn still does not have active class')
    assert.strictEqual($btn.attr('aria-pressed'), 'false', 'after click btn aria-pressed state is still false')
  })

  QUnit.test('should not toggle active nor aria-pressed on buttons that are disabled', function (assert) {
    assert.expect(4)
    var $btn = $('<button class="btn" data-toggle="button" aria-pressed="false" disabled>redux</button>')
    $btn.appendTo('#qunit-fixture')
    assert.ok(!$btn.hasClass('active'), 'initial btn does not have active class')
    assert.strictEqual($btn.attr('aria-pressed'), 'false', 'initial btn aria-pressed state is false')
    $btn[0].click()
    assert.ok(!$btn.hasClass('active'), 'after click btn still does not have active class')
    assert.strictEqual($btn.attr('aria-pressed'), 'false', 'after click btn aria-pressed state is still false')
  })

  QUnit.test('should not toggle active nor aria-pressed for <a href="#"> faked button with disabled class', function (assert) {
    assert.expect(4)
    var $btn = $('<a tabindex="0" role="button" class="btn disabled" data-toggle="button" aria-pressed="false">faker</a>')
    $btn.appendTo('#qunit-fixture')
    assert.ok(!$btn.hasClass('active'), 'initial btn does not have active class')
    assert.strictEqual($btn.attr('aria-pressed'), 'false', 'initial btn aria-pressed state is false')
    $btn[0].click()
    assert.ok(!$btn.hasClass('active'), 'after click btn still does not have active class')
    assert.strictEqual($btn.attr('aria-pressed'), 'false', 'after click btn aria-pressed state is still false')
  })

  QUnit.test('dispose should remove data and the element', function (assert) {
    assert.expect(2)

    var $el = $('<div/>')
    var $button = $el.bootstrapButton()

    assert.ok(typeof Button._getInstance($button[0]) !== 'undefined')

    Button._getInstance($button[0]).dispose()

    assert.ok(Button._getInstance($button[0]) === null)
  })

  QUnit.test('should return the version', function (assert) {
    assert.expect(1)
    assert.strictEqual(typeof Button.VERSION, 'string')
  })
})
