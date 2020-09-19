---
layout: docs
title: Position
description: Use these shorthand utilities for quickly configuring the position of an element.
group: utilities
toc: true
---

## Position values

Quick positioning classes are available, though they are not responsive.

{{< highlight html >}}
<div class="position-static">...</div>
<div class="position-relative">...</div>
<div class="position-absolute">...</div>
<div class="position-fixed">...</div>
<div class="position-sticky">...</div>
{{< /highlight >}}

## Arrange elements

Arrange elements easily with the edge positioning utilities. The format is `{property}-{position}`.

Where *property* is one of:

- `top` - for the vertical `top` position
- `left` - for the horizontal `left` position
- `bottom` - for the vertical `bottom` position
- `right` - for the horizontal `right` position

Where *position* is one of:

- `0` - for `0` edge position
- `50` - for `50%` edge position
- `100` - for `100%` edge position

(You can add more position values by adding entries to the `$position-values` Sass map variable.)

{{< example class="bd-example-position-utils" >}}
<div class="position-relative">
  <div class="position-absolute left-0 top-0"></div>
  <div class="position-absolute right-0 top-0"></div>
  <div class="position-absolute left-50 top-50"></div>
  <div class="position-absolute right-50 bottom-50"></div>
  <div class="position-absolute left-0 bottom-0"></div>
  <div class="position-absolute right-0 bottom-0"></div>
</div>
{{< /example >}}

## Center elements

In addition, you can also center the elements with the transform utility class `.translate-middle`.

This class applies the transformations `translateX(-50%)` and `translateY(-50%)` to the element which, in combination with the edge positioning utilities, allows you to absolute center an element.

{{< example class="bd-example-position-utils" >}}
<div class="position-relative">
  <div class="position-absolute left-0 top-0 translate-middle"></div>
  <div class="position-absolute left-50 top-0 translate-middle"></div>
  <div class="position-absolute left-100 top-0 translate-middle"></div>
  <div class="position-absolute left-0 top-50 translate-middle"></div>
  <div class="position-absolute left-50 top-50 translate-middle"></div>
  <div class="position-absolute left-100 top-50 translate-middle"></div>
  <div class="position-absolute left-0 top-100 translate-middle"></div>
  <div class="position-absolute left-50 top-100 translate-middle"></div>
  <div class="position-absolute left-100 top-100 translate-middle"></div>
</div>
{{< /example >}}
