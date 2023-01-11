---
layout: docs
title: Colored links
description: Colored links with hover states
group: helpers
toc: true
---

## Link colors

You can use the `.link-*` classes to colorize links. Unlike the [`.text-*` classes]({{< docsref "/utilities/colors" >}}), these classes have a `:hover` and `:focus` state. Some of the link styles use a relatively light foreground color, and should only be used on a dark background in order to have sufficient contrast.

{{< callout info >}}
**Heads up!** `.link-body-emphasis` is currently the only colored link that adapts to color modes. It's treated as a special case until v6 arrives and we can more thoroughly rebuild our theme colors for color modes. Until then, it's a unique, high-contrast link color with custom `:hover` and `:focus` styles. However, it still responds to the new link utilities.
{{< /callout >}}

{{< example >}}
{{< colored-links.inline >}}
{{- range (index $.Site.Data "theme-colors") }}
<p><a href="#" class="link-{{ .name }}">{{ .name | title }} link</a></p>
{{- end -}}
{{< /colored-links.inline >}}
<p><a href="#" class="link-body-emphasis">Emphasis link</a></p>
{{< /example >}}

{{< callout info >}}
{{< partial "callouts/warning-color-assistive-technologies.md" >}}
{{< /callout >}}

## Link utilities

{{< added-in "5.3.0" >}}

Colored links can also be modified by our [link utilities]({{< docsref "/utilities/link/" >}}).

{{< example >}}
{{< colored-links.inline >}}
{{- range (index $.Site.Data "theme-colors") }}
<p><a href="#" class="link-{{ .name }} link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">{{ .name | title }} link</a></p>
{{- end -}}
{{< /colored-links.inline >}}
<p><a href="#" class="link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-75-hover">Emphasis link</a></p>
{{< /example >}}
