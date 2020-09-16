---
layout: docs
title: Input group
description: Extend form controls by adding text, buttons, or button groups on either side of textual inputs, custom selects, and custom file inputs.
group: forms
toc: true
---

## Overview

In an effort to streamline our components and still support form validation styles, input groups have been drastically simplified in Bootstrap 5. We no longer support multiple addons, multiple buttons, multiple form controls, dropdowns, and segmented button dropdowns. If you find yourself needing these, we suggest using standard form controls, buttons, and dropdowns in an inline form layout.

With v5, `.input-group` has been replaced by direction-specific classes `.input-group-start` and `.input-group-end`. The naming scheme here pulls from CSS's flex box and logical properties. For example, instead of _left_, we use _start_.

Place one add-on or button on either side of an input. Remember to place `<label>`s outside the input group.

{{< example >}}
<div class="input-group-start mb-3">
  <span class="input-group-text" id="inputGroupStart01">@</span>
  <input type="text" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="inputGroupStart01">
</div>

<div class="input-group-end">
  <input type="text" class="form-control" placeholder="100" aria-label="Amount" aria-describedby="inputGroupEnd01">
  <span class="input-group-text" id="inputGroupEnd01">.00</span>
</div>
{{< /example >}}

## Supported configurations

As mentioned, there are significantly fewer supported options for input groups in v5. To start, here are the supported form controls:

- `.form-control` (`<input>` and `<textarea>`)
- `.form-select` (without `multiple` or `size`)
- `.form-file`

Configurations that are supported include:

- Text or button before a form control
- Text or button after a form control

See how these form controls come together with text or button addons in our supported configurations below.

### Text addons

Use `.input-group-text` as starting and ending addons with our supported form controls.

{{< example >}}
<div class="input-group-start mb-3">
  <span class="input-group-text" id="inputGroupStart02">@</span>
  <input type="text" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="inputGroupStart02">
</div>

<div class="input-group-end">
  <input type="text" class="form-control" placeholder="100" aria-label="Amount" aria-describedby="inputGroupEnd02">
  <span class="input-group-text" id="inputGroupEnd02">.00</span>
</div>
{{< /example >}}

{{< example >}}
<div class="input-group-start mb-3">
  <span class="input-group-text">With textarea</span>
  <textarea class="form-control" aria-label="With textarea"></textarea>
</div>

<div class="input-group-end">
  <textarea class="form-control" aria-label="With textarea"></textarea>
  <span class="input-group-text">With textarea</span>
</div>
{{< /example >}}

{{< example >}}
<div class="input-group-start mb-3">
  <label class="input-group-text" for="inputGroupSelect01">Options</label>
  <select class="form-select" id="inputGroupSelect01">
    <option selected>Choose...</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
  </select>
</div>

<div class="input-group-end">
  <select class="form-select" id="inputGroupSelect02">
    <option selected>Choose...</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
  </select>
  <label class="input-group-text" for="inputGroupSelect02">Options</label>
</div>
{{< /example >}}

{{< example >}}
<div class="input-group-start mb-3">
  <span class="input-group-text" id="inputGroupFileAddon01">Upload</span>
  <div class="form-file">
    <input type="file" class="form-file-input" id="inputGroupFile01" aria-describedby="inputGroupFileAddon01">
    <label class="form-file-label" for="inputGroupFile01">
      <span class="form-file-text">Choose file...</span>
      <span class="form-file-button">Browse</span>
    </label>
  </div>
</div>

<div class="input-group-end">
  <div class="form-file">
    <input type="file" class="form-file-input" id="inputGroupFile02">
    <label class="form-file-label" for="inputGroupFile02" aria-describedby="inputGroupFileAddon02">
      <span class="form-file-text">Choose file...</span>
      <span class="form-file-button">Browse</span>
    </label>
  </div>
  <span class="input-group-text" id="inputGroupFileAddon02">Upload</span>
</div>
{{< /example >}}

### Button addons

Use `.btn`s as starting and ending addons with our supported form controls.

{{< example >}}
<div class="input-group-start mb-3">
  <button class="btn btn-outline-secondary" type="button" id="buttonAddon01">Button</button>
  <input type="text" class="form-control" placeholder="" aria-label="Example text with button addon" aria-describedby="buttonAddon01">
</div>

<div class="input-group-end">
  <input type="text" class="form-control" placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="buttonAddon02">
  <button class="btn btn-outline-secondary" type="button" id="buttonAddon02">Button</button>
