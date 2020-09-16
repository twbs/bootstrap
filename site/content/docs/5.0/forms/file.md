---
layout: docs
title: File browser
description: Use our custom file inputs for consistent cross-browser styling, built-in customization, and lightweight JavaScript.
group: forms
toc: true
---

## Default

Unlike our selects, checkboxes, and radios, the file input is much more difficult to customize. This means we've had to add additional HTML around the `<input type="file">` to create our the custom design. As such, it also requires additional JavaScript to make the custom form work with the input.

As of Bootstrap 5, this JavaScript is included in a new official plugin. Folks using Bootstrap 4 will need to make use of an [external plugin](https://www.npmjs.com/package/bs-custom-file-input).

{{< example >}}
<div class="form-file" data-toggle="file-input">
  <input type="file" class="form-file-input" id="customFile">
  <label class="form-file-label" for="customFile">
    <span class="form-file-text">Choose file...</span>
    <span class="form-file-button">Browse</span>
  </label>
</div>
{{< /example >}}

Add the `disabled` attribute to the `<input>` and the custom markup will be updated to appear disabled.

{{< example >}}
<div class="form-file" data-toggle="file-input">
  <input type="file" class="form-file-input" id="customFileDisabled" disabled>
  <label class="form-file-label" for="customFileDisabled">
    <span class="form-file-text">Choose file...</span>
    <span class="form-file-button">Browse</span>
  </label>
</div>
{{< /example >}}

Longer placeholder text is truncated and an ellipsis is added when there's not enough space.

{{< example >}}
<div class="form-file" data-toggle="file-input">
  <input type="file" class="form-file-input" id="customFileLong">
  <label class="form-file-label" for="customFileLong">
    <span class="form-file-text">Lorem ipsum posuere consectetur est at lobortis nulla vitae elit libero a pharetra augue fusce dapibus tellus ac cursus commodo tortor mauris condimentum nibh ut fermentum massa justo sit amet risus cras mattis consectetur purus sit amet fermentum</span>
    <span class="form-file-button">Browse</span>
  </label>
</div>
{{< /example >}}

We hide the default file `<input>` via `opacity` and instead style the `<label>`, and declare a `width` and `height` on the `<input>` for proper spacing for surrounding content.

### Multiple

To enable multiple file selection just add `multiple` on your `<input>`

{{< example >}}
<div class="form-file" data-toggle="file-input">
  <input type="file" class="form-file-input" id="customFileMultiple" multiple>
  <label class="form-file-label" for="customFileMultiple">
    <span class="form-file-text">Choose files...</span>
    <span class="form-file-button">Browse</span>
  </label>
</div>
{{< /example >}}

### Handle form reset

File inputs will be reset on a form's `reset` event.

{{< example >}}
<form id="formFileInput">
  <div class="form-file" data-toggle="file-input">
    <input type="file" class="form-file-input" id="customFileForm">
    <label class="form-file-label" for="customFileForm">
      <span class="form-file-text">Choose file...</span>
      <span class="form-file-button">Browse</span>
    </label>
  </div>
</form>
<button id="btnResetFormFileInput" class="btn btn-primary mt-3">
  Reset form
</button>
{{< /example >}}

## Sizing

You may also choose from small and large file inputs to match our similarly sized text inputs.

{{< example >}}
<div class="form-file form-file-lg mb-3" data-toggle="file-input">
  <input type="file" class="form-file-input" id="customFileLg">
  <label class="form-file-label" for="customFileLg">
    <span class="form-file-text">Choose file...</span>
    <span class="form-file-button">Browse</span>
  </label>
</div>

<div class="form-file form-file-sm" data-toggle="file-input">
  <input type="file" class="form-file-input" id="customFileSm">
  <label class="form-file-label" for="customFileSm">
    <span class="form-file-text">Choose file...</span>
    <span class="form-file-button">Browse</span>
  </label>
</div>
{{< /example >}}

## Usage

The file input plugin display selected files, via data attributes or JavaScript.

### Via data attributes

Activate a file input without writing JavaScript. Set `data-toggle="file-input"` on a `.form-file` element.

{{< highlight html >}}
<div class="form-file" data-toggle="file-input">
  <input type="file" class="form-file-input" id="customFileData">
  <label class="form-file-label" for="customFileData">
    <span class="form-file-text">Choose file...</span>
    <span class="form-file-button">Browse</span>
  </label>
</div>
{{< /highlight >}}

### Via JavaScript

{{< highlight js >}}
var formFileNode = document.querySelector('.form-file')
var fileInput = new bootstrap.FileInput(formFileNode)
{{< /highlight >}}

### Methods

#### dispose

Remove event listeners and stored data. Your file input will remain in the DOM but won't change any more.

{{< highlight js >}}fileInput.dispose(){{< /highlight >}}

#### restoreDefaultText

Restore the default text which was set on init.

{{< highlight js >}}fileInput.restoreDefaultText(){{< /highlight >}}

#### getInstance

*Static* method which allows you to get the file input instance associated with a DOM element.

{{< highlight js >}}
var formFileNode = document.getElementById('.form-file')
var fileInput = bootstrap.FileInput.getInstance(formFileNode) // Returns a Bootstrap file input instance
{{< /highlight >}}

#### createInstance

*Static* method which allows you to create or to return an existing file input instance.

{{< highlight js >}}
var formFileNode = document.getElementById('.form-file')
var fileInput = bootstrap.FileInput.createInstance(formFileNode) // Returns a Bootstrap file input instance
{{< /highlight >}}
