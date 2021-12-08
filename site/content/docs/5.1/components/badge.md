---
layout: docs
title: Badges
description: Documentation and examples for badges, our small count and labeling component.
group: components
toc: true
---

## Examples

Badges scale to match the size of the immediate parent element by using relative font sizing and `em` units. As of v5, badges no longer have focus or hover styles for links.

### Headings

{{< example >}}
<h1>Example heading <span class="badge bg-secondary">New</span></h1>
<h2>Example heading <span class="badge bg-secondary">New</span></h2>
<h3>Example heading <span class="badge bg-secondary">New</span></h3>
<h4>Example heading <span class="badge bg-secondary">New</span></h4>
<h5>Example heading <span class="badge bg-secondary">New</span></h5>
<h6>Example heading <span class="badge bg-secondary">New</span></h6>
{{< /example >}}

### Buttons

Badges can be used as part of links or buttons to provide a counter.

{{< example >}}
<button type="button" class="btn btn-primary">
  Notifications <span class="badge bg-secondary">4</span>
</button>
{{< /example >}}

Note that depending on how they are used, badges may be confusing for users of screen readers and similar assistive technologies. While the styling of badges provides a visual cue as to their purpose, these users will simply be presented with the content of the badge. Depending on the specific situation, these badges may seem like random additional words or numbers at the end of a sentence, link, or button.

Unless the context is clear (as with the "Notifications" example, where it is understood that the "4" is the number of notifications), consider including additional context with a visually hidden piece of additional text.

### Positioned

Use utilities to modify a `.badge` and position it in the corner of a link or button.

{{< example >}}
<button type="button" class="btn btn-primary position-relative">
  Inbox
  <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
    99+
    <span class="visually-hidden">unread messages</span>
  </span>
</button>
{{< /example >}}

You can also replace the `.badge` class with a few more utilities without a count for a more generic indicator.

{{< example >}}
<button type="button" class="btn btn-primary position-relative">
  Profile
  <span class="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle">
    <span class="visually-hidden">New alerts</span>
  </span>
</button>
{{< /example >}}

### Dismissing

Using the badge JavaScript plugin, it's possible to dismiss any badge inline. Here's how:

- Be sure you've loaded the badge plugin, or the compiled Bootstrap JavaScript.
- Add a [close button]({{< docsref "/components/close-button" >}}) and the `.badge-dismissible` class, which adds extra padding to the right of the badge and positions the close button.
- On the close button, add the `data-bs-dismiss="badge"` attribute, which triggers the JavaScript functionality. Be sure to use the `<button>` element with it for proper behavior across all devices.

You can see this in action with a live demo:

{{< example >}}
<span class="badge bg-primary badge-dismissable" role="badge">
  Primary
  <button type="button" class="btn-close" data-bs-dismiss="badge" aria-label="Close"></button>
</span>
{{< /example >}}

{{< callout warning >}}
When an badge is dismissed, the element is completely removed from the page structure. If a keyboard user dismisses the badge using the close button, their focus will suddenly be lost and, depending on the browser, reset to the start of the page/document. For this reason, we recommend including additional JavaScript that listens for the `closed.bs.badge` event and programmatically sets `focus()` to the most appropriate location in the page. If you're planning to move focus to a non-interactive element that normally does not receive focus, make sure to add `tabindex="-1"` to the element.
{{< /callout >}}

## Background colors

Use our background utility classes to quickly change the appearance of a badge. Please note that when using Bootstrap's default `.bg-light`, you'll likely need a text color utility like `.text-dark` for proper styling. This is because background utilities do not set anything but `background-color`.

{{< example >}}
{{< badge.inline >}}
{{- range (index $.Site.Data "theme-colors") }}
<span class="badge bg-{{ .name }}{{ with .contrast_color }} text-{{ . }}{{ end }}">{{ .name | title }}</span>{{- end -}}
{{< /badge.inline >}}
{{< /example >}}

{{< callout info >}}
{{< partial "callout-warning-color-assistive-technologies.md" >}}
{{< /callout >}}

## Pill badges

Use the `.rounded-pill` utility class to make badges more rounded with a larger `border-radius`.

{{< example >}}
{{< badge.inline >}}
{{- range (index $.Site.Data "theme-colors") }}
<span class="badge rounded-pill bg-{{ .name }}{{ with .contrast_color }} text-{{ . }}{{ end }}">{{ .name | title }}</span>{{- end -}}
{{< /badge.inline >}}
{{< /example >}}

## Sass

### Variables

{{< scss-docs name="badge-variables" file="scss/_variables.scss" >}}

## JavaScript behavior

### Initialize

Initialize elements as badges

```js
var badgeList = document.querySelectorAll('.badge')
var badges = Array.prototype.slice.call(badgeList).map(function (element) {
  return new bootstrap.Badge(element)
})
```

{{< callout info >}}
For the sole purpose of dismissing a badge, it isn't necessary to initialize the component manually via the JS API. By making use of `data-bs-dismiss="badge"`, the component will be initialized automatically and properly dismissed.

See the [triggers](#triggers) section for more details.
{{< /callout >}}

### Triggers

{{% js-dismiss "badge" %}}

**Note that closing an badge will remove it from the DOM.**

### Methods

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
        Closes an badge by removing it from the DOM. If the <code>.fade</code> and <code>.show</code> classes are present on the element, the badge will fade out before it is removed.
      </td>
    </tr>
    <tr>
      <td>
        <code>dispose</code>
      </td>
      <td>
        Destroys an element's badge. (Removes stored data on the DOM element)
      </td>
    </tr>
    <tr>
      <td>
        <code>getInstance</code>
      </td>
      <td>
        Static method which allows you to get the badge instance associated to a DOM element, you can use it like this: <code>bootstrap.Badge.getInstance(badge)</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>getOrCreateInstance</code>
      </td>
      <td>
        Static method which returns an badge instance associated to a DOM element or create a new one in case it wasn't initialized.
        You can use it like this: <code>bootstrap.Badge.getOrCreateInstance(element)</code>
      </td>
    </tr>
  </tbody>
</table>

```js
var badgeNode = document.querySelector('.badge')
var badge = bootstrap.Badge.getInstance(badgeNode)
badge.close()
```

### Events

Bootstrap's badge plugin exposes a few events for hooking into badge functionality.

<table class="table">
  <thead>
    <tr>
      <th>Event</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>close.bs.badge</code></td>
      <td>
        Fires immediately when the <code>close</code> instance method is called.
      </td>
    </tr>
    <tr>
      <td><code>closed.bs.badge</code></td>
      <td>
        Fired when the badge has been closed and CSS transitions have completed.
      </td>
    </tr>
  </tbody>
</table>

```js
var myBadge = document.getElementById('myBadge')
myBadge.addEventListener('closed.bs.badge', function () {
  // do something, for instance, explicitly move focus to the most appropriate element,
  // so it doesn't get lost/reset to the start of the page
  // document.getElementById('...').focus()
})
```
