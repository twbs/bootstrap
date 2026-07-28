---
name: bootstrap-component-js
description: Add JavaScript behavior to a Bootstrap 6 component. Use when writing a component's TypeScript source, extending BaseComponent, wiring the data API, adding events or config options, or integrating Floating UI or a third-party library.
guide: /getting-started/javascript
---

# Bootstrap 6 component JavaScript

Every Bootstrap plugin is a TypeScript module in `js/src/` that extends `BaseComponent`, which handles instance registration, config merging, and teardown. Follow the shared structure and a component gets `getInstance()`, `getOrCreateInstance()`, `data-bs-*` config, namespaced events, and `dispose()` without writing any of it.

The sources are TypeScript, but the runtime patterns are the same ones v5 used with types layered on top. Bootstrap compiles them to JavaScript and emits its own declarations, so consumers need no `@types/bootstrap`.

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

Create `js/src/<name>.ts`. Read `js/src/alert.ts` first — it's the smallest complete example.

```ts
/**
 * --------------------------------------------------------------------------
 * Bootstrap widget.ts
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
  static override get NAME(): string {
    return NAME
  }
}

export default Widget
```

- `NAME` is the only required static. `BaseComponent` derives `DATA_KEY` (`bs.<name>`) and `EVENT_KEY` (`.bs.<name>`) from it, stores the instance on the element with `Data.set()`, and disposes any previous instance bound to the same element.
- Keep the section comments (`Constants`, `Class definition`, `Data API implementation`) and member grouping (`constructor`, `// Getters`, `// Public`, `// Private`, `// Static`) — every module in `js/src/` looks the same.
- Repo style: ES modules only, no semicolons, 2-space indent, single quotes, and `override` on every member that overrides `BaseComponent` or `Config`.
- Relative imports keep the ESM `.js` extension even though the file on disk is `.ts`, because `tsconfig.json` sets `moduleResolution: nodenext`. Rolldown, Vite, and Vitest all map the specifier back to the `.ts` source.
- The compiler is strict in ways worth knowing before you write: `verbatimModuleSyntax` wants type imports marked (`import EventHandler, { type BootstrapEvent } from './dom/event-handler.js'`), and `erasableSyntaxOnly` rules out enums, namespaces, and constructor parameter properties.
- Declare instance state as `protected declare _foo: Type` and assign it in the constructor, the way `toast.ts` does. `declare` is type-only; a real field without an initializer would emit `_foo = undefined` under `useDefineForClassFields` and wipe whatever the base constructor set.
- v6 has **no `defineJQueryPlugin`** and **no `js/src/util.ts`**. Helpers live in `js/src/util/`; DOM wrappers in `js/src/dom/` (`event-handler`, `selector-engine`, `manipulator`, `data`).

---

## Step 2: Define config options

Declare the config shape, the defaults, and the runtime types as module constants, then expose them as statics:

```ts
type WidgetConfig = {
  animation: boolean
  delay: number
}

const Default: WidgetConfig = {
  animation: true,
  delay: 5000
}

const DefaultType = {
  animation: 'boolean',
  delay: 'number'
}

class Widget extends BaseComponent {
  protected declare _config: WidgetConfig
  protected declare _timeout: number | null

  constructor(element?: string | Element | null, config?: Partial<WidgetConfig> | null) {
    super(element, config)

    this._timeout = null
  }

  // Getters
  static override get Default(): WidgetConfig {
    return Default
  }

  static override get DefaultType(): Record<string, string> {
    return DefaultType
  }

  static override get NAME(): string {
    return NAME
  }
}

export default Widget
export type { WidgetConfig }
```

- The config type does double duty: `Default` is typed with it, the constructor accepts a `Partial<>` of it since callers pass a subset, and redeclaring `protected declare _config: WidgetConfig` narrows `BaseComponent`'s loose config so `this._config.delay` is a `number`. `DefaultType` stays a plain string map — it drives the runtime check, not the compiler. Export the type; the type tests import it.
- Merge order, applied by `Config._mergeConfigObj()` (last wins): `Default` → the JSON in `data-bs-config` → individual `data-bs-*` attributes → the object passed to the constructor. You don't write any of this.
- `data-bs-*` names are camelCased when read, so `data-bs-auto-hide="false"` becomes `autoHide: false`.
- Every key in `DefaultType` is validated and throws a `TypeError` on mismatch. Values are matched as regex, so unions work: `'boolean'`, `'(number|string)'`, `'(string|element|function)'`.
- Normalize a value before validation by overriding `_configAfterMerge(config)` — the usual place to resolve a selector string into an element or coerce a shorthand.

