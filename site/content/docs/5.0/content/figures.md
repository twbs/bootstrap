---
layout: docs
title: Figures
description: Documentation and examples for displaying related images and text with the figure component in Bootstrap.
group: content
---

Anytime you need to display a piece of content—like an image with an optional caption, consider using a `<figure>`.

Use the included `.figure`, `.figure-img` and `.figure-caption` classes to provide some baseline styles for the HTML5 `<figure>` and `<figcaption>` elements. Images in figures have no explicit size, so be sure to add the `.img-fluid` class to your `<img>` to make it responsive.

{{< example >}}
<figure class="figure">
  {{< placeholder width="400" height="300" class="figure-img img-fluid rounded" >}}
  <figcaption class="figure-caption">A caption for the above image.</figcaption>
</figure>
{{< /example >}}

Aligning the figure's caption is easy with our [text utilities]({{< docsref "/utilities/text#text-alignment" >}}).

{{< example >}}
<figure class="figure">
  {{< placeholder width="400" height="300" class="figure-img img-fluid rounded" >}}
  <figcaption class="figure-caption text-end">A caption for the above image.</figcaption>
</figure>
{{< /example >}}
