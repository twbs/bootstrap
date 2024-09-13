---
layout: docs
title: Docs reference
description: Examples of Bootstrap's documentation-specific components and styles.
aliases: "/docsref/"
toc: true
robots: noindex,follow
sitemap:
  disable: true
---

## Buttons

<button class="btn btn-bd-primary">Primary button</button>
<button class="btn btn-bd-accent">Accent button</button>
<button class="btn btn-bd-light">Light button</button>

## Callouts

{{< callout >}}
  Default callout
{{< /callout >}}

{{< callout warning >}}
  Warning callout
{{< /callout >}}

{{< callout danger >}}
  Danger callout
{{< /callout >}}

## Code example

```scss
.test {
  --color: blue;
}
```

<div class="bd-example">
  The <abbr title="HyperText Markup Language">HTML</abbr> abbreviation element.
</div>

{{< example >}}
<div class="test">This is a test.</div>
{{< /example >}}

{{< example lang="scss" show_preview="false" >}}
.test {
  --color: blue;
  show_preview="false"
}
{{< /example >}}

{{< example lang="scss" basic="true" >}}
.test {
  --color: blue;
  basic
}
{{< /example >}}

{{< scss-docs name="variable-gradient" file="scss/_variables.scss" >}}

{{< js-docs name="live-toast" file="site/assets/js/partials/snippets.js" >}}
