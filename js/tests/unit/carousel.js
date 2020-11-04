$(function () {
  'use strict'

  window.Carousel = typeof bootstrap !== 'undefined' ? bootstrap.Carousel : Carousel

  var originWinPointerEvent = window.PointerEvent
  window.MSPointerEvent = null
  var supportPointerEvent = Boolean(window.PointerEvent || window.MSPointerEvent)

  function clearPointerEvents() {
    window.PointerEvent = null
  }

  function restorePointerEvents() {
    window.PointerEvent = originWinPointerEvent
  }

  var stylesCarousel = [
    '<style>',
    '  .carousel.pointer-event { -ms-touch-action: none; touch-action: none; }',
    '</style>'
  ].join('')

  QUnit.module('carousel plugin')

  QUnit.test('should be defined on jQuery object', function (assert) {
    assert.expect(1)
    assert.ok($(document.body).carousel, 'carousel method is defined')
  })

  QUnit.module('carousel', {
    beforeEach: function () {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.bootstrapCarousel = $.fn.carousel.noConflict()
    },
    afterEach: function () {
      $.fn.carousel = $.fn.bootstrapCarousel
      delete $.fn.bootstrapCarousel
      $('#qunit-fixture').html('')
    }
  })

  QUnit.test('should provide no conflict', function (assert) {
    assert.expect(1)
    assert.strictEqual(typeof $.fn.carousel, 'undefined', 'carousel was set back to undefined (orig value)')
  })

  QUnit.test('should return version', function (assert) {
    assert.expect(1)

    assert.strictEqual(typeof Carousel.VERSION, 'string')
  })

  QUnit.test('should return default parameters', function (assert) {
    assert.expect(1)

    var defaultConfig = Carousel.Default

    assert.strictEqual(defaultConfig.touch, true)
  })

  QUnit.test('should throw explicit error on undefined method', function (assert) {
    assert.expect(1)
    var $el = $('<div/>')
    $el.bootstrapCarousel()
    try {
      $el.bootstrapCarousel('noMethod')
    } catch (error) {
      assert.strictEqual(error.message, 'No method named "noMethod"')
    }
  })

  QUnit.test('should return jquery collection containing the element', function (assert) {
    assert.expect(2)
    var $el = $('<div/>')
    var $carousel = $el.bootstrapCarousel()
    assert.ok($carousel instanceof $, 'returns jquery collection')
    assert.strictEqual($carousel[0], $el[0], 'collection contains element')
  })

  QUnit.test('should type check config options', function (assert) {
    assert.expect(2)

    var message
    var expectedMessage = 'CAROUSEL: Option "interval" provided type "string" but expected type "(number|boolean)".'
    var config = {
      interval: 'fat sux'
    }

    try {
      $('<div/>').bootstrapCarousel(config)
    } catch (error) {
      message = error.message
    }

    assert.ok(message === expectedMessage, 'correct error message')

    config = {
      keyboard: document.createElement('div')
    }
    expectedMessage = 'CAROUSEL: Option "keyboard" provided type "element" but expected type "boolean".'

    try {
      $('<div/>').bootstrapCarousel(config)
    } catch (error) {
      message = error.message
    }

    assert.ok(message === expectedMessage, 'correct error message')
  })

  QUnit.test('should not fire slid when slide is prevented', function (assert) {
    assert.expect(1)
    var done = assert.async()
    $('<div class="carousel"/>')
      .on('slide.bs.carousel', function (e) {
        e.preventDefault()
        assert.ok(true, 'slide event fired')
        done()
      })
      .on('slid.bs.carousel', function () {
        assert.ok(false, 'slid event fired')
      })
      .bootstrapCarousel('next')
  })

  QUnit.test('should reset when slide is prevented', function (assert) {
    assert.expect(6)
    var carouselHTML = '<div id="carousel-example-generic" class="carousel slide">' +
        '<ol class="carousel-indicators">' +
        '<li data-target="#carousel-example-generic" data-slide-to="0" class="active"/>' +
        '<li data-target="#carousel-example-generic" data-slide-to="1"/>' +
        '<li data-target="#carousel-example-generic" data-slide-to="2"/>' +
        '</ol>' +
        '<div class="carousel-inner">' +
        '<div class="carousel-item active">' +
        '<div class="carousel-caption"></div>' +
        '</div>' +
        '<div class="carousel-item">' +
        '<div class="carousel-caption"></div>' +
        '</div>' +
        '<div class="carousel-item">' +
        '<div class="carousel-caption"></div>' +
        '</div>' +
        '</div>' +
        '<a class="left carousel-control" href="#carousel-example-generic" data-slide="prev"/>' +
        '<a class="right carousel-control" href="#carousel-example-generic" data-slide="next"/>' +
        '</div>'
    var $carousel = $(carouselHTML)

    var done = assert.async()
    $carousel
      .one('slide.bs.carousel', function (e) {
        e.preventDefault()
        setTimeout(function () {
          assert.ok($carousel.find('.carousel-item:nth-child(1)').is('.active'), 'first item still active')
          assert.ok($carousel.find('.carousel-indicators li:nth-child(1)').is('.active'), 'first indicator still active')
          $carousel.bootstrapCarousel('next')
        }, 0)
      })
      .one('slid.bs.carousel', function () {
        setTimeout(function () {
          assert.ok(!$carousel.find('.carousel-item:nth-child(1)').is('.active'), 'first item still active')
          assert.ok(!$carousel.find('.carousel-indicators li:nth-child(1)').is('.active'), 'first indicator still active')
          assert.ok($carousel.find('.carousel-item:nth-child(2)').is('.active'), 'second item active')
          assert.ok($carousel.find('.carousel-indicators li:nth-child(2)').is('.active'), 'second indicator active')
          done()
        }, 0)
      })
      .bootstrapCarousel('next')
  })

  QUnit.test('should fire slide event with direction', function (assert) {
    assert.expect(4)
    var carouselHTML = '<div id="myCarousel" class="carousel slide">' +
        '<div class="carousel-inner">' +
        '<div class="carousel-item active">' +
        '<img alt="">' +
        '<div class="carousel-caption">' +
        '<h4>First Thumbnail label</h4>' +
        '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' +
        'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' +
        'ultricies vehicula ut id elit.</p>' +
        '</div>' +
        '</div>' +
        '<div class="carousel-item">' +
        '<img alt="">' +
        '<div class="carousel-caption">' +
        '<h4>Second Thumbnail label</h4>' +
        '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' +
        'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' +
        'ultricies vehicula ut id elit.</p>' +
        '</div>' +
        '</div>' +
        '<div class="carousel-item">' +
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

    var done = assert.async()

    $carousel
      .one('slide.bs.carousel', function (e) {
        assert.ok(e.direction, 'direction present on next')
        assert.strictEqual(e.direction, 'left', 'direction is left on next')

        $carousel
          .one('slide.bs.carousel', function (e) {
            assert.ok(e.direction, 'direction present on prev')
            assert.strictEqual(e.direction, 'right', 'direction is right on prev')
            done()
          })
          .bootstrapCarousel('prev')
      })
      .bootstrapCarousel('next')
  })

  QUnit.test('should fire slid event with direction', function (assert) {
    assert.expect(4)
    var carouselHTML = '<div id="myCarousel" class="carousel slide">' +
        '<div class="carousel-inner">' +
        '<div class="carousel-item active">' +
        '<img alt="">' +
        '<div class="carousel-caption">' +
        '<h4>First Thumbnail label</h4>' +
        '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' +
        'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' +
        'ultricies vehicula ut id elit.</p>' +
        '</div>' +
        '</div>' +
        '<div class="carousel-item">' +
        '<img alt="">' +
        '<div class="carousel-caption">' +
        '<h4>Second Thumbnail label</h4>' +
        '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' +
        'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' +
        'ultricies vehicula ut id elit.</p>' +
        '</div>' +
        '</div>' +
        '<div class="carousel-item">' +
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

    var done = assert.async()

    $carousel
      .one('slid.bs.carousel', function (e) {
        assert.ok(e.direction, 'direction present on next')
        assert.strictEqual(e.direction, 'left', 'direction is left on next')

        $carousel
          .one('slid.bs.carousel', function (e) {
            assert.ok(e.direction, 'direction present on prev')
            assert.strictEqual(e.direction, 'right', 'direction is right on prev')
            done()
          })
          .bootstrapCarousel('prev')
      })
      .bootstrapCarousel('next')
  })

  QUnit.test('should fire slide event with relatedTarget', function (assert) {
    assert.expect(2)
    var template = '<div id="myCarousel" class="carousel slide">' +
        '<div class="carousel-inner">' +
        '<div class="carousel-item active">' +
        '<img alt="">' +
        '<div class="carousel-caption">' +
        '<h4>First Thumbnail label</h4>' +
        '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' +
        'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' +
        'ultricies vehicula ut id elit.</p>' +
        '</div>' +
        '</div>' +
        '<div class="carousel-item">' +
        '<img alt="">' +
        '<div class="carousel-caption">' +
        '<h4>Second Thumbnail label</h4>' +
        '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' +
        'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' +
        'ultricies vehicula ut id elit.</p>' +
        '</div>' +
        '</div>' +
        '<div class="carousel-item">' +
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

    var done = assert.async()

    $(template)
      .on('slide.bs.carousel', function (e) {
        assert.ok(e.relatedTarget, 'relatedTarget present')
        assert.ok($(e.relatedTarget).hasClass('carousel-item'), 'relatedTarget has class "item"')
        done()
      })
      .bootstrapCarousel('next')
  })

  QUnit.test('should fire slid event with relatedTarget', function (assert) {
    assert.expect(2)
    var template = '<div id="myCarousel" class="carousel slide">' +
        '<div class="carousel-inner">' +
        '<div class="carousel-item active">' +
        '<img alt="">' +
        '<div class="carousel-caption">' +
        '<h4>First Thumbnail label</h4>' +
        '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' +
        'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' +
        'ultricies vehicula ut id elit.</p>' +
        '</div>' +
        '</div>' +
        '<div class="carousel-item">' +
        '<img alt="">' +
        '<div class="carousel-caption">' +
        '<h4>Second Thumbnail label</h4>' +
        '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' +
        'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' +
        'ultricies vehicula ut id elit.</p>' +
        '</div>' +
        '</div>' +
        '<div class="carousel-item">' +
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

    var done = assert.async()

    $(template)
      .on('slid.bs.carousel', function (e) {
        assert.ok(e.relatedTarget, 'relatedTarget present')
        assert.ok($(e.relatedTarget).hasClass('carousel-item'), 'relatedTarget has class "item"')
        done()
      })
      .bootstrapCarousel('next')
  })

  QUnit.test('should fire slid and slide events with from and to', function (assert) {
    assert.expect(4)
    var template = '<div id="myCarousel" class="carousel slide">' +
        '<div class="carousel-inner">' +
        '<div class="carousel-item active">' +
        '<img alt="">' +
        '<div class="carousel-caption">' +
        '<h4>First Thumbnail label</h4>' +
        '</div>' +
        '</div>' +
        '<div class="carousel-item">' +
        '<img alt="">' +
        '<div class="carousel-caption">' +
        '<h4>Second Thumbnail label</h4>' +
        '</div>' +
        '</div>' +
        '<div class="carousel-item">' +
        '<img alt="">' +
        '<div class="carousel-caption">' +
        '<h4>Third Thumbnail label</h4>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<a class="left carousel-control" href="#myCarousel" data-slide="prev">&lsaquo;</a>' +
        '<a class="right carousel-control" href="#myCarousel" data-slide="next">&rsaquo;</a>' +
        '</div>'

    var done = assert.async()
    $(template)
      .on('slid.bs.carousel', function (e) {
        assert.ok(typeof e.from !== 'undefined', 'from present')
        assert.ok(typeof e.to !== 'undefined', 'to present')
        $(this).off()
        done()
      })
      .on('slide.bs.carousel', function (e) {
        assert.ok(typeof e.from !== 'undefined', 'from present')
        assert.ok(typeof e.to !== 'undefined', 'to present')
        $(this).off('slide.bs.carousel')
      })
      .bootstrapCarousel('next')
  })

  QUnit.test('should set interval from data attribute', function (assert) {
    assert.expect(4)
    var templateHTML = '<div id="myCarousel" class="carousel slide">' +
        '<div class="carousel-inner">' +
        '<div class="carousel-item active">' +
        '<img alt="">' +
        '<div class="carousel-caption">' +
        '<h4>First Thumbnail label</h4>' +
        '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' +
        'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' +
        'ultricies vehicula ut id elit.</p>' +
        '</div>' +
        '</div>' +
        '<div class="carousel-item">' +
        '<img alt="">' +
        '<div class="carousel-caption">' +
        '<h4>Second Thumbnail label</h4>' +
        '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' +
        'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' +
        'ultricies vehicula ut id elit.</p>' +
        '</div>' +
        '</div>' +
        '<div class="carousel-item">' +
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
    $('[data-slide]').first().trigger('click')
    assert.strictEqual($carousel.data('bs.carousel')._config.interval, 1814)
    $carousel.remove()

    $carousel.appendTo('body').attr('data-modal', 'foobar')
    $('[data-slide]').first().trigger('click')
    assert.strictEqual($carousel.data('bs.carousel')._config.interval, 1814, 'even if there is an data-modal attribute set')
    $carousel.remove()

    $carousel.appendTo('body')
    $('[data-slide]').first().trigger('click')
    $carousel.attr('data-interval', 1860)
    $('[data-slide]').first().trigger('click')
    assert.strictEqual($carousel.data('bs.carousel')._config.interval, 1814, 'attributes should be read only on initialization')
    $carousel.remove()

    $carousel.attr('data-interval', false)
    $carousel.appendTo('body')
    $carousel.bootstrapCarousel(1)
    assert.strictEqual($carousel.data('bs.carousel')._config.interval, false, 'data attribute has higher priority than default options')
    $carousel.remove()
  })

  QUnit.test('should set interval from data attribute on individual carousel-item', function (assert) {
    assert.expect(4)
    var templateHTML = '<div id="myCarousel" class="carousel slide" data-interval="1814">' +
        '<div class="carousel-inner">' +
        '<div class="carousel-item active" data-interval="2814">' +
        '<img alt="">' +
        '<div class="carousel-caption">' +
        '<h4>First Thumbnail label</h4>' +
        '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' +
        'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' +
        'ultricies vehicula ut id elit.</p>' +
        '</div>' +
        '</div>' +
        '<div class="carousel-item" data-interval="3814">' +
        '<img alt="">' +
        '<div class="carousel-caption">' +
        '<h4>Second Thumbnail label</h4>' +
        '<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ' +
        'id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ' +
        'ultricies vehicula ut id elit.</p>' +
        '</div>' +
        '</div>' +
        '<div class="carousel-item">' +
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

    $carousel.appendTo('body')
    $carousel.bootstrapCarousel()
    assert.strictEqual($carousel.data('bs.carousel')._config.interval, 1814)
    $carousel.remove()

    $carousel.appendTo('body')
    $carousel.bootstrapCarousel(0)
    $carousel.data('bs.carousel').cycle()
    assert.strictEqual($carousel.data('bs.carousel')._config.interval, 2814)
    $carousel.remove()

    $carousel.appendTo('body')
    $carousel.bootstrapCarousel(1)
    $carousel.data('bs.carousel').cycle()
    assert.strictEqual($carousel.data('bs.carousel')._config.interval, 3814)
    $carousel.remove()

    $carousel.appendTo('body')
    $carousel.bootstrapCarousel(2)
    $carousel.data('bs.carousel').cycle()
    assert.strictEqual($carousel.data('bs.carousel')._config.interval, 1814, 'reverts to default interval if no data-interval is set')
    $carousel.remove()
  })

  QUnit.test('should skip over non-items when using item indices', function (assert) {
    assert.expect(2)
    var templateHTML = '<div id="myCarousel" class="carousel" data-interval="1814">' +
        '<div class="carousel-inner">' +
        '<div class="carousel-item active">' +
        '<img alt="">' +
        '</div>' +
        '<script type="text/x-metamorph" id="thingy"></script>' +
        '<div class="carousel-item">' +
        '<img alt="">' +
        '</div>' +
        '<div class="carousel-item">' +
        '</div>' +
        '</div>' +
        '</div>'
    var $template = $(templateHTML)

    $template.bootstrapCarousel()

    assert.strictEqual($template.find('.carousel-item')[0], $template.find('.active')[0], 'first item active')

    $template.bootstrapCarousel(1)

    assert.strictEqual($template.find('.carousel-item')[1], $template.find('.active')[0], 'second item active')
  })

  QUnit.test('should skip over non-items when using next/prev methods', function (assert) {
    assert.expect(2)
    var templateHTML = '<div id="myCarousel" class="carousel" data-interval="1814">' +
        '<div class="carousel-inner">' +
        '<div class="carousel-item active">' +
        '<img alt="">' +
        '</div>' +
        '<script type="text/x-metamorph" id="thingy"></script>' +
        '<div class="carousel-item">' +
        '<img alt="">' +
        '</div>' +
        '<div class="carousel-item">' +
        '</div>' +
        '</div>' +
        '</div>'
    var $template = $(templateHTML)

    $template.bootstrapCarousel()

    assert.strictEqual($template.find('.carousel-item')[0], $template.find('.active')[0], 'first item active')

    $template.bootstrapCarousel('next')

    assert.strictEqual($template.find('.carousel-item')[1], $template.find('.active')[0], 'second item active')
  })

  QUnit.test('should go to previous item if left arrow key is pressed', function (assert) {
    assert.expect(2)
    var templateHTML = '<div id="myCarousel" class="carousel" data-interval="false">' +
        '<div class="carousel-inner">' +
        '<div id="first" class="carousel-item">' +
        '<img alt="">' +
        '</div>' +
        '<div id="second" class="carousel-item active">' +
        '<img alt="">' +
        '</div>' +
        '<div id="third" class="carousel-item">' +
        '<img alt="">' +
        '</div>' +
        '</div>' +
        '</div>'
    var $template = $(templateHTML)

    $template.bootstrapCarousel()

    assert.strictEqual($template.find('.carousel-item')[1], $template.find('.active')[0], 'second item active')

    $template.trigger($.Event('keydown', {
      which: 37
    }))

    assert.strictEqual($template.find('.carousel-item')[0], $template.find('.active')[0], 'first item active')
  })

  QUnit.test('should go to next item if right arrow key is pressed', function (assert) {
    assert.expect(2)
    var templateHTML = '<div id="myCarousel" class="carousel" data-interval="false">' +
        '<div class="carousel-inner">' +
        '<div id="first" class="carousel-item active">' +
        '<img alt="">' +
        '</div>' +
        '<div id="second" class="carousel-item">' +
        '<img alt="">' +
        '</div>' +
        '<div id="third" class="carousel-item">' +
        '<img alt="">' +
        '</div>' +
        '</div>' +
        '</div>'
    var $template = $(templateHTML)

    $template.bootstrapCarousel()

    assert.strictEqual($template.find('.carousel-item')[0], $template.find('.active')[0], 'first item active')

    $template.trigger($.Event('keydown', {
      which: 39
    }))

    assert.strictEqual($template.find('.carousel-item')[1], $template.find('.active')[0], 'second item active')
  })

  QUnit.test('should not prevent keydown if key is not ARROW_LEFT or ARROW_RIGHT', function (assert) {
    assert.expect(2)
    var templateHTML = '<div id="myCarousel" class="carousel" data-interval="false">' +
        '<div class="carousel-inner">' +
        '<div id="first" class="carousel-item active">' +
        '<img alt="">' +
        '</div>' +
        '</div>' +
        '</div>'
    var $template = $(templateHTML)

    $template.bootstrapCarousel()
    var done = assert.async()

    var eventArrowDown = $.Event('keydown', {
      which: 40
    })
    var eventArrowUp = $.Event('keydown', {
      which: 38
    })

    $template.one('keydown', function (event) {
      assert.strictEqual(event.isDefaultPrevented(), false)
    })

    $template.trigger(eventArrowDown)

    $template.one('keydown', function (event) {
      assert.strictEqual(event.isDefaultPrevented(), false)
      done()
    })

    $template.trigger(eventArrowUp)
  })

  QUnit.test('should support disabling the keyboard navigation', function (assert) {
    assert.expect(3)
    var templateHTML = '<div id="myCarousel" class="carousel" data-interval="false" data-keyboard="false">' +
        '<div class="carousel-inner">' +
        '<div id="first" class="carousel-item active">' +
        '<img alt="">' +
        '</div>' +
        '<div id="second" class="carousel-item">' +
        '<img alt="">' +
        '</div>' +
        '<div id="third" class="carousel-item">' +
        '<img alt="">' +
        '</div>' +
        '</div>' +
        '</div>'
    var $template = $(templateHTML)

    $template.bootstrapCarousel()

    assert.strictEqual($template.find('.carousel-item')[0], $template.find('.active')[0], 'first item active')

    $template.trigger($.Event('keydown', {
      which: 39
    }))

    assert.strictEqual($template.find('.carousel-item')[0], $template.find('.active')[0], 'first item still active after right arrow press')

    $template.trigger($.Event('keydown', {
      which: 37
    }))

    assert.strictEqual($template.find('.carousel-item')[0], $template.find('.active')[0], 'first item still active after left arrow press')
  })

  QUnit.test('should ignore keyboard events within <input>s and <textarea>s', function (assert) {
    assert.expect(7)
    var templateHTML = '<div id="myCarousel" class="carousel" data-interval="false">' +
        '<div class="carousel-inner">' +
        '<div id="first" class="carousel-item active">' +
        '<img alt="">' +
        '<input type="text" id="in-put">' +
        '<textarea id="text-area"></textarea>' +
        '</div>' +
        '<div id="second" class="carousel-item">' +
        '<img alt="">' +
        '</div>' +
        '<div id="third" class="carousel-item">' +
        '<img alt="">' +
        '</div>' +
        '</div>' +
        '</div>'
    var $template = $(templateHTML)
    var $input = $template.find('#in-put')
    var $textarea = $template.find('#text-area')

    assert.strictEqual($input.length, 1, 'found <input>')
    assert.strictEqual($textarea.length, 1, 'found <textarea>')

    $template.bootstrapCarousel()

    assert.strictEqual($template.find('.carousel-item')[0], $template.find('.active')[0], 'first item active')

    $input.trigger($.Event('keydown', {
      which: 39
    }))
    assert.strictEqual($template.find('.carousel-item')[0], $template.find('.active')[0], 'first item still active after right arrow press in <input>')

    $input.trigger($.Event('keydown', {
      which: 37
    }))
    assert.strictEqual($template.find('.carousel-item')[0], $template.find('.active')[0], 'first item still active after left arrow press in <input>')

    $textarea.trigger($.Event('keydown', {
      which: 39
    }))
    assert.strictEqual($template.find('.carousel-item')[0], $template.find('.active')[0], 'first item still active after right arrow press in <textarea>')

    $textarea.trigger($.Event('keydown', {
      which: 37
    }))
    assert.strictEqual($template.find('.carousel-item')[0], $template.find('.active')[0], 'first item still active after left arrow press in <textarea>')
  })

  QUnit.test('should wrap around from end to start when wrap option is true', function (assert) {
    assert.expect(3)
    var carouselHTML = '<div id="carousel-example-generic" class="carousel slide" data-wrap="true">' +
        '<ol class="carousel-indicators">' +
        '<li data-target="#carousel-example-generic" data-slide-to="0" class="active"/>' +
        '<li data-target="#carousel-example-generic" data-slide-to="1"/>' +
        '<li data-target="#carousel-example-generic" data-slide-to="2"/>' +
        '</ol>' +
        '<div class="carousel-inner">' +
        '<div class="carousel-item active" id="one">' +
        '<div class="carousel-caption"></div>' +
        '</div>' +
        '<div class="carousel-item" id="two">' +
        '<div class="carousel-caption"></div>' +
        '</div>' +
        '<div class="carousel-item" id="three">' +
        '<div class="carousel-caption"></div>' +
        '</div>' +
        '</div>' +
        '<a class="left carousel-control" href="#carousel-example-generic" data-slide="prev"/>' +
        '<a class="right carousel-control" href="#carousel-example-generic" data-slide="next"/>' +
        '</div>'
    var $carousel = $(carouselHTML)
    var getActiveId = function () {
      return $carousel.find('.carousel-item.active').attr('id')
    }

    var done = assert.async()

    $carousel
      .one('slid.bs.carousel', function () {
        assert.strictEqual(getActiveId(), 'two', 'carousel slid from 1st to 2nd slide')
        $carousel
          .one('slid.bs.carousel', function () {
            assert.strictEqual(getActiveId(), 'three', 'carousel slid from 2nd to 3rd slide')
            $carousel
              .one('slid.bs.carousel', function () {
                assert.strictEqual(getActiveId(), 'one', 'carousel wrapped around and slid from 3rd to 1st slide')
                done()
              })
              .bootstrapCarousel('next')
          })
          .bootstrapCarousel('next')
      })
      .bootstrapCarousel('next')
  })

  QUnit.test('should wrap around from start to end when wrap option is true', function (assert) {
    assert.expect(1)
    var carouselHTML = '<div id="carousel-example-generic" class="carousel slide" data-wrap="true">' +
        '<ol class="carousel-indicators">' +
        '<li data-target="#carousel-example-generic" data-slide-to="0" class="active"/>' +
        '<li data-target="#carousel-example-generic" data-slide-to="1"/>' +
        '<li data-target="#carousel-example-generic" data-slide-to="2"/>' +
        '</ol>' +
        '<div class="carousel-inner">' +
        '<div class="carousel-item active" id="one">' +
        '<div class="carousel-caption"></div>' +
        '</div>' +
        '<div class="carousel-item" id="two">' +
        '<div class="carousel-caption"></div>' +
        '</div>' +
        '<div class="carousel-item" id="three">' +
        '<div class="carousel-caption"></div>' +
        '</div>' +
        '</div>' +
        '<a class="left carousel-control" href="#carousel-example-generic" data-slide="prev"/>' +
        '<a class="right carousel-control" href="#carousel-example-generic" data-slide="next"/>' +
        '</div>'
    var $carousel = $(carouselHTML)

    var done = assert.async()

    $carousel
      .on('slid.bs.carousel', function () {
        assert.strictEqual($carousel.find('.carousel-item.active').attr('id'), 'three', 'carousel wrapped around and slid from 1st to 3rd slide')
        done()
      })
      .bootstrapCarousel('prev')
  })

  QUnit.test('should stay at the end when the next method is called and wrap is false', function (assert) {
    assert.expect(3)
    var carouselHTML = '<div id="carousel-example-generic" class="carousel slide" data-wrap="false">' +
        '<ol class="carousel-indicators">' +
        '<li data-target="#carousel-example-generic" data-slide-to="0" class="active"/>' +
        '<li data-target="#carousel-example-generic" data-slide-to="1"/>' +
        '<li data-target="#carousel-example-generic" data-slide-to="2"/>' +
        '</ol>' +
        '<div class="carousel-inner">' +
        '<div class="carousel-item active" id="one">' +
        '<div class="carousel-caption"></div>' +
        '</div>' +
        '<div class="carousel-item" id="two">' +
        '<div class="carousel-caption"></div>' +
        '</div>' +
        '<div class="carousel-item" id="three">' +
        '<div class="carousel-caption"></div>' +
        '</div>' +
        '</div>' +
        '<a class="left carousel-control" href="#carousel-example-generic" data-slide="prev"/>' +
        '<a class="right carousel-control" href="#carousel-example-generic" data-slide="next"/>' +
        '</div>'
    var $carousel = $(carouselHTML)
    var getActiveId = function () {
      return $carousel.find('.carousel-item.active').attr('id')
    }

    var done = assert.async()

    $carousel
      .one('slid.bs.carousel', function () {
        assert.strictEqual(getActiveId(), 'two', 'carousel slid from 1st to 2nd slide')
        $carousel
          .one('slid.bs.carousel', function () {
            assert.strictEqual(getActiveId(), 'three', 'carousel slid from 2nd to 3rd slide')
            $carousel
              .one('slid.bs.carousel', function () {
                assert.ok(false, 'carousel slid when it should not have slid')
              })
              .bootstrapCarousel('next')
            assert.strictEqual(getActiveId(), 'three', 'carousel did not wrap around and stayed on 3rd slide')
            done()
          })
          .bootstrapCarousel('next')
      })
      .bootstrapCarousel('next')
  })

  QUnit.test('should stay at the start when the prev method is called and wrap is false', function (assert) {
    assert.expect(1)
    var carouselHTML = '<div id="carousel-example-generic" class="carousel slide" data-wrap="false">' +
        '<ol class="carousel-indicators">' +
        '<li data-target="#carousel-example-generic" data-slide-to="0" class="active"/>' +
        '<li data-target="#carousel-example-generic" data-slide-to="1"/>' +
        '<li data-target="#carousel-example-generic" data-slide-to="2"/>' +
        '</ol>' +
        '<div class="carousel-inner">' +
        '<div class="carousel-item active" id="one">' +
        '<div class="carousel-caption"></div>' +
        '</div>' +
        '<div class="carousel-item" id="two">' +
        '<div class="carousel-caption"></div>' +
        '</div>' +
        '<div class="carousel-item" id="three">' +
        '<div class="carousel-caption"></div>' +
        '</div>' +
        '</div>' +
        '<a class="left carousel-control" href="#carousel-example-generic" data-slide="prev"/>' +
        '<a class="right carousel-control" href="#carousel-example-generic" data-slide="next"/>' +
        '</div>'
    var $carousel = $(carouselHTML)

    $carousel
      .on('slid.bs.carousel', function () {
        assert.ok(false, 'carousel slid when it should not have slid')
      })
      .bootstrapCarousel('prev')
    assert.strictEqual($carousel.find('.carousel-item.active').attr('id'), 'one', 'carousel did not wrap around and stayed on 1st slide')
  })

  QUnit.test('should not prevent keydown for inputs and textareas', function (assert) {
    assert.expect(2)
    var templateHTML = '<div id="myCarousel" class="carousel" data-interval="false">' +
        '<div class="carousel-inner">' +
          '<div id="first" class="carousel-item">' +
            '<input type="text" id="inputText" />' +
          '</div>' +
          '<div id="second" class="carousel-item active">' +
            '<textarea id="txtArea"></textarea>' +
          '</div>' +
        '</div>' +
        '</div>'
    var $template = $(templateHTML)
    var done = assert.async()
    $template.appendTo('#qunit-fixture')
    var $inputText = $template.find('#inputText')
    var $textArea = $template.find('#txtArea')
    $template.bootstrapCarousel()

    var eventKeyDown = $.Event('keydown', {
      which: 65
    }) // 65 for "a"
    $inputText.on('keydown', function (event) {
      assert.strictEqual(event.isDefaultPrevented(), false)
    })
    $inputText.trigger(eventKeyDown)

    $textArea.on('keydown', function (event) {
      assert.strictEqual(event.isDefaultPrevented(), false)
      done()
    })
    $textArea.trigger(eventKeyDown)
  })

  QUnit.test('should not go to the next item when the carousel is not visible', function (assert) {
    assert.expect(2)
    var done = assert.async()
    var html = '<div id="myCarousel" class="carousel slide" data-interval="50" style="display: none;">' +
             '  <div class="carousel-inner">' +
             '    <div id="firstItem" class="carousel-item active">' +
             '      <img alt="">' +
             '    </div>' +
             '    <div class="carousel-item">' +
             '      <img alt="">' +
             '    </div>' +
             '    <div class="carousel-item">' +
             '      <img alt="">' +
             '    </div>' +
             '  <a class="left carousel-control" href="#myCarousel" data-slide="prev">&lsaquo;</a>' +
             '  <a class="right carousel-control" href="#myCarousel" data-slide="next">&rsaquo;</a>' +
             '</div>'
    var $html = $(html)
    $html
      .appendTo('#qunit-fixture')
      .bootstrapCarousel()

    var $firstItem = $('#firstItem')
    setTimeout(function () {
      assert.ok($firstItem.hasClass('active'))
      $html
        .bootstrapCarousel('dispose')
        .attr('style', 'visibility: hidden;')
        .bootstrapCarousel()

      setTimeout(function () {
        assert.ok($firstItem.hasClass('active'))
        done()
      }, 80)
    }, 80)
  })

  QUnit.test('should not go to the next item when the parent of the carousel is not visible', function (assert) {
    assert.expect(2)
    var done = assert.async()
    var html = '<div id="parent" style="display: none;">' +
             '  <div id="myCarousel" class="carousel slide" data-interval="50" style="display: none;">' +
             '    <div class="carousel-inner">' +
             '      <div id="firstItem" class="carousel-item active">' +
             '        <img alt="">' +
             '      </div>' +
             '      <div class="carousel-item">' +
             '        <img alt="">' +
             '      </div>' +
             '      <div class="carousel-item">' +
             '        <img alt="">' +
             '      </div>' +
             '    <a class="left carousel-control" href="#myCarousel" data-slide="prev">&lsaquo;</a>' +
             '    <a class="right carousel-control" href="#myCarousel" data-slide="next">&rsaquo;</a>' +
             '  </div>' +
             '</div>'
    var $html = $(html)
    $html.appendTo('#qunit-fixture')
    var $parent = $html.find('#parent')
    var $carousel = $html.find('#myCarousel')
    $carousel.bootstrapCarousel()
    var $firstItem = $('#firstItem')

    setTimeout(function () {
      assert.ok($firstItem.hasClass('active'))
      $carousel.bootstrapCarousel('dispose')
      $parent.attr('style', 'visibility: hidden;')
      $carousel.bootstrapCarousel()

      setTimeout(function () {
        assert.ok($firstItem.hasClass('active'))
        done()
      }, 80)
    }, 80)
  })

  QUnit.test('should allow swiperight and call prev with pointer events', function (assert) {
    if (!supportPointerEvent) {
      assert.expect(0)
      return
    }

    document.documentElement.ontouchstart = $.noop
    Simulator.setType('pointer')
    assert.expect(3)
    var $styles = $(stylesCarousel).appendTo('head')
    var done = assert.async()

    var carouselHTML =
        '<div class="carousel" data-interval="false">' +
        '  <div class="carousel-inner">' +
        '    <div id="item" class="carousel-item">' +
        '      <img alt="">' +
        '    </div>' +
        '    <div class="carousel-item active">' +
        '      <img alt="">' +
        '    </div>' +
        '  </div>' +
        '</div>'

    var $carousel = $(carouselHTML).appendTo('#qunit-fixture')
    var $item = $('#item')
    $carousel.bootstrapCarousel()
    var carousel = $carousel.data('bs.carousel')
    var spy = sinon.spy(carousel, 'prev')

    $carousel.one('slid.bs.carousel', function () {
      assert.ok(true, 'slid event fired')
      assert.ok($item.hasClass('active'))
      assert.ok(spy.called)
      $styles.remove()
      delete document.documentElement.ontouchstart
      done()
    })

    Simulator.gestures.swipe($carousel[0], {
      deltaX: 300,
      deltaY: 0
    })
  })

  QUnit.test('should allow swiperight and call prev with touch events', function (assert) {
    Simulator.setType('touch')
    clearPointerEvents()

    assert.expect(3)
    var done = assert.async()
    document.documentElement.ontouchstart = $.noop

    var carouselHTML =
        '<div class="carousel" data-interval="false">' +
        '  <div class="carousel-inner">' +
        '    <div id="item" class="carousel-item">' +
        '      <img alt="">' +
        '    </div>' +
        '    <div class="carousel-item active">' +
        '      <img alt="">' +
        '    </div>' +
        '  </div>' +
        '</div>'

    var $carousel = $(carouselHTML)
    $carousel.appendTo('#qunit-fixture')
    var $item = $('#item')
    $carousel.bootstrapCarousel()
    var carousel = $carousel.data('bs.carousel')
    var spy = sinon.spy(carousel, 'prev')

    $carousel.one('slid.bs.carousel', function () {
      assert.ok(true, 'slid event fired')
      assert.ok($item.hasClass('active'))
      assert.ok(spy.called)
      delete document.documentElement.ontouchstart
      restorePointerEvents()
      done()
    })

    Simulator.gestures.swipe($carousel[0], {
      deltaX: 300,
      deltaY: 0
    })
  })

  QUnit.test('should allow swipeleft and call next with pointer events', function (assert) {
    if (!supportPointerEvent) {
      assert.expect(0)
      return
    }

    document.documentElement.ontouchstart = $.noop
    assert.expect(4)
    Simulator.setType('pointer')

    var $styles = $(stylesCarousel).appendTo('head')
    var done = assert.async()

    var carouselHTML =
        '<div class="carousel" data-interval="false">' +
        '  <div class="carousel-inner">' +
        '    <div id="item" class="carousel-item active">' +
        '      <img alt="">' +
        '    </div>' +
        '    <div class="carousel-item">' +
        '      <img alt="">' +
        '    </div>' +
        '  </div>' +
        '</div>'

    var $carousel = $(carouselHTML)
    $carousel.appendTo('#qunit-fixture')
    var $item = $('#item')
    $carousel.bootstrapCarousel()
    var carousel = $carousel.data('bs.carousel')
    var spy = sinon.spy(carousel, 'next')

    $carousel.one('slid.bs.carousel', function () {
      assert.ok(true, 'slid event fired')
      assert.ok(!$item.hasClass('active'))
      assert.ok(spy.called)
      assert.strictEqual(carousel.touchDeltaX, 0)
      $styles.remove()
      delete document.documentElement.ontouchstart
      done()
    })

    Simulator.gestures.swipe($carousel[0], {
      pos: [300, 10],
      deltaX: -300,
      deltaY: 0
    })
  })

  QUnit.test('should allow swipeleft and call next with touch events', function (assert) {
    assert.expect(4)
    clearPointerEvents()
    Simulator.setType('touch')
    document.documentElement.ontouchstart = $.noop

    var done = assert.async()

    var carouselHTML =
        '<div class="carousel" data-interval="false">' +
        '  <div class="carousel-inner">' +
        '    <div id="item" class="carousel-item active">' +
        '      <img alt="">' +
        '    </div>' +
        '    <div class="carousel-item">' +
        '      <img alt="">' +
        '    </div>' +
        '  </div>' +
        '</div>'

    var $carousel = $(carouselHTML)
    $carousel.appendTo('#qunit-fixture')
    var $item = $('#item')
    $carousel.bootstrapCarousel()
    var carousel = $carousel.data('bs.carousel')
    var spy = sinon.spy(carousel, 'next')

    $carousel.one('slid.bs.carousel', function () {
      assert.ok(true, 'slid event fired')
      assert.ok(!$item.hasClass('active'))
      assert.ok(spy.called)
      assert.strictEqual(carousel.touchDeltaX, 0)
      restorePointerEvents()
      delete document.documentElement.ontouchstart
      done()
    })

    Simulator.gestures.swipe($carousel[0], {
      pos: [300, 10],
      deltaX: -300,
      deltaY: 0
    })
  })

  QUnit.test('should not allow pinch with touch events', function (assert) {
    assert.expect(0)
    clearPointerEvents()

    Simulator.setType('touch')
    var done = assert.async()
    document.documentElement.ontouchstart = $.noop

    var carouselHTML = '<div class="carousel" data-interval="false"></div>'
    var $carousel = $(carouselHTML)
    $carousel.appendTo('#qunit-fixture')
    $carousel.bootstrapCarousel()

    Simulator.gestures.swipe($carousel[0], {
      pos: [300, 10],
      deltaX: -300,
      deltaY: 0,
      touches: 2
    }, function () {
      restorePointerEvents()
      delete document.documentElement.ontouchstart
      done()
    })
  })

  QUnit.test('should not call _slide if the carousel is sliding', function (assert) {
    assert.expect(1)

    var carouselHTML = '<div class="carousel" data-interval="false"></div>'
    var $carousel = $(carouselHTML)
    $carousel.appendTo('#qunit-fixture')
    $carousel.bootstrapCarousel()

    var carousel = $carousel.data('bs.carousel')

    var spy = sinon.spy(carousel, '_slide')

    carousel._isSliding = true

    carousel.next()

    assert.strictEqual(spy.called, false)
  })

  QUnit.test('should call next when the page is visible', function (assert) {
    assert.expect(1)

    var carouselHTML = '<div class="carousel" data-interval="false"></div>'
    var $carousel = $(carouselHTML)
    $carousel.appendTo('#qunit-fixture')
    $carousel.bootstrapCarousel()

    var carousel = $carousel.data('bs.carousel')

    var spy = sinon.spy(carousel, 'next')
    var sandbox = sinon.createSandbox()

    sandbox.replaceGetter(document, 'hidden', function () {
      return false
    })
    sandbox.stub($carousel, 'is').returns(true)
    sandbox.stub($carousel, 'css').returns('block')

    carousel.nextWhenVisible()

    assert.strictEqual(spy.called, true)
    sandbox.restore()
  })

  QUnit.test('should not cycle when there is no attribute data-ride', function (assert) {
    assert.expect(1)

    var spy = sinon.spy(Carousel.prototype, 'cycle')

    var carouselHTML = '<div class="carousel"></div>'
    var $carousel = $(carouselHTML)
    $carousel.appendTo('#qunit-fixture')
    $carousel.bootstrapCarousel()

    assert.strictEqual(spy.called, false)
    spy.restore()
  })

  QUnit.test('should cycle when there is data-ride attribute', function (assert) {
    assert.expect(1)

    var spy = sinon.spy(Carousel.prototype, 'cycle')

    var carouselHTML = '<div class="carousel" data-ride="carousel"></div>'
    var $carousel = $(carouselHTML)
    $carousel.appendTo('#qunit-fixture')
    $carousel.bootstrapCarousel()

    assert.strictEqual(spy.called, true)
    spy.restore()
  })

  QUnit.test('should init carousels with data-ride on load event', function (assert) {
    assert.expect(1)

    var done = assert.async()
    var spy = sinon.spy(Carousel, '_jQueryInterface')

    var carouselHTML = '<div class="carousel" data-ride="carousel"></div>'
    var $carousel = $(carouselHTML)
    $carousel.appendTo('#qunit-fixture')

    $(window).trigger($.Event('load'))

    setTimeout(function () {
      assert.strictEqual(spy.called, true)
      spy.restore()
      done()
    }, 5)
  })

  QUnit.test('should not add touch event listeners when touch option set to false', function (assert) {
    assert.expect(1)

    var spy = sinon.spy(Carousel.prototype, '_addTouchEventListeners')
    var $carousel = $('<div class="carousel" data-ride="carousel" data-touch="false"></div>')

    $carousel.appendTo('#qunit-fixture')
    $carousel.bootstrapCarousel()

    assert.strictEqual(spy.called, false)
    spy.restore()
  })
})
