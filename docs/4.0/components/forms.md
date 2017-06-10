---
layout: docs
title: Forms
description: Examples and usage guidelines for form control styles, layout options, and custom components for creating a wide variety of forms.
group: components
toc: true
---

## Form controls

Bootstrap's form controls expand on [our Rebooted form styles]({{ site.baseurl }}/docs/{{ site.docs_version }}/content/reboot/#forms) with classes. Use these classes to opt into their customized displays for a more consistent rendering across browsers and devices. The example form below demonstrates common HTML form elements that receive updated styles from Bootstrap with additional classes.

Be sure to use an appropriate `type` attribute on all inputs (e.g., `email` for email address or `number` for numerical information).

### Example

{% example html %}
<form>
  <div class="form-group">
    <label for="exampleInputEmail1">Email address</label>
    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
    <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
  </div>
  <div class="form-group">
    <label for="exampleInputPassword1">Password</label>
    <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
  </div>
  <div class="form-group">
    <label for="exampleSelect1">Example select</label>
    <select class="form-control" id="exampleSelect1">
      <option>1</option>
      <option>2</option>
      <option>3</option>
      <option>4</option>
      <option>5</option>
    </select>
  </div>
  <div class="form-group">
    <label for="exampleSelect2">Example multiple select</label>
    <select multiple class="form-control" id="exampleSelect2">
      <option>1</option>
      <option>2</option>
      <option>3</option>
      <option>4</option>
      <option>5</option>
    </select>
  </div>
  <div class="form-group">
    <label for="exampleTextarea">Example textarea</label>
    <textarea class="form-control" id="exampleTextarea" rows="3"></textarea>
  </div>
  <div class="form-group">
    <label for="exampleInputFile">File input</label>
    <input type="file" class="form-control-file" id="exampleInputFile" aria-describedby="fileHelp">
    <small id="fileHelp" class="form-text text-muted">This is some placeholder block-level help text for the above input. It's a bit lighter and easily wraps to a new line.</small>
  </div>
  <fieldset class="form-group">
    <legend>Radio buttons</legend>
    <div class="form-check">
      <label class="form-check-label">
        <input type="radio" class="form-check-input" name="optionsRadios" id="optionsRadios1" value="option1" checked>
        Option one is this and that&mdash;be sure to include why it's great
      </label>
    </div>
    <div class="form-check">
    <label class="form-check-label">
        <input type="radio" class="form-check-input" name="optionsRadios" id="optionsRadios2" value="option2">
        Option two can be something else and selecting it will deselect option one
      </label>
    </div>
    <div class="form-check disabled">
    <label class="form-check-label">
        <input type="radio" class="form-check-input" name="optionsRadios" id="optionsRadios3" value="option3" disabled>
        Option three is disabled
      </label>
    </div>
  </fieldset>
  <div class="form-check">
    <label class="form-check-label">
      <input type="checkbox" class="form-check-input">
      Check me out
    </label>
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>
{% endexample %}

### Supported controls

Below is a complete list of the specific form controls supported by Bootstrap and the classes that customize them. Additional documentation is available for each group.

<table>
  <thead>
    <tr>
      <th>Classes</th>
      <th>Used for</th>
      <th>Supported variations</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        {% markdown %}`.form-group`{% endmarkdown %}
      </td>
      <td class="text-nowrap">
        Any group of form controls
      </td>
      <td>
        {% markdown %}Use with any block-level element like `<fieldset>` or `<div>`{% endmarkdown %}
      </td>
    </tr>
    <tr>
      <td rowspan="3">
        {% markdown %}`.form-control`{% endmarkdown %}
      </td>
      <td>
        Textual inputs
      </td>
      <td>
        {% markdown %}`text`, `password`, `datetime-local`, `date`, `month`, `time`, `week`, `number`, `email`, `url`, `search`, `tel`, `color`{% endmarkdown %}
      </td>
    </tr>
    <tr>
      <td>
        Select menus
      </td>
      <td>
        {% markdown %}`multiple`, `size`{% endmarkdown %}
      </td>
    </tr>
    <tr>
      <td>
        Textareas
      </td>
      <td>
        <span class="text-muted">N/A</span>
      </td>
    </tr>
    <tr>
      <td class="text-nowrap">
        {% markdown %}`.form-control-file`{% endmarkdown %}
      </td>
      <td>
        File inputs
      </td>
      <td>
        {% markdown %}`file`{% endmarkdown %}
      </td>
    </tr>
    <tr>
      <td class="text-nowrap">
{% markdown %}
`.form-check`
{% endmarkdown %}
      </td>
      <td class="text-nowrap">
        Checkboxes and radios
      </td>
      <td>
        <span class="text-muted">N/A</span>
      </td>
    </tr>
  </tbody>
</table>

### Textual inputs

Here are examples of `.form-control` applied to each textual HTML5 `<input>` `type` (meaning, almost everything except the file, checkbox, and radio inputs).