---

## Step 3: Implement behavior and events

```ts
class Widget extends BaseComponent {
  // Public
  show(): void {
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
- Add a payload when listeners need context: `EventHandler.trigger(this._element, EVENT_SHOWN, { relatedTarget })`. `trigger()` returns a `BootstrapEvent`, an `Event` widened with the payload keys, so reading them back in a handler needs no cast.
- Query with `SelectorEngine` (`findOne`, `find`, `next`, `prev`, `getElementFromSelector`) instead of raw `querySelector`, and read or write attributes with `Manipulator`.
- Bind internal listeners with `EventHandler.on(this._element, EVENT_MOUSEOVER, …)` using the namespaced constants, so `dispose()` removes them in one call.

---

## Step 4: Wire the data API

The data API goes at the bottom of the module, after the class, as an import side effect:

```ts
/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  event.preventDefault()
  Widget.getOrCreateInstance(this).toggle()
})
```

- Delegate from `document` and namespace the event with `.data-api` so it stays distinguishable from user listeners.
- Keep `function` rather than an arrow when you need the delegated element: `EventHandler` types the callback's `this`, so `this` is the match for `SELECTOR_DATA_TOGGLE`. Use an arrow and reach for `event.target` only when you need the actual click target.
- Prefer the shared helpers in `js/src/util/component-functions.ts` over hand-rolled handlers:
  - `enableDismissTrigger(Widget)` wires `[data-bs-dismiss="widget"]` to `hide()`. Pass a method name for anything else: `enableDismissTrigger(Alert, 'close')`.
  - `eventActionOnPlugin(Widget, 'click', SELECTOR_DATA_TOGGLE, 'toggle')` handles the "trigger points at one or more targets via `data-bs-target`" case and skips disabled elements.
- Because these are side effects, the data API only exists once the module is imported. Anything importing a single component file gets that component's data API and nothing else.

---

## Step 5: Position with Floating UI (optional)

Menus, tooltips, and popovers position with `@floating-ui/dom`, an optional peer dependency. Guard for it in the constructor before calling `super()` — legal here because the class declares its fields instead of initializing them:

```ts
import { autoUpdate, computePosition } from '@floating-ui/dom'

class Widget extends BaseComponent {
  protected declare _floatingCleanup: (() => void) | null

  constructor(element?: string | Element | null, config?: Partial<WidgetConfig> | null) {
    if (typeof computePosition === 'undefined') {
      throw new TypeError('Bootstrap\'s widgets require Floating UI (https://floating-ui.com)')
    }

    super(element, config)
    this._floatingCleanup = null
  }
}
```

Create the positioner when the element is shown and keep the cleanup function so it can be cancelled:

```ts
class Widget extends BaseComponent {
  // Private
  protected _createFloating(): void {
    this._updateFloatingPosition()
    this._floatingCleanup = autoUpdate(this._element, this._floatingEl, () => this._updateFloatingPosition())
  }

