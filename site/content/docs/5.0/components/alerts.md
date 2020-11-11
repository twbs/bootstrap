---
layout: docs
title: Alerts
description: Provide contextual feedback messages for typical user actions with the handful of available and flexible alert messages.
group: components
toc: true
---

## Examples

Alerts are available for any length of text, as well as an optional close button. For proper styling, use one of the eight **required** contextual classes (e.g., `.alert-success`). For inline dismissal, use the [alerts JavaScript plugin](#dismissing).

{{< example >}}
{{< alerts.inline >}}
{{- range (index $.Site.Data "theme-colors") }}
<div class="alert alert-{{ .name }}" role="alert">
  A simple {{ .name }} alert—check it out!
</div>{{- end -}}
{{< /alerts.inline >}}
{{< /example >}}

{{< callout info >}}
{{< partial "callout-warning-color-assistive-technologies.md" >}}
{{< /callout >}}

### Link color

Use the `.alert-link` utility class to quickly provide matching colored links within any alert.

{{< example >}}
{{< alerts.inline >}}
{{- range (index $.Site.Data "theme-colors") }}
<div class="alert alert-{{ .name }}" role="alert">
  A simple {{ .name }} alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
</div>{{ end -}}
{{< /alerts.inline >}}
{{< /example >}}

### Additional content

Alerts can also contain additional HTML elements like headings, paragraphs and dividers.

{{< example >}}
<div class="alert alert-success" role="alert">
  <h4 class="alert-heading">Well done!</h4>
  <p>Aww yeah, you successfully read this important alert message. This example text is going to run a bit longer so that you can see how spacing within an alert works with this kind of content.</p>
  <hr>
  <p class="mb-0">Whenever you need to, be sure to use margin utilities to keep things nice and tidy.</p>
</div>
{{< /example >}}

### Dismissing

Using the alert JavaScript plugin, it's possible to dismiss any alert inline. Here's how:

- Be sure you've loaded the alert plugin, or the compiled Bootstrap JavaScript.
- Add a [close button]({{< docsref "/components/close-button" >}}) and the `.alert-dismissible` class, which adds extra padding to the right of the alert and positions the close button.
- On the close button, add the `data-dismiss="alert"` attribute, which triggers the JavaScript functionality. Be sure to use the `<button>` element with it for proper behavior across all devices.
- To animate alerts when dismissing them, be sure to add the `.fade` and `.show` classes.

You can see this in action with a live demo:

{{< example >}}
<div class="alert alert-warning alert-dismissible fade show" role="alert">
  <strong>Holy guacamole!</strong> You should check in on some of those fields below.
  <button type="button" class="btn-close" data-dismiss="alert" aria-label="Close"></button>
</div>
{{< /example >}}

{{< callout warning >}}
When an alert is dismissed, the element is completely removed from the page structure. If a keyboard user dismisses the alert using the close button, their focus will suddenly be lost and, depending on the browser, reset to the start of the page/document. For this reason, we recommend including additional JavaScript that listens for the `closed.bs.alert` event and programmatically sets `focus()` to the most appropriate location in the page. If you're planning to move focus to a non-interactive element that normally does not receive focus, make sure to add `tabindex="-1"` to the element.
{{< /callout >}}

## JavaScript behavior

### Triggers

Enable dismissal of an alert via JavaScript:

```js
var alertList = document.querySelectorAll('.alert')
alertList.forEach(function (alert) {
  new bootstrap.Alert(alert)
})
```

Or with `data` attributes on a button **within the alert**, as demonstrated above:

```html
<button type="button" class="btn-close" data-dismiss="alert" aria-label="Close"></button>
```

Note that closing an alert will remove it from the DOM.

### Methods

You can create an alert instance with the alert constructor, for example:

```js
var myAlert = document.getElementById('myAlert')
var bsAlert = new bootstrap.Alert(myAlert)
```

This makes an alert listen for click events on descendant elements which have the `data-dismiss="alert"` attribute. (Not necessary when using the data-api's auto-initialization.)

<table class="table">
  <thead>
    <tr>
      <th>Method</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>close</code>
      </td>
      <td>
        Closes an alert by removing it from the DOM. If the <code>.fade</code> and <code>.show</code> classes are present on the element, the alert will fade out before it is removed.
      </td>
    </tr>
    <tr>
      <td>
        <code>dispose</code>
      </td>
      <td>
        Destroys an element's alert. (Removes stored data on the DOM element)
      </td>
    </tr>
    <tr>
      <td>
        <code>getInstance</code>
      </td>
      <td>
        Static method which allows you to get the alert instance associated to a DOM element, you can use it like this: <code>bootstrap.Alert.getInstance(alert)</code>
      </td>
    </tr>
  </tbody>
</table>

```js
var alertNode = document.querySelector('.alert')
var alert = bootstrap.Alert.getInstance(alertNode)
alert.close()
```

### Events

Bootstrap's alert plugin exposes a few events for hooking into alert functionality.

<table class="table">
  <thead>
    <tr>
      <th>Event</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>close.bs.alert</code></td>
      <td>
        Fires immediately when the <code>close</code> instance method is called.
      </td>
    </tr>
    <tr>
      <td><code>closed.bs.alert</code></td>
      <td>
        Fired when the alert has been closed and CSS transitions have completed.
      </td>
    </tr>
  </tbody>
</table>

```js
var myAlert = document.getElementById('myAlert')
myAlert.addEventListener('closed.bs.alert', function () {
  // do something, for instance, explicitly move focus to the most appropriate element,
  // so it doesn't get lost/reset to the start of the page
  // document.getElementById('...').focus()
})
```
