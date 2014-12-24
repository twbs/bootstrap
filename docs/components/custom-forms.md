---
layout: page
title: Custom forms
---

In the interest of customization and cross browser consistency, Bootstrap include a handful of customized form elements. They're solid replacements for default form controls as they're built on top of semantic and accessible markup.

## Checkboxes and radios

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
