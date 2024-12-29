---
layout: docs
title: Close button
description: A generic close button for dismissing content like modals and alerts.
group: components
toc: true
---

## Basic Close Button

{{< example >}}
<button type="button" class="btn-close" aria-label="Close"></button>
{{< /example >}}

## Dark Variant

{{< example >}}
<div class="bg-dark p-2">
  <button type="button" class="btn-close btn-close-white" aria-label="Close"></button>
</div>
{{< /example >}}

## Dark

{{< example >}}
<div data-bs-theme="dark" class="bg-body p-2">
  <button type="button" class="btn-close" aria-label="Close"></button>
</div>
{{< /example >}}

## Light

{{< example >}}
<div data-bs-theme="light" class="bg-body p-2">
  <button type="button" class="btn-close" aria-label="Close"></button>
</div>
{{< /example >}}

## Light in dark

{{< example >}}
<div data-bs-theme="dark" class="bg-body p-2">
  <div data-bs-theme="light" class="bg-body p-2">
    <button type="button" class="btn-close" aria-label="Close"></button>
  </div>
</div>
{{< /example >}}

## Dark in light

{{< example >}}
<div data-bs-theme="light" class="bg-body p-2">
  <div data-bs-theme="dark" class="bg-body p-2">
    <button type="button" class="btn-close" aria-label="Close"></button>
  </div>
</div>
{{< /example >}}

## Toast and Close Button issue

Forcing `data-bs-theme="light"` didn't work in dark mode. Now, the cross button is always dark.

{{< example >}}
<div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
  <div class="toast-header bg-warning" data-bs-theme="light">
    <img src="..." class="rounded me-2" alt="...">
    <strong class="me-auto">Warning!</strong>
    <small>11 mins ago</small>
    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
  </div>
  <div class="toast-body">
    This is a warning message.
  </div>
</div>
{{< /example >}}
