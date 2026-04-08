---
layout: docs
title: Animations
description: Use these helpers for quickly configuring the animation direction of an element.
group: helpers
aliases: "/docs/5.3/helpers/"
---

## animation-direction-normal

Sets the animation direction to "normal", which plays the animation forwards (default).

```html
<div class="animation-direction-normal">...</div>
```

## animation-direction-reverse

Sets the animation direction to "reverse", which plays the animation backwards.

```html
<div class="animation-direction-reverse">...</div>
```

## animation-direction-alternate

- `.animation-direction-alternate`: Sets the animation direction to "alternate", which plays the animation forwards and backwards alternately.

```html
<div class="animation-direction-alternate">...</div>
```

## animation-direction-alternate-reverse

- `.animation-direction-alternate-reverse`: Sets the animation direction to "alternate-reverse", which plays the animation backwards and forwards alternately.

```html
<div class="animation-direction-alternate-reverse">...</div>
```

## Example:

The following example shows how the class `animation-direction-alternate` was used to alternate the animation direction of a spinner-border.

{{< example >}}
<div class="spinner-border text-primary animation-direction-alternate" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
{{< /example >}}
