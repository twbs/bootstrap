---
title: Color modes
description: Bootstrap supports light and dark color modes. The page follows the visitor’s system preference by default, and you can force a mode globally or per-component with the `data-bs-theme` attribute.
toc: true
---

import { getDocsRelativePath } from '@libs/path'

<Callout>
**Try it yourself!** Download the source code and working demo for using Bootstrap with Stylelint, and the color modes from the [twbs/examples repository](https://github.com/twbs/examples/tree/main/color-modes). You can also [open the example in StackBlitz](https://stackblitz.com/github/twbs/examples/tree/main/color-modes?file=index.html).
</Callout>

## Dark mode

**Bootstrap supports light and dark color modes out of the box.** They’re built on the native CSS [`light-dark()`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark) function and the [`color-scheme`](https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme) property, so our color tokens resolve to a light or dark value automatically—no recompiling and no duplicate stylesheets required.

This gives you the best of both worlds, with no flag to set:

- **System preference by default.** Our `:root` is declared with `color-scheme: light dark`, so the page automatically follows the visitor’s operating system preference (`prefers-color-scheme`), just like a media query implementation.
- **Override with a data attribute.** Set `data-bs-theme="light"` or `data-bs-theme="dark"` on the `<html>` element to force a mode for the whole page, or on any element or component to scope a mode to just that subtree.

You don’t have to choose between media queries and a data attribute—because color modes are driven by `color-scheme`, the system preference and any `data-bs-theme` override work together.

## Example

For example, to change the color mode of a menu, add `data-bs-theme="light"` or `data-bs-theme="dark"` to the parent element. Now, no matter the global color mode, these menus will display with the specified theme value.

<Example class="d-flex justify-content-between" code={`<div data-bs-theme="light">
    <button class="btn-solid theme-secondary" type="button" data-bs-toggle="menu" aria-expanded="false">
      Default menu
    </button>
    <div class="menu">
      <a class="menu-item active" href="#">Action</a>
      <a class="menu-item" href="#">Action</a>
      <a class="menu-item" href="#">Another action</a>
      <a class="menu-item" href="#">Something else here</a>
      <hr class="menu-divider">
      <a class="menu-item" href="#">Separated link</a>
    </div>
  </div>

  <div data-bs-theme="dark">
    <button class="btn-solid theme-secondary" type="button" data-bs-toggle="menu" aria-expanded="false">
      Dark menu
    </button>
    <div class="menu">
      <a class="menu-item active" href="#">Action</a>
      <a class="menu-item" href="#">Action</a>
      <a class="menu-item" href="#">Another action</a>
      <a class="menu-item" href="#">Something else here</a>
      <hr class="menu-divider">
      <a class="menu-item" href="#">Separated link</a>
    </div>
  </div>`} />

## How it works

- Our color tokens are defined once in `:root` using the CSS `light-dark()` function, e.g. `--bs-border-color: light-dark(var(--bs-gray-200), var(--bs-gray-700))`. Each token carries both its light and dark value, and the browser resolves the right one based on the element’s used color scheme.

- The `:root` element is set to `color-scheme: light dark`, so the page honors the visitor’s system preference by default. There’s nothing else to wire up for automatic dark mode.

- The `data-bs-theme` attribute overrides `color-scheme` for the element it’s set on and its descendants—`[data-bs-theme="dark"]` sets `color-scheme: dark` and `[data-bs-theme="light"]` sets `color-scheme: light`. That forces every `light-dark()` token in that subtree to resolve to the chosen mode, which is why you can flip the whole page from `<html>` or recolor just a single component (as shown above).

- For styles that can’t be expressed as a token—custom components, or additional color modes of your own—use the `color-mode()` Sass mixin to scope rules to a mode. See [Building with Sass](#building-with-sass).

## Usage

### Enable dark mode

By default Bootstrap already follows the visitor’s system preference, so you don’t need to do anything to get automatic dark mode. To **force** dark mode regardless of their system setting, add the `data-bs-theme="dark"` attribute to the `<html>` element. This applies the dark color mode to all components and elements, other than those with their own `data-bs-theme` attribute. Building on the [quick start template]([[docsref:/guides/quickstart/]]):

```html
<!doctype html>
<html lang="en" data-bs-theme="dark">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Bootstrap demo</title>
    <link href="[[config:cdn.css]]" rel="stylesheet" integrity="[[config:cdn.css_hash]]" crossorigin="anonymous">
  </head>
  <body>
    <h1>Hello, world!</h1>
    <script type="module" src="[[config:cdn.js_bundle]]" integrity="[[config:cdn.js_bundle_hash]]" crossorigin="anonymous"></script>
  </body>
</html>
```

Bootstrap does not yet ship with a built-in color mode picker, but you can use the one from our own documentation if you like. [Learn more in the JavaScript section.](#javascript)

### Building with Sass

Our built-in light and dark tokens auto-toggle via `light-dark()`, so you don’t need Sass to get automatic dark mode. The `color-mode()` mixin is for the extra cases: styles that can’t be captured by a token, or additional custom color modes of your own.

The mixin can emit its rules two ways, controlled by the `$color-mode-type` Sass variable:

- `media-query` (the default) wraps your styles in a `@media (prefers-color-scheme: …)` block, so they follow the system preference.
- `data` scopes your styles to a `[data-bs-theme="…"]` selector, so they can be toggled per-page or per-component.

For example, opting into the `data` attribute approach produces a scoped selector:

```scss
$color-mode-type: data;

@include color-mode(dark) {
  .element {
    color: var(--bs-primary-fg-emphasis);
    background-color: var(--bs-primary-bg-subtle);
  }
}
```

Outputs to:

```css
[data-bs-theme=dark] .element {
  color: var(--bs-primary-fg-emphasis);
  background-color: var(--bs-primary-bg-subtle);
}
```

And with the default `media-query` type, the same mixin output is wrapped in a media query instead:

```scss
$color-mode-type: media-query;

@include color-mode(dark) {
  .element {
    color: var(--bs-primary-fg-emphasis);
    background-color: var(--bs-primary-bg-subtle);
  }
}
```

Outputs to:

```css
@media (prefers-color-scheme: dark) {
  .element {
    color: var(--bs-primary-fg-emphasis);
    background-color: var(--bs-primary-bg-subtle);
  }
}
```

## Custom color modes

While the primary use case for color modes is light and dark mode, custom color modes are also possible. Create your own `data-bs-theme` selector with a custom value as the name of your color mode, then modify our Sass and CSS variables as needed. Bootstrap’s built-in dark mode uses `_root.scss` and `_theme.scss`, but you can follow the same pattern in your own stylesheet.

For example, you can create a “blue theme” with the selector `data-bs-theme="blue"`. In your custom Sass or CSS file, add the new selector and override any global or component CSS variables as needed. If you’re using Sass, you can also use Sass’s functions within your CSS variable overrides.

<ScssDocs name="custom-color-mode" file="site/src/scss/_content.scss" />

<Example showMarkup={false} code={`<div class="p-5 fg-body bg-body rounded-3" data-bs-theme="blue">
      <div class="h4">Example blue theme</div>
      <p>Some paragraph text to show how the blue theme might look with written copy.</p>

      <hr class="my-4"/>

      <div>
        <button class="btn-solid theme-secondary" type="button" data-bs-toggle="menu" aria-expanded="false">
          Menu
        </button>
        <div class="menu">
          <a class="menu-item active" href="#">Action</a>
          <a class="menu-item" href="#">Action</a>
          <a class="menu-item" href="#">Another action</a>
          <a class="menu-item" href="#">Something else here</a>
          <hr class="menu-divider">
          <a class="menu-item" href="#">Separated link</a>
        </div>
      </div>
  </div>`} />

```html
<div data-bs-theme="blue">
  ...
</div>
```

## JavaScript

To allow visitors or users to toggle color modes, you’ll need to create a toggle element to control the `data-bs-theme` attribute on the root element, `<html>`. We’ve built a toggler in our documentation that initially defers to a user’s current system color mode, but provides an option to override that and pick a specific color mode.

Here’s a look at the JavaScript that powers it. Feel free to inspect our own documentation navbar to see how it’s implemented using HTML and CSS from our own components. It is suggested to include the JavaScript at the top of your page to reduce potential screen flickering during reloading of your site. Note that if you decide to use media queries for your color modes, your JavaScript may need to be modified or removed if you prefer an implicit control.

<Code containerClass="bd-example-snippet" lang="js" filePath={getDocsRelativePath('/static/docs/[version]/assets/js/color-modes.js')} />

## CSS

### Variables

Dozens of root-level CSS variables carry both a light and a dark value via `light-dark()`, so a single `:root` declaration covers both modes—no repeated dark mode overrides. Use these as a guideline when defining tokens for your own custom color modes.

{/* <ScssDocs name="root-dark-mode-vars" file="scss/_root.scss" /> */}

### Sass variables

Our light and dark color tokens are generated from Sass in `_root.scss` and `_theme.scss`, where most are emitted as `light-dark()` values so they resolve automatically. Components that paint their icons via CSS masks (carousel controls, close buttons, and similar) inherit the current color and adapt to the active mode without per-mode overrides.

{/* <ScssDocs name="sass-dark-mode-vars" file="scss/_config.scss" /> */}

### Sass mixins

Styles for dark mode, and any custom color modes you create, can be scoped appropriately to the `data-bs-theme` attribute selector or media query with the customizable `color-mode()` mixin. See the [Sass usage section](#building-with-sass) for more details.

<ScssDocs name="color-mode-mixin" file="scss/mixins/_color-mode.scss" />
