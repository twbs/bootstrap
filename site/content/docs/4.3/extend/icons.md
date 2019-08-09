---
layout: docs
title: Icons
description: Guidance and suggestions for using external icon libraries with Bootstrap.
group: extend
---

Bootstrap doesn't include an icon library by default, but we have a handful of recommendations for you to choose from. While most icon sets include multiple file formats, we prefer SVG implementations for their improved accessibility and vector support.

## Preferred

We've tested and used these icon sets ourselves.

{{< markdown >}}
{{< icons.inline >}}
{{- $type := .Get "type" | default "preferred" -}}

{{- range (index .Site.Data.icons $type) }}
- [{{ .name }}]({{ .website }})
{{- end }}
{{< /icons.inline >}}
{{< /markdown >}}

## More options

While we haven't tried these out, they do look promising and provide multiple formats—including SVG.

{{< markdown >}}
{{< icons.inline type="more" />}}
{{< /markdown >}}
