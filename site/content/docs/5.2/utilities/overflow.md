---
layout: docs
title: Overflow
description: Use these shorthand utilities for quickly configuring how content overflows an element.
group: utilities
toc: true
---

## Overflow

Adjust the `overflow` property on the fly with four default values and classes. These classes are not responsive by default.

<div class="bd-example d-md-flex">
  <div class="overflow-auto p-3 mb-3 mb-md-0 me-md-3 bg-light" style="max-width: 260px; max-height: 100px;">
    This is an example of using <code>.overflow-auto</code> on an element with set width and height dimensions. By design, this content will vertically scroll.
  </div>
  <div class="overflow-hidden p-3 mb-3 mb-md-0 me-md-3 bg-light" style="max-width: 260px; max-height: 100px;">
    This is an example of using <code>.overflow-hidden</code> on an element with set width and height dimensions.
  </div>
  <div class="overflow-visible p-3 mb-3 mb-md-0 me-md-3 bg-light" style="max-width: 260px; max-height: 100px;">
    This is an example of using <code>.overflow-visible</code> on an element with set width and height dimensions.
  </div>
  <div class="overflow-scroll p-3 bg-light" style="max-width: 260px; max-height: 100px;">
    This is an example of using <code>.overflow-scroll</code> on an element with set width and height dimensions.
  </div>
</div>

```html
<div class="overflow-auto">...</div>
<div class="overflow-hidden">...</div>
<div class="overflow-visible">...</div>
<div class="overflow-scroll">...</div>
```

### `overflow-x`

Adjust the `overflow-x` property to affect the overflow of content horizontally.

<div class="bd-example d-md-flex">
  <div class="overflow-x-auto p-3 mb-3 mb-md-0 me-md-3 bg-light w-100" style="max-width: 200px; max-height: 100px; white-space: nowrap;">
    <div><code>.overflow-x-auto</code> example on an element</div>
    <div> with set width and height dimensions.</div>
  </div>
  <div class="overflow-x-hidden p-3 mb-3 mb-md-0 me-md-3 bg-light w-100" style="max-width: 200px; max-height: 100px;white-space: nowrap;">
    <div><code>.overflow-x-hidden</code> example</div>
    <div>on an element with set width and height dimensions.</div>
  </div>
  <div class="overflow-x-visible p-3 mb-3 mb-md-0 me-md-3 bg-light w-100" style="max-width: 200px; max-height: 100px;white-space: nowrap;">
    <div><code>.overflow-x-visible</code> example </div>
    <div>on an element with set width and height dimensions.</div>
  </div>
  <div class="overflow-x-scroll p-3 bg-light w-100" style="max-width: 200px; max-height: 100px;white-space: nowrap;">
    <div><code>.overflow-x-scroll</code> example on an element</div>
    <div> with set width and height dimensions.</div>
  </div>
</div>

```html
<div class="overflow-x-auto">...</div>
<div class="overflow-x-hidden">...</div>
<div class="overflow-x-visible">...</div>
<div class="overflow-x-scroll">...</div>
```

### `overflow-y`

Adjust the `overflow-y` property to affect the overflow of content vertically.

<div class="bd-example d-md-flex">
  <div class="overflow-y-auto p-3 mb-3 mb-md-0 me-md-3 bg-light w-100" style="max-width: 200px; max-height: 100px;">
    <code>.overflow-y-auto</code> example on an element with set width and height dimensions.
  </div>
  <div class="overflow-y-hidden p-3 mb-3 mb-md-0 me-md-3 bg-light w-100" style="max-width: 200px; max-height: 100px;">
    <code>.overflow-y-hidden</code> example on an element with set width and height dimensions.
  </div>
  <div class="overflow-y-visible p-3 mb-3 mb-md-0 me-md-3 bg-light w-100" style="max-width: 200px; max-height: 100px;">
    <code>.overflow-y-visible</code> example on an element with set width and height dimensions.
  </div>
  <div class="overflow-y-scroll p-3 bg-light w-100" style="max-width: 200px; max-height: 100px;">
    <code>.overflow-y-scroll</code> example on an element with set width and height dimensions.
  </div>
</div>

```html
<div class="overflow-y-auto">...</div>
<div class="overflow-y-hidden">...</div>
<div class="overflow-y-visible">...</div>
<div class="overflow-y-scroll">...</div>
```

Using Sass variables, you may customize the overflow utilities by changing the `$overflows` variable in `_variables.scss`.

## Sass

### Utilities API

Overflow utilities are declared in our utilities API in `scss/_utilities.scss`. [Learn how to use the utilities API.]({{< docsref "/utilities/api#using-the-api" >}})

{{< scss-docs name="utils-overflow" file="scss/_utilities.scss" >}}
