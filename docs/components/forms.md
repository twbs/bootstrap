---
layout: page
title: Forms
---

Bootstrap normalizes common HTML5 form elements and adds a number of layout options for building forms of all sizes.

## Example form

Individual form controls automatically receive some global styling. All textual `<input>`, `<textarea>`, and `<select>` elements with `.form-control` are set to `width: 100%;` by default. Wrap labels and controls in `.form-group` for optimum spacing.

{% example html %}
<form role="form">
  <div class="form-group">
    <label for="exampleInputEmail1">Email address</label>
    <input type="email" class="form-control" id="exampleInputEmail1" placeholder="Enter email">
  </div>
  <div class="form-group">
    <label for="exampleInputPassword1">Password</label>
    <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
  </div>
  <div class="form-group">
    <label for="exampleInputFile">File input</label>
    <input type="file" id="exampleInputFile">
    <p class="help-block">Example block-level help text here.</p>
  </div>
  <div class="checkbox">
    <label>
      <input type="checkbox"> Check me out
    </label>
  </div>
  <button type="submit" class="btn btn-secondary">Submit</button>
</form>
{% endexample %}

<div class="bs-callout bs-callout-warning">
  <h4>Don't mix form groups with input groups</h4>
  <p>Do not mix form groups directly with <a href="/components/#input-groups">input groups</a>. Instead, nest the input group inside of the form group.</p>
</div>

## Inline forms

Add `.form-inline` to your `<form>` for left-aligned and inline-block controls. **This only applies to forms within viewports that are at least 768px wide.**

<div class="bs-callout bs-callout-danger">
  <h4>Requires custom widths</h4>
  <p>Inputs and selects have `width: 100%;` applied by default in Bootstrap. Within inline forms, we reset that to `width: auto;` so multiple controls can reside on the same line. Depending on your layout, additional custom widths may be required.</p>
</div>
<div class="bs-callout bs-callout-warning">
  <h4>Always add labels</h4>
  <p>Screen readers will have trouble with your forms if you don't include a label for every input. For these inline forms, you can hide the labels using the `.sr-only` class.</p>
</div>

{% example html %}
<form class="form-inline" role="form">
  <div class="form-group">
    <label class="sr-only" for="exampleInputEmail2">Email address</label>
    <input type="email" class="form-control" id="exampleInputEmail2" placeholder="Enter email">
  </div>
  <div class="form-group">
    <div class="input-group">
      <div class="input-group-addon">@</div>
      <input class="form-control" type="email" placeholder="Enter email">
    </div>
  </div>
  <div class="form-group">
    <label class="sr-only" for="exampleInputPassword2">Password</label>
    <input type="password" class="form-control" id="exampleInputPassword2" placeholder="Password">
  </div>
  <div class="checkbox">
    <label>
      <input type="checkbox"> Remember me
    </label>
  </div>
  <button type="submit" class="btn btn-secondary">Sign in</button>
</form>
{% endexample %}

## Horizontal forms

Use Bootstrap's predefined grid classes to align labels and groups of form controls in a horizontal layout by adding `.form-horizontal` to the form. Doing so changes `.form-group`s to behave as grid rows, so no need for `.row`.

{% example html %}
<form class="form-horizontal" role="form">
  <div class="form-group">
    <label for="inputEmail3" class="col-sm-2 control-label">Email</label>
    <div class="col-sm-10">
      <input type="email" class="form-control" id="inputEmail3" placeholder="Email">
    </div>
  </div>
  <div class="form-group">
    <label for="inputPassword3" class="col-sm-2 control-label">Password</label>
    <div class="col-sm-10">
      <input type="password" class="form-control" id="inputPassword3" placeholder="Password">
    </div>
  </div>
  <div class="form-group">
    <div class="col-sm-offset-2 col-sm-10">
      <div class="checkbox">
        <label>
          <input type="checkbox"> Remember me
        </label>
      </div>
    </div>
  </div>
  <div class="form-group">
    <div class="col-sm-offset-2 col-sm-10">
      <button type="submit" class="btn btn-secondary">Sign in</button>
    </div>
  </div>
</form>
{% endexample %}

## Supported controls

Examples of standard form controls supported in an example form layout.

### Inputs

Most common form control, text-based input fields. Includes support for all HTML5 types: `text`, `password`, `datetime`, `datetime-local`, `date`, `month`, `time`, `week`, `number`, `email`, `url`, `search`, `tel`, and `color`.

<div class="bs-callout bs-callout-danger">
  <h4>Type declaration required</h4>
  <p>Inputs will only be fully styled if their `type` is properly declared.</p>
</div>

