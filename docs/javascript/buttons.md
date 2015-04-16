---
layout: page
title: Buttons
---


Do more with buttons. Control button states or create groups of buttons for more components like toolbars.

{% callout danger %}
#### Cross-browser compatibility

[Firefox persists form control states (disabledness and checkedness) across page loads](https://github.com/twbs/bootstrap/issues/793). A workaround for this is to use `autocomplete="off"`. See [Mozilla bug #654072](https://bugzilla.mozilla.org/show_bug.cgi?id=654072).
{% endcallout %}


## Stateful

Add `data-loading-text="Loading..."` to use a loading state on a button.

{% callout info %}
#### Use whichever state you like!

For the sake of this demonstration, we are using `data-loading-text` and `$().button('loading')`, but that's not the only state you can use. [See more on this below in the `$().button(string)` documentation](#buttons-methods).
{% endcallout %}

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

{% callout warning %}
#### Pre-toggled buttons need `.active` and `aria-pressed="true"`

For pre-toggled buttons, you must add the `.active` class and the `aria-pressed="true"` attribute to the `button` yourself.
{% endcallout %}

## Checkbox and radio

Add `data-toggle="buttons"` to a `.btn-group` containing checkbox or radio inputs to enable toggling in their respective styles.

{% callout warning %}
#### Preselected options need `.active`

For preselected options, you must add the `.active` class to the input's `label` yourself.
{% endcallout %}

{% callout warning %}
#### Visual checked state only updated on click

If the checked state of a checkbox button is updated without firing a `click` event on the button (e.g. via `<input type="reset">` or via setting the `checked` property of the input), you will need to toggle the `.active` class on the input's `label` yourself.
{% endcallout %}

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
