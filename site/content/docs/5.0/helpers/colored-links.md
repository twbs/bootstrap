---
layout: docs
title: Colored links
description: Colored links with hover states
group: helpers
toc: false
---

You can use the `.link-*` classes to colorize links. Unlike the [`.text-*` classes]({{< docsref "/utilities/colors#colors" >}}), these classes have a `:hover` and `:focus` state.

{{< example >}}
{{< colored-links.inline >}}
{{- range (index $.Site.Data "theme-colors") }}
<a href="#" class="link-{{ .name }}">{{ .name | title }} link</a>
{{- end -}}
{{< /colored-links.inline >}}
{{< /example >}}

{{< callout info >}}
Some of the link styles use a relatively light foreground color, and should only be used on a dark background in order to have sufficient contrast.
{{< /callout >}}
