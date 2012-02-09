$(function () {

    module("bootstrap-collapse")

      test("should be defined on jquery object", function () {
        ok($(document.body).collapse, 'collapse method is defined')
      })

      test("should return element", function () {
        ok($(document.body).collapse()[0] == document.body, 'document.body returned')
      })

      test("should show a collapsed element", function () {
        var el = $('<div class="collapse"></div>').collapse('show')
        ok(el.hasClass('in'), 'has class in')
        ok(/height/.test(el.attr('style')), 'has height set')
      })

      test("should hide a collapsed element", function () {
        var el = $('<div class="collapse"></div>').collapse('hide')
        ok(!el.hasClass('in'), 'does not have class in')
        ok(/height/.test(el.attr('style')), 'has height set')
      })

})