| Type | Example |
| --- | --- |
| `text` | <input class="form-control" type="text" value="Artisanal kale" id="example-text-input"> |
| `search` | <input class="form-control" type="search" value="How do I shoot web" id="example-search-input"> |
| `email` | <input class="form-control" type="email" value="bootstrap@example.com" id="example-email-input"> |
| `url` | <input class="form-control" type="url" value="https://getbootstrap.com" id="example-url-input"> |
| `tel` | <input class="form-control" type="tel" value="1-(555)-555-5555" id="example-tel-input"> |
| `password` | <input class="form-control" type="password" value="hunter2" id="example-password-input"> |
| `number` | <input class="form-control" type="number" value="42" id="example-number-input"> |
| `datetime-local` | <input class="form-control" type="datetime-local" value="2011-08-19T13:45:00" id="example-datetime-local-input"> |
| `date` | <input class="form-control" type="date" value="2011-08-19" id="example-date-input"> |
| `month` | <input class="form-control" type="month" value="2011-08" id="example-month-input"> |
| `week` | <input class="form-control" type="week" value="2011-W33" id="example-week-input"> |
| `time` | <input class="form-control" type="time" value="13:45:00" id="example-time-input"> |
| `color` | <input class="form-control" type="color" value="#563d7c" id="example-color-input"> |

## Layout

Since Bootstrap applies `display: block` and `width: 100%` to almost all our form controls, forms will by default stack vertically. Additional classes can be used to vary this layout on a per-form basis.

### Form groups

The `.form-group` class is the easiest way to add some structure to forms. Its only purpose is to provide `margin-bottom` around a label and control pairing. As a bonus, since it's a class you can use it with `<fieldset>`s, `<div>`s, or nearly any other element.

{% example html %}
<form>
  <div class="form-group">
    <label class="form-control-label" for="formGroupExampleInput">Example label</label>
    <input type="text" class="form-control" id="formGroupExampleInput" placeholder="Example input">
  </div>
  <div class="form-group">
    <label class="form-control-label" for="formGroupExampleInput2">Another label</label>
    <input type="text" class="form-control" id="formGroupExampleInput2" placeholder="Another input">
  </div>
</form>
{% endexample %}

### Grid

{% example html %}
<form>
  <div class="row gutters-sm">
    <div class="col">
      <input type="text" class="form-control" placeholder="First name">
    </div>
    <div class="col">
      <input type="text" class="form-control" placeholder="Last name">
    </div>
  </div>
</form>
{% endexample html %}

{% example html %}
<form>
  <div class="row gutters-sm">
    <div class="col-7">
      <input type="text" class="form-control" placeholder="City">
    </div>
    <div class="col">
      <input type="text" class="form-control" placeholder="State">
    </div>
    <div class="col">
      <input type="text" class="form-control" placeholder="Zip">
    </div>
  </div>
</form>
{% endexample html %}

{% example html %}
<form>
  <div class="row gutters-sm align-items-center">
    <div class="col">
      <label class="sr-only" for="inlineFormInput">Name</label>
      <input type="text" class="form-control mb-2 mb-sm-0" id="inlineFormInput" placeholder="Jane Doe">
    </div>
    <div class="col">
      <label class="sr-only" for="inlineFormInputGroup">Username</label>
      <div class="input-group mb-2 mb-sm-0">
        <div class="input-group-addon">@</div>
        <input type="text" class="form-control" id="inlineFormInputGroup" placeholder="Username">
      </div>
    </div>
    <div class="col">
      <div class="form-check mb-2 mb-sm-0">
        <label class="form-check-label">
          <input class="form-check-input" type="checkbox"> Remember me
        </label>
      </div>
    </div>
    <div class="col">
      <button type="submit" class="btn btn-primary">Submit</button>
    </div>
  </div>
</form>
{% endexample %}

{% example html %}
<form>
  <div class="row gutters-sm align-items-center">
    <div class="col-auto">
      <label class="sr-only" for="inlineFormInput">Name</label>
      <input type="text" class="form-control mb-2 mb-sm-0" id="inlineFormInput" placeholder="Jane Doe">
    </div>
    <div class="col-auto">
      <label class="sr-only" for="inlineFormInputGroup">Username</label>
      <div class="input-group mb-2 mb-sm-0">
        <div class="input-group-addon">@</div>
        <input type="text" class="form-control" id="inlineFormInputGroup" placeholder="Username">
      </div>
    </div>
    <div class="col-auto">
      <div class="form-check mb-2 mb-sm-0">
        <label class="form-check-label">
          <input class="form-check-input" type="checkbox"> Remember me
        </label>
      </div>
    </div>
    <div class="col-auto">
      <button type="submit" class="btn btn-primary">Submit</button>
    </div>
  </div>
</form>
{% endexample %}

{% example html %}
<form>
  <div class="row gutters-sm align-items-center">
    <div class="col-sm-3">
      <label class="sr-only" for="inlineFormInput">Name</label>
      <input type="text" class="form-control mb-2 mb-sm-0" id="inlineFormInput" placeholder="Jane Doe">
    </div>
    <div class="col-sm-3">
      <label class="sr-only" for="inlineFormInputGroup">Username</label>
      <div class="input-group mb-2 mb-sm-0">
        <div class="input-group-addon">@</div>
        <input type="text" class="form-control" id="inlineFormInputGroup" placeholder="Username">
      </div>
    </div>
    <div class="col-auto">
      <div class="form-check mb-2 mb-sm-0">
        <label class="form-check-label">
          <input class="form-check-input" type="checkbox"> Remember me
        </label>
      </div>
    </div>
    <div class="col-auto">
      <button type="submit" class="btn btn-primary">Submit</button>
    </div>
  </div>
