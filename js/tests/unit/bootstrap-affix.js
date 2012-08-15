$(function () {

    module("bootstrap-affix")

      test("should be defined on jquery object", function () {
        ok($(document.body).affix, 'affix method is defined')
      })

      test("should return element", function () {
        ok($(document.body).affix()[0] == document.body, 'document.body returned')
      })

      test("should exit early if element is not visible", function () {
        var $affix = $('<div style="display: none"></div>').affix()
        $affix.data('affix').checkPosition()
        ok(!$affix.hasClass('affix'), 'affix class was not added')
      })

      test("should not refresh position if the element is affixed", function () {
        var $affix = $('<div></div>').appendTo(document.body).affix({offset: {x: null, y: null}})
        var position = $affix.data('affix').position
        $(window).trigger('scroll.affix.data-api')
        $(window).trigger('resize.affix.data-api')
        stop()
        setTimeout(function (){
          ok($affix.hasClass('affix'), 'affix class was added')
          ok(position == $affix.data('affix').position, 'position not refresh')
          start()
        },10)
      })

})