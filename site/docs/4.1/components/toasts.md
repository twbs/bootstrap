---
layout: docs
title: Toasts
description: Push notifications to your visitors with a toast, a lightweight and easily customizable alert message.
group: components
toc: true
---

Toasts are lightweight notifications designed to mimic the push notifications that have been popularized by mobile and desktop operating systems. They're built with flexbox, so they're easy to align and position.

## Overview

Things to know when using the toast plugin:

- If you're building our JavaScript from source, it [requires `util.js`]({{ site.baseurl }}/docs/{{ site.docs_version }}/getting-started/javascript/#util).
- Toast are opt-in for performance reasons, so **you must initialize them yourself**.
- Toast will auto hide if you do not specify `autohide: false`

Got all that? Great, let's see how they work with some examples.

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

## JavaScript behavior

### Usage

Initialize toasts via JavaScript:

{% highlight js %}
$('.toast').toast(option)
{% endhighlight %}

### Options

Options can be passed via data attributes or JavaScript. For data attributes, append the option name to `data-`, as in `data-animation=""`.

<table class="table table-bordered table-striped">
  <thead>
    <tr>
      <th style="width: 100px;">Name</th>
      <th style="width: 100px;">Type</th>
      <th style="width: 50px;">Default</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>animation</td>
      <td>boolean</td>
      <td>true</td>
      <td>Apply a CSS fade transition to the toast</td>
    </tr>
    <tr>
      <td>autohide</td>
      <td>boolean</td>
      <td>true</td>
      <td>Auto hide the toast</td>
    </tr>
    <tr>
      <td>delay</td>
      <td>number | object</td>
      <td>
        <code>{ show: 0, hide: 500 }</code>
      </td>
      <td>
        <p>Delay showing and hiding the toast (ms)</p>
        <p>If a number is supplied, delay is applied to both hide/show</p>
        <p>Object structure is: <code>delay: { "show": 500, "hide": 100 }</code></p>
      </td>
    </tr>
  </tbody>
</table>

### Methods

{% include callout-danger-async-methods.md %}

#### `$().toast(options)`

Attaches a toast handler to an element collection.

#### `.toast('show')`

Reveals an element's toast. **Returns to the caller before the toast has actually been shown** (i.e. before the `shown.bs.toast` event occurs).
You have to manually call this method, instead your toast won't show.

{% highlight js %}$('#element').toast('show'){% endhighlight %}

#### `.toast('hide')`

Hides an element's toast. **Returns to the caller before the toast has actually been hidden** (i.e. before the `hidden.bs.toast` event occurs). You have to manually call this method if you made `autohide` to `false`.

{% highlight js %}$('#element').toast('hide'){% endhighlight %}

#### `.toast('dispose')`

Hides an element's toast. Your toast will remain on the DOM but won't show anymore.

{% highlight js %}$('#element').toast('dispose'){% endhighlight %}

### Events

<table class="table table-bordered table-striped">
  <thead>
    <tr>
      <th style="width: 150px;">Event Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>show.bs.toast</td>
      <td>This event fires immediately when the <code>show</code> instance method is called.</td>
    </tr>
    <tr>
      <td>shown.bs.toast</td>
      <td>This event is fired when the toast has been made visible to the user.</td>
    </tr>
    <tr>
      <td>hide.bs.toast</td>
      <td>This event is fired immediately when the <code>hide</code> instance method has been called.</td>
    </tr>
    <tr>
      <td>hidden.bs.toast</td>
      <td>This event is fired when the toast has finished being hidden from the user.</td>
    </tr>
  </tbody>
</table>

{% highlight js %}
$('#myToast').on('hidden.bs.toast', function () {
  // do something…
})
{% endhighlight %}
