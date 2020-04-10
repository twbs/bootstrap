---
layout: docs
title: Colored links
description: Colored links with hover states
group: helpers
toc: false
---

You can use the `.link-*` classes to colorize links. Unlike the [`.text-*` classes]({{< docsref "/utilities/colors#colors" >}}), these classes have a `:hover` and `:focus` state.

{{< example class="d-flex justify-content-between align-items-center" >}}
{{< colored-links.inline >}}
{{- range (index $.Site.Data "theme-colors") }}{{ if (or (eq .name "light") (eq .name "warning") (eq .name "info")) }}<div class="bg-dark p-2">{{ end }}
<a href="#" class="link-{{ .name }}">{{ .name | title }} link</a>
{{ if (or (eq .name "light") (eq .name "warning") (eq .name "info")) }}</div>{{ end }}{{- end -}}
{{< /colored-links.inline >}}
{{< /example >}}
