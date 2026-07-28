---
name: bootstrap-component-js
description: Add JavaScript behavior to a Bootstrap 6 component. Use when writing a component's JS, extending BaseComponent, wiring the data API, adding events or config options, or integrating Floating UI or a third-party library.
guide: /getting-started/javascript
---

# Bootstrap 6 component JavaScript

Every Bootstrap plugin is an ES module in `js/src/` that extends `BaseComponent`, which handles instance registration, config merging, and teardown. Follow the shared structure and a component gets `getInstance()`, `getOrCreateInstance()`, `data-bs-*` config, namespaced events, and `dispose()` without writing any of it.

For the component's styles, see the `bootstrap-component` skill.

## Workflow

- [ ] Step 1: Scaffold the module
- [ ] Step 2: Define config options
- [ ] Step 3: Implement behavior and events
- [ ] Step 4: Wire the data API
- [ ] Step 5: Position with Floating UI (optional)
- [ ] Step 6: Wrap a third-party library (optional)
- [ ] Step 7: Clean up in dispose()
- [ ] Step 8: Register and test
- [ ] Step 9: Verify

---

## Step 1: Scaffold the module

Create `js/src/<name>.js`. Read `js/src/alert.js` first — it's the smallest complete example.

```js
/**
 * --------------------------------------------------------------------------
 * Bootstrap widget.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import BaseComponent from './base-component.js'
import EventHandler from './dom/event-handler.js'

/**
 * Constants
 */

const NAME = 'widget'
const DATA_KEY = 'bs.widget'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'

const EVENT_SHOW = `show${EVENT_KEY}`
const EVENT_SHOWN = `shown${EVENT_KEY}`
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`

const CLASS_NAME_SHOW = 'show'
const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="widget"]'

/**
 * Class definition
 */

class Widget extends BaseComponent {
  // Getters
  static get NAME() {
    return NAME
  }
}

export default Widget
```

- `NAME` is the only required static. `BaseComponent` derives `DATA_KEY` (`bs.<name>`) and `EVENT_KEY` (`.bs.<name>`) from it, stores the instance on the element with `Data.set()`, and disposes any previous instance bound to the same element.
- Keep the section comments (`Constants`, `Class definition`, `Data API implementation`) and member grouping (`constructor`, `// Getters`, `// Public`, `// Private`, `// Static`) — every module in `js/src/` looks the same.
- Repo style: ES modules only, no semicolons, 2-space indent, single quotes.
- v6 has **no `defineJQueryPlugin`** and **no `js/src/util.js`**. Helpers live in `js/src/util/index.js`; DOM wrappers in `js/src/dom/` (`event-handler.js`, `selector-engine.js`, `manipulator.js`, `data.js`).

---

## Step 2: Define config options

Declare the defaults and their types as module constants, then expose them as statics:

```js
const Default = {
  animation: true,
  delay: 5000
}

const DefaultType = {
  animation: 'boolean',
  delay: 'number'
}

class Widget extends BaseComponent {
  // Getters
  static get Default() {
    return Default
  }

  static get DefaultType() {
    return DefaultType
  }

  static get NAME() {
    return NAME
  }
}
```

- Merge order, applied by `Config._mergeConfigObj()` (last wins): `Default` → the JSON in `data-bs-config` → individual `data-bs-*` attributes → the object passed to the constructor. You don't write any of this.
- `data-bs-*` names are camelCased when read, so `data-bs-auto-hide="false"` becomes `autoHide: false`.
- Every key in `DefaultType` is validated and throws a `TypeError` on mismatch. Values are matched as regex, so unions work: `'boolean'`, `'(number|string)'`, `'(string|element|function)'`.
- Normalize a value before validation by overriding `_configAfterMerge(config)` — the usual place to resolve a selector string into an element or coerce a shorthand.

---

## Step 3: Implement behavior and events

```js
class Widget extends BaseComponent {
  // Public
  show() {
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW)

    if (showEvent.defaultPrevented) {
      return
    }

    this._element.classList.add(CLASS_NAME_SHOW)

    this._queueCallback(() => {
      EventHandler.trigger(this._element, EVENT_SHOWN)
    }, this._element, this._config.animation)
  }
}
```

- Events come in pairs: an infinitive fired before the action (`show.bs.widget`, cancelable) and a past participle after it (`shown.bs.widget`). Always bail when the "before" event is `defaultPrevented`.
- `_queueCallback(callback, element, isAnimated)` runs the callback after the CSS transition on `element` finishes, and skips it if the instance was disposed mid-transition. Pass the animation flag from config so non-animated components fire immediately.
- Add a payload when listeners need context: `EventHandler.trigger(this._element, EVENT_SHOWN, { relatedTarget })`.
- Query with `SelectorEngine` (`findOne`, `find`, `next`, `prev`, `getElementFromSelector`) instead of raw `querySelector`, and read or write attributes with `Manipulator`.
- Bind internal listeners with `EventHandler.on(this._element, EVENT_MOUSEOVER, …)` using the namespaced constants, so `dispose()` removes them in one call.

---

## Step 4: Wire the data API

The data API goes at the bottom of the module, after the class, as an import side effect:

```js
/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  event.preventDefault()
  Widget.getOrCreateInstance(this).toggle()
})
```

- Delegate from `document` and namespace the event with `.data-api` so it stays distinguishable from user listeners.
- Prefer the shared helpers in `js/src/util/component-functions.js` over hand-rolled handlers:
  - `enableDismissTrigger(Widget)` wires `[data-bs-dismiss="widget"]` to `hide()`. Pass a method name for anything else: `enableDismissTrigger(Alert, 'close')`.
  - `eventActionOnPlugin(Widget, 'click', SELECTOR_DATA_TOGGLE, 'toggle')` handles the "trigger points at one or more targets via `data-bs-target`" case and skips disabled elements.
