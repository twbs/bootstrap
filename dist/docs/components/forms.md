---
layout: docs
title: Forms
group: components
---

Bootstrap provides several form control styles, layout options, and custom components for creating a wide variety of forms.

## Contents

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## Form controls

Bootstrap's form controls expand on [our Rebooted form styles]({{ site.baseurl }}/content/reboot/#forms) with classes. Use these classes to opt into their customized displays for a more consistent rendering across browsers and devices. The example form below demonstrates common HTML form elements that receive updated styles from Bootstrap with additional classes.

Remember, since Bootstrap utilizes the HTML5 doctype, **all inputs must have a `type` attribute**.

{% example html %}
<form>
  <fieldset class="form-group">
    <label for="exampleInputEmail1">Email address</label>
    <input type="email" class="form-control" id="exampleInputEmail1" placeholder="Enter email">
    <small class="text-muted">We'll never share your email with anyone else.</small>
  </fieldset>
  <fieldset class="form-group">
    <label for="exampleInputPassword1">Password</label>
    <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
  </fieldset>
  <fieldset class="form-group">
    <label for="exampleSelect1">Example select</label>
    <select class="form-control" id="exampleSelect1">
      <option>1</option>
      <option>2</option>
      <option>3</option>
      <option>4</option>
      <option>5</option>
    </select>
  </fieldset>
  <fieldset class="form-group">
    <label for="exampleSelect2">Example multiple select</label>
    <select multiple class="form-control" id="exampleSelect2">
      <option>1</option>
      <option>2</option>
      <option>3</option>
      <option>4</option>
      <option>5</option>
    </select>
  </fieldset>
  <fieldset class="form-group">
    <label for="exampleTextarea">Example textarea</label>
    <textarea class="form-control" id="exampleTextarea" rows="3"></textarea>
  </fieldset>
  <fieldset class="form-group">
    <label for="exampleInputFile">File input</label>
    <input type="file" class="form-control-file" id="exampleInputFile">
    <small class="text-muted">This is some placeholder block-level help text for the above input. It's a bit lighter and easily wraps to a new line.</small>
  </fieldset>
  <div class="radio">
    <label>
      <input type="radio" name="optionsRadios" id="optionsRadios1" value="option1" checked>
      Option one is this and that&mdash;be sure to include why it's great
    </label>
  </div>
  <div class="radio">
    <label>
      <input type="radio" name="optionsRadios" id="optionsRadios2" value="option2">
      Option two can be something else and selecting it will deselect option one
    </label>
  </div>
  <div class="radio disabled">
    <label>
      <input type="radio" name="optionsRadios" id="optionsRadios3" value="option3" disabled>
      Option three is disabled
    </label>
  </div>
  <div class="checkbox">
    <label>
      <input type="checkbox"> Check me out
    </label>
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>
{% endexample %}

Below is a complete list of the specific from controls supported by Bootstrap and the classes that customize them. Additional documentation is available for each group.

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
        {% markdown %}`text`, `password`, `datetime`, `datetime-local`, `date`, `month`, `time`, `week`, `number`, `email`, `url`, `search`, `tel`, `color`{% endmarkdown %}
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
`.radio`<br>
`.radio-inline`<br>
`.checkbox`<br>
`.checkbox-inline`
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

## Form layouts

Since Bootstrap applies `display: block` and `width: 100%` to almost all our form controls, forms will by default stack vertically. Additional classes can be used to vary this layout on a per-form basis.

### Form groups

The `.form-group` class is the easiest way to add some structure to forms. Its only purpose is to provide `margin-bottom` around a label and control pairing. As a bonus, since it's a class you can use it with `<fieldset>`s, `<div>`s, or nearly any other element.

{% example html %}
<form>
  <fieldset class="form-group">
    <label for="formGroupExampleInput">Example label</label>
    <input type="text" class="form-control" id="formGroupExampleInput" placeholder="Example input">
  </fieldset>
  <fieldset class="form-group">
    <label for="formGroupExampleInput2">Another label</label>
    <input type="text" class="form-control" id="formGroupExampleInput2" placeholder="Another input">
  </fieldset>
</form>
{% endexample %}

### Inline forms

Use the `.form-inline` class to to display a series of labels, form controls, and buttons on a single horizontal row. Form controls within inline forms behave differently:

- Controls are `display: inline-block` to provide alignment control via `vertical-align` and `margin`.
- Controls receive `width: auto` to override the Bootstrap default `width: 100%`.
- Controls **only appear inline in viewports that are at least 768px wide** to account for narrow viewports on mobile devices.

Because of this, you may need to manually address the width and alignment of individual form controls. Lastly, as shown below, you should always include a `<label>` with each form control.

#### Visible labels

