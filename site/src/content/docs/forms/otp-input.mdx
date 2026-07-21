---
title: OTP input
description: Collect one-time passwords, PIN codes, and verification codes with a single accessible input rendered as separate digit slots.
toc: true
css_layer: components
js: required
---

## Overview

OTP (One-Time Password) inputs are a common pattern for two-factor authentication, verification codes, and PIN entry. Bootstrap's OTP input is built around a **single real text field** that is visually rendered as separate digit slots. This keeps the control simple and fully accessible—screen readers, password managers, and SMS autofill all treat it like any other text input—while still giving you the familiar multi-box appearance.

- **One accessible control**: a single `<input>` backs the whole field, so assistive technology announces one field, not one per digit
- **Browser autofill**: supports `autocomplete="one-time-code"` for SMS/email code autofill
- **Paste support**: paste a full code—even a formatted one like `123-456`—and the extra characters are stripped automatically
- **Click to edit**: click any slot to jump to it; typing overwrites that digit in place instead of pushing the others along
- **Keyboard navigation**: all native text editing (typing, arrows, backspace, delete, selection) works out of the box
- **Masking and types**: optionally mask the value, and restrict input to numeric, alphanumeric, or alphabetic characters

OTP input is built on [form controls]([[docsref:/forms/form-control]]) and shares its sizing tokens.

## How it works

Wrap a single `<input>` in a container with `.otp` and add `data-bs-otp` to enable the JavaScript. The plugin reads the input's `maxlength` to determine how many slots to render, hides the real input behind transparent overlay styling, and draws one `.otp-slot` per character. Give the input an accessible name with `aria-label` or an associated `<label>`.

<Example code={`<div class="otp" data-bs-otp>
    <input type="text" class="otp-input" maxlength="6" aria-label="Verification code">
  </div>`} />

## Connected inputs

Add `.otp-connected` to merge the slots into a single cohesive field with shared borders.

<Example code={`<div class="otp otp-connected" data-bs-otp>
    <input type="text" class="otp-input" maxlength="6" aria-label="Verification code">
  </div>`} />

## Four-digit PIN

Set the input's `maxlength` to control the number of slots—use fewer for shorter codes like a 4-digit PIN.

<Example code={`<div class="otp otp-connected" data-bs-otp>
    <input type="text" class="otp-input" maxlength="4" aria-label="PIN">
  </div>`} />

## With separator

Use `data-bs-groups` with an array of group sizes to split the slots into groups separated by a visual divider—handy for codes like "123-456". The separator is decorative and never becomes part of the value.

<Example code={`<div class="otp" data-bs-otp data-bs-groups="[3,3]">
    <input type="text" class="otp-input" maxlength="6" aria-label="Verification code">
  </div>`} />

## Sizes

Add `.otp-sm` or `.otp-lg` to the container to change the slot size.

<Example code={`<div class="otp otp-sm mb-3" data-bs-otp>
    <input type="text" class="otp-input" maxlength="6" aria-label="Small verification code">
  </div>
  <div class="otp otp-lg" data-bs-otp>
    <input type="text" class="otp-input" maxlength="6" aria-label="Large verification code">
  </div>`} />

## Alphanumeric and masking

By default only digits are accepted. Set `data-bs-type` to `alphanumeric` or `alpha` to accept letters, and `data-bs-mask="true"` to obscure the entered value while keeping it a normal text field (no `type="password"`, so the numeric keyboard and autofill still work).

<Example code={`<div class="otp otp-connected mb-3" data-bs-otp data-bs-type="alphanumeric">
    <input type="text" class="otp-input" maxlength="6" aria-label="Alphanumeric code">
  </div>
  <div class="otp otp-connected" data-bs-otp data-bs-mask="true">
    <input type="text" class="otp-input" maxlength="6" aria-label="Masked code">
  </div>`} />

## Disabled

Add the `disabled` attribute to the input to prevent interaction.

<Example code={`<div class="otp otp-connected" data-bs-otp>
    <input type="text" class="otp-input" maxlength="6" aria-label="Verification code" disabled>
  </div>`} />

## Validation

Add `.is-valid` or `.is-invalid` to the container to show validation states.

<Example code={`<div class="otp otp-connected is-valid mb-3" data-bs-otp>
    <input type="text" class="otp-input" maxlength="6" value="123456" aria-label="Verification code">
  </div>
  <div class="otp otp-connected is-invalid" data-bs-otp>
    <input type="text" class="otp-input" maxlength="6" value="123" aria-label="Verification code">
  </div>`} />

## With form label

Associate a `<label>` with the input and add help text with `aria-describedby` for better accessibility.

