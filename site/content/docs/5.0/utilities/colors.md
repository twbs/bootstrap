---
layout: docs
title: Colors
description: Convey meaning through color with a handful of color utility classes. Includes support for styling links with hover states, too.
group: utilities
toc: true
---

## Color

Colorize text with color utilities. If you want to colorize links, you can use the [`.link-*` helper classes]({{< docsref "/helpers/colored-links" >}}) which have `:hover` and `:focus` states.

{{< example >}}
{{< colors.inline >}}
{{- range (index $.Site.Data "theme-colors") }}
<p class="text-{{ .name }}{{ if eq .name "light" }} bg-dark{{ end }}">.text-{{ .name }}</p>
{{- end -}}
{{< /colors.inline >}}
<p class="text-body">.text-body</p>
<p class="text-muted">.text-muted</p>
<p class="text-white bg-dark">.text-white</p>
<p class="text-black-50">.text-black-50</p>
<p class="text-white-50 bg-dark">.text-white-50</p>
{{< /example >}}

## Background color

Similar to the contextual text color classes, easily set the background of an element to any contextual class. Background utilities **do not set `color`**, so in some cases you'll want to use `.text-*` utilities.

{{< example >}}
{{< colors.inline >}}
{{- range (index $.Site.Data "theme-colors") }}
<div class="p-3 mb-2 bg-{{ .name }} {{ if or (eq .name "light") (eq .name "warning") }}text-dark{{ else }}text-white{{ end }}">.bg-{{ .name }}</div>
{{- end -}}
{{< /colors.inline >}}
<div class="p-3 mb-2 bg-white text-dark">.bg-white</div>
<div class="p-3 mb-2 bg-transparent text-dark">.bg-transparent</div>
{{< /example >}}

## Background gradient

When `$enable-gradients` is set to `true` (default is `false`), you can use `.bg-gradient-` utility classes. [Learn about our Sass options]({{< docsref "/customize/sass" >}}) to enable these classes and more.

{{< markdown >}}
{{< colors.inline >}}
{{- range (index $.Site.Data "theme-colors") }}
- `.bg-gradient-{{ .name }}`
{{- end -}}
{{< /colors.inline >}}
{{< /markdown >}}

{{< callout info >}}
#### Dealing with specificity

Sometimes contextual classes cannot be applied due to the specificity of another selector. In some cases, a sufficient workaround is to wrap your element's content in a `<div>` with the class.
{{< /callout >}}

{{< callout info >}}
{{< partial "callout-warning-color-assistive-technologies.md" >}}
{{< /callout >}}
