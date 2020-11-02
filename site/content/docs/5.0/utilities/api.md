---
layout: docs
title: Utility API
description: The utility API is a Sass based tool to generate utility classes.
group: utilities
aliases: "/docs/5.0/utilities/"
toc: true
---

Bootstrap utilities are generated with our utility API and can be used to modify or extend our default set of utility classes via Sass. Our utility API is based on a series of Sass maps and functions for generating families of classes with various options. If you're unfamiliar with Sass maps, read up on the [official Sass docs](https://sass-lang.com/documentation/values/maps) to get started.

The `$utilities` map contains all our utilities and is later merged with your custom `$utilities` map, if present. The utility map contains a keyed list of utility groups which accept the following options:

{{< bs-table "table text-left" >}}
| Option | Type | Description |
| --- | --- | --- |
| `property` | **Required** | Name of the property, this can be a string or an array of strings (e.g., horizontal paddings or margins). |
| `values` | **Required** | List of values, or a map if you don't want the class name to be the same as the value. If `null` is used as map key, it isn't compiled. |
| `class` | Optional | Variable for the class name if you don't want it to be the same as the property. In case you don't provide the `class` key and `property` key is an array of strings, the class name will be the first element of the `property` array. |
| `responsive` | Optional | Boolean indicating if responsive classes need to be generated. `false` by default. |
| `rfs` | Optional | Boolean to enable fluid rescaling. Have a look at the [RFS]({{< docsref "/getting-started/rfs" >}}) page to find out how this works. `false` by default. |
| `print` | Optional | Boolean indicating if print classes need to be generated. `false` by default. |
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
.opacity-0 { opacity: 0; }
.opacity-25 { opacity: .25; }
.opacity-50 { opacity: .5; }
.opacity-75 { opacity: .75; }
.opacity-100 { opacity: 1; }

@media (min-width: 576px) {
  .opacity-sm-0 { opacity: 0; }
  .opacity-sm-25 { opacity: .25; }
  .opacity-sm-50 { opacity: .5; }
  .opacity-sm-75 { opacity: .75; }
  .opacity-sm-100 { opacity: 1; }
}

@media (min-width: 768px) {
  .opacity-md-0 { opacity: 0; }
  .opacity-md-25 { opacity: .25; }
  .opacity-md-50 { opacity: .5; }
  .opacity-md-75 { opacity: .75; }
  .opacity-md-100 { opacity: 1; }
}

@media (min-width: 992px) {
  .opacity-lg-0 { opacity: 0; }
  .opacity-lg-25 { opacity: .25; }
  .opacity-lg-50 { opacity: .5; }
  .opacity-lg-75 { opacity: .75; }
  .opacity-lg-100 { opacity: 1; }
}

@media (min-width: 1200px) {
  .opacity-xl-0 { opacity: 0; }
  .opacity-xl-25 { opacity: .25; }
  .opacity-xl-50 { opacity: .5; }
  .opacity-xl-75 { opacity: .75; }
  .opacity-xl-100 { opacity: 1; }
}

@media (min-width: 1400px) {
  .opacity-xxl-0 { opacity: 0; }
  .opacity-xxl-25 { opacity: .25; }
  .opacity-xxl-50 { opacity: .5; }
  .opacity-xxl-75 { opacity: .75; }
  .opacity-xxl-100 { opacity: 1; }
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
.opacity-0 { opacity: 0; }
.opacity-25 { opacity: .25; }
.opacity-50 { opacity: .5; }
.opacity-75 { opacity: .75; }
.opacity-100 { opacity: 1; }

@media print {
  .opacity-print-0 { opacity: 0; }
  .opacity-print-25 { opacity: .25; }
  .opacity-print-50 { opacity: .5; }
  .opacity-print-75 { opacity: .75; }
  .opacity-print-100 { opacity: 1; }
}
```

### Remove utilities

Utilities can also be removed by changing the group key to `null`:

```scss
$utilities: (
  "float": null,
);
```
