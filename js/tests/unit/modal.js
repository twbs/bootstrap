$(function () {
  'use strict'

  window.Util = typeof bootstrap !== 'undefined' ? bootstrap.Util : Util

  QUnit.module('modal plugin')

  QUnit.test('should be defined on jquery object', function (assert) {
    assert.expect(1)
    assert.ok($(document.body).modal, 'modal method is defined')
  })

  QUnit.module('modal', {
    before: function () {
      // Enable the scrollbar measurer
      $('<style type="text/css"> .modal-scrollbar-measure { position: absolute; top: -9999px; width: 50px; height: 50px; overflow: scroll; } </style>').appendTo('head')
      // Function to calculate the scrollbar width which is then compared to the padding or margin changes
      $.fn.getScrollbarWidth = $.fn.modal.Constructor.prototype._getScrollbarWidth

      // Simulate scrollbars
      $('html').css('padding-right', '16px')
    },
    beforeEach: function () {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.bootstrapModal = $.fn.modal.noConflict()
    },
    afterEach: function () {
      $('.modal-backdrop, #modal-test').remove()
      $(document.body).removeClass('modal-open')
      $.fn.modal = $.fn.bootstrapModal
      delete $.fn.bootstrapModal
      $('#qunit-fixture').html('')
    }
  })

  QUnit.test('should provide no conflict', function (assert) {
    assert.expect(1)
    assert.strictEqual(typeof $.fn.modal, 'undefined', 'modal was set back to undefined (orig value)')
  })

  QUnit.test('should throw explicit error on undefined method', function (assert) {
    assert.expect(1)
    var $el = $('<div id="modal-test"/>')
    $el.bootstrapModal()
    try {
      $el.bootstrapModal('noMethod')
    } catch (error) {
      assert.strictEqual(error.message, 'No method named "noMethod"')
    }
  })

  QUnit.test('should return jquery collection containing the element', function (assert) {
    assert.expect(2)
    var $el = $('<div id="modal-test"/>')
    var $modal = $el.bootstrapModal()
    assert.true($modal instanceof $, 'returns jquery collection')
    assert.strictEqual($modal[0], $el[0], 'collection contains element')
  })

  QUnit.test('should expose defaults var for settings', function (assert) {
    assert.expect(1)
    assert.ok($.fn.bootstrapModal.Constructor.Default, 'default object exposed')
  })

  QUnit.test('should insert into dom when show method is called', function (assert) {
    assert.expect(1)
    var done = assert.async()

    $('<div id="modal-test"/>')
      .on('shown.bs.modal', function () {
        assert.notStrictEqual($('#modal-test').length, 0, 'modal inserted into dom')
        done()
      })
      .bootstrapModal('show')
  })

  QUnit.test('should fire show event', function (assert) {
    assert.expect(1)
    var done = assert.async()

    $('<div id="modal-test"/>')
      .on('show.bs.modal', function () {
        assert.ok(true, 'show event fired')
        done()
      })
      .bootstrapModal('show')
  })

  QUnit.test('should not fire shown when show was prevented', function (assert) {
    assert.expect(1)
    var done = assert.async()

    $('<div id="modal-test"/>')
      .on('show.bs.modal', function (e) {
        e.preventDefault()
        assert.ok(true, 'show event fired')
        done()
      })
      .on('shown.bs.modal', function () {
        assert.ok(false, 'shown event fired')
      })
      .bootstrapModal('show')
  })

  QUnit.test('should be shown after the first call to show() has been prevented while fading is enabled', function (assert) {
    assert.expect(2)
    var done = assert.async()

    var $el = $('<div class="modal fade"><div class="modal-dialog" style="transition-duration: 20ms;"/></div>').appendTo('#qunit-fixture')

    var prevented = false
    $el
      .on('show.bs.modal', function (e) {
        if (!prevented) {
          e.preventDefault()
          prevented = true

          setTimeout(function () {
            $el.bootstrapModal('show')
          })
        }
      })
      .on('shown.bs.modal', function () {
        assert.true(prevented, 'show prevented')
        assert.true($el.hasClass('fade'))
        done()
      })
      .bootstrapModal('show')
  })

  QUnit.test('should hide modal when hide is called', function (assert) {
    assert.expect(3)
    var done = assert.async()

    $('<div id="modal-test"/>')
      .on('shown.bs.modal', function () {
        assert.true($('#modal-test').is(':visible'), 'modal visible')
        assert.notStrictEqual($('#modal-test').length, 0, 'modal inserted into dom')
        $(this).bootstrapModal('hide')
      })
      .on('hidden.bs.modal', function () {
        assert.false($('#modal-test').is(':visible'), 'modal hidden')
        done()
      })
      .bootstrapModal('show')
  })

  QUnit.test('should toggle when toggle is called', function (assert) {
    assert.expect(3)
    var done = assert.async()

    $('<div id="modal-test"/>')
      .on('shown.bs.modal', function () {
        assert.true($('#modal-test').is(':visible'), 'modal visible')
        assert.notStrictEqual($('#modal-test').length, 0, 'modal inserted into dom')
        $(this).bootstrapModal('toggle')
      })
      .on('hidden.bs.modal', function () {
        assert.false($('#modal-test').is(':visible'), 'modal hidden')
        done()
      })
      .bootstrapModal('toggle')
  })

  QUnit.test('should remove from dom when click [data-dismiss="modal"]', function (assert) {
    assert.expect(3)
    var done = assert.async()

    $('<div id="modal-test"><span class="close" data-dismiss="modal"/></div>')
      .on('shown.bs.modal', function () {
        assert.true($('#modal-test').is(':visible'), 'modal visible')
        assert.notStrictEqual($('#modal-test').length, 0, 'modal inserted into dom')
        $(this).find('.close').trigger('click')
      })
      .on('hidden.bs.modal', function () {
        assert.false($('#modal-test').is(':visible'), 'modal hidden')
        done()
      })
      .bootstrapModal('toggle')
  })

  QUnit.test('should allow modal close with "backdrop:false"', function (assert) {
    assert.expect(2)
    var done = assert.async()

    $('<div id="modal-test" data-backdrop="false"/>')
      .on('shown.bs.modal', function () {
        assert.true($('#modal-test').is(':visible'), 'modal visible')
        $(this).bootstrapModal('hide')
      })
      .on('hidden.bs.modal', function () {
        assert.false($('#modal-test').is(':visible'), 'modal hidden')
        done()
      })
      .bootstrapModal('show')
  })

  QUnit.test('should close modal when clicking outside of modal-content', function (assert) {
    assert.expect(3)
    var done = assert.async()

    $('<div id="modal-test"><div class="contents"/></div>')
      .on('shown.bs.modal', function () {
        assert.notStrictEqual($('#modal-test').length, 0, 'modal inserted into dom')
        $('.contents').trigger('click')
        assert.true($('#modal-test').is(':visible'), 'modal visible')
        $('#modal-test').trigger('click')
      })
      .on('hidden.bs.modal', function () {
        assert.false($('#modal-test').is(':visible'), 'modal hidden')
        done()
      })
      .bootstrapModal('show')
  })

  QUnit.test('should not close modal when clicking outside of modal-content if data-backdrop="true"', function (assert) {
    assert.expect(1)
    var done = assert.async()

    $('<div id="modal-test" data-backdrop="false"><div class="contents"/></div>')
      .on('shown.bs.modal', function () {
        $('#modal-test').trigger('click')
        assert.true($('#modal-test').is(':visible'), 'modal not hidden')
        done()
      })
      .bootstrapModal('show')
  })

  QUnit.test('should close modal when escape key is pressed via keydown', function (assert) {
    assert.expect(3)
    var done = assert.async()

    var $div = $('<div id="modal-test"/>')
    $div
      .on('shown.bs.modal', function () {
        assert.notStrictEqual($('#modal-test').length, 0, 'modal inserted into dom')
        assert.true($('#modal-test').is(':visible'), 'modal visible')
        $div.trigger($.Event('keydown', {
          which: 27
        }))

        setTimeout(function () {
          assert.false($('#modal-test').is(':visible'), 'modal hidden')
          $div.remove()
          done()
        }, 0)
      })
      .bootstrapModal('show')
  })

  QUnit.test('should not close modal when escape key is pressed via keyup', function (assert) {
    assert.expect(3)
    var done = assert.async()

    var $div = $('<div id="modal-test"/>')
    $div
      .on('shown.bs.modal', function () {
        assert.notStrictEqual($('#modal-test').length, 0, 'modal inserted into dom')
        assert.true($('#modal-test').is(':visible'), 'modal visible')
        $div.trigger($.Event('keyup', {
          which: 27
        }))

        setTimeout(function () {
          assert.true($div.is(':visible'), 'modal still visible')
          $div.remove()
          done()
        }, 0)
      })
      .bootstrapModal('show')
  })

  QUnit.test('should trigger hide event once when clicking outside of modal-content', function (assert) {
    assert.expect(1)
    var done = assert.async()

    var triggered

    $('<div id="modal-test"><div class="contents"/></div>')
      .on('shown.bs.modal', function () {
        triggered = 0
        $('#modal-test').trigger('click')
      })
      .on('hide.bs.modal', function () {
        triggered += 1
        assert.strictEqual(triggered, 1, 'modal hide triggered once')
        done()
      })
      .bootstrapModal('show')
  })

  QUnit.test('should remove aria-hidden attribute when shown, add it back when hidden', function (assert) {
    assert.expect(3)
    var done = assert.async()

    $('<div id="modal-test" aria-hidden="true"/>')
      .on('shown.bs.modal', function () {
        assert.false($('#modal-test').is('[aria-hidden]'), 'aria-hidden attribute removed')
        $(this).bootstrapModal('hide')
      })
      .on('hidden.bs.modal', function () {
        assert.true($('#modal-test').is('[aria-hidden]'), 'aria-hidden attribute added')
        assert.strictEqual($('#modal-test').attr('aria-hidden'), 'true', 'correct aria-hidden="true" added')
        done()
      })
      .bootstrapModal('show')
  })

  QUnit.test('should add aria-modal attribute when shown, remove it again when hidden', function (assert) {
    assert.expect(3)
    var done = assert.async()

    $('<div id="modal-test"/>')
      .on('shown.bs.modal', function () {
        assert.true($('#modal-test').is('[aria-modal]'), 'aria-modal attribute added')
        assert.strictEqual($('#modal-test').attr('aria-modal'), 'true', 'correct aria-modal="true" added')
        $(this).bootstrapModal('hide')
      })
      .on('hidden.bs.modal', function () {
        assert.false($('#modal-test').is('[aria-modal]'), 'aria-modal attribute removed')
        done()
      })
      .bootstrapModal('show')
  })

  QUnit.test('should add role="dialog" attribute when shown, remove it again when hidden', function (assert) {
    assert.expect(3)
    var done = assert.async()

    $('<div id="modal-test"/>')
      .on('shown.bs.modal', function () {
        assert.true($('#modal-test').is('[role]'), 'role attribute added')
        assert.strictEqual($('#modal-test').attr('role'), 'dialog', 'correct role="dialog" added')
        $(this).bootstrapModal('hide')
      })
      .on('hidden.bs.modal', function () {
        assert.false($('#modal-test').is('[role]'), 'role attribute removed')
        done()
      })
      .bootstrapModal('show')
  })

  QUnit.test('should close reopened modal with [data-dismiss="modal"] click', function (assert) {
    assert.expect(2)
    var done = assert.async()

    $('<div id="modal-test"><div class="contents"><div id="close" data-dismiss="modal"/></div></div>')
      .one('shown.bs.modal', function () {
        $('#close').trigger('click')
      })
      .one('hidden.bs.modal', function () {
        // After one open-close cycle
        assert.false($('#modal-test').is(':visible'), 'modal hidden')
        $(this)
          .one('shown.bs.modal', function () {
            $('#close').trigger('click')
          })
          .one('hidden.bs.modal', function () {
            assert.false($('#modal-test').is(':visible'), 'modal hidden')
            done()
          })
          .bootstrapModal('show')
      })
      .bootstrapModal('show')
  })

  QUnit.test('should restore focus to toggling element when modal is hidden after having been opened via data-api', function (assert) {
    assert.expect(1)
    var done = assert.async()

    var $toggleBtn = $('<button data-toggle="modal" data-target="#modal-test"/>').appendTo('#qunit-fixture')

    $('<div id="modal-test"><div class="contents"><div id="close" data-dismiss="modal"/></div></div>')
      .on('hidden.bs.modal', function () {
        setTimeout(function () {
          assert.true($(document.activeElement).is($toggleBtn), 'toggling element is once again focused')
          done()
        }, 0)
      })
      .on('shown.bs.modal', function () {
        $('#close').trigger('click')
      })
      .appendTo('#qunit-fixture')

    $toggleBtn.trigger('click')
  })

  QUnit.test('should not restore focus to toggling element if the associated show event gets prevented', function (assert) {
    assert.expect(1)
    var done = assert.async()
    var $toggleBtn = $('<button data-toggle="modal" data-target="#modal-test"/>').appendTo('#qunit-fixture')
    var $otherBtn = $('<button id="other-btn"/>').appendTo('#qunit-fixture')

    $('<div id="modal-test"><div class="contents"><div id="close" data-dismiss="modal"/></div>')
      .one('show.bs.modal', function (e) {
        e.preventDefault()
        $otherBtn.trigger('focus')
        setTimeout($.proxy(function () {
          $(this).bootstrapModal('show')
        }, this), 0)
      })
      .on('hidden.bs.modal', function () {
        setTimeout(function () {
          assert.true($(document.activeElement).is($otherBtn), 'focus returned to toggling element')
          done()
        }, 0)
      })
      .on('shown.bs.modal', function () {
        $('#close').trigger('click')
      })
      .appendTo('#qunit-fixture')

    $toggleBtn.trigger('click')
  })

  QUnit.test('should adjust the inline padding of the modal when opening', function (assert) {
    assert.expect(1)
    var done = assert.async()

    $('<div id="modal-test"/>')
      .on('shown.bs.modal', function () {
        var expectedPadding = $(this).getScrollbarWidth() + 'px'
        var currentPadding = $(this).css('padding-right')
        assert.strictEqual(currentPadding, expectedPadding, 'modal padding should be adjusted while opening')
        done()
      })
      .bootstrapModal('show')
  })

  QUnit.test('should adjust the inline body padding when opening and restore when closing', function (assert) {
    assert.expect(2)
    var done = assert.async()
    var $body = $(document.body)
    var originalPadding = $body.css('padding-right')

    $('<div id="modal-test"/>')
      .on('hidden.bs.modal', function () {
        var currentPadding = $body.css('padding-right')
        assert.strictEqual(currentPadding, originalPadding, 'body padding should be reset after closing')
        $body.removeAttr('style')
        done()
      })
      .on('shown.bs.modal', function () {
        var expectedPadding = parseFloat(originalPadding) + $(this).getScrollbarWidth() + 'px'
        var currentPadding = $body.css('padding-right')
        assert.strictEqual(currentPadding, expectedPadding, 'body padding should be adjusted while opening')
        $(this).bootstrapModal('hide')
      })
      .bootstrapModal('show')
  })

  QUnit.test('should store the original body padding in data-padding-right before showing', function (assert) {
    assert.expect(2)
    var done = assert.async()
    var $body = $(document.body)
    var originalPadding = '0px'
    $body.css('padding-right', originalPadding)

    $('<div id="modal-test"/>')
      .on('hidden.bs.modal', function () {
        assert.strictEqual(typeof $body.data('padding-right'), 'undefined', 'data-padding-right should be cleared after closing')
        $body.removeAttr('style')
        done()
      })
      .on('shown.bs.modal', function () {
        assert.strictEqual($body.data('padding-right'), originalPadding, 'original body padding should be stored in data-padding-right')
        $(this).bootstrapModal('hide')
      })
      .bootstrapModal('show')
  })

  QUnit.test('should not adjust the inline body padding when it does not overflow', function (assert) {
    assert.expect(1)
    var done = assert.async()
    var $body = $(document.body)
    var originalPadding = $body.css('padding-right')

    // Hide scrollbars to prevent the body overflowing
    $body.css('overflow', 'hidden') // Real scrollbar (for in-browser testing)
    $('html').css('padding-right', '0px') // Simulated scrollbar (for PhantomJS)

    $('<div id="modal-test"/>')
      .on('shown.bs.modal', function () {
        var currentPadding = $body.css('padding-right')
        assert.strictEqual(currentPadding, originalPadding, 'body padding should not be adjusted')
        $(this).bootstrapModal('hide')

        // Restore scrollbars
        $body.css('overflow', 'auto')
        $('html').css('padding-right', '16px')
        done()
      })
      .bootstrapModal('show')
  })

  QUnit.test('should adjust the inline padding of fixed elements when opening and restore when closing', function (assert) {
    assert.expect(2)
    var done = assert.async()
    var $element = $('<div class="fixed-top"></div>').appendTo('#qunit-fixture')
    var originalPadding = $element.css('padding-right')

    $('<div id="modal-test"/>')
      .on('hidden.bs.modal', function () {
        var currentPadding = $element.css('padding-right')
        assert.strictEqual(currentPadding, originalPadding, 'fixed element padding should be reset after closing')
        $element.remove()
        done()
      })
      .on('shown.bs.modal', function () {
        var expectedPadding = parseFloat(originalPadding) + $(this).getScrollbarWidth() + 'px'
        var currentPadding = $element.css('padding-right')
        assert.strictEqual(currentPadding, expectedPadding, 'fixed element padding should be adjusted while opening')
        $(this).bootstrapModal('hide')
      })
      .bootstrapModal('show')
  })

  QUnit.test('should store the original padding of fixed elements in data-padding-right before showing', function (assert) {
    assert.expect(2)
    var done = assert.async()
    var $element = $('<div class="fixed-top"></div>').appendTo('#qunit-fixture')
    var originalPadding = '0px'
    $element.css('padding-right', originalPadding)

    $('<div id="modal-test"/>')
      .on('hidden.bs.modal', function () {
        assert.strictEqual(typeof $element.data('padding-right'), 'undefined', 'data-padding-right should be cleared after closing')
        $element.remove()
        done()
      })
      .on('shown.bs.modal', function () {
        assert.strictEqual($element.data('padding-right'), originalPadding, 'original fixed element padding should be stored in data-padding-right')
        $(this).bootstrapModal('hide')
      })
      .bootstrapModal('show')
  })

  QUnit.test('should adjust the inline margin of sticky elements when opening and restore when closing', function (assert) {
    assert.expect(2)
    var done = assert.async()
    var $element = $('<div class="sticky-top"></div>').appendTo('#qunit-fixture')
    var originalPadding = $element.css('margin-right')

    $('<div id="modal-test"/>')
      .on('hidden.bs.modal', function () {
        var currentPadding = $element.css('margin-right')
        assert.strictEqual(currentPadding, originalPadding, 'sticky element margin should be reset after closing')
        $element.remove()
        done()
      })
      .on('shown.bs.modal', function () {
        var expectedPadding = parseFloat(originalPadding) - $(this).getScrollbarWidth() + 'px'
        var currentPadding = $element.css('margin-right')
        assert.strictEqual(currentPadding, expectedPadding, 'sticky element margin should be adjusted while opening')
        $(this).bootstrapModal('hide')
      })
      .bootstrapModal('show')
  })

  QUnit.test('should store the original margin of sticky elements in data-margin-right before showing', function (assert) {
    assert.expect(2)
    var done = assert.async()
    var $element = $('<div class="sticky-top"></div>').appendTo('#qunit-fixture')
    var originalPadding = '0px'
    $element.css('margin-right', originalPadding)

    $('<div id="modal-test"/>')
      .on('hidden.bs.modal', function () {
        assert.strictEqual(typeof $element.data('margin-right'), 'undefined', 'data-margin-right should be cleared after closing')
        $element.remove()
        done()
      })
      .on('shown.bs.modal', function () {
        assert.strictEqual($element.data('margin-right'), originalPadding, 'original sticky element margin should be stored in data-margin-right')
        $(this).bootstrapModal('hide')
      })
      .bootstrapModal('show')
  })

  QUnit.test('should ignore values set via CSS when trying to restore body padding after closing', function (assert) {
    assert.expect(1)
    var done = assert.async()
    var $body = $(document.body)
    var $style = $('<style>body { padding-right: 42px; }</style>').appendTo('head')

    $('<div id="modal-test"/>')
      .on('hidden.bs.modal', function () {
        assert.strictEqual($body.attr('style').indexOf('padding-right'), -1, 'body does not have inline padding set')
        $style.remove()
        done()
      })
      .on('shown.bs.modal', function () {
        $(this).bootstrapModal('hide')
      })
      .bootstrapModal('show')
  })

  QUnit.test('should ignore other inline styles when trying to restore body padding after closing', function (assert) {
    assert.expect(2)
    var done = assert.async()
    var $body = $(document.body)
    var $style = $('<style>body { padding-right: 42px; }</style>').appendTo('head')

    $body.css('color', 'red')

    $('<div id="modal-test"/>')
      .on('hidden.bs.modal', function () {
        assert.strictEqual($body[0].style.paddingRight, '', 'body does not have inline padding set')
        assert.strictEqual($body[0].style.color, 'red', 'body still has other inline styles set')
        $body.removeAttr('style')
        $style.remove()
        done()
      })
      .on('shown.bs.modal', function () {
        $(this).bootstrapModal('hide')
      })
      .bootstrapModal('show')
  })

  QUnit.test('should properly restore non-pixel inline body padding after closing', function (assert) {
    assert.expect(1)
    var done = assert.async()
    var $body = $(document.body)

    $body.css('padding-right', '5%')

    $('<div id="modal-test"/>')
      .on('hidden.bs.modal', function () {
        assert.strictEqual($body[0].style.paddingRight, '5%', 'body does not have inline padding set')
        $body.removeAttr('style')
        done()
      })
      .on('shown.bs.modal', function () {
        $(this).bootstrapModal('hide')
      })
      .bootstrapModal('show')
  })

  QUnit.test('should not follow link in area tag', function (assert) {
    assert.expect(2)
    var done = assert.async()

    $('<map><area id="test" shape="default" data-toggle="modal" data-target="#modal-test" href="demo.html"/></map>')
      .appendTo('#qunit-fixture')

    $('<div id="modal-test"><div class="contents"><div id="close" data-dismiss="modal"/></div></div>')
      .appendTo('#qunit-fixture')

    $('#test')
      .on('click.bs.modal.data-api', function (event) {
        assert.false(event.isDefaultPrevented(), 'navigating to href will happen')

        setTimeout(function () {
          assert.true(event.isDefaultPrevented(), 'model shown instead of navigating to href')
          done()
        }, 1)
      })
      .trigger('click')
  })

  QUnit.test('should not parse target as html', function (assert) {
    assert.expect(1)
    var done = assert.async()

    var $toggleBtn = $('<button data-toggle="modal" data-target="&lt;div id=&quot;modal-test&quot;&gt;&lt;div class=&quot;contents&quot;&lt;div&lt;div id=&quot;close&quot; data-dismiss=&quot;modal&quot;/&gt;&lt;/div&gt;&lt;/div&gt;"/>')
      .appendTo('#qunit-fixture')

    $toggleBtn.trigger('click')
    setTimeout(function () {
      assert.strictEqual($('#modal-test').length, 0, 'target has not been parsed and added to the document')
      done()
    }, 0)
  })

  // eslint-disable-next-line qunit/resolve-async
  QUnit.test('should not execute js from target', function (assert) {
    assert.expect(0)
    var done = assert.async()

    // This toggle button contains XSS payload in its data-target
    // Note: it uses the onerror handler of an img element to execute the js, because a simple script element does not work here
    //       a script element works in manual tests though, so here it is likely blocked by the qunit framework
    var $toggleBtn = $('<button data-toggle="modal" data-target="&lt;div&gt;&lt;image src=&quot;missing.png&quot; onerror=&quot;$(&apos;#qunit-fixture button.control&apos;).trigger(&apos;click&apos;)&quot;&gt;&lt;/div&gt;"/>')
      .appendTo('#qunit-fixture')
    // The XSS payload above does not have a closure over this function and cannot access the assert object directly
    // However, it can send a click event to the following control button, which will then fail the assert
    $('<button>')
      .addClass('control')
      .on('click', function () {
        assert.notOk(true, 'XSS payload is not executed as js')
      })
      .appendTo('#qunit-fixture')

    $toggleBtn.trigger('click')

    setTimeout(done, 500)
  })

  QUnit.test('should not try to open a modal which is already visible', function (assert) {
    assert.expect(1)
    var done = assert.async()
    var count = 0

    $('<div id="modal-test"/>').on('shown.bs.modal', function () {
      count++
    }).on('hidden.bs.modal', function () {
      assert.strictEqual(count, 1, 'show() runs only once')
      done()
    })
      .bootstrapModal('show')
      .bootstrapModal('show')
      .bootstrapModal('hide')
  })

  QUnit.test('transition duration should be the modal-dialog duration before triggering shown event', function (assert) {
    assert.expect(1)
    var done = assert.async()
    var style = [
      '<style>',
      '  .modal.fade .modal-dialog {',
      '    transition: -webkit-transform .3s ease-out;',
      '    transition: transform .3s ease-out;',
      '    transition: transform .3s ease-out,-webkit-transform .3s ease-out;',
      '    -webkit-transform: translate(0,-50px);',
      '    transform: translate(0,-50px);',
      '  }',
      '</style>'
    ].join('')

    var $style = $(style).appendTo('head')
    var modalHTML = [
      '<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">',
      '  <div class="modal-dialog" role="document">',
      '    <div class="modal-content">',
      '      <div class="modal-body">...</div>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('')

    var $modal = $(modalHTML).appendTo('#qunit-fixture')
    var expectedTransitionDuration = 300
    var spy = sinon.spy(Util, 'getTransitionDurationFromElement')

    $modal.on('shown.bs.modal', function () {
      assert.true(spy.returned(expectedTransitionDuration))
      $style.remove()
      spy.restore()
      done()
    })
      .bootstrapModal('show')
  })

  QUnit.test('should dispose modal', function (assert) {
    assert.expect(3)
    var done = assert.async()

    var $modal = $([
      '<div id="modal-test">',
      '  <div class="modal-dialog">',
      '    <div class="modal-content">',
      '      <div class="modal-body" />',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('')).appendTo('#qunit-fixture')

    $modal.on('shown.bs.modal', function () {
      var spy = sinon.spy($.fn, 'off')

      $(this).bootstrapModal('dispose')

      var modalDataApiEvent = []
      $._data(document, 'events').click
        .forEach(function (e) {
          if (e.namespace === 'bs.data-api.modal') {
            modalDataApiEvent.push(e)
          }
        })

      assert.strictEqual(typeof $(this).data('bs.modal'), 'undefined', 'modal data object was disposed')

      assert.strictEqual(spy.callCount, 4, '`jQuery.off` was called')

      assert.strictEqual(modalDataApiEvent.length, 1, '`Event.CLICK_DATA_API` on `document` was not removed')

      $.fn.off.restore()
      done()
    }).bootstrapModal('show')
  })

  QUnit.test('should not adjust the inline body padding when it does not overflow, even on a scaled display', function (assert) {
    assert.expect(1)
    var done = assert.async()

    var $modal = $([
      '<div id="modal-test">',
      '  <div class="modal-dialog">',
      '    <div class="modal-content">',
      '      <div class="modal-body" />',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('')).appendTo('#qunit-fixture')

    var originalPadding = window.getComputedStyle(document.body).paddingRight

    // Remove body margins as would be done by Bootstrap css
    document.body.style.margin = '0'

    // Hide scrollbars to prevent the body overflowing
    document.body.style.overflow = 'hidden'

    // Simulate a discrepancy between exact, i.e. floating point body width, and rounded body width
    // as it can occur when zooming or scaling the display to something else than 100%
    document.documentElement.style.paddingRight = '.48px'

    $modal.on('shown.bs.modal', function () {
      var currentPadding = window.getComputedStyle(document.body).paddingRight

      assert.strictEqual(currentPadding, originalPadding, 'body padding should not be adjusted')

      // Restore overridden css
      document.body.style.removeProperty('margin')
      document.body.style.removeProperty('overflow')
      document.documentElement.style.paddingRight = '16px'
      done()
    }).bootstrapModal('show')
  })

  QUnit.test('should enforce focus', function (assert) {
    assert.expect(4)
    var done = assert.async()

    var $modal = $([
      '<div id="modal-test" data-show="false">',
      '  <div class="modal-dialog">',
      '    <div class="modal-content">',
      '      <div class="modal-body" />',
      '    </div>',
      '  </div>',
      '</div>'
    ].join(''))
      .bootstrapModal()
      .appendTo('#qunit-fixture')

    var modal = $modal.data('bs.modal')
    var spy = sinon.spy(modal, '_enforceFocus')
    var spyDocOff = sinon.spy($(document), 'off')
    var spyDocOn = sinon.spy($(document), 'on')

    $modal.one('shown.bs.modal', function () {
      assert.true(spy.called, '_enforceFocus called')
      assert.ok(spyDocOff.withArgs('focusin.bs.modal'))
      assert.ok(spyDocOn.withArgs('focusin.bs.modal'))

      var spyFocus = sinon.spy(modal._element, 'focus')
      var event = $.Event('focusin', {
        target: $('#qunit-fixture')[0]
      })

      $(document).one('focusin', function () {
        assert.true(spyFocus.called)
        done()
      })

      $(document).trigger(event)
    })
      .bootstrapModal('show')
  })

  QUnit.test('should scroll to top of the modal body if the modal has .modal-dialog-scrollable class', function (assert) {
    assert.expect(3)
    var done = assert.async()

    var $modal = $([
      '<div id="modal-test">',
      '  <div class="modal-dialog modal-dialog-scrollable">',
      '    <div class="modal-content">',
      '      <div class="modal-body" style="height: 100px; overflow-y: auto;">',
      '        <div style="height: 200px" />',
      '      </div>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('')).appendTo('#qunit-fixture')

    var $modalBody = $('.modal-body')
    $modalBody.scrollTop(100)
    assert.true($modalBody.scrollTop() > 95)
    assert.true($modalBody.scrollTop() <= 100)

    $modal.on('shown.bs.modal', function () {
      assert.strictEqual($modalBody.scrollTop(), 0, 'modal body scrollTop should be 0 when opened')
      done()
    })
      .bootstrapModal('show')
  })

  QUnit.test('should set .modal\'s scroll top to 0 if .modal-dialog-scrollable and modal body do not exists', function (assert) {
    assert.expect(1)
    var done = assert.async()

    var $modal = $([
      '<div id="modal-test">',
      '  <div class="modal-dialog modal-dialog-scrollable">',
      '    <div class="modal-content">',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('')).appendTo('#qunit-fixture')

    $modal.on('shown.bs.modal', function () {
      assert.strictEqual($modal.scrollTop(), 0)
      done()
    })
      .bootstrapModal('show')
  })

  QUnit.test('should not close modal when clicking outside of modal-content if backdrop = static', function (assert) {
    assert.expect(1)
    var done = assert.async()
    var $modal = $('<div class="modal" data-backdrop="static"><div class="modal-dialog" /></div>').appendTo('#qunit-fixture')

    $modal.on('shown.bs.modal', function () {
      $modal.trigger('click')
      setTimeout(function () {
        var modal = $modal.data('bs.modal')

        assert.true(modal._isShown)
        done()
      }, 10)
    })
      .on('hidden.bs.modal', function () {
        assert.true(false, 'should not hide the modal')
      })
      .bootstrapModal({
        backdrop: 'static'
      })
  })

  QUnit.test('should close modal when escape key is pressed with keyboard = true and backdrop is static', function (assert) {
    assert.expect(1)
    var done = assert.async()
    var $modal = $('<div class="modal" data-backdrop="static" data-keyboard="true"><div class="modal-dialog" /></div>').appendTo('#qunit-fixture')

    $modal.on('shown.bs.modal', function () {
      $modal.trigger($.Event('keydown', {
        which: 27
      }))

      setTimeout(function () {
        var modal = $modal.data('bs.modal')

        assert.false(modal._isShown)
        done()
      }, 10)
    })
      .bootstrapModal({
        backdrop: 'static',
        keyboard: true
      })
  })

  QUnit.test('should not close modal when escape key is pressed with keyboard = false', function (assert) {
    assert.expect(1)
    var done = assert.async()
    var $modal = $('<div class="modal"><div class="modal-dialog" /></div>').appendTo('#qunit-fixture')

    $modal.on('shown.bs.modal', function () {
      $modal.trigger($.Event('keydown', {
        which: 27
      }))

      setTimeout(function () {
        var modal = $modal.data('bs.modal')

        assert.true(modal._isShown)
        done()
      }, 10)
    })
      .on('hidden.bs.modal', function () {
        assert.false(true, 'should not hide the modal')
      })
      .bootstrapModal({
        keyboard: false
      })
  })

  QUnit.test('should not overflow when clicking outside of modal-content if backdrop = static', function (assert) {
    assert.expect(1)
    var done = assert.async()
    var $modal = $('<div class="modal" data-backdrop="static"><div class="modal-dialog" style="transition-duration: 20ms;"/></div>').appendTo('#qunit-fixture')

    $modal.on('shown.bs.modal', function () {
      $modal.trigger('click')
      setTimeout(function () {
        assert.strictEqual($modal[0].clientHeight, $modal[0].scrollHeight)
        done()
      }, 20)
    })
      .bootstrapModal({
        backdrop: 'static'
      })
  })

  QUnit.test('should get modal-static class when clicking outside of modal-content if backdrop = static', function (assert) {
    assert.expect(1)
    var done = assert.async()
    var $modal = $('<div class="modal" data-backdrop="static"><div class="modal-dialog" style="transition-duration: 20ms;"/></div>').appendTo('#qunit-fixture')

    $modal.on('shown.bs.modal', function () {
      $modal.trigger('click')
      setTimeout(function () {
        assert.true($modal.hasClass('modal-static'), 'has modal-static class')
        done()
      }, 0)
    })
      .bootstrapModal({
        backdrop: 'static'
      })
  })

  QUnit.test('should not get modal-static class when clicking outside of modal-content if backdrop = static and event is prevented', function (assert) {
    assert.expect(2)
    var done = assert.async()
    var $modal = $('<div class="modal" data-backdrop="static"><div class="modal-dialog" style="transition-duration: 20ms;"/></div>').appendTo('#qunit-fixture')

    $modal.on('hidePrevented.bs.modal', function (e) {
      assert.ok(true, 'should trigger hidePrevented event')
      e.preventDefault()
    })

    $modal.on('shown.bs.modal', function () {
      $modal.trigger('click')
      setTimeout(function () {
        assert.false($modal.hasClass('modal-static'), 'should not have modal-static class')
        done()
      }, 0)
    })
      .bootstrapModal({
        backdrop: 'static'
      })
  })
})
