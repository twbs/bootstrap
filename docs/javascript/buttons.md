---
layout: page
title: Buttons
---

Do more with buttons. Control button states or create groups of buttons for more components like toolbars.

## Uses

#### Stateful

Add `data-loading-text="Loading..."` to use a loading state on a button.

{% example html %}
<button type="button" id="loading-example-btn" data-loading-text="Loading..." class="btn btn-primary">
  Loading state
</button>
<script>
  $('#loading-example-btn').click(function () {
    var btn = $(this)
    btn.button('loading')
    $.ajax(...).always(function () {
      btn.button('reset')
    });
  });
</script>
{% endexample %}

#### Single toggle

Add `data-toggle="button"` to activate toggling on a single button.

{% example html %}
<button type="button" class="btn btn-primary" data-toggle="button">
  Single toggle
</button>
{% endexample %}

#### Checkbox

Add `data-toggle="buttons"` to a group of checkboxes for checkbox style toggling on btn-group.

<div class="bs-callout bs-callout-warning">
  <h4>Pre-checked options need <code>.active</code></h4>
  <p>For pre-checked options, you must add the <code>.active</code> class to the input's <code>label</code> yourself.</p>
</div>

{% example html %}
<div class="btn-group" data-toggle="buttons">
  <label class="btn btn-primary active">
    <input type="checkbox" checked> Option 1 (pre-checked)
  </label>
  <label class="btn btn-primary">
    <input type="checkbox"> Option 2
  </label>
  <label class="btn btn-primary">
    <input type="checkbox"> Option 3
  </label>
</div>
{% endexample %}

#### Radio

Add `data-toggle="buttons"` to a group of radio inputs for radio style toggling on btn-group.

<div class="bs-callout bs-callout-warning">
  <h4>Preselected options need <code>.active</code></h4>
  <p>For preselected options, you must add the <code>.active</code> class to the input's <code>label</code> yourself.</p>
</div>

{% highlight html %}
<div class="btn-group" data-toggle="buttons">
  <label class="btn btn-primary active">
    <input type="radio" name="options" id="option1" checked> Option 1 (preselected)
  </label>
  <label class="btn btn-primary">
    <input type="radio" name="options" id="option2"> Option 2
  </label>
  <label class="btn btn-primary">
    <input type="radio" name="options" id="option3"> Option 3
  </label>
</div>
{% endhighlight %}


## Usage

Enable buttons via JavaScript:

{% highlight js %}
$('.btn').button()
{% endhighlight %}

### Markup

Data attributes are integral to the button plugin. Check out the example code below for the various markup types.

### Options

*None.*

### Methods

#### $().button('toggle')

Toggles push state. Gives the button the appearance that it has been activated.

<div class="bs-callout bs-callout-info">
  <h4>Auto toggling</h4>
  <p>You can enable auto toggling of a button by using the <code>data-toggle</code> attribute.</p>
</div>

{% highlight html %}
<button type="button" class="btn btn-primary" data-toggle="button">...</button>
{% endhighlight %}

#### $().button('loading')</h4>

Sets button state to loading - disables button and swaps text to loading text. Loading text should be defined on the button element using the data attribute `data-loading-text`.

{% highlight html %}
<button id="loading-example-btn" type="button" class="btn btn-primary" data-loading-text="loading stuff...">...</button>
<script>
  $('#loading-example-btn').click(function () {
    var btn = $(this)
    btn.button('loading')
    $.ajax(...).always(function () {
      btn.button('reset')
    });
  });
</script>
{% endhighlight %}

<div class="bs-callout bs-callout-danger">
  <h4>Cross-browser compatibility</h4>
  <p><a href="https://github.com/twbs/bootstrap/issues/793">Firefox persists form control states across page loads</a>. A workaround for this is to use <code>autocomplete="off"</code>.</p>
</div>

#### $().button('reset')

Resets button state - swaps text to original text.

#### $().button(string)

Resets button state - swaps text to any data defined text state.

{% highlight html %}
<button type="button" class="btn btn-primary" data-complete-text="finished!" >...</button>
<script>
  $('.btn').button('complete')
</script>
{% endhighlight %}
