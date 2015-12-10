$(function () {
  'use strict';

  QUnit.module('tabs plugin')

  QUnit.test('should be defined on jquery object', function (assert) {
    assert.expect(1)
    assert.ok($(document.body).tab, 'tabs method is defined')
  })

  QUnit.module('tabs', {
    beforeEach: function () {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.bootstrapTab = $.fn.tab.noConflict()
    },
    afterEach: function () {
      $.fn.tab = $.fn.bootstrapTab
      delete $.fn.bootstrapTab
    }
  })

  QUnit.test('should provide no conflict', function (assert) {
    assert.expect(1)
    assert.strictEqual($.fn.tab, undefined, 'tab was set back to undefined (org value)')
  })

  QUnit.test('should throw explicit error on undefined method', function (assert) {
    assert.expect(1)
    var $el = $('<div/>')
    $el.bootstrapTab()
    try {
      $el.bootstrapTab('noMethod')
    }
    catch (err) {
      assert.strictEqual(err.message, 'No method named "noMethod"')
    }
  })

  QUnit.test('should return jquery collection containing the element', function (assert) {
    assert.expect(2)
    var $el = $('<div/>')
    var $tab = $el.bootstrapTab()
    assert.ok($tab instanceof $, 'returns jquery collection')
    assert.strictEqual($tab[0], $el[0], 'collection contains element')
  })

  QUnit.test('should activate element by tab id', function (assert) {
    assert.expect(2)
    var tabsHTML = '<ul class="tabs">'
        + '<li><a href="#home">Home</a></li>'
        + '<li><a href="#profile">Profile</a></li>'
        + '</ul>'

    $('<ul><li id="home"/><li id="profile"/></ul>').appendTo('#qunit-fixture')

    $(tabsHTML).find('li:last a').bootstrapTab('show')
    assert.strictEqual($('#qunit-fixture').find('.active').attr('id'), 'profile')

    $(tabsHTML).find('li:first a').bootstrapTab('show')
    assert.strictEqual($('#qunit-fixture').find('.active').attr('id'), 'home')
  })

  QUnit.test('should activate element by tab id', function (assert) {
    assert.expect(2)
    var pillsHTML = '<ul class="pills">'
        + '<li><a href="#home">Home</a></li>'
        + '<li><a href="#profile">Profile</a></li>'
        + '</ul>'

    $('<ul><li id="home"/><li id="profile"/></ul>').appendTo('#qunit-fixture')

    $(pillsHTML).find('li:last a').bootstrapTab('show')
    assert.strictEqual($('#qunit-fixture').find('.active').attr('id'), 'profile')

    $(pillsHTML).find('li:first a').bootstrapTab('show')
    assert.strictEqual($('#qunit-fixture').find('.active').attr('id'), 'home')
  })

  QUnit.test('should not fire shown when show is prevented', function (assert) {
    assert.expect(1)
    var done = assert.async()

    $('<div class="tab"/>')
      .on('show.bs.tab', function (e) {
        e.preventDefault()
        assert.ok(true, 'show event fired')
        done()
      })
      .on('shown.bs.tab', function () {
        assert.ok(false, 'shown event fired')
      })
      .bootstrapTab('show')
  })

  QUnit.test('show and shown events should reference correct relatedTarget', function (assert) {
    assert.expect(2)
    var done = assert.async()

    var dropHTML = '<ul class="drop">'
        + '<li class="dropdown"><a data-toggle="dropdown" href="#">1</a>'
        + '<ul class="dropdown-menu">'
        + '<li><a href="#1-1" data-toggle="tab">1-1</a></li>'
        + '<li><a href="#1-2" data-toggle="tab">1-2</a></li>'
        + '</ul>'
        + '</li>'
        + '</ul>'

    $(dropHTML)
      .find('ul > li:first a')
        .bootstrapTab('show')
      .end()
      .find('ul > li:last a')
        .on('show.bs.tab', function (e) {
          assert.strictEqual(e.relatedTarget.hash, '#1-1', 'references correct element as relatedTarget')
        })
        .on('shown.bs.tab', function (e) {
          assert.strictEqual(e.relatedTarget.hash, '#1-1', 'references correct element as relatedTarget')
          done()
        })
        .bootstrapTab('show')
  })

  QUnit.test('should fire hide and hidden events', function (assert) {
    assert.expect(2)
    var done = assert.async()

    var tabsHTML = '<ul class="tabs">'
        + '<li><a href="#home">Home</a></li>'
        + '<li><a href="#profile">Profile</a></li>'
        + '</ul>'

    $(tabsHTML)
      .find('li:first a')
        .on('hide.bs.tab', function () {
          assert.ok(true, 'hide event fired')
        })
        .bootstrapTab('show')
      .end()
      .find('li:last a')
        .bootstrapTab('show')

    $(tabsHTML)
      .find('li:first a')
        .on('hidden.bs.tab', function () {
          assert.ok(true, 'hidden event fired')
          done()
        })
        .bootstrapTab('show')
      .end()
      .find('li:last a')
        .bootstrapTab('show')
  })

  QUnit.test('should not fire hidden when hide is prevented', function (assert) {
    assert.expect(1)
    var done = assert.async()

    var tabsHTML = '<ul class="tabs">'
        + '<li><a href="#home">Home</a></li>'
        + '<li><a href="#profile">Profile</a></li>'
        + '</ul>'

    $(tabsHTML)
      .find('li:first a')
        .on('hide.bs.tab', function (e) {
          e.preventDefault()
          assert.ok(true, 'hide event fired')
          done()
        })
        .on('hidden.bs.tab', function () {
          assert.ok(false, 'hidden event fired')
        })
        .bootstrapTab('show')
      .end()
      .find('li:last a')
        .bootstrapTab('show')
  })

  QUnit.test('hide and hidden events contain correct relatedTarget', function (assert) {
    assert.expect(2)
    var done = assert.async()

    var tabsHTML = '<ul class="tabs">'
        + '<li><a href="#home">Home</a></li>'
        + '<li><a href="#profile">Profile</a></li>'
        + '</ul>'

    $(tabsHTML)
      .find('li:first a')
        .on('hide.bs.tab', function (e) {
          assert.strictEqual(e.relatedTarget.hash, '#profile', 'references correct element as relatedTarget')
        })
        .on('hidden.bs.tab', function (e) {
          assert.strictEqual(e.relatedTarget.hash, '#profile', 'references correct element as relatedTarget')
          done()
        })
        .bootstrapTab('show')
      .end()
      .find('li:last a')
        .bootstrapTab('show')
  })

  QUnit.test('selected tab should have aria-expanded', function (assert) {
    assert.expect(8)
    var tabsHTML = '<ul class="nav nav-tabs">'
        + '<li><a class="nav-item active" href="#home" toggle="tab" aria-expanded="true">Home</a></li>'
        + '<li><a class="nav-item" href="#profile" toggle="tab" aria-expanded="false">Profile</a></li>'
        + '</ul>'
    var $tabs = $(tabsHTML).appendTo('#qunit-fixture')

    $tabs.find('li:first a').bootstrapTab('show')
    assert.strictEqual($tabs.find('.active').attr('aria-expanded'), 'true', 'shown tab has aria-expanded = true')
    assert.strictEqual($tabs.find('a:not(.active)').attr('aria-expanded'), 'false', 'hidden tab has aria-expanded = false')

    $tabs.find('li:last a').trigger('click')
    assert.strictEqual($tabs.find('.active').attr('aria-expanded'), 'true', 'after click, shown tab has aria-expanded = true')
    assert.strictEqual($tabs.find('a:not(.active)').attr('aria-expanded'), 'false', 'after click, hidden tab has aria-expanded = false')

    $tabs.find('li:first a').bootstrapTab('show')
    assert.strictEqual($tabs.find('.active').attr('aria-expanded'), 'true', 'shown tab has aria-expanded = true')
    assert.strictEqual($tabs.find('a:not(.active)').attr('aria-expanded'), 'false', 'hidden tab has aria-expanded = false')

    $tabs.find('li:first a').trigger('click')
    assert.strictEqual($tabs.find('.active').attr('aria-expanded'), 'true', 'after second show event, shown tab still has aria-expanded = true')
    assert.strictEqual($tabs.find('a:not(.active)').attr('aria-expanded'), 'false', 'after second show event, hidden tab has aria-expanded = false')
  })

})
