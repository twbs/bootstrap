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
- Toasts are opt-in for performance reasons, so **you must initialize them yourself**.
- Toasts will automatically hide if you do not specify `autohide: false`.

## Examples

### Basic

To encourage extensible and predictable toasts, we recommend a header and body. Toast headers use `display: flex`, allowing easy alignment of content thanks to our margin and flexbox utilities.

Toasts are as flexible as you need and have very little required markup. At a minimum, we require a single element to contain your "toasted" content and strongly encourage a dismiss button.

<div class="bg-light">
{% capture example %}
<div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
  <div class="toast-header">
    {% include icons/placeholder.svg width="20" height="20" background="#007aff" class="rounded mr-2" text=" " title=" " %}
    <strong class="mr-auto">Bootstrap</strong>
    <small>11 mins ago</small>
    <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="toast-body">
    Hello, world! This is a toast message.
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}
</div>

### Translucent

Toasts are slightly translucent, too, so they blend over whatever they might appear over. For browsers that support the `backdrop-filter` CSS property, we'll also attempt to blur the elements under a toast.

<div class="bg-dark">
{% capture example %}
<div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
  <div class="toast-header">
    {% include icons/placeholder.svg width="20" height="20" background="#007aff" class="rounded mr-2" text=" " title=" " %}
    <strong class="mr-auto">Bootstrap</strong>
    <small class="text-muted">11 mins ago</small>
    <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="toast-body">
    Hello, world! This is a toast message.
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}
</div>

### Stacking

When you have multiple toasts, we default to vertiaclly stacking them in a readable manner.

<div class="bg-light">
{% capture example %}
<div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
  <div class="toast-header">
    {% include icons/placeholder.svg width="20" height="20" background="#007aff" class="rounded mr-2" text=" " title=" " %}
    <strong class="mr-auto">Bootstrap</strong>
    <small class="text-muted">just now</small>
    <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="toast-body">
    See? Just like this.
  </div>
</div>

<div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
  <div class="toast-header">
    {% include icons/placeholder.svg width="20" height="20" background="#007aff" class="rounded mr-2" text=" " title=" " %}
    <strong class="mr-auto">Bootstrap</strong>
    <small class="text-muted">2 seconds ago</small>
    <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="toast-body">
    Heads up, toasts will stack automatically
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}
</div>

## Placement

Place toasts with custom CSS as you need them. The top right is often used for notifications, as is the top middle. If you're only ever going to show one toast at a time, put the positioning styles right on the `.toast`.

<div class="bg-dark">
{% capture example %}
<div aria-live="polite" aria-atomic="true" style="position: relative; min-height: 200px;">
  <div class="toast" style="position: absolute; top: 0; right: 0;">
    <div class="toast-header">
      {% include icons/placeholder.svg width="20" height="20" background="#007aff" class="rounded mr-2" text=" " title=" " %}
      <strong class="mr-auto">Bootstrap</strong>
      <small>11 mins ago</small>
      <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
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
<div aria-live="polite" aria-atomic="true" style="position: relative; min-height: 200px;">
  <!-- Position it -->
  <div style="position: absolute; top: 0; right: 0;">

    <!-- Then put toasts within -->
    <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header">
        {% include icons/placeholder.svg width="20" height="20" background="#007aff" class="rounded mr-2" text=" " title=" " %}
        <strong class="mr-auto">Bootstrap</strong>
        <small class="text-muted">just now</small>
        <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="toast-body">
        See? Just like this.
      </div>
    </div>

    <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header">
        {% include icons/placeholder.svg width="20" height="20" background="#007aff" class="rounded mr-2" text=" " title=" " %}
        <strong class="mr-auto">Bootstrap</strong>
        <small class="text-muted">2 seconds ago</small>
        <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
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

You can also get fancy with flexbox utilities to align toasts horizontally and/or vertically.

<div class="bg-dark">
{% capture example html %}
<!-- Flexbox container for aligning the toasts -->
<div aria-live="polite" aria-atomic="true" class="d-flex justify-content-center align-items-center" style="min-height: 200px;">

  <!-- Then put toasts within -->
  <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-header">
      {% include icons/placeholder.svg width="20" height="20" background="#007aff" class="rounded mr-2" text=" " title=" " %}
      <strong class="mr-auto">Bootstrap</strong>
      <small>11 mins ago</small>
      <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="toast-body">
      Hello, world! This is a toast message.
    </div>
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}
</div>

## Accessibility

Toasts are intended to be small interruptions to your visitors or users, so to help those with screen readers and similar assistive technologies, you should wrap your toasts in an [`aria-live` region](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions). Changes to live regions (such as injecting/updating a toast component) are automatically announced by screen readers without needing to move the user's focus or otherwise interrupt the user. Additionally, include `aria-atomic="true"` to ensure that the entire toast is always announced as a single (atomic) unit, rather than announcing what was changed (which could lead to problems if you only update part of the toast's content, or if displaying the same toast content at a later point in time). If the information needed is important for the process, e.g. for a list of errors in a form, then use the [alert component]({{ site.baseurl }}/docs/{{ site.docs_version }}/components/alerts/) instead of toast.

Note that the live region needs to be present in the markup *before* the toast is generated or updated. If you dynamically generate both at the same time and inject them into the page, they will generally not be announced by assistive technologies.

You also need to adapt the `role` and `aria-live` level depending on the content. If it's an important message like an error, use `role="alert" aria-live="assertive"`, otherwise use `role="status" aria-live="polite"` attributes.

As the content you're displaying changes, be sure to update the [`delay` timeout](#options) to ensure people have enough time to read the toast.

{% highlight html %}
<div class="toast" role="alert" aria-live="polite" aria-atomic="true" data-delay="10000">
  <div role="alert" aria-live="assertive" aria-atomic="true">...</div>
</div>
{% endhighlight %}

When using `autohide: false`, you must add a close button to allow users to dismiss the toast.

<div class="bg-light">
{% capture example %}
<div role="alert" aria-live="assertive" aria-atomic="true" class="toast" data-autohide="false">
  <div class="toast-header">
    {% include icons/placeholder.svg width="20" height="20" background="#007aff" class="rounded mr-2" text=" " title=" " %}
    <strong class="mr-auto">Bootstrap</strong>
    <small>11 mins ago</small>
    <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="toast-body">
    Hello, world! This is a toast message.
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
      <td>number</td>
      <td>
        <code>500</code>
      </td>
      <td>Delay hiding the toast (ms)</td>
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
