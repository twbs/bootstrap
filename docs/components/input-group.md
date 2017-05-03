---
layout: docs
title: Input group
description: Extend form controls with the input group.
group: components
---

Easily extend form controls by adding text, buttons, or button groups on either side of textual `<input>`s.

## Contents

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## Basic example

Place one add-on or button on either side of an input. You may also place one on both sides of an input. **We do not support multiple form-controls in a single input group.**

{% example html %}
<div class="input-group">
  <span class="input-group-addon" id="basic-addon1">@</span>
  <input type="text" class="form-control" placeholder="Username" aria-describedby="basic-addon1">
</div>
<br>
<div class="input-group">
  <input type="text" class="form-control" placeholder="Recipient's username" aria-describedby="basic-addon2">
  <span class="input-group-addon" id="basic-addon2">@example.com</span>
</div>
<br>
<label for="basic-url">Your vanity URL</label>
<div class="input-group">
  <span class="input-group-addon" id="basic-addon3">https://example.com/users/</span>
  <input type="text" class="form-control" id="basic-url" aria-describedby="basic-addon3">
</div>
<br>
<div class="input-group">
  <span class="input-group-addon">$</span>
  <input type="text" class="form-control" aria-label="Amount (to the nearest dollar)">
  <span class="input-group-addon">.00</span>
</div>
<br>
<div class="input-group">
  <span class="input-group-addon">$</span>
  <span class="input-group-addon">0.00</span>
  <input type="text" class="form-control" aria-label="Amount (to the nearest dollar)">
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

## Multiple addons

Multiple add-ons are supported and can be mixed with checkbox and radio input versions.

{% example html %}
<div class="row">
  <div class="col-lg-6">
    <div class="input-group">
      <span class="input-group-addon">
        <input type="checkbox" aria-label="Checkbox for following text input">
      </span>
      <span class="input-group-addon">$</span>
      <input type="text" class="form-control" aria-label="Text input with checkbox">
    </div>
  </div>
  <div class="col-lg-6">
    <div class="input-group">
      <span class="input-group-addon">$</span>
      <span class="input-group-addon">0.00</span>
      <input type="text" class="form-control" aria-label="Text input with radio button">
    </div>
  </div>
</div>
{% endexample %}


## Button addons

Buttons in input groups must wrapped in a `.input-group-btn` for proper alignment and sizing. This is required due to default browser styles that cannot be overridden.

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
<br>
<div class="row">
  <div class="col-lg-offset-3 col-lg-6">
    <div class="input-group">
      <span class="input-group-btn">
        <button class="btn btn-secondary" type="button">Hate it</button>
      </span>
      <input type="text" class="form-control" placeholder="Product name">
      <span class="input-group-btn">
        <button class="btn btn-secondary" type="button">Love it</button>
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
        <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Action
        </button>
        <div class="dropdown-menu">
          <a class="dropdown-item" href="#">Action</a>
          <a class="dropdown-item" href="#">Another action</a>
          <a class="dropdown-item" href="#">Something else here</a>
          <div role="separator" class="dropdown-divider"></div>
          <a class="dropdown-item" href="#">Separated link</a>
        </div>
      </div>
      <input type="text" class="form-control" aria-label="Text input with dropdown button">
    </div>
  </div>
  <div class="col-lg-6">
    <div class="input-group">
      <input type="text" class="form-control" aria-label="Text input with dropdown button">
      <div class="input-group-btn">
        <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Action
        </button>
        <div class="dropdown-menu dropdown-menu-right">
          <a class="dropdown-item" href="#">Action</a>
          <a class="dropdown-item" href="#">Another action</a>
          <a class="dropdown-item" href="#">Something else here</a>
          <div role="separator" class="dropdown-divider"></div>
          <a class="dropdown-item" href="#">Separated link</a>
        </div>
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
        <button type="button" class="btn btn-secondary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <span class="sr-only">Toggle Dropdown</span>
        </button>
        <div class="dropdown-menu">
          <a class="dropdown-item" href="#">Action</a>
          <a class="dropdown-item" href="#">Another action</a>
          <a class="dropdown-item" href="#">Something else here</a>
          <div role="separator" class="dropdown-divider"></div>
          <a class="dropdown-item" href="#">Separated link</a>
        </div>
      </div>
      <input type="text" class="form-control" aria-label="Text input with segmented button dropdown">
    </div>
  </div>
  <div class="col-lg-6">
    <div class="input-group">
      <input type="text" class="form-control" aria-label="Text input with segmented button dropdown">
      <div class="input-group-btn">
        <button type="button" class="btn btn-secondary">Action</button>
        <button type="button" class="btn btn-secondary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <span class="sr-only">Toggle Dropdown</span>
        </button>
        <div class="dropdown-menu dropdown-menu-right">
          <a class="dropdown-item" href="#">Action</a>
          <a class="dropdown-item" href="#">Another action</a>
          <a class="dropdown-item" href="#">Something else here</a>
          <div role="separator" class="dropdown-divider"></div>
          <a class="dropdown-item" href="#">Separated link</a>
        </div>
      </div>
    </div>
  </div>