</form>
{% endexample %}

{% example html %}
<form>
  <div class="row gutters-sm align-items-center">
    <div class="col-auto">
      <label class="mr-sm-2" for="inlineFormCustomSelect">Preference</label>
      <select class="custom-select mb-2 mr-sm-2 mb-sm-0" id="inlineFormCustomSelect">
        <option selected>Choose...</option>
        <option value="1">One</option>
        <option value="2">Two</option>
        <option value="3">Three</option>
      </select>
    </div>
    <div class="col-auto">
      <label class="custom-control custom-checkbox mb-2 mr-sm-2 mb-sm-0">
        <input type="checkbox" class="custom-control-input">
        <span class="custom-control-indicator"></span>
        <span class="custom-control-description">Remember my preference</span>
      </label>
    </div>
    <div class="col-auto">
      <button type="submit" class="btn btn-primary">Submit</button>
    </div>
  </div>
</form>
{% endexample %}

### Inline forms

Use the `.form-inline` class to display a series of labels, form controls, and buttons on a single horizontal row. Form controls within inline forms vary slightly from their default states.

- Controls are `display: flex`, collapsing any HTML white space and allowing you to provide alignment control with [spacing]({{ site.baseurl }}/docs/{{ site.docs_version }}/utilities/spacing/) and [flexbox]({{ site.baseurl }}/docs/{{ site.docs_version }}/utilities/flexbox/) utilities.
- Controls and input groups receive `width: auto` to override the Bootstrap default `width: 100%`.
- Controls **only appear inline in viewports that are at least 576px wide** to account for narrow viewports on mobile devices.

You may need to manually address the width and alignment of individual form controls with [spacing utilities]({{ site.baseurl }}/docs/{{ site.docs_version }}/utilities/spacing/) (as shown below). Lastly, be sure to always include a `<label>` with each form control, even if you need to hide it from non-screenreader visitors with `.sr-only`.

{% example html %}
<form class="form-inline">
  <label class="sr-only" for="inlineFormInput">Name</label>
  <input type="text" class="form-control mb-2 mr-sm-2 mb-sm-0" id="inlineFormInput" placeholder="Jane Doe">

  <label class="sr-only" for="inlineFormInputGroup">Username</label>
  <div class="input-group mb-2 mr-sm-2 mb-sm-0">
    <div class="input-group-addon">@</div>
    <input type="text" class="form-control" id="inlineFormInputGroup" placeholder="Username">
  </div>

  <div class="form-check mb-2 mr-sm-2 mb-sm-0">
    <label class="form-check-label">
      <input class="form-check-input" type="checkbox"> Remember me
    </label>
  </div>

  <button type="submit" class="btn btn-primary">Submit</button>
</form>
{% endexample %}

Custom form controls and selects are also supported.

{% example html %}
<form class="form-inline">
  <label class="mr-sm-2" for="inlineFormCustomSelect">Preference</label>
  <select class="custom-select mb-2 mr-sm-2 mb-sm-0" id="inlineFormCustomSelect">
    <option selected>Choose...</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
  </select>

  <label class="custom-control custom-checkbox mb-2 mr-sm-2 mb-sm-0">
    <input type="checkbox" class="custom-control-input">
    <span class="custom-control-indicator"></span>
    <span class="custom-control-description">Remember my preference</span>
  </label>

  <button type="submit" class="btn btn-primary">Submit</button>
</form>
{% endexample %}

{% callout warning %}
#### Alternatives to hidden labels
Assistive technologies such as screen readers will have trouble with your forms if you don't include a label for every input. For these inline forms, you can hide the labels using the `.sr-only` class. There are further alternative methods of providing a label for assistive technologies, such as the `aria-label`, `aria-labelledby` or `title` attribute. If none of these are present, assistive technologies may resort to using the `placeholder` attribute, if present, but note that use of `placeholder` as a replacement for other labelling methods is not advised.
{% endcallout %}

### Using the Grid

For more structured form layouts that are also responsive, you can utilize Bootstrap's [predefined grid classes]({{ site.baseurl }}/docs/{{ site.docs_version }}/layout/grid/) or [mixins]({{ site.baseurl }}/docs/{{ site.docs_version }}/layout/grid/#sass-mixins) to create horizontal forms. Add the `.row` class to form groups and use the `.col-*-*` classes to specify the width of your labels and controls.

Be sure to add `.col-form-label` to your `<label>`s as well so they're vertically centered with their associated form controls. For `<legend>` elements, you can use `.col-form-legend` to make them appear similar to regular `<label>` elements.

