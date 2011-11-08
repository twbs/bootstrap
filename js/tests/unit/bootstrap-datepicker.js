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

      test("advance to next month", function () {
        var el = $('<input type="text" value="1986-09-30" />'),
            fixture = $('#qunit-fixture').append(el);
        el.datepicker().click();
        var picker = fixture.find('.datepicker');
        picker.find('.months .next').click();
        equal(picker.find('.months .name').text(), 'October');
      })
})