{% example html %}
<form class="form-inline">
  <div class="form-group">
    <label for="exampleInputName2">Name</label>
    <input type="text" class="form-control" id="exampleInputName2" placeholder="Jane Doe">
  </div>
  <div class="form-group">
    <label for="exampleInputEmail2">Email</label>
    <input type="email" class="form-control" id="exampleInputEmail2" placeholder="jane.doe@example.com">
  </div>
  <button type="submit" class="btn btn-primary">Send invitation</button>
</form>
{% endexample %}

#### Hidden labels

{% example html %}
<form class="form-inline">
  <div class="form-group">
    <label class="sr-only" for="exampleInputEmail3">Email address</label>
    <input type="email" class="form-control" id="exampleInputEmail3" placeholder="Enter email">
  </div>
  <div class="form-group">
    <label class="sr-only" for="exampleInputPassword3">Password</label>
    <input type="password" class="form-control" id="exampleInputPassword3" placeholder="Password">
  </div>
  <div class="checkbox">
    <label>
      <input type="checkbox"> Remember me
    </label>
  </div>
  <button type="submit" class="btn btn-primary">Sign in</button>
</form>
{% endexample %}

{% example html %}
<form class="form-inline">
  <div class="form-group">
    <label class="sr-only" for="exampleInputAmount">Amount (in dollars)</label>
    <div class="input-group">
      <div class="input-group-addon">$</div>
      <input type="text" class="form-control" id="exampleInputAmount" placeholder="Amount">
      <div class="input-group-addon">.00</div>
    </div>
  </div>
  <button type="submit" class="btn btn-primary">Transfer cash</button>
</form>
{% endexample %}

### Using the Grid

For more structured form layouts, you can utilize Bootstrap's predefined grid classes (or mixins). Add the `.row` class to form groups and use the `.col-*` classes to specify the width of your labels and controls. To vertically center the labels with the textual inputs—nearly anything with `.form-control`—use the `.form-control-label` class.

{% example html %}
<form>
  <div class="form-group row">
    <label for="inputEmail3" class="col-sm-2 form-control-label">Email</label>
    <div class="col-sm-10">
      <input type="email" class="form-control" id="inputEmail3" placeholder="Email">
    </div>
  </div>
  <div class="form-group row">
    <label for="inputPassword3" class="col-sm-2 form-control-label">Password</label>
    <div class="col-sm-10">
      <input type="password" class="form-control" id="inputPassword3" placeholder="Password">
    </div>
  </div>
  <div class="form-group row">
    <label class="col-sm-2">Radios</label>
    <div class="col-sm-10">
      <div class="radio">
        <label>
          <input type="radio" name="gridRadios" id="gridRadios1" value="option1" checked>
          Option one is this and that&mdash;be sure to include why it's great
        </label>
      </div>
      <div class="radio">
        <label>
          <input type="radio" name="gridRadios" id="gridRadios2" value="option2">
          Option two can be something else and selecting it will deselect option one
        </label>
      </div>
      <div class="radio disabled">
        <label>
          <input type="radio" name="gridRadios" id="gridRadios3" value="option3" disabled>
          Option three is disabled
        </label>
      </div>
    </div>
  </div>
  <div class="form-group row">
    <label class="col-sm-2">Checkbox</label>
    <div class="col-sm-10">
      <div class="checkbox">
        <label>
          <input type="checkbox"> Check me out
        </label>
      </div>
    </div>
  </div>
  <div class="form-group row">
    <div class="col-sm-offset-2 col-sm-10">
      <button type="submit" class="btn btn-secondary">Sign in</button>
    </div>
  </div>
</form>
{% endexample %}

## Checkboxes and radios

Checkboxes are for selecting one or several options in a list, while radios are for selecting one option from many.

Disabled checkboxes and radios are supported, but to provide a "not-allowed" cursor on hover of the parent `<label>`, you'll need to add the <code>.disabled</code> class to the parent `.radio`, `.radio-inline`, `.checkbox`, or `.checkbox-inline`.

### Default (stacked)

{% example html %}
<div class="checkbox">
  <label>
    <input type="checkbox" value="">
    Option one is this and that&mdash;be sure to include why it's great
  </label>
</div>
<div class="checkbox disabled">
  <label>
    <input type="checkbox" value="" disabled>
    Option two is disabled
  </label>
</div>

<div class="radio">
  <label>
    <input type="radio" name="exampleRadios" id="exampleRadios1" value="option1" checked>
    Option one is this and that&mdash;be sure to include why it's great
  </label>
</div>
<div class="radio">
  <label>
    <input type="radio" name="exampleRadios" id="exampleRadios2" value="option2">
    Option two can be something else and selecting it will deselect option one
  </label>
</div>
<div class="radio disabled">
  <label>
    <input type="radio" name="exampleRadios" id="exampleRadios3" value="option3" disabled>
    Option three is disabled
  </label>
