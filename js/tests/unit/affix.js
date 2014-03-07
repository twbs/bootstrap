$(function () {

  module('affix')

  test('should provide no conflict', function () {
    var affix = $.fn.affix.noConflict()
    ok(!$.fn.affix, 'affix was set back to undefined (org value)')
    $.fn.affix = affix
  })

  test('should be defined on jquery object', function () {
    ok($(document.body).affix, 'affix method is defined')
  })

  test('should return element', function () {
    ok($(document.body).affix()[0] == document.body, 'document.body returned')
  })

  test('should exit early if element is not visible', function () {
    var $affix = $('<div style="display: none"></div>').affix()
    $affix.data('bs.affix').checkPosition()
    ok(!$affix.hasClass('affix'), 'affix class was not added')
  })

  test('should trigger affixed event after affix', function () {
    stop()

    var template = $('<div id="affixTarget"><ul><li>Please affix</li><li>And unaffix</li></ul></div><div id="affixAfter" style="height: 20000px; display:block;"></div>')
    template.appendTo('body')

    var affixer = $('#affixTarget').affix({
      offset: $('#affixTarget ul').position()
    })

    $('#affixTarget')
      .on('affix.bs.affix', function (e) {
        ok(true, 'affix event triggered')
      }).on('affixed.bs.affix', function (e) {
        ok(true,'affixed event triggered')
        $('#affixTarget').remove()
        $('#affixAfter').remove()
        start()
      })

    setTimeout(function () {
      window.scrollTo(0, document.body.scrollHeight)
      setTimeout(function () { window.scroll(0,0) }, 0)
    },0)
  })
})
