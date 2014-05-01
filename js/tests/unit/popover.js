$(function () {

  module('popover plugin')

  test('should be defined on jquery object', function () {
    var div = $('<div></div>')
    ok(div.popover, 'popover method is defined')
  })

  module('popover', {
    setup: function() {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.bootstrapPopover = $.fn.popover.noConflict()
    },
    teardown: function() {
      $.fn.popover = $.fn.bootstrapPopover
      delete $.fn.bootstrapPopover
    }
  })

  test('should provide no conflict', function () {
    ok(!$.fn.popover, 'popover was set back to undefined (org value)')
  })

  test('should return element', function () {
    var div = $('<div></div>')
    ok(div.bootstrapPopover() == div, 'document.body returned')
  })

  test('should render popover element', function () {
    $.support.transition = false
    var popover = $('<a href="#" title="mdo" data-content="http://twitter.com/mdo">@mdo</a>')
      .appendTo('#qunit-fixture')
      .bootstrapPopover('show')

    ok($('.popover').length, 'popover was inserted')
    popover.bootstrapPopover('hide')
    ok(!$('.popover').length, 'popover removed')
  })

  test('should store popover instance in popover data object', function () {
    $.support.transition = false
    var popover = $('<a href="#" title="mdo" data-content="http://twitter.com/mdo">@mdo</a>')
      .bootstrapPopover()

    ok(!!popover.data('bs.popover'), 'popover instance exists')
  })

  test('should get title and content from options', function () {
    $.support.transition = false
    var popover = $('<a href="#">@fat</a>')
      .appendTo('#qunit-fixture')
      .bootstrapPopover({
        title: function () {
          return '@fat'
        },
        content: function () {
          return 'loves writing tests （╯°□°）╯︵ ┻━┻'
        }
      })

    popover.bootstrapPopover('show')

    ok($('.popover').length, 'popover was inserted')
    equal($('.popover .popover-title').text(), '@fat', 'title correctly inserted')
    equal($('.popover .popover-content').text(), 'loves writing tests （╯°□°）╯︵ ┻━┻', 'content correctly inserted')

    popover.bootstrapPopover('hide')
    ok(!$('.popover').length, 'popover was removed')
    $('#qunit-fixture').empty()
  })

  test('should not duplicate HTML object', function () {
    $.support.transition = false

    $div = $('<div>').html('loves writing tests （╯°□°）╯︵ ┻━┻')

    var popover = $('<a href="#">@fat</a>')
      .appendTo('#qunit-fixture')
      .bootstrapPopover({
        content: function () {
          return $div
        }
      })

    popover.bootstrapPopover('show')
    ok($('.popover').length, 'popover was inserted')
    equal($('.popover .popover-content').html(), $div, 'content correctly inserted')

    popover.bootstrapPopover('hide')
    ok(!$('.popover').length, 'popover was removed')

    popover.bootstrapPopover('show')
    ok($('.popover').length, 'popover was inserted')
    equal($('.popover .popover-content').html(), $div, 'content correctly inserted')

    popover.bootstrapPopover('hide')
    ok(!$('.popover').length, 'popover was removed')
    $('#qunit-fixture').empty()
  })

  test('should get title and content from attributes', function () {
    $.support.transition = false
    var popover = $('<a href="#" title="@mdo" data-content="loves data attributes (づ｡◕‿‿◕｡)づ ︵ ┻━┻" >@mdo</a>')
      .appendTo('#qunit-fixture')
      .bootstrapPopover()
      .bootstrapPopover('show')

    ok($('.popover').length, 'popover was inserted')
    equal($('.popover .popover-title').text(), '@mdo', 'title correctly inserted')
    equal($('.popover .popover-content').text(), 'loves data attributes (づ｡◕‿‿◕｡)づ ︵ ┻━┻', 'content correctly inserted')

    popover.bootstrapPopover('hide')
    ok(!$('.popover').length, 'popover was removed')
    $('#qunit-fixture').empty()
  })


  test('should get title and content from attributes #2', function () {
    $.support.transition = false
    var popover = $('<a href="#" title="@mdo" data-content="loves data attributes (づ｡◕‿‿◕｡)づ ︵ ┻━┻" >@mdo</a>')
      .appendTo('#qunit-fixture')
      .bootstrapPopover({
        title: 'ignored title option',
        content: 'ignored content option'
      })
      .bootstrapPopover('show')

    ok($('.popover').length, 'popover was inserted')
    equal($('.popover .popover-title').text(), '@mdo', 'title correctly inserted')
    equal($('.popover .popover-content').text(), 'loves data attributes (づ｡◕‿‿◕｡)づ ︵ ┻━┻', 'content correctly inserted')

    popover.bootstrapPopover('hide')
    ok(!$('.popover').length, 'popover was removed')
    $('#qunit-fixture').empty()
  })

  test('should respect custom classes', function () {
    $.support.transition = false
    var popover = $('<a href="#">@fat</a>')
      .appendTo('#qunit-fixture')
      .bootstrapPopover({
        title: 'Test',
        content: 'Test',
        template: '<div class="popover foobar"><div class="arrow"></div><div class="inner"><h3 class="title"></h3><div class="content"><p></p></div></div></div>'
      })

    popover.bootstrapPopover('show')

    ok($('.popover').length, 'popover was inserted')
    ok($('.popover').hasClass('foobar'), 'custom class is present')

    popover.bootstrapPopover('hide')
    ok(!$('.popover').length, 'popover was removed')
    $('#qunit-fixture').empty()
  })

  test('should destroy popover', function () {
    var popover = $('<div/>').bootstrapPopover({trigger: 'hover'}).on('click.foo', function () {})
    ok(popover.data('bs.popover'), 'popover has data')
    ok($._data(popover[0], 'events').mouseover && $._data(popover[0], 'events').mouseout, 'popover has hover event')
    ok($._data(popover[0], 'events').click[0].namespace == 'foo', 'popover has extra click.foo event')
    popover.bootstrapPopover('show')
    popover.bootstrapPopover('destroy')
    ok(!popover.hasClass('in'), 'popover is hidden')
    ok(!popover.data('popover'), 'popover does not have data')
    ok($._data(popover[0],'events').click[0].namespace == 'foo', 'popover still has click.foo')
    ok(!$._data(popover[0], 'events').mouseover && !$._data(popover[0], 'events').mouseout, 'popover does not have any events')
  })

})
