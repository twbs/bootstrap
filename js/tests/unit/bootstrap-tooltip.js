$(function () {

    module("bootstrap-tooltip")

      test("should be defined on jquery object", function () {
        var div = $("<div></div>")
        ok(div.tooltip, 'popover method is defined')
      })

      test("should return element", function () {
        var div = $("<div></div>")
        ok(div.tooltip() == div, 'document.body returned')
      })

      test("should expose default settings", function () {
        ok(!!$.fn.tooltip.defaults, 'defaults is defined')
      })

      test("should remove title attribute", function () {
        var tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"></a>').tooltip()
        ok(!tooltip.attr('title'), 'title tag was removed')
      })

      test("should add data attribute for referencing original title", function () {
        var tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"></a>').tooltip()
        equals(tooltip.attr('data-original-title'), 'Another tooltip', 'original title preserved in data attribute')
      })

      test("should place tooltips relative to placement option", function () {
        $.support.transition = false
        var tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"></a>')
          .appendTo('#qunit-fixture')
          .tooltip({placement: 'bottom'})
          .tooltip('show')

        ok($(".tooltip").hasClass('fade bottom in'), 'has correct classes applied')
        tooltip.tooltip('hide')
      })

      test("should always allow html entities", function () {
        $.support.transition = false
        var tooltip = $('<a href="#" rel="tooltip" title="<b>@fat</b>"></a>')
          .appendTo('#qunit-fixture')
          .tooltip('show')

        ok($('.tooltip b').length, 'b tag was inserted')
        tooltip.tooltip('hide')
        ok(!$(".tooltip").length, 'tooltip removed')
      })

      test("should respect custom classes", function () {
        var tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"></a>')
          .appendTo('#qunit-fixture')
          .tooltip({ template: '<div class="tooltip some-class"><div class="tooltip-arrow"/><div class="tooltip-inner"/></div>'})
          .tooltip('show')

        ok($('.tooltip').hasClass('some-class'), 'custom class is present')
        tooltip.tooltip('hide')
        ok(!$(".tooltip").length, 'tooltip removed')
      })

})