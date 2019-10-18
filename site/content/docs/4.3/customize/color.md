---
layout: docs
title: Color
description: Learn about and customize the color system that supports the entire toolkit.
group: customize
toc: true
---

Many of Bootstrap's various components and utilities are built through a series of colors defined in a Sass map. This map can be looped over in Sass to quickly generate a series of rulesets.

## All colors

All colors available in Bootstrap are available as Sass variables and a Sass map in `scss/_variables.scss` file. To avoid increased file sizes, we do not create classes for each of these variables.

Sass cannot programmatically generate variables, so we must manually create them ourselves. We specify the midpoint value (`500`) and use custom color functions to tint (lighten) or shade (darken) our colors via Sass's `mix()` color function. Using `mix()` is not the same as `lighten()` and `darken()`—the former blends the specified color with white or black, while the latter only adjusts the lightness value of each color. The result is a much more complete suite of colors, as [shown in this CodePen demo](https://codepen.io/emdeoh/pen/zYOQOPB).

Our `tint-color()` and `shade-color()` functions use `mix()` alongside our `$theme-color-interval` variable, which specifies a stepped percentage value for each mixed color we need. See the `scss/_functions.scss` and `scss/_variables.scss` files for the full source code.

<div class="row">
  {{< theme-colors.inline >}}
  {{- range $color := $.Site.Data.colors }}
    {{- if (and (not (eq $color.name "white")) (not (eq $color.name "gray")) (not (eq $color.name "gray-dark"))) }}
    <div class="col-md-4 mb-3 font-monospace">
      <div class="p-3 mb-2 swatch-{{ $color.name }}">
        <strong class="d-block">${{ $color.name }}</strong>
        {{ $color.hex }}
      </div>
      {{ range (seq 100 100 900) }}
      <div class="p-3 bd-{{ $color.name }}-{{ . }}">${{ $color.name }}-{{ . }}</div>
      {{ end }}
    </div>
    {{ end -}}
  {{ end -}}
  {{< /theme-colors.inline >}}
</div>

Here's how you can use these in your Sass:

{{< highlight scss >}}
.alpha { color: $purple; }
.beta {
  color: $yellow-300;
  background-color: $indigo-900;
}
{{< /highlight >}}

[Color utility classes]({{< docsref "/utilities/colors" >}}) are also available for setting `color` and `background-color`.

## Theme colors

We use a subset of all colors to create a smaller color palette for generating color schemes, also available as Sass variables and a Sass map in Bootstrap's `scss/_variables.scss` file.

<div class="row">
  {{< theme-colors.inline >}}
  {{- range (index $.Site.Data "theme-colors") }}
    <div class="col-md-4">
      <div class="p-3 mb-3 bg-{{ .name }} {{ if or (eq .name "light") (eq .name "warning") }}text-dark{{ else }}text-white{{ end }}">{{ .name | title }}</div>
    </div>
  {{ end -}}
  {{< /theme-colors.inline >}}
</div>

## Grays

An expansive set of gray variables and a Sass map in `scss/_variables.scss` for consistent shades of gray across your project. Note that these are "cool grays", which tend towards a subtle blue tone, rather than neutral grays.

<div class="row mb-3">
  <div class="col-md-4">
    {{< theme-colors.inline >}}
    {{- range $.Site.Data.grays }}
      <div class="p-3 swatch-{{ .name }}">{{ .name }}</div>
    {{ end -}}
  {{< /theme-colors.inline >}}
  </div>
</div>

Within `scss/_variables.scss`, you'll find Bootstrap's color variables and Sass map. Here's an example of the `$colors` Sass map:

{{< highlight scss >}}
$colors: (
  "blue": $blue,
  "indigo": $indigo,
  "purple": $purple,
  "pink": $pink,
  "red": $red,
  "orange": $orange,
  "yellow": $yellow,
  "green": $green,
  "teal": $teal,
  "cyan": $cyan,
  "white": $white,
  "gray": $gray-600,
  "gray-dark": $gray-800
) !default;
{{< /highlight >}}

Add, remove, or modify values within the map to update how they're used in many other components. Unfortunately at this time, not _every_ component utilizes this Sass map. Future updates will strive to improve upon this. Until then, plan on making use of the `${color}` variables and this Sass map.
