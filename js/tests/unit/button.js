$(function () {
  'use strict'

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

  QUnit.test('should not toggle aria-pressed on buttons with disabled class', function (assert) {
    assert.expect(2)
    var $btn = $('<button class="btn disabled" data-toggle="button" aria-pressed="false">redux</button>')
    assert.strictEqual($btn.attr('aria-pressed'), 'false', 'btn aria-pressed state is false')
    $btn.bootstrapButton('toggle')
    assert.strictEqual($btn.attr('aria-pressed'), 'false', 'btn aria-pressed state is still false')
  })

  QUnit.test('should not toggle aria-pressed on buttons that are disabled', function (assert) {
    assert.expect(2)
    var $btn = $('<button class="btn" data-toggle="button" aria-pressed="false" disabled>redux</button>')
    assert.strictEqual($btn.attr('aria-pressed'), 'false', 'btn aria-pressed state is false')
    $btn.bootstrapButton('toggle')
    assert.strictEqual($btn.attr('aria-pressed'), 'false', 'btn aria-pressed state is still false')
  })

  QUnit.test('should toggle aria-pressed on buttons with container', function (assert) {
    assert.expect(1)
    var groupHTML = '<div class="btn-group" data-toggle="buttons">' +
        '<button id="btn1" class="btn btn-secondary" type="button">One</button>' +
        '<button class="btn btn-secondary" type="button">Two</button>' +
      '</div>'
    $('#qunit-fixture').append(groupHTML)
    $('#btn1').bootstrapButton('toggle')
    assert.strictEqual($('#btn1').attr('aria-pressed'), 'true')
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

  QUnit.test('should assign active class on page load to buttons with aria-pressed="true"', function (assert) {
    assert.expect(1)
    var done = assert.async()
    var $btn = $('<button class="btn" data-toggle="button" aria-pressed="true">mdo</button>')
    $btn.appendTo('#qunit-fixture')
    $(window).trigger($.Event('load'))
    setTimeout(function () {
      assert.ok($btn.hasClass('active'), 'button with aria-pressed="true" has been given class active')
      done()
    }, 5)
  })

  QUnit.test('should assign active class on page load to button checkbox with checked attribute', function (assert) {
    assert.expect(1)
    var done = assert.async()
    var groupHTML = '<div class="btn-group" data-toggle="buttons">' +
      '<label class="btn btn-primary">' +
      '<input type="checkbox" id="radio" checked> Checkbox' +
      '</label>' +
      '</div>'
    var $group = $(groupHTML).appendTo('#qunit-fixture')
    var $btn = $group.children().eq(0)

    $(window).trigger($.Event('load'))
    setTimeout(function () {
      assert.ok($btn.hasClass('active'), 'checked checkbox button has been given class active')
      done()
    }, 5)
  })

  QUnit.test('should remove active class on page load from buttons without aria-pressed="true"', function (assert) {
    assert.expect(1)
    var done = assert.async()
    var $btn = $('<button class="btn active" data-toggle="button" aria-pressed="false">mdo</button>')
    $btn.appendTo('#qunit-fixture')
    $(window).trigger($.Event('load'))
    setTimeout(function () {
      assert.ok(!$btn.hasClass('active'), 'button without aria-pressed="true" has had active class removed')
      done()
    }, 5)
  })

  QUnit.test('should remove active class on page load from button checkbox without checked attribute', function (assert) {
    assert.expect(1)
    var done = assert.async()
    var groupHTML = '<div class="btn-group" data-toggle="buttons">' +
      '<label class="btn btn-primary active">' +
      '<input type="checkbox" id="radio"> Checkbox' +
      '</label>' +
      '</div>'
    var $group = $(groupHTML).appendTo('#qunit-fixture')
    var $btn = $group.children().eq(0)

    $(window).trigger($.Event('load'))
    setTimeout(function () {
      assert.ok(!$btn.hasClass('active'), 'unchecked checkbox button has had active class removed')
      done()
    }, 5)
  })

  QUnit.test('should trigger input change event when toggled button has input field', function (assert) {
    assert.expect(1)
    var done = assert.async()

    var groupHTML = '<div class="btn-group" data-toggle="buttons">' +
      '<label class="btn btn-primary">' +
      '<input type="radio" id="radio">Radio' +
      '</label>' +
      '</div>'
    var $group = $(groupHTML).appendTo('#qunit-fixture')

    $group.find('input').on('change', function (e) {
      e.preventDefault()
      assert.ok(true, 'change event fired')
      done()
    })

    $group.find('label').trigger('click')
  })

  QUnit.test('should check for closest matching toggle', function (assert) {
    assert.expect(18)
    var groupHTML = '<div class="btn-group" data-toggle="buttons">' +
      '<label class="btn btn-primary active">' +
      '<input type="radio" name="options" id="option1" checked="true"> Option 1' +
      '</label>' +
      '<label class="btn btn-primary">' +
      '<input type="radio" name="options" id="option2"> Option 2' +
      '</label>' +
      '<label class="btn btn-primary">' +
      '<input type="radio" name="options" id="option3"> Option 3' +
      '</label>' +
      '</div>'
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

    $btn2.find('input').trigger('click') // Clicking an already checked radio should not un-check it
    assert.ok(!$btn1.hasClass('active'), 'btn1 does not have active class')
    assert.ok(!$btn1.find('input').prop('checked'), 'btn1 is not checked')
    assert.ok($btn2.hasClass('active'), 'btn2 has active class')
    assert.ok($btn2.find('input').prop('checked'), 'btn2 is checked')
    $btn1.bootstrapButton('toggle')
    assert.ok($btn1.hasClass('active'), 'btn1 has active class')
    assert.ok($btn1.find('input').prop('checked'), 'btn1 prop is checked')
    assert.ok($btn1.find('input')[0].checked, 'btn1 is checked with jquery')
    assert.ok(!$btn2.hasClass('active'), 'btn2 does not have active class')
    assert.ok(!$btn2.find('input').prop('checked'), 'btn2 is not checked')
    assert.ok(!$btn2.find('input')[0].checked, 'btn2 is not checked')
  })

  QUnit.test('should not add aria-pressed on labels for radio/checkbox inputs in a data-toggle="buttons" group', function (assert) {
    assert.expect(2)
    var groupHTML = '<div class="btn-group" data-toggle="buttons">' +
      '<label class="btn btn-primary"><input type="checkbox"> Checkbox</label>' +
      '<label class="btn btn-primary"><input type="radio" name="options"> Radio</label>' +
      '</div>'
    var $group = $(groupHTML).appendTo('#qunit-fixture')

    var $btn1 = $group.children().eq(0)
    var $btn2 = $group.children().eq(1)

    $btn1.find('input').trigger('click')
    assert.ok($btn1.is(':not([aria-pressed])'), 'label for nested checkbox input has not been given an aria-pressed attribute')

    $btn2.find('input').trigger('click')
    assert.ok($btn2.is(':not([aria-pressed])'), 'label for nested radio input has not been given an aria-pressed attribute')
  })

  QUnit.test('should handle disabled attribute on non-button elements', function (assert) {
    assert.expect(4)
    var groupHTML = '<div class="btn-group disabled" data-toggle="buttons" aria-disabled="true" disabled>' +
      '<label class="btn btn-danger disabled">' +
      '<input type="checkbox" aria-disabled="true" disabled>' +
      '</label>' +
      '</div>'
    var $group = $(groupHTML).appendTo('#qunit-fixture')

    var $btn = $group.children().eq(0)
    var $input = $btn.children().eq(0)

    assert.ok($btn.is(':not(.active)'), 'button is initially not active')
    assert.ok(!$input.prop('checked'), 'checkbox is initially not checked')
    $btn[0].click() // fire a real click on the DOM node itself, not a click() on the jQuery object that just aliases to trigger('click')
    assert.ok($btn.is(':not(.active)'), 'button did not become active')
    assert.ok(!$input.prop('checked'), 'checkbox did not get checked')
  })

  QUnit.test('should not set active class if inner hidden checkbox is disabled but author forgot to set disabled class on outer button', function (assert) {
    assert.expect(4)
    var groupHTML = '<div class="btn-group" data-toggle="buttons">' +
      '<label class="btn btn-danger">' +
      '<input type="checkbox" disabled>' +
      '</label>' +
      '</div>'
    var $group = $(groupHTML).appendTo('#qunit-fixture')

    var $btn = $group.children().eq(0)
    var $input = $btn.children().eq(0)

    assert.ok($btn.is(':not(.active)'), 'button is initially not active')
    assert.ok(!$input.prop('checked'), 'checkbox is initially not checked')
    $btn[0].click() // fire a real click on the DOM node itself, not a click() on the jQuery object that just aliases to trigger('click')
    assert.ok($btn.is(':not(.active)'), 'button did not become active')
    assert.ok(!$input.prop('checked'), 'checkbox did not get checked')
  })

  QUnit.test('should correctly set checked state on input and active class on label when using <label><input></label> structure', function (assert) {
    assert.expect(4)
    var groupHTML = '<div class="btn-group" data-toggle="buttons">' +
      '<label class="btn">' +
      '<input type="checkbox">' +
      '</label>' +
      '</div>'
    var $group = $(groupHTML).appendTo('#qunit-fixture')

    var $label = $group.children().eq(0)
    var $input = $label.children().eq(0)

    assert.ok($label.is(':not(.active)'), 'label is initially not active')
    assert.ok(!$input.prop('checked'), 'checkbox is initially not checked')
    $label[0].click() // fire a real click on the DOM node itself, not a click() on the jQuery object that just aliases to trigger('click')
    assert.ok($label.is('.active'), 'label is active after click')
    assert.ok($input.prop('checked'), 'checkbox is checked after click')
  })

  QUnit.test('should correctly set checked state on input and active class on the faked button when using <div><input></div> structure', function (assert) {
    assert.expect(4)
    var groupHTML = '<div class="btn-group" data-toggle="buttons">' +
      '<div class="btn">' +
      '<input type="checkbox" aria-label="Check">' +
      '</div>' +
      '</div>'
    var $group = $(groupHTML).appendTo('#qunit-fixture')

    var $btn = $group.children().eq(0)
    var $input = $btn.children().eq(0)

    assert.ok($btn.is(':not(.active)'), '<div> is initially not active')
    assert.ok(!$input.prop('checked'), 'checkbox is initially not checked')
    $btn[0].click() // fire a real click on the DOM node itself, not a click() on the jQuery object that just aliases to trigger('click')
    assert.ok($btn.is('.active'), '<div> is active after click')
    assert.ok($input.prop('checked'), 'checkbox is checked after click')
  })

  QUnit.test('should correctly set checked state on input and active class on the label when using button toggle', function (assert) {
    assert.expect(6)
    var groupHTML = '<div class="btn-group" data-toggle="buttons">' +
        '<label class="btn">' +
          '<input type="checkbox">' +
        '</label>' +
      '</div>'
    var $group = $(groupHTML).appendTo('#qunit-fixture')

    var $btn = $group.children().eq(0)
    var $input = $btn.children().eq(0)

    assert.ok($btn.is(':not(.active)'), '<label> is initially not active')
    assert.ok(!$input.prop('checked'), 'checkbox property is initially not checked')
    assert.ok(!$input[0].checked, 'checkbox is not checked by jquery after click')
    $btn.bootstrapButton('toggle')
    assert.ok($btn.is('.active'), '<label> is active after click')
    assert.ok($input.prop('checked'), 'checkbox property is checked after click')
    assert.ok($input[0].checked, 'checkbox is checked by jquery after click')
  })

  QUnit.test('should not do anything if the click was just sent to the outer container with data-toggle', function (assert) {
    assert.expect(4)
    var groupHTML = '<div class="btn-group" data-toggle="buttons">' +
      '<label class="btn">' +
      '<input type="checkbox">' +
      '</label>' +
      '</div>'
    var $group = $(groupHTML).appendTo('#qunit-fixture')

    var $label = $group.children().eq(0)
    var $input = $label.children().eq(0)

    assert.ok($label.is(':not(.active)'), 'label is initially not active')
    assert.ok(!$input.prop('checked'), 'checkbox is initially not checked')
    $group[0].click() // fire a real click on the DOM node itself, not a click() on the jQuery object that just aliases to trigger('click')
    assert.ok($label.is(':not(.active)'), 'label is not active after click')
    assert.ok(!$input.prop('checked'), 'checkbox is not checked after click')
  })

  QUnit.test('should not try and set checked property on an input of type="hidden"', function (assert) {
    assert.expect(2)
    var groupHTML = '<div class="btn-group" data-toggle="buttons">' +
      '<label class="btn">' +
      '<input type="hidden">' +
      '</label>' +
      '</div>'
    var $group = $(groupHTML).appendTo('#qunit-fixture')

    var $label = $group.children().eq(0)
    var $input = $label.children().eq(0)

    assert.ok(!$input.prop('checked'), 'hidden input initially has no checked property')
    $label[0].click() // fire a real click on the DOM node itself, not a click() on the jQuery object that just aliases to trigger('click')
    assert.ok(!$input.prop('checked'), 'hidden input does not have a checked property')
  })

  QUnit.test('should not try and set checked property on an input that is not a radio button or checkbox', function (assert) {
    assert.expect(2)
    var groupHTML = '<div class="btn-group" data-toggle="buttons">' +
      '<label class="btn">' +
      '<input type="text">' +
      '</label>' +
      '</div>'
    var $group = $(groupHTML).appendTo('#qunit-fixture')

    var $label = $group.children().eq(0)
    var $input = $label.children().eq(0)

    assert.ok(!$input.prop('checked'), 'text input initially has no checked property')
    $label[0].click() // fire a real click on the DOM node itself, not a click() on the jQuery object that just aliases to trigger('click')
    assert.ok(!$input.prop('checked'), 'text input does not have a checked property')
  })

  QUnit.test('dispose should remove data and the element', function (assert) {
    assert.expect(2)

    var $el = $('<div/>')
    var $button = $el.bootstrapButton()

    assert.ok(typeof $button.data('bs.button') !== 'undefined')

    $button.data('bs.button').dispose()

    assert.ok(typeof $button.data('bs.button') === 'undefined')
  })

  QUnit.test('should return button version', function (assert) {
    assert.expect(1)

    if (typeof Button !== 'undefined') {
      assert.ok(typeof Button.VERSION === 'string')
    } else {
      assert.notOk()
    }
  })
})
