$(function () {
  'use strict';

  module('popover plugin')

  test('should be defined on jquery object', function () {
    ok($(document.body).popover, 'popover method is defined')
  })

  module('popover', {
    setup: function () {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.bootstrapPopover = $.fn.popover.noConflict()
    },
    teardown: function () {
      $.fn.popover = $.fn.bootstrapPopover
      delete $.fn.bootstrapPopover
    }
  })

  test('should provide no conflict', function () {
    strictEqual($.fn.popover, undefined, 'popover was set back to undefined (org value)')
  })

  test('should return jquery collection containing the element', function () {
    var $el = $('<div/>')
    var $popover = $el.bootstrapPopover()
    ok($popover instanceof $, 'returns jquery collection')
    strictEqual($popover[0], $el[0], 'collection contains element')
  })

  test('should render popover element', function () {
    var $popover = $('<a href="#" title="mdo" data-content="http://twitter.com/mdo">@mdo</a>')
      .appendTo('#qunit-fixture')
      .bootstrapPopover('show')

    notEqual($('.popover').length, 0, 'popover was inserted')
    $popover.bootstrapPopover('hide')
    equal($('.popover').length, 0, 'popover removed')
  })

  test('should store popover instance in popover data object', function () {
    var $popover = $('<a href="#" title="mdo" data-content="http://twitter.com/mdo">@mdo</a>').bootstrapPopover()

    ok($popover.data('bs.popover'), 'popover instance exists')
  })

  test('should store popover trigger in popover instance data object', function () {
    var $popover = $('<a href="#" title="ResentedHook">@ResentedHook</a>')
      .appendTo('#qunit-fixture')
      .bootstrapPopover()

    $popover.bootstrapPopover('show')

    ok($('.popover').data('bs.popover'), 'popover trigger stored in instance data')
  })

  test('should get title and content from options', function () {
    var $popover = $('<a href="#">@fat</a>')
      .appendTo('#qunit-fixture')
      .bootstrapPopover({
        title: function () {
          return '@fat'
        },
        content: function () {
          return 'loves writing tests （╯°□°）╯︵ ┻━┻'
        }
      })

    $popover.bootstrapPopover('show')

    notEqual($('.popover').length, 0, 'popover was inserted')
    equal($('.popover .popover-title').text(), '@fat', 'title correctly inserted')
    equal($('.popover .popover-content').text(), 'loves writing tests （╯°□°）╯︵ ┻━┻', 'content correctly inserted')

    $popover.bootstrapPopover('hide')
    equal($('.popover').length, 0, 'popover was removed')
  })

  test('should not duplicate HTML object', function () {
    var $div = $('<div/>').html('loves writing tests （╯°□°）╯︵ ┻━┻')

    var $popover = $('<a href="#">@fat</a>')
      .appendTo('#qunit-fixture')
      .bootstrapPopover({
        content: function () {
          return $div
        }
      })

    $popover.bootstrapPopover('show')
    notEqual($('.popover').length, 0, 'popover was inserted')
    equal($('.popover .popover-content').html(), $div, 'content correctly inserted')

    $popover.bootstrapPopover('hide')
    equal($('.popover').length, 0, 'popover was removed')

    $popover.bootstrapPopover('show')
    notEqual($('.popover').length, 0, 'popover was inserted')
    equal($('.popover .popover-content').html(), $div, 'content correctly inserted')

    $popover.bootstrapPopover('hide')
    equal($('.popover').length, 0, 'popover was removed')
  })

  test('should get title and content from attributes', function () {
    var $popover = $('<a href="#" title="@mdo" data-content="loves data attributes (づ｡◕‿‿◕｡)づ ︵ ┻━┻" >@mdo</a>')
      .appendTo('#qunit-fixture')
      .bootstrapPopover()
      .bootstrapPopover('show')

    notEqual($('.popover').length, 0, 'popover was inserted')
    equal($('.popover .popover-title').text(), '@mdo', 'title correctly inserted')
    equal($('.popover .popover-content').text(), 'loves data attributes (づ｡◕‿‿◕｡)づ ︵ ┻━┻', 'content correctly inserted')

    $popover.bootstrapPopover('hide')
    equal($('.popover').length, 0, 'popover was removed')
  })


  test('should get title and content from attributes ignoring options passed via js', function () {
    var $popover = $('<a href="#" title="@mdo" data-content="loves data attributes (づ｡◕‿‿◕｡)づ ︵ ┻━┻" >@mdo</a>')
      .appendTo('#qunit-fixture')
      .bootstrapPopover({
        title: 'ignored title option',
        content: 'ignored content option'
      })
      .bootstrapPopover('show')

    notEqual($('.popover').length, 0, 'popover was inserted')
    equal($('.popover .popover-title').text(), '@mdo', 'title correctly inserted')
    equal($('.popover .popover-content').text(), 'loves data attributes (づ｡◕‿‿◕｡)づ ︵ ┻━┻', 'content correctly inserted')

    $popover.bootstrapPopover('hide')
    equal($('.popover').length, 0, 'popover was removed')
  })

  test('should respect custom template', function () {
    var $popover = $('<a href="#">@fat</a>')
      .appendTo('#qunit-fixture')
      .bootstrapPopover({
        title: 'Test',
        content: 'Test',
        template: '<div class="popover foobar"><div class="arrow"></div><div class="inner"><h3 class="title"/><div class="content"><p/></div></div></div>'
      })

    $popover.bootstrapPopover('show')

    notEqual($('.popover').length, 0, 'popover was inserted')
    ok($('.popover').hasClass('foobar'), 'custom class is present')

    $popover.bootstrapPopover('hide')
    equal($('.popover').length, 0, 'popover was removed')
  })

  test('should destroy popover', function () {
    var $popover = $('<div/>')
      .bootstrapPopover({
        trigger: 'hover'
      })
      .on('click.foo', $.noop)

    ok($popover.data('bs.popover'), 'popover has data')
    ok($._data($popover[0], 'events').mouseover && $._data($popover[0], 'events').mouseout, 'popover has hover event')
    equal($._data($popover[0], 'events').click[0].namespace, 'foo', 'popover has extra click.foo event')

    $popover.bootstrapPopover('show')
    $popover.bootstrapPopover('destroy')

    ok(!$popover.hasClass('in'), 'popover is hidden')
    ok(!$popover.data('popover'), 'popover does not have data')
    equal($._data($popover[0], 'events').click[0].namespace, 'foo', 'popover still has click.foo')
    ok(!$._data($popover[0], 'events').mouseover && !$._data($popover[0], 'events').mouseout, 'popover does not have any events')
  })

})
