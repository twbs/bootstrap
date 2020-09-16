---
layout: docs
title: Form controls
description: Give textual form controls like `<input>`s and `<textarea>`s an upgrade with custom styles, sizing, focus states, and more.
group: forms
toc: true
---

## Example

{{< example >}}
<div class="mb-3">
  <label for="exampleFormControlInput1" class="form-label">Email address</label>
  <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="name@example.com">
</div>
<div class="mb-3">
  <label for="exampleFormControlTextarea1" class="form-label">Example textarea</label>
  <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
</div>
{{< /example >}}

## Sizing

Set heights using classes like `.form-control-lg` and `.form-control-sm`.

{{< example >}}
<input class="form-control form-control-lg" type="text" placeholder=".form-control-lg" aria-label=".form-control-lg example">
<input class="form-control" type="text" placeholder="Default input" aria-label="deafult input example">
<input class="form-control form-control-sm" type="text" placeholder=".form-control-sm" aria-label=".form-control-sm example">
{{< /example >}}

## Readonly

Add the `readonly` boolean attribute on an input to prevent modification of the input's value. Read-only inputs appear lighter (just like disabled inputs), but retain the standard cursor.

{{< example >}}
<input class="form-control" type="text" placeholder="Readonly input here..." aria-label="readonly input example" readonly>
{{< /example >}}

## Readonly plain text

If you want to have `<input readonly>` elements in your form styled as plain text, use the `.form-control-plaintext` class to remove the default form field styling and preserve the correct margin and padding.

{{< example >}}
  <div class="mb-3 row">
    <label for="staticEmail" class="col-sm-2 col-form-label">Email</label>
    <div class="col-sm-10">
      <input type="text" readonly class="form-control-plaintext" id="staticEmail" value="email@example.com">
    </div>
  </div>
  <div class="mb-3 row">
    <label for="inputPassword" class="col-sm-2 col-form-label">Password</label>
    <div class="col-sm-10">
      <input type="password" class="form-control" id="inputPassword">
    </div>
  </div>
{{< /example >}}

{{< example >}}
<form class="row g-3">
  <div class="col-auto">
    <label for="staticEmail2" class="visually-hidden">Email</label>
    <input type="text" readonly class="form-control-plaintext" id="staticEmail2" value="email@example.com">
  </div>
  <div class="col-auto">
    <label for="inputPassword2" class="visually-hidden">Password</label>
    <input type="password" class="form-control" id="inputPassword2" placeholder="Password">
  </div>
  <div class="col-auto">
    <button type="submit" class="btn btn-primary mb-3">Confirm identity</button>
  </div>
</form>
{{< /example >}}

## Color

{{< example >}}
<label for="exampleColorInput" class="form-label">Color picker</label>
<input type="color" class="form-control form-control-color" id="exampleColorInput" value="#563d7c" title="Choose your color">
{{< /example >}}

## Datalists

Datalists allow you to create a group of `<option>`s that can be accessed (and autocompleted) from within an `<input>`. These are similar to `<select>` elements, but come with more menu styling limitations and differences. While most browsers and operating systems include some support for `<datalist>` elements, their styling is inconsistent at best.

Learn more about [support for datalist elements](https://caniuse.com/#feat=datalist).

{{< example >}}
<label for="exampleDataList" class="form-label">Datalist example</label>
<input class="form-control" list="datalistOptions" id="exampleDataList" placeholder="Type to search...">
<datalist id="datalistOptions">
  <option value="San Francisco">
  <option value="New York">
  <option value="Seattle">
  <option value="Los Angeles">
  <option value="Chicago">
</datalist>
{{< /example >}}

## With icons

Wrap your form control in an element with `.form-control-with-icon`, then add a new element as a sibling to the form control with `.form-control-icon`. Place your icons within that new element. Icons will be automatically centered vertically and horizontally, but the sizing of them is up to you.

You can also add icons [to selects]({{< docsref "/forms/select#with-icons" >}}) and to [file inputs]({{< docsref "/forms/file#with-icons" >}}). Textareas are currently not supported.

Examples below are shown with [Bootstrap Icons](https://icons.getbootstrap.com).

{{< example >}}
<label for="formControlWithIcon" class="form-label">Email address</label>
<div class="form-control-with-icon">
  <input type="email" class="form-control" id="formControlWithIcon" placeholder="name@example.com">
  <div class="form-control-icon">
    <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383l-4.758 2.855L15 11.114v-5.73zm-.034 6.878L9.271 8.82 8 9.583 6.728 8.82l-5.694 3.44A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.739zM1 11.114l4.758-2.876L1 5.383v5.73z"/>
    </svg>
  </div>
</div>
{{< /example >}}

### Spinners

You can also place any of Bootstrap's [spinners]({{< docsref "/components/spinners" >}}) within the `.form-control-icon`.

{{< example >}}
<label for="formControlWithSpinner" class="form-label">Email address</label>
<div class="form-control-with-icon">
  <input type="email" class="form-control" id="formControlWithSpinner" placeholder="name@example.com">
  <div class="form-control-icon">
    <div class="spinner-border spinner-border-sm" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</div>
{{< /example >}}

### Sizing

Add `.form-control-sm` or `.form-control-lg` to your `.form-control` and the `.form-control-icon` will automatically resize. However, the sizing of the icons themselves is up to you.

{{< example >}}
<label for="formControlWithIconSm" class="form-label">Email address</label>
<div class="form-control-with-icon">
  <input type="email" class="form-control form-control-sm" id="formControlWithIconSm" placeholder="name@example.com">
  <div class="form-control-icon">
    <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383l-4.758 2.855L15 11.114v-5.73zm-.034 6.878L9.271 8.82 8 9.583 6.728 8.82l-5.694 3.44A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.739zM1 11.114l4.758-2.876L1 5.383v5.73z"/>
    </svg>
  </div>
</div>
{{< /example >}}

{{< example >}}
<label for="formControlWithIconLg" class="form-label">Email address</label>
<div class="form-control-with-icon">
  <input type="email" class="form-control form-control-lg" id="formControlWithIconLg" placeholder="name@example.com">
  <div class="form-control-icon">
    <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383l-4.758 2.855L15 11.114v-5.73zm-.034 6.878L9.271 8.82 8 9.583 6.728 8.82l-5.694 3.44A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.739zM1 11.114l4.758-2.876L1 5.383v5.73z"/>
    </svg>
  </div>
</div>
{{< /example >}}
