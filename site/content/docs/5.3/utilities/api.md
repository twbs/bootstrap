---
layout: docs
title: Utility API
description: The utility API is a Sass-based tool to generate utility classes.
group: utilities
aliases: "/docs/5.3/utilities/"
toc: true
---

Bootstrap utilities are generated with our utility API and can be used to modify or extend our default set of utility classes via Sass. Our utility API is based on a series of Sass maps and functions for generating families of classes with various options. If you're unfamiliar with Sass maps, read up on the [official Sass docs](https://sass-lang.com/documentation/values/maps) to get started.

The `$utilities` map contains all our utilities and is later merged with your custom `$utilities` map, if present. The utility map contains a keyed list of utility groups which accept the following options:

{{< bs-table "table table-utilities" >}}
| Option                                         | Type         | Default&nbsp;value | Description                                                                                                                                                                                                                                          |
| ---------------------------------------------- | ------------ | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`property`](#property)                        | **Required** | –                  | Name of the property, this can be a string or an array of strings (e.g., horizontal paddings or margins).                                                                                                                                            |
| [`values`](#values)                            | **Required** | –                  | List of values, or a map if you don't want the class name to be the same as the value. If `null` is used as map key, `class` is not prepended to the class name.                                                                                     |
| [`class`](#class)                              | Optional     | null               | Name of the generated class. If not provided and `property` is an array of strings, `class` will default to the first element of the `property` array. If not provided and `property` is a string, the `values` keys are used for the `class` names. |
| [`css-var`](#css-variable-utilities)           | Optional     | `false`            | Boolean to generate CSS variables instead of CSS rules.                                                                                                                                                                                              |
| [`css-variable-name`](#css-variable-utilities) | Optional     | null               | Custom un-prefixed name for the CSS variable inside the ruleset.                                                                                                                                                                                     |
| [`local-vars`](#local-css-variables)           | Optional     | null               | Map of local CSS variables to generate in addition to the CSS rules.                                                                                                                                                                                 |
| [`state`](#states)                             | Optional     | null               | List of pseudo-class variants (e.g., `:hover` or `:focus`) to generate.                                                                                                                                                                              |
| [`responsive`](#responsive)                    | Optional     | `false`            | Boolean indicating if responsive classes should be generated.                                                                                                                                                                                        |
| `rfs`                                          | Optional     | `false`            | Boolean to enable [fluid rescaling with RFS]({{< docsref "/getting-started/rfs" >}}).                                                                                                                                                                |
| [`print`](#print)                              | Optional     | `false`            | Boolean indicating if print classes need to be generated.                                                                                                                                                                                            |
| `rtl`                                          | Optional     | `true`             | Boolean indicating if utility should be kept in RTL.                                                                                                                                                                                                 |
{{< /bs-table >}}

## API explained

All utility variables are added to the `$utilities` variable within our `_utilities.scss` stylesheet. Each group of utilities looks something like this:

```scss
$utilities: (
  "opacity": (
    property: opacity,
    values: (
      0: 0,
      25: .25,
      50: .5,
      75: .75,
      100: 1,
    )
  )
);
```

Which outputs the following:

```css
.opacity-0 { opacity: 0; }
.opacity-25 { opacity: .25; }
.opacity-50 { opacity: .5; }
.opacity-75 { opacity: .75; }
.opacity-100 { opacity: 1; }
```

### Property

The required `property` key must be set for any utility, and it must contain a valid CSS property. This property is used in the generated utility's ruleset. When the `class` key is omitted, it also serves as the default class name. Consider the `text-decoration` utility:

```scss
$utilities: (
  "text-decoration": (
    property: text-decoration,
    values: none underline line-through
  )
);
```

Output:

```css
.text-decoration-none { text-decoration: none !important; }
.text-decoration-underline { text-decoration: underline !important; }
.text-decoration-line-through { text-decoration: line-through !important; }
```

### Values

Use the `values` key to specify which values for the specified `property` should be used in the generated class names and rules. Can be a list or map (set in the utilities or in a Sass variable).

As a list, like with [`text-decoration` utilities]({{< docsref "/utilities/text#text-decoration" >}}):

```scss
values: none underline line-through
```

As a map, like with [`opacity` utilities]({{< docsref "/utilities/opacity" >}}):

```scss
values: (
  0: 0,
  25: .25,
  50: .5,
  75: .75,
  100: 1,
)
```

As a Sass variable that sets the list or map, as in our [`position` utilities]({{< docsref "/utilities/position" >}}):

```scss
values: $position-values
```

### Class

Use the `class` option to change the class prefix used in the compiled CSS. For example, to change from `.opacity-*` to `.o-*`:

```scss
$utilities: (
  "opacity": (
    property: opacity,
    class: o,
    values: (
      0: 0,
      25: .25,
      50: .5,
      75: .75,
      100: 1,
    )
  )
);
```

Output:

```css
.o-0 { opacity: 0 !important; }
.o-25 { opacity: .25 !important; }
.o-50 { opacity: .5 !important; }
.o-75 { opacity: .75 !important; }
.o-100 { opacity: 1 !important; }
```

If `class: null`, generates classes for each of the `values` keys:

```scss
$utilities: (
  "visibility": (
    property: visibility,
    class: null,
    values: (
      visible: visible,
      invisible: hidden,
    )
  )
);
```

Output:

```css
.visible { visibility: visible !important; }
.invisible { visibility: hidden !important; }
```

### CSS variable utilities

Set the `css-var` boolean option to `true` and the API will generate local CSS variables for the given selector instead of the usual `property: value` rules. Add an optional `css-variable-name` to set a different CSS variable name than the class name.

Consider our `.text-opacity-*` utilities. If we add the `css-variable-name` option, we'll get a custom output.

```scss
$utilities: (
  "text-opacity": (
    css-var: true,
    css-variable-name: text-alpha,
    class: text-opacity,
    values: (
      25: .25,
      50: .5,
      75: .75,
      100: 1
    )
  ),
);
```

Output:

```css
.text-opacity-25 { --bs-text-alpha: .25; }
.text-opacity-50 { --bs-text-alpha: .5; }
.text-opacity-75 { --bs-text-alpha: .75; }
.text-opacity-100 { --bs-text-alpha: 1; }
```

### Local CSS variables

Use the `local-vars` option to specify a Sass map that will generate local CSS variables within the utility class's ruleset. Please note that it may require additional work to consume those local CSS variables in the generated CSS rules. For example, consider our `.bg-*` utilities:

```scss
$utilities: (
  "background-color": (
    property: background-color,
    class: bg,
    local-vars: (
      "bg-opacity": 1
    ),
    values: map-merge(
      $utilities-bg-colors,
      (
        "transparent": transparent
      )
    )
  )
);
```

Output:

```css
.bg-primary {
  --bs-bg-opacity: 1;
  background-color: rgba(var(--bs-primary-rgb), var(--bs-bg-opacity)) !important;
}
```

### States

Use the `state` option to generate pseudo-class variations. Example pseudo-classes are `:hover` and `:focus`. When a list of states are provided, classnames are created for that pseudo-class. For example, to change opacity on hover, add `state: hover` and you'll get `.opacity-hover:hover` in your compiled CSS.

Need multiple pseudo-classes? Use a space-separated list of states: `state: hover focus`.

```scss
$utilities: (
  "opacity": (
    property: opacity,
    class: opacity,
    state: hover,
    values: (
      0: 0,
      25: .25,
      50: .5,
      75: .75,
      100: 1,
    )
  )
);
```

Output:

```css
.opacity-0-hover:hover { opacity: 0 !important; }
.opacity-25-hover:hover { opacity: .25 !important; }
.opacity-50-hover:hover { opacity: .5 !important; }
.opacity-75-hover:hover { opacity: .75 !important; }
.opacity-100-hover:hover { opacity: 1 !important; }
```

### Responsive

Add the `responsive` boolean to generate responsive utilities (e.g., `.opacity-md-25`) across [all breakpoints]({{< docsref "/layout/breakpoints" >}}).

```scss
$utilities: (
  "opacity": (
    property: opacity,
    responsive: true,
    values: (
      0: 0,
      25: .25,
      50: .5,
      75: .75,
      100: 1,
    )
  )
);
```

Output:

```css
.opacity-0 { opacity: 0 !important; }
.opacity-25 { opacity: .25 !important; }
.opacity-50 { opacity: .5 !important; }
.opacity-75 { opacity: .75 !important; }
.opacity-100 { opacity: 1 !important; }

@media (min-width: 576px) {
  .opacity-sm-0 { opacity: 0 !important; }
  .opacity-sm-25 { opacity: .25 !important; }
  .opacity-sm-50 { opacity: .5 !important; }
  .opacity-sm-75 { opacity: .75 !important; }
  .opacity-sm-100 { opacity: 1 !important; }
}

@media (min-width: 768px) {
  .opacity-md-0 { opacity: 0 !important; }
  .opacity-md-25 { opacity: .25 !important; }
  .opacity-md-50 { opacity: .5 !important; }
  .opacity-md-75 { opacity: .75 !important; }
  .opacity-md-100 { opacity: 1 !important; }
}

@media (min-width: 992px) {
  .opacity-lg-0 { opacity: 0 !important; }
  .opacity-lg-25 { opacity: .25 !important; }
  .opacity-lg-50 { opacity: .5 !important; }
  .opacity-lg-75 { opacity: .75 !important; }
  .opacity-lg-100 { opacity: 1 !important; }
}

@media (min-width: 1200px) {
  .opacity-xl-0 { opacity: 0 !important; }
  .opacity-xl-25 { opacity: .25 !important; }
  .opacity-xl-50 { opacity: .5 !important; }
  .opacity-xl-75 { opacity: .75 !important; }
  .opacity-xl-100 { opacity: 1 !important; }
}

@media (min-width: 1400px) {
  .opacity-xxl-0 { opacity: 0 !important; }
  .opacity-xxl-25 { opacity: .25 !important; }
  .opacity-xxl-50 { opacity: .5 !important; }
  .opacity-xxl-75 { opacity: .75 !important; }
  .opacity-xxl-100 { opacity: 1 !important; }
}
```

### Print

Enabling the `print` option will **also** generate utility classes for print, which are only applied within the `@media print { ... }` media query.

```scss
$utilities: (
  "opacity": (
    property: opacity,
    print: true,
    values: (
      0: 0,
      25: .25,
      50: .5,
      75: .75,
      100: 1,
    )
  )
);
```

Output:

```css
.opacity-0 { opacity: 0 !important; }
.opacity-25 { opacity: .25 !important; }
.opacity-50 { opacity: .5 !important; }
.opacity-75 { opacity: .75 !important; }
.opacity-100 { opacity: 1 !important; }

@media print {
  .opacity-print-0 { opacity: 0 !important; }
  .opacity-print-25 { opacity: .25 !important; }
  .opacity-print-50 { opacity: .5 !important; }
  .opacity-print-75 { opacity: .75 !important; }
  .opacity-print-100 { opacity: 1 !important; }
}
```

## Importance

All utilities generated by the API include `!important` to ensure they override components and modifier classes as intended. You can toggle this setting globally with the `$enable-important-utilities` variable (defaults to `true`).

## Using the API

{{< callout success >}}
**New in v5.3.x!** We've added new mixins and functions to better help you use our utilities API. These replace our previous guidance of using Sass's built-in `map-merge()` function and add new functionality for [composing components with utilities](#get-values-and-options).
{{< /callout >}}

Now that you're familiar with how the utilities API works, you can use it to modify our default utilities and even add your own custom utilities. This can be done in three ways:

1. [Creating your own `$utilities` map](#add-or-override-utilities) that gets automatically merged with our default `$utilities` map.
2. [Modify our defaults using mixins](#modify-defaults) to add or remove utilities, update specific options, or modify utility values.
3. You can also use functions to [get specific utility values](#get-values-and-options) for your own use in your Sass.

### Add or override utilities

Add new keys to create your own utilities and override existing utilities by using the same key.

If your code declares a `$utilities` map before importing `bootstrap/scss/utilities`, it'll be merged with our default map. Add new keys to create your own utilities and override existing utilities by using the same key.

```scss
$utilities: (
  // Add a new cursor utility
  "cursor": (
    property: cursor,
    class: cursor,
    responsive: true,
    values: auto pointer grab,
  ),
  // Redefine the existing overflow utility
  "overflow": (
    responsive: true,
    property: overflow,
    values: visible hidden scroll auto,
  ),
);

@import 'bootstrap/scss/utilities';
@import 'bootstrap/scss/utilities/api';
```

### Modify defaults

After importing `bootstrap/scss/utilities`, you can use mixins to:

- Add or remove utilities
- Update utilities options, like `responsive`, `class`, `rtl`, etc
- Add, remove or update utility values

#### Add and remove utilities

The `utilities-add()` and `utilities-remove()` mixins let you add and remove utilities from the configuration. Adding an existing utility will completely override it.

```scss
@import "bootstrap/scss/functions";
@import "bootstrap/scss/variables";
@import "bootstrap/scss/variables-dark";
@import "bootstrap/scss/maps";
@import "bootstrap/scss/mixins";
@import "bootstrap/scss/utilities";

// Adds a new cursor utility
@include utilities-add(cursor, (
  property: cursor,
  class: cursor,
  responsive: true,
  values: auto pointer grab,
));

// Removes user-select and shadow
@include utilities-remove(user-select, shadow);

@import "bootstrap/scss/utilities/api";
```

#### Update utility options

The `utilities-set-option()` and `utilities-set-options()` mixins let you configure one or several options of a utility. `utilities-set-options()` will merge the new options with the existing ones by default, but you can provide a third `$merge: false` argument to completely override them.

If the utility does not exist, both mixins will create a new one.

```scss
@import "bootstrap/scss/functions";
@import "bootstrap/scss/variables";
@import "bootstrap/scss/variables-dark";
@import "bootstrap/scss/maps";
@import "bootstrap/scss/mixins";
@import "bootstrap/scss/utilities";

// Modify existing overflow utility to be responsive
@include utilities-set-option(overflow, responsive, true);

// Change an existing utility's class name
@include utilities-set-option(margin-start, class, ml);

// Make an existing utility responsive and override its values
@include utilities-set-options(line-height, (
  responsive: true,
  values: (
    1: 1,
    1.25: 1.25,
    1.5: 1.5
    inherit: inherit
  )
));

@import 'bootstrap/scss/utilities/api';
```

#### Update utility values

If you want to keep most of the default values for a utility and just add, remove, or update a few, replacing the `values` option can be overkill. Use the `utilities-add-values()` and `utilities-remove-values()` mixins to help you make more targeted updates.

```scss
@import "bootstrap/scss/functions";
@import "bootstrap/scss/variables";
@import "bootstrap/scss/variables-dark";
@import "bootstrap/scss/maps";
@import "bootstrap/scss/mixins";

@import 'bootstrap/scss/utilities';

// Adds new values to the flex utility
@include utilities-add-values(flex, (
  none: none,
  auto: auto
));

// Remove specific values from the flex-direction utility
@include utilities-remove-values(flex-direction, row-reverse, column-reverse);

@import 'bootstrap/scss/utilities/api';
```

### Get values and options

Use the `utilities-get-value()` function to get a specific value of a utility. This allows you to use and manipulate specific values from our utilities, like with Sass functions or `calc()`. It also lets you access values that can be modified by other utilities, like how `.bg-*`, `.text-*` and `.border-*` can be affected by `.bg-opacity-*`, `.text-opacity-*` or `.border-opacity-*` respectively.

```scss
@import "bootstrap/scss/functions";
@import "bootstrap/scss/variables";
@import "bootstrap/scss/variables-dark";
@import "bootstrap/scss/maps";
@import "bootstrap/scss/mixins";

@import "bootstrap/scss/utilities";

// The box will be configurable with the bg-opacity and text-opacity classes
.box {
  padding: map-get($spacers, 3);
  color: utilities-get-value(color, body);
  background: utilities-get-value(background-color, body);
  border: utilities-get-value(border, null);
}
```

This outputs the following:

```css
.box {
  padding: 1rem;
  color: rgba(var(--bs-body-color-rgb), var(--bs-text-opacity));
  background: rgba(var(--bs-body-bg-rgb), var(--bs-bg-opacity));
  border: var(--bs-border-width) var(--bs-border-style) var(--bs-border-color);
}
```

This is likely the function you'll use the most, but you can also:

- Access all the values of a utility with `utilities-get-values()`, which will always return a map to simplify their processing
- Access a specific option with `utilities-get-option()`
- Access all of a utility's options with `utilities-get-options()`

## Practical examples

### Enable responsive

You can enable responsive classes for an existing set of utilities that are not currently responsive by default. For example, to make the `border` classes responsive:

```scss
@import "bootstrap/scss/functions";
@import "bootstrap/scss/variables";
@import "bootstrap/scss/variables-dark";
@import "bootstrap/scss/maps";
@import "bootstrap/scss/mixins";

@import "bootstrap/scss/utilities";

@include utilities-set-option(border, responsive, true);

@import "bootstrap/scss/utilities/api";
```

This will now generate responsive variations of `.border` and `.border-0` for each breakpoint. Your generated CSS will look like this:

```css
.border { ... }
.border-0 { ... }

@media (min-width: 576px) {
  .border-sm { ... }
  .border-sm-0 { ... }
}

@media (min-width: 768px) {
  .border-md { ... }
  .border-md-0 { ... }
}

@media (min-width: 992px) {
  .border-lg { ... }
  .border-lg-0 { ... }
}

@media (min-width: 1200px) {
  .border-xl { ... }
  .border-xl-0 { ... }
}

@media (min-width: 1400px) {
  .border-xxl { ... }
  .border-xxl-0 { ... }
}
```

### Rename utilities

Missing v4 utilities or another naming convention? Override the `class` option to change the output of a given utility. For example, to rename `.ms-*` utilities to `.ml-*`:

```scss
@import "bootstrap/scss/functions";
@import "bootstrap/scss/variables";
@import "bootstrap/scss/variables-dark";
@import "bootstrap/scss/maps";
@import "bootstrap/scss/mixins";

@import "bootstrap/scss/utilities";

@include utilities-set-option(margin-start, class, ml);

@import "bootstrap/scss/utilities/api";
```

### Remove utility in RTL

Some edge cases make [RTL styling difficult](https://rtlstyling.com/posts/rtl-styling#common-things-that-might-not-work-for-rtl), such as line breaks in Arabic. Thus utilities can be dropped from RTL output by setting the `rtl` option to `false`:

```scss
@import "bootstrap/scss/functions";
@import "bootstrap/scss/variables";
@import "bootstrap/scss/variables-dark";
@import "bootstrap/scss/maps";
@import "bootstrap/scss/mixins";

@import "bootstrap/scss/utilities";

@include utilities-set-option(word-wrap, rtl, false);

@import "bootstrap/scss/utilities/api";
```

Output:

```css
/* rtl:begin:remove */
.text-break {
  word-wrap: break-word !important;
  word-break: break-word !important;
}
/* rtl:end:remove */
```

This doesn't output anything in RTL, thanks to [the RTLCSS `remove` control directive](https://rtlcss.com/learn/usage-guide/control-directives/#remove).
