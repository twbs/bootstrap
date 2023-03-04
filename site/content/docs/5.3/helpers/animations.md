---
layout: docs
title: Animations
description: Customize the animation direction of all the different components.
group: helpers
aliases: "/docs/5.3/helpers/"
---

Easily customize `animation-direction`s by adding the appropriate class.

The available classes:

```scss
.animation-direction-normal{
  animation-direction: normal;
}
.animation-direction-reverse{
  animation-direction: reverse;
}
.animation-direction-alternate{
  animation-direction: alternate;
}
.animation-direction-alternate-reverse{
  animation-direction: alternate-reverse;
}
```



The following example shows how the class `animation-direction-reverse` was used to reverse the animation direction of a spinner-border.

{{< example >}}
<div class="spinner-border text-primary animation-direction-reverse" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
{{< /example >}}
