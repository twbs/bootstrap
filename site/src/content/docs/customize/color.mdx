---
title: Color
description: Bootstrap is supported by an extensive color system that powers our revamped theme, components, and color modes. This enables more comprehensive customization and extension for any project.
toc: true
---

import { getData } from '@libs/data'
import { getSequence } from '@libs/utils'

export const additionalColors = [
  'white',
  'black',
]

## Colors

There are 13 shades of 16 colors in Bootstrap’s new color system, meaning we have 208 colors to work with when using Bootstrap.

All Bootstrap colors are available as Sass variables and a Sass map in `scss/_config.scss` file. To avoid increased file sizes, we don’t create text or background color classes for each of these variables. Instead, we choose a subset of these colors for a [theme palette]([[docsref:/customize/theme]]).

Be sure to monitor contrast ratios as you customize colors. As shown below, we’ve added three contrast ratios to each of the main colors—one for the swatch’s current colors, one for against white, and one for against black.

<div class="grid bd-colors-grid">
  {getData('colors').map((color) => {
     return (
       <div class="d-contents grid-cols-fill">
         <h5 class="d-block text-capitalize grid-cols-fill">{color.name.replace('-', ' ')}</h5>

         {["025", "050", ...getSequence(100, 900, 100), 950, 975].map((value) => {
           return (
             <div class="mb-3 font-monospace small">
               <Swatch bg={`${color.name}-${value}`} size="medium" />
               <div class="text-center fg-3">{value}</div>
             </div>
           )
         })}
       </div>
     )
   })}

   <div class="d-contents grid-cols-fill">
    <h5 class="d-block text-capitalize grid-cols-fill">Additional</h5>
    {additionalColors.map((color) => {
      return (
        <div class="mb-3 font-monospace small">
          <Swatch bg={`${color}`} size="medium" />
          <div class="text-center fg-3">{color}</div>
        </div>
      )
    })}
   </div>
</div>

## How it works

Bootstrap generates its colors from a series of Sass variables and a Sass map called `$colors` in `scss/_colors.scss`. These are our base colors—blue, indigo, violet, etc—and are used to generate the tints and shades of each color you see above. You can customize these colors by adding or removing colors from the `$colors` map.

### Default colors

Below is our default list of colors. Colors are unique in Bootstrap in that they’re still Sass variables by default. In addition, they’re in `oklch()` format, which is a modern color space that is designed to be perceptually uniform.

<ScssDocs name="colors-list" file="scss/_colors.scss" />

The above colors are then turned into a Sass map called `$colors`.

<ScssDocs name="colors-map" file="scss/_colors.scss" />

### Color mixing

As mentioned already, we generate lighter (tints) and darker (shades) versions of each color using the `color-mix()` function. This allows us to quickly and easily generate a full scale of colors.

The tint and shade stops, the `color-mix()` color space, and the mix colors are all customizable.

<ScssDocs name="color-mix-options" file="scss/_colors.scss" />

Those options and the `$colors` map are used to generate a `$color-tokens` map, which is output as CSS custom properties on `:root`.

<ScssDocs name="color-tokens" file="scss/_colors.scss" />

In practice, our CSS variables that get output from this looks like this:

```scss
// Example generated custom properties from _colors.scss
--bs-blue-025: color-mix(in lab, var(--bs-white) 94%, oklch(60% 0.24 240));
--bs-blue-050: color-mix(in lab, var(--bs-white) 90%, oklch(60% 0.24 240));
--bs-blue-100: color-mix(in lab, var(--bs-white) 80%, oklch(60% 0.24 240));
// ...
--bs-blue-500: oklch(60% 0.24 240);
// ...
--bs-blue-900: color-mix(in lab, var(--bs-black) 64%, oklch(60% 0.24 240));
--bs-blue-975: color-mix(in lab, var(--bs-black) 88%, oklch(60% 0.24 240));
```

<Callout type="info">
We use CSS variables `var(--bs-white)` and `var(--bs-black)` to prevent LightningCSS from converting the real-time mixing into static `lab()` values. Unfortunately, this feature cannot be disabled in LightningCSS at this time.
</Callout>

## Customizing

You can customize the colors by adding or removing colors from the `$colors` map. You can also customize the tint and shade stops, the `color-mix()` color space, and the mix colors. Say you want to add another blue-gray color, like slate.

1. Create a new Sass variable for the new color, in `oklch()` format.
2. Add the new color to the `$colors` map.
3. Recompile source Sass to generate the new colors.

Here’s how that would look:

```scss
$slate: oklch(55% 0.07 260);

@use "bootstrap" as * with (
  $colors: (
    "slate": $slate,
  ),
);
```

To remove a color, set the value to `null`.

```scss
@use "bootstrap" as * with (
  $colors: (
    "pewter": null,
  ),
);
```

## From colors to theme

The `--bs-{color}-{stop}` tokens above are the raw palette. On their own they don’t style components—Bootstrap feeds a chosen subset of them into the **theme layer**, where they’re assigned semantic roles (background, foreground, border, and so on) and exposed as `.theme-*` classes that components read.

The full pipeline looks like this:

1. **`$colors`** (`scss/_colors.scss`) defines the base hues and generates the `--bs-{color}-{stop}` tokens (for example `--bs-blue-500`).
2. **`$theme-colors`** (`scss/_theme.scss`) maps semantic names (`primary`, `success`, `danger`, and so on) onto those tokens one role at a time (`base`, `fg`, `bg`, `bg-subtle`, `border`, `contrast`, …), most wrapped in `light-dark()` so they adapt to the color mode.
3. Those roles are emitted as **`--bs-{name}-{role}`** tokens (for example `--bs-primary-bg`).
4. The **`.theme-{name}`** classes remap them onto generic **`--bs-theme-{role}`** tokens (for example `.theme-primary` sets `--bs-theme-bg: var(--bs-primary-bg)`).
5. **Components** read the `--bs-theme-*` tokens, so a single `.theme-primary` class restyles any theme-aware component.

The theme layer—semantic tokens, `.theme-*` classes, layer colors, and color modes—is documented in full on the [Theme page]([[docsref:/customize/theme]]). The rest of this page stays on the base color layer.

## Generating utilities

Bootstrap doesn’t ship `color` and `background-color` utilities for every palette token—that would add a lot of rarely used CSS. If you need a few specific shades as utilities, add a utility group through the [utilities API]([[docsref:/utilities/api]]). Configure the `$utilities` map when you import `utilities`, then load `utilities/api` to emit the CSS. Each value points at a generated color token (`--bs-{color}-{stop}`):

```scss
@use "../node_modules/bootstrap/scss/utilities" with (
  $utilities: (
    "fg-palette": (
      property: color,
      class: fg,
      values: (
        "purple-300": var(--bs-purple-300),
        "purple-500": var(--bs-purple-500),
        "purple-700": var(--bs-purple-700),
      ),
    ),
  )
);
@use "../node_modules/bootstrap/scss/utilities/api";
```

This adds `.fg-purple-300`, `.fg-purple-500`, and `.fg-purple-700`. Bootstrap merges your entry on top of the default `$utilities` map, so the built-in utilities are left untouched. List as many shades as you need, and set `property: background-color` with `class: bg` to generate backgrounds instead. (The color tokens themselves come from your main Bootstrap import; this snippet only emits the extra utility classes.)
