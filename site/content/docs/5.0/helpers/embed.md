---
layout: docs
title: Embeds
description: Create responsive video or slideshow embeds based on the width of the parent by creating an intrinsic ratio that scales on any device.
group: helpers
toc: true
---

## About

Rules are directly applied to `<iframe>`, `<embed>`, `<video>`, and `<object>` elements. You can also use an explicit use an explicit descendant class, `.embed-responsive-item`, when you want to match the styling for other attributes. Aspect ratios are declared in a Sass map and included in each class via CSS variable, which also allows [custom aspect ratios](#custom-ratios).

{{< callout info >}}
**Pro-Tip!** You don't need `frameborder="0"` on your `<iframe>`s as we override that for you in [Reboot]({{< docsref "/content/reboot" >}}).
{{< /callout >}}

## Example

Wrap any embed, like an `<iframe>`, in a parent element with `.embed-responsive` and an aspect ratio class. As mentioned above, the `.embed-responsive-item` isn't strictly required, but we encourage it.

{{< example >}}
<div class="embed-responsive embed-responsive-16x9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/zpOULjyy-n8?rel=0" title="YouTube video" allowfullscreen></iframe>
</div>
{{< /example >}}

## Aspect ratios

Aspect ratios can be customized with modifier classes. By default the following ratio classes are provided:

{{< example html >}}
<div class="embed-responsive embed-responsive-1x1" style="width: 10rem;">
  <div class="embed-responsive-item">1x1</div>
</div>
<div class="embed-responsive embed-responsive-4x3" style="width: 10rem;">
  <div class="embed-responsive-item">4x3</div>
</div>
<div class="embed-responsive embed-responsive-16x9" style="width: 10rem;">
  <div class="embed-responsive-item">16x9</div>
</div>
<div class="embed-responsive embed-responsive-21x9" style="width: 10rem;">
  <div class="embed-responsive-item">21x9</div>
</div>
{{< /example >}}

## Custom ratios

Each `.embed-responsive-*` class includes a CSS custom property (or CSS variable) in the selector. You can override this CSS variable to create custom aspect ratios on the fly with some quick math on your part.

For example, to create a 2x1 aspect ratio, set `--aspect-ratio: 50%` on the `.embed-responsive`.

{{< example html >}}
<div class="embed-responsive" style="--aspect-ratio: 50%; width: 10rem;">
  <div class="embed-responsive-item">2x1</div>
</div>
{{< /example >}}

## Sass map

Within `_variables.scss`, you can change the aspect ratios you want to use. Here's our default `$embed-responsive-aspect-ratios` map. Modify the map as you like and recompile your Sass to put them to use.

{{< scss-docs name="embed-responsive-aspect-ratios" file="scss/_variables.scss" >}}