{% example html %}
<div class="container">
  <form>
    <div class="form-group row">
      <label for="inputEmail3" class="col-sm-2 col-form-label">Email</label>
      <div class="col-sm-10">
        <input type="email" class="form-control" id="inputEmail3" placeholder="Email">
      </div>
    </div>
    <div class="form-group row">
      <label for="inputPassword3" class="col-sm-2 col-form-label">Password</label>
      <div class="col-sm-10">
        <input type="password" class="form-control" id="inputPassword3" placeholder="Password">
      </div>
    </div>
    <fieldset class="form-group">
      <div class="row">
        <legend class="col-form-legend col-sm-2">Radios</legend>
        <div class="col-sm-10">
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios1" value="option1" checked>
              Option one is this and that&mdash;be sure to include why it's great
            </label>
          </div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios2" value="option2">
              Option two can be something else and selecting it will deselect option one
            </label>
          </div>
          <div class="form-check disabled">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios3" value="option3" disabled>
              Option three is disabled
            </label>
          </div>
        </div>
      </div>
    </fieldset>
    <div class="form-group row">
      <div class="col-sm-2">Checkbox</div>
      <div class="col-sm-10">
        <div class="form-check">
          <label class="form-check-label">
            <input class="form-check-input" type="checkbox"> Check me out
          </label>
        </div>
      </div>
    </div>
    <div class="form-group row">
      <div class="offset-sm-2 col-sm-10">
        <button type="submit" class="btn btn-primary">Sign in</button>
      </div>
    </div>
  </form>
</div>
{% endexample %}

More complex layouts can also be created with the grid system.

{% example html %}
<div class="container">
  <form>
    <div class="row">
      <div class="form-group col-md-6">
        <label for="inputEmail4" class="col-form-label">Email</label>
        <input type="email" class="form-control" id="inputEmail4" placeholder="Email">
      </div>
      <div class="form-group col-md-6">
        <label for="inputPassword4" class="col-form-label">Password</label>
        <input type="password" class="form-control" id="inputPassword4" placeholder="Password">
      </div>
    </div>
    <div class="form-group">
      <label for="inputAddress" class="col-form-label">Address</label>
      <input type="text" class="form-control" id="inputAddress" placeholder="1234 Main St">
    </div>
    <div class="form-group">
      <label for="inputAddress2" class="col-form-label">Address 2</label>
      <input type="text" class="form-control" id="inputAddress2" placeholder="Apartment, studio, or floor">
    </div>
    <div class="row">
      <div class="form-group col-md-6">
        <label for="inputCity" class="col-form-label">City</label>
        <input type="text" class="form-control" id="inputCity">
      </div>
      <div class="form-group col-md-4">
        <label for="inputState" class="col-form-label">State</label>
        <select id="inputState" class="form-control">Choose</select>
      </div>
      <div class="form-group col-md-2">
        <label for="inputZip" class="col-form-label">Zip</label>
        <input type="text" class="form-control" id="inputZip">
      </div>
    </div>
    <div class="form-group">
      <div class="form-check">
        <label class="form-check-label">
          <input class="form-check-input" type="checkbox"> Check me out
        </label>
      </div>
    </div>
    <button type="submit" class="btn btn-primary">Sign in</button>
  </form>
</div>
{% endexample %}

Grid-based form layouts also support large and small inputs.

{% example html %}
<div class="container">
  <form>
    <div class="form-group row">
      <label for="lgFormGroupInput" class="col-sm-2 col-form-label col-form-label-lg">Email</label>
      <div class="col-sm-10">
        <input type="email" class="form-control form-control-lg" id="lgFormGroupInput" placeholder="you@example.com">
      </div>
    </div>
    <div class="form-group row">
      <label for="smFormGroupInput" class="col-sm-2 col-form-label col-form-label-sm">Email</label>
      <div class="col-sm-10">
        <input type="email" class="form-control form-control-sm" id="smFormGroupInput" placeholder="you@example.com">
      </div>
    </div>
  </form>
</div>
{% endexample %}

## Checkboxes and radios

Default checkboxes and radios are improved upon with the help of `.form-check`, **a single class for both input types that improves the layout and behavior of their HTML elements**. Checkboxes are for selecting one or several options in a list, while radios are for selecting one option from many.

Disabled checkboxes and radios are supported, but to provide a `not-allowed` cursor on hover of the parent `<label>`, you'll need to add the `.disabled` class to the parent `.form-check`. The disabled class will also lighten the text color to help indicate the input's state.

### Default (stacked)

By default, any number of checkboxes and radios that are immediate sibling will be vertically stacked and appropriately spaced with `.form-check`.

{% example html %}
<div class="form-check">
  <label class="form-check-label">
    <input class="form-check-input" type="checkbox" value="">
    Option one is this and that&mdash;be sure to include why it's great
  </label>
</div>
<div class="form-check disabled">
  <label class="form-check-label">
    <input class="form-check-input" type="checkbox" value="" disabled>
    Option two is disabled
  </label>
</div>
{% endexample %}

{% example html %}
<div class="form-check">
  <label class="form-check-label">
    <input class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="option1" checked>
    Option one is this and that&mdash;be sure to include why it's great
  </label>
</div>
<div class="form-check">
  <label class="form-check-label">
    <input class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios2" value="option2">
    Option two can be something else and selecting it will deselect option one
  </label>
