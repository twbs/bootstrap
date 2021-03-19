---
layout: docs
title: CSS variables
description: Use Bootstrap's CSS custom properties for fast and forward-looking design and development.
group: customize
toc: true
---

Bootstrap includes a slew of [CSS custom properties (variables)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) in its compiled CSS for improved on-the-fly customization. These provide easy access to commonly used values like our theme colors, breakpoints, and primary font stacks when working in your browser's inspector, a code sandbox, or general prototyping. All without recompiling source Sass files.

**All our custom properties are prefixed with `bs-`** to avoid conflicts with third party CSS.

## Root variables

Here are the variables we include (note that the `:root` is required) that can be accessed anywhere Bootstrap's CSS is loaded. They're located in our `_root.scss` file and included in our compiled dist files.

```css
{{< root.inline >}}
{{- $css := readFile "dist/css/bootstrap.css" -}}
{{- $match := findRE ":root {([^}]*)}" $css 1 -}}

{{- if (eq (len $match) 0) -}}
{{- errorf "Got no matches for :root in %q!" $.Page.Path -}}
{{- end -}}

{{- index $match 0 -}}

{{< /root.inline >}}
```

## Component variables

We're also beginning to make use of custom properties as local variables for various components. This way we can reduce our compiled CSS, ensure styles aren't inherited in places like nested tables, and allow some basic restyling and extending of Bootstrap components after Sass compilation.

Have a look at our table documentation for some [insight into how we're using CSS variables]({{< docsref "/content/tables#how-do-the-variants-and-accented-tables-work" >}}).

We're also using CSS variables across our grids—primarily for gutters—with more component usage coming in the future.

## Examples

CSS variables offer similar flexibility to Sass's variables, but without the need for compilation before being served to the browser. For example, here we're resetting our page's font and link styles with CSS variables.

### Basics

Use a CSS variable where you would typically place a normal value, like fonts and colors.

```css
body {
  font: 1rem/1.5 var(--bs-font-sans-serif);
}
a {
  color: var(--bs-blue);
}
```

### RGB colors

While our colors are defined as hex values, we also include RGB values as additional CSS variables ending in `-rgb`. For example, we have `--bs-blue` and `--bs-blue-rgb`. This allows you to create more dynamic utilities and customizations. Using the regular CSS variables, you can create a custom `.text-blue` utility.

<div class="bd-example">
  <style>
  .text-blue {
    color: var(--bs-blue);
  }
  </style>
  <span class="text-blue">Custom blue text</span>
</div>

```css
.text-blue {
  color: var(--bs-blue);
}
```

But you can also create your own utilities that interact with one another, like using the `-rgb` variables and custom opacities to create translucent text. Let's expand on the above example:

<div class="bd-example bd-example-multiple-langs">
  <style>
  .text-blue2 { color: rgba(var(--bs-blue-rgb), var(--bs-color-opacity, 1)); }
  .text-opacity-100 { --bs-color-opacity: 1; }
  .text-opacity-75 { --bs-color-opacity: .75; }
  .text-opacity-50 { --bs-color-opacity: .5; }
  .text-opacity-25 { --bs-color-opacity: .25; }
  </style>
  <div class="text-blue2 text-opacity-100">Custom blue text at 100% opacity</div>
  <div class="text-blue2 text-opacity-75">Custom blue text at 75% opacity</div>
  <div class="text-blue2 text-opacity-50">Custom blue text at 50% opacity</div>
  <div class="text-blue2 text-opacity-25">Custom blue text at 25% opacity</div>
</div>

```css
.text-blue { color: rgba(var(--bs-blue-rgb), var(--bs-color-opacity, 1)); }

.text-opacity-100 { --bs-color-opacity: 1; }
.text-opacity-75 { --bs-color-opacity: .75; }
.text-opacity-50 { --bs-color-opacity: .5; }
.text-opacity-25 { --bs-color-opacity: .25; }
```

```html
<div class="text-blue text-opacity-50">Custom blue text at 50% opacity</div>
```

This allows you to create some powerful customizations with little overhead.

## Grid breakpoints

While we include our grid breakpoints as variables (except for `xs`), but be aware that CSS variables do not work in media queries. This is by design in the CSS spec for variables, but may change in coming years with support for `env()` variables. Check out [this Stack Overflow answer](https://stackoverflow.com/a/47212942) for some helpful links.
