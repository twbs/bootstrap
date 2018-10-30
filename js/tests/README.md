## How does Bootstrap's test suite work?

<<<<<<< HEAD
Bootstrap uses [QUnit](https://qunitjs.com/) and [Sinon](https://sinonjs.org/). Each plugin has a file dedicated to its tests in `unit/<plugin-name>.js`.
||||||| merged common ancestors
Bootstrap uses [QUnit](http://api.qunitjs.com/), a powerful, easy-to-use JavaScript unit test framework. Each plugin has a file dedicated to its tests in `unit/<plugin-name>.js`.
=======
Bootstrap uses [QUnit](https://api.qunitjs.com/), a powerful, easy-to-use JavaScript unit test framework. Each plugin has a file dedicated to its tests in `unit/<plugin-name>.js`.
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc

* `unit/` contains the unit test files for each Bootstrap plugin.
<<<<<<< HEAD
* `vendor/` contains third-party testing-related code (QUnit, jQuery and Sinon).
||||||| merged common ancestors
* `vendor/` contains third-party testing-related code (QUnit and jQuery).
=======
* `vendor/` contains jQuery.
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc
* `visual/` contains "visual" tests which are run interactively in real browsers and require manual verification by humans.

<<<<<<< HEAD
To run the unit test suite via [Karma](https://karma-runner.github.io/), run `npm run js-test`.

To run the unit test suite via a real web browser, open `index.html` in the browser.
||||||| merged common ancestors
To run the unit test suite via [PhantomJS](http://phantomjs.org/), run `grunt test-js`.

To run the unit test suite via a real web browser, open `index.html` in the browser.
=======
To run our unit tests on a real web browser [Karma](https://karma-runner.github.io/2.0/index.html), run `grunt test-js` or you can 
open `index.html`.
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc


## How do I add a new unit test?

1. Locate and open the file dedicated to the plugin which you need to add tests to (`unit/<plugin-name>.js`).
2. Review the [QUnit API Documentation](https://api.qunitjs.com/) and use the existing tests as references for how to structure your new tests.
3. Write the necessary unit test(s) for the new or revised functionality.
4. Run `npm run js-test` to see the results of your newly-added test(s).

**Note:** Your new unit tests should fail before your changes are applied to the plugin, and should pass after your changes are applied to the plugin.


## What should a unit test look like?

* Each test should have a unique name clearly stating what unit is being tested.
* Each test should test only one unit per test, although one test can include several assertions. Create multiple tests for multiple units of functionality.
<<<<<<< HEAD
* Each test should begin with [`assert.expect`](https://api.qunitjs.com/assert/expect/) to ensure that the expected assertions are run.
||||||| merged common ancestors
* Each test should begin with [`assert.expect`](http://api.qunitjs.com/expect/) to ensure that the expected assertions are run.
=======
* Each test should begin with [`assert.expect`](https://api.qunitjs.com/expect/) to ensure that the expected assertions are run.
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc
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
