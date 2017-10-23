---
layout: docs
title: Screenreaders
description: Use screenreader utilities to hide elements on all devices except screen readers.
menu:
  docs:
    parent: utilities
toc: true
---

Hide an element to all devices **except screen readers** with `.sr-only`. Combine `.sr-only` with `.sr-only-focusable` to show the element again when it's focused (e.g. by a keyboard-only user). Can also be used as mixins.

{{< highlight html >}}
<a class="sr-only sr-only-focusable" href="#content">Skip to main content</a>
{{< /highlight >}}

{{< highlight scss >}}
// Usage as a mixin
.skip-navigation {
  @include sr-only;
  @include sr-only-focusable;
}
{{< /highlight >}}
