---
layout: docs
title: Docs reference
description: Examples of Bootstrap's documentation-specific components and styles.
aliases: "/docsref/"
toc: true
robots: noindex,follow
sitemap_exclude: true
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

<div class="bd-example">
  <div class="test">This is a test.</div>
</div>

```scss
.test {
  --color: blue;
}
```

```html
<div class="test">This is a markup only test.</div>
```

{{< highlight html >}}
<div class="test">This is a markup only test.</div>
{{< /highlight >}}

{{< example show_preview=false >}}
<div class="test">This is a markup only test.</div>
{{< /example >}}

{{< example show_markup=false >}}
<div class="test">This is a preview only test.</div>
{{< /example >}}

{{< example >}}
<div class="test">This is a test.</div>
{{< /example >}}

{{< example class=bg-body-secondary >}}
<div class="test">This is a test.</div>
{{< /example >}}

{{< example >}}
<skip class="test">
  This is a skip test.
</skip>
{{< /example >}}

{{< example skip=p >}}
<skip class="test">
  This is a skip test with <code>p</code>.
</skip>
{{< /example >}}

{{< scss-docs name="variable-gradient" file="scss/_variables.scss" >}}

{{< js-docs name="live-toast" file="site/assets/js/snippets.js" >}}
