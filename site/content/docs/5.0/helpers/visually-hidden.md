---
layout: docs
title: Visually hidden
description: Use these helpers to visually hide elements but keep them accessible to assistive technologies.
group: helpers
---

Visually hide an element while still allowing it to be exposed to assistive technologies (such as screen readers) with `.sr-only`. Use `.sr-only-focusable` to visually hide an element by default, but to display it when it's focused (e.g. by a keyboard-only user). Can also be used as mixins.

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
