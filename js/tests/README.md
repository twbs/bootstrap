## How does Bootstrap’s test suite work?

Bootstrap uses [Vitest](https://vitest.dev/) in [browser mode](https://vitest.dev/guide/browser/), which runs each spec in a real Chromium through [Playwright](https://playwright.dev/). Each plugin has a file dedicated to its tests in `js/tests/unit/<plugin-name>.spec.js`.

- `visual/` contains "visual" tests which are run interactively in real browsers and require manual verification by humans.
- `types/` contains compile-time type tests. They are type-checked, never executed.
- `vitest.config.mts` holds the runner config, and `vitest-setup.js` runs before every spec.

To run the unit test suite, run `npm run js-test`. That also builds the two integration bundles.
To run only the unit specs, run `npm run js-test-unit`.
To run the specs in a visible browser and debug them, run `npm run js-debug`.

Playwright needs its browser once per machine. If the run fails because Chromium is missing, run `npx playwright install chromium`.

### Jasmine-style helpers

The specs predate Vitest and are written against the Jasmine API. `vitest-setup.js` maps that API onto Vitest, so `spyOn`, `spyOnProperty`, `jasmine.clock()`, `toHaveClass`, `toBeTrue`, `toBeFalse` and `toHaveSize` all keep working. Two differences are worth knowing when you write a new spec.

- `spyOn` stubs the method, the way Jasmine does. Vitest's own `vi.spyOn` calls the real method instead. Add `.and.callThrough()` when you want the real one.
- Asynchronous tests return a promise. Vitest 4 removed the `done` callback, so `it('…', done => …)` no longer works.

You can use the plain Vitest API in new specs. Import `vi` from `vitest` and prefer it for new work; the shim exists for the specs that already rely on Jasmine.

## Type tests

Bootstrap ships its own TypeScript declarations, so consumers need no `@types/bootstrap`. Two tests protect that public API. Both assert the same surface, but each checks a different artifact.

- `types/api.ts` checks the **source** (`js/src/*.ts`). It imports the source with relative paths. Run it with `npm run js-typecheck`. It runs before the build, as part of `npm run lint`.
- `types/consumer.ts` checks the **shipped** declarations (`js/dist/*.d.ts`). It imports through the package name (`bootstrap` and `bootstrap/js/src/*.js`), exactly as a downstream project does. Node resolves both through the `exports` map. Run it with `npm run js-typecheck-dist`. It needs the build first, so it runs after `npm run dist`.

A source-only test cannot catch a declaration-emit bug. For example, a leaked private type or a broken import inside a `.d.ts` passes `api.ts` but fails `consumer.ts`. Keep the two files in sync when you change the public API.

## How do I add a new unit test?

1. Locate and open the file dedicated to the plugin which you need to add tests to (`js/tests/unit/<plugin-name>.spec.js`).
2. Review the [Vitest API documentation](https://vitest.dev/api/) and use the existing tests as references for how to structure your new tests.
3. Write the necessary unit test(s) for the new or revised functionality.
4. Run `npm run js-test-unit` to see the results of your newly-added test(s).

To run a single file, pass its path: `npm run js-test-unit -- js/tests/unit/tab.spec.js`.

**Note:** Your new unit tests should fail before your changes are applied to the plugin, and should pass after your changes are applied to the plugin.

## What should a unit test look like?

- Each test should have a unique name clearly stating what unit is being tested.
- Each test should be in the corresponding `describe`.
- Each test should test only one unit per test, although one test can include several assertions. Create multiple tests for multiple units of functionality.
- Each test should use [`expect`](https://vitest.dev/api/expect.html) to ensure something is expected.
- Each test should follow the project’s [JavaScript Code Guidelines](https://github.com/twbs/bootstrap/blob/main/.github/CONTRIBUTING.md#js)

## Code coverage

Currently we’re aiming for at least 90% test coverage for our code. To ensure your changes meet or exceed this limit, run `npm run js-test-unit` and open the file in `js/coverage/lcov-report/index.html` to see the code coverage for each plugin. See more details when you select a plugin and ensure your change is fully covered by unit tests.

The run fails if coverage drops below the thresholds in `vitest.config.mts`: 90% of statements, functions and lines, and 88% of branches. Coverage counts every file in `js/src`, including the ones no spec imports, so an untested plugin shows as 0% instead of disappearing from the report.

### Example tests

```js
// Synchronous test
describe('getInstance', () => {
  it('should return null if there is no instance', () => {
    // Make assertion
    expect(Tab.getInstance(fixtureEl)).toBeNull()
  })

  it('should return this instance', () => {
    fixtureEl.innerHTML = '<div></div>'

    const divEl = fixtureEl.querySelector('div')
    const tab = new Tab(divEl)

    // Make assertion
    expect(Tab.getInstance(divEl)).toEqual(tab)
  })
})

// Asynchronous test
it('should show a tooltip without the animation', () => {
  return new Promise(resolve => {
    fixtureEl.innerHTML = '<a href="#" rel="tooltip" title="Another tooltip"></a>'

    const tooltipEl = fixtureEl.querySelector('a')
    const tooltip = new Tooltip(tooltipEl, {
      animation: false
    })

    tooltipEl.addEventListener('shown.bs.tooltip', () => {
      const tip = document.querySelector('.tooltip')

      expect(tip).not.toBeNull()
      expect(tip.classList.contains('fade')).toEqual(false)
      resolve()
    })

    tooltip.show()
  })
})
```
