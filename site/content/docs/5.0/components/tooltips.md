---
layout: docs
title: Tooltips
description: Documentation and examples for adding custom Bootstrap tooltips with CSS and JavaScript using CSS3 for animations and data-bs-attributes for local title storage.
group: components
toc: true
---

## Overview

Things to know when using the tooltip plugin:

- Tooltips rely on the 3rd party library [Popper](https://popper.js.org/) for positioning. You must include [popper.min.js]({{< param "cdn.popper" >}}) before bootstrap.js or use `bootstrap.bundle.min.js` / `bootstrap.bundle.js` which contains Popper in order for tooltips to work!
- Tooltips are opt-in for performance reasons, so **you must initialize them yourself**.
- Tooltips with zero-length titles are never displayed.
- Specify `container: 'body'` to avoid rendering problems in more complex components (like our input groups, button groups, etc).
- Triggering tooltips on hidden elements will not work.
- Tooltips for `.disabled` or `disabled` elements must be triggered on a wrapper element.
- When triggered from hyperlinks that span multiple lines, tooltips will be centered. Use `white-space: nowrap;` on your `<a>`s to avoid this behavior.
- Tooltips must be hidden before their corresponding elements have been removed from the DOM.
- Tooltips can be triggered thanks to an element inside a shadow DOM.

{{< callout info >}}
{{< partial "callout-info-sanitizer.md" >}}
{{< /callout >}}

{{< callout info >}}
{{< partial "callout-info-prefersreducedmotion.md" >}}
{{< /callout >}}

Got all that? Great, let's see how they work with some examples.

## Example: Enable tooltips everywhere

One way to initialize all tooltips on a page would be to select them by their `data-bs-toggle` attribute:

```js
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})
```

## Examples

Hover over the links below to see tooltips:

<div class="bd-example tooltip-demo">
  <p class="muted">Placeholder text to demonstrate some <a href="#" data-bs-toggle="tooltip" title="Default tooltip">inline links</a> with tooltips. This is now just filler, no killer. Content placed here just to mimic the presence of <a href="#" data-bs-toggle="tooltip" title="Another tooltip">real text</a>. And all that just to give you an idea of how tooltips would look when used in real-world situations. So hopefully you've now seen how <a href="#" data-bs-toggle="tooltip" title="Another one here too">these tooltips on links</a> can work in practice, once you use them on <a href="#" data-bs-toggle="tooltip" title="The last tip!">your own</a> site or project.
  </p>
</div>

Hover over the buttons below to see the four tooltips directions: top, right, bottom, and left. Directions are mirrored when using Bootstrap in RTL.

<div class="bd-example tooltip-demo">
  <div class="bd-example-tooltips">
    <button type="button" class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="top" title="Tooltip on top">Tooltip on top</button>
    <button type="button" class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="right" title="Tooltip on right">Tooltip on right</button>
    <button type="button" class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Tooltip on bottom">Tooltip on bottom</button>
    <button type="button" class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="left" title="Tooltip on left">Tooltip on left</button>
    <button type="button" class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-html="true" title="<em>Tooltip</em> <u>with</u> <b>HTML</b>">Tooltip with HTML</button>
  </div>
</div>

```html
<button type="button" class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="top" title="Tooltip on top">
  Tooltip on top
</button>
<button type="button" class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="right" title="Tooltip on right">
  Tooltip on right
</button>
<button type="button" class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Tooltip on bottom">
  Tooltip on bottom
</button>
<button type="button" class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="left" title="Tooltip on left">
  Tooltip on left
</button>
```

And with custom HTML added:

```html
<button type="button" class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-html="true" title="<em>Tooltip</em> <u>with</u> <b>HTML</b>">
  Tooltip with HTML
</button>
```

With an SVG:

<div class="bd-example tooltip-demo">
  <a href="#" data-bs-toggle="tooltip" title="Default tooltip">
    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 100 100">
      <rect width="100%" height="100%" fill="#563d7c"/>
      <circle cx="50" cy="50" r="30" fill="#007bff"/>
    </svg>
  </a>
</div>

## Sass

### Variables

{{< scss-docs name="tooltip-variables" file="scss/_variables.scss" >}}

## Usage

The tooltip plugin generates content and markup on demand, and by default places tooltips after their trigger element.

Trigger the tooltip via JavaScript:

```js
var exampleEl = document.getElementById('example')
var tooltip = new bootstrap.Tooltip(exampleEl, options)
```

{{< callout warning >}}
##### Overflow `auto` and `scroll`

Tooltip position attempts to automatically change when a **parent container** has `overflow: auto` or `overflow: scroll` like our `.table-responsive`, but still keeps the original placement's positioning. To resolve this, set the [`boundary` option](https://popper.js.org/docs/v2/modifiers/flip/#boundary) (for the flip modifier using the `popperConfig` option) to any HTMLElement to override the default value, `'clippingParents'`, such as `document.body`:

```js
var exampleEl = document.getElementById('example')
var tooltip = new bootstrap.Tooltip(exampleEl, {
  boundary: document.body // or document.querySelector('#boundary')
})
```
{{< /callout >}}

### Markup

The required markup for a tooltip is only a `data` attribute and `title` on the HTML element you wish to have a tooltip. The generated markup of a tooltip is rather simple, though it does require a position (by default, set to `top` by the plugin).

{{< callout warning >}}
##### Making tooltips work for keyboard and assistive technology users

You should only add tooltips to HTML elements that are traditionally keyboard-focusable and interactive (such as links or form controls). Although arbitrary HTML elements (such as `<span>`s) can be made focusable by adding the `tabindex="0"` attribute, this will add potentially annoying and confusing tab stops on non-interactive elements for keyboard users, and most assistive technologies currently do not announce the tooltip in this situation. Additionally, do not rely solely on `hover` as the trigger for your tooltip, as this will make your tooltips impossible to trigger for keyboard users.
{{< /callout >}}

```html
<!-- HTML to write -->
<a href="#" data-bs-toggle="tooltip" title="Some tooltip text!">Hover over me</a>

<!-- Generated markup by the plugin -->
<div class="tooltip bs-tooltip-top" role="tooltip">
  <div class="tooltip-arrow"></div>
  <div class="tooltip-inner">
    Some tooltip text!
  </div>
</div>
```

### Disabled elements

Elements with the `disabled` attribute aren't interactive, meaning users cannot focus, hover, or click them to trigger a tooltip (or popover). As a workaround, you'll want to trigger the tooltip from a wrapper `<div>` or `<span>`, ideally made keyboard-focusable using `tabindex="0"`.

<div class="tooltip-demo">
{{< example >}}
<span class="d-inline-block" tabindex="0" data-bs-toggle="tooltip" title="Disabled tooltip">
  <button class="btn btn-primary" type="button" disabled>Disabled button</button>
</span>
{{< /example >}}
</div>

### Options

Options can be passed via data attributes or JavaScript. For data attributes, append the option name to `data-bs-`, as in `data-bs-animation=""`. Make sure to change the case type of the option name from camelCase to kebab-case when passing the options via data attributes. For example, instead of using `data-bs-customClass="beautifier"`, use `data-bs-custom-class="beautifier"`.

{{< callout warning >}}
Note that for security reasons the `sanitize`, `sanitizeFn`, and `allowList` options cannot be supplied using data attributes.
{{< /callout >}}

<table class="table">
  <thead>
    <tr>
      <th style="width: 100px;">Name</th>
      <th style="width: 100px;">Type</th>
      <th style="width: 50px;">Default</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>animation</code></td>
      <td>boolean</td>
      <td><code>true</code></td>
      <td>Apply a CSS fade transition to the tooltip</td>
    </tr>
    <tr>
      <td><code>container</code></td>
      <td>string | element | false</td>
      <td><code>false</code></td>
      <td>
        <p>Appends the tooltip to a specific element. Example: <code>container: 'body'</code>. This option is particularly useful in that it allows you to position the tooltip in the flow of the document near the triggering element - which will prevent the tooltip from floating away from the triggering element during a window resize.</p>
      </td>
    </tr>
    <tr>
      <td><code>delay</code></td>
      <td>number | object</td>
      <td><code>0</code></td>
      <td>
        <p>Delay showing and hiding the tooltip (ms) - does not apply to manual trigger type</p>
        <p>If a number is supplied, delay is applied to both hide/show</p>
        <p>Object structure is: <code>delay: { "show": 500, "hide": 100 }</code></p>
      </td>
    </tr>
    <tr>
      <td><code>html</code></td>
      <td>boolean</td>
      <td><code>false</code></td>
      <td>
        <p>Allow HTML in the tooltip.</p>
        <p>If true, HTML tags in the tooltip's <code>title</code> will be rendered in the tooltip. If false, <code>innerText</code> property will be used to insert content into the DOM.</p>
        <p>Use text if you're worried about XSS attacks.</p>
      </td>
    </tr>
    <tr>
      <td><code>placement</code></td>
      <td>string | function</td>
      <td><code>'top'</code></td>
      <td>
        <p>How to position the tooltip - auto | top | bottom | left | right.<br>When <code>auto</code> is specified, it will dynamically reorient the tooltip.</p>
        <p>When a function is used to determine the placement, it is called with the tooltip DOM node as its first argument and the triggering element DOM node as its second. The <code>this</code> context is set to the tooltip instance.</p>
      </td>
    </tr>
    <tr>
      <td><code>selector</code></td>
      <td>string | false</td>
      <td><code>false</code></td>
      <td>If a selector is provided, tooltip objects will be delegated to the specified targets. In practice, this is used to also apply tooltips to dynamically added DOM elements (<code>jQuery.on</code> support). See <a href="{{< param repo >}}/issues/4215">this</a> and <a href="https://codepen.io/team/bootstrap/pen/zYBXGwX?editors=1010">an informative example</a>.</td>
    </tr>
    <tr>
      <td><code>template</code></td>
      <td>string</td>
      <td><code>'&lt;div class="tooltip" role="tooltip"&gt;&lt;div class="tooltip-arrow"&gt;&lt;/div&gt;&lt;div class="tooltip-inner"&gt;&lt;/div&gt;&lt;/div&gt;'</code></td>
      <td>
        <p>Base HTML to use when creating the tooltip.</p>
        <p>The tooltip's <code>title</code> will be injected into the <code>.tooltip-inner</code>.</p>
        <p><code>.tooltip-arrow</code> will become the tooltip's arrow.</p>
        <p>The outermost wrapper element should have the <code>.tooltip</code> class and <code>role="tooltip"</code>.</p>
      </td>
    </tr>
    <tr>
      <td><code>title</code></td>
      <td>string | element | function</td>
      <td><code>''</code></td>
      <td>
        <p>Default title value if <code>title</code> attribute isn't present.</p>
        <p>If a function is given, it will be called with its <code>this</code> reference set to the element that the tooltip is attached to.</p>
      </td>
    </tr>
    <tr>
      <td><code>trigger</code></td>
      <td>string</td>
      <td><code>'hover focus'</code></td>
      <td>
        <p>How tooltip is triggered - click | hover | focus | manual. You may pass multiple triggers; separate them with a space.</p>
        <p><code>'manual'</code> indicates that the tooltip will be triggered programmatically via the <code>.tooltip('show')</code>, <code>.tooltip('hide')</code> and <code>.tooltip('toggle')</code> methods; this value cannot be combined with any other trigger.</p>
        <p><code>'hover'</code> on its own will result in tooltips that cannot be triggered via the keyboard, and should only be used if alternative methods for conveying the same information for keyboard users is present.</p>
      </td>
    </tr>
    <tr>
      <td><code>fallbackPlacements</code></td>
      <td>array</td>
      <td><code>['top', 'right', 'bottom', 'left']</code></td>
      <td>Define fallback placements by providing a list of placements in array (in order of preference). For more information refer to
      Popper's <a href="https://popper.js.org/docs/v2/modifiers/flip/#fallbackplacements">behavior docs</a></td>
    </tr>
    <tr>
      <td><code>boundary</code></td>
      <td>string | element</td>
      <td><code>'clippingParents'</code></td>
      <td>Overflow constraint boundary of the tooltip (applies only to Popper's preventOverflow modifier). By default it's <code>'clippingParents'</code> and can accept an HTMLElement reference (via JavaScript only). For more information refer to Popper's <a href="https://popper.js.org/docs/v2/utils/detect-overflow/#boundary">detectOverflow docs</a>.</td>
    </tr>
    <tr>
      <td><code>customClass</code></td>
      <td>string | function</td>
      <td><code>''</code></td>
      <td>
        <p>Add classes to the tooltip when it is shown. Note that these classes will be added in addition to any classes specified in the template. To add multiple classes, separate them with spaces: <code>'class-1 class-2'</code>.</p>
        <p>You can also pass a function that should return a single string containing additional class names.</p>
      </td>
    </tr>
    <tr>
      <td><code>sanitize</code></td>
      <td>boolean</td>
      <td><code>true</code></td>
      <td>Enable or disable the sanitization. If activated <code>'template'</code> and <code>'title'</code> options will be sanitized. See the <a href="{{< docsref "/getting-started/javascript#sanitizer" >}}">sanitizer section in our JavaScript documentation</a>.</td>
    </tr>
    <tr>
      <td><code>allowList</code></td>
      <td>object</td>
      <td><a href="{{< docsref "/getting-started/javascript#sanitizer" >}}">Default value</a></td>
      <td>Object which contains allowed attributes and tags</td>
    </tr>
    <tr>
      <td><code>sanitizeFn</code></td>
      <td>null | function</td>
      <td><code>null</code></td>
      <td>Here you can supply your own sanitize function. This can be useful if you prefer to use a dedicated library to perform sanitization.</td>
    </tr>
    <tr>
      <td><code>offset</code></td>
      <td>array | string | function</td>
      <td><code>[0, 0]</code></td>
      <td>
        <p>Offset of the tooltip relative to its target. You can pass a string in data attributes with comma separated values like: <code>data-bs-offset="10,20"</code></p>
        <p>When a function is used to determine the offset, it is called with an object containing the popper placement, the reference, and popper rects as its first argument. The triggering element DOM node is passed as the second argument. The function must return an array with two numbers: <code>[<a href="https://popper.js.org/docs/v2/modifiers/offset/#skidding-1">skidding</a>, <a href="https://popper.js.org/docs/v2/modifiers/offset/#distance-1">distance</a>]</code>.</p>
        <p>For more information refer to Popper's <a href="https://popper.js.org/docs/v2/modifiers/offset/#options">offset docs</a>.</p>
      </td>
    </tr>
    <tr>
      <td><code>popperConfig</code></td>
      <td>null | object | function</td>
      <td><code>null</code></td>
      <td>
        <p>To change Bootstrap's default Popper config, see <a href="https://popper.js.org/docs/v2/constructors/#options">Popper's configuration</a>.</p>
        <p>When a function is used to create the Popper configuration, it's called with an object that contains the Bootstrap's default Popper configuration. It helps you use and merge the default with your own configuration. The function must return a configuration object for Popper.</p>
      </td>
    </tr>
  </tbody>
</table>

{{< callout info >}}
#### Data attributes for individual tooltips

Options for individual tooltips can alternatively be specified through the use of data attributes, as explained above.
{{< /callout >}}

#### Using function with `popperConfig`

```js
var tooltip = new bootstrap.Tooltip(element, {
  popperConfig: function (defaultBsPopperConfig) {
    // var newPopperConfig = {...}
    // use defaultBsPopperConfig if needed...
    // return newPopperConfig
  }
})
```

### Methods

{{< callout danger >}}
{{< partial "callout-danger-async-methods.md" >}}
{{< /callout >}}

#### show

Reveals an element's tooltip. **Returns to the caller before the tooltip has actually been shown** (i.e. before the `shown.bs.tooltip` event occurs). This is considered a "manual" triggering of the tooltip. Tooltips with zero-length titles are never displayed.

```js
tooltip.show()
```

#### hide

Hides an element's tooltip. **Returns to the caller before the tooltip has actually been hidden** (i.e. before the `hidden.bs.tooltip` event occurs). This is considered a "manual" triggering of the tooltip.

```js
tooltip.hide()
```

#### toggle

Toggles an element's tooltip. **Returns to the caller before the tooltip has actually been shown or hidden** (i.e. before the `shown.bs.tooltip` or `hidden.bs.tooltip` event occurs). This is considered a "manual" triggering of the tooltip.

```js
tooltip.toggle()
```

#### dispose

Hides and destroys an element's tooltip (Removes stored data on the DOM element). Tooltips that use delegation (which are created using [the `selector` option](#options)) cannot be individually destroyed on descendant trigger elements.

```js
tooltip.dispose()
```

#### enable

Gives an element's tooltip the ability to be shown. **Tooltips are enabled by default.**

```js
tooltip.enable()
```

#### disable

Removes the ability for an element's tooltip to be shown. The tooltip will only be able to be shown if it is re-enabled.

```js
tooltip.disable()
```

#### toggleEnabled

Toggles the ability for an element's tooltip to be shown or hidden.

```js
tooltip.toggleEnabled()
```

#### update

Updates the position of an element's tooltip.

```js
tooltip.update()
```

#### getInstance

*Static* method which allows you to get the tooltip instance associated with a DOM element

```js
var exampleTriggerEl = document.getElementById('example')
var tooltip = bootstrap.Tooltip.getInstance(exampleTriggerEl) // Returns a Bootstrap tooltip instance
```

### Events

<table class="table">
  <thead>
    <tr>
      <th style="width: 150px;">Event type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>show.bs.tooltip</code></td>
      <td>This event fires immediately when the <code>show</code> instance method is called.</td>
    </tr>
    <tr>
      <td><code>shown.bs.tooltip</code></td>
      <td>This event is fired when the tooltip has been made visible to the user (will wait for CSS transitions to complete).</td>
    </tr>
    <tr>
      <td><code>hide.bs.tooltip</code></td>
      <td>This event is fired immediately when the <code>hide</code> instance method has been called.</td>
    </tr>
    <tr>
      <td><code>hidden.bs.tooltip</code></td>
      <td>This event is fired when the tooltip has finished being hidden from the user (will wait for CSS transitions to complete).</td>
    </tr>
    <tr>
      <td><code>inserted.bs.tooltip</code></td>
      <td>This event is fired after the <code>show.bs.tooltip</code> event when the tooltip template has been added to the DOM.</td>
    </tr>
  </tbody>
</table>

```js
var myTooltipEl = document.getElementById('myTooltip')
var tooltip = new bootstrap.Tooltip(myTooltipEl)

myTooltipEl.addEventListener('hidden.bs.tooltip', function () {
  // do something...
})

tooltip.hide()
```
