---
layout: docs
title: Buttons
description: Use Bootstrap's custom button styles for actions in forms, dialogs, and more with support for multiple sizes, states, and more.
group: components
toc: true
---

## Examples

Bootstrap includes several predefined button styles, each serving its own semantic purpose, with a few extras thrown in for more control.

{% capture example %}
{% for color in site.data.theme-colors %}
<button type="button" class="btn btn-{{ color.name }}">{{ color.name | capitalize }}</button>{% endfor %}

<button type="button" class="btn btn-link">Link</button>
{% endcapture %}
{% include example.html content=example %}

{% include callout-warning-color-assistive-technologies.md %}

## Button tags

The `.btn` classes are designed to be used with the `<button>` element. However, you can also use these classes on `<a>` or `<input>` elements (though some browsers may apply a slightly different rendering).

When using button classes on `<a>` elements that are used to trigger in-page functionality (like collapsing content), rather than linking to new pages or sections within the current page, these links should be given a `role="button"` to appropriately convey their purpose to assistive technologies such as screen readers.

{% capture example %}
<a class="btn btn-primary" href="#" role="button">Link</a>
<button class="btn btn-primary" type="submit">Button</button>
<input class="btn btn-primary" type="button" value="Input">
<input class="btn btn-primary" type="submit" value="Submit">
<input class="btn btn-primary" type="reset" value="Reset">
{% endcapture %}
{% include example.html content=example %}

## Outline buttons

In need of a button, but not the hefty background colors they bring? Replace the default modifier classes with the `.btn-outline-*` ones to remove all background images and colors on any button.

{% capture example %}
{% for color in site.data.theme-colors %}
<button type="button" class="btn btn-outline-{{ color.name }}">{{ color.name | capitalize }}</button>{% endfor %}
{% endcapture %}
{% include example.html content=example %}

## Sizes

Fancy larger or smaller buttons? Add `.btn-lg` or `.btn-sm` for additional sizes.

{% capture example %}
<button type="button" class="btn btn-primary btn-lg">Large button</button>
<button type="button" class="btn btn-secondary btn-lg">Large button</button>
{% endcapture %}
{% include example.html content=example %}

{% capture example %}
<button type="button" class="btn btn-primary btn-sm">Small button</button>
<button type="button" class="btn btn-secondary btn-sm">Small button</button>
{% endcapture %}
{% include example.html content=example %}

Create block level buttons—those that span the full width of a parent—by adding `.btn-block`.

{% capture example %}
<button type="button" class="btn btn-primary btn-lg btn-block">Block level button</button>
<button type="button" class="btn btn-secondary btn-lg btn-block">Block level button</button>
{% endcapture %}
{% include example.html content=example %}

## Active state

Buttons will appear pressed (with a darker background, darker border, and inset shadow) when active. **There's no need to add a class to `<button>`s as they use a pseudo-class**. However, you can still force the same active appearance with `.active` (and include the <code>aria-pressed="true"</code> attribute) should you need to replicate the state programmatically.

{% capture example %}
<a href="#" class="btn btn-primary btn-lg active" role="button" aria-pressed="true">Primary link</a>
<a href="#" class="btn btn-secondary btn-lg active" role="button" aria-pressed="true">Link</a>
{% endcapture %}
{% include example.html content=example %}

## Disabled state

Make buttons look inactive by adding the `disabled` boolean attribute to any `<button>` element.

{% capture example %}
<button type="button" class="btn btn-lg btn-primary" disabled>Primary button</button>
<button type="button" class="btn btn-secondary btn-lg" disabled>Button</button>
{% endcapture %}
{% include example.html content=example %}

Disabled buttons using the `<a>` element behave a bit different:

- `<a>`s don't support the `disabled` attribute, so you must add the `.disabled` class to make it visually appear disabled.
- Some future-friendly styles are included to disable all `pointer-events` on anchor buttons. In browsers which support that property, you won't see the disabled cursor at all.
- Disabled buttons should include the `aria-disabled="true"` attribute to indicate the state of the element to assistive technologies.

{% capture example %}
<a href="#" class="btn btn-primary btn-lg disabled" tabindex="-1" role="button" aria-disabled="true">Primary link</a>
<a href="#" class="btn btn-secondary btn-lg disabled" tabindex="-1" role="button" aria-disabled="true">Link</a>
{% endcapture %}
{% include example.html content=example %}

{% capture callout %}
##### Link functionality caveat

The `.disabled` class uses `pointer-events: none` to try to disable the link functionality of `<a>`s, but that CSS property is not yet standardized. In addition, even in browsers that do support `pointer-events: none`, keyboard navigation remains unaffected, meaning that sighted keyboard users and users of assistive technologies will still be able to activate these links. So to be safe, add a `tabindex="-1"` attribute on these links (to prevent them from receiving keyboard focus) and use custom JavaScript to disable their functionality.
{% endcapture %}
{% include callout.html content=callout type="warning" %}

## Button plugin

Do more with buttons. Control button states or create groups of buttons for more components like toolbars.

### Toggle states

Add `data-toggle="button"` to toggle a button's `active` state. If you're pre-toggling a button, you must manually add the `.active` class **and** `aria-pressed="true"` to the `<button>`.

{% capture example %}
<button type="button" class="btn btn-primary" data-toggle="button" aria-pressed="false" autocomplete="off">
  Single toggle
</button>
{% endcapture %}
{% include example.html content=example %}

### Checkbox and radio buttons

