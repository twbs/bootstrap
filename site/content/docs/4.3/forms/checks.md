---
layout: docs
title: Checks
description: ...
group: forms
toc: true
---


## Checkboxes and radios

<script>
document.addEventListener("DOMContentLoaded", function() {
  var checkbox = document.getElementById("flexCheckIndeterminate");
  checkbox.indeterminate = true;
});
</script>

{{< example >}}
<!-- Default -->
<div class="flex-check">
  <input class="flex-check-input" type="checkbox" value="" id="flexCheckDefault">
  <label class="flex-check-label" for="flexCheckDefault">
    Default checkbox
  </label>
</div>
<div class="flex-check">
  <input class="flex-check-input" type="checkbox" value="" id="flexCheckChecked" checked>
  <label class="flex-check-label" for="flexCheckChecked">
    Checked checkbox
  </label>
</div>
<div class="flex-check">
  <input class="flex-check-input" type="checkbox" value="" id="flexCheckIndeterminate">
  <label class="flex-check-label" for="flexCheckIndeterminate">
    Indeterminate checkbox
  </label>
</div>
<div class="flex-check">
  <input class="flex-check-input" type="checkbox" value="" id="flexCheckDisabled" disabled>
  <label class="flex-check-label" for="flexCheckDisabled">
    Disabled checkbox
  </label>
</div>
<div class="flex-check mb-3">
  <input class="flex-check-input" type="checkbox" value="" id="flexCheckCheckedDisabled" checked disabled>
  <label class="flex-check-label" for="flexCheckCheckedDisabled">
    Disabled checked checkbox
  </label>
</div>

<!-- Radio -->
<div class="flex-check">
  <input class="flex-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1">
  <label class="flex-check-label" for="flexRadioDefault1">
    Default radio
  </label>
</div>
<div class="flex-check mb-2">
  <input class="flex-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked>
  <label class="flex-check-label" for="flexRadioDefault2">
    Default checked radio
  </label>
</div>
<div class="flex-check">
  <input class="flex-check-input" type="radio" name="flexRadioDisabled" id="flexRadioDisabled" disabled>
  <label class="flex-check-label" for="flexRadioDisabled">
    Disabled radio
  </label>
</div>
<div class="flex-check mb-3">
  <input class="flex-check-input" type="radio" name="flexRadioDisabled" id="flexRadioCheckedDisabled" checked disabled>
  <label class="flex-check-label" for="flexRadioCheckedDisabled">
    Disabled checked radio
  </label>
</div>

<!-- Switch -->
<div class="flex-check flex-switch">
  <input class="flex-check-input" type="checkbox" id="flexSwitchCheckDefault">
  <label class="flex-check-label" for="flexSwitchCheckDefault">Default switch checkbox input</label>
</div>
<div class="flex-check flex-switch">
  <input class="flex-check-input" type="checkbox" id="flexSwitchCheckChecked" checked>
  <label class="flex-check-label" for="flexSwitchCheckChecked">Checked switch checkbox input</label>
</div>
<div class="flex-check flex-switch">
  <input class="flex-check-input" type="checkbox" id="flexSwitchCheckDisabled" disabled>
  <label class="flex-check-label" for="flexSwitchCheckDisabled">Disabled switch checkbox input</label>
</div>
<div class="flex-check flex-switch">
  <input class="flex-check-input" type="checkbox" id="flexSwitchCheckCheckedDisabled" checked disabled>
  <label class="flex-check-label" for="flexSwitchCheckCheckedDisabled">Disabled checked switch checkbox input</label>
</div>
{{< /example >}}

Default checkboxes and radios are improved upon with the help of `.form-check`, **a single class for both input types that improves the layout and behavior of their HTML elements**. Checkboxes are for selecting one or several options in a list, while radios are for selecting one option from many.

Disabled checkboxes and radios are supported. The `disabled` attribute will apply a lighter color to help indicate the input's state.

Checkboxes and radios use are built to support HTML-based form validation and provide concise, accessible labels. As such, our `<input>`s and `<label>`s are sibling elements as opposed to an `<input>` within a `<label>`. This is slightly more verbose as you must specify `id` and `for` attributes to relate the `<input>` and `<label>`.

### Default (stacked)

By default, any number of checkboxes and radios that are immediate sibling will be vertically stacked and appropriately spaced with `.form-check`.

{{< example >}}
<div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
  <label class="form-check-label" for="defaultCheck1">
    Default checkbox
  </label>
</div>
<div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id="defaultCheck2" disabled>
  <label class="form-check-label" for="defaultCheck2">
    Disabled checkbox
  </label>
</div>
{{< /example >}}

{{< example >}}
<div class="form-check">
  <input class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="option1" checked>
  <label class="form-check-label" for="exampleRadios1">
    Default radio
  </label>
</div>
<div class="form-check">
  <input class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios2" value="option2">
  <label class="form-check-label" for="exampleRadios2">
    Second default radio
  </label>
</div>
<div class="form-check">
  <input class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios3" value="option3" disabled>
  <label class="form-check-label" for="exampleRadios3">
    Disabled radio
  </label>
</div>
{{< /example >}}

### Inline

Group checkboxes or radios on the same horizontal row by adding `.form-check-inline` to any `.form-check`.

{{< example >}}
<div class="form-check form-check-inline">
  <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1">
  <label class="form-check-label" for="inlineCheckbox1">1</label>
</div>
<div class="form-check form-check-inline">
  <input class="form-check-input" type="checkbox" id="inlineCheckbox2" value="option2">
  <label class="form-check-label" for="inlineCheckbox2">2</label>
</div>
<div class="form-check form-check-inline">
  <input class="form-check-input" type="checkbox" id="inlineCheckbox3" value="option3" disabled>
  <label class="form-check-label" for="inlineCheckbox3">3 (disabled)</label>
</div>
{{< /example >}}

{{< example >}}
<div class="form-check form-check-inline">
  <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1">
  <label class="form-check-label" for="inlineRadio1">1</label>
</div>
<div class="form-check form-check-inline">
  <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2">
  <label class="form-check-label" for="inlineRadio2">2</label>
</div>
<div class="form-check form-check-inline">
  <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="option3" disabled>
  <label class="form-check-label" for="inlineRadio3">3 (disabled)</label>
</div>
{{< /example >}}

### Without labels

Add `.position-static` to inputs within `.form-check` that don't have any label text. Remember to still provide some form of label for assistive technologies (for instance, using `aria-label`).

{{< example >}}
<div class="form-check">
  <input class="form-check-input position-static" type="checkbox" id="blankCheckbox" value="option1" aria-label="...">
</div>
<div class="form-check">
  <input class="form-check-input position-static" type="radio" name="blankRadio" id="blankRadio1" value="option1" aria-label="...">
</div>
{{< /example >}}
