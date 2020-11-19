---
layout: docs
title: Screen readers
description: Use screen reader utilities to hide elements on all devices except screen readers.
group: utilities
---

Hide an element to all devices **except screen readers** with `.sr-only`. Combine `.sr-only` with `.sr-only-focusable` to show the element again when it's focused (e.g. by a keyboard-only user). Can also be used as mixins.

{{< example >}}
<a class="sr-only sr-only-focusable" href="#content">Skip to main content</a>
{{< /example >}}

```scss
// Usage as a mixin
.skip-navigation {
  @include sr-only;
  @include sr-only-focusable;
}
```
