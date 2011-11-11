$(function () {

    module("bootstrap-datepicker")

      test("should be defined on jquery object", function () {
        var el = $('<input type="text" />')
        ok(el.datepicker, 'datepicker method is defined')
      })

      test("should return element", function () {
        var el = $('<input type="text" />')
        ok(el.datepicker() == el, 'element returned')
      })

      test("should expose default settings", function () {
        ok(!!$.fn.datepicker.defaults, 'defaults is defined')
      })

      test("should show when element is clicked", function () {
        var el = $('<input type="text" />'),
            fixture = $('#qunit-fixture').append(el);
        el.datepicker();
        el.click();
        ok(fixture.find('.datepicker').is(':visible'));
      })

      test("should hide on click outside", function () {
        var el = $('<input type="text" />'),
            fixture = $('#qunit-fixture').append(el);
        el.datepicker().click();
        $('body').click();
        ok(!fixture.find('.datepicker').is(':visible'));
      })
      
      test("should not hide on click on datepicker", function () {
        var el = $('<input type="text" />'),
            fixture = $('#qunit-fixture').append(el);
        el.datepicker().click();
        var picker = fixture.find('.datepicker').click();
        ok(picker.is(':visible'));
      })

      test("set initial state to correct date", function () {
        var el = $('<input type="text" value="1986-09-30" />'),
            fixture = $('#qunit-fixture').append(el);
        el.datepicker().click();
        var picker = fixture.find('.datepicker');
        equal(picker.find('.months .name').text(), 'September');
        equal(picker.find('.years .name').text(), '1986');
        equal(picker.find('.selected').text(), '30');
      })
      
      test("select new date in current month", function () {
        var el = $('<input type="text" value="1986-09-30" />'),
            fixture = $('#qunit-fixture').append(el);
        el.datepicker().click();
        var picker = fixture.find('.datepicker');
        picker.find(':contains(19)').click();
        equal(el.val(), '1986-09-19');
      })

      test("click new date in adjacent month", function () {
        var el = $('<input type="text" value="1986-09-30" />'),
            fixture = $('#qunit-fixture').append(el);
        el.datepicker().click();
        var picker = fixture.find('.datepicker');
        // Overlapping day 3 should be in the next month of October.
        picker.find('.overlap:contains(3)').click();

        // Datepicker should still be visible.
        ok(picker.is(':visible'));
        equal(picker.find('.months .name').text(), 'October');
        equal(picker.find('.selected').text(), '3');

        picker.find(':contains(19)').click();
        equal(el.val(), '1986-10-19');
      })

      test("month and year button navigation", function () {
        var el = $('<input type="text" value="1986-09-30" />'),
            fixture = $('#qunit-fixture').append(el);
        el.datepicker().click();
        var picker = fixture.find('.datepicker');

        picker.find('.months .next').click();
        equal(picker.find('.months .name').text(), 'October');
        equal(picker.find('.years .name').text(), '1986');

        picker.find('.years .next').click();
        equal(picker.find('.months .name').text(), 'October');
        equal(picker.find('.years .name').text(), '1987');

        picker.find('.months .prev').click();
        equal(picker.find('.months .name').text(), 'September');
        equal(picker.find('.years .name').text(), '1987');

        picker.find('.years .prev').click().click().click();
        equal(picker.find('.years .name').text(), '1984');
      })

      test("keyboard navigation", function () {
        var el = $('<input type="text" value="1986-09-30" />'),
            fixture = $('#qunit-fixture').append(el);
        el.datepicker().click();
        var picker = fixture.find('.datepicker');

        // Arrow up goes back one week.
        $('body').trigger($.Event('keydown', { keyCode: 38 }));
        equal(picker.find('.selected').text(), '23');

        // Arrow right goes forward one day.
        $('body').trigger($.Event('keydown', { keyCode: 39 }));
        equal(picker.find('.selected').text(), '24');

        // Enter selects.
        $('body').trigger($.Event('keydown', { keyCode: 13 }));

        equal(el.val(), '1986-09-24');
      })
})
