---
layout: docs
title: Floating labels
description: Create beautifully simple form labels that float over your input fields.
group: forms
toc: true
---

## Example

Wrap a pair of `<input class="form-control">` and `<label>` elements in `.form-floating` to enable floating labels with Bootstrap's textual form fields. A `placeholder` is required on each `<input>` as our method of CSS-only floating labels uses the `:placeholder-shown` pseudo-element. Also note that the `<input>` must come first so we can utilize a sibling selector (e.g., `~`).

{{< example >}}
<div class="form-floating mb-3">
  <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com">
  <label for="floatingInput">Email address</label>
</div>
<div class="form-floating">
  <input type="password" class="form-control" id="floatingPassword" placeholder="Password">
  <label for="floatingPassword">Password</label>
</div>
{{< /example >}}

When there's a `value` already defined, `<label>`s will automatically adjust to their floated position.

{{< example >}}
<form class="form-floating">
  <input type="email" class="form-control" id="floatingInputValue" placeholder="name@example.com" value="test@example.com">
  <label for="floatingInputValue">Input with value</label>
</form>
{{< /example >}}

Form validation styles also work as expected.

{{< example >}}
<form class="form-floating">
  <input type="email" class="form-control is-invalid" id="floatingInputInvalid" placeholder="name@example.com" value="test@example.com">
  <label for="floatingInputInvalid">Invalid input</label>
</form>
{{< /example >}}

## Textareas

By default, `<textarea>`s with `.form-control` will be the same height as `<input>`s.

{{< example >}}
<div class="form-floating">
  <textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea"></textarea>
  <label for="floatingTextarea">Comments</label>
</div>
{{< /example >}}

To set a custom height on your `<textarea>`, do not use the `rows` attribute. Instead, set an explicit `height` (either inline or via custom CSS).

{{< example >}}
<div class="form-floating">
  <textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style="height: 100px"></textarea>
  <label for="floatingTextarea2">Comments</label>
</div>
{{< /example >}}

## Selects

Other than `.form-control`, floating labels are only available on `.form-select`s. They work in the same way, but unlike `<input>`s, they'll always show the `<label>` in its floated state. **Selects with `size` and `multiple` are not supported.**

{{< example >}}
<div class="form-floating">
  <select class="form-select" id="floatingSelect" aria-label="Floating label select example">
    <option selected>Open this select menu</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
  </select>
  <label for="floatingSelect">Works with selects</label>
</div>
{{< /example >}}

## Layout

When working with the Bootstrap grid system, be sure to place form elements within column classes.

{{< example >}}
<div class="row g-2">
  <div class="col-md">
    <div class="form-floating">
      <input type="email" class="form-control" id="floatingInputGrid" placeholder="name@example.com" value="mdo@example.com">
      <label for="floatingInputGrid">Email address</label>
    </div>
  </div>
  <div class="col-md">
    <div class="form-floating">
      <select class="form-select" id="floatingSelectGrid" aria-label="Floating label select example">
        <option selected>Open this select menu</option>
        <option value="1">One</option>
        <option value="2">Two</option>
        <option value="3">Three</option>
      </select>
      <label for="floatingSelectGrid">Works with selects</label>
    </div>
  </div>
</div>
{{< /example >}}
