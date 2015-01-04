---
layout: page
title: Input group
---

Extend form controls by adding text or buttons before, after, or on both sides of any text-based `<input>`. Use `.input-group` with an `.input-group-addon` to prepend or append elements to a single `.form-control`.

<div class="bs-callout bs-callout-danger">
  <h4>Textual <code>&lt;input&gt;</code>s only</h4>
  <p>Avoid using <code>&lt;textarea&gt;</code> elements here as their <code>rows</code> attribute will not be respected in some cases.</p>
</div>
<div class="bs-callout bs-callout-warning">
  <h4>Tooltips &amp; popovers in input groups require special setting</h4>
  <p>When using tooltips or popovers on elements within an <code>.input-group</code>, you'll have to specify the option <code>container: 'body'</code> to avoid unwanted side effects (such as the element growing wider and/or losing its rounded corners when the tooltip or popover is triggered).</p>
</div>
<div class="bs-callout bs-callout-warning">
  <h4>Don't mix with other components</h4>
  <p>Do not mix form groups or grid column classes directly with input groups. Instead, nest the input group inside of the form group or grid-related element.</p>
</div>
<div class="bs-callout bs-callout-warning" id="callout-inputgroup-form-labels">
  <h4>Always add labels</h4>
  <p>Screen readers will have trouble with your forms if you don't include a label for every input. For these input groups, ensure that any additional label or functionality is conveyed to assistive technologies.</p>
  <p>The exact technique to be used (<code>&lt;label&gt;</code> elements hidden using the <code>.sr-only</code> class, or use of the <code>aria-label</code>, <code>aria-labelledby</code>, <code>aria-describedby</code>, <code>title</code> or <code>placeholder</code> attribute) and what additional information will need to be conveyed will vary depending on the exact type of interface widget you're implementing. The examples in this section provide a few suggested, case-specific approaches.</p>
</div>

## Basic example

Place one add-on or button on either side of an input. You may also place one on both sides of an input.

**We do not support multiple add-ons on a single side.**

**We do not support multiple form-controls in a single input group.**

{% example html %}
<div class="input-group">
  <span class="input-group-addon" id="basic-addon1">@</span>
  <input type="text" class="form-control" placeholder="Username" aria-describedby="basic-addon1">
</div>
<br>
<div class="input-group">
  <input type="text" class="form-control" placeholder="Recipient's username" aria-describedby="basic-addon2">
  <span class="input-group-addon" id="basic-addon2">.00</span>
</div>
<br>
<div class="input-group">
  <span class="input-group-addon">$</span>
  <input type="text" class="form-control" aria-label="Amount (to the nearest dollar)">
  <span class="input-group-addon">.00</span>
</div>
{% endexample %}

## Sizing

Add the relative form sizing classes to the `.input-group` itself and contents within will automatically resize—no need for repeating the form control size classes on each element.

{% example html %}
<div class="input-group input-group-lg">
  <span class="input-group-addon" id="sizing-addon1">@</span>
  <input type="text" class="form-control" placeholder="Username" aria-describedby="sizing-addon1">
</div>
<br>
<div class="input-group">
  <span class="input-group-addon" id="sizing-addon2">@</span>
  <input type="text" class="form-control" placeholder="Username" aria-describedby="sizing-addon2">
</div>
<br>
<div class="input-group input-group-sm">
  <span class="input-group-addon" id="sizing-addon3">@</span>
  <input type="text" class="form-control" placeholder="Username" aria-describedby="sizing-addon3">
</div>
{% endexample %}

## Checkboxes and radio addons

Place any checkbox or radio option within an input group's addon instead of text.

{% example html %}
<div class="row">
  <div class="col-lg-6">
    <div class="input-group">
      <span class="input-group-addon">
        <input type="checkbox" aria-label="Checkbox for following text input">
      </span>
      <input type="text" class="form-control" aria-label="Text input with checkbox">
    </div>
  </div>
  <div class="col-lg-6">
    <div class="input-group">
      <span class="input-group-addon">
        <input type="radio" aria-label="Radio button for following text input">
      </span>
      <input type="text" class="form-control" aria-label="Text input with radio button">
    </div>
  </div>
</div>
{% endexample %}

## Button addons

Buttons in input groups are a bit different and require one extra level of nesting. Instead of `.input-group-addon`, you'll need to use `.input-group-btn` to wrap the buttons. This is required due to default browser styles that cannot be overridden.

{% example html %}
<div class="row">
  <div class="col-lg-6">
    <div class="input-group">
      <span class="input-group-btn">
        <button class="btn btn-secondary" type="button">Go!</button>
      </span>
      <input type="text" class="form-control" placeholder="Search for...">
    </div>
  </div>
  <div class="col-lg-6">
    <div class="input-group">
      <input type="text" class="form-control" placeholder="Search for...">
      <span class="input-group-btn">
        <button class="btn btn-secondary" type="button">Go!</button>
      </span>
    </div>
  </div>
</div>
{% endexample %}

## Buttons with dropdowns

{% example html %}
<div class="row">
  <div class="col-lg-6">
    <div class="input-group">
      <div class="input-group-btn">
        <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Action</button>
        <ul class="dropdown-menu" role="menu">
          <li><a href="#">Action</a></li>
          <li><a href="#">Another action</a></li>
          <li><a href="#">Something else here</a></li>
          <li class="divider"></li>
          <li><a href="#">Separated link</a></li>
        </ul>
      </div>
      <input type="text" class="form-control" aria-label="Text input with dropdown button">
    </div>
  </div>
  <div class="col-lg-6">
    <div class="input-group">
      <input type="text" class="form-control" aria-label="Text input with dropdown button">
      <div class="input-group-btn">
        <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Action</button>
        <ul class="dropdown-menu dropdown-menu-right" role="menu">
          <li><a href="#">Action</a></li>
          <li><a href="#">Another action</a></li>
          <li><a href="#">Something else here</a></li>
          <li class="divider"></li>
          <li><a href="#">Separated link</a></li>
        </ul>
      </div>
    </div>
  </div>
</div>
{% endexample %}

## Segmented buttons

{% example html %}
<div class="row">
  <div class="col-lg-6">
    <div class="input-group">
      <div class="input-group-btn">
        <button type="button" class="btn btn-secondary">Action</button>
        <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
          <span class="sr-only">Toggle Dropdown</span>
        </button>
        <ul class="dropdown-menu" role="menu">
          <li><a href="#">Action</a></li>
          <li><a href="#">Another action</a></li>
          <li><a href="#">Something else here</a></li>
          <li class="divider"></li>
          <li><a href="#">Separated link</a></li>
        </ul>
      </div>
      <input type="text" class="form-control" aria-label="Text input with segmented button dropdown">
    </div>
  </div>
  <div class="col-lg-6">
    <div class="input-group">
      <input type="text" class="form-control" aria-label="Text input with segmented button dropdown">
      <div class="input-group-btn">
        <button type="button" class="btn btn-secondary">Action</button>
        <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
          <span class="sr-only">Toggle Dropdown</span>
        </button>
        <ul class="dropdown-menu dropdown-menu-right" role="menu">
          <li><a href="#">Action</a></li>
          <li><a href="#">Another action</a></li>
          <li><a href="#">Something else here</a></li>
          <li class="divider"></li>
          <li><a href="#">Separated link</a></li>
        </ul>
      </div>
    </div>
  </div>
</div>
{% endexample %}
