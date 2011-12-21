$(function () {

    module("bootstrap-buttons")

      test("should be defined on jquery object", function () {
        ok($(document.body).button, 'tabs method is defined')
      })

      test("should return element", function () {
        ok($(document.body).button()[0] == document.body, 'document.body returned')
      })

      test("should return set state to loading", function () {
        var btn = $('<button class="btn" data-loading-text="fat">mdo</button>')
        equals(btn.html(), 'mdo', 'btn text equals mdo')
        btn.button('loading')
        equals(btn.html(), 'fat', 'btn text equals fat')
        ok(btn.attr('disabled'), 'btn is disabled')
        ok(btn.hasClass('disabled'), 'btn has disabled class')
      })

      test("should return reset state", function () {
        var btn = $('<button class="btn" data-loading-text="fat">mdo</button>')
        equals(btn.html(), 'mdo', 'btn text equals mdo')
        btn.button('loading')
        equals(btn.html(), 'fat', 'btn text equals fat')
        ok(btn.attr('disabled'), 'btn is disabled')
        ok(btn.hasClass('disabled'), 'btn is disabled')
        btn.button('reset')
        equals(btn.html(), 'mdo', 'btn text equals mdo')
        ok(!btn.attr('disabled'), 'btn is not disabled')
        ok(!btn.hasClass('disabled'), 'btn does not have disabled class')
      })

      test("should toggle active", function () {
        var btn = $('<button class="btn" data-loading-text="fat">mdo</button>')
        ok(!btn.hasClass('active'), 'btn does not have active class')
        btn.button('toggle')
        ok(btn.hasClass('active'), 'btn has class active')
      })

})