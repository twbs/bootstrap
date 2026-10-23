---
title: Height
description: Use height utilities to control the height of elements with responsive height classes.
toc: true
mdn: https://developer.mozilla.org/en-US/docs/Web/CSS/height
utility:
  - height
  - max-height
  - min-height
  - viewport-height
  - min-viewport-height
  - dynamic-viewport-height
  - min-dynamic-viewport-height
---

Use height utilities to set the height of elements. Height utilities are generated from the utility API and include support for percentage values, intrinsic sizing keywords, and viewport units.

## Relative height

Set height relative to the parent element using percentage-based utilities. Includes support for `25%`, `50%`, `75%`, `100%`, and `auto` by default.

<Example class="bd-example-flex" code={`<div style="height: 100px;">
    <div class="h-25 d-inline-block" style="width: 120px;">Height 25%</div>
    <div class="h-50 d-inline-block" style="width: 120px;">Height 50%</div>
    <div class="h-75 d-inline-block" style="width: 120px;">Height 75%</div>
    <div class="h-100 d-inline-block" style="width: 120px;">Height 100%</div>
    <div class="h-auto d-inline-block" style="width: 120px;">Height auto</div>
  </div>`} />

## Intrinsic sizing

Use intrinsic sizing keywords to set height based on content.

<Example class="bd-example-flex" code={`<div style="height: 200px;">
    <div class="h-min d-inline-block p-3" style="width: 120px;">Height min-content</div>
    <div class="h-max d-inline-block p-3" style="width: 120px;">Height max-content</div>
    <div class="h-fit d-inline-block p-3" style="width: 120px;">Height fit-content</div>
  </div>`} />

## Max height

Set maximum height using `max-height` utilities.

<Example class="bd-example-flex" code={`<div style="height: 100px;">
    <div class="max-h-100" style="width: 100px; height: 200px;">Max-height 100%</div>
  </div>`} />

## Min height

Set minimum height using `min-height` utilities.

<Example class="bd-example-flex" code={`<div class="min-h-0 p-3" style="width: 200px;">
    Min-height 0 (allows content to determine height)
  </div>
<div class="min-h-100 p-3" style="width: 200px;">Min-height 100%</div>`} />

## Viewport height

Set height relative to the viewport using viewport units.

```html
<div class="vh-100">Height 100vh</div>
<div class="min-vh-100">Min-height 100vh</div>
```

<Callout>
**Full viewport height sections!** Using `vh-100` makes an element take up the entire viewport height, which is useful for hero sections and full-screen layouts. On mobile browsers, `vh-100` can be taller than the visible area. See [dynamic viewport height](#dynamic-viewport-height).
</Callout>

## Dynamic viewport height

On mobile browsers, the URL bar and the toolbars hide and show while the user scrolls. The `vh` unit does not change when this happens. It always measures the viewport with the browser UI hidden. An element with `vh-100` is therefore taller than the visible area while the URL bar shows. The bottom of the element stays off screen.

The `dvh` unit measures the area that the user sees now. The browser updates the value when it hides or shows the browser UI. Use `dvh-100` and `min-dvh-100` to fill the visible area on every device.

```html
<div class="dvh-100">Height 100dvh</div>
<div class="min-dvh-100">Min-height 100dvh</div>
```

<Callout>
**Which unit do I use?** Use `dvh` for full-screen mobile layouts, such as hero sections and full-height panels. Use `vh` when you need a height that does not change. The browser recalculates `dvh` while the browser UI animates, so the content can move. The browser never recalculates `vh`, but the element can overflow the visible area.
</Callout>

### Small and large viewport units

CSS gives you two more viewport units:

- `svh` is the small viewport height. It measures the viewport with the browser UI shown.
- `lvh` is the large viewport height. It measures the viewport with the browser UI hidden. Current browsers give `vh` the same value.

We do not ship utilities for `svh` and `lvh`, because most layouts need `dvh`. Add them with the [utilities API]([[docsref:/utilities/api#add-utilities]]):

```scss
// my-bootstrap.scss
@use "bootstrap/scss/bootstrap" with (
  $utilities: (
    "small-viewport-height": (
      property: height,
      class: svh,
      values: (100: 100svh)
    ),
    "min-small-viewport-height": (
      property: min-height,
      class: min-svh,
      values: (100: 100svh)
    ),
    "large-viewport-height": (
      property: height,
      class: lvh,
      values: (100: 100lvh)
    ),
    "min-large-viewport-height": (
      property: min-height,
      class: min-lvh,
      values: (100: 100lvh)
    )
  )
);
```

This adds `.svh-100`, `.min-svh-100`, `.lvh-100`, and `.min-lvh-100`.

<Callout>
Every browser that Bootstrap 6 supports has `dvh`, `svh`, and `lvh`. Read [Browsers & devices]([[docsref:/getting-started/browsers-devices]]) for the full support policy.
</Callout>

We ship the same utilities for the width axis, `dvw-100` and `min-dvw-100`. Read [dynamic viewport width]([[docsref:/utilities/width#dynamic-viewport-width]]) to see how the width units differ.

## CSS

### Sass utilities API

Height utilities are declared in our utilities API in `scss/_utilities.scss`. [Learn how to use the utilities API.]([[docsref:/utilities/api#using-the-api]])

<ScssDocs name="utils-height" file="scss/_utilities.scss" />
