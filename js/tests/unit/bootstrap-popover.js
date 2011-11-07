$(function () {

    module("bootstrap-popover")

      test("should be defined on jquery object", function () {
        var div = $('<div></div>')
        ok(div.popover, 'popover method is defined')
      })

      test("should return element", function () {
        var div = $('<div></div>')
        ok(div.popover() == div, 'document.body returned')
      })

      test("should render popover element", function () {
        $.support.transition = false
        var popover = $('<a href="#" title="mdo" data-content="http://twitter.com/mdo">@mdo</a>')
          .appendTo('#qunit-runoff')
          .popover()
          .popover('show')

        ok($('.popover').length, 'popover was inserted')
        popover.popover('hide')
        ok(!$(".popover").length, 'popover removed')
        $('#qunit-runoff').empty()
      })

      test("should store popover instance in popover data object", function () {
        $.support.transition = false
        var popover = $('<a href="#" title="mdo" data-content="http://twitter.com/mdo">@mdo</a>')
          .popover()

        ok(!!popover.data('popover'), 'popover instance exists')
      })

      test("should get title and content from options", function () {
        $.support.transition = false
        var popover = $('<a href="#">@fat</a>')
          .appendTo('#qunit-runoff')
          .popover({
            title: function () {
              return '@fat'
            }
          , content: function () {
              return 'loves writing tests （╯°□°）╯︵ ┻━┻'
            }
          })

        popover.popover('show')

        ok($('.popover').length, 'popover was inserted')
        equals($('.popover .title').text(), '@fat', 'title correctly inserted')
        equals($('.popover .content').text(), 'loves writing tests （╯°□°）╯︵ ┻━┻', 'content correctly inserted')

        popover.popover('hide')
        ok(!$('.popover').length, 'popover was removed')
        $('#qunit-runoff').empty()
      })

      test("should get title and content from attributes", function () {
        $.support.transition = false
        var popover = $('<a href="#" title="@mdo" data-content="loves data attributes (づ｡◕‿‿◕｡)づ ︵ ┻━┻" >@mdo</a>')
          .appendTo('#qunit-runoff')
          .popover()
          .popover('show')

        ok($('.popover').length, 'popover was inserted')
        equals($('.popover .title').text(), '@mdo', 'title correctly inserted')
        equals($('.popover .content').text(), "loves data attributes (づ｡◕‿‿◕｡)づ ︵ ┻━┻", 'content correctly inserted')

        popover.popover('hide')
        ok(!$('.popover').length, 'popover was removed')
        $('#qunit-runoff').empty()
      })

      test("should allow arbitrary template html with title and content selector options", function() {
        $.support.transition = false
        var expectedTitle = 'Gotta make you understand'
          , popover = $('<a href="#">@rvagg</a>')
              .attr('title', expectedTitle)
              .attr('data-content', '<p><b>Never gonna give you up</b>,</p><p>Never gonna let you down</p>')
              .appendTo('#qunit-runoff')
              .popover({
                    html: true
                  , titleSelector: 'h1'
                  , contentSelector: '.rick > .roll'
                  , template: '<div class="rick"><h1></h1><div class="roll"></div></div>'
                })
              .popover('show')

        ok($('.popover > div > h1').length, 'h1 tag was inserted')
        ok($('.popover > div > h1').text() === expectedTitle)
        ok($('.popover > .rick > .roll > p').length === 2, 'p > b tags were inserted')
        popover.popover('hide')
        ok(!$('.popover').length, 'popover was removed')
        $('#qunit-runoff').empty()
      })

})
