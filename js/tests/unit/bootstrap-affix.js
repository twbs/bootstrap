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

      test("should add affix class if scrolled to correct position", function () {
        var $affix = $('<div></div>').appendTo('body').affix()
        $('body').trigger('scroll')
        ok($affix.hasClass('affix'), 'element has class affix')
      })

})