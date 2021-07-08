---
layout: docs
title: Utility API
description: The utility API is a Sass-based tool to generate utility classes.
group: utilities
aliases: "/docs/5.0/utilities/"
toc: true
---

Bootstrap utilities are generated with our utility API and can be used to modify or extend our default set of utility classes via Sass. Our utility API is based on a series of Sass maps and functions for generating families of classes with various options. If you're unfamiliar with Sass maps, read up on the [official Sass docs](https://sass-lang.com/documentation/values/maps) to get started.

The `$utilities` map contains all our utilities and is later merged with your custom `$utilities` map, if present. The utility map contains a keyed list of utility groups which accept the following options:

{{< bs-table "table text-start" >}}
| Option | Type | Description |
| --- | --- | --- |
| `property` | **Required** | Name of the property, this can be a string or an array of strings (e.g., horizontal paddings or margins). |
| `values` | **Required** | List of values, or a map if you don't want the class name to be the same as the value. If `null` is used as map key, it isn't compiled. |
| `class` | Optional | Variable for the class name if you don't want it to be the same as the property. In case you don't provide the `class` key and `property` key is an array of strings, the class name will be the first element of the `property` array. |
| `state` | Optional | List of pseudo-class variants like `:hover` or `:focus` to generate for the utility. No default value. |
| `responsive` | Optional | Boolean indicating if responsive classes need to be generated. `false` by default. |
| `rfs` | Optional | Boolean to enable fluid rescaling. Have a look at the [RFS]({{< docsref "/getting-started/rfs" >}}) page to find out how this works. `false` by default. |
| `print` | Optional | Boolean indicating if print classes need to be generated. `false` by default. |
| `rtl` | Optional | Boolean indicating if utility should be kept in RTL. `true` by default. |
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

### Custom class prefix

Use the `class` option to change the class prefix used in the compiled CSS:

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
.o-0 { opacity: 0; }
.o-25 { opacity: .25; }
.o-50 { opacity: .5; }
.o-75 { opacity: .75; }
.o-100 { opacity: 1; }
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

### Responsive utilities

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

### Changing utilities

Override existing utilities by using the same key. For example, if you want additional responsive overflow utility classes, you can do this:

```scss
$utilities: (
  "overflow": (
    responsive: true,
    property: overflow,
    values: visible hidden scroll auto,
  ),
);
```

### Print utilities

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

Now that you're familiar with how the utilities API works, learn how to add your own custom classes and modify our default utilities.

### Add utilities

New utilities can be added to the default `$utilities` map with a `map-merge`. Make sure our required Sass files and `_utilities.scss` are imported first, then use the `map-merge` to add your additional utilities. For example, here's how to add a responsive `cursor` utility with three values.

```scss
@import "bootstrap/scss/functions";
@import "bootstrap/scss/variables";
@import "bootstrap/scss/utilities";

$utilities: map-merge(
  $utilities,
  (
    "cursor": (
      property: cursor,
      class: cursor,
      responsive: true,
      values: auto pointer grab,
    )
  )
);
```

### Modify utilities

Modify existing utilities in the default `$utilities` map with `map-get` and `map-merge` functions. In the example below, we're adding an additional value to the `width` utilities. Start with an initial `map-merge` and then specify which utility you want to modify. From there, fetch the nested `"width"` map with `map-get` to access and modify the utility's options and values.

```scss
@import "bootstrap/scss/functions";
@import "bootstrap/scss/variables";
@import "bootstrap/scss/utilities";

$utilities: map-merge(
  $utilities,
  (
    "width": map-merge(
      map-get($utilities, "width"),
      (
        values: map-merge(
          map-get(map-get($utilities, "width"), "values"),
          (10: 10%),
        ),
      ),
    ),
  )
);
```

#### Enable responsive

You can enable responsive classes for an existing set of utilities that are not currently responsive by default. For example, to make the `border` classes responsive:

```scss
@import "bootstrap/scss/functions";
@import "bootstrap/scss/variables";
@import "bootstrap/scss/utilities";

$utilities: map-merge(
  $utilities, (
    "border": map-merge(
      map-get($utilities, "border"),
      ( responsive: true ),
    ),
  )
);
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

#### Rename utilities

Missing v4 utilities, or used to another naming convention? The utilities API can be used to override the resulting `class` of a given utility—for example, to rename `.ms-*` utilities to oldish `.ml-*`:

```scss
@import "bootstrap/scss/functions";
@import "bootstrap/scss/variables";
@import "bootstrap/scss/utilities";

$utilities: map-merge(
  $utilities, (
    "margin-start": map-merge(
      map-get($utilities, "margin-start"),
      ( class: ml ),
    ),
  )
);
```

### Remove utilities

Remove any of the default utilities by setting the group key to `null`. For example, to remove all our `width` utilities, create a `$utilities` `map-merge` and add `"width": null` within.

```scss
@import "bootstrap/scss/functions";
@import "bootstrap/scss/variables";
@import "bootstrap/scss/utilities";

$utilities: map-merge(
  $utilities,
  (
    "width": null
  )
);
```

#### Remove utility in RTL

Some edge cases make [RTL styling difficult](https://rtlstyling.com/posts/rtl-styling#common-things-that-might-not-work-for-rtl), such as line breaks in Arabic. Thus utilities can be dropped from RTL output by setting the `rtl` option to `false`:

```scss
$utilities: (
  "word-wrap": (
    property: word-wrap word-break,
    class: text,
    values: (break: break-word),
    rtl: false
  ),
);
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
