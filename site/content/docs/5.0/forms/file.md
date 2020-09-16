---
layout: docs
title: File browser
description: Use our custom file inputs for consistent cross-browser styling, built-in customization, and lightweight JavaScript.
group: forms
toc: true
---

{{< callout info >}}
The recommended plugin to animate custom file inputs is [bs-custom-file-input](https://www.npmjs.com/package/bs-custom-file-input); it's what we use here in our docs.
{{< /callout >}}

## Default

The file input is the most gnarly of the bunch and requires additional JavaScript if you'd like to hook them up with functional *Choose file...* and selected file name text.

{{< example >}}
<div class="form-file">
  <input type="file" class="form-file-input" id="customFile">
  <label class="form-file-label" for="customFile">
    <span class="form-file-text">Choose file...</span>
    <span class="form-file-button">Browse</span>
  </label>
</div>
{{< /example >}}

Add the `disabled` attribute to the `<input>` and the custom markup will be updated to appear disabled.

{{< example >}}
<div class="form-file">
  <input type="file" class="form-file-input" id="customFileDisabled" disabled>
  <label class="form-file-label" for="customFileDisabled">
    <span class="form-file-text">Choose file...</span>
    <span class="form-file-button">Browse</span>
  </label>
</div>
{{< /example >}}

Longer placeholder text is truncated and an ellipsis is added when there's not enough space.

{{< example >}}
<div class="form-file">
  <input type="file" class="form-file-input" id="customFileLong">
  <label class="form-file-label" for="customFileLong">
    <span class="form-file-text">Lorem ipsum posuere consectetur est at lobortis nulla vitae elit libero a pharetra augue fusce dapibus tellus ac cursus commodo tortor mauris condimentum nibh ut fermentum massa justo sit amet risus cras mattis consectetur purus sit amet fermentum</span>
    <span class="form-file-button">Browse</span>
  </label>
</div>
{{< /example >}}

We hide the default file `<input>` via `opacity` and instead style the `<label>`, and declare a `width` and `height` on the `<input>` for proper spacing for surrounding content.

## Sizing

You may also choose from small and large file inputs to match our similarly sized text inputs.

{{< example >}}
<div class="form-file form-file-lg mb-3">
  <input type="file" class="form-file-input" id="customFileLg">
  <label class="form-file-label" for="customFileLg">
    <span class="form-file-text">Choose file...</span>
    <span class="form-file-button">Browse</span>
  </label>
</div>

<div class="form-file form-file-sm">
  <input type="file" class="form-file-input" id="customFileSm">
  <label class="form-file-label" for="customFileSm">
    <span class="form-file-text">Choose file...</span>
    <span class="form-file-button">Browse</span>
  </label>
</div>
{{< /example >}}

## With icons

Like our textual `.form-control`, you can overlay icons on `.form-file`s. See the [form control with icon docs]({{< docsref "/forms/form-control#with-icons" >}}) for more details.

We've also customized the file input's text here to match our icon.

{{< example >}}
<div class="form-control-with-icon">
  <div class="form-file">
    <input type="file" class="form-file-input" id="formFileWithIcon">
    <label class="form-file-label" for="formFileWithIcon">
      <span class="form-file-text">Choose images...</span>
      <span class="form-file-button">Browse</span>
    </label>
  </div>
  <div class="form-control-icon">
    <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" d="M12.002 4h-10a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1zm-10-1a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-10zm4 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
      <path fill-rule="evenodd" d="M4 2h10a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1v1a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2h1a1 1 0 0 1 1-1z"/>
    </svg>
  </div>
</div>
{{< /example >}}

### Spinners

You can also place any of Bootstrap's [spinners]({{< docsref "/components/spinners" >}}) within the `.form-control-icon`.

{{< example >}}
<div class="form-control-with-icon">
  <div class="form-file">
    <input type="file" class="form-file-input" id="formFileWithSpinner">
    <label class="form-file-label" for="formFileWithSpinner">
      <span class="form-file-text">Choose images...</span>
      <span class="form-file-button">Browse</span>
    </label>
  </div>
  <div class="form-control-icon">
    <div class="spinner-border spinner-border-sm" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</div>
{{< /example >}}

### Sizing

Add `.form-file-sm` or `.form-file-lg` to your `.form-file` and the `.form-control-icon` will automatically resize. However, the sizing of the icons themselves is up to you.

{{< example >}}
<div class="form-control-with-icon">
  <div class="form-file form-file-sm">
    <input type="file" class="form-file-input" id="formFileWithIconSm">
    <label class="form-file-label" for="formFileWithIconSm">
      <span class="form-file-text">Choose images...</span>
      <span class="form-file-button">Browse</span>
    </label>
  </div>
  <div class="form-control-icon">
    <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" d="M12.002 4h-10a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1zm-10-1a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-10zm4 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
      <path fill-rule="evenodd" d="M4 2h10a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1v1a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2h1a1 1 0 0 1 1-1z"/>
    </svg>
  </div>
</div>
{{< /example >}}

{{< example >}}
<div class="form-control-with-icon">
  <div class="form-file form-file-lg">
    <input type="file" class="form-file-input" id="formFileWithIconLg">
    <label class="form-file-label" for="formFileWithIconLg">
      <span class="form-file-text">Choose images...</span>
      <span class="form-file-button">Browse</span>
    </label>
  </div>
  <div class="form-control-icon">
    <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" d="M12.002 4h-10a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1zm-10-1a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-10zm4 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
      <path fill-rule="evenodd" d="M4 2h10a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1v1a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2h1a1 1 0 0 1 1-1z"/>
    </svg>
  </div>
</div>
{{< /example >}}
