---
layout: docs
title: Images
description: Documentation and examples for opting images into responsive behavior (so they never become larger than their parent elements) and add lightweight styles to them—all via classes.
group: content
toc: true
---

## Responsive images

Images in Bootstrap are made responsive with `.img-fluid`. This applies `max-width: 100%;` and `height: auto;` to the image so that it scales with the parent element.

{{< example >}}
{{< placeholder width="100%" height="250" class="bd-placeholder-img-lg img-fluid" text="Responsive image" >}}
{{< /example >}}

## Image thumbnails

In addition to our [border-radius utilities]({{< docsref "/utilities/borders" >}}), you can use `.img-thumbnail` to give an image a rounded 1px border appearance.

{{< example >}}
{{< placeholder width="200" height="200" class="img-thumbnail" title="A generic square placeholder image with a white border around it, making it resemble a photograph taken with an old instant camera" >}}
{{< /example >}}

## Aligning images

Align images with the [helper float classes]({{< docsref "/utilities/float" >}}) or [text alignment classes]({{< docsref "/utilities/text#text-alignment" >}}). `block`-level images can be centered using [the `.mx-auto` margin utility class]({{< docsref "/utilities/spacing#horizontal-centering" >}}).

{{< example >}}
{{< placeholder width="200" height="200" class="rounded float-left" >}}
{{< placeholder width="200" height="200" class="rounded float-right" >}}
{{< /example >}}


{{< example >}}
{{< placeholder width="200" height="200" class="rounded mx-auto d-block" >}}
{{< /example >}}

{{< example >}}
<div class="text-center">
  {{< placeholder width="200" height="200" class="rounded" >}}
</div>
{{< /example >}}


## Picture

If you are using the `<picture>` element to specify multiple `<source>` elements for a specific `<img>`, make sure to add the `.img-*` classes to the `<img>` and not to the `<picture>` tag.

{{< highlight html >}}
​<picture>
  <source srcset="..." type="image/svg+xml">
  <img src="..." class="img-fluid img-thumbnail" alt="...">
</picture>
{{< /highlight >}}
