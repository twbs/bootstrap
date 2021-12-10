---
layout: docs
title: Input Badges
description: Input badges can be used to represent small blocks of information.
group: components
toc: true
---

## How it works

The input badges uses dismissable [badge]({{< docsref "/components/badge" >}}) internally to provide the functionality.

## Example

Add tags below by pressing "Enter" and click on the cross button to remove them.

{{< example >}}
<input class="form-control" type="text" data-bs-badges="input-badges" data-bs-colour="secondary" data-bs-rounded="false">
{{< /example >}}

## JavaScript behavior

### Initialize

Initialize elements as input badges

```js
var inputBadgesList = document.querySelectorAll('input[type="text"][data-bs-badges="input-badges"]')
var inputBadges = Array.prototype.slice.call(inputBadgesList).map(function (element) {
  return new bootstrap.InputBadges(element)
})
```

### Methods

<table class="table">
  <thead>
    <tr>
      <th>Method</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>dispose</code>
      </td>
      <td>
        Destroys an element's badge. (Removes stored data on the DOM element)
      </td>
    </tr>
    <tr>
      <td>
        <code>getInstance</code>
      </td>
      <td>
        Static method which allows you to get the badge instance associated to a DOM element, you can use it like this: <code>bootstrap.Badge.getInstance(badge)</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>getOrCreateInstance</code>
      </td>
      <td>
        Static method which returns an badge instance associated to a DOM element or create a new one in case it wasn't initialized.
        You can use it like this: <code>bootstrap.Badge.getOrCreateInstance(element)</code>
      </td>
    </tr>
  </tbody>
</table>

```js
var inputBadgesNode = document.querySelector('input[type="text"][data-bs-badges="input-badges"]')
var inputBadge = bootstrap.InputBadges.getInstance(inputBadgesNode)
inputBadge.dispose()
```

### Events

Bootstrap's input badges plugin exposes a few events for hooking into input badges functionality.

<table class="table">
  <thead>
    <tr>
      <th>Event</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>add.bs.input-badges</code></td>
      <td>
        Fires immediately 'Enter' is pressed and the input value is new and not empty.
      </td>
    </tr>
    <tr>
      <td><code>added.bs.input-badges</code></td>
      <td>
        Fires immediately after a new badge is added to the list.
      </td>
    </tr>
    <tr>
      <td><code>removed.bs.input-badges</code></td>
      <td>
        Fired after a badge is removed from the list.
      </td>
    </tr>
  </tbody>
</table>

```js
var inputBadges = document.getElementById('inputBadges')
inputBadges.addEventListener('add.bs.input-badges', function () {
  // do something, for instance, check the value to be added is valid
  // so it doesn't get to the field
})
```
