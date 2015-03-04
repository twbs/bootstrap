## How does Bootstrap's test suite work?

Bootstrap uses [QUnit](http://api.qunitjs.com/), a powerful, easy-to-use JavaScript unit test framework. Each plugin has a file dedicated to its tests in `unit/[plugin-name].js`.

* `unit/` contains the unit test files for each Bootstrap plugin.
* `vendor/` contains third-party testing-related code for the browser environment (jQuery and QUnit)
* `visual/` contains visual test code which is manually evaluated.

To run the unit test suite via [PhantomJS](http://phantomjs.org/), run `grunt test-js`.
To run the unit test suite via a real web browser, open `index.html` in the browser.


## How do I add a new unit test?

1. Locate the file dedicated to the plugin which you need to add tests to.
2. Add the JavaScript for your new testcase into the plugin's file within `unit/[plugin-name].js`.
3. Review the existing QUnit tests and review the [QUnit API Documentation](http://api.qunitjs.com/) in preparation for adding your own tests.
4. Add the necessary unit test(s) for the new or revised functionality.
5. Run `grunt test-js` to see the results of your newly-added test.

## What should a unit test look like?

* Each test should have a unique name clearly stating what unit is being tested.
* Each test should test only one unit per test. Create multiple tests for multiple units of functionality.
* Each test should begin with [`assert.expect`](http://api.qunitjs.com/expect/) to ensure that the expected assertions are run.
* Each test should follow the project's [JavaScript Code Guidelines](https://github.com/twbs/bootstrap/blob/master/CONTRIBUTING.md#js)

### Example Test

```javascript
QUnit.test('should describe the unit being tested', function (assert) {
  assert.expect(1)
  var templateHTML = '<div class="alert alert-danger fade in">'
      + '<a class="close" href="#" data-dismiss="alert">×</a>'
      + '<p><strong>Template necessary for the test.</p>'
      + '</div>'
  var $alert = $(templateHTML).bootstrapAlert()

  $alert.find('.close').click()

  // Make assertion
  assert.strictEqual($alert.hasClass('in'), false, 'remove .in class on .close click')
})
```