{% example html %}
<input type="text" class="form-control" placeholder="Text input">
{% endexample %}

<div class="bs-callout bs-callout-info">
  <h4>Input groups</h4>
  <p>To add integrated text or buttons before and/or after any text-based `&lt;input&gt;`, <a href="../components/#input-groups">check out the input group component</a>.</p>
</div>

### Textarea

Form control which supports multiple lines of text. Change `rows` attribute as necessary.

{% example html %}
<textarea class="form-control" rows="3"></textarea>
{% endexample %}

### Checkboxes and radios

Checkboxes are for selecting one or several options in a list, while radios are for selecting one option from many.

A checkbox or radio with the `disabled` attribute will be styled appropriately. To have the `<label>` for the checkbox or radio also display a "not-allowed" cursor when the user hovers over the label, add the `.disabled` class to your `.radio`, `.radio-inline`, `.checkbox`, `.checkbox-inline`, or `<fieldset>`.

#### Default (stacked)

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
{% endexample %}

#### Inline checkboxes and radios

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

#### Selects

Use the default option, or add `multiple` to show multiple options at once.

{% example html %}
<select class="form-control">
  <option>1</option>
  <option>2</option>
  <option>3</option>
  <option>4</option>
  <option>5</option>
</select>

<select multiple class="form-control">
  <option>1</option>
  <option>2</option>
  <option>3</option>
  <option>4</option>
  <option>5</option>
</select>
{% endexample %}

## Static controls

When you need to place plain text next to a form label within a horizontal form, use the `.form-control-static` class on a `<p>`.

{% example html %}
<form class="form-horizontal" role="form">
  <div class="form-group">
    <label class="col-sm-2 control-label">Email</label>
    <div class="col-sm-10">
      <p class="form-control-static">email@example.com</p>
    </div>
  </div>
  <div class="form-group">
    <label for="inputPassword" class="col-sm-2 control-label">Password</label>
    <div class="col-sm-10">
      <input type="password" class="form-control" id="inputPassword" placeholder="Password">
    </div>
  </div>
</form>
{% endexample %}

## Focus state

We remove the default `outline` styles on some form controls and apply a `box-shadow` in its place for `:focus`.

<div class="bs-example">
  <form role="form">
    <input class="form-control" id="focusedInput" type="text" value="Demonstrative focus state">
  </form>
</div>

<div class="bs-callout bs-callout-info">
  <h4>Demo `:focus` state</h4>
  <p>The above example input uses custom styles in our documentation to demonstrate the `:focus` state on a `.form-control`.</p>
</div>

## Disabled states

Add the `disabled` boolean attribute on an `<input>`, `<select>`, or `<textarea>` to prevent user input and trigger a slightly different look.

{% highlight html %}
<input class="form-control" id="disabledInput" type="text" placeholder="Disabled input here..." disabled>
{% endhighlight %}

Add the `disabled` attribute to a `<fieldset>` to disable all the controls within.

{% example html %}
<form role="form">
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

<div class="bs-callout bs-callout-warning">
  <h4>Caveat about link functionality of `&lt;a&gt;`</h4>
  <p>Our styles use `pointer-events: none` to try to disable the link functionality of `&lt;a class="btn btn-*"&gt;` buttons in this case, but that CSS property is not yet standardized and isn't fully supported in Opera 18 and below, or in Internet Explorer 11. So to be safe, use custom JavaScript to disable such links.</p>
</div>

<div class="bs-callout bs-callout-danger">
  <h4>Cross-browser compatibility</h4>
  <p>While Bootstrap will apply these styles in all browsers, Internet Explorer 9 and below don't actually support the `disabled` attribute on a `&lt;fieldset&gt;`. Use custom JavaScript to disable the fieldset in these browsers.</p>
</div>

## Readonly inputs

Add the `readonly` boolean attribute on an input to prevent user input and style the input as disabled.

{% example html %}
<input class="form-control" type="text" placeholder="Readonly input here…" readonly>
{% endexample %}

## Validation

Bootstrap includes validation styles for error, warning, and success states on form controls. To use, add `.has-warning`, `.has-error`, or `.has-success` to the parent element. Any `.control-label`, `.form-control`, and `.help-block` within that element will receive the validation styles.

{% example html %}
<div class="form-group has-success">
  <label class="control-label" for="inputSuccess1">Input with success</label>
  <input type="text" class="form-control" id="inputSuccess1">
</div>
<div class="form-group has-warning">
  <label class="control-label" for="inputWarning1">Input with warning</label>
  <input type="text" class="form-control" id="inputWarning1">
</div>
<div class="form-group has-error">
  <label class="control-label" for="inputError1">Input with error</label>
  <input type="text" class="form-control" id="inputError1">
