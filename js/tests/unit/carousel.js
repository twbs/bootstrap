$(function () {
  'use strict';

  module('carousel plugin')

  test('should be defined on jQuery object', function () {
    ok($(document.body).carousel, 'carousel method is defined')
  })

  module('carousel', {
    setup: function () {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.bootstrapCarousel = $.fn.carousel.noConflict()
    },
    teardown: function () {
      $.fn.carousel = $.fn.bootstrapCarousel
      delete $.fn.bootstrapCarousel
    }
  })

  test('should provide no conflict', function () {
    strictEqual($.fn.carousel, undefined, 'carousel was set back to undefined (orig value)')
  })

  test('should return jquery collection containing the element', function () {
    var $el = $('<div/>')
    var $carousel = $el.bootstrapCarousel()
    ok($carousel instanceof $, 'returns jquery collection')
    strictEqual($carousel[0], $el[0], 'collection contains element')
  })

  test('should not fire slid when slide is prevented', function () {
    stop()
    $('<div class="carousel"/>')
      .on('slide.bs.carousel', function (e) {
        e.preventDefault()
        ok(true, 'slide event fired')
        start()
      })
      .on('slid.bs.carousel', function () {
        ok(false, 'slid event fired')
      })
      .bootstrapCarousel('next')
  })

  test('should reset when slide is prevented', function () {
    var carouselHTML = '<div id="carousel-example-generic" class="carousel slide">' +
        '<ol class="carousel-indicators">' +
        '<li data-target="#carousel-example-generic" data-slide-to="0" class="active"/>' +
        '<li data-target="#carousel-example-generic" data-slide-to="1"/>' +
        '<li data-target="#carousel-example-generic" data-slide-to="2"/>' +
        '</ol>' +
        '<div class="carousel-inner">' +
        '<div class="item active">' +
        '<div class="carousel-caption"/>' +
        '</div>' +
        '<div class="item">' +
        '<div class="carousel-caption"/>' +
        '</div>' +
        '<div class="item">' +
        '<div class="carousel-caption"/>' +
        '</div>' +
        '</div>' +
        '<a class="left carousel-control" href="#carousel-example-generic" data-slide="prev"/>' +
        '<a class="right carousel-control" href="#carousel-example-generic" data-slide="next"/>' +
        '</div>'
    var $carousel = $(carouselHTML)

    stop()
    $carousel
      .one('slide.bs.carousel', function (e) {
        e.preventDefault()
        setTimeout(function () {
          ok($carousel.find('.item:eq(0)').is('.active'), 'first item still active')
          ok($carousel.find('.carousel-indicators li:eq(0)').is('.active'), 'first indicator still active')
          $carousel.bootstrapCarousel('next')
        }, 0)
      })
      .one('slid.bs.carousel', function () {
        setTimeout(function () {
          ok(!$carousel.find('.item:eq(0)').is('.active'), 'first item still active')
          ok(!$carousel.find('.carousel-indicators li:eq(0)').is('.active'), 'first indicator still active')
          ok($carousel.find('.item:eq(1)').is('.active'), 'second item active')
          ok($carousel.find('.carousel-indicators li:eq(1)').is('.active'), 'second indicator active')
          start()
        }, 0)
      })
      .bootstrapCarousel('next')
  })

  test('should fire slide event with direction', function () {
    var carouselHTML = '<div id="myCarousel" class="carousel slide">' +
        '<div class="carousel-inner">' +
        '<div class="item active">' +
        '<img alt="">' +
        '<div class="carousel-caption">' +
        '<h4>First Thumbnail label</h4>' +
        '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' +
        'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' +
        'ultricies vehicula ut id elit.</p>' +
        '</div>' +
        '</div>' +
        '<div class="item">' +
        '<img alt="">' +
        '<div class="carousel-caption">' +
        '<h4>Second Thumbnail label</h4>' +
        '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' +
        'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' +
        'ultricies vehicula ut id elit.</p>' +
        '</div>' +
        '</div>' +
        '<div class="item">' +
        '<img alt="">' +
        '<div class="carousel-caption">' +
        '<h4>Third Thumbnail label</h4>' +
        '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' +
        'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' +
        'ultricies vehicula ut id elit.</p>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<a class="left carousel-control" href="#myCarousel" data-slide="prev">&lsaquo;</a>' +
        '<a class="right carousel-control" href="#myCarousel" data-slide="next">&rsaquo;</a>' +
        '</div>'
    var $carousel = $(carouselHTML)

    stop()

    $carousel
      .one('slide.bs.carousel', function (e) {
        ok(e.direction, 'direction present on next')
        strictEqual(e.direction, 'left', 'direction is left on next')

        $carousel
          .one('slide.bs.carousel', function (e) {
            ok(e.direction, 'direction present on prev')
            strictEqual(e.direction, 'right', 'direction is right on prev')
            start()
          })
          .bootstrapCarousel('prev')
      })
      .bootstrapCarousel('next')
  })

  test('should fire slid event with direction', function () {
    var carouselHTML = '<div id="myCarousel" class="carousel slide">' +
        '<div class="carousel-inner">' +
        '<div class="item active">' +
        '<img alt="">' +
        '<div class="carousel-caption">' +
        '<h4>First Thumbnail label</h4>' +
        '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' +
        'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' +
        'ultricies vehicula ut id elit.</p>' +
        '</div>' +
        '</div>' +
        '<div class="item">' +
        '<img alt="">' +
        '<div class="carousel-caption">' +
        '<h4>Second Thumbnail label</h4>' +
        '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' +
        'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' +
        'ultricies vehicula ut id elit.</p>' +
        '</div>' +
        '</div>' +
        '<div class="item">' +
        '<img alt="">' +
        '<div class="carousel-caption">' +
        '<h4>Third Thumbnail label</h4>' +
        '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' +
        'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' +
        'ultricies vehicula ut id elit.</p>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<a class="left carousel-control" href="#myCarousel" data-slide="prev">&lsaquo;</a>' +
        '<a class="right carousel-control" href="#myCarousel" data-slide="next">&rsaquo;</a>' +
        '</div>'
    var $carousel = $(carouselHTML)

    stop()

    $carousel
      .one('slid.bs.carousel', function (e) {
        ok(e.direction, 'direction present on next')
        strictEqual(e.direction, 'left', 'direction is left on next')

        $carousel
          .one('slid.bs.carousel', function (e) {
            ok(e.direction, 'direction present on prev')
            strictEqual(e.direction, 'right', 'direction is right on prev')
            start()
          })
          .bootstrapCarousel('prev')
      })
      .bootstrapCarousel('next')
  })

  test('should fire slide event with relatedTarget', function () {
    var template = '<div id="myCarousel" class="carousel slide">' +
        '<div class="carousel-inner">' +
        '<div class="item active">' +
        '<img alt="">' +
        '<div class="carousel-caption">' +
        '<h4>First Thumbnail label</h4>' +
        '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' +
        'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' +
        'ultricies vehicula ut id elit.</p>' +
        '</div>' +
        '</div>' +
        '<div class="item">' +
        '<img alt="">' +
        '<div class="carousel-caption">' +
        '<h4>Second Thumbnail label</h4>' +
        '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' +
        'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' +
        'ultricies vehicula ut id elit.</p>' +
        '</div>' +
        '</div>' +
        '<div class="item">' +
        '<img alt="">' +
        '<div class="carousel-caption">' +
        '<h4>Third Thumbnail label</h4>' +
        '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' +
        'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' +
        'ultricies vehicula ut id elit.</p>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<a class="left carousel-control" href="#myCarousel" data-slide="prev">&lsaquo;</a>' +
        '<a class="right carousel-control" href="#myCarousel" data-slide="next">&rsaquo;</a>' +
        '</div>'

    stop()

    $(template)
      .on('slide.bs.carousel', function (e) {
        ok(e.relatedTarget, 'relatedTarget present')
        ok($(e.relatedTarget).hasClass('item'), 'relatedTarget has class "item"')
        start()
      })
      .bootstrapCarousel('next')
  })

  test('should fire slid event with relatedTarget', function () {
    var template = '<div id="myCarousel" class="carousel slide">' +
        '<div class="carousel-inner">' +
        '<div class="item active">' +
        '<img alt="">' +
        '<div class="carousel-caption">' +
        '<h4>First Thumbnail label</h4>' +
        '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' +
        'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' +
        'ultricies vehicula ut id elit.</p>' +
        '</div>' +
        '</div>' +
        '<div class="item">' +
        '<img alt="">' +
        '<div class="carousel-caption">' +
        '<h4>Second Thumbnail label</h4>' +
        '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' +
        'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' +
        'ultricies vehicula ut id elit.</p>' +
        '</div>' +
        '</div>' +
        '<div class="item">' +
        '<img alt="">' +
        '<div class="carousel-caption">' +
        '<h4>Third Thumbnail label</h4>' +
        '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' +
        'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' +
        'ultricies vehicula ut id elit.</p>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<a class="left carousel-control" href="#myCarousel" data-slide="prev">&lsaquo;</a>' +
        '<a class="right carousel-control" href="#myCarousel" data-slide="next">&rsaquo;</a>' +
        '</div>'

    stop()

    $(template)
      .on('slid.bs.carousel', function (e) {
        ok(e.relatedTarget, 'relatedTarget present')
        ok($(e.relatedTarget).hasClass('item'), 'relatedTarget has class "item"')
        start()
      })
      .bootstrapCarousel('next')
  })

  test('should set interval from data attribute', function () {
    var templateHTML = '<div id="myCarousel" class="carousel slide">' +
        '<div class="carousel-inner">' +
        '<div class="item active">' +
        '<img alt="">' +
        '<div class="carousel-caption">' +
        '<h4>First Thumbnail label</h4>' +
        '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' +
        'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' +
        'ultricies vehicula ut id elit.</p>' +
        '</div>' +
        '</div>' +
        '<div class="item">' +
        '<img alt="">' +
        '<div class="carousel-caption">' +
        '<h4>Second Thumbnail label</h4>' +
        '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' +
        'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' +
        'ultricies vehicula ut id elit.</p>' +
        '</div>' +
        '</div>' +
        '<div class="item">' +
        '<img alt="">' +
        '<div class="carousel-caption">' +
        '<h4>Third Thumbnail label</h4>' +
        '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' +
        'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' +
        'ultricies vehicula ut id elit.</p>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<a class="left carousel-control" href="#myCarousel" data-slide="prev">&lsaquo;</a>' +
        '<a class="right carousel-control" href="#myCarousel" data-slide="next">&rsaquo;</a>' +
        '</div>'
    var $carousel = $(templateHTML)
    $carousel.attr('data-interval', 1814)

    $carousel.appendTo('body')
    $('[data-slide]').first().click()
    equal($carousel.data('bs.carousel').options.interval, 1814)
    $carousel.remove()

    $carousel.appendTo('body').attr('data-modal', 'foobar')
    $('[data-slide]').first().click()
    equal($carousel.data('bs.carousel').options.interval, 1814, 'even if there is an data-modal attribute set')
    $carousel.remove()

    $carousel.appendTo('body')
    $('[data-slide]').first().click()
    $carousel.attr('data-interval', 1860)
    $('[data-slide]').first().click()
    equal($carousel.data('bs.carousel').options.interval, 1814, 'attributes should be read only on initialization')
    $carousel.remove()

    $carousel.attr('data-interval', false)
    $carousel.appendTo('body')
    $carousel.bootstrapCarousel(1)
    strictEqual($carousel.data('bs.carousel').options.interval, false, 'data attribute has higher priority than default options')
    $carousel.remove()
  })

  test('should skip over non-items', function () {
    var templateHTML = '<div id="myCarousel" class="carousel" data-interval="1814">' +
        '<div class="carousel-inner">' +
        '<div class="item active">' +
        '<img alt="">' +
        '</div>' +
        '<script type="text/x-metamorph" id="thingy"/>' +
        '<div class="item">' +
        '<img alt="">' +
        '</div>' +
        '<div class="item">' +
        '</div>' +
        '</div>' +
        '</div>'
    var $template = $(templateHTML)

    $template.bootstrapCarousel()

    strictEqual($template.find('.item')[0], $template.find('.active')[0], 'first item active')

    $template.bootstrapCarousel(1)

    strictEqual($template.find('.item')[1], $template.find('.active')[0], 'second item active')
  })
})