  protected _disposeFloating(): void {
    if (this._floatingCleanup) {
      this._floatingCleanup()
      this._floatingCleanup = null
    }
  }
}
```

`js/src/util/floating-ui.ts` handles placement so you don't reimplement it: `getDefaultPlacement()` flips `-start` / `-end` for RTL, `parseResponsivePlacement()` and `getResponsivePlacement()` support `data-bs-placement="bottom-start md:top-end"`, and `createBreakpointListeners()` / `disposeBreakpointListeners()` re-position on breakpoint changes.

---

## Step 6: Wrap a third-party library (optional)

`js/src/datepicker.ts` wraps `vanilla-calendar-pro` and is the reference for this pattern:

1. Keep Bootstrap's config surface. Users set `data-bs-*` options; a private builder (`_buildCalendarOptions()`) translates them into the library's option shape.
2. Instantiate in a private initializer called from the constructor and hold the instance on a private field typed with the library's own type (`protected declare _calendar: Calendar | null`).
3. Re-emit the library's callbacks as namespaced Bootstrap events so consumers only learn one API.
4. Call the library's teardown in `dispose()` before `super.dispose()`, and null the field.
5. Add the package to `peerDependencies` in `package.json`, guard for its absence, and document the extra install step on the component's docs page.

Don't fork or vendor the library, and don't expose its instance as public API — anything users need should be a method or event on the Bootstrap class.

---

## Step 7: Clean up in dispose()

```ts
class Widget extends BaseComponent {
  // Public
  override dispose(): void {
    clearTimeout(this._timeout!)
    this._observer?.disconnect()
    this._disposeFloating()

    super.dispose()
  }
}
```

`super.dispose()` removes the `Data` entry, removes every listener bound on `this._element` under `EVENT_KEY`, and nulls the instance's own properties. Everything else is yours to undo first: timers, `MutationObserver` / `ResizeObserver` instances, listeners bound on `document` or `window`, Floating UI cleanups, and third-party instances. Leaks here show up as failing "should dispose" specs.

---

## Step 8: Register and test

1. Add the export to `js/src/index.ts`:

   ```ts
   export { default as Widget } from './widget.js'
   ```

   That barrel is the package entry point and feeds both `dist/js/bootstrap.js` and the bundle. Nothing else needs updating: Rolldown builds from `js/src/index.ts`, `build/build-plugins.mjs` globs `js/src/**/*.ts` for the per-plugin files in `js/dist/`, and Vitest picks up `js/tests/unit/**/*.spec.js`.

2. Extend both type tests. `js/tests/types/api.ts` asserts the public surface against the sources; `js/tests/types/consumer.ts` asserts the same surface against the shipped `js/dist/*.d.ts`, imported through the package name the way a downstream project does. Add the class, its config type, and its methods to both — a declaration-emit bug passes the first and fails the second.

3. Add a spec at `js/tests/unit/<name>.spec.js`. Specs are plain JavaScript and run in a real Chromium through Vitest browser mode:

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

   - `describe`, `it`, `expect`, and the hooks are globals (`globals: true` in `js/tests/vitest.config.mts`), so don't import them. Import `vi` from `vitest` when you need spies or fake timers — that's the preferred API for new specs.
   - `js/tests/vitest-setup.js` maps the Jasmine API the older specs are written against onto Vitest, so `spyOn`, `jasmine.clock()`, `toHaveClass`, `toBeTrue`, `toBeFalse`, and `toHaveSize` still work. Two gotchas: the shimmed `spyOn` stubs the method (add `.and.callThrough()` for the real one), and Vitest 4 dropped the `done` callback, so an asynchronous test returns a promise and resolves it from the listener.
   - Cover the constructor with both a selector and an element, config coming from `data-bs-*`, each public method, both events including the cancelable one, the data API without manual instantiation, and `dispose()`. Coverage counts every file in `js/src`, so a component with no spec drags the run below the thresholds in `js/tests/vitest.config.mts` (90% of statements, functions, and lines; 88% of branches) and fails the build.

4. Document it on the component's docs page: add `js: optional` (or `js: required`) to the frontmatter, `<JsDataAttributes />` in an `### Options` section, and `<BsTable>` tables for options, methods, and events. Demo snippets live in `site/src/assets/partials/snippets.js` and render with `<JsDocs name="live-widget" file="site/src/assets/partials/snippets.js" />`.

---

## Step 9: Verify

1. `npm run js-lint`
2. `npm run js-typecheck` — `tsc --noEmit` over `js/src` and the type tests.
3. `npm run js-test-unit`, or `npm run js-test` to add the two Rolldown integration bundles that prove the module is tree-shakeable. Playwright needs its browser once per machine (`npx playwright install chromium`), and `npm run js-debug` runs the specs in a visible browser.
4. `npm run js` — Rolldown compiles the sources to `dist/js` and `js/dist`, terser minifies, and `tsc` emits the `.d.ts` files. Check the bundle grew by roughly what you'd expect; `npm run bundlewatch` enforces size budgets.
5. `npm start` and exercise the component on its docs page, with the keyboard as well as the mouse.

---

## In your own project

`package.json` maps `bootstrap/js/src/*.js` to the compiled `js/dist/*.js` and its declarations, so the same specifier works from JavaScript and TypeScript, and custom components can build on the same base class:

```ts
import BaseComponent from 'bootstrap/js/src/base-component.js'
import EventHandler from 'bootstrap/js/src/dom/event-handler.js'

class Widget extends BaseComponent {
  static override get NAME(): string {
    return 'widget'
  }
}
```

Two things to keep in mind. Importing a Bootstrap component module runs its data API as a side effect, which is what you want in an app entry point but not inside a library. And `DATA_KEY` is derived as `bs.<name>`, so pick a `NAME` that doesn't collide with a Bootstrap plugin or your instance will replace theirs on shared elements.
