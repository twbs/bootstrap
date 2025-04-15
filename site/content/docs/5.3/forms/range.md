---
layout: docs
title: Range
description: Use our custom range inputs for consistent cross-browser styling and built-in customization.
group: forms
toc: true
extra_js:
  - src: "/docs/5.3/assets/js/form-range.js"
    async: false
---

## Overview

Create custom `<input type="range">` controls with `.form-range`. The track (the background) and thumb (the value) are both styled to appear the same across browsers. As only Firefox supports "filling" their track from the left or right of the thumb as a means to visually indicate progress, we do not currently support it.

However, if you really want to implement it, there's a way to do it with JavaScript. Please see our [JavaScript section](#via-javascript).

{{< example >}}
<label for="customRange1" class="form-label">Example range</label>
<input type="range" class="form-range" id="customRange1">
{{< /example >}}

## Disabled

Add the `disabled` boolean attribute on an input to give it a grayed out appearance, remove pointer events, and prevent focusing.

{{< example >}}
<label for="disabledRange" class="form-label">Disabled range</label>
<input type="range" class="form-range" id="disabledRange" disabled>
{{< /example >}}

## Min and max

Range inputs have implicit values for `min` and `max`—`0` and `100`, respectively. You may specify new values for those using the `min` and `max` attributes.

{{< example >}}
<label for="customRange2" class="form-label">Example range</label>
<input type="range" class="form-range" min="0" max="5" id="customRange2">
{{< /example >}}

## Steps

By default, range inputs "snap" to integer values. To change this, you can specify a `step` value. In the example below, we double the number of steps by using `step="0.5"`.

{{< example >}}
<label for="customRange3" class="form-label">Example range</label>
<input type="range" class="form-range" min="0" max="5" step="0.5" id="customRange3">
{{< /example >}}

## Via JavaScript

Range is not implemented with JavaScript in Bootstrap. Here is a way to do so to have the same behavior on all supported browsers.

Build a range input with `min` and `max` attributes.

{{< example class="bd-example-range" >}}
<label for="jsRange" class="form-label">Example range</label>
<input type="range" class="form-range" id="jsRange" min="0" max="100">
{{< /example >}}

The input track backgrounds must be initialized in a different way. Please note that `--value` is what does the trick so affordable.

```scss
.form-range::-moz-range-track {
  background: linear-gradient(to right, $blue-200 0%, $blue-200 var(--value, 0%), $gray-300 var(--value, 0%), $gray-300 100%);
}

.form-range::-webkit-slider-runnable-track {
  background: linear-gradient(to right, $blue-200 0%, $blue-200 var(--value, 0%), $gray-300 var(--value, 0%), $gray-300 100%);
}
```

Introduce event listeners on the input to make it dynamic by changing the `--value`.

```js
// Getting all the range inputs
const ranges = document.querySelectorAll('input[type=range]')

// Adding a listener to every input in order to have a dynamic progress
for (const range of ranges) {
  range.addEventListener('input', () => {
    const value = (range.value - range.min) / (range.max - range.min) * 100
    range.style.setProperty('--value', `${value}%`)
  })
}

document.addEventListener('DOMContentLoaded', () => {
  for (const range of ranges) {
    const value = (range.value - range.min) / (range.max - range.min) * 100
    range.style.setProperty('--value', `${value}%`)
  }
})
```

## CSS

### Sass variables

{{< scss-docs name="form-range-variables" file="scss/_variables.scss" >}}
