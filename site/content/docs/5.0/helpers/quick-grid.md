---
layout: docs
title: Quick grid
description: Helpers that build on top of our CSS Grid utilities to make component layout faster and easier than ever.
group: helpers
toc: true
---

## How it works

The quick grid helper utilizes CSS Grid layout and some local CSS custom properties to quickly and efficiently configure the layout of set of elements.

{{< scss-docs name="quick-grid" file="scss/helpers/_quick-grid.scss" >}}

We set the `display` to engage the CSS Grid, specify a default `--columns` count of `1` for easy vertical stacking, and provide a column template that uses the `--columns` to equally layout any number of columns.

When paired with `.gap-*` utilities, you can easily adjust the `gap` between elements.

## Examples

### Vertical

Create a single column of stacked items.

{{< example >}}
<div class="quick-grid gap-2">
  <div class="bg-light border">First item</div>
  <div class="bg-light border">Second item</div>
  <div class="bg-light border">Third item</div>
</div>
{{< /example >}}

And the same approach with `<button>` elements.

{{< example >}}
<div class="quick-grid gap-2">
  <button class="btn btn-primary">Button 1</button>
  <button class="btn btn-primary">Button 2</button>
  <button class="btn btn-primary">Button 3</button>
</div>
{{< /example >}}

### Horizontal

Quickly turn a vertical stack into a horizontal stack by adding increasing the default `--columns` to any number.

{{< example >}}
<div class="quick-grid gap-2" style="--columns: 3">
  <div class="bg-light border">First item</div>
  <div class="bg-light border">Second item</div>
  <div class="bg-light border">Third item</div>
</div>
{{< /example >}}

And once again, the same but with `<button>` elements:

{{< example >}}
<div class="quick-grid gap-2" style="--columns: 3">
  <button class="btn btn-primary">Button 1</button>
  <button class="btn btn-primary">Button 2</button>
  <button class="btn btn-primary">Button 3</button>
</div>
{{< /example >}}

When you have a `--columns` value higher than the number of elements, they'll only take up their fraction of the available space.

{{< example >}}
<div class="quick-grid gap-2" style="--columns: 6">
  <button class="btn btn-primary">Button 1</button>
  <button class="btn btn-primary">Button 2</button>
  <button class="btn btn-primary">Button 3</button>
</div>
{{< /example >}}