</div>
<div class="has-success">
  <div class="checkbox">
    <label>
      <input type="checkbox" id="checkboxSuccess" value="option1">
      Checkbox with success
    </label>
  </div>
</div>
<div class="has-warning">
  <div class="checkbox">
    <label>
      <input type="checkbox" id="checkboxWarning" value="option1">
      Checkbox with warning
    </label>
  </div>
</div>
<div class="has-error">
  <div class="checkbox">
    <label>
      <input type="checkbox" id="checkboxError" value="option1">
      Checkbox with error
    </label>
  </div>
</div>
{% endexample %}

You can also add optional feedback icons with the addition of `.has-feedback` and the right icon.

<div class="bs-callout bs-callout-warning">
  <h4>Icons, labels, and input groups</h4>
  <p>Manual positioning of feedback icons is required for inputs without a label and for <a href="../components#input-groups">input groups</a> with an add-on on the right. You are strongly encouraged to provide labels for all inputs for accessibility reasons. If you wish to prevent labels from being displayed, hide them with the `sr-only` class. If you must do without labels, adjust the `top` value of the feedback icon. For input groups, adjust the `right` value to an appropriate pixel value depending on the width of your addon.</p>
</div>

{% example html %}
<div class="form-group has-success has-feedback">
  <label class="control-label" for="inputSuccess2">Input with success</label>
  <input type="text" class="form-control" id="inputSuccess2">
  <span class="glyphicon glyphicon-ok form-control-feedback"></span>
</div>
<div class="form-group has-warning has-feedback">
  <label class="control-label" for="inputWarning2">Input with warning</label>
  <input type="text" class="form-control" id="inputWarning2">
  <span class="glyphicon glyphicon-warning-sign form-control-feedback"></span>
</div>
<div class="form-group has-error has-feedback">
  <label class="control-label" for="inputError2">Input with error</label>
  <input type="text" class="form-control" id="inputError2">
  <span class="glyphicon glyphicon-remove form-control-feedback"></span>
</div>
{% endexample %}

{% example html %}
<form class="form-horizontal" role="form">
  <div class="form-group has-success has-feedback">
    <label class="control-label col-sm-3" for="inputSuccess3">Input with success</label>
    <div class="col-sm-9">
      <input type="text" class="form-control" id="inputSuccess3">
      <span class="glyphicon glyphicon-ok form-control-feedback"></span>
    </div>
  </div>
</form>
{% endexample %}

{% example html %}
<form class="form-inline" role="form">
  <div class="form-group has-success has-feedback">
    <label class="control-label" for="inputSuccess4">Input with success</label>
    <input type="text" class="form-control" id="inputSuccess4">
    <span class="glyphicon glyphicon-ok form-control-feedback"></span>
  </div>
</form>
{% endexample %}

For form controls with no visible label, add the `.sr-only` class on the label. Bootstrap will automatically adjust the position of the icon once it's been added.

{% example html %}
<div class="form-group has-success has-feedback">
  <label class="control-label sr-only" for="inputSuccess5">Hidden label</label>
  <input type="text" class="form-control" id="inputSuccess5">
  <span class="glyphicon glyphicon-ok form-control-feedback"></span>
</div>
{% endexample %}

## Control sizing

Set heights using classes like `.input-lg`, and set widths using grid column classes like `.col-lg-*`.

{% example html %}
<input class="form-control input-lg" type="text" placeholder=".input-lg">
<input class="form-control" type="text" placeholder="Default input">
<input class="form-control input-sm" type="text" placeholder=".input-sm">

<select class="form-control input-lg">...</select>
<select class="form-control">...</select>
<select class="form-control input-sm">...</select>
{% endexample %}

Quickly size labels and form controls within `.form-horizontal` by adding `.form-group-lg` or `.form-group-sm` to existing `.form-group`s.

{% example html %}
<form class="form-horizontal" role="form">
  <div class="form-group form-group-lg">
    <label class="col-sm-2 control-label" for="formGroupInputLarge">Large label</label>
    <div class="col-sm-10">
      <input class="form-control" type="text" id="formGroupInputLarge" placeholder="Large input">
    </div>
  </div>
  <div class="form-group form-group-sm">
    <label class="col-sm-2 control-label" for="formGroupInputSmall">Small label</label>
    <div class="col-sm-10">
      <input class="form-control" type="text" id="formGroupInputSmall" placeholder="Small input">
    </div>
  </div>
</form>
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

Block level help text for form controls.

{% example html %}
<p class="help-block">A block of help text that breaks onto a new line and may extend beyond one line.</p>
{% endexample %}
