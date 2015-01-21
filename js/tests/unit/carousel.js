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

  test('should not fire slid when slide is prevented', function (assert) {
    var done = assert.async()
    $('<div class="carousel"/>')
      .on('slide.bs.carousel', function (e) {
        e.preventDefault()
        ok(true, 'slide event fired')
        done()
      })
      .on('slid.bs.carousel', function () {
        ok(false, 'slid event fired')
      })
      .bootstrapCarousel('next')
  })

  test('should reset when slide is prevented', function (assert) {
    var carouselHTML = '<div id="carousel-example-generic" class="carousel slide">'
        + '<ol class="carousel-indicators">'
        + '<li data-target="#carousel-example-generic" data-slide-to="0" class="active"/>'
        + '<li data-target="#carousel-example-generic" data-slide-to="1"/>'
        + '<li data-target="#carousel-example-generic" data-slide-to="2"/>'
        + '</ol>'
        + '<div class="carousel-inner">'
        + '<div class="item active">'
        + '<div class="carousel-caption"/>'
        + '</div>'
        + '<div class="item">'
        + '<div class="carousel-caption"/>'
        + '</div>'
        + '<div class="item">'
        + '<div class="carousel-caption"/>'
        + '</div>'
        + '</div>'
        + '<a class="left carousel-control" href="#carousel-example-generic" data-slide="prev"/>'
        + '<a class="right carousel-control" href="#carousel-example-generic" data-slide="next"/>'
        + '</div>'
    var $carousel = $(carouselHTML)

    var done = assert.async()
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
          done()
        }, 0)
      })
      .bootstrapCarousel('next')
  })

  test('should fire slide event with direction', function (assert) {
    var carouselHTML = '<div id="myCarousel" class="carousel slide">'
        + '<div class="carousel-inner">'
        + '<div class="item active">'
        + '<img alt="">'
        + '<div class="carousel-caption">'
        + '<h4>First Thumbnail label</h4>'
        + '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec '
        + 'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh '
        + 'ultricies vehicula ut id elit.</p>'
        + '</div>'
        + '</div>'
        + '<div class="item">'
        + '<img alt="">'
        + '<div class="carousel-caption">'
        + '<h4>Second Thumbnail label</h4>'
        + '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec '
        + 'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh '
        + 'ultricies vehicula ut id elit.</p>'
        + '</div>'
        + '</div>'
        + '<div class="item">'
        + '<img alt="">'
        + '<div class="carousel-caption">'
        + '<h4>Third Thumbnail label</h4>'
        + '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec '
        + 'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh '
        + 'ultricies vehicula ut id elit.</p>'
        + '</div>'
        + '</div>'
        + '</div>'
        + '<a class="left carousel-control" href="#myCarousel" data-slide="prev">&lsaquo;</a>'
        + '<a class="right carousel-control" href="#myCarousel" data-slide="next">&rsaquo;</a>'
        + '</div>'
    var $carousel = $(carouselHTML)

    var done = assert.async()

    $carousel
      .one('slide.bs.carousel', function (e) {
        ok(e.direction, 'direction present on next')
        strictEqual(e.direction, 'left', 'direction is left on next')

        $carousel
          .one('slide.bs.carousel', function (e) {
            ok(e.direction, 'direction present on prev')
            strictEqual(e.direction, 'right', 'direction is right on prev')
            done()
          })
          .bootstrapCarousel('prev')
      })
      .bootstrapCarousel('next')
  })

  test('should fire slid event with direction', function (assert) {
    var carouselHTML = '<div id="myCarousel" class="carousel slide">'
        + '<div class="carousel-inner">'
        + '<div class="item active">'
        + '<img alt="">'
        + '<div class="carousel-caption">'
        + '<h4>First Thumbnail label</h4>'
        + '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec '
        + 'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh '
        + 'ultricies vehicula ut id elit.</p>'
        + '</div>'
        + '</div>'
        + '<div class="item">'
        + '<img alt="">'
        + '<div class="carousel-caption">'
        + '<h4>Second Thumbnail label</h4>'
        + '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec '
        + 'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh '
        + 'ultricies vehicula ut id elit.</p>'
        + '</div>'
        + '</div>'
        + '<div class="item">'
        + '<img alt="">'
        + '<div class="carousel-caption">'
        + '<h4>Third Thumbnail label</h4>'
        + '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec '
        + 'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh '
        + 'ultricies vehicula ut id elit.</p>'
        + '</div>'
        + '</div>'
        + '</div>'
        + '<a class="left carousel-control" href="#myCarousel" data-slide="prev">&lsaquo;</a>'
        + '<a class="right carousel-control" href="#myCarousel" data-slide="next">&rsaquo;</a>'
        + '</div>'
    var $carousel = $(carouselHTML)

    var done = assert.async()

    $carousel
      .one('slid.bs.carousel', function (e) {
        ok(e.direction, 'direction present on next')
        strictEqual(e.direction, 'left', 'direction is left on next')

        $carousel
          .one('slid.bs.carousel', function (e) {
            ok(e.direction, 'direction present on prev')
            strictEqual(e.direction, 'right', 'direction is right on prev')
            done()
          })
          .bootstrapCarousel('prev')
      })
      .bootstrapCarousel('next')
  })

  test('should fire slide event with relatedTarget', function (assert) {
    var template = '<div id="myCarousel" class="carousel slide">'
        + '<div class="carousel-inner">'
        + '<div class="item active">'
        + '<img alt="">'
        + '<div class="carousel-caption">'
        + '<h4>First Thumbnail label</h4>'
        + '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec '
        + 'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh '
        + 'ultricies vehicula ut id elit.</p>'
        + '</div>'
        + '</div>'
        + '<div class="item">'
        + '<img alt="">'
        + '<div class="carousel-caption">'
        + '<h4>Second Thumbnail label</h4>'
        + '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec '
        + 'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh '
        + 'ultricies vehicula ut id elit.</p>'
        + '</div>'
        + '</div>'
        + '<div class="item">'
        + '<img alt="">'
        + '<div class="carousel-caption">'
        + '<h4>Third Thumbnail label</h4>'
        + '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec '
        + 'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh '
        + 'ultricies vehicula ut id elit.</p>'
        + '</div>'
        + '</div>'
        + '</div>'
        + '<a class="left carousel-control" href="#myCarousel" data-slide="prev">&lsaquo;</a>'
        + '<a class="right carousel-control" href="#myCarousel" data-slide="next">&rsaquo;</a>'
        + '</div>'

    var done = assert.async()

    $(template)
      .on('slide.bs.carousel', function (e) {
        ok(e.relatedTarget, 'relatedTarget present')
        ok($(e.relatedTarget).hasClass('item'), 'relatedTarget has class "item"')
        done()
      })
      .bootstrapCarousel('next')
  })

  test('should fire slid event with relatedTarget', function (assert) {
    var template = '<div id="myCarousel" class="carousel slide">'
        + '<div class="carousel-inner">'
        + '<div class="item active">'
        + '<img alt="">'
        + '<div class="carousel-caption">'
        + '<h4>First Thumbnail label</h4>'
        + '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec '
        + 'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh '
        + 'ultricies vehicula ut id elit.</p>'
        + '</div>'
        + '</div>'
        + '<div class="item">'
        + '<img alt="">'
        + '<div class="carousel-caption">'
        + '<h4>Second Thumbnail label</h4>'
        + '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec '
        + 'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh '
        + 'ultricies vehicula ut id elit.</p>'
        + '</div>'
        + '</div>'
        + '<div class="item">'
        + '<img alt="">'
        + '<div class="carousel-caption">'
        + '<h4>Third Thumbnail label</h4>'
        + '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec '
        + 'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh '
        + 'ultricies vehicula ut id elit.</p>'
        + '</div>'
        + '</div>'
        + '</div>'
        + '<a class="left carousel-control" href="#myCarousel" data-slide="prev">&lsaquo;</a>'
        + '<a class="right carousel-control" href="#myCarousel" data-slide="next">&rsaquo;</a>'
        + '</div>'

    var done = assert.async()

    $(template)
      .on('slid.bs.carousel', function (e) {
        ok(e.relatedTarget, 'relatedTarget present')
        ok($(e.relatedTarget).hasClass('item'), 'relatedTarget has class "item"')
        done()
      })
      .bootstrapCarousel('next')
  })

  test('should set interval from data attribute', function () {
    var templateHTML = '<div id="myCarousel" class="carousel slide">'
        + '<div class="carousel-inner">'
        + '<div class="item active">'
        + '<img alt="">'
        + '<div class="carousel-caption">'
        + '<h4>First Thumbnail label</h4>'
        + '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec '
        + 'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh '
        + 'ultricies vehicula ut id elit.</p>'
        + '</div>'
        + '</div>'
        + '<div class="item">'
        + '<img alt="">'
        + '<div class="carousel-caption">'
        + '<h4>Second Thumbnail label</h4>'
        + '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec '
        + 'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh '
        + 'ultricies vehicula ut id elit.</p>'
        + '</div>'
        + '</div>'
        + '<div class="item">'
        + '<img alt="">'
        + '<div class="carousel-caption">'
        + '<h4>Third Thumbnail label</h4>'
        + '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec '
        + 'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh '
        + 'ultricies vehicula ut id elit.</p>'
        + '</div>'
        + '</div>'
        + '</div>'
        + '<a class="left carousel-control" href="#myCarousel" data-slide="prev">&lsaquo;</a>'
        + '<a class="right carousel-control" href="#myCarousel" data-slide="next">&rsaquo;</a>'
        + '</div>'
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

  test('should skip over non-items when using item indices', function () {
    var templateHTML = '<div id="myCarousel" class="carousel" data-interval="1814">'
        + '<div class="carousel-inner">'
        + '<div class="item active">'
        + '<img alt="">'
        + '</div>'
        + '<script type="text/x-metamorph" id="thingy"/>'
        + '<div class="item">'
        + '<img alt="">'
        + '</div>'
        + '<div class="item">'
        + '</div>'
        + '</div>'
        + '</div>'
    var $template = $(templateHTML)

    $template.bootstrapCarousel()

    strictEqual($template.find('.item')[0], $template.find('.active')[0], 'first item active')

    $template.bootstrapCarousel(1)

    strictEqual($template.find('.item')[1], $template.find('.active')[0], 'second item active')
  })

  test('should skip over non-items when using next/prev methods', function () {
    var templateHTML = '<div id="myCarousel" class="carousel" data-interval="1814">'
        + '<div class="carousel-inner">'
        + '<div class="item active">'
        + '<img alt="">'
        + '</div>'
        + '<script type="text/x-metamorph" id="thingy"/>'
        + '<div class="item">'
        + '<img alt="">'
        + '</div>'
        + '<div class="item">'
        + '</div>'
        + '</div>'
        + '</div>'
    var $template = $(templateHTML)

    $template.bootstrapCarousel()

    strictEqual($template.find('.item')[0], $template.find('.active')[0], 'first item active')

    $template.bootstrapCarousel('next')

    strictEqual($template.find('.item')[1], $template.find('.active')[0], 'second item active')
  })

  test('should go to previous item if left arrow key is pressed', function () {
    var templateHTML = '<div id="myCarousel" class="carousel" data-interval="false">'
        + '<div class="carousel-inner">'
        + '<div id="first" class="item">'
        + '<img alt="">'
        + '</div>'
        + '<div id="second" class="item active">'
        + '<img alt="">'
        + '</div>'
        + '<div id="third" class="item">'
        + '<img alt="">'
        + '</div>'
        + '</div>'
        + '</div>'
    var $template = $(templateHTML)

    $template.bootstrapCarousel()

    strictEqual($template.find('.item')[1], $template.find('.active')[0], 'second item active')

    $template.trigger($.Event('keydown', { which: 37 }))

    strictEqual($template.find('.item')[0], $template.find('.active')[0], 'first item active')
  })

  test('should go to next item if right arrow key is pressed', function () {
    var templateHTML = '<div id="myCarousel" class="carousel" data-interval="false">'
        + '<div class="carousel-inner">'
        + '<div id="first" class="item active">'
        + '<img alt="">'
        + '</div>'
        + '<div id="second" class="item">'
        + '<img alt="">'
        + '</div>'
        + '<div id="third" class="item">'
        + '<img alt="">'
        + '</div>'
        + '</div>'
        + '</div>'
    var $template = $(templateHTML)

    $template.bootstrapCarousel()

    strictEqual($template.find('.item')[0], $template.find('.active')[0], 'first item active')

    $template.trigger($.Event('keydown', { which: 39 }))

    strictEqual($template.find('.item')[1], $template.find('.active')[0], 'second item active')
  })

  test('should support disabling the keyboard navigation', function () {
    var templateHTML = '<div id="myCarousel" class="carousel" data-interval="false" data-keyboard="false">'
        + '<div class="carousel-inner">'
        + '<div id="first" class="item active">'
        + '<img alt="">'
        + '</div>'
        + '<div id="second" class="item">'
        + '<img alt="">'
        + '</div>'
        + '<div id="third" class="item">'
        + '<img alt="">'
        + '</div>'
        + '</div>'
        + '</div>'
    var $template = $(templateHTML)

    $template.bootstrapCarousel()

    strictEqual($template.find('.item')[0], $template.find('.active')[0], 'first item active')

    $template.trigger($.Event('keydown', { which: 39 }))

    strictEqual($template.find('.item')[0], $template.find('.active')[0], 'first item still active after right arrow press')

    $template.trigger($.Event('keydown', { which: 37 }))

    strictEqual($template.find('.item')[0], $template.find('.active')[0], 'first item still active after left arrow press')
  })

  test('should ignore keyboard events within <input>s and <textarea>s', function () {
    var templateHTML = '<div id="myCarousel" class="carousel" data-interval="false">'
        + '<div class="carousel-inner">'
        + '<div id="first" class="item active">'
        + '<img alt="">'
        + '<input type="text" id="in-put">'
        + '<textarea id="text-area"></textarea>'
        + '</div>'
        + '<div id="second" class="item">'
        + '<img alt="">'
        + '</div>'
        + '<div id="third" class="item">'
        + '<img alt="">'
        + '</div>'
        + '</div>'
        + '</div>'
    var $template = $(templateHTML)
    var $input = $template.find('#in-put')
    var $textarea = $template.find('#text-area')

    strictEqual($input.length, 1, 'found <input>')
    strictEqual($textarea.length, 1, 'found <textarea>')

    $template.bootstrapCarousel()

    strictEqual($template.find('.item')[0], $template.find('.active')[0], 'first item active')


    $input.trigger($.Event('keydown', { which: 39 }))
    strictEqual($template.find('.item')[0], $template.find('.active')[0], 'first item still active after right arrow press in <input>')

    $input.trigger($.Event('keydown', { which: 37 }))
    strictEqual($template.find('.item')[0], $template.find('.active')[0], 'first item still active after left arrow press in <input>')


    $textarea.trigger($.Event('keydown', { which: 39 }))
    strictEqual($template.find('.item')[0], $template.find('.active')[0], 'first item still active after right arrow press in <textarea>')

    $textarea.trigger($.Event('keydown', { which: 37 }))
    strictEqual($template.find('.item')[0], $template.find('.active')[0], 'first item still active after left arrow press in <textarea>')
  })

  test('should only add mouseenter and mouseleave listeners when not on mobile', function () {
    var isMobile     = 'ontouchstart' in document.documentElement
    var templateHTML = '<div id="myCarousel" class="carousel" data-interval="false" data-pause="hover">'
        + '<div class="carousel-inner">'
        + '<div id="first" class="item active">'
        + '<img alt="">'
        + '</div>'
        + '<div id="second" class="item">'
        + '<img alt="">'
        + '</div>'
        + '<div id="third" class="item">'
        + '<img alt="">'
        + '</div>'
        + '</div>'
        + '</div>'
    var $template = $(templateHTML).bootstrapCarousel()

    $.each(['mouseover', 'mouseout'], function (i, type) {
      strictEqual(type in $._data($template[0], 'events'), !isMobile, 'does' + (isMobile ? ' not' : '') + ' listen for ' + type + ' events')
    })
  })

  test('should wrap around from end to start when wrap option is true', function (assert) {
    var carouselHTML = '<div id="carousel-example-generic" class="carousel slide" data-wrap="true">'
        + '<ol class="carousel-indicators">'
        + '<li data-target="#carousel-example-generic" data-slide-to="0" class="active"/>'
        + '<li data-target="#carousel-example-generic" data-slide-to="1"/>'
        + '<li data-target="#carousel-example-generic" data-slide-to="2"/>'
        + '</ol>'
        + '<div class="carousel-inner">'
        + '<div class="item active" id="one">'
        + '<div class="carousel-caption"/>'
        + '</div>'
        + '<div class="item" id="two">'
        + '<div class="carousel-caption"/>'
        + '</div>'
        + '<div class="item" id="three">'
        + '<div class="carousel-caption"/>'
        + '</div>'
        + '</div>'
        + '<a class="left carousel-control" href="#carousel-example-generic" data-slide="prev"/>'
        + '<a class="right carousel-control" href="#carousel-example-generic" data-slide="next"/>'
        + '</div>'
    var $carousel = $(carouselHTML)
    var getActiveId = function () { return $carousel.find('.item.active').attr('id') }

    var done = assert.async()

    $carousel
      .one('slid.bs.carousel', function () {
        strictEqual(getActiveId(), 'two', 'carousel slid from 1st to 2nd slide')
        $carousel
          .one('slid.bs.carousel', function () {
            strictEqual(getActiveId(), 'three', 'carousel slid from 2nd to 3rd slide')
            $carousel
              .one('slid.bs.carousel', function () {
                strictEqual(getActiveId(), 'one', 'carousel wrapped around and slid from 3rd to 1st slide')
                done()
              })
              .bootstrapCarousel('next')
          })
          .bootstrapCarousel('next')
      })
      .bootstrapCarousel('next')
  })

  test('should wrap around from start to end when wrap option is true', function (assert) {
    var carouselHTML = '<div id="carousel-example-generic" class="carousel slide" data-wrap="true">'
        + '<ol class="carousel-indicators">'
        + '<li data-target="#carousel-example-generic" data-slide-to="0" class="active"/>'
        + '<li data-target="#carousel-example-generic" data-slide-to="1"/>'
        + '<li data-target="#carousel-example-generic" data-slide-to="2"/>'
        + '</ol>'
        + '<div class="carousel-inner">'
        + '<div class="item active" id="one">'
        + '<div class="carousel-caption"/>'
        + '</div>'
        + '<div class="item" id="two">'
        + '<div class="carousel-caption"/>'
        + '</div>'
        + '<div class="item" id="three">'
        + '<div class="carousel-caption"/>'
        + '</div>'
        + '</div>'
        + '<a class="left carousel-control" href="#carousel-example-generic" data-slide="prev"/>'
        + '<a class="right carousel-control" href="#carousel-example-generic" data-slide="next"/>'
        + '</div>'
    var $carousel = $(carouselHTML)

    var done = assert.async()

    $carousel
      .on('slid.bs.carousel', function () {
        strictEqual($carousel.find('.item.active').attr('id'), 'three', 'carousel wrapped around and slid from 1st to 3rd slide')
        done()
      })
      .bootstrapCarousel('prev')
  })

  test('should stay at the end when the next method is called and wrap is false', function (assert) {
    var carouselHTML = '<div id="carousel-example-generic" class="carousel slide" data-wrap="false">'
        + '<ol class="carousel-indicators">'
        + '<li data-target="#carousel-example-generic" data-slide-to="0" class="active"/>'
        + '<li data-target="#carousel-example-generic" data-slide-to="1"/>'
        + '<li data-target="#carousel-example-generic" data-slide-to="2"/>'
        + '</ol>'
        + '<div class="carousel-inner">'
        + '<div class="item active" id="one">'
        + '<div class="carousel-caption"/>'
        + '</div>'
        + '<div class="item" id="two">'
        + '<div class="carousel-caption"/>'
        + '</div>'
        + '<div class="item" id="three">'
        + '<div class="carousel-caption"/>'
        + '</div>'
        + '</div>'
        + '<a class="left carousel-control" href="#carousel-example-generic" data-slide="prev"/>'
        + '<a class="right carousel-control" href="#carousel-example-generic" data-slide="next"/>'
        + '</div>'
    var $carousel = $(carouselHTML)
    var getActiveId = function () { return $carousel.find('.item.active').attr('id') }

    var done = assert.async()

    $carousel
      .one('slid.bs.carousel', function () {
        strictEqual(getActiveId(), 'two', 'carousel slid from 1st to 2nd slide')
        $carousel
          .one('slid.bs.carousel', function () {
            strictEqual(getActiveId(), 'three', 'carousel slid from 2nd to 3rd slide')
            $carousel
              .one('slid.bs.carousel', function () {
                ok(false, 'carousel slid when it should not have slid')
              })
              .bootstrapCarousel('next')
            strictEqual(getActiveId(), 'three', 'carousel did not wrap around and stayed on 3rd slide')
            done()
          })
          .bootstrapCarousel('next')
      })
      .bootstrapCarousel('next')
  })

  test('should stay at the start when the prev method is called and wrap is false', function () {
    var carouselHTML = '<div id="carousel-example-generic" class="carousel slide" data-wrap="false">'
        + '<ol class="carousel-indicators">'
        + '<li data-target="#carousel-example-generic" data-slide-to="0" class="active"/>'
        + '<li data-target="#carousel-example-generic" data-slide-to="1"/>'
        + '<li data-target="#carousel-example-generic" data-slide-to="2"/>'
        + '</ol>'
        + '<div class="carousel-inner">'
        + '<div class="item active" id="one">'
        + '<div class="carousel-caption"/>'
        + '</div>'
        + '<div class="item" id="two">'
        + '<div class="carousel-caption"/>'
        + '</div>'
        + '<div class="item" id="three">'
        + '<div class="carousel-caption"/>'
        + '</div>'
        + '</div>'
        + '<a class="left carousel-control" href="#carousel-example-generic" data-slide="prev"/>'
        + '<a class="right carousel-control" href="#carousel-example-generic" data-slide="next"/>'
        + '</div>'
    var $carousel = $(carouselHTML)

    $carousel
      .on('slid.bs.carousel', function () {
        ok(false, 'carousel slid when it should not have slid')
      })
      .bootstrapCarousel('prev')
    strictEqual($carousel.find('.item.active').attr('id'), 'one', 'carousel did not wrap around and stayed on 1st slide')
  })
})