</div>
{% endexample %}

### Inline

Use the `.checkbox-inline` or `.radio-inline` classes on a series of checkboxes or radios for controls that appear on the same line.

{% example html %}
<label class="checkbox-inline">
  <input type="checkbox" id="inlineCheckbox1" value="option1"> 1
</label>
<label class="checkbox-inline">
  <input type="checkbox" id="inlineCheckbox2" value="option2"> 2
</label>
<label class="checkbox-inline">
  <input type="checkbox" id="inlineCheckbox3" value="option3"> 3
</label>
{% endexample %}

{% example html %}
<label class="radio-inline">
  <input type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1"> 1
</label>
<label class="radio-inline">
  <input type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2"> 2
</label>
<label class="radio-inline">
  <input type="radio" name="inlineRadioOptions" id="inlineRadio3" value="option3"> 3
</label>
{% endexample %}

### Without labels

Should you have no text within the `<label>`, the input is positioned as you'd expect. **Currently only works on non-inline checkboxes and radios.**

{% example html %}
<div class="checkbox">
  <label>
    <input type="checkbox" id="blankCheckbox" value="option1">
  </label>
</div>
<div class="radio">
  <label>
    <input type="radio" name="blankRadio" id="blankRadio1" value="option1">
  </label>
</div>
{% endexample %}

## Static controls

When you need to place plain text next to a form label within a form, use the `.form-control-static` class on a `<p>`.

{% example html %}
<form>
  <div class="form-group row">
    <label class="col-sm-2 form-control-label">Email</label>
    <div class="col-sm-10">
      <p class="form-control-static">email@example.com</p>
    </div>
  </div>
  <div class="form-group row">
    <label for="inputPassword" class="col-sm-2 form-control-label">Password</label>
    <div class="col-sm-10">
      <input type="password" class="form-control" id="inputPassword" placeholder="Password">
    </div>
  </div>
</form>
{% endexample %}

{% example html %}
<form class="form-inline">
  <div class="form-group">
    <label class="sr-only">Email</label>
    <p class="form-control-static">email@example.com</p>
  </div>
  <div class="form-group">
    <label for="inputPassword2" class="sr-only">Password</label>
    <input type="password" class="form-control" id="inputPassword2" placeholder="Password">
  </div>
  <button type="submit" class="btn btn-primary">Confirm identity</button>
</form>
{% endexample %}

## Disabled states

Add the `disabled` boolean attribute on an input to prevent user interactions. Disabled inputs appear lighter and add a `not-allowed` cursor.

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
#### Caveat about link functionality of `<a>`

