$(function () {

  module('scrollspy')

  test('should provide no conflict', function () {
    var scrollspy = $.fn.scrollspy.noConflict()
    ok(!$.fn.scrollspy, 'scrollspy was set back to undefined (org value)')
    $.fn.scrollspy = scrollspy
  })

  test('should be defined on jquery object', function () {
    ok($(document.body).scrollspy, 'scrollspy method is defined')
  })

  test('should return element', function () {
    ok($(document.body).scrollspy()[0] == document.body, 'document.body returned')
  })

  test('should switch active class on scroll', function () {
    var sectionHTML = '<div id="masthead"></div>',
        $section = $(sectionHTML).append('#qunit-fixture'),
        topbarHTML = '<div class="topbar">' +
        '<div class="topbar-inner">' +
        '<div class="container">' +
        '<h3><a href="#">Bootstrap</a></h3>' +
        '<li><a href="#masthead">Overview</a></li>' +
        '</ul>' +
        '</div>' +
        '</div>' +
        '</div>',
        $topbar = $(topbarHTML).scrollspy()

    ok($topbar.find('.active', true))
  })

      test("should only switch active class on current target", function () {
        var
          sectionHTML = '<div id="root" class="active">'
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
          , $section = $(sectionHTML).appendTo("#qunit-fixture")        
          , $scrollSpy = $section
            .show()
            .find("#scrollspy-example")
            .scrollspy({target: "#ss-target"})

        $scrollSpy.scrollTop(350);
        ok($section.hasClass("active"), "Active class still on root node")
      })
})
