---
layout: docs
title: Select
description: Customize the native `<select>`s with custom CSS that changes the element's initial appearance.
group: forms
toc: true
---

## Default

Custom `<select>` menus need only a custom class, `.form-select` to trigger the custom styles. Custom styles are limited to the `<select>`'s initial appearance and cannot modify the `<option>`s due to browser limitations.

{{< example >}}
<select class="form-select" aria-label="Default select example">
  <option selected>Open this select menu</option>
  <option value="1">One</option>
  <option value="2">Two</option>
  <option value="3">Three</option>
</select>
{{< /example >}}

## Sizing

You may also choose from small and large custom selects to match our similarly sized text inputs.

{{< example >}}
<select class="form-select form-select-lg mb-3" aria-label=".form-select-lg example">
  <option selected>Open this select menu</option>
  <option value="1">One</option>
  <option value="2">Two</option>
  <option value="3">Three</option>
</select>

<select class="form-select form-select-sm" aria-label=".form-select-sm example">
  <option selected>Open this select menu</option>
  <option value="1">One</option>
  <option value="2">Two</option>
  <option value="3">Three</option>
</select>
{{< /example >}}

The `multiple` attribute is also supported:

{{< example >}}
<select class="form-select" multiple aria-label="multiple select example">
  <option selected>Open this select menu</option>
  <option value="1">One</option>
  <option value="2">Two</option>
  <option value="3">Three</option>
</select>
{{< /example >}}

As is the `size` attribute:

{{< example >}}
<select class="form-select" size="3" aria-label="size 3 select example">
  <option selected>Open this select menu</option>
  <option value="1">One</option>
  <option value="2">Two</option>
  <option value="3">Three</option>
</select>
{{< /example >}}

## With icons

Like our textual `.form-control`, you can overlay icons on `.form-select`s. See the [form control with icon docs]({{< docsref "/forms/form-control#with-icons" >}}) for more details.

{{< example >}}
<label for="formSelectWithIcon" class="form-label">Choose one</label>
<div class="form-control-with-icon">
  <select class="form-select" aria-label="Default select example" id="formSelectWithIcon">
    <option selected>Open this select menu</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
  </select>
  <div class="form-control-icon">
    <svg width="1em" height="1em" viewBox="0 0 16 16"  fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" d="M2.5 11.5A.5.5 0 0 1 3 11h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 7h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 3h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
    </svg>
  </div>
</div>
{{< /example >}}

### Spinners

You can also place any of Bootstrap's [spinners]({{< docsref "/components/spinners" >}}) within the `.form-control-icon`.

{{< example >}}
<label for="formSelectWithSpinner" class="form-label">Choose one</label>
<div class="form-control-with-icon">
  <select class="form-select" aria-label="Default select example" id="formSelectWithSpinner">
    <option selected>Open this select menu</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
  </select>
  <div class="form-control-icon">
    <div class="spinner-border spinner-border-sm" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</div>
{{< /example >}}

### Sizing

Add `.form-select-sm` or `.form-select-lg` to your `.form-select` and the `.form-control-icon` will automatically resize. However, the sizing of the icons themselves is up to you.

{{< example >}}
<label for="formSelectWithIconSm" class="form-label">Choose one</label>
<div class="form-control-with-icon">
  <select class="form-select form-select-sm" aria-label="Default select example" id="formSelectWithIconSm">
    <option selected>Open this select menu</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
  </select>
  <div class="form-control-icon">
    <svg width="1em" height="1em" viewBox="0 0 16 16"  fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" d="M2.5 11.5A.5.5 0 0 1 3 11h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 7h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 3h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
    </svg>
  </div>
</div>
{{< /example >}}

{{< example >}}
<label for="formSelectWithIconLg" class="form-label">Choose one</label>
<div class="form-control-with-icon">
  <select class="form-select form-select-lg" aria-label="Large select example" id="formSelectWithIconLg">
    <option selected>Open this select menu</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
  </select>
  <div class="form-control-icon">
    <svg width="1.5em" height="1.5em" viewBox="0 0 16 16"  fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" d="M2.5 11.5A.5.5 0 0 1 3 11h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 7h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 3h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
    </svg>
  </div>
</div>
{{< /example >}}
