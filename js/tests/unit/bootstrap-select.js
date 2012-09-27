$(function () {

    module("bootstrap-selects")

      test("should be defined on jquery object", function () {
        ok($(document.body).buttonSelect, 'buttonSelect method is defined')
      })

      test("should change value using method next()", function () {
        var selectHTML =
            '<select>'
          + '<option selected>empty</option>'
          + '<option value="1">value 1</option>'
          + '<option value="2">value 2</option>'
          + '</select>'

        $select = $(selectHTML).appendTo("#qunit-fixture")

        $select.buttonSelect()
        equals($select.val(), 'empty')

        $select.buttonSelect('next')
        equals($select.val(), '1')

        $select.buttonSelect('next')
        equals($select.val(), '2')

        $select.buttonSelect('next')
        equals($select.val(), '2')
      })

      test("should change value using method prev()", function () {
        var selectHTML =
            '<select>'
          + '<option >empty</option>'
          + '<option value="1">value 1</option>'
          + '<option value="2" selected>value 2</option>'
          + '</select>'

        $select = $(selectHTML).appendTo("#qunit-fixture")

        $select.buttonSelect()
        equals($select.val(), '2')

        $select.buttonSelect('prev')
        equals($select.val(), '1')

        $select.buttonSelect('prev')
        equals($select.val(), 'empty')

        $select.buttonSelect('prev')
        equals($select.val(), 'empty')
      })

      test("should stay consistent while changing values using methods prev() and next()", function () {
        var selectHTML =
            '<select>'
          + '<option >empty</option>'
          + '<option value="1" selected>value 1</option>'
          + '<option value="2">value 2</option>'
          + '</select>'

        $select = $(selectHTML).appendTo("#qunit-fixture")

        $select.buttonSelect()
        equals($select.val(), '1')

        $select.buttonSelect('prev')
        equals($select.val(), 'empty')

        $select.buttonSelect('prev')
        equals($select.val(), 'empty')

        $select.buttonSelect('next')
        equals($select.val(), '1')

        $select.buttonSelect('next')
        equals($select.val(), '2')

        $select.buttonSelect('next')
        equals($select.val(), '2')

        $select.buttonSelect('prev')
        equals($select.val(), '1')
      })

      test("should change button text accordigly", function () {
        var selectHTML =
            '<select>'
          + '<option >empty</option>'
          + '<option value="1" selected>value 1</option>'
          + '<option value="2">value 2</option>'
          + '</select>'

        $select = $(selectHTML).appendTo("#qunit-fixture")

        $select.buttonSelect()
        var $span = $select.data('buttonSelect').$span

        equals($span.text(), 'value 1')

        $select.buttonSelect('prev')
        equals($span.text(), 'empty')

        $select.buttonSelect('prev')
        equals($span.text(), 'empty')

        $select.buttonSelect('next')
        equals($span.text(), 'value 1')

        $select.buttonSelect('next')
        equals($span.text(), 'value 2')

        $select.buttonSelect('next')
        equals($span.text(), 'value 2')
      })

})
