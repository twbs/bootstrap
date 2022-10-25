---
layout: docs
title: Attribute Toggler
description: Toggle attributes or classes, using simple html markup
group: components
toc: true
---

## How it works

Attribute Toggler is a simple component, that preferable can be used to avoid writing small JavaScript snippets handle attributes toggling, during `click` events.
Manipulation id done on the same element or on a targeted element

**Heads up!** Toggler may handle all attributes, except `id's`


## Examples

### Toggle class

Below are some examples of class manipulation

{{< example >}}
<div class="card" data-bs-toggle="toggler" data-bs-value="bg-warning" data-bs-attribute="class">
  <div class="card-body">Click this card, to change `bg-color`</div>
</div>

<div class="card mt-2" data-bs-toggle="toggler" data-bs-value="text-danger" data-bs-attribute="class">
  <div class="card-body">Click this card, to change `text-color`</div>
</div>
{{< /example >}}


### Toggle class of another element

Using `data-bs-toggle`, combined with `data-bs-target`, can manipulate another element's attribute

{{< example >}}
<button class="btn btn-outline-primary" data-bs-toggle="toggler" data-bs-target="#togglerExample1">Click me</button>

<div id="togglerExample1" class="card mt-2" data-bs-value="bg-info" data-bs-attribute="class">
  <div class="card-body">Click this card, to change `bg-color`</div>
</div>
{{< /example >}}

### Toggle class of multiple elements

Using `data-bs-toggle`, combined with `data-bs-target`, can manipulate another element's attribute

{{< example >}}
<button class="btn btn-outline-primary" data-bs-toggle="toggler" data-bs-target=".togglerExampleClass1">Click me</button>

<div class="card mt-2 togglerExampleClass1" data-bs-value="bg-info" data-bs-attribute="class">
  <div class="card-body">Click this card, to change `bg-color`</div>
</div>

<div class="card mt-2 togglerExampleClass1" data-bs-value="bg-warning" data-bs-attribute="class">
  <div class="card-body">Click this card, to change `bg-color`</div>
</div>

<div class="card mt-2 togglerExampleClass1" data-bs-value="bg-info" data-bs-attribute="class">
  <div class="card-body">Click this card, to change `bg-color`</div>
</div>

{{< /example >}}


### Toggle attributes

Below are some examples of attributes manipulation

{{< example >}}
<div class="card" data-bs-toggle="toggler" data-bs-value="true" data-bs-attribute="hidden">
  <div class="card-body">Click this card, to change `hidden` attribute</div>
</div>
{{< /example >}}

### Toggle attributes of another element

Using `data-bs-toggle`, combined with `data-bs-target`, can manipulate another element's attribute

{{< example >}}
<button class="btn btn-outline-primary" data-bs-toggle="toggler" data-bs-target="#togglerExample2">Click to toggle `disabled` attribute on fieldset</button>

<fieldset class="mt-3" id="togglerExample2" data-bs-value="disabled" data-bs-attribute="disabled">
  <div class="mb-3">
    <label for="disabledTextInput" class="form-label">Input</label>
    <input type="text" id="disabledTextInput" class="form-control" placeholder="Disabled input">
  </div>
  <div class="mb-3">
    <label for="disabledSelect" class="form-label">Disabled select menu</label>
    <select id="disabledSelect" class="form-select">
      <option>Select</option>
    </select>
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</fieldset>

{{< /example >}}



### Via data attributes

#### Toggle

Add `data-bs-toggle="toggler"` to the element to automatically.
The `data-bs-target` is optional, and attribute accepts a CSS selector to apply the toggler functionality to.
Be sure to add the `data-bs-attribute` and `data-bs-value` attributes  on the toggled element's markup


### Via JavaScript

Using this component, programmatically is a bit of redundant, as the initial purpose of it is to avoid use js.
However, enable manually with:

```js
var togglerElementList = Array.prototype.slice.call(document.querySelectorAll('[data-bs-toggle="toggler"]'))
var togglerList = togglerElementList.map(function (togglerEl) {
  return new bootstrap.Toggler(togglerEl)
})
```

### Options

Options can be passed via data attributes or JavaScript. For data attributes, append the option name to `data-bs-`, as in `data-bs-value="foo"`.

{{< bs-table "table" >}}
| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `attribute` | string | `class` | The attribute which will be toggled on each click |
| `value` | string | null | Allow body scrolling while toggler is open |
{{< /bs-table >}}

### Methods

You can create a toggler instance using the constructor, for example:

```js
var myToggler = document.getElementById('myToggler')
var bsToggler = new bootstrap.Toggler(myToggler)
```

{{< bs-table "table" >}}
| Method | Description |
| --- | --- |
| `toggle` | Toggles a toggler element chosen attribute |
| `getInstance` | *Static* method which allows you to get the toggler instance associated with a DOM element |
| `getOrCreateInstance` | *Static* method which allows you to get the toggler instance associated with a DOM element, or create a new one in case it wasn't initialized |
{{< /bs-table >}}

### Events

Bootstrap's toggler class exposes a few events for hooking into toggler functionality.

{{< bs-table "table" >}}
| Event type | Description |
| --- | --- |
| `toggle.bs.toggler` | This event fires immediately when the `toggle` instance method is called. |
| `toggled.bs.toggler` | This event is fired when the instance's element attribute has been changed. |
{{< /bs-table >}}

```js
var myToggler = document.getElementById('myToggler')
myToggler.addEventListener('toggle.bs.toggler', function () {
  // do something...
})
```
