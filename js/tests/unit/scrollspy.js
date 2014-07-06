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
    ok(!$.fn.scrollspy, 'scrollspy was set back to undefined (org value)')
  })

  test('should return element', function () {
    ok($(document.body).bootstrapScrollspy()[0] == document.body, 'document.body returned')
  })

  test('should switch active class on scroll', function () {
    var sectionHTML = '<div id="masthead"></div>'
    $(sectionHTML).append('#qunit-fixture')
    var topbarHTML = '<div class="topbar">' +
        '<div class="topbar-inner">' +
        '<div class="container">' +
        '<h3><a href="#">Bootstrap</a></h3>' +
        '<li><a href="#masthead">Overview</a></li>' +
        '</ul>' +
        '</div>' +
        '</div>' +
        '</div>'
    var $topbar = $(topbarHTML).bootstrapScrollspy()

    $(sectionHTML).append('#qunit-fixture')
    ok($topbar.find('.active', true))
  })

  asyncTest('should only switch active class on current target', function () {
    expect(1);
    var sectionHTML = '<div id="root" class="active">' +
        '<div class="topbar">' +
        '<div class="topbar-inner">' +
        '<div class="container" id="ss-target">' +
        '<ul class="nav">' +
        '<li><a href="#masthead">Overview</a></li>' +
        '<li><a href="#detail">Detail</a></li>' +
        '</ul>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div id="scrollspy-example" style="height: 100px; overflow: auto;">' +
        '<div style="height: 200px;">' +
        '<h4 id="masthead">Overview</h4>' +
        '<p style="height: 200px">' +
        'Ad leggings keytar, brunch id art party dolor labore.' +
        '</p>' +
        '</div>' +
        '<div style="height: 200px;">' +
        '<h4 id="detail">Detail</h4>' +
        '<p style="height: 200px">' +
        'Veniam marfa mustache skateboard, adipisicing fugiat velit pitchfork beard.' +
        '</p>' +
        '</div>' +
        '</div>' +
        '</div>'
    var $section = $(sectionHTML).appendTo('#qunit-fixture')
    var $scrollSpy = $section
        .show()
        .find('#scrollspy-example')
        .bootstrapScrollspy({ target: '#ss-target' })

    $scrollSpy.on('scroll.bs.scrollspy', function () {
      ok($section.hasClass('active'), 'Active class still on root node')
      start()
    })
    $scrollSpy.scrollTop(350);
  })

  asyncTest('middle navigation option correctly selected when large offset is used', function () {
    expect(3);
    var sectionHTML = '<div id="header" style="height: 500px;"></div>' +
        '<nav id="navigation" class="navbar">' +
        '<ul class="nav navbar-nav">' +
        '<li class="active"><a id="one-link" href="#one">One</a></li>' +
        '<li><a id="two-link" href="#two">Two</a></li>' +
        '<li><a id="three-link" href="#three">Three</a></li>' +
        '</ul>' +
        '</nav>' +
        '<div id="content" style="height: 200px; overflow-y: auto;">' +
        '<div id="one" style="height: 500px;"></div>' +
        '<div id="two" style="height: 300px;"></div>' +
        '<div id="three" style="height: 10px;"></div>' +
        '</div>'
    var $section = $(sectionHTML).appendTo('#qunit-fixture')
    var $scrollSpy = $section
        .show()
        .filter('#content')
    $scrollSpy.bootstrapScrollspy({ target: '#navigation', offset: $scrollSpy.position().top })

    $scrollSpy.on('scroll.bs.scrollspy', function () {
      ok(!$section.find('#one-link').parent().hasClass('active'), 'Active class removed from first section')
      ok($section.find('#two-link').parent().hasClass('active'), 'Active class on middle section')
      ok(!$section.find('#three-link').parent().hasClass('active'), 'Active class not on last section')
      start()
    })
    $scrollSpy.scrollTop(550);
  })

  test('should add the active class to the correct element', function () {
    var navbarHtml =
      '<div class="navbar">' +
      '<ul class="nav">' +
      '<li id="li-1"><a href="#div-1">div 1</a></li>' +
      '<li id="li-2"><a href="#div-2">div 2</a></li>' +
      '</ul>' +
      '</div>'
    var contentHtml =
      '<div class="content" style="overflow: auto; height: 50px">' +
      '<div id="div-1" style="height: 100px; padding: 0; margin: 0">div 1</div>' +
      '<div id="div-2" style="height: 200px; padding: 0; margin: 0">div 2</div>' +
      '</div>'

    $(navbarHtml).appendTo('#qunit-fixture')
    var $content = $(contentHtml)
      .appendTo('#qunit-fixture')
      .bootstrapScrollspy({ offset: 0, target: '.navbar' })

    var testElementIsActiveAfterScroll = function (element, target) {
      var deferred = $.Deferred()
      var scrollHeight = $content.scrollTop() + $(target).position().top
      stop()
      $content.one('scroll', function () {
        ok($(element).hasClass('active'), 'target:' + target + ', element' + element)
        start()
        deferred.resolve()
      })
      $content.scrollTop(scrollHeight)
      return deferred.promise()
    }

    $.when(testElementIsActiveAfterScroll('#li-1', '#div-1'))
      .then(function () { return testElementIsActiveAfterScroll('#li-2', '#div-2') })
  })

})
