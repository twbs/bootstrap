$(function () {

    module("bootstrap-pagination")

      test("should be defined on jquery object", function () {
        var div = $("<div class='pagination'></div>")
        ok(div.pagination, 'pagination method is defined')
      })

      test("should return element", function () {
        var div = $("<div class='pagination'></div>")
        ok(div.pagination({paged: $('<div></div>')}) == div, 'document.body returned')
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

      test("refresh after adding to hit page size", function () {
        var div = $("<div></div>")
        for(var i = 0; i < 4; i++) {
          div.append('<div></div>')
        }

        var pagination = $("<div class='pagination'></div>").appendTo($('body'))

        pagination.pagination({
          paged: div,
          showArrows: false,
          pageSize: 4
        })

        equal(pagination.find('li').length, 0)

        ok(!pagination.is(':visible'))

        div.append('<div></div>')

        pagination.pagination('refresh')

        ok(pagination.is(':visible'))

        equal(pagination.find('li').length, 2)

        pagination.remove()
      })      

      test("ignore commands until initialized", function () {
        var div = $("<div></div>")
        for(var i = 0; i < 3; i++) {
          div.append('<div></div>')
        }

        var pagination = $("<div class='pagination'></div>").appendTo($('body'))

        ok(pagination.is(':visible'))

        pagination.pagination('refresh')

        ok(pagination.is(':visible'))

        pagination.pagination({
          paged: div,
          showArrows: false,
          pageSize: 4
        })

        ok(!pagination.is(':visible'))

        pagination.remove()
      })  

      test("refresh after removing to hit page size", function () {
        var div = $("<div></div>")
        for(var i = 0; i < 5; i++) {
          div.append('<div></div>')
        }

        var pagination = $("<div class='pagination'></div>").appendTo($('body'))

        pagination.pagination({
          paged: div,
          showArrows: false,
          pageSize: 4
        })

        ok(pagination.is(':visible'))
        equal(pagination.find('li').length, 2)

        div.children().last().remove()

        pagination.pagination('refresh')

        ok(!pagination.is(':visible'))
        equal(pagination.find('li').length, 0)

        pagination.remove()
      })      
})