By default, browsers will treat all native form controls (`<input>`, `<select>` and `<button>` elements) inside a `<fieldset disabled>` as disabled, preventing both keyboard and mouse interactions on them. However, if your form also includes `<a ... class="btn btn-*">` elements, these will only be given a style of `pointer-events: none`. As noted in the section about [disabled state for buttons](../buttons/#disabled-state) (and specifically in the sub-section for anchor elements), this CSS property is not yet standardized and isn't fully supported in Opera 18 and below, or in Internet Explorer 11, and won't prevent keyboard users from being able to focus or activate these links. So to be safe, use custom JavaScript to disable such links.
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
<select class="form-control form-control-lg"></select>
<select class="form-control"></select>
<select class="form-control form-control-sm"></select>
{% endexample %}

## Column sizing

Wrap inputs in grid columns, or any custom parent element, to easily enforce desired widths.

{% example html %}
<div class="row">
  <div class="col-xs-2">
    <input type="text" class="form-control" placeholder=".col-xs-2">
  </div>
  <div class="col-xs-3">
    <input type="text" class="form-control" placeholder=".col-xs-3">
  </div>
  <div class="col-xs-4">
    <input type="text" class="form-control" placeholder=".col-xs-4">
  </div>
</div>
{% endexample %}

## Help text

No official help text classes exist in Bootstrap 4 (previously we had `.help-block` in v3), but thanks to our utility classes like `.text-muted`, you can create much more flexible help text as you need it.

Inline text can use any typical inline HTML element (be it a `<small>`, `<span>`, or something else).

{% example html %}
<small class="text-muted">
  Some inline text with a small tag looks like this.
</small>
{% endexample %}

Block help text—for below inputs or for longer lines of help text—can be easily achieved with a `<p>`.

{% example html %}
<p class="text-muted">
  A block of help text that breaks onto a new line and may extend beyond one line.
</p>
{% endexample %}

## Validation

Bootstrap includes validation styles for danger, warning, and success states on form controls. To use, add `.has-warning`, `.has-danger`, or `.has-success` to the parent element. Any `.form-control-label`, `.form-control`, and `.text-help` within that element will receive the validation styles.

{% comment %}
{% callout warning %}
#### Conveying validation state to assistive technologies and colorblind users

Using these validation styles to denote the state of a form control only provides a visual, color-based indication, which will not be conveyed to users of assistive technologies - such as screen readers - or to colorblind users.

Ensure that an alternative indication of state is also provided. For instance, you can include a hint about state in the form control's `<label>` text itself (as is the case in the following code example), include a [Glyphicon](../components/#glyphicons) (with appropriate alternative text using the `.sr-only` class - see the [Glyphicon examples](../components/#glyphicons-examples)), or by providing an additional [help text](#forms-help-text) block. Specifically for assistive technologies, invalid form controls can also be assigned an `aria-invalid="true"` attribute.
{% endcallout %}
{% endcomment %}

{% example html %}
<div class="form-group has-success">
  <label class="form-control-label" for="inputSuccess1">Input with success</label>
  <input type="text" class="form-control form-control-success" id="inputSuccess1">
</div>
<div class="form-group has-warning">
  <label class="form-control-label" for="inputWarning1">Input with warning</label>
  <input type="text" class="form-control form-control-warning" id="inputWarning1">
</div>
<div class="form-group has-danger">
  <label class="form-control-label" for="inputDanger1">Input with danger</label>
  <input type="text" class="form-control form-control-danger" id="inputDanger1">
</div>

<div class="checkbox has-success">
  <label>
    <input type="checkbox" id="checkboxSuccess" value="option1">
    Checkbox with success
  </label>
</div>
<div class="checkbox has-warning">
  <label>
    <input type="checkbox" id="checkboxWarning" value="option1">
    Checkbox with warning
  </label>
</div>
<div class="checkbox has-danger">
  <label>
    <input type="checkbox" id="checkboxDanger" value="option1">
    Checkbox with danger
  </label>
</div>
{% endexample %}

## Custom forms

For even more customization and cross browser consistency, use our completely custom form elements to replace the browser defaults. They're built on top of semantic and accessible markup, so they're solid replacements for any default form control.

### Checkboxes and radios

Each checkbox and radio is wrapped in a `<label>` for three reasons:

- It provides a larger hit areas for checking the control.
- It provides a helpful and semantic wrapper to help us replace the default `<input>`s.
- It triggers the state of the `<input>` automatically, meaning no JavaScript is required.

We hide the default `<input>` with `opacity` and use the `.c-indicator` to build a new custom form control. We can't build a custom one from just the `<input>` because CSS's `content` doesn't work on that element.

With the sibling selector (`~`), we use the `:checked` state to trigger a makeshift checked state on the custom control.

In the checked states, we use **base64 embedded SVG icons** from [Open Iconic](https://useiconic.com/open). This provides us the best control for styling and positioning across browsers and devices.

#### Checkboxes

{% example html %}
<label class="c-input c-checkbox">
  <input type="checkbox">
  <span class="c-indicator"></span>
  Check this custom checkbox
</label>
{% endexample %}

Custom checkboxes can also utilize the `:indeterminate` pseudo class when manually set via JavaScript (there is no available HTML attribute for specifying it).

<div class="bd-example bd-example-indeterminate">
  <label class="c-input c-checkbox">
    <input type="checkbox">
    <span class="c-indicator"></span>
    Check this custom checkbox
  </label>
</div>

 If you're using jQuery, something like this should suffice:

{% highlight js %}
$('.your-checkbox').prop('indeterminate', true)
{% endhighlight %}

#### Radios

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

#### Stacked

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

### Select menu

Custom `<select>` menus need only a custom class, `.c-select` to trigger the custom styles.

{% example html %}
<select class="c-select">
  <option selected>Open this select menu</option>
  <option value="1">One</option>
  <option value="2">Two</option>
  <option value="3">Three</option>
</select>
{% endexample %}

Custom selects degrade nicely in IE9, receiving only a handful of overrides to remove the custom `background-image`. **Multiple selects (e.g., `<select multiple>`) are not currently supported.**

### File browser

{% example html %}
<label class="file">
  <input type="file" id="file">
  <span class="file-custom"></span>
</label>
{% endexample %}

The file input is the most gnarly of the bunch. Here's how it works:

- We wrap the `<input>` in a `<label>` so the custom control properly triggers the file browser.
- We hide the default file `<input>` via `opacity`.
- We use `:after` to generate a custom background and directive (*Choose file...*).
- We use `:before` to generate and position the *Browse* button.
- We declare a `height` on the `<input>` for proper spacing for surrounding content.

In other words, it's an entirely custom element, all generated via CSS.

**Heads up!** The custom file input is currently unable to update the *Choose file...* text with the filename. Without JavaScript, this might not be possible to change, but I'm open to ideas.
