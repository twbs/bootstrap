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

## With icons

Add [Bootstrap Icons]({{< param icons >}}) or other SVGs to floating label forms. Depending on your icons and content, you may want to add more utilities or custom styles.

{{< example >}}
<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
  <symbol id="envelope" fill="currentColor" viewBox="0 0 16 16">
    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383-4.758 2.855L15 11.114v-5.73zm-.034 6.878L9.271 8.82 8 9.583 6.728 8.82l-5.694 3.44A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.739zM1 11.114l4.758-2.876L1 5.383v5.73z"/>
  </symbol>
  <symbol id="key" fill="currentColor" viewBox="0 0 16 16">
    <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8zm4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5z"/>
    <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
  </symbol>
</svg>

<div class="form-floating mb-3">
  <div class="form-floating-icon">
    <svg class="bi" width="24" height="24"><use xlink:href="#envelope"/></svg>
  </div>
  <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com">
  <label for="floatingInput">Email address</label>
</div>
<div class="form-floating">
  <div class="form-floating-icon">
    <svg class="bi" width="24" height="24"><use xlink:href="#key"/></svg>
  </div>
  <input type="password" class="form-control" id="floatingPassword" placeholder="Password">
  <label for="floatingPassword">Password</label>
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

## Sass

### Variables

{{< scss-docs name="form-floating-variables" file="scss/_variables.scss" >}}
