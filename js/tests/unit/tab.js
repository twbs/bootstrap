$(function () {
  'use strict'

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
    assert.strictEqual(typeof $.fn.tab, 'undefined', 'tab was set back to undefined (org value)')
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
    var tabsHTML = '<ul class="nav">'
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
    var pillsHTML = '<ul class="nav nav-pills">'
        + '<li><a href="#home">Home</a></li>'
        + '<li><a href="#profile">Profile</a></li>'
        + '</ul>'

    $('<ul><li id="home"/><li id="profile"/></ul>').appendTo('#qunit-fixture')

    $(pillsHTML).find('li:last a').bootstrapTab('show')
    assert.strictEqual($('#qunit-fixture').find('.active').attr('id'), 'profile')

    $(pillsHTML).find('li:first a').bootstrapTab('show')
    assert.strictEqual($('#qunit-fixture').find('.active').attr('id'), 'home')
  })

  QUnit.test('should activate element by tab id in ordered list', function (assert) {
    assert.expect(2)
    var pillsHTML = '<ol class="nav nav-pills">'
        + '<li><a href="#home">Home</a></li>'
        + '<li><a href="#profile">Profile</a></li>'
        + '</ol>'

    $('<ol><li id="home"/><li id="profile"/></ol>').appendTo('#qunit-fixture')

    $(pillsHTML).find('li:last a').bootstrapTab('show')
    assert.strictEqual($('#qunit-fixture').find('.active').attr('id'), 'profile')

    $(pillsHTML).find('li:first a').bootstrapTab('show')
    assert.strictEqual($('#qunit-fixture').find('.active').attr('id'), 'home')
  })

  QUnit.test('should activate element by tab id in nav list', function (assert) {
    assert.expect(2)
    var tabsHTML =  '<nav class="nav">' +
                      '<a href="#home">Home</a>' +
                      '<a href="#profile">Profile</a>' +
                    '</nav>'

    $('<nav><div id="home"></div><div id="profile"></div></nav>').appendTo('#qunit-fixture')

    $(tabsHTML).find('a:last').bootstrapTab('show')
    assert.strictEqual($('#qunit-fixture').find('.active').attr('id'), 'profile')

    $(tabsHTML).find('a:first').bootstrapTab('show')
    assert.strictEqual($('#qunit-fixture').find('.active').attr('id'), 'home')
  })

  QUnit.test('should activate element by tab id in list group', function (assert) {
    assert.expect(2)
    var tabsHTML =  '<div class="list-group">' +
                      '<a href="#home">Home</a>' +
                      '<a href="#profile">Profile</a>' +
                    '</div>'

    $('<nav><div id="home"></div><div id="profile"></div></nav>').appendTo('#qunit-fixture')

    $(tabsHTML).find('a:last').bootstrapTab('show')
    assert.strictEqual($('#qunit-fixture').find('.active').attr('id'), 'profile')

    $(tabsHTML).find('a:first').bootstrapTab('show')
    assert.strictEqual($('#qunit-fixture').find('.active').attr('id'), 'home')
  })

  QUnit.test('should not fire shown when show is prevented', function (assert) {
    assert.expect(1)
    var done = assert.async()

    $('<div class="nav"/>')
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

  QUnit.test('should not fire shown when tab is already active', function (assert) {
    assert.expect(0)
    var tabsHTML = '<ul class="nav nav-tabs" role="tablist">'
      + '<li class="nav-item"><a href="#home" class="nav-link active" role="tab">Home</a></li>'
      + '<li class="nav-item"><a href="#profile" class="nav-link" role="tab">Profile</a></li>'
      + '</ul>'
      + '<div class="tab-content">'
      + '<div class="tab-pane active" id="home" role="tabpanel"></div>'
      + '<div class="tab-pane" id="profile" role="tabpanel"></div>'
      + '</div>'

    $(tabsHTML)
      .find('a.active')
      .on('shown.bs.tab', function () {
        assert.ok(true, 'shown event fired')
      })
      .bootstrapTab('show')
  })

  QUnit.test('should not fire shown when tab is disabled', function (assert) {
    assert.expect(0)
    var tabsHTML = '<ul class="nav nav-tabs" role="tablist">'
      + '<li class="nav-item"><a href="#home" class="nav-link active" role="tab">Home</a></li>'
      + '<li class="nav-item"><a href="#profile" class="nav-link disabled" role="tab">Profile</a></li>'
      + '</ul>'
      + '<div class="tab-content">'
      + '<div class="tab-pane active" id="home" role="tabpanel"></div>'
      + '<div class="tab-pane" id="profile" role="tabpanel"></div>'
      + '</div>'

    $(tabsHTML)
      .find('a.disabled')
      .on('shown.bs.tab', function () {
        assert.ok(true, 'shown event fired')
      })
      .bootstrapTab('show')
  })

  QUnit.test('show and shown events should reference correct relatedTarget', function (assert) {
    assert.expect(2)
    var done = assert.async()

    var dropHTML =
          '<ul class="drop nav">'
        + '  <li class="dropdown"><a data-toggle="dropdown" href="#">1</a>'
        + '    <ul class="dropdown-menu nav">'
        + '      <li><a href="#1-1" data-toggle="tab">1-1</a></li>'
        + '      <li><a href="#1-2" data-toggle="tab">1-2</a></li>'
        + '    </ul>'
        + '  </li>'
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

    var tabsHTML = '<ul class="nav">'
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

    var tabsHTML = '<ul class="nav">'
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

    var tabsHTML = '<ul class="nav">'
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

  QUnit.test('selected tab should have aria-selected', function (assert) {
    assert.expect(8)
    var tabsHTML = '<ul class="nav nav-tabs">'
        + '<li><a class="nav-item active" href="#home" toggle="tab" aria-selected="true">Home</a></li>'
        + '<li><a class="nav-item" href="#profile" toggle="tab" aria-selected="false">Profile</a></li>'
        + '</ul>'
    var $tabs = $(tabsHTML).appendTo('#qunit-fixture')

    $tabs.find('li:first a').bootstrapTab('show')
    assert.strictEqual($tabs.find('.active').attr('aria-selected'), 'true', 'shown tab has aria-selected = true')
    assert.strictEqual($tabs.find('a:not(.active)').attr('aria-selected'), 'false', 'hidden tab has aria-selected = false')

    $tabs.find('li:last a').trigger('click')
    assert.strictEqual($tabs.find('.active').attr('aria-selected'), 'true', 'after click, shown tab has aria-selected = true')
    assert.strictEqual($tabs.find('a:not(.active)').attr('aria-selected'), 'false', 'after click, hidden tab has aria-selected = false')

    $tabs.find('li:first a').bootstrapTab('show')
    assert.strictEqual($tabs.find('.active').attr('aria-selected'), 'true', 'shown tab has aria-selected = true')
    assert.strictEqual($tabs.find('a:not(.active)').attr('aria-selected'), 'false', 'hidden tab has aria-selected = false')

    $tabs.find('li:first a').trigger('click')
    assert.strictEqual($tabs.find('.active').attr('aria-selected'), 'true', 'after second show event, shown tab still has aria-selected = true')
    assert.strictEqual($tabs.find('a:not(.active)').attr('aria-selected'), 'false', 'after second show event, hidden tab has aria-selected = false')
  })

  QUnit.test('selected tab should deactivate previous selected tab', function (assert) {
    assert.expect(2)
    var tabsHTML = '<ul class="nav nav-tabs">'
        + '<li class="nav-item"><a class="nav-link active" href="#home" data-toggle="tab">Home</a></li>'
        + '<li class="nav-item"><a class="nav-link" href="#profile" data-toggle="tab">Profile</a></li>'
        + '</ul>'
    var $tabs = $(tabsHTML).appendTo('#qunit-fixture')

    $tabs.find('li:last a').trigger('click')
    assert.notOk($tabs.find('li:first a').hasClass('active'))
    assert.ok($tabs.find('li:last a').hasClass('active'))
  })

  QUnit.test('selected tab should deactivate previous selected link in dropdown', function (assert) {
    assert.expect(3)
    var tabsHTML = '<ul class="nav nav-tabs">'
        + '<li class="nav-item"><a class="nav-link" href="#home" data-toggle="tab">Home</a></li>'
        + '<li class="nav-item"><a class="nav-link" href="#profile" data-toggle="tab">Profile</a></li>'
        + '<li class="nav-item dropdown"><a class="nav-link dropdown-toggle active" data-toggle="dropdown" href="#">Dropdown</a>'
        + '<div class="dropdown-menu">'
        + '<a class="dropdown-item active" href="#dropdown1" id="dropdown1-tab" data-toggle="tab">@fat</a>'
        + '<a class="dropdown-item" href="#dropdown2" id="dropdown2-tab" data-toggle="tab">@mdo</a>'
        + '</div>'
        + '</li>'
        + '</ul>'
    var $tabs = $(tabsHTML).appendTo('#qunit-fixture')

    $tabs.find('li:first > a').trigger('click')
    assert.ok($tabs.find('li:first a').hasClass('active'))
    assert.notOk($tabs.find('li:last > a').hasClass('active'))
    assert.notOk($tabs.find('li:last > .dropdown-menu > a:first').hasClass('active'))
  })

  QUnit.test('Nested tabs', function (assert) {
    assert.expect(2)
    var done = assert.async()
    var tabsHTML =
          '<nav class="nav nav-tabs" role="tablist">'
        + '  <a id="tab1" href="#x-tab1" class="nav-item nav-link" data-toggle="tab" role="tab" aria-controls="x-tab1">Tab 1</a>'
        + '  <a href="#x-tab2" class="nav-item nav-link active" data-toggle="tab" role="tab" aria-controls="x-tab2" aria-selected="true">Tab 2</a>'
        + '  <a href="#x-tab3" class="nav-item nav-link" data-toggle="tab" role="tab" aria-controls="x-tab3">Tab 3</a>'
        + '</nav>'
        + '<div class="tab-content">'
        + '  <div class="tab-pane" id="x-tab1" role="tabpanel">'
        + '    <nav class="nav nav-tabs" role="tablist">'
        + '      <a href="#nested-tab1" class="nav-item nav-link active" data-toggle="tab" role="tab" aria-controls="x-tab1" aria-selected="true">Nested Tab 1</a>'
        + '      <a id="tabNested2" href="#nested-tab2" class="nav-item nav-link" data-toggle="tab" role="tab" aria-controls="x-profile">Nested Tab2</a>'
        + '    </nav>'
        + '    <div class="tab-content">'
        + '      <div class="tab-pane active" id="nested-tab1" role="tabpanel">Nested Tab1 Content</div>'
        + '      <div class="tab-pane" id="nested-tab2" role="tabpanel">Nested Tab2 Content</div>'
        + '    </div>'
        + '  </div>'
        + '  <div class="tab-pane active" id="x-tab2" role="tabpanel">Tab2 Content</div>'
        + '  <div class="tab-pane" id="x-tab3" role="tabpanel">Tab3 Content</div>'
        + '</div>'

    $(tabsHTML).appendTo('#qunit-fixture')

    $('#tabNested2').on('shown.bs.tab', function () {
      assert.ok($('#x-tab1').hasClass('active'))
      done()
    })

    $('#tab1').on('shown.bs.tab', function () {
      assert.ok($('#x-tab1').hasClass('active'))
      $('#tabNested2').trigger($.Event('click'))
    })
    .trigger($.Event('click'))
  })
})