Bootstrap's `.button` styles can be applied to other elements, such as `<label>`s, to provide checkbox or radio style button toggling. Add `data-toggle="buttons"` to a `.btn-group` containing those modified buttons to enable their toggling behavior via JavaScript and add `.btn-group-toggle` to style the `<input>`s within your buttons. **Note that you can create single input-powered buttons or groups of them.**

The checked state for these buttons is **only updated via `click` event** on the button. If you use another method to update the input—e.g., with `<input type="reset">` or by manually applying the input's `checked` property—you'll need to toggle `.active` on the `<label>` manually.

Note that pre-checked buttons require you to manually add the `.active` class to the input's `<label>`.

{% capture example %}
<div class="btn-group-toggle" data-toggle="buttons">
  <label class="btn btn-secondary active">
    <input type="checkbox" checked autocomplete="off"> Checked
  </label>
</div>
{% endcapture %}
{% include example.html content=example %}

{% capture example %}
<div class="btn-group btn-group-toggle" data-toggle="buttons">
  <label class="btn btn-secondary active">
    <input type="radio" name="options" id="option1" autocomplete="off" checked> Active
  </label>
  <label class="btn btn-secondary">
    <input type="radio" name="options" id="option2" autocomplete="off"> Radio
  </label>
  <label class="btn btn-secondary">
    <input type="radio" name="options" id="option3" autocomplete="off"> Radio
  </label>
</div>
{% endcapture %}
{% include example.html content=example %}

### Methods

| Method | Description |
| --- | --- |
| `$().button('toggle')` | Toggles push state. Gives the button the appearance that it has been activated. |
| `$().button('dispose')` | Destroys an element's button. |


## Variables

| Variable | Default | Description | 
| --- | --- | --- |
| $btn-padding-y | $input-btn-padding-y (`.375rem`) | Determines the default button padding along the y-axis. |
| $btn-padding-x | $input-btn-padding-x (`.75rem`) | Determines the default button padding along the x-axis. |
| $btn-font-family | $input-btn-font-family (`null`) | Determines the font-family of the button elements. By default it is set to null, so that it will use the current font of its parent element(s). |
| $btn-font-size | $input-btn-font-size | Determines the button's font size. This is set by default to another variable, `$font-size-base`, whose value is `1rem`. Most browsers use a default font-size of 16px. |
| $btn-line-height | $input-btn-line-height (`1.5`) | Determines the default line-height. |
| $btn-padding-y-sm | $input-btn-padding-y-sm (`.25rem`)| Determines the button padding for small screens along the y-axis. |
| $btn-padding-x-sm | $input-btn-padding-x-sm (`.5rem`) | Determines the button padding for small screens along the x-axis. |
| $btn-font-size-sm | $input-btn-font-size-sm | Determines the font-size on smaller screens. By default, this variable gets its value from antoher variable, `$font-size-sm`, which is by default to `$font-size-base * 0.875`, making it's default value `0.875rem` |
| $btn-line-height-sm | $input-btn-line-height-sm | Determines the line-height on smaller screens. This variable is set by default to another variable `$line-height-sm`, whose value is set to `1.5` |
| $btn-padding-y-lg | $input-btn-padding-y-lg (`.5rem`) | Determines the padding along the y-axis for larger screens.|
| $btn-padding-x-lg | $input-btn-padding-x-lg  `1rem`| Determines the padding along the x-axis for larger screens. |
| $btn-font-size-lg | $input-btn-font-size-lg | Determines the font-size for larger screens. This variable is set by default to be the value of `$font-size-base * 1.25`. Since the value of $font-size-base is `1rem`, this gives us a default value for this variable of `1.25rem` |
| $btn-line-height-lg | $input-btn-line-height-lg (`1.5`) | Determines the line-height of the button component. |
| $btn-border-width | $input-btn-border-width | Determines the border-width of the button components. This variable is by default set to the $border-width variable, whose default value is `$1px`|
| $btn-font-weight | $font-weight-normal (`400`) | Determines the font-weight for the buttons. |
| $btn-box-shadow | inset 0 1px 0 rgba($white, .15), 0 1px 1px rgba($black, .075) | Determines the box-shadow for the button elements. Please note that the $white and $black variables are set to `#fff` and `#000` respectively. |
| $btn-focus-width | $input-btn-focus-width | Determines the width of the box-shadow of the button on focus. By default this variable is set to `.2rem` |
| $btn-focus-box-shadow | $input-btn-focus-box-shadow | Determines the box shadow on the focused element. This variable is set by default to `0 0 0 $input-btn-focus-width $input-btn-focus-color`|
| $btn-disabled-opacity | `.65` | Determines the opacity of any disabled buttons. |
| $btn-active-box-shadow | `inset 0 3px 5px rgba($black, .125)` | Determines the button active box shadow. |
| $btn-link-disabled-color | $gray-600 | Determines the font color for disabled `.btn` elements that are also links. $gray-600 is set to `#6c757d` |
| $btn-block-spacing-y | `.5rem` | Determines the spacing between `.btn-block` elements. |
| $btn-border-radius | $border-radius (`.25rem`) | Determines the border-radius of the button element. |
| $btn-border-radius-lg | $border-radius-lg (`.3rem`) | Determines the border-radius for larger screens. |
| $btn-border-radius-sm | $border-radius-sm (`.2rem`) | Determines the border-radius for smaller screens. |
| $btn-transition | `color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out` | Determines the transition between states. |
