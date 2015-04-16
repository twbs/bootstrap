---
layout: page
title: Buttons
---


Do more with buttons. Control button states or create groups of buttons for more components like toolbars.

<div class="bd-callout bd-callout-danger">
  <h4>Cross-browser compatibility</h4>
  <p><a href="https://github.com/twbs/bootstrap/issues/793">Firefox persists form control states (disabledness and checkedness) across page loads</a>. A workaround for this is to use <code>autocomplete="off"</code>. See <a href="https://bugzilla.mozilla.org/show_bug.cgi?id=654072">Mozilla bug #654072</a>.</p>
</div>

## Stateful

Add `data-loading-text="Loading..."` to use a loading state on a button.

<div class="bd-callout bd-callout-info">
  <h4>Use whichever state you like!</h4>
  <p>For the sake of this demonstration, we are using <code>data-loading-text</code> and <code>$().button('loading')</code>, but that's not the only state you can use. <a href="#buttons-methods">See more on this below in the <code>$().button(string)</code> documentation</a>.</p>
</div>

{% example html %}
<button type="button" id="myButton" data-loading-text="Loading..." class="btn btn-primary" autocomplete="off">
  Loading state
</button>
<script>
  $('#myButton').on('click', function () {
    var $btn = $(this).button('loading')
    // business logic...
    $btn.button('reset')
  })
</script>
{% endexample %}

### Single toggle

Add `data-toggle="button"` to activate toggling on a single button.

{% example html %}
<button type="button" class="btn btn-primary" data-toggle="button" aria-pressed="false" autocomplete="off">
  Single toggle
</button>
{% endexample %}

<div class="bd-callout bd-callout-warning">
  <h4>Pre-toggled buttons need <code>.active</code> and <code>aria-pressed="true"</code></h4>
  <p>For pre-toggled buttons, you must add the <code>.active</code> class and the <code>aria-pressed="true"</code> attribute to the <code>button</code> yourself.</p>
</div>

## Checkbox and radio

Add `data-toggle="buttons"` to a `.btn-group` containing checkbox or radio inputs to enable toggling in their respective styles.

<div class="bd-callout bd-callout-warning">
  <h4>Preselected options need <code>.active</code></h4>
  <p>For preselected options, you must add the <code>.active</code> class to the input's <code>label</code> yourself.</p>
</div>
<div class="bd-callout bd-callout-warning">
  <h4>Visual checked state only updated on click</h4>
  <p>If the checked state of a checkbox button is updated without firing a <code>click</code> event on the button (e.g. via <code>&lt;input type="reset"&gt;</code> or via setting the <code>checked</code> property of the input), you will need to toggle the <code>.active</code> class on the input's <code>label</code> yourself.</p>
</div>

{% example html %}
<div class="bd-example">
  <div class="btn-group" data-toggle="buttons">
    <label class="btn btn-primary active">
      <input type="checkbox" checked autocomplete="off"> Checkbox 1 (pre-checked)
    </label>
    <label class="btn btn-primary">
      <input type="checkbox" autocomplete="off"> Checkbox 2
    </label>
    <label class="btn btn-primary">
      <input type="checkbox" autocomplete="off"> Checkbox 3
    </label>
  </div>
</div>
{% endexample %}

{% example html %}
<div class="btn-group" data-toggle="buttons">
  <label class="btn btn-primary active">
    <input type="radio" name="options" id="option1" autocomplete="off" checked> Radio 1 (preselected)
  </label>
  <label class="btn btn-primary">
    <input type="radio" name="options" id="option2" autocomplete="off"> Radio 2
  </label>
  <label class="btn btn-primary">
    <input type="radio" name="options" id="option3" autocomplete="off"> Radio 3
  </label>
</div>
{% endexample %}

### Methods

#### $().button('toggle')

Toggles push state. Gives the button the appearance that it has been activated.

#### $().button('reset')

Resets button state—swaps text to original text.

#### $().button(string)

Swaps text to any data defined text state.

{% highlight html %}
<button type="button" id="myStateButton" data-complete-text="finished!" class="btn btn-primary" autocomplete="off">
  ...
</button>
<script>
  $('#myStateButton').on('click', function () {
    $(this).button('complete') // button text will be "finished!"
  })
</script>
{% endhighlight %}
