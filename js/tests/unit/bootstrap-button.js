$(function () {

    module("bootstrap-buttons")

      test("should be defined on jquery object", function () {
        ok($(document.body).button, 'button method is defined')
      })

      test("should return element", function () {
        ok($(document.body).button()[0] == document.body, 'document.body returned')
      })

      test("should return set state to loading", function () {
        var btn = $('<button class="btn" data-loading-text="fat">mdo</button>')
        equals(btn.html(), 'mdo', 'btn text equals mdo')
        btn.button('loading')
        equals(btn.html(), 'fat', 'btn text equals fat')
        stop()
        setTimeout(function () {
          ok(btn.attr('disabled'), 'btn is disabled')
          ok(btn.hasClass('disabled'), 'btn has disabled class')
          start()
        }, 0)
      })

      test("should return reset state", function () {
        var btn = $('<button class="btn" data-loading-text="fat">mdo</button>')
        equals(btn.html(), 'mdo', 'btn text equals mdo')
        btn.button('loading')
        equals(btn.html(), 'fat', 'btn text equals fat')
        stop()
        setTimeout(function () {
          ok(btn.attr('disabled'), 'btn is disabled')
          ok(btn.hasClass('disabled'), 'btn has disabled class')
          start()
          stop()
        }, 0)
        btn.button('reset')
        equals(btn.html(), 'mdo', 'btn text equals mdo')
        setTimeout(function () {
          ok(!btn.attr('disabled'), 'btn is not disabled')
          ok(!btn.hasClass('disabled'), 'btn does not have disabled class')
          start()
        }, 0)
      })

      test("should toggle active", function () {
        var btn = $('<button class="btn">mdo</button>')
        ok(!btn.hasClass('active'), 'btn does not have active class')
        btn.button('toggle')
        ok(btn.hasClass('active'), 'btn has class active')
      })

      test("should toggle active when btn children are clicked", function () {
        var btn = $('<button class="btn" data-toggle="button">mdo</button>')
          , inner = $('<i></i>')
        btn
          .append(inner)
          .appendTo($('#qunit-fixture'))
        ok(!btn.hasClass('active'), 'btn does not have active class')
        inner.click()
        ok(btn.hasClass('active'), 'btn has class active')
      })

      test("should toggle active when btn children are clicked within btn-group", function () {
        var btngroup = $('<div class="btn-group" data-toggle="buttons-checkbox"></div>')
          , btn = $('<button class="btn">fat</button>')
          , inner = $('<i></i>')
        btngroup
          .append(btn.append(inner))
          .appendTo($('#qunit-fixture'))
        ok(!btn.hasClass('active'), 'btn does not have active class')
        inner.click()
        ok(btn.hasClass('active'), 'btn has class active')
      })

      test("should check for closest matching toggle", function () {
        var group = $("<div data-toggle='buttons-radio'></div>")
          , btn1  = $("<button class='btn active'></button>")
          , btn2  = $("<button class='btn'></button>")
          , wrap  = $("<div></div>")

        wrap.append(btn1, btn2)

        group
          .append(wrap)
          .appendTo($('#qunit-fixture'))

        ok(btn1.hasClass('active'), 'btn1 has active class')
        ok(!btn2.hasClass('active'), 'btn2 does not have active class')
        btn2.click()
        ok(!btn1.hasClass('active'), 'btn1 does not have active class')
        ok(btn2.hasClass('active'), 'btn2 has active class')
      })

})