</div>
<div class="form-check disabled">
  <label class="form-check-label">
    <input class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios3" value="option3" disabled>
    Option three is disabled
  </label>
</div>
{% endexample %}

### Inline

Group checkboxes or radios on the same horizontal row by adding `.form-check-inline` to any `.form-check`.

{% example html %}
<div class="form-check form-check-inline">
  <label class="form-check-label">
    <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1"> 1
  </label>
</div>
<div class="form-check form-check-inline">
  <label class="form-check-label">
    <input class="form-check-input" type="checkbox" id="inlineCheckbox2" value="option2"> 2
  </label>
</div>
<div class="form-check form-check-inline disabled">
  <label class="form-check-label">
    <input class="form-check-input" type="checkbox" id="inlineCheckbox3" value="option3" disabled> 3
  </label>
</div>
{% endexample %}

{% example html %}
<div class="form-check form-check-inline">
  <label class="form-check-label">
    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1"> 1
  </label>
</div>
<div class="form-check form-check-inline">
  <label class="form-check-label">
    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2"> 2
  </label>
</div>
<div class="form-check form-check-inline disabled">
  <label class="form-check-label">
    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="option3" disabled> 3
  </label>
</div>
{% endexample %}

### Without labels

Should you have no text within the `<label>`, the input is positioned as you'd expect. **Currently only works on non-inline checkboxes and radios.** Remember to still provide some form of label for assistive technologies (for instance, using `aria-label`).

{% example html %}
<div class="form-check">
  <label class="form-check-label">
    <input class="form-check-input" type="checkbox" id="blankCheckbox" value="option1" aria-label="...">
  </label>
</div>
<div class="form-check">
  <label class="form-check-label">
    <input class="form-check-input" type="radio" name="blankRadio" id="blankRadio1" value="option1" aria-label="...">
  </label>
</div>
{% endexample %}

## Static controls

If you want to have read-only fields in your form styled as plain text, use the `.form-control-static` class to remove the default form field styling and preserve the correct margin and padding.

{% example html %}
<form>
  <div class="form-group row">
    <label for="staticEmail" class="col-sm-2 col-form-label">Email</label>
    <div class="col-sm-10">
      <input type="text" readonly class="form-control-static" id="staticEmail" value="email@example.com">
    </div>
  </div>
  <div class="form-group row">
    <label for="inputPassword" class="col-sm-2 col-form-label">Password</label>
    <div class="col-sm-10">
      <input type="password" class="form-control" id="inputPassword" placeholder="Password">
    </div>
  </div>
</form>
{% endexample %}

{% example html %}
<form class="form-inline">
  <div class="form-group">
    <label for="staticEmail2" class="sr-only">Email</label>
    <input type="text" readonly class="form-control-static" id="staticEmail2" value="email@example.com">
  </div>
  <div class="form-group mx-sm-3">
    <label for="inputPassword2" class="sr-only">Password</label>
    <input type="password" class="form-control" id="inputPassword2" placeholder="Password">
  </div>
  <button type="submit" class="btn btn-primary">Confirm identity</button>
</form>
{% endexample %}

## Disabled states

Add the `disabled` boolean attribute on an input to prevent user interactions and make it appear lighter.

{% highlight html %}
<input class="form-control" id="disabledInput" type="text" placeholder="Disabled input here..." disabled>
{% endhighlight %}

Add the `disabled` attribute to a `<fieldset>` to disable all the controls within.

{% example html %}
<form>
  <fieldset disabled>
    <div class="form-group">
      <label for="disabledTextInput">Disabled input</label>
      <input type="text" id="disabledTextInput" class="form-control" placeholder="Disabled input">
    </div>
    <div class="form-group">
      <label for="disabledSelect">Disabled select menu</label>
      <select id="disabledSelect" class="form-control">
        <option>Disabled select</option>
      </select>
    </div>
    <div class="checkbox">
      <label>
        <input type="checkbox"> Can't check this
      </label>
    </div>
    <button type="submit" class="btn btn-primary">Submit</button>
  </fieldset>
</form>
{% endexample %}

{% callout warning %}
#### Caveat with anchors

