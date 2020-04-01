---
layout: docs
title: Forms
description: Examples and usage guidelines for form control styles, layout options, and custom components for creating a wide variety of forms.
group: forms
toc: true
aliases: "/docs/4.3/forms/"
sections:
  - title: Form control
    description: Style textual inputs and textareas with support for multiple states.
  - title: Select
    description: Improve browser default select elements with a custom initial appearance.
  - title: Checks
    description: Use our custom radio buttons and checkboxes in forms for selecting input options.
  - title: File
    description: Replace browser default file inputs with our custom version with optional JavaScript.
  - title: Range
    description: Replace browser default range inputs with our custom version.
  - title: Input group
    description: Attach labels and buttons to your inputs for increased semantic value.
  - title: Layout
    description: Create inline, horizontal, or complex grid-based layouts with your forms.
  - title: Validation
    description: Validate your forms with custom or native validation behaviors and styles.
---

## Overview

Bootstrap's form controls expand on [our Rebooted form styles]({{< docsref "/content/reboot#forms" >}}) with classes. Use these classes to opt into their customized displays for a more consistent rendering across browsers and devices.

Be sure to use an appropriate `type` attribute on all inputs (e.g., `email` for email address or `number` for numerical information) to take advantage of newer input controls like email verification, number selection, and more.

Here's a quick example to demonstrate Bootstrap's form styles. Keep reading for documentation on required classes, form layout, and more.

{{< example >}}
<form>
  <div class="mb-3">
    <label for="exampleInputEmail1" class="form-label">Email address</label>
    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
    <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
  </div>
  <div class="mb-3">
    <label for="exampleInputPassword1" class="form-label">Password</label>
    <input type="password" class="form-control" id="exampleInputPassword1">
  </div>
  <div class="mb-3 form-check">
    <input type="checkbox" class="form-check-input" id="exampleCheck1">
    <label class="form-check-label" for="exampleCheck1">Check me out</label>
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>
{{< /example >}}

## Help text

Block-level help text in forms can be created using `.form-text` (previously known as `.help-block` in v3). Inline help text can be flexibly implemented using any inline HTML element and utility classes like `.text-muted`.

{{< callout warning >}}
##### Associating help text with form controls

Help text should be explicitly associated with the form control it relates to using the `aria-describedby` attribute. This will ensure that assistive technologies—such as screen readers—will announce this help text when the user focuses or enters the control.
{{< /callout >}}

Help text below inputs can be styled with `.form-text`. This class includes `display: block` and adds some top margin for easy spacing from the inputs above.

{{< example >}}
<label for="inputPassword5" class="form-label">Password</label>
<input type="password" id="inputPassword5" class="form-control" aria-describedby="passwordHelpBlock">
<small id="passwordHelpBlock" class="form-text text-muted">
  Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
</small>
{{< /example >}}

Inline text can use any typical inline HTML element (be it a `<small>`, `<span>`, or something else) with nothing more than a utility class.

{{< example >}}
<div class="row g-3 align-items-center">
  <div class="col-auto">
    <label for="inputPassword6" class="col-form-label">Password</label>
  </div>
  <div class="col-auto">
    <input type="password" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline">
  </div>
  <div class="col-auto">
    <small id="passwordHelpInline" class="text-muted">
      Must be 8-20 characters long.
    </small>
  </div>
</div>
{{< /example >}}

## Disabled forms

Add the `disabled` boolean attribute on an input to prevent user interactions and make it appear lighter.

{{< highlight html >}}
<input class="form-control" id="disabledInput" type="text" placeholder="Disabled input here..." disabled>
{{< /highlight >}}

Add the `disabled` attribute to a `<fieldset>` to disable all the controls within.

By default, browsers will treat all native form controls (`<input>`, `<select>`, and `<button>` elements) inside a `<fieldset disabled>` as disabled, preventing both keyboard and mouse interactions on them. However, if your form also includes `<a ... class="btn btn-*">` elements, these will only be given a style of `pointer-events: none`.

{{< example >}}
<form>
  <fieldset disabled aria-label="Disabled fieldset example">
    <div class="mb-3">
      <label for="disabledTextInput" class="form-label">Disabled input</label>
      <input type="text" id="disabledTextInput" class="form-control" placeholder="Disabled input">
    </div>
    <div class="mb-3">
      <label for="disabledSelect" class="form-label">Disabled select menu</label>
      <select id="disabledSelect" class="form-select">
        <option>Disabled select</option>
      </select>
    </div>
    <div class="mb-3">
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="disabledFieldsetCheck" disabled>
        <label class="form-check-label" for="disabledFieldsetCheck">
          Can't check this
        </label>
      </div>
    </div>
    <button type="submit" class="btn btn-primary">Submit</button>
  </fieldset>
</form>
{{< /example >}}
