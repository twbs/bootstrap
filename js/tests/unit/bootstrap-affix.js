$(function () {

    module("bootstrap-affix")

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
        $affix.data('affix').checkPosition()
        ok(!$affix.hasClass('affix'), 'affix class was not added')
      })

      test('should fire pin events', function () {
        $('<div />')
          .affix()
          .on({
            pin: function() {
              ok(true, 'pin was fired')
            },
            pinned: function() {
              ok(true, 'pinned was fired')
            },
            unpin: function() {
              ok(true, 'unpin was fired')
            },
            unpinned: function() {
              ok(true, 'unpinned was fired')
            }
          })
          .affix('pin')
          .affix('unpin')
      })

})