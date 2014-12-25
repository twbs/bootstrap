---
layout: page
title: Custom forms
---

In the interest of customization and cross browser consistency, Bootstrap include a handful of customized form elements. They're solid replacements for default form controls as they're built on top of semantic and accessible markup.

## Checkboxes and radios

Each checkbox and radio is wrapped in a `<label>` for three reasons:

- It provides a larger hit areas for checking the control.
- It provides a helpful and semantic wrapper to help us replace the default `<input>`s.
- It triggers the state of the `<input>` automatically, meaning no JavaScript is required.

We hide the default `<input>` with `opacity` and use the `.c-indicator` to build a new custom form control. We can't build a custom one from just the `<input>` because CSS's `content` doesn't work on that element.

With the sibling selector (`~`), we use the `:checked` state to trigger a makeshift checked state on the custom control.

In the checked states, we use **base64 embedded SVG icons** from [Open Iconic](http://useiconic.com/open). This provides us the best control for styling and positioning across browsers and devices.

### Checkboxes

{% example html %}
<label class="c-input c-checkbox">
  <input type="checkbox">
  <span class="c-indicator"></span>
  Check this custom checkbox
</label>
{% endexample %}

### Radios

{% example html %}
<label class="c-input c-radio">
  <input id="radio1" name="radio" type="radio">
  <span class="c-indicator"></span>
  Toggle this custom radio
</label>
<label class="c-input c-radio">
  <input id="radio2" name="radio" type="radio">
  <span class="c-indicator"></span>
  Or toggle this other custom radio
</label>
{% endexample %}

### Stacked

Custom checkboxes and radios are inline to start. Add a parent with class `.c-inputs-stacked` to ensure each form control is on separate lines.

{% example html %}
<div class="c-inputs-stacked">
  <label class="c-input c-radio">
    <input id="radioStacked1" name="radio-stacked" type="radio">
    <span class="c-indicator"></span>
    Toggle this custom radio
  </label>
  <label class="c-input c-radio">
    <input id="radioStacked2" name="radio-stacked" type="radio">
    <span class="c-indicator"></span>
    Or toggle this other custom radio
  </label>
</div>
{% endexample %}
