---
layout: docs
title: Snippets
description: Extend Bootstrap with some common snippets of source code not included in the main project.
group: extend
toc: true
---

## Components

### Light badges

{{< example >}}
{{< badge.inline >}}
{{- range (index $.Site.Data "theme-colors") }}
<span class="badge badge-light-{{ .name }} text-dark">{{ .name | title }}</span>{{- end -}}
{{< /badge.inline >}}
{{< /example >}}

```scss
@each $color, $value in $theme-colors {
  $badge-light-bg: shift-color($value, -80%);
  .badge-light-#{$color} {
    background-color: $badge-light-bg;
  }
}
```

### Light buttons

{{< example >}}
{{< buttons.inline >}}
{{- range (index $.Site.Data "theme-colors") }}
<button type="button" class="btn btn-light-{{ .name }}">{{ .name | title }}</button>
{{- end -}}
{{< /buttons.inline >}}
{{< /example >}}

```scss
@each $color, $value in $theme-colors {
  $btn-light-bg: shift-color($value, -80%);
  $btn-light-border: shift-color($value, -80%);
  .btn-light-#{$color} {
    @include button-variant($btn-light-bg, $btn-light-border, shift-color($value, 50%));
  }
}
```

## Utilities

### Responsive position

```scss
@import "bootstrap/scss/functions";
@import "bootstrap/scss/variables";
@import "bootstrap/scss/maps";
@import "bootstrap/scss/mixins";
@import "bootstrap/scss/utilities";
@import "bootstrap/scss/utilities/api";

$utilities: map-merge(
  $utilities,
  (
    "position": map-merge(
      map-get($utilities, "position"),
      (
        responsive: true
      ),
    ),
  )
);
```

### Responsive width

```scss
@import "bootstrap/scss/functions";
@import "bootstrap/scss/variables";
@import "bootstrap/scss/maps";
@import "bootstrap/scss/mixins";
@import "bootstrap/scss/utilities";
@import "bootstrap/scss/utilities/api";

$utilities: map-merge(
  $utilities,
  (
    "width": map-merge(
      map-get($utilities, "width"),
      (
        responsive: true
      ),
    ),
  )
);
```

### Additional height

```scss
@import "bootstrap/scss/functions";
@import "bootstrap/scss/variables";
@import "bootstrap/scss/maps";
@import "bootstrap/scss/mixins";
@import "bootstrap/scss/utilities";
@import "bootstrap/scss/utilities/api";

$utilities: map-merge(
  $utilities,
  (
    "height": map-merge(
      map-get($utilities, "height"),
      (
        values: map-merge(
          map-get(map-get($utilities, "height"), "values"),
          (10: 10%),
        ),
      ),
    ),
  )
);
```
