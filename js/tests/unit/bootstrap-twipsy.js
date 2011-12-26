$(function () {

    module("bootstrap-twipsy")

      test("should be defined on jquery object", function () {
        var div = $("<div></div>")
        ok(div.twipsy, 'popover method is defined')
      })

      test("should return element", function () {
        var div = $("<div></div>")
        ok(div.twipsy() == div, 'document.body returned')
      })

      test("should expose default settings", function () {
        ok(!!$.fn.twipsy.defaults, 'defaults is defined')
      })

      test("should remove title attribute", function () {
        var twipsy = $('<a href="#" rel="twipsy" title="Another twipsy"></a>').twipsy()
        ok(!twipsy.attr('title'), 'title tag was removed')
      })

      test("should add data attribute for referencing original title", function () {
        var twipsy = $('<a href="#" rel="twipsy" title="Another twipsy"></a>').twipsy()
        equals(twipsy.attr('data-original-title'), 'Another twipsy', 'original title preserved in data attribute')
      })

      test("should place tooltips relative to placement option", function () {
        $.support.transition = false
        var twipsy = $('<a href="#" rel="twipsy" title="Another twipsy"></a>')
          .appendTo('#qunit-fixture')
          .twipsy({placement: 'bottom'})
          .twipsy('show')

        ok($(".twipsy").hasClass('fade bottom in'), 'has correct classes applied')
        twipsy.twipsy('hide')
      })

      test("should always allow html entities", function () {
        $.support.transition = false
        var twipsy = $('<a href="#" rel="twipsy" title="<b>@fat</b>"></a>')
          .appendTo('#qunit-fixture')
          .twipsy('show')

        ok($('.twipsy b').length, 'b tag was inserted')
        twipsy.twipsy('hide')
        ok(!$(".twipsy").length, 'twipsy removed')
      })

})