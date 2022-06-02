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
      $('#qunit-fixture').html('')
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
    } catch (error) {
      assert.strictEqual(error.message, 'No method named "noMethod"')
    }
  })

  QUnit.test('should return jquery collection containing the element', function (assert) {
    assert.expect(2)
    var $el = $('<div/>')
    var $tab = $el.bootstrapTab()
    assert.true($tab instanceof $, 'returns jquery collection')
    assert.strictEqual($tab[0], $el[0], 'collection contains element')
  })

  QUnit.test('should activate element by tab id (using buttons, the preferred semantic way)', function (assert) {
    assert.expect(2)
    var tabsHTML = '<ul class="nav" role="tablist">' +
        '<li><button type="button" data-target="#home" role="tab">Home</button></li>' +
        '<li><button type="button" data-target="#profile" role="tab">Profile</button></li>' +
        '</ul>'

    $('<ul><li id="home" role="tabpanel"></li><li id="profile" role="tabpanel"></li></ul>').appendTo('#qunit-fixture')

    $(tabsHTML).find('li:last-child button').bootstrapTab('show')
    assert.strictEqual($('#qunit-fixture').find('.active').attr('id'), 'profile')

    $(tabsHTML).find('li:first-child button').bootstrapTab('show')
    assert.strictEqual($('#qunit-fixture').find('.active').attr('id'), 'home')
  })

  QUnit.test('should activate element by tab id (using links for tabs - not ideal, but still supported)', function (assert) {
    assert.expect(2)
    var tabsHTML = '<ul class="nav" role="tablist">' +
        '<li><a href="#home" role="tab">Home</a></li>' +
        '<li><a href="#profile" role="tab">Profile</a></li>' +
        '</ul>'

    $('<ul><li id="home" role="tabpanel"/><li id="profile" role="tabpanel"/></ul>').appendTo('#qunit-fixture')

    $(tabsHTML).find('li:last-child a').bootstrapTab('show')
    assert.strictEqual($('#qunit-fixture').find('.active').attr('id'), 'profile')

    $(tabsHTML).find('li:first-child a').bootstrapTab('show')
    assert.strictEqual($('#qunit-fixture').find('.active').attr('id'), 'home')
  })

  QUnit.test('should activate element by tab id (.nav-pills)', function (assert) {
    assert.expect(2)
    var pillsHTML = '<ul class="nav nav-pills" role="tablist">' +
        '<li><a href="#home">Home</a></li>' +
        '<li><a href="#profile">Profile</a></li>' +
        '</ul>'

    $('<ul><li id="home"/><li id="profile"/></ul>').appendTo('#qunit-fixture')

    $(pillsHTML).find('li:last-child a').bootstrapTab('show')
    assert.strictEqual($('#qunit-fixture').find('.active').attr('id'), 'profile')

    $(pillsHTML).find('li:first-child a').bootstrapTab('show')
    assert.strictEqual($('#qunit-fixture').find('.active').attr('id'), 'home')
  })

  QUnit.test('should activate element by tab id in ordered list', function (assert) {
    assert.expect(2)
    var pillsHTML = '<ol class="nav nav-pills" role="tablist">' +
        '<li><button type="button" data-target="#home" role="tab">Home</button></li>' +
        '<li><button type="button" data-target="#profile" role="tab">Profile</button></li>' +
        '</ol>'

    $('<ol><li id="home" role="tabpanel"/><li id="profile" role="tabpanel"/></ol>').appendTo('#qunit-fixture')

    $(pillsHTML).find('li:last-child button').bootstrapTab('show')
    assert.strictEqual($('#qunit-fixture').find('.active').attr('id'), 'profile')

    $(pillsHTML).find('li:first-child button').bootstrapTab('show')
    assert.strictEqual($('#qunit-fixture').find('.active').attr('id'), 'home')
  })

  QUnit.test('should activate element by tab id in nav list', function (assert) {
    assert.expect(2)
    var tabsHTML = '<nav class="nav">' +
                      '<button type="button" data-target="#home" role="tab">Home</button>' +
                      '<button type="button" data-target="#profile" role="tab">Profile</button>' +
                    '</nav>'

    $('<div><div id="home" role="tabpanel"/><div id="profile" role="tabpanel"/></div>').appendTo('#qunit-fixture')

    $(tabsHTML).find('button:last-child').bootstrapTab('show')
    assert.strictEqual($('#qunit-fixture').find('.active').attr('id'), 'profile')

    $(tabsHTML).find('button:first-child').bootstrapTab('show')
    assert.strictEqual($('#qunit-fixture').find('.active').attr('id'), 'home')
  })

  QUnit.test('should activate element by tab id in list group', function (assert) {
    assert.expect(2)
    var tabsHTML = '<div class="list-group" role="tablist">' +
                      '<button type="button" data-target="#home" role="tab">Home</button>' +
                      '<button type="button" data-target="#profile" role="tab">Profile</button>' +
                    '</div>'

    $('<div><div id="home" role="tabpanel"/><div id="profile" role="tabpanel"/></div>').appendTo('#qunit-fixture')

    $(tabsHTML).find('button:last-child').bootstrapTab('show')
    assert.strictEqual($('#qunit-fixture').find('.active').attr('id'), 'profile')

    $(tabsHTML).find('button:first-child').bootstrapTab('show')
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
    var tabsHTML = '<ul class="nav nav-tabs" role="tablist">' +
      '<li class="nav-item" role="presentation"><button type="button" data-target="#home" class="nav-link active" role="tab" aria-selected="true">Home</button></li>' +
      '<li class="nav-item" role="presentation"><button type="button" data-target="#profile" class="nav-link" role="tab">Profile</button></li>' +
      '</ul>' +
      '<div class="tab-content">' +
      '<div class="tab-pane active" id="home" role="tabpanel"></div>' +
      '<div class="tab-pane" id="profile" role="tabpanel"></div>' +
      '</div>'

    $(tabsHTML)
      .find('button.active')
      .on('shown.bs.tab', function () {
        assert.ok(true, 'shown event fired')
      })
      .bootstrapTab('show')
  })

  QUnit.test('should not fire shown when tab is disabled', function (assert) {
    assert.expect(0)
    var tabsHTML = '<ul class="nav nav-tabs" role="tablist">' +
      '<li class="nav-item"><button type="button" data-target="#home" class="nav-link active" role="tab" aria-selected="true">Home</button></li>' +
      '<li class="nav-item"><button type="button" data-target="#profile" class="nav-link" disabled role="tab">Profile</button></li>' +
      '</ul>' +
      '<div class="tab-content">' +
      '<div class="tab-pane active" id="home" role="tabpanel"></div>' +
      '<div class="tab-pane" id="profile" role="tabpanel"></div>' +
      '</div>'

    $(tabsHTML)
      .find('button[disabled]')
      .on('shown.bs.tab', function () {
        assert.ok(true, 'shown event fired')
      })
      .bootstrapTab('show')
  })

  QUnit.test('show and shown events should reference correct relatedTarget', function (assert) {
    assert.expect(2)
    var done = assert.async()

    var tabsHTML =
        '<ul class="nav nav-tabs" role="tablist">' +
        '  <li class="nav-item" role="presentation"><button type="button" data-target="#home" class="nav-link active" role="tab" aria-selected="true">Home</button></li>' +
        '  <li class="nav-item" role="presentation"><button type="button" data-target="#profile" class="nav-link" role="tab" aria-selected="false">Profile</button></li>' +
        '</ul>' +
        '<div class="tab-content">' +
        '  <div class="tab-pane active" id="home" role="tabpanel"/>' +
        '  <div class="tab-pane" id="profile" role="tabpanel"/>' +
        '</div>'

    $(tabsHTML)
      .find('li:last-child button')
      .on('show.bs.tab', function (e) {
        assert.strictEqual(e.relatedTarget.getAttribute('data-target'), '#home', 'references correct element as relatedTarget')
      })
      .on('shown.bs.tab', function (e) {
        assert.strictEqual(e.relatedTarget.getAttribute('data-target'), '#home', 'references correct element as relatedTarget')
        done()
      })
      .bootstrapTab('show')
  })

  QUnit.test('should fire hide and hidden events', function (assert) {
    assert.expect(2)
    var done = assert.async()

    var tabsHTML = '<ul class="nav" role="tablist">' +
        '<li><button type="button" data-target="#home" role="tab">Home</button></li>' +
        '<li><button type="button" data-target="#profile" role="tab">Profile</button></li>' +
        '</ul>'

    $(tabsHTML)
      .find('li:first-child button')
      .on('hide.bs.tab', function () {
        assert.ok(true, 'hide event fired')
      })
      .bootstrapTab('show')
      .end()
      .find('li:last-child button')
      .bootstrapTab('show')

    $(tabsHTML)
      .find('li:first-child button')
      .on('hidden.bs.tab', function () {
        assert.ok(true, 'hidden event fired')
        done()
      })
      .bootstrapTab('show')
      .end()
      .find('li:last-child button')
      .bootstrapTab('show')
  })

  QUnit.test('should not fire hidden when hide is prevented', function (assert) {
    assert.expect(1)
    var done = assert.async()

    var tabsHTML = '<ul class="nav" role="tablist">' +
        '<li><button type="button" data-target="#home" role="tab">Home</button></li>' +
        '<li><button type="button" data-target="#profile" role="tab">Profile</button></li>' +
        '</ul>'

    $(tabsHTML)
      .find('li:first-child button')
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
      .find('li:last-child button')
      .bootstrapTab('show')
  })

  QUnit.test('hide and hidden events contain correct relatedTarget', function (assert) {
    assert.expect(2)
    var done = assert.async()

    var tabsHTML = '<ul class="nav" role="tablist">' +
        '<li><button type="button" data-target="#home" role="tab">Home</button></li>' +
        '<li><button type="button" data-target="#profile" role="tab">Profile</button></li>' +
        '</ul>'

    $(tabsHTML)
      .find('li:first-child button')
      .on('hide.bs.tab', function (e) {
        assert.strictEqual(e.relatedTarget.getAttribute('data-target'), '#profile', 'references correct element as relatedTarget')
      })
      .on('hidden.bs.tab', function (e) {
        assert.strictEqual(e.relatedTarget.getAttribute('data-target'), '#profile', 'references correct element as relatedTarget')
        done()
      })
      .bootstrapTab('show')
      .end()
      .find('li:last-child button')
      .bootstrapTab('show')
  })

  QUnit.test('selected tab should have correct aria-selected', function (assert) {
    assert.expect(8)
    var tabsHTML = '<ul class="nav nav-tabs" role="tablist">' +
        '<li><button type="button" data-target="#home" role="tab" aria-selected="false">Home</button></li>' +
        '<li><button type="button" data-target="#profile" role="tab" aria-selected="false">Profile</button></li>' +
        '</ul>'
    var $tabs = $(tabsHTML).appendTo('#qunit-fixture')

    $tabs.find('li:first-child button').bootstrapTab('show')
    assert.strictEqual($tabs.find('.active').attr('aria-selected'), 'true', 'shown tab has aria-selected = true')
    assert.strictEqual($tabs.find('button:not(.active)').attr('aria-selected'), 'false', 'hidden tab has aria-selected = false')

    $tabs.find('li:last-child button').trigger('click')
    assert.strictEqual($tabs.find('.active').attr('aria-selected'), 'true', 'after click, shown tab has aria-selected = true')
    assert.strictEqual($tabs.find('button:not(.active)').attr('aria-selected'), 'false', 'after click, hidden tab has aria-selected = false')

    $tabs.find('li:first-child button').bootstrapTab('show')
    assert.strictEqual($tabs.find('.active').attr('aria-selected'), 'true', 'shown tab has aria-selected = true')
    assert.strictEqual($tabs.find('button:not(.active)').attr('aria-selected'), 'false', 'hidden tab has aria-selected = false')

    $tabs.find('li:first-child button').trigger('click')
    assert.strictEqual($tabs.find('.active').attr('aria-selected'), 'true', 'after second show event, shown tab still has aria-selected = true')
    assert.strictEqual($tabs.find('button:not(.active)').attr('aria-selected'), 'false', 'after second show event, hidden tab has aria-selected = false')
  })

  QUnit.test('selected tab should deactivate previous selected tab', function (assert) {
    assert.expect(2)
    var tabsHTML = '<ul class="nav nav-tabs" role="tablist">' +
        '<li class="nav-item"><button type="button" data-target="#home" role="tab" data-toggle="tab">Home</button></li>' +
        '<li class="nav-item"><button type="button" data-target="#profile" role="tab" data-toggle="tab">Profile</button></li>' +
        '</ul>'
    var $tabs = $(tabsHTML).appendTo('#qunit-fixture')

    $tabs.find('li:last-child button').trigger('click')
    assert.false($tabs.find('li:first-child button').hasClass('active'))
    assert.true($tabs.find('li:last-child button').hasClass('active'))
  })

  QUnit.test('should support li > .dropdown-item', function (assert) {
    assert.expect(2)
    var tabsHTML = [
      '<ul class="nav nav-tabs" role="tablist">',
      '  <li class="nav-item"><a class="nav-link active" href="#home" data-toggle="tab">Home</a></li>',
      '  <li class="nav-item"><a class="nav-link" href="#profile" data-toggle="tab">Profile</a></li>',
      '  <li class="nav-item dropdown">',
      '    <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#">Dropdown</a>',
      '    <ul class="dropdown-menu">',
      '      <li><a class="dropdown-item" href="#dropdown1" id="dropdown1-tab" data-toggle="tab">@fat</a></li>',
      '      <li><a class="dropdown-item" href="#dropdown2" id="dropdown2-tab" data-toggle="tab">@mdo</a></li>',
      '    </ul>',
      '  </li>',
      '</ul>'
    ].join('')
    var $tabs = $(tabsHTML).appendTo('#qunit-fixture')

    $tabs.find('.dropdown-item').trigger('click')
    assert.true($tabs.find('.dropdown-item').hasClass('active'))
    assert.false($tabs.find('.nav-link:not(.dropdown-toggle)').hasClass('active'))
  })

  QUnit.test('Nested tabs', function (assert) {
    assert.expect(2)
    var done = assert.async()
    var tabsHTML =
        '<nav class="nav nav-tabs" role="tablist">' +
        '  <button type="button" id="tab1" data-target="#x-tab1" class="nav-link" data-toggle="tab" role="tab" aria-controls="x-tab1">Tab 1</button>' +
        '  <button type="button" data-target="#x-tab2" class="nav-link active" data-toggle="tab" role="tab" aria-controls="x-tab2" aria-selected="true">Tab 2</button>' +
        '  <button type="button" data-target="#x-tab3" class="nav-link" data-toggle="tab" role="tab" aria-controls="x-tab3">Tab 3</button>' +
        '</nav>' +
        '<div class="tab-content">' +
        '  <div class="tab-pane" id="x-tab1" role="tabpanel">' +
        '    <nav class="nav nav-tabs" role="tablist">' +
        '      <a href="#nested-tab1" class="nav-link active" data-toggle="tab" role="tab" aria-controls="x-tab1" aria-selected="true">Nested Tab 1</a>' +
        '      <a id="tabNested2" href="#nested-tab2" class="nav-link" data-toggle="tab" role="tab" aria-controls="x-profile">Nested Tab2</a>' +
        '    </nav>' +
        '    <div class="tab-content">' +
        '      <div class="tab-pane active" id="nested-tab1" role="tabpanel">Nested Tab1 Content</div>' +
        '      <div class="tab-pane" id="nested-tab2" role="tabpanel">Nested Tab2 Content</div>' +
        '    </div>' +
        '  </div>' +
        '  <div class="tab-pane active" id="x-tab2" role="tabpanel">Tab2 Content</div>' +
        '  <div class="tab-pane" id="x-tab3" role="tabpanel">Tab3 Content</div>' +
        '</div>'

    $(tabsHTML).appendTo('#qunit-fixture')

    $('#tabNested2').on('shown.bs.tab', function () {
      assert.true($('#x-tab1').hasClass('active'))
      done()
    })

    $('#tab1').on('shown.bs.tab', function () {
      assert.true($('#x-tab1').hasClass('active'))
      $('#tabNested2').trigger($.Event('click'))
    })
      .trigger($.Event('click'))
  })

  QUnit.test('should not remove fade class if no active pane is present', function (assert) {
    assert.expect(6)
    var done = assert.async()
    var tabsHTML = '<ul class="nav nav-tabs" role="tablist">' +
      '<li class="nav-item" role="presentation"><button type="button" id="tab-home" data-target="#home" class="nav-link" data-toggle="tab" role="tab">Home</button></li>' +
      '<li class="nav-item" role="presentation"><button type="button" id="tab-profile" data-target="#profile" class="nav-link" data-toggle="tab" role="tab">Profile</button></li>' +
      '</ul>' +
      '<div class="tab-content">' +
      '<div class="tab-pane fade" id="home" role="tabpanel"></div>' +
      '<div class="tab-pane fade" id="profile" role="tabpanel"></div>' +
      '</div>'

    $(tabsHTML).appendTo('#qunit-fixture')
    $('#tab-profile')
      .on('shown.bs.tab', function () {
        assert.true($('#profile').hasClass('fade'))
        assert.true($('#profile').hasClass('show'))

        $('#tab-home')
          .on('shown.bs.tab', function () {
            assert.true($('#profile').hasClass('fade'))
            assert.false($('#profile').hasClass('show'))
            assert.true($('#home').hasClass('fade'))
            assert.true($('#home').hasClass('show'))

            done()
          })
          .trigger($.Event('click'))
      })
      .trigger($.Event('click'))
  })

  QUnit.test('should handle removed tabs', function (assert) {
    assert.expect(1)
    var done = assert.async()

    var html = [
      '<ul class="nav nav-tabs" role="tablist">',
      '  <li class="nav-item" role="presentation">',
      '    <a class="nav-link nav-tab" href="#profile" role="tab" data-toggle="tab">',
      '      <button class="close"><span aria-hidden="true">&times;</span></button>',
      '    </a>',
      '  </li>',
      '  <li class="nav-item" role="presentation">',
      '    <a id="secondNav" class="nav-link nav-tab" href="#buzz" role="tab" data-toggle="tab">',
      '      <button class="close"><span aria-hidden="true">&times;</span></button>',
      '    </a>',
      '  </li>',
      '  <li class="nav-item" role="presentation">',
      '    <a class="nav-link nav-tab" href="#references" role="tab" data-toggle="tab">',
      '      <button id="btnClose" class="close"><span aria-hidden="true">&times;</span></button>',
      '    </a>',
      '  </li>',
      '</ul>',
      '<div class="tab-content">',
      '  <div role="tabpanel" class="tab-pane fade show active" id="profile">test 1</div>',
      '  <div role="tabpanel" class="tab-pane fade" id="buzz">test 2</div>',
      '  <div role="tabpanel" class="tab-pane fade" id="references">test 3</div>',
      '</div>'
    ].join('')

    $(html).appendTo('#qunit-fixture')

    $('#secondNav').on('shown.bs.tab', function () {
      assert.strictEqual($('.nav-tab').length, 2)
      done()
    })

    $('#btnClose').one('click', function () {
      var tabId = $(this).parents('a').attr('href')
      $(this).parents('li').remove()
      $(tabId).remove()
      $('.nav-tabs a:last').bootstrapTab('show')
    })
      .trigger($.Event('click'))
  })

  QUnit.test('should not add show class to tab panes if there is no `.fade` class', function (assert) {
    assert.expect(1)
    var done = assert.async()

    var html = [
      '<ul class="nav nav-tabs" role="tablist">',
      '  <li class="nav-item" role="presentation">',
      '    <button type="button" class="nav-link nav-tab" data-target="#home" role="tab" data-toggle="tab">Home</button>',
      '  </li>',
      '  <li class="nav-item" role="presentation">',
      '    <button type="button" id="secondNav" class="nav-link nav-tab" data-target="#profile" role="tab" data-toggle="tab">Profile</button>',
      '  </li>',
      '</ul>',
      '<div class="tab-content" role="presentation">',
      '  <div role="tabpanel" class="tab-pane" id="home">test 1</div>',
      '  <div role="tabpanel" class="tab-pane" id="profile">test 2</div>',
      '</div>'
    ].join('')

    $(html).appendTo('#qunit-fixture')

    $('#secondNav').on('shown.bs.tab', function () {
      assert.strictEqual($('.show').length, 0)
      done()
    })
      .trigger($.Event('click'))
  })

  QUnit.test('should add show class to tab panes if there is a `.fade` class', function (assert) {
    assert.expect(1)
    var done = assert.async()

    var html = [
      '<ul class="nav nav-tabs" role="tablist">',
      '  <li class="nav-item" role="presentation">',
      '    <button type="button" class="nav-link nav-tab" data-target="#home" role="tab" data-toggle="tab">Home</button>',
      '  </li>',
      '  <li class="nav-item" role="presentation">',
      '    <button type="button" id="secondNav" class="nav-link nav-tab" data-target="#profile" role="tab" data-toggle="tab">Profile</button>',
      '  </li>',
      '</ul>',
      '<div class="tab-content">',
      '  <div role="tabpanel" class="tab-pane fade" id="home">test 1</div>',
      '  <div role="tabpanel" class="tab-pane fade" id="profile">test 2</div>',
      '</div>'
    ].join('')

    $(html).appendTo('#qunit-fixture')

    $('#secondNav').on('shown.bs.tab', function () {
      assert.strictEqual($('.show').length, 1)
      done()
    })
      .trigger($.Event('click'))
  })
})
