---
layout: docs
title: Buttons
description: Use Bootstrap's custom button styles for actions in forms, dialogs, and more with support for multiple sizes, states, and more.
group: components
toc: true
---

## Examples

Bootstrap includes several predefined button styles, each serving its own semantic purpose, with a few extras thrown in for more control.

{{< example >}}
{{< buttons.inline >}}
{{- range (index $.Site.Data "theme-colors") }}
<button type="button" class="btn btn-{{ .name }}">{{ .name | title }}</button>
{{- end -}}
{{< /buttons.inline >}}

<button type="button" class="btn btn-link">Link</button>
{{< /example >}}

{{< callout info >}}
{{< partial "callout-warning-color-assistive-technologies.md" >}}
{{< /callout >}}

## Button tags

The `.btn` classes are designed to be used with the `<button>` element. However, you can also use these classes on `<a>` or `<input>` elements (though some browsers may apply a slightly different rendering).

When using button classes on `<a>` elements that are used to trigger in-page functionality (like collapsing content), rather than linking to new pages or sections within the current page, these links should be given a `role="button"` to appropriately convey their purpose to assistive technologies such as screen readers.

{{< example >}}
<a class="btn btn-primary" href="#" role="button">Link</a>
<button class="btn btn-primary" type="submit">Button</button>
<input class="btn btn-primary" type="button" value="Input">
<input class="btn btn-primary" type="submit" value="Submit">
<input class="btn btn-primary" type="reset" value="Reset">
{{< /example >}}

## Outline buttons

In need of a button, but not the hefty background colors they bring? Replace the default modifier classes with the `.btn-outline-*` ones to remove all background images and colors on any button.

{{< example >}}
{{< buttons.inline >}}
{{- range (index $.Site.Data "theme-colors") }}
<button type="button" class="btn btn-outline-{{ .name }}">{{ .name | title }}</button>
{{- end -}}
{{< /buttons.inline >}}
{{< /example >}}

## Sizes

Fancy larger or smaller buttons? Add `.btn-lg` or `.btn-sm` for additional sizes.

{{< example >}}
<button type="button" class="btn btn-primary btn-lg">Large button</button>
<button type="button" class="btn btn-secondary btn-lg">Large button</button>
{{< /example >}}

{{< example >}}
<button type="button" class="btn btn-primary btn-sm">Small button</button>
<button type="button" class="btn btn-secondary btn-sm">Small button</button>
{{< /example >}}

Create block level buttons—those that span the full width of a parent—by adding `.btn-block`.

{{< example >}}
<button type="button" class="btn btn-primary btn-lg btn-block">Block level button</button>
<button type="button" class="btn btn-secondary btn-lg btn-block">Block level button</button>
{{< /example >}}

## Active state

Buttons will appear pressed (with a darker background, darker border, and inset shadow) when active. **There's no need to add a class to `<button>`s as they use a pseudo-class**. However, you can still force the same active appearance with `.active` (and include the <code>aria-pressed="true"</code> attribute) should you need to replicate the state programmatically.

{{< example >}}
<a href="#" class="btn btn-primary btn-lg active" role="button" aria-pressed="true">Primary link</a>
<a href="#" class="btn btn-secondary btn-lg active" role="button" aria-pressed="true">Link</a>
{{< /example >}}

## Disabled state

Make buttons look inactive by adding the `disabled` boolean attribute to any `<button>` element.

{{< example >}}
<button type="button" class="btn btn-lg btn-primary" disabled>Primary button</button>
<button type="button" class="btn btn-secondary btn-lg" disabled>Button</button>
{{< /example >}}

Disabled buttons using the `<a>` element behave a bit different:

- `<a>`s don't support the `disabled` attribute, so you must add the `.disabled` class to make it visually appear disabled.
- Some future-friendly styles are included to disable all `pointer-events` on anchor buttons. In browsers which support that property, you won't see the disabled cursor at all.
- Disabled buttons should include the `aria-disabled="true"` attribute to indicate the state of the element to assistive technologies.

{{< example >}}
<a href="#" class="btn btn-primary btn-lg disabled" tabindex="-1" role="button" aria-disabled="true">Primary link</a>
<a href="#" class="btn btn-secondary btn-lg disabled" tabindex="-1" role="button" aria-disabled="true">Link</a>
{{< /example >}}

{{< callout warning >}}
##### Link functionality caveat

The `.disabled` class uses `pointer-events: none` to try to disable the link functionality of `<a>`s, but that CSS property is not yet standardized. In addition, even in browsers that do support `pointer-events: none`, keyboard navigation remains unaffected, meaning that sighted keyboard users and users of assistive technologies will still be able to activate these links. So to be safe, add a `tabindex="-1"` attribute on these links (to prevent them from receiving keyboard focus) and use custom JavaScript to disable their functionality.
{{< /callout >}}

## Checkbox and radio buttons

Bootstrap lets you create checkboxes and radio buttons that look like regular buttons. However, as they rely on CSS next sibling selectors, they require a fairly specific markup structure to ensure that the styles are all applied correctly.

Note that pre-checked buttons require you to manually add the `checked` attribute to the `<input>`.

{{< example >}}
<input type="checkbox" class="btn-input" id="btnInputCheckSingle" checked>
<label class="btn btn-primary" for="btnInputCheckSingle">
  Checked button
</label>
{{< /example >}}

{{< example >}}
<input type="radio" class="btn-input" name="btnInputRadio" id="btnInputRadio1" checked>
<label class="btn btn-primary" for="btnInputRadio1">Radio button</label>

<input type="radio" class="btn-input" name="btnInputRadio" id="btnInputRadio2">
<label class="btn btn-primary" for="btnInputRadio2">Radio button</label>

<input type="radio" class="btn-input" name="btnInputRadio" id="btnInputRadio3">
<label class="btn btn-primary" for="btnInputRadio3">Radio button</label>
{{< /example >}}

## Button plugin

The button plugin allows you to create simple on/off toggle buttons.

### Toggle states

Add `data-toggle="button"` to toggle a button's `active` state and `aria-pressed` attribute. If you're pre-toggling a button, you must manually add the `.active` class **and** `aria-pressed="true"` to the `<button>`.

{{< example >}}
<button type="button" class="btn btn-primary" data-toggle="button" aria-pressed="false">
  Single toggle
</button>
{{< /example >}}

### Methods

You can create a button instance with the button constructor, for example:

{{< highlight js >}}
var button = document.getElementById('myButton')
var bsButton = new bootstrap.Button(button)
{{< /highlight >}}

| Method    | Description                                                                     |
| --------- | ------------------------------------------------------------------------------- |
| `toggle`  | Toggles push state. Gives the button the appearance that it has been activated. |
| `dispose` | Destroys an element's button.                                                   |

For example, to toggle all buttons

{{< highlight js >}}
var buttons = document.querySelectorAll('.btn')
buttons.forEach(function (button) {
  var button = new bootstrap.Button(button)
  button.toggle()
})
{{< /highlight >}}
