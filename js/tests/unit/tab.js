$(function () {
  'use strict';

  module('tabs plugin')

  test('should be defined on jquery object', function () {
    ok($(document.body).tab, 'tabs method is defined')
  })

  module('tabs', {
    setup: function () {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.bootstrapTab = $.fn.tab.noConflict()
    },
    teardown: function () {
      $.fn.tab = $.fn.bootstrapTab
      delete $.fn.bootstrapTab
    }
  })

  test('should provide no conflict', function () {
    strictEqual($.fn.tab, undefined, 'tab was set back to undefined (org value)')
  })

  test('should return jquery collection containing the element', function () {
    var $el = $('<div/>')
    var $tab = $el.bootstrapTab()
    ok($tab instanceof $, 'returns jquery collection')
    strictEqual($tab[0], $el[0], 'collection contains element')
  })

  test('should activate element by tab id', function () {
    var tabsHTML = '<ul class="tabs">'
        + '<li><a href="#home">Home</a></li>'
        + '<li><a href="#profile">Profile</a></li>'
        + '</ul>'

    $('<ul><li id="home"/><li id="profile"/></ul>').appendTo('#qunit-fixture')

    $(tabsHTML).find('li:last a').bootstrapTab('show')
    equal($('#qunit-fixture').find('.active').attr('id'), 'profile')

    $(tabsHTML).find('li:first a').bootstrapTab('show')
    equal($('#qunit-fixture').find('.active').attr('id'), 'home')
  })

  test('should activate element by tab id', function () {
    var pillsHTML = '<ul class="pills">'
        + '<li><a href="#home">Home</a></li>'
        + '<li><a href="#profile">Profile</a></li>'
        + '</ul>'

    $('<ul><li id="home"/><li id="profile"/></ul>').appendTo('#qunit-fixture')

    $(pillsHTML).find('li:last a').bootstrapTab('show')
    equal($('#qunit-fixture').find('.active').attr('id'), 'profile')

    $(pillsHTML).find('li:first a').bootstrapTab('show')
    equal($('#qunit-fixture').find('.active').attr('id'), 'home')
  })

  test('should not fire shown when show is prevented', function (assert) {
    var done = assert.async()

    $('<div class="tab"/>')
      .on('show.bs.tab', function (e) {
        e.preventDefault()
        ok(true, 'show event fired')
        done()
      })
      .on('shown.bs.tab', function () {
        ok(false, 'shown event fired')
      })
      .bootstrapTab('show')
  })

  test('show and shown events should reference correct relatedTarget', function (assert) {
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
          equal(e.relatedTarget.hash, '#1-1', 'references correct element as relatedTarget')
        })
        .on('shown.bs.tab', function (e) {
          equal(e.relatedTarget.hash, '#1-1', 'references correct element as relatedTarget')
          done()
        })
        .bootstrapTab('show')
  })

  test('should fire hide and hidden events', function (assert) {
    var done = assert.async()

    var tabsHTML = '<ul class="tabs">'
        + '<li><a href="#home">Home</a></li>'
        + '<li><a href="#profile">Profile</a></li>'
        + '</ul>'

    $(tabsHTML)
      .find('li:first a')
        .on('hide.bs.tab', function () {
          ok(true, 'hide event fired')
        })
        .bootstrapTab('show')
      .end()
      .find('li:last a')
        .bootstrapTab('show')

    $(tabsHTML)
      .find('li:first a')
        .on('hidden.bs.tab', function () {
          ok(true, 'hidden event fired')
          done()
        })
        .bootstrapTab('show')
      .end()
      .find('li:last a')
        .bootstrapTab('show')
  })

  test('should not fire hidden when hide is prevented', function (assert) {
    var done = assert.async()

    var tabsHTML = '<ul class="tabs">'
        + '<li><a href="#home">Home</a></li>'
        + '<li><a href="#profile">Profile</a></li>'
        + '</ul>'

    $(tabsHTML)
      .find('li:first a')
        .on('hide.bs.tab', function (e) {
          e.preventDefault()
          ok(true, 'hide event fired')
          done()
        })
        .on('hidden.bs.tab', function () {
          ok(false, 'hidden event fired')
        })
        .bootstrapTab('show')
      .end()
      .find('li:last a')
        .bootstrapTab('show')
  })

  test('hide and hidden events contain correct relatedTarget', function (assert) {
    var done = assert.async()

    var tabsHTML = '<ul class="tabs">'
        + '<li><a href="#home">Home</a></li>'
        + '<li><a href="#profile">Profile</a></li>'
        + '</ul>'

    $(tabsHTML)
      .find('li:first a')
        .on('hide.bs.tab', function (e) {
          equal(e.relatedTarget.hash, '#profile', 'references correct element as relatedTarget')
        })
        .on('hidden.bs.tab', function (e) {
          equal(e.relatedTarget.hash, '#profile', 'references correct element as relatedTarget')
          done()
        })
        .bootstrapTab('show')
      .end()
      .find('li:last a')
        .bootstrapTab('show')
  })

  test('selected tab should have aria-expanded', function () {
    var tabsHTML = '<ul class="nav nav-tabs">'
        + '<li class="active"><a href="#home" toggle="tab" aria-expanded="true">Home</a></li>'
        + '<li><a href="#profile" toggle="tab" aria-expanded="false">Profile</a></li>'
        + '</ul>'
    var $tabs = $(tabsHTML).appendTo('#qunit-fixture')

    $tabs.find('li:first a').bootstrapTab('show')
    equal($tabs.find('.active a').attr('aria-expanded'), 'true', 'shown tab has aria-expanded = true')
    equal($tabs.find('li:not(.active) a').attr('aria-expanded'), 'false', 'hidden tab has aria-expanded = false')

    $tabs.find('li:last a').click()
    equal($tabs.find('.active a').attr('aria-expanded'), 'true', 'after click, shown tab has aria-expanded = true')
    equal($tabs.find('li:not(.active) a').attr('aria-expanded'), 'false', 'after click, hidden tab has aria-expanded = false')

    $tabs.find('li:first a').bootstrapTab('show')
    equal($tabs.find('.active a').attr('aria-expanded'), 'true', 'shown tab has aria-expanded = true')
    equal($tabs.find('li:not(.active) a').attr('aria-expanded'), 'false', 'hidden tab has aria-expanded = false')

    $tabs.find('li:first a').click()
    equal($tabs.find('.active a').attr('aria-expanded'), 'true', 'after second show event, shown tab still has aria-expanded = true')
    equal($tabs.find('li:not(.active) a').attr('aria-expanded'), 'false', 'after second show event, hidden tab has aria-expanded = false')
  })

})