</div>
{{< /example >}}

{{< example >}}
<div class="input-group-start mb-3">
  <button class="btn btn-outline-secondary" type="button" id="buttonAddon03">Button</button>
  <textarea class="form-control" aria-label="With textarea" aria-describedby="buttonAddon03"></textarea>
</div>

<div class="input-group-end">
  <textarea class="form-control" aria-label="With textarea" aria-describedby="buttonAddon04"></textarea>
  <button class="btn btn-outline-secondary" type="button" id="buttonAddon04">Button</button>
</div>
{{< /example >}}

{{< example >}}
<div class="input-group-start mb-3">
  <button class="btn btn-outline-secondary" type="button" id="buttonAddon05">Button</button>
  <select class="form-select" id="inputGroupSelect03" aria-label="Example select with button addon" aria-describedby="buttonAddon05">
    <option selected>Choose...</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
  </select>
</div>

<div class="input-group-end">
  <select class="form-select" id="inputGroupSelect04" aria-label="Example select with button addon" aria-describedby="buttonAddon06">
    <option selected>Choose...</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
  </select>
  <button class="btn btn-outline-secondary" type="button" id="buttonAddon06">Button</button>
</div>
{{< /example >}}

{{< example >}}
<div class="input-group-start mb-3">
  <button class="btn btn-outline-secondary" type="button" id="buttonAddon07">Button</button>
  <div class="form-file">
    <input type="file" class="form-file-input" id="inputGroupFile03" aria-describedby="buttonAddon07">
    <label class="form-file-label" for="inputGroupFile03">
      <span class="form-file-text">Choose file...</span>
      <span class="form-file-button">Browse</span>
    </label>
  </div>
</div>

<div class="input-group-end">
  <div class="form-file">
    <input type="file" class="form-file-input" id="inputGroupFile04" aria-describedby="buttonAddon08">
    <label class="form-file-label" for="inputGroupFile04">
      <span class="form-file-text">Choose file...</span>
      <span class="form-file-button">Browse</span>
    </label>
  </div>
  <button class="btn btn-outline-secondary" type="button" id="buttonAddon08">Button</button>
</div>
{{< /example >}}

## Wrapping

Input groups wrap by default via `flex-wrap: wrap` in order to accommodate custom form field validation within an input group. You may disable this with `.flex-nowrap`.

{{< example >}}
<div class="input-group-start flex-nowrap">
  <span class="input-group-text" id="addon-wrapping">@</span>
  <input type="text" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="addon-wrapping">
</div>
{{< /example >}}

## Sizing

Add the relative form sizing classes to the `.input-group` itself and contents within will automatically resize—no need for repeating the form control size classes on each element.

**Sizing on the individual input group elements isn't supported.**

{{< example >}}
<div class="input-group-start input-group-sm mb-3">
  <span class="input-group-text" id="inputGroup-sizing-sm">Small</span>
  <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
</div>

<div class="input-group-start mb-3">
  <span class="input-group-text" id="inputGroup-sizing-default">Default</span>
  <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default">
</div>

<div class="input-group-start input-group-lg">
  <span class="input-group-text" id="inputGroup-sizing-lg">Large</span>
  <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg">
</div>
{{< /example >}}

## Checkboxes and radios

While `.input-group-text` is primarily for adding on text, you can also place any checkbox or radio option within instead of text.

{{< example >}}
<div class="input-group-start mb-3">
  <div class="input-group-text">
    <input class="form-check-input" type="checkbox" value="" aria-label="Checkbox for following text input">
  </div>
  <input type="text" class="form-control" aria-label="Text input with checkbox">
</div>

<div class="input-group-start">
  <div class="input-group-text">
    <input class="form-check-input" type="radio" value="" aria-label="Radio button for following text input">
  </div>
  <input type="text" class="form-control" aria-label="Text input with radio button">
</div>
{{< /example >}}

## Form validation

With the rewritten input group in v5, form validation is supported without v4's longstanding rounded corner bug. [See the form validation page]({{< docsref "/forms/validation" >}}) for more information.

{{< example >}}
<label for="validationCustomUsername" class="form-label">Username</label>
<div class="input-group-start">
  <span class="input-group-text" id="inputGroupPrepend">@</span>
  <input type="text" class="form-control is-invalid" id="validationCustomUsername" aria-describedby="inputGroupPrepend" required>
  <div class="invalid-feedback">
    Please choose a username.
  </div>
</div>
{{< /example >}}