By default, browsers will treat all native form controls (`<input>`, `<select>` and `<button>` elements) inside a `<fieldset disabled>` as disabled, preventing both keyboard and mouse interactions on them. However, if your form also includes `<a ... class="btn btn-*">` elements, these will only be given a style of `pointer-events: none`. As noted in the section about [disabled state for buttons]({{ site.baseurl }}/docs/{{ site.docs_version }}/components/buttons/#disabled-state) (and specifically in the sub-section for anchor elements), this CSS property is not yet standardized and isn't fully supported in Opera 18 and below, or in Internet Explorer 11, and won't prevent keyboard users from being able to focus or activate these links. So to be safe, use custom JavaScript to disable such links.
{% endcallout %}

{% callout danger %}
#### Cross-browser compatibility

While Bootstrap will apply these styles in all browsers, Internet Explorer 11 and below don't fully support the `disabled` attribute on a `<fieldset>`. Use custom JavaScript to disable the fieldset in these browsers.
{% endcallout %}

## Readonly inputs

Add the `readonly` boolean attribute on an input to prevent modification of the input's value. Read-only inputs appear lighter (just like disabled inputs), but retain the standard cursor.

{% example html %}
<input class="form-control" type="text" placeholder="Readonly input here…" readonly>
{% endexample %}

## Control sizing

Set heights using classes like `.form-control-lg`, and set widths using grid column classes like `.col-lg-*`.

{% example html %}
<input class="form-control form-control-lg" type="text" placeholder=".form-control-lg">
<input class="form-control" type="text" placeholder="Default input">
<input class="form-control form-control-sm" type="text" placeholder=".form-control-sm">
{% endexample %}

{% example html %}
<select class="form-control form-control-lg">
  <option>Large select</option>
</select>
<select class="form-control">
  <option>Default select</option>
</select>
<select class="form-control form-control-sm">
  <option>Small select</option>
</select>
{% endexample %}

## Column sizing

Wrap inputs in grid columns, or any custom parent element, to easily enforce desired widths.

{% example html %}
<div class="row">
  <div class="col-2">
    <input type="text" class="form-control" placeholder=".col-2">
  </div>
  <div class="col-3">
    <input type="text" class="form-control" placeholder=".col-3">
  </div>
  <div class="col-4">
    <input type="text" class="form-control" placeholder=".col-4">
  </div>
</div>
{% endexample %}

## Help text

Block-level help text in forms can be created using `.form-text` (previously known as `.help-block` in v3). Inline help text can be flexibly implemented using any inline HTML element and utility classes like `.text-muted`.

{% callout warning %}
#### Associating help text with form controls

Help text should be explicitly associated with the form control it relates to using the `aria-describedby` attribute. This will ensure that assistive technologies – such as screen readers – will announce this help text when the user focuses or enters the control.
{% endcallout %}

### Block level

Block help text—for below inputs or for longer lines of help text—can be easily achieved with `.form-text`. This class includes `display: block` and adds some top margin for easy spacing from the inputs above.

{% example html %}
<label for="inputPassword5">Password</label>
<input type="password" id="inputPassword5" class="form-control" aria-describedby="passwordHelpBlock">
<p id="passwordHelpBlock" class="form-text text-muted">
  Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
</p>
{% endexample %}

### Inline

Inline text can use any typical inline HTML element (be it a `<small>`, `<span>`, or something else).

{% example html %}
<form class="form-inline">
  <div class="form-group">
    <label for="inputPassword6">Password</label>
    <input type="password" id="inputPassword6" class="form-control mx-sm-3" aria-describedby="passwordHelpInline">
    <small id="passwordHelpInline" class="text-muted">
      Must be 8-20 characters long.
    </small>
  </div>
</form>
{% endexample %}

## Validation

Provide valuable, actionable feedback to your users with HTML5 form validation–[available in all our supported browsers](http://caniuse.com/#feat=form-validation). Choose from the browser default validation feedback, or implement custom messages with our built-in classes and starter JavaScript.

{% callout warning %}
We **highly recommend** custom validation styles as native browser defaults are not announced to screen readers.
{% endcallout %}

### How it works

Here's a rundown of how form validation works:

- HTML form validation includes support for two CSS pseudo-classes, `:invalid` and `:valid`, on `<input>`, `<select>`, and `<textarea>` elements.
- Due to constaints in how CSS works, we cannot (at present) apply styles to a `<label>` that comes before a form control in the DOM without the help of custom JavaScript.
- Bootstrap scopes the `:invalid` and `:valid` styles to parent `.was-validated` class, usually applied to the `<form>`. Otherwise, any required field without a value shows up as invalid on page load. This way, you may choose when to activate them (typically after form submission is attempted).
- As a fallback, `.is-invalid` and `.is-valid` classes are available for [server side validation](#server-side) (without the need for a `.was-validated` parent class).
- All modern browsers support the [constraint validation API](https://www.w3.org/TR/html5/forms.html#the-constraint-validation-api), a series of JavaScript methods for validating form controls.
- Feedback messages may utilize the browser defaults (different for each browser, and unstylable via CSS) or our custom feedback styles with additional HTML and CSS.
- You may provide custom validity messages with `setCustomValidity` in JavaScript.

With that in mind, consider the following two demos for our custom form validation styles and browser defaults.

### Custom styles

For custom Bootstrap form validation messages, you'll need to add the `novalidate` boolean attribute to your `<form>`. This disables the browser default feedback tooltips, but still provides access to the form validation APIs in JavaScript. Try to submit the form below; our JavaScript will intercept the submit button and relay feedback to you.

When attempting to submit, you'll see the `:invalid` and `:valid` styles applied to your form controls.

{% example html %}
<form class="container" id="needs-validation" novalidate>
  <div class="row">
    <div class="col-md-6 mb-3">
      <label for="validationCustom01">First name</label>
      <input type="text" class="form-control" id="validationCustom01" placeholder="First name" value="Mark" required>
    </div>
    <div class="col-md-6 mb-3">
      <label for="validationCustom02">Last name</label>
      <input type="text" class="form-control" id="validationCustom02" placeholder="Last name" value="Otto" required>
    </div>
  </div>
  <div class="row">
    <div class="col-md-6 mb-3">
      <label for="validationCustom03">City</label>
      <input type="text" class="form-control" id="validationCustom03" placeholder="City" required>
      <div class="invalid-feedback">
        Please provide a valid city.
      </div>
    </div>
    <div class="col-md-3 mb-3">
      <label for="validationCustom04">State</label>
      <input type="text" class="form-control" id="validationCustom04" placeholder="State" required>
      <div class="invalid-feedback">
        Please provide a valid state.
      </div>
    </div>
    <div class="col-md-3 mb-3">
      <label for="validationCustom05">Zip</label>
      <input type="text" class="form-control" id="validationCustom05" placeholder="Zip" required>
      <div class="invalid-feedback">
        Please provide a valid zip.
      </div>
    </div>
  </div>
  <button class="btn btn-primary" type="submit">Submit form</button>
</form>

<script>
// Example starter JavaScript for disabling form submissions if there are invalid fields
(function() {
  "use strict";
  window.addEventListener("load", function() {
    var form = document.getElementById("needs-validation");
    form.addEventListener("submit", function(event) {
      if (form.checkValidity() == false) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add("was-validated");
    }, false);
  }, false);
}());
</script>
{% endexample %}

### Browser defaults

Not interested in custom validation feedback messages or writing JavaScript to change form behaviors? All good, you can use the browser defaults. Try submitting the form below. Depending on your browser and OS, you'll see a slightly different style of feedback.

While these feedback styles cannot be styled with CSS, you can still customize the feedback text through JavaScript.

{% example html %}
<form>
  <div class="row">
    <div class="col-md-6 mb-3">
      <input type="text" class="form-control" placeholder="First name" value="Mark" required>
    </div>
    <div class="col-md-6 mb-3">
      <input type="text" class="form-control" placeholder="Last name" value="Otto" required>
    </div>
  </div>

  <div class="row">
    <div class="col-md-7 mb-3">
      <input type="text" class="form-control" placeholder="City" required>
    </div>
    <div class="col-md-3 mb-3">
      <input type="text" class="form-control" placeholder="State" required>
    </div>
    <div class="col-md-2 mb-3">
      <input type="text" class="form-control" placeholder="Zip" required>
    </div>
  </div>

  <button class="btn btn-primary" type="submit">Submit form</button>
</form>
{% endexample %}

### Supported elements

Our example forms show native textual `<input>`s above, but form validation styles are available for our custom form controls, too.

{% example html %}
<form class="was-validated">
  <label class="custom-control custom-checkbox">
    <input type="checkbox" class="custom-control-input" required>
    <span class="custom-control-indicator"></span>
    <span class="custom-control-description">Check this custom checkbox</span>
  </label>

  <div class="custom-controls-stacked d-block my-3">
    <label class="custom-control custom-radio">
      <input id="radioStacked1" name="radio-stacked" type="radio" class="custom-control-input" required>
      <span class="custom-control-indicator"></span>
      <span class="custom-control-description">Toggle this custom radio</span>
    </label>
    <label class="custom-control custom-radio">
      <input id="radioStacked2" name="radio-stacked" type="radio" class="custom-control-input" required>
      <span class="custom-control-indicator"></span>
      <span class="custom-control-description">Or toggle this other custom radio</span>
    </label>
  </div>

  <select class="custom-select d-block my-3" required>
    <option value="">Open this select menu</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
  </select>

  <label class="custom-file">
    <input type="file" id="file" class="custom-file-input" required>
    <span class="custom-file-control"></span>
  </label>
</form>
{% endexample %}

## Custom forms

For even more customization and cross browser consistency, use our completely custom form elements to replace the browser defaults. They're built on top of semantic and accessible markup, so they're solid replacements for any default form control.

### Checkboxes and radios

Each checkbox and radio is wrapped in a `<label>` for three reasons:

- It provides a larger hit areas for checking the control.
- It provides a helpful and semantic wrapper to help us replace the default `<input>`s.
- It triggers the state of the `<input>` automatically, meaning no JavaScript is required.

We hide the default `<input>` with `opacity` and use the `.custom-control-indicator` to build a new custom form indicator in its place. Unfortunately we can't build a custom one from just the `<input>` because CSS's `content` doesn't work on that element.

We use the sibling selector (`~`) for all our `<input>` states—like `:checked`—to properly style our custom form indicator. When combined with the `.custom-control-description` class, we can also style the text for each item based on the `<input>`'s state.

In the checked states, we use **base64 embedded SVG icons** from [Open Iconic](https://useiconic.com/open). This provides us the best control for styling and positioning across browsers and devices.

#### Checkboxes

{% example html %}
<label class="custom-control custom-checkbox">
  <input type="checkbox" class="custom-control-input">
  <span class="custom-control-indicator"></span>
  <span class="custom-control-description">Check this custom checkbox</span>
</label>
{% endexample %}

Custom checkboxes can also utilize the `:indeterminate` pseudo class when manually set via JavaScript (there is no available HTML attribute for specifying it).

<div class="bd-example bd-example-indeterminate">
  <label class="custom-control custom-checkbox">
    <input type="checkbox" class="custom-control-input">
    <span class="custom-control-indicator"></span>
    <span class="custom-control-description">Check this custom checkbox</span>
  </label>
</div>

If you're using jQuery, something like this should suffice:

{% highlight js %}
$('.your-checkbox').prop('indeterminate', true)
{% endhighlight %}

#### Radios

{% example html %}
<label class="custom-control custom-radio">
  <input id="radio1" name="radio" type="radio" class="custom-control-input">
  <span class="custom-control-indicator"></span>
  <span class="custom-control-description">Toggle this custom radio</span>
</label>
<label class="custom-control custom-radio">
  <input id="radio2" name="radio" type="radio" class="custom-control-input">
  <span class="custom-control-indicator"></span>
  <span class="custom-control-description">Or toggle this other custom radio</span>
</label>
{% endexample %}

#### Disabled

Custom checkboxes and radios can also be disabled. Add the `disabled` boolean attribute to the `<input>` and the custom indicator and label description will be automatically styled.

{% example html %}
<label class="custom-control custom-checkbox">
  <input type="checkbox" class="custom-control-input" disabled>
  <span class="custom-control-indicator"></span>
  <span class="custom-control-description">Check this custom checkbox</span>
</label>

<label class="custom-control custom-radio">
  <input id="radio3" name="radioDisabled" type="radio" class="custom-control-input" disabled>
  <span class="custom-control-indicator"></span>
  <span class="custom-control-description">Toggle this custom radio</span>
</label>
{% endexample %}

#### Validation states

Add other states to your custom forms with our validation classes.

{% example html %}
<div class="form-group has-success">
  <label class="custom-control custom-checkbox">
    <input type="checkbox" class="custom-control-input">
    <span class="custom-control-indicator"></span>
    <span class="custom-control-description">Check this custom checkbox</span>
  </label>
</div>
<div class="form-group has-warning">
  <label class="custom-control custom-checkbox">
    <input type="checkbox" class="custom-control-input">
    <span class="custom-control-indicator"></span>
    <span class="custom-control-description">Check this custom checkbox</span>
  </label>
</div>
<div class="form-group has-danger mb-0">
  <label class="custom-control custom-checkbox">
    <input type="checkbox" class="custom-control-input">
    <span class="custom-control-indicator"></span>
    <span class="custom-control-description">Check this custom checkbox</span>
  </label>
</div>
{% endexample %}

#### Stacked

Custom checkboxes and radios are inline to start. Add a parent with class `.custom-controls-stacked` to ensure each form control is on separate lines.

{% example html %}
<div class="custom-controls-stacked">
  <label class="custom-control custom-radio">
    <input id="radioStacked1" name="radio-stacked" type="radio" class="custom-control-input">
    <span class="custom-control-indicator"></span>
    <span class="custom-control-description">Toggle this custom radio</span>
  </label>
  <label class="custom-control custom-radio">
    <input id="radioStacked2" name="radio-stacked" type="radio" class="custom-control-input">
    <span class="custom-control-indicator"></span>
    <span class="custom-control-description">Or toggle this other custom radio</span>
  </label>
</div>
{% endexample %}

### Select menu

Custom `<select>` menus need only a custom class, `.custom-select` to trigger the custom styles.

{% example html %}
<select class="custom-select">
  <option selected>Open this select menu</option>
  <option value="1">One</option>
  <option value="2">Two</option>
  <option value="3">Three</option>
</select>
{% endexample %}

### File browser

The file input is the most gnarly of the bunch and require additional JavaScript if you'd like to hook them up with functional *Choose file...* and selected file name text.

{% example html %}
<label class="custom-file">
  <input type="file" id="file" class="custom-file-input">
  <span class="custom-file-control"></span>
</label>
{% endexample %}

Here's how it works:

- We wrap the `<input>` in a `<label>` so the custom control properly triggers the file browser.
- We hide the default file `<input>` via `opacity`.
- We use `:after` to generate a custom background and directive (*Choose file...*).
- We use `:before` to generate and position the *Browse* button.
- We declare a `height` on the `<input>` for proper spacing for surrounding content.

In other words, it's an entirely custom element, all generated via CSS.

#### Translating or customizing the strings

The [`:lang()` pseudo-class](https://developer.mozilla.org/en-US/docs/Web/CSS/:lang) is used to allow for easy translation of the "Browse" and "Choose file..." text into other languages. Simply override or add entries to the `$custom-file-text` SCSS variable with the relevant [language tag](https://en.wikipedia.org/wiki/IETF_language_tag) and localized strings. The English strings can be customized the same way. For example, here's how one might add a Spanish translation (Spanish's language code is `es`):

{% highlight scss %}
$custom-file-text: (
  placeholder: (
    en: "Choose file...",
    es: "Seleccionar archivo..."
  ),
  button-label: (
    en: "Browse",
    es: "Navegar"
  )
);
{% endhighlight %}

You'll need to set the language of your document (or subtree thereof) correctly in order for the correct text to be shown. This can be done using [the `lang` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang) or the [`Content-Language` HTTP header](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.12), among other methods.
