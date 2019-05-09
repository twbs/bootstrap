---
layout: docs
title: Forms
description: Examples and usage guidelines for form control styles, layout options, and custom components for creating a wide variety of forms.
group: forms
toc: true
subpages:
  - title: Overview
  - title: Layout
  - title: Form control
  - title: Select
  - title: Checks
  - title: File
  - title: Range
  - title: Input group
  - title: Validation
---

<div class="row mt-5">
  <div class="col-md-4 mb-3 d-none">
    <a class="d-block p-4 bg-light rounded text-decoration-none" href="../overview/">
      <strong class="d-block h5 mb-0">Overview</strong>
      <span class="text-secondary">Learn about Bootstrap's form components, behaviors, and more.</span>
    </a>
  </div>
  <div class="col-md-4 mb-3">
    <a class="d-block p-4 bg-light rounded text-decoration-none" href="../layout/">
      <strong class="d-block h5 mb-0">Layout</strong>
      <span class="text-secondary">Create inline, horizontal, or complex grid-based layouts with your forms.</span>
    </a>
  </div>
  <div class="col-md-4 mb-3">
    <a class="d-block p-4 bg-light rounded text-decoration-none" href="../form-control/">
      <strong class="d-block h5 mb-0">Form control</strong>
      <span class="text-secondary">Style textual inputs and textareas quickly and easily.</span>
    </a>
  </div>
  <div class="col-md-4 mb-3">
    <a class="d-block p-4 bg-light rounded text-decoration-none" href="../select/">
      <strong class="d-block h5 mb-0">Select</strong>
      <span class="text-secondary">Create browser-default select menus with a custom initial appearance.</span>
    </a>
  </div>
  <div class="col-md-4 mb-3">
    <a class="d-block p-4 bg-light rounded text-decoration-none" href="../checks/">
      <strong class="d-block h5 mb-0">Checks</strong>
      <span class="text-secondary">Learn how to use our custom radios and checkboxes.</span>
    </a>
  </div>
  <div class="col-md-4 mb-3">
    <a class="d-block p-4 bg-light rounded text-decoration-none" href="../file/">
      <strong class="d-block h5 mb-0">File</strong>
      <span class="text-secondary">Replace a native file input with our custom version.</span>
    </a>
  </div>
  <div class="col-md-4 mb-3">
    <a class="d-block p-4 bg-light rounded text-decoration-none" href="../range/">
      <strong class="d-block h5 mb-0">Range</strong>
      <span class="text-secondary">Style the range input type with our custom CSS.</span>
    </a>
  </div>
  <div class="col-md-4 mb-3">
    <a class="d-block p-4 bg-light rounded text-decoration-none" href="../input-group/">
      <strong class="d-block h5 mb-0">Input group</strong>
      <span class="text-secondary">Attach labels and buttons to your inputs for increased semantic value.</span>
    </a>
  </div>
  <div class="col-md-4 mb-3">
    <a class="d-block p-4 bg-light rounded text-decoration-none" href="../validation/">
      <strong class="d-block h5 mb-0">Validation</strong>
      <span class="text-secondary">Validate your forms with custom or native validation behaviors and styles.</span>
    </a>
  </div>
</div>

## Overview

Bootstrap's form controls expand on [our Rebooted form styles]({{< docsref "/content/reboot#forms" >}}) with classes. Use these classes to opt into their customized displays for a more consistent rendering across browsers and devices.

Be sure to use an appropriate `type` attribute on all inputs (e.g., `email` for email address or `number` for numerical information) to take advantage of newer input controls like email verification, number selection, and more.

Here's a quick example to demonstrate Bootstrap's form styles. Keep reading for documentation on required classes, form layout, and more.

{{< example >}}
<form>
  <div class="form-group">
    <label for="exampleInputEmail1">Email address</label>
    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
    <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
  </div>
  <div class="form-group">
    <label for="exampleInputPassword1">Password</label>
    <input type="password" class="form-control" id="exampleInputPassword1">
  </div>
  <div class="form-group form-check">
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
<label for="inputPassword5">Password</label>
<input type="password" id="inputPassword5" class="form-control" aria-describedby="passwordHelpBlock">
<small id="passwordHelpBlock" class="form-text text-muted">
  Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
</small>
{{< /example >}}

Inline text can use any typical inline HTML element (be it a `<small>`, `<span>`, or something else) with nothing more than a utility class.

{{< example >}}
<form class="form-inline">
  <div class="form-group">
    <label for="inputPassword6">Password</label>
    <input type="password" id="inputPassword6" class="form-control mx-sm-3" aria-describedby="passwordHelpInline">
    <small id="passwordHelpInline" class="text-muted">
      Must be 8-20 characters long.
    </small>
  </div>
</form>
{{< /example >}}

## Disabled forms

Add the `disabled` boolean attribute on an input to prevent user interactions and make it appear lighter.

{{< highlight html >}}
<input class="form-control" id="disabledInput" type="text" placeholder="Disabled input here..." disabled>
{{< /highlight >}}

Add the `disabled` attribute to a `<fieldset>` to disable all the controls within.

{{< example >}}
<form>
  <fieldset disabled>
    <div class="form-group">
      <label for="disabledTextInput">Disabled input</label>
      <input type="text" id="disabledTextInput" class="form-control" placeholder="Disabled input">
    </div>
    <div class="form-group">
      <label for="disabledSelect">Disabled select menu</label>
      <select id="disabledSelect" class="form-control">
        <option>Disabled select</option>
      </select>
    </div>
    <div class="form-group">
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

{{< callout warning >}}
##### Caveat with anchors

By default, browsers will treat all native form controls (`<input>`, `<select>` and `<button>` elements) inside a `<fieldset disabled>` as disabled, preventing both keyboard and mouse interactions on them. However, if your form also includes `<a ... class="btn btn-*">` elements, these will only be given a style of `pointer-events: none`.
{{< /callout >}}
