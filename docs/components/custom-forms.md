---
layout: page
title: Custom forms
---

In the interest of customization and cross browser consistency, Bootstrap include a handful of customized form elements. They're built on top of semantic and accessible markup, so they're solid replacements for default form controls.

## Checkboxes and radios

Each checkbox and radio is wrapped in a `<label>` for three reasons:

- It provides a larger hit areas for checking the control.
- It provides a helpful and semantic wrapper to help us replace the default `<input>`s.
- It triggers the state of the `<input>` automatically, meaning no JavaScript is required.

We hide the default `<input>` with `opacity` and use the `.c-indicator` to build a new custom form control. We can't build a custom one from just the `<input>` because CSS's `content` doesn't work on that element.

With the sibling selector (`~`), we use the `:checked` state to trigger a makeshift checked state on the custom control.

In the checked states, we use **base64 embedded SVG icons** from [Open Iconic](http://useiconic.com/open). This provides us the best control for styling and positioning across browsers and devices.

### Checkboxes

{% example html %}
<label class="c-input c-checkbox">
  <input type="checkbox">
  <span class="c-indicator"></span>
  Check this custom checkbox
</label>
{% endexample %}

Custom checkboxes can also utilize the `:indeterminate` pseudo class.

<div class="bd-example bd-example-indeterminate">
  <label class="c-input c-checkbox">
    <input type="checkbox">
    <span class="c-indicator"></span>
    Check this custom checkbox
  </label>
</div>

**Heads up!** You'll need to set this state manually via JavaScript as there is no available HTML attribute for specifying it. If you're using jQuery, something like this should suffice:

{% highlight js %}
$('.your-checkbox').prop('indeterminate', true)
{% endhighlight %}

### Radios

{% example html %}
<label class="c-input c-radio">
  <input id="radio1" name="radio" type="radio">
  <span class="c-indicator"></span>
  Toggle this custom radio
</label>
<label class="c-input c-radio">
  <input id="radio2" name="radio" type="radio">
  <span class="c-indicator"></span>
  Or toggle this other custom radio
</label>
{% endexample %}

### Stacked

Custom checkboxes and radios are inline to start. Add a parent with class `.c-inputs-stacked` to ensure each form control is on separate lines.

{% example html %}
<div class="c-inputs-stacked">
  <label class="c-input c-radio">
    <input id="radioStacked1" name="radio-stacked" type="radio">
    <span class="c-indicator"></span>
    Toggle this custom radio
  </label>
  <label class="c-input c-radio">
    <input id="radioStacked2" name="radio-stacked" type="radio">
    <span class="c-indicator"></span>
    Or toggle this other custom radio
  </label>
</div>
{% endexample %}

## Select menu

Similar to the checkboxes and radios, we wrap the `<select>` in a `<label>` as a semantic wrapper that we can generate custom styles on with CSS's generated content.

{% example html %}
<label class="select">
  <select>
    <option selected>Open this select menu</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
  </select>
</label>
{% endexample %}

The `<select>` has quite a few styles to override and includes a few hacks to get things done. Here's what's happening:

- The `appearance` is reset to `none` for nearly all styles to correctly apply across modern browsers (meaning not IE9).
- The `:-moz-focusring` is overridden so that on focus there's no inner border in Firefox.
- The arrow is hidden in Firefox with a media query hack. (There's a [longstanding open bug](https://bugzilla.mozilla.org/show_bug.cgi?id=649849) for a native method of addressing this.)
- The arrow is hidden in IE10+ with a simple selector.
- The arrow is hidden in IE9 with a separate media query hack which generates another pseudo-element to literally mask it. Not ideal, but doable.

**Heads up!** This one comes with some quirks right now:

- `select[multiple]` is currently currently **not supported**.
- Clickability is limited in IE9.
- Firefox's dropdown of `option`s looks rather ugly.
- The custom caret is unable to receive the selected state's `color`.

Any ideas on improving these are most welcome.

## File browser

{% example html %}
<label class="file">
  <input type="file" id="file">
  <span class="file-custom"></span>
</label>
{% endexample %}

The file input is the most gnarly of the bunch. Here's how it works:

- We wrap the `<input>` in a `<label>` so the custom control properly triggers the file browser.
- We hide the default file `<input>` via `opacity`.
- We use `:after` to generate a custom background and directive (*Choose file...*).
- We use `:before` to generate and position the *Browse* button.
- We declare a `height` on the `<input>` for proper spacing for surrounding content.

In other words, it's an entirely custom element, all generated via CSS.

**Heads up!** The custom file input is currently unable to update the *Choose file...* text with the filename. Without JavaScript, this might not be possible to change, but I'm open to ideas.
