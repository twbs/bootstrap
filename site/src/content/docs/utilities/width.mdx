---
title: Width
description: Use width utilities to control the width of elements with responsive width classes.
toc: true
mdn: https://developer.mozilla.org/en-US/docs/Web/CSS/width
utility:
  - width
  - max-width
  - min-width
  - viewport-width
  - min-viewport-width
  - dynamic-viewport-width
  - min-dynamic-viewport-width
---

Use width utilities to set the width of elements. Width utilities are generated from the utility API and include support for a preset scale, percentage values, intrinsic sizing keywords, and viewport units.

## Width

Set width using `.w-{size}` utilities for any size from `1` to `12`. These classes are generated from the utility API based on the `$sizes` map in `_config.scss`. Each number is a multiple of the `$spacer` variable, which defaults to `1rem`.

<Example
  class="bd-example-flex"
  code={`<div class="w-12 p-3">Width 12</div>`}
  customMarkup={`<div class="d-flex flex-column gap-3">
    <div class="w-1">…</div>
    <div class="w-2">…</div>
    <div class="w-3">…</div>
    <div class="w-4">…</div>
    <div class="w-5">…</div>
    <div class="w-6">…</div>
    <div class="w-7">…</div>
    <div class="w-8">…</div>
    <div class="w-9">…</div>
    <div class="w-10">…</div>
    <div class="w-11">…</div>
    <div class="w-12">…</div>
  </div>`} />

## Relative width

Set width relative to the parent element using percentage-based utilities. Includes support for `25%`, `50%`, `75%`, `100%`, and `auto` by default.

<Example class="bd-example-flex" code={`<div class="w-25 p-3">Width 25%</div>
<div class="w-50 p-3">Width 50%</div>
<div class="w-75 p-3">Width 75%</div>
<div class="w-100 p-3">Width 100%</div>
<div class="w-auto p-3">Width auto</div>`} />

## Intrinsic sizing

Use intrinsic sizing keywords to set width based on content.

<Example class="bd-example-flex" code={`<div class="w-min p-3">Width min-content</div>
<div class="w-max p-3">Width max-content</div>
<div class="w-fit p-3">Width fit-content</div>`} />

## Max width

Set maximum width using `max-width` utilities.

<Example class="bd-example-flex" code={`<div style="width: 50%;">
    <div class="max-w-100" style="width: 200%;">Max-width 100%</div>
  </div>`} />

## Min width

Set minimum width using `min-width` utilities.

<Example class="bd-example-flex" code={`<div class="min-w-0 p-3" style="overflow: hidden;">
    <div style="width: 200px;">This content is wider than the min-width: 0 container</div>
  </div>
<div class="min-w-100 p-3">Min-width 100%</div>`} />

## Viewport width

Set width relative to the viewport using viewport units.

```html
<div class="vw-100">Width 100vw</div>
<div class="min-vw-100">Min-width 100vw</div>
```

<Callout type="warning">
**Beware of the viewport width!** CSS sizes `vw` as if the scrollbar does not exist. On a desktop browser that shows a classic scrollbar, `vw-100` is wider than the content area. The page then scrolls sideways. Use `w-100` to fill the parent element instead. See [dynamic viewport width](#dynamic-viewport-width).
</Callout>

## Dynamic viewport width

The `vw` unit measures the large viewport width. The browser calculates that width as if every retractable browser interface is retracted. The value stays the same while the user scrolls.

The `dvw` unit measures the viewport width that the user sees now. The browser updates the value when it expands or retracts a browser interface. Use `dvw-100` and `min-dvw-100` when a browser interface changes the viewport width.

```html
<div class="dvw-100">Width 100dvw</div>
<div class="min-dvw-100">Min-width 100dvw</div>
```

Most browsers put the retractable interface at the top and the bottom of the screen. That interface changes the viewport height, not the viewport width. On these browsers, `dvw` and `vw` give you the same value. The `dvw` unit is therefore less useful than [`dvh`]([[docsref:/utilities/height#dynamic-viewport-height]]). We ship it so that the width utilities match the height utilities.

<Callout type="warning">
**`dvw` does not fix the scrollbar problem.** CSS sizes every viewport width unit as if the scrollbar does not exist. The `dvw` unit gets the same treatment as the `vw` unit. To make the units respect the scrollbar, set `overflow: scroll` or `scrollbar-gutter: stable` on the root element.
</Callout>

<Callout>
**Which unit do I use?** Use `w-100` for a full-width layout. It fills the parent element, so the page does not scroll sideways. Use `dvw` when a browser interface changes the viewport width. Use `vw` when you need a width that does not change while the user scrolls.
</Callout>

### Small and large viewport units

CSS gives you two more viewport width units:

- `svw` is the small viewport width. The browser calculates it as if every retractable browser interface is expanded.
- `lvw` is the large viewport width. The browser calculates it as if every retractable browser interface is retracted. Current browsers give `vw` the same value.

We do not ship utilities for `svw` and `lvw`, because most layouts need `w-100` or `dvw`. Add them with the [utilities API]([[docsref:/utilities/api#add-utilities]]):

```scss
// my-bootstrap.scss
@use "bootstrap/scss/bootstrap" with (
  $utilities: (
    "small-viewport-width": (
      property: width,
      class: svw,
      values: (100: 100svw)
    ),
    "min-small-viewport-width": (
      property: min-width,
      class: min-svw,
      values: (100: 100svw)
    ),
    "large-viewport-width": (
      property: width,
      class: lvw,
      values: (100: 100lvw)
    ),
    "min-large-viewport-width": (
      property: min-width,
      class: min-lvw,
      values: (100: 100lvw)
    )
  )
);
```

This adds `.svw-100`, `.min-svw-100`, `.lvw-100`, and `.min-lvw-100`.

<Callout>
Every browser that Bootstrap 6 supports has `dvw`, `svw`, and `lvw`. Read [Browsers & devices]([[docsref:/getting-started/browsers-devices]]) for the full support policy.
</Callout>

## CSS

### Sass utilities API

Width utilities are declared in our utilities API in `scss/_utilities.scss`. [Learn how to use the utilities API.]([[docsref:/utilities/api#using-the-api]])

<ScssDocs name="utils-width" file="scss/_utilities.scss" />
