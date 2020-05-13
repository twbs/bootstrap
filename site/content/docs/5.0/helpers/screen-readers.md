---
layout: docs
title: Screen readers
description: Use screen reader utilities to hide elements on all devices except screen readers.
group: helpers
---

Hide an element to all devices **except screen readers** with `.sr-only`. Use `.sr-only-focusable` to show the element only when it's focused (e.g. by a keyboard-only user). Can also be used as mixins.

{{< example >}}
<h2 class="sr-only">Title for screen readers</h2>
<a class="sr-only-focusable" href="#content">Skip to main content</a>
{{< /example >}}

{{< highlight scss >}}
// Usage as a mixin

.sr-only-title {
  @include sr-only;
}

.skip-navigation {
  @include sr-only-focusable;
}
{{< /highlight >}}
