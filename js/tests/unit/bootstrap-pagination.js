$(function () {

    module("bootstrap-pagination")

      test("should be defined on jquery object", function () {
        var div = $("<div class='pagination'></div>")
        ok(div.pagination, 'pagination method is defined')
      })

      test("should return element", function () {
        var div = $("<div class='pagination'></div>")
        ok(div.pagination() == div, 'document.body returned')
      })

      test("should expose defaults var for settings", function () {
        ok($.fn.pagination.defaults, 'default object exposed')
      })

      test("children is smaller than page size", function () {
        var div = $("<div></div>")
        for(var i = 0; i < 5; i++) {
          div.append('<div></div>')
        }

        var pagination = $("<div class='pagination'></div>")

        pagination.pagination({
          paged: div,
          pageSize: 10
        })

        var ul = pagination.find('ul')
        ok(!ul.length, 'ul not created')
      })

      test("should build pages when children greater than page size", function () {
        var div = $("<div></div>")
        for(var i = 0; i < 5; i++) {
          div.append('<div></div>')
        }

        var pagination = $("<div class='pagination'></div>")

        pagination.pagination({
          paged: div,
          pageSize: 3
        })

        var ul = pagination.find('ul')
        ok(ul.length, 'ul created')
        equal(ul.find('li').length, 4, '2 pages created + arrows')
      })

      test("should build pages when children greater than page size without arrows", function () {
        var div = $("<div></div>")
        for(var i = 0; i < 5; i++) {
          div.append('<div></div>')
        }

        var pagination = $("<div class='pagination'></div>")

        pagination.pagination({
          paged: div,
          pageSize: 3,
          showArrows: false
        })

        var ul = pagination.find('ul')
        ok(ul.length, 'ul created')
        equal(ul.find('li').length, 2, '2 pages created')
      })

      test("first page prev arrow disabled", function () {
        var div = $("<div></div>")
        for(var i = 0; i < 5; i++) {
          div.append('<div></div>')
        }

        var pagination = $("<div class='pagination'></div>")

        pagination.pagination({
          paged: div,
          pageSize: 3
        })

        ok(pagination.find('li').first().hasClass('active'), 'prev disabled')
      })

      test("second page prev arrow enabled", function () {
        var div = $("<div></div>")
        for(var i = 0; i < 5; i++) {
          div.append('<div></div>')
        }

        var pagination = $("<div class='pagination'></div>")

        pagination.pagination({
          paged: div,
          pageSize: 3
        })

        pagination.pagination('next')

        ok(!pagination.find('li').first().hasClass('active'), 'prev enabled')
      })

      test("first page next arrow enable", function () {
        var div = $("<div></div>")
        for(var i = 0; i < 5; i++) {
          div.append('<div></div>')
        }

        var pagination = $("<div class='pagination'></div>")

        pagination.pagination({
          paged: div,
          pageSize: 3
        })

        ok(!pagination.find('li').last().hasClass('active'), 'next enabled')
      })

      test("last page next arrow enable", function () {
        var div = $("<div></div>")
        for(var i = 0; i < 5; i++) {
          div.append('<div></div>')
        }

        var pagination = $("<div class='pagination'></div>")

        pagination.pagination({
          paged: div,
          pageSize: 3
        })

        pagination.pagination('next')

        ok(pagination.find('li').last().hasClass('active'), 'next disabled')
      })

      test("jump to first page prev arrow disabled", function () {
        var div = $("<div></div>")
        for(var i = 0; i < 5; i++) {
          div.append('<div></div>')
        }

        var pagination = $("<div class='pagination'></div>")

        pagination.pagination({
          paged: div,
          pageSize: 3
        })

        pagination.find('li:eq(1)').click()

        ok(pagination.find('li').first().hasClass('active'), 'prev disabled')
      })

      test("jump to last page prev arrow enabled", function () {
        var div = $("<div></div>")
        for(var i = 0; i < 5; i++) {
          div.append('<div></div>')
        }

        var pagination = $("<div class='pagination'></div>")

        pagination.pagination({
          paged: div,
          pageSize: 3
        })

        pagination.find('li:eq(2)').click()

        ok(!pagination.find('li').first().hasClass('active'), 'prev enabled')
      })

      test("jump to first page next arrow enabled", function () {
        var div = $("<div></div>")
        for(var i = 0; i < 5; i++) {
          div.append('<div></div>')
        }

        var pagination = $("<div class='pagination'></div>")

        pagination.pagination({
          paged: div,
          pageSize: 3
        })

        pagination.find('li:eq(1)').click()

        ok(!pagination.find('li').last().hasClass('active'), 'next enable')
      })

      test("jump to last page next arrow disabled", function () {
        var div = $("<div></div>")
        for(var i = 0; i < 5; i++) {
          div.append('<div></div>')
        }

        var pagination = $("<div class='pagination'></div>")

        pagination.pagination({
          paged: div,
          pageSize: 3
        })

        pagination.find('li:eq(2)').click()

        ok(pagination.find('li').last().hasClass('active'), 'next disabled')
      })
})