<Example code={`<div class="vstack gap-2">
    <label class="form-label" for="otpCode">Verification code</label>
    <div class="otp" data-bs-otp>
      <input type="text" class="otp-input" id="otpCode" maxlength="6" aria-describedby="otpHelp">
    </div>
    <div id="otpHelp" class="form-text">Enter the 6-digit code sent to your phone.</div>
  </div>`} />

## Usage

### Via data attributes

Add `data-bs-otp` to a container wrapping a single `<input>` to automatically initialize the OTP input behavior.

<BsTable>
| Attribute | Description |
| --- | --- |
| `data-bs-otp` | Initializes the OTP input on the container. |
| `data-bs-length` | Number of slots. Defaults to the input's `maxlength`. |
| `data-bs-type` | `numeric` (default), `alphanumeric`, or `alpha`. |
| `data-bs-mask` | When `true`, masks the entered value with a dot in each slot. |
| `data-bs-groups` | Array of group sizes (e.g. `[3,3]`) to insert separators between groups. |
| `data-bs-separator` | Character used for the separator between groups. |
</BsTable>

```html
<div class="otp" data-bs-otp>
  <input type="text" class="otp-input" maxlength="6" aria-label="Verification code">
</div>
```

### Via JavaScript

Initialize manually with JavaScript:

```js
const otpElement = document.querySelector('.otp')
const otpInput = new bootstrap.OtpInput(otpElement)
```

### Dependencies

<JsDependencies component="otp-input" name="OTP input" />

### Options

Options can be passed via data attributes or JavaScript:

<BsTable>
| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `length` | number, null | `null` | Number of slots. When `null`, it is read from the input's `maxlength`. |
| `type` | string | `'numeric'` | Allowed characters: `numeric`, `alphanumeric`, or `alpha`. Sets `inputmode` and `pattern` accordingly. |
| `mask` | boolean | `false` | If `true`, slots display a dot (`•`) instead of the entered character. |
| `groups` | array, null | `null` | Group sizes used to insert separators (e.g. `[3, 3]`). |
| `separator` | string | `'·'` | Character rendered between groups. |
</BsTable>

### Methods

<BsTable>
| Method | Description |
| --- | --- |
| `getValue()` | Returns the complete OTP value as a string. |
| `setValue(value)` | Sets the value, sanitizing it against the configured type. |
| `clear()` | Clears the value and focuses the input. |
| `focus()` | Focuses the input and places the caret after the last character. |
| `dispose()` | Destroys the component instance and removes the generated slots. |
</BsTable>

```js
const otpElement = document.querySelector('.otp')
const otpInput = bootstrap.OtpInput.getOrCreateInstance(otpElement)

// Get the current value
console.log(otpInput.getValue()) // "123456"

// Set a value programmatically
otpInput.setValue('654321')

// Clear the value
otpInput.clear()
```

### Events

<BsTable>
| Event | Description |
| --- | --- |
| `complete.bs.otpInput` | Fired when every slot is filled. The event's `value` property contains the complete code. |
| `input.bs.otpInput` | Fired on each change. The event's `value` property contains the current value. |
</BsTable>

```js
const otpElement = document.querySelector('.otp')

otpElement.addEventListener('complete.bs.otpInput', event => {
  console.log('OTP complete:', event.value)
  // Submit the form or validate the code
})

otpElement.addEventListener('input.bs.otpInput', event => {
  console.log('Current value:', event.value)
})
```

## Accessibility

Because the control is a single text input, it exposes one accessible name, role, and value—so assistive technology announces it as one ordinary text field instead of one edit field per digit. The visual slots are decorative and marked `aria-hidden`, and no per-digit `aria-label`s are needed.

- Give the input a single accessible name with `aria-label` or an associated `<label>`, and add context with `aria-describedby`.
- The component sets `autocomplete="one-time-code"` and an appropriate `inputmode` so codes can be autofilled and the right mobile keyboard appears. This supports [WCAG 1.3.5 Identify Input Purpose](https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html).
- Copy, paste, and autofill are never blocked, which keeps the control compliant with [WCAG 3.3.8 Accessible Authentication (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html)—a single input is also what password managers and SMS autofill target reliably.
- For the verification flow itself, give codes a generous expiry ([WCAG 2.2.1 Timing Adjustable](https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html)) and avoid forcing users to re-enter a code already provided in the same process ([WCAG 3.3.7 Redundant Entry](https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html)).

## CSS

### Variables

<CSSVariables component="OTP input" className="otp" />

<ScssDocs name="otp-tokens" file="scss/forms/_otp-input.scss" />

### Sass list

We use a Sass list to define the sizes of the OTP input, so you can easily add or modify sizes by fetching the associated root variables for each size. This list should generally match the sizes defined in the `$form-control-sizes` Sass map in `_form-control.scss`.

<ScssDocs name="otp-sizes" file="scss/forms/_otp-input.scss" />
