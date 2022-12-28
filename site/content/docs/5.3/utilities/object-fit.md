---
layout: docs
title: Object fit
description: Use the object fit utilities to modify how the content of a [replaced element](https://developer.mozilla.org/en-US/docs/Web/CSS/Replaced_element), such as an `<img>` or `<video>`, should be resized to fit its container.
group: utilities
toc: true
---

## How it works

Change the value of the [`object-fit` property](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit) with our responsive `object-fit` utility classes. This property tells the content to fill the parent container in a variety of ways, such as preserving the aspect ratio or stretching to take up as much space as possible.

Classes for the value of `object-fit` are named using the format `.object-fit-{value}`. Choose from the following values:

- `contain`
- `cover`
- `fill`
- `scale` (for scale-down)
- `none`

## Examples

Add the `object-fit-{value}` class to the [replaced element](https://developer.mozilla.org/en-US/docs/Web/CSS/Replaced_element):

{{< example class="d-flex overflow-auto" >}}
{{< placeholder width="140" height="120" class="object-fit-contain border rounded" text="Object fit contain" markup="img" >}}
{{< placeholder width="140" height="120" class="object-fit-cover border rounded" text="Object fit cover" markup="img" >}}
{{< placeholder width="140" height="120" class="object-fit-fill border rounded" text="Object fit fill" markup="img" >}}
{{< placeholder width="140" height="120" class="object-fit-scale border rounded" text="Object fit scale down" markup="img" >}}
{{< placeholder width="140" height="120" class="object-fit-none border rounded" text="Object fit none" markup="img" >}}
{{< /example >}}

## Responsive

Responsive variations also exist for each `object-fit` value using the format `.object-fit-{breakpoint}-{value}`, for the following breakpoint abbreviations: `sm`, `md`, `lg`, `xl`, and `xxl`. Classes can be combined for various effects as you need.

{{< example class="d-flex overflow-auto" >}}
{{< placeholder width="140" height="80" class="object-fit-sm-contain border rounded" text="Contain on sm" markup="img" >}}
{{< placeholder width="140" height="80" class="object-fit-md-contain border rounded" text="Contain on md" markup="img" >}}
{{< placeholder width="140" height="80" class="object-fit-lg-contain border rounded" text="Contain on lg" markup="img" >}}
{{< placeholder width="140" height="80" class="object-fit-xl-contain border rounded" text="Contain on xl" markup="img" >}}
{{< placeholder width="140" height="80" class="object-fit-xxl-contain border rounded" text="Contain on xxl" markup="img" >}}
{{< /example >}}

## Video

The `.object-fit-{value}` and responsive `.object-fit-{breakpoint}-{value}` utilities also work on `<video>` elements.

```html
<video src="..." class="object-fit-contain" autoplay></video>
<video src="..." class="object-fit-cover" autoplay></video>
<video src="..." class="object-fit-fill" autoplay></video>
<video src="..." class="object-fit-scale" autoplay></video>
<video src="..." class="object-fit-none" autoplay></video>
```

## Utilities API

Object fit utilities are declared in our utilities API in `scss/_utilities.scss`. [Learn how to use the utilities API.]({{< docsref "/utilities/api#using-the-api" >}})

{{< scss-docs name="utils-object-fit" file="scss/_utilities.scss" >}}
