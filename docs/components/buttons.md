---
layout: page
title: Buttons
---

Use any of the available button classes to quickly create a styled button.

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

Buttons will appear pressed (with a darker background, darker border, and inset shadow) when active. **There's no need to add a class to `<button>`s as they use a pseudo-class**. However, you can still force the same active appearance with `.active` should you need to replicate the state programmatically.

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

<div class="bs-callout bs-callout-warning">
  <h4>Cross-browser compatibility</h4>
  <p>If you add the <code>disabled</code> attribute to a <code>&lt;button&gt;</code>, Internet Explorer 9 and below will render text gray with a nasty text-shadow that we cannot fix.</p>
</div>

<div class="bs-callout bs-callout-warning">
  <h4>Link functionality caveat</h4>
  <p>This class uses <code>pointer-events: none</code> to try to disable the link functionality of <code>&lt;a&gt;</code>s, but that CSS property is not yet standardized and isn't fully supported in Opera 18 and below, or in Internet Explorer 11. So to be safe, use custom JavaScript to disable such links.</p>
</div>

<div class="bs-callout bs-callout-warning">
  <h4>Context-specific usage</h4>
  <p>While button classes can be used on <code>&lt;a&gt;</code> and <code>&lt;button&gt;</code> elements, only <code>&lt;button&gt;</code> elements are supported within our nav and navbar components.</p>
</div>

## Button tags

Use the button classes on an `<a>`, `<button>`, or `<input>` element.

{% example html %}
<a class="btn btn-secondary" href="#" role="button">Link</a>
<button class="btn btn-secondary" type="submit">Button</button>
<input class="btn btn-secondary" type="button" value="Input">
<input class="btn btn-secondary" type="submit" value="Submit">
{% endexample %}

<div class="bs-callout bs-callout-warning">
  <h4>Cross-browser rendering</h4>
  <p>As a best practice, <strong>we highly recommend using the <code>&lt;button&gt;</code> element whenever possible</strong> to ensure matching cross-browser rendering.</p>
  <p>Among other things, there's <a href="https://bugzilla.mozilla.org/show_bug.cgi?id=697451">a bug in Firefox &lt;30</a> that prevents us from setting the <code>line-height</code> of <code>&lt;input&gt;</code>-based buttons, causing them to not exactly match the height of other buttons on Firefox.</p>
</div>
