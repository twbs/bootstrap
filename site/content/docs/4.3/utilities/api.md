---
layout: docs
title: Utility API
description: The utility API is a Sass based tool to generate utility classes.
group: utilities
aliases: "/docs/4.3/utilities/"
toc: true
---

The bootstrap utilities are generated with the utility API which can be used to change or extend Bootstrap's utility classes. If you don't have any idea what Sass maps are, you can consult the [official docs](https://sass-lang.com/documentation/values/maps) to get started.

The `$utilities` map contains all utilities and is later merged with your custom `$utilities` map if present. The utility map contains a keyed list of utility groups which accept the following options:

- `property`: Name of the property, this can be a string or an array of strings (needed for eg. horizontal paddings or margins).
- `responsive` _(optional)_: Boolean indicating if responsive classes need to be generated. `false` by default.
- `class` _(optional)_: Variable to change the class name if you don't want it to be the same as the property. In case you don't provide the `class` key and `property` key is an array of strings, the class name will be the first element of the `property` array.
- `values`: This can be a list of values or a map if you don't want the class name to be the same as the value. If null is used as map key, it isn't rendered.
- `print` _(optional)_: Boolean indicating if print classes need to be generated. `false` by default.


## Adding utilities to the utility API

All utility variables are added to the `$utilities` variable. Custom utility groups can added like this:

```scss
$utilities: (
  "opacity": (
    property: opacity,
    values: (
      0: 0,
      25: .25,
      50: .5,
      100: 1,
    )
  )
 );
```

Output:

```css
.opacity-0 {
  opacity: 0;
}
.opacity-25 {
  opacity: .25;
}
.opacity-75 {
  opacity: .75;
}
.opacity-100 {
  opacity: 1;
}
```


## Changing the class prefix

With the `class` option, the class prefix can be changed:

```scss
$utilities: (
  "opacity": (
    property: opacity,
    class: o,
    values: (
      0: 0,
      25: .25,
      50: .5,
      100: 1,
    )
  )
 );
```

Output:

```css
.o-0 {
  opacity: 0;
}
.o-25 {
  opacity: .25;
}
.o-75 {
  opacity: .75;
}
.o-100 {
  opacity: 1;
}
```

## Responsive utilities

With the `responsive` option, responsive utility classes can be generated:

```scss
$utilities: (
  "opacity": (
    property: opacity,
    responsive: true,
    values: (
      0: 0,
      25: .25,
      50: .5,
      100: 1,
    )
  )
 );
```

Output:

```css
.opacity-0 {
  opacity: 0;
}
.opacity-25 {
  opacity: .25;
}
.opacity-75 {
  opacity: .75;
}
.opacity-100 {
  opacity: 1;
}
@media (min-width: 576px) {
  .opacity-sm-0 {
    opacity: 0;
  }
  .opacity-sm-25 {
    opacity: .25;
  }
  .opacity-sm-75 {
    opacity: .75;
  }
  .opacity-sm-100 {
    opacity: 1;
  }
}
@media (min-width: 768px) {
  .opacity-md-0 {
    opacity: 0;
  }
  .opacity-md-25 {
    opacity: .25;
  }
  .opacity-md-75 {
    opacity: .75;
  }
  .opacity-md-100 {
    opacity: 1;
  }
}
@media (min-width: 992px) {
  .opacity-lg-0 {
    opacity: 0;
  }
  .opacity-lg-25 {
    opacity: .25;
  }
  .opacity-lg-75 {
    opacity: .75;
  }
  .opacity-lg-100 {
    opacity: 1;
  }
}
@media (min-width: 1200px) {
  .opacity-xl-0 {
    opacity: 0;
  }
  .opacity-xl-25 {
    opacity: .25;
  }
  .opacity-xl-75 {
    opacity: .75;
  }
  .opacity-xl-100 {
    opacity: 1;
  }
}
```

## Changing utilities

Overriding excising utilities is possible by using the same key. For example if you want more responsive overflow
utility classes you can do this:

```scss
$utilities: (
  "overflow": (
    responsive: true,
    property: overflow,
    values: visible hidden scroll auto,
  ),
);
```


## Print utilities

Enabling the `print` option will **also** generate utility classes for print.

```scss
$utilities: (
  "opacity": (
    property: opacity,
    class: o,
    print: true,
    values: (
      0: 0,
      25: .25,
      50: .5,
      100: 1,
    )
  )
 );
```

Output:

```css
.o-0 {
  opacity: 0;
}
.o-25 {
  opacity: .25;
}
.o-75 {
  opacity: .75;
}
.o-100 {
  opacity: 1;
}

@media print {
  .o-print-0 {
    opacity: 0;
  }
  .o-print-25 {
    opacity: .25;
  }
  .o-print-75 {
    opacity: .75;
  }
  .o-print-100 {
    opacity: 1;
  }
}
```

## Removing utilities

Utilities can also be removed by changing the group key to `null`:

```scss
$utilities: (
  "float": null,
);
```