- Because these are side effects, the data API only exists once the module is imported. Anything importing a single component file gets that component's data API and nothing else.

---

## Step 5: Position with Floating UI (optional)

Menus, tooltips, and popovers position with `@floating-ui/dom`, an optional peer dependency. Guard for it in the constructor before calling `super()`:

```js
import { autoUpdate, computePosition } from '@floating-ui/dom'

class Widget extends BaseComponent {
  constructor(element, config) {
    if (typeof computePosition === 'undefined') {
      throw new TypeError('Bootstrap\'s widgets require Floating UI (https://floating-ui.com)')
    }

    super(element, config)
    this._floatingCleanup = null
  }
}
```

Create the positioner when the element is shown and keep the cleanup function so it can be cancelled:

```js
class Widget extends BaseComponent {
  // Private
  _createFloating() {
    this._updateFloatingPosition()
    this._floatingCleanup = autoUpdate(this._element, this._floatingEl, () => this._updateFloatingPosition())
  }

  _disposeFloating() {
    if (this._floatingCleanup) {
      this._floatingCleanup()
      this._floatingCleanup = null
    }
  }
}
```

`js/src/util/floating-ui.js` handles placement so you don't reimplement it: `getDefaultPlacement()` flips `-start` / `-end` for RTL, `parseResponsivePlacement()` and `getResponsivePlacement()` support `data-bs-placement="bottom-start md:top-end"`, and `createBreakpointListeners()` / `disposeBreakpointListeners()` re-position on breakpoint changes.

---

## Step 6: Wrap a third-party library (optional)

`js/src/datepicker.js` wraps `vanilla-calendar-pro` and is the reference for this pattern:

1. Keep Bootstrap's config surface. Users set `data-bs-*` options; a private builder (`_buildCalendarOptions()`) translates them into the library's option shape.
2. Instantiate in a private initializer called from the constructor and hold the instance on a private field (`this._calendar`).
3. Re-emit the library's callbacks as namespaced Bootstrap events so consumers only learn one API.
4. Call the library's teardown in `dispose()` before `super.dispose()`, and null the field.
5. Add the package to `peerDependencies` in `package.json`, guard for its absence, and document the extra install step on the component's docs page.

Don't fork or vendor the library, and don't expose its instance as public API — anything users need should be a method or event on the Bootstrap class.

---

## Step 7: Clean up in dispose()

```js
class Widget extends BaseComponent {
  // Public
  dispose() {
    clearTimeout(this._timeout)
    this._observer?.disconnect()
    this._disposeFloating()

    super.dispose()
  }
}
```

`super.dispose()` removes the `Data` entry, removes every listener bound on `this._element` under `EVENT_KEY`, and nulls the instance's own properties. Everything else is yours to undo first: timers, `MutationObserver` / `ResizeObserver` instances, listeners bound on `document` or `window`, Floating UI cleanups, and third-party instances. Leaks here show up as failing "should dispose" specs.

---

## Step 8: Register and test

1. Add the export to `js/index.js`:

   ```js
   export { default as Widget } from './src/widget.js'
   ```

   That barrel is the public entry point and feeds both `dist/js/bootstrap.js` and the bundle. Nothing else needs updating: `build/build-plugins.mjs` globs `js/src/**/*.js`, and Karma globs `js/tests/unit/**/*.spec.js`.

2. Add a Jasmine spec at `js/tests/unit/<name>.spec.js`:

   ```js
   import Widget from '../../src/widget.js'
   import { clearFixture, getFixture } from '../helpers/fixture.js'

   describe('Widget', () => {
     let fixtureEl

     beforeAll(() => {
       fixtureEl = getFixture()
     })

     afterEach(() => {
       clearFixture()
     })

     it('should expose the plugin name and data key', () => {
       expect(Widget.NAME).toEqual('widget')
       expect(Widget.DATA_KEY).toEqual('bs.widget')
     })
   })
   ```

   Cover the constructor with both a selector and an element, config coming from `data-bs-*`, each public method, both events including the cancelable one, the data API without manual instantiation, and `dispose()`. Bootstrap holds `js/src` at full coverage, so untested branches fail the build.

3. Document it on the component's docs page: add `js: optional` (or `js: required`) to the frontmatter, `<JsDataAttributes />` in an `### Options` section, and `<BsTable>` tables for options, methods, and events. Demo snippets live in `site/src/assets/partials/snippets.js` and render with `<JsDocs name="live-widget" file="site/src/assets/partials/snippets.js" />`.

---

## Step 9: Verify

1. `npm run js-lint`
2. `npm run js-test` — Karma unit tests plus the integration bundles that prove the module is tree-shakeable.
3. `npm run js` — compiles `js/src` to `dist/js`. Check the bundle grew by roughly what you'd expect; `npm run bundlewatch` enforces size budgets.
4. `npm start` and exercise the component on its docs page, with the keyboard as well as the mouse.

---

## In your own project

`package.json` exports `./js/src/*`, so custom components can build on the same base class:

```js
import BaseComponent from 'bootstrap/js/src/base-component.js'
import EventHandler from 'bootstrap/js/src/dom/event-handler.js'

class Widget extends BaseComponent {
  static get NAME() {
    return 'widget'
  }
}
```

Two things to keep in mind. Importing a Bootstrap component module runs its data API as a side effect, which is what you want in an app entry point but not inside a library. And `DATA_KEY` is derived as `bs.<name>`, so pick a `NAME` that doesn't collide with a Bootstrap plugin or your instance will replace theirs on shared elements.
