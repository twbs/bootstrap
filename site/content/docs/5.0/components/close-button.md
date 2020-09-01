---
layout: docs
title: Close button
description: A generic close button for dismissing content like modals and alerts.
group: components
---

**Be sure to include text for screen readers**, as we've done with `aria-label`. Disabled close buttons have `pointer-events: none` and `user-select: none` applied to preventing hover and active states from triggering.

{{< example >}}
<button type="button" class="btn-close" aria-label="Close"></button>
<button type="button" class="btn-close" disabled aria-label="Close"></button>
{{< /example >}}
