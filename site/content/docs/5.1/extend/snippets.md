---
layout: docs
title: Snippets
description: Extend Bootstrap with some common snippets of source code not included in the main project.
group: extend
---

## Components

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

- Opacity
- Expanded widths/heights
