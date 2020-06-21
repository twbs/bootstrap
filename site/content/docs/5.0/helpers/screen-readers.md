---
layout: docs
title: Screen readers
description: Use screen reader utilities to hide elements on all devices except screen readers.
group: helpers
---

Hide an element to all devices **except screen readers** with `.v-hidden`. Use `.v-hidden-focusable` to show the element only when it's focused (e.g. by a keyboard-only user). Can also be used as mixins.

{{< example >}}
<h2 class="v-hidden">Title for screen readers</h2>
<a class="v-hidden-focusable" href="#content">Skip to main content</a>
{{< /example >}}

{{< highlight scss >}}
// Usage as a mixin

.v-hidden-title {
  @include v-hidden;
}

.skip-navigation {
  @include v-hidden-focusable;
}
{{< /highlight >}}
