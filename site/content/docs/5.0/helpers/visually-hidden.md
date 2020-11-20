---
layout: docs
title: Visually hidden
description: Use these helpers to visually hide elements but keep them accessible to assistive technologies.
group: helpers
aliases: "/docs/5.0/helpers/screen-readers/"
---

Visually hide an element while still allowing it to be exposed to assistive technologies (such as screen readers) with `.visually-hidden`. Use `.visually-hidden-focusable` to visually hide an element by default, but to display it when it's focused (e.g. by a keyboard-only user). Can also be used as mixins.

{{< example >}}
<h2 class="visually-hidden">Title for screen readers</h2>
<a class="visually-hidden-focusable" href="#content">Skip to main content</a>
{{< /example >}}

```scss
// Usage as a mixin

.visually-hidden-title {
  @include visually-hidden;
}

.skip-navigation {
  @include visually-hidden-focusable;
}
```
