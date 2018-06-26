## How does Bootstrap's test suite work?

Bootstrap uses [QUnit](https://qunitjs.com/) and [Sinon](http://sinonjs.org/). Each plugin has a file dedicated to its tests in `unit/<plugin-name>.js`.

* `unit/` contains the unit test files for each Bootstrap plugin.
* `vendor/` contains third-party testing-related code (QUnit, jQuery and Sinon).
* `visual/` contains "visual" tests which are run interactively in real browsers and require manual verification by humans.

To run the unit test suite via [Karma](https://karma-runner.github.io/), run `npm run js-test`.

To run the unit test suite via a real web browser, open `index.html` in the browser.


## How do I add a new unit test?

1. Locate and open the file dedicated to the plugin which you need to add tests to (`unit/<plugin-name>.js`).
2. Review the [QUnit API Documentation](https://api.qunitjs.com/) and use the existing tests as references for how to structure your new tests.
3. Write the necessary unit test(s) for the new or revised functionality.
4. Run `npm run js-test` to see the results of your newly-added test(s).

**Note:** Your new unit tests should fail before your changes are applied to the plugin, and should pass after your changes are applied to the plugin.

## What should a unit test look like?

* Each test should have a unique name clearly stating what unit is being tested.
* Each test should test only one unit per test, although one test can include several assertions. Create multiple tests for multiple units of functionality.
* Each test should begin with [`assert.expect`](https://api.qunitjs.com/assert/expect/) to ensure that the expected assertions are run.
* Each test should follow the project's [JavaScript Code Guidelines](https://github.com/twbs/bootstrap/blob/master/CONTRIBUTING.md#js)

## Code coverage

Currently we're aiming for at least 80% test coverage for our code. To ensure your changes meet or exceed this limit, run `npm run js-compile && npm run js-test` and open the file in `js/coverage/lcov-report/index.html` to see the code coverage for each plugin. See more details when you select a plugin and ensure your change is fully covered by unit tests.

### Example tests

```js
// Synchronous test
QUnit.test('should describe the unit being tested', function (assert) {
  assert.expect(1)
  var templateHTML = '<div class="alert alert-danger fade show">' +
        '<a class="close" href="#" data-dismiss="alert">×</a>' +
        '<p><strong>Template necessary for the test.</p>' +
        '</div>'
  var $alert = $(templateHTML).appendTo('#qunit-fixture').bootstrapAlert()

  $alert.find('.close').trigger('click')

  // Make assertion
  assert.strictEqual($alert.hasClass('show'), false, 'remove .show class on .close click')
})

// Asynchronous test
QUnit.test('should describe the unit being tested', function (assert) {
  assert.expect(2)
  var done = assert.async()

  var $tooltip = $('<div title="tooltip title"></div>').bootstrapTooltip()
  var tooltipInstance = $tooltip.data('bs.tooltip')
  var spyShow = sinon.spy(tooltipInstance, 'show')

  $tooltip.appendTo('#qunit-fixture')
    .on('shown.bs.tooltip', function () {
      assert.ok(true, '"shown" event was fired after calling "show"')
      assert.ok(spyShow.called, 'show called')
      done()
    })
    .bootstrapTooltip('show')
})
```
