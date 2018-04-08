---
layout: docs
title: Toasts
description: Push notifications to your visitors with a toast, a lightweight and easily customizable alert message.
group: components
toc: true
---

Toasts are lightweight notifications designed to mimic the push notifications that have been popularized by mobile and desktop operating systems. They're built with flexbox, so they're easy to align and position.

## Examples

A basic toast can include a header (though it doesn't strictly need one) with whatever contents you like. The header is also `display: flex`, so `.mr-auto` and `.ml-auto` can be used for easy pushing of content, as well as all our flexbox utilities.

<div class="bg-light">
{% capture example %}
<div class="toast">
  <div class="toast-header">
    <img class="rounded mr-2" data-src="holder.js/20x20?size=1&text=.&bg=#007aff" alt="">
    <strong class="mr-auto">Bootstrap</strong>
    <small>11 mins ago</small>
  </div>
  <div class="toast-body">
    Hello, world! This is a toast message.
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}
</div>

They're slightly translucent, too, so they blend over whatever they might appear over. For browsers that support `backdrop-filter`, we'll also attempt to blur the elements under a toast.

<div class="bg-dark">
{% capture example %}
<div class="toast">
  <div class="toast-header">
    <img class="rounded mr-2" data-src="holder.js/20x20?size=1&text=.&bg=#007aff" alt="">
    <strong class="mr-auto">Bootstrap</strong>
    <small class="text-muted">11 mins ago</small>
  </div>
  <div class="toast-body">
    Hello, world! This is a toast message.
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}
</div>

Plus, they'll easily stack.

<div class="bg-light">
{% capture example %}
<div class="toast">
  <div class="toast-header">
    <img class="rounded mr-2" data-src="holder.js/20x20?size=1&text=.&bg=#007aff" alt="">
    <strong class="mr-auto">Bootstrap</strong>
    <small class="text-muted">just now</small>
  </div>
  <div class="toast-body">
    See? Just like this.
  </div>
</div>

<div class="toast">
  <div class="toast-header">
    <img class="rounded mr-2" data-src="holder.js/20x20?size=1&text=.&bg=#007aff" alt="">
    <strong class="mr-auto">Bootstrap</strong>
    <small class="text-muted">2 seconds ago</small>
  </div>
  <div class="toast-body">
    Heads up, toasts will stack automatically
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}
</div>

## Accessibility

Toasts are intended to be small interruptions to your visitors or users, so to help those on screen readers, you should wrap your toasts in an [`aria-live` region](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions). This allows screen readers the ability to see suggested interruptions without any visual cues.

{% highlight html %}
<div role="region" aria-live="polite">
  <div class="toast">...</div>
</div>
{% endhighlight %}

## Placement

Place toasts with custom CSS as you need them. The top right is often used for notifications, as is the top middle. If you're only ever going to show one toast at a time, put the positioning styles right on the `.toast.`

<div class="bg-dark">
{% capture example %}
<div style="position: relative; min-height: 200px;">
  <div class="toast" style="position: absolute; top: 0; right: 0;">
    <div class="toast-header">
      <img class="rounded mr-2" data-src="holder.js/20x20?size=1&text=.&bg=#007aff" alt="">
      <strong class="mr-auto">Bootstrap</strong>
      <small>11 mins ago</small>
    </div>
    <div class="toast-body">
      Hello, world! This is a toast message.
    </div>
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}
</div>

For systems that generate more notifications, consider using a wrapping element so they can easily stack.

<div class="bg-dark">
{% capture example %}
<div style="position: relative; min-height: 200px;">
  <!-- Position it -->
  <div style="position: absolute; top: 0; right: 0;">

    <!-- Then put toasts within -->
    <div class="toast">
      <div class="toast-header">
        <img class="rounded mr-2" data-src="holder.js/20x20?size=1&text=.&bg=#007aff" alt="">
        <strong class="mr-auto">Bootstrap</strong>
        <small class="text-muted">just now</small>
      </div>
      <div class="toast-body">
        See? Just like this.
      </div>
    </div>

    <div class="toast">
      <div class="toast-header">
        <img class="rounded mr-2" data-src="holder.js/20x20?size=1&text=.&bg=#007aff" alt="">
        <strong class="mr-auto">Bootstrap</strong>
        <small class="text-muted">2 seconds ago</small>
      </div>
      <div class="toast-body">
        Heads up, toasts will stack automatically
      </div>
    </div>
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}
</div>

You can also get fancy with flexbox utilities.

<div class="bg-dark">
{% capture example html %}
<div style="position: relative; min-height: 200px;">
  <!-- Position it -->
  <div class="d-flex justify-content-center" style="position: absolute; top: 0; right: 0; left: 0;">

    <!-- Then put toasts within -->
    <div class="toast">
      <div class="toast-header">
        <img class="rounded mr-2" data-src="holder.js/20x20?size=1&text=.&bg=#007aff" alt="">
        <strong class="mr-auto">Bootstrap</strong>
        <small>11 mins ago</small>
      </div>
      <div class="toast-body">
        Hello, world! This is a toast message.
      </div>
    </div>
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}
</div>