</div>
{% endexample %}

## Accessibility

Screen readers will have trouble with your forms if you don't include a label for every input. For these input groups, ensure that any additional label or functionality is conveyed to assistive technologies.

The exact technique to be used (`<label>` elements hidden using the `.sr-only` class, or use of the `aria-label`, `aria-labelledby`, `aria-describedby`, `title` or `placeholder` attribute) and what additional information will need to be conveyed will vary depending on the exact type of interface widget you're implementing. The examples in this section provide a few suggested, case-specific approaches.

## Multiple Forms

Though BS writes **We do not support multiple form-controls in a single input group.**, we actually want to do that. Use `.input-group-field` to wrap a `.form-control` inside. This manages the fields. If there's a field that should not increase or decrease in size, use the modifier `.input-group-field-auto`.

{% example html %}
<div class="row">
  <div class="col-12 col-md-9 col-lg-10">
    <div class="input-group shadow-soft">
      <div class="input-group-field">
        <div class="dropdown">
          <input name="query" type="search" placeholder="Berufstitel oder Stichwort" autocomplete="off" class="input form-control" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> 
          <div class="dropdown-menu">
            <h6 class="dropdown-header">Stellen</h6>
            <div class="dropdown-item disabled">
              Keine Ergebnisse gefunden
            </div>
            <div class="dropdown-divider"></div>
            <h6 class="dropdown-header">Unternehmen</h6>
            <a href="#" class="dropdown-item">
              <div class="media media-center">
                <img class="media-image" data-src="holder.js/48x48/" alt="Thumbnail">
                <div class="media-body">
                  <div class="dropdown-item-title">Company Name</div>
                </div>
              </div>
            </a>
            <a href="#" class="dropdown-item">
              <div class="media media-center">
                <img class="media-image" data-src="holder.js/48x48/" alt="Thumbnail">
                <div class="media-body">
                  <div class="dropdown-item-title">Company Name</div>
                </div>
              </div>
            </a>
            <a href="#" class="dropdown-item">
              <div class="media media-center">
                <img class="media-image" data-src="holder.js/48x48/" alt="Thumbnail">
                <div class="media-body">
                  <div class="dropdown-item-title">Very long company name, just to see if this works without breaking the layout</div>
                </div>
              </div>
            </a>
            <a href="#" class="dropdown-item">
              <div class="media media-center">
                <img class="media-image" data-src="holder.js/48x48/" alt="Thumbnail">
                <div class="media-body">
                  <div class="dropdown-item-title">Company Name</div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div> 
      <div class="input-group-field">
        <div class="dropdown">
          <input name="location" type="search" placeholder="Ort und PLZ" autocomplete="off" class="input form-control">
        </div>
      </div> 
      <div class="input-group-field input-group-field-auto">
        <select class="form-control">
          <option value="all">Umkreis</option>
        </select>
      </div>
    </div>
  </div> 
  <div class="col-12 col-md-3 col-lg-2">
    <button type="submit" class="input-submit btn btn-cta btn-primary btn-block shadow-soft">
      <span class="icon-search"></span> Suchen
    </button>
  </div>
</div>
{% endexample %}