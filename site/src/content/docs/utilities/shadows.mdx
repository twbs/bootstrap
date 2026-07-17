---
title: Shadows
description: Add or remove shadows to elements with box-shadow utilities.
toc: true
utility:
  - shadow
---

## Examples

While shadows on components are enabled by default via `$enable-shadows`, you can always manage shadows with our `box-shadow` utility classes. Includes support for `.shadow-none` and several sizes (which have associated variables to match).

For a more modern, smoother look, shadows are "layered" box-shadow declarations. More specifically:

- Each shadow size token contains multiple `box-shadow` values that provide a more natural falloff.
- Every layer derives its color from a global `--shadow-color` token by default, which `.shadow-{color}` utilities can override on a single element—without re-tinting any nested shadows—for quick, one-off accents.
- Similarly, a global `--shadow-strength` token (`1` for light mode, `2.4` for dark mode) deepens every shadow and doubles as a knob to scale all shadows at once.

<Example class="overflow-hidden vstack gap-7 lg:gap-9 p-7 lg:p-9 bg-1" code={`<div class="shadow-none p-3 bg-body rounded">No shadow</div>
<div class="shadow-sm p-3 bg-body rounded">Small shadow</div>
<div class="shadow p-3 bg-body rounded">Regular shadow</div>
<div class="shadow-lg p-3 bg-body rounded">Larger shadow</div>
<div class="shadow-xl p-3 bg-body rounded">Extra large shadow</div>`} />

### Shadow color

Change the color of a shadow with `.shadow-{color}` utilities for any theme color, plus `.shadow-current` (matches the element’s `color`), `.shadow-black`, and `.shadow-white`. Pair a color utility with a size utility. Colored shadows are intentionally subtle—use a larger size like `.shadow-xl` for a more visible tint.

<Callout>
The `--bs-sc` variable is registered with `@property` as non-inheriting (`inherits: false`), so shadow color utilities are scoped to the element they’re applied to and never cascade into nested elements or components. This is why `--bs-sc` is deliberately separate from the inheriting `--bs-shadow-color` design token that shadows resolve their default color from.
</Callout>

<Example class="overflow-hidden hstack flex-wrap gap-7 lg:gap-9 p-7 lg:p-9 bg-1" code={`<div class="shadow-xl shadow-primary p-3 bg-body rounded">Primary</div>
<div class="shadow-xl shadow-success p-3 bg-body rounded">Success</div>
<div class="shadow-xl shadow-danger p-3 bg-body rounded">Danger</div>
<div class="shadow-xl shadow-black p-3 bg-body rounded">Black</div>`} />

### Nested elements

Because shadow color and opacity utilities set the non-inheriting `--bs-sc` and `--bs-so` variables, a parent’s `.shadow-{color}` or `.shadow-opacity-*` doesn’t affect the shadows of nested elements. Below, the parent uses `.shadow-primary` while the nested `.shadow-xl` keeps the default shadow color.

<Example class="overflow-hidden p-7 lg:p-9 bg-1" code={`<div class="shadow-xl shadow-primary p-4 bg-body rounded-7">
    Parent with .shadow-primary
    <div class="shadow-xl p-3 mt-3 bg-body rounded-3">
      Nested .shadow-xl keeps the default color.
    </div>
  </div>`} />

### Shadow opacity

Scale a shadow’s strength with `.shadow-opacity-{10-100}` utilities. Opacity is treated as a midpoint, not a ceiling: the default shadow matches `.shadow-opacity-50`, so lower values lighten it while higher values—up to `.shadow-opacity-100`—deepen it. This works with any size or color utility. Like `--bs-sc`, `--bs-so` is scoped to the element, so pair it with a size or color utility on the same element rather than expecting it to inherit.

<Example class="overflow-hidden hstack flex-wrap gap-7 lg:gap-9 p-7 lg:p-9 bg-1" code={`<div class="shadow-xl shadow-opacity-20 p-3 bg-1 rounded">20%</div>
<div class="shadow-xl shadow-opacity-50 p-3 bg-body rounded">50% (default)</div>
<div class="shadow-xl shadow-opacity-100 p-3 bg-body rounded">100%</div>`} />

Even works with custom shadow colors:

<Example class="overflow-hidden hstack flex-wrap gap-7 lg:gap-9 p-7 lg:p-9 bg-1" code={`<div class="shadow-xl shadow-opacity-20 shadow-primary p-3 bg-body rounded">20%</div>
<div class="shadow-xl shadow-opacity-50 shadow-primary p-3 bg-body rounded">50% (default)</div>
<div class="shadow-xl shadow-opacity-100 shadow-primary p-3 bg-body rounded">100%</div>`} />

## CSS

### Sass variables

<ScssDocs name="root-box-shadow-variables" file="scss/_root.scss" />

<ScssDocs name="box-shadow-variables" file="scss/_config.scss" />

### Sass utilities API

Shadow utilities are declared in our utilities API in `scss/_utilities.scss`. [Learn how to use the utilities API.]([[docsref:/utilities/api#using-the-api]])

<ScssDocs name="utils-shadow" file="scss/_utilities.scss" />

<ScssDocs name="utils-shadow-color" file="scss/_utilities.scss" />

<ScssDocs name="utils-shadow-opacity" file="scss/_utilities.scss" />
