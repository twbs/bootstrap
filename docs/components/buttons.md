---
layout: page
title: Buttons
---

Buttons are used to execute actions in forms, dialogs, and more. Use any of the available button classes to quickly create a styled button.

## Examples

Bootstrap includes six predefined button styles, each serving its own semantic purpose.

{% example html %}
<!-- Provides extra visual weight and identifies the primary action in a set of buttons -->
<button type="button" class="btn btn-primary">Primary</button>

<!-- Secondary, outline button -->
<button type="button" class="btn btn-secondary">Secondary</button>

<!-- Indicates a successful or positive action -->
<button type="button" class="btn btn-success">Success</button>

<!-- Indicates caution should be taken with this action -->
<button type="button" class="btn btn-warning">Warning</button>

<!-- Indicates a dangerous or potentially negative action -->
<button type="button" class="btn btn-danger">Danger</button>

<!-- Deemphasize a button by making it look like a link while maintaining button behavior -->
<button type="button" class="btn btn-link">Link</button>
{% endexample %}

{% callout warning %}
#### Conveying meaning to assistive technologies

Using color to add meaning to a button only provides a visual indication, which will not be conveyed to users of assistive technologies – such as screen readers. Ensure that information denoted by the color is either obvious from the content itself (the visible text of the button), or is included through alternative means, such as additional text hidden with the `.sr-only` class.
{% endcallout %}

## Button tags

The `.btn` classes are designed to be used with the `<button>` element. However, you can also use these classes on `<a>` or `<input>` elements (though some browsers may apply a slightly different rendering).

When using button classes on `<a>` elements that are used to trigger in-page functionality (like collapsing content), rather than linking to new pages or sections within the current page, these links should be given a `role="button"` to appropriately convey their purpose to assistive technologies such as screen readers.

{% example html %}
<a class="btn btn-secondary" href="#" role="button">Link</a>
<button class="btn btn-secondary" type="submit">Button</button>
<input class="btn btn-secondary" type="button" value="Input">
<input class="btn btn-secondary" type="submit" value="Submit">
{% endexample %}

## Sizes

Fancy larger or smaller buttons? Add `.btn-lg`, `.btn-sm`, or `.btn-xs` for additional sizes.

{% example html %}
<button type="button" class="btn btn-primary btn-lg">Large button</button>
<button type="button" class="btn btn-secondary btn-lg">Large button</button>
{% endexample %}

{% example html %}
<button type="button" class="btn btn-primary btn-sm">Small button</button>
<button type="button" class="btn btn-secondary btn-sm">Small button</button>
{% endexample %}

{% example html %}
<button type="button" class="btn btn-primary btn-xs">Extra small button</button>
<button type="button" class="btn btn-secondary btn-xs">Extra small button</button>
{% endexample %}

Create block level buttons—those that span the full width of a parent—by adding `.btn-block`.

{% example html %}
<button type="button" class="btn btn-primary btn-lg btn-block">Block level button</button>
<button type="button" class="btn btn-secondary btn-lg btn-block">Block level button</button>
{% endexample %}

## Active state

Buttons will appear pressed (with a darker background, darker border, and inset shadow) when active. **There's no need to add a class to `<button>`s as they use a pseudo-class**. However, you can still force the same active appearance with `.active` (and include the <code>aria-pressed="true"</code> attribute) should you need to replicate the state programmatically.

{% example html %}
<a href="#" class="btn btn-primary btn-lg active" role="button">Primary link</a>
<a href="#" class="btn btn-secondary btn-lg active" role="button">Link</a>
{% endexample %}

## Disabled state

Make buttons look unclickable by adding the `disabled` boolean attribute to any `<button>` element.

{% example html %}
<button type="button" class="btn btn-lg btn-primary" disabled>Primary button</button>
<button type="button" class="btn btn-secondary btn-lg" disabled>Button</button>
{% endexample %}

As `<a>` elements don't support the `disabled` attribute, you must add the `.disabled` class to fake it.

{% example html %}
<a href="#" class="btn btn-primary btn-lg disabled" role="button">Primary link</a>
<a href="#" class="btn btn-secondary btn-lg disabled" role="button">Link</a>
{% endexample %}

{% callout warning %}
#### Cross-browser compatibility

If you add the `disabled` attribute to a `<button>`, Internet Explorer 9 and below will render text gray with a nasty text-shadow that we cannot fix.
{% endcallout %}

{% callout warning %}
#### Link functionality caveat

This class uses `pointer-events: none` to try to disable the link functionality of `<a>`s, but that CSS property is not yet standardized and isn't fully supported in Opera 18 and below, or in Internet Explorer 11\. In addition, even in browsers that do support `pointer-events: none`, keyboard navigation remains unaffected, meaning that sighted keyboard users and users of assistive technologies will still be able to activate these links. So to be safe, use custom JavaScript to disable such links.
{% endcallout %}

{% callout warning %}
#### Context-specific usage

While button classes can be used on `<a>` and `<button>` elements, only `<button>` elements are supported within our nav and navbar components.
{% endcallout %}

## JavaScript behavior

Do more with buttons. Control button states or create groups of buttons for more components like toolbars.

### Custom states

Use JavaScript to change the text and "state" of a particular button. For the sake of this demonstration, we are using `data-loading-text` and `$().button('loading')`, but that's not the only state you can use. [Custom strings of text](#buttons-methods) can also be used with `$().button(string)`.

**Heads up!** You'll likely need to work around Firefox's [persisted form control states across page loads bug](https://github.com/twbs/bootstrap/issues/793) (e.g., disabled and checked states) with `autocomplete="off"`. See [Mozilla bug #654072](https://bugzilla.mozilla.org/show_bug.cgi?id=654072) for details.

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

#### Single toggle

Add `data-toggle="button"` to toggle a button's `active` state. If you're pre-toggling a button, you must manually add the `.active` class **and** `aria-pressed="true"` to the `<button>`.

{% example html %}
<button type="button" class="btn btn-primary" data-toggle="button" aria-pressed="false" autocomplete="off">
  Single toggle
</button>
{% endexample %}

### Checkbox and radio

Bootstrap's `.button` styles can be applied to other elements, such as `<label>`s, to provide checkbox or radio style button toggling. Add `data-toggle="buttons"` to a `.btn-group` containing those modified buttons to enable toggling in their respective styles.

The checked state for these buttons is **only updated via `click` event** on the button. If you use another method to update the input—e.g., with `<input type="reset">` or by manually applying the input's `checked` property—you'll need to toggle `.active` on the `<label>` manually.

Note that pre-checked buttons require you to manually add the `.active` class to the input's `<label>`.

{% example html %}
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
