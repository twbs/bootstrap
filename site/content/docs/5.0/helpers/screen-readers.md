---
layout: docs
title: Screen readers
description: Use screen reader utilities to hide elements on all devices except screen readers.
group: helpers
---

Hide an element to all devices **except screen readers** with `.visually-hidden`. Use `.visually-hidden-focusable` to show the element only when it's focused (e.g. by a keyboard-only user). Can also be used as mixins.

{{< example >}}
<h2 class="visually-hidden">Title for screen readers</h2>
<a class="visually-hidden-focusable" href="#content">Skip to main content</a>
{{< /example >}}

{{< highlight scss >}}
// Usage as a mixin

.visually-hidden-title {
  @include visually-hidden;
}

.skip-navigation {
  @include visually-hidden-focusable;
}
{{< /highlight >}}
