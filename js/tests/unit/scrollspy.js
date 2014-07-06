$(function () {
  'use strict';

  module('scrollspy plugin')

  test('should be defined on jquery object', function () {
    ok($(document.body).scrollspy, 'scrollspy method is defined')
  })

  module('scrollspy', {
    setup: function () {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.bootstrapScrollspy = $.fn.scrollspy.noConflict()
    },
    teardown: function () {
      $.fn.scrollspy = $.fn.bootstrapScrollspy
      delete $.fn.bootstrapScrollspy
    }
  })

  test('should provide no conflict', function () {
    strictEqual($.fn.scrollspy, undefined, 'scrollspy was set back to undefined (org value)')
  })

  test('should return jquery collection containing the element', function () {
    var $el = $('<div/>')
    var $scrollspy = $el.bootstrapScrollspy()
    ok($scrollspy instanceof $, 'returns jquery collection')
    strictEqual($scrollspy[0], $el[0], 'collection contains element')
  })

  // Does not work properly ATM, #13500 will fix this
  test('should switch "active" class on scroll', function () {
    var topbarHTML = '<div class="topbar">'
        + '<div class="topbar-inner">'
        + '<div class="container">'
        + '<h3><a href="#">Bootstrap</a></h3>'
        + '<li><a href="#masthead">Overview</a></li>'
        + '</ul>'
        + '</div>'
        + '</div>'
        + '</div>'
    var $topbar = $(topbarHTML).bootstrapScrollspy()

    ok($topbar.find('.active', true))
  })

  test('should only switch "active" class on current target', function () {
    stop()

    var sectionHTML = '<div id="root" class="active">'
        + '<div class="topbar">'
        + '<div class="topbar-inner">'
        + '<div class="container" id="ss-target">'
        + '<ul class="nav">'
        + '<li><a href="#masthead">Overview</a></li>'
        + '<li><a href="#detail">Detail</a></li>'
        + '</ul>'
        + '</div>'
        + '</div>'
        + '</div>'
        + '<div id="scrollspy-example" style="height: 100px; overflow: auto;">'
        + '<div style="height: 200px;">'
        + '<h4 id="masthead">Overview</h4>'
        + '<p style="height: 200px">'
        + 'Ad leggings keytar, brunch id art party dolor labore.'
        + '</p>'
        + '</div>'
        + '<div style="height: 200px;">'
        + '<h4 id="detail">Detail</h4>'
        + '<p style="height: 200px">'
        + 'Veniam marfa mustache skateboard, adipisicing fugiat velit pitchfork beard.'
        + '</p>'
        + '</div>'
        + '</div>'
        + '</div>'
    var $section = $(sectionHTML).appendTo('#qunit-fixture')

    var $scrollspy = $section
        .show()
        .find('#scrollspy-example')
        .bootstrapScrollspy({ target: '#ss-target' })

    $scrollspy.on('scroll.bs.scrollspy', function () {
      ok($section.hasClass('active'), '"active" class still on root node')
      start()
    })

    $scrollspy.scrollTop(350)
  })

  test('middle navigation option correctly selected when large offset is used', function () {
    stop()

    var sectionHTML = '<div id="header" style="height: 500px;"></div>'
        + '<nav id="navigation" class="navbar">'
        + '<ul class="nav navbar-nav">'
        + '<li class="active"><a id="one-link" href="#one">One</a></li>'
        + '<li><a id="two-link" href="#two">Two</a></li>'
        + '<li><a id="three-link" href="#three">Three</a></li>'
        + '</ul>'
        + '</nav>'
        + '<div id="content" style="height: 200px; overflow-y: auto;">'
        + '<div id="one" style="height: 500px;"></div>'
        + '<div id="two" style="height: 300px;"></div>'
        + '<div id="three" style="height: 10px;"></div>'
        + '</div>'
    var $section = $(sectionHTML).appendTo('#qunit-fixture')
    var $scrollspy = $section
        .show()
        .filter('#content')

    $scrollspy.bootstrapScrollspy({ target: '#navigation', offset: $scrollspy.position().top })

    $scrollspy.on('scroll.bs.scrollspy', function () {
      ok(!$section.find('#one-link').parent().hasClass('active'), '"active" class removed from first section')
      ok($section.find('#two-link').parent().hasClass('active'), '"active" class on middle section')
      ok(!$section.find('#three-link').parent().hasClass('active'), '"active" class not on last section')
      start()
    })

    $scrollspy.scrollTop(550)
  })
})
