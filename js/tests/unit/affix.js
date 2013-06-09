$(function () {

    module("affix")

      test("should provide no conflict", function () {
        var affix = $.fn.affix.noConflict()
        ok(!$.fn.affix, 'affix was set back to undefined (org value)')
        $.fn.affix = affix
      })

      test("should be defined on jquery object", function () {
        ok($(document.body).affix, 'affix method is defined')
      })

      test("should return element", function () {
        ok($(document.body).affix()[0] == document.body, 'document.body returned')
      })

      test("should exit early if element is not visible", function () {
        var $affix = $('<div style="display: none"></div>').affix()
        $affix.data('bs.affix').checkPosition()
        ok(!$affix.hasClass('affix'), 'affix class was not added')
      })

      asyncTest("should trigger affixed event after affix", function(){
        expect(2)
        var template = $('<div id="affixTarget"><ul><li>Please affix</li><li>And unaffix</li></ul></div><div id="affixAfter" style="height: 20000px; display:block;"></div>')
        template.appendTo("body");
        var affixer = $('#affixTarget').affix({
          offset: $('#affixTarget ul').position()
        })
        
        stop()
        $('#affixTarget').on('affixed', function(e){
          ok(true, 'affixed event triggered')
          start()
        })
        
        $('#affixTarget').on('unaffixed', function(e){
          ok(true, 'unaffixed event triggered')
          start()
        })

        $('html,body').animate({
          scrollTop: $(window).scrollTop() + 5000
        },10)
        
        $('html,body').animate({
          scrollTop: $(window).scrollTop() - 5000
        },10)

        setTimeout(function(){
          $('#affixTarget').remove()
          $('#affixAfter').remove()
        },70)
        
      })

})
