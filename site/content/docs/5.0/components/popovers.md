---
layout: docs
title: Popovers
description: Documentation and examples for adding Bootstrap popovers, like those found in iOS, to any element on your site.
group: components
toc: true
---

## Overview

Things to know when using the popover plugin:

- Popovers rely on the 3rd party library [Popper](https://popper.js.org/) for positioning. You must include [popper.min.js]({{< param "cdn.popper" >}}) before bootstrap.js or use `bootstrap.bundle.min.js` / `bootstrap.bundle.js` which contains Popper in order for popovers to work!
- Popovers require the [tooltip plugin]({{< docsref "/components/tooltips" >}}) as a dependency.
- Popovers are opt-in for performance reasons, so **you must initialize them yourself**.
- Zero-length `title` and `content` values will never show a popover.
- Specify `container: 'body'` to avoid rendering problems in more complex components (like our input groups, button groups, etc).
- Triggering popovers on hidden elements will not work.
- Popovers for `.disabled` or `disabled` elements must be triggered on a wrapper element.
- When triggered from anchors that wrap across multiple lines, popovers will be centered between the anchors' overall width. Use `.text-nowrap` on your `<a>`s to avoid this behavior.
- Popovers must be hidden before their corresponding elements have been removed from the DOM.
- Popovers can be triggered thanks to an element inside a shadow DOM.

{{< callout info >}}
{{< partial "callout-info-sanitizer.md" >}}
{{< /callout >}}

{{< callout info >}}
{{< partial "callout-info-prefersreducedmotion.md" >}}
{{< /callout >}}

Keep reading to see how popovers work with some examples.

## Example: Enable popovers everywhere

One way to initialize all popovers on a page would be to select them by their `data-bs-toggle` attribute:

```js
var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl)
})
```

## Example: Using the `container` option

When you have some styles on a parent element that interfere with a popover, you'll want to specify a custom `container` so that the popover's HTML appears within that element instead.

```js
var popover = new bootstrap.Popover(document.querySelector('.example-popover'), {
  container: 'body'
})
```

## Example

{{< example >}}
<button type="button" class="btn btn-lg btn-danger" data-bs-toggle="popover" title="Popover title" data-bs-content="And here's some amazing content. It's very engaging. Right?">Click to toggle popover</button>
{{< /example >}}

### Four directions

Four options are available: top, right, bottom, and left aligned. Directions are mirrored when using Bootstrap in RTL.

{{< example >}}
<button type="button" class="btn btn-secondary" data-bs-container="body" data-bs-toggle="popover" data-bs-placement="top" data-bs-content="Top popover">
  Popover on top
</button>
<button type="button" class="btn btn-secondary" data-bs-container="body" data-bs-toggle="popover" data-bs-placement="right" data-bs-content="Right popover">
  Popover on right
</button>
<button type="button" class="btn btn-secondary" data-bs-container="body" data-bs-toggle="popover" data-bs-placement="bottom" data-bs-content="Bottom popover">
  Popover on bottom
</button>
<button type="button" class="btn btn-secondary" data-bs-container="body" data-bs-toggle="popover" data-bs-placement="left" data-bs-content="Left popover">
  Popover on left
</button>
{{< /example >}}

### Dismiss on next click

Use the `focus` trigger to dismiss popovers on the user's next click of a different element than the toggle element.

{{< callout danger >}}
#### Specific markup required for dismiss-on-next-click

For proper cross-browser and cross-platform behavior, you must use the `<a>` tag, _not_ the `<button>` tag, and you also must include a [`tabindex`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex) attribute.
{{< /callout >}}

{{< example >}}
<a tabindex="0" class="btn btn-lg btn-danger" role="button" data-bs-toggle="popover" data-bs-trigger="focus" title="Dismissible popover" data-bs-content="And here's some amazing content. It's very engaging. Right?">Dismissible popover</a>
{{< /example >}}

```js
var popover = new bootstrap.Popover(document.querySelector('.popover-dismiss'), {
  trigger: 'focus'
})
```

### Disabled elements

Elements with the `disabled` attribute aren't interactive, meaning users cannot hover or click them to trigger a popover (or tooltip). As a workaround, you'll want to trigger the popover from a wrapper `<div>` or `<span>`, ideally made keyboard-focusable using `tabindex="0"`.

For disabled popover triggers, you may also prefer `data-bs-trigger="hover focus"` so that the popover appears as immediate visual feedback to your users as they may not expect to _click_ on a disabled element.

{{< example >}}
<span class="d-inline-block" tabindex="0" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-content="Disabled popover">
  <button class="btn btn-primary" type="button" disabled>Disabled button</button>
</span>
{{< /example >}}

## Sass

### Variables

{{< scss-docs name="popover-variables" file="scss/_variables.scss" >}}

## Usage

Enable popovers via JavaScript:

```js
var exampleEl = document.getElementById('example')
var popover = new bootstrap.Popover(exampleEl, options)
```

{{< callout warning >}}
### Making popovers work for keyboard and assistive technology users

To allow keyboard users to activate your popovers, you should only add them to HTML elements that are traditionally keyboard-focusable and interactive (such as links or form controls). Although arbitrary HTML elements (such as `<span>`s) can be made focusable by adding the `tabindex="0"` attribute, this will add potentially annoying and confusing tab stops on non-interactive elements for keyboard users, and most assistive technologies currently do not announce the popover's content in this situation. Additionally, do not rely solely on `hover` as the trigger for your popovers, as this will make them impossible to trigger for keyboard users.

While you can insert rich, structured HTML in popovers with the `html` option, we strongly recommend that you avoid adding an excessive amount of content. The way popovers currently work is that, once displayed, their content is tied to the trigger element with the `aria-describedby` attribute. As a result, the entirety of the popover's content will be announced to assistive technology users as one long, uninterrupted stream.

Additionally, while it is possible to also include interactive controls (such as form elements or links) in your popover (by adding these elements to the `allowList` of allowed attributes and tags), be aware that currently the popover does not manage keyboard focus order. When a keyboard user opens a popover, focus remains on the triggering element, and as the popover usually does not immediately follow the trigger in the document's structure, there is no guarantee that moving forward/pressing <kbd>TAB</kbd> will move a keyboard user into the popover itself. In short, simply adding interactive controls to a popover is likely to make these controls unreachable/unusable for keyboard users and users of assistive technologies, or at the very least make for an illogical overall focus order. In these cases, consider using a modal dialog instead.
{{< /callout >}}

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
      <td>Apply a CSS fade transition to the popover</td>
    </tr>
    <tr>
      <td><code>container</code></td>
      <td>string | element | false</td>
      <td><code>false</code></td>
      <td>
        <p>Appends the popover to a specific element. Example: <code>container: 'body'</code>. This option is particularly useful in that it allows you to position the popover in the flow of the document near the triggering element - which will prevent the popover from floating away from the triggering element during a window resize.</p>
      </td>
    </tr>
    <tr>
      <td><code>content</code></td>
      <td>string | element | function</td>
      <td><code>''</code></td>
      <td>
        <p>Default content value if <code>data-bs-content</code> attribute isn't present.</p>
        <p>If a function is given, it will be called with its <code>this</code> reference set to the element that the popover is attached to.</p>
      </td>
    </tr>
    <tr>
      <td><code>delay</code></td>
      <td>number | object</td>
      <td><code>0</code></td>
      <td>
        <p>Delay showing and hiding the popover (ms) - does not apply to manual trigger type</p>
        <p>If a number is supplied, delay is applied to both hide/show</p>
        <p>Object structure is: <code>delay: { "show": 500, "hide": 100 }</code></p>
      </td>
    </tr>
    <tr>
      <td><code>html</code></td>
      <td>boolean</td>
      <td><code>false</code></td>
      <td>Insert HTML into the popover. If false, <code>innerText</code> property will be used to insert content into the DOM. Use text if you're worried about XSS attacks.</td>
    </tr>
    <tr>
      <td><code>placement</code></td>
      <td>string | function</td>
      <td><code>'right'</code></td>
      <td>
        <p>How to position the popover - auto | top | bottom | left | right.<br>When <code>auto</code> is specified, it will dynamically reorient the popover.</p>
        <p>When a function is used to determine the placement, it is called with the popover DOM node as its first argument and the triggering element DOM node as its second. The <code>this</code> context is set to the popover instance.</p>
      </td>
    </tr>
    <tr>
      <td><code>selector</code></td>
      <td>string | false</td>
      <td><code>false</code></td>
      <td>If a selector is provided, popover objects will be delegated to the specified targets. In practice, this is used to enable dynamic HTML content to have popovers added. See <a href="{{< param repo >}}/issues/4215">this</a> and <a href="https://codepen.io/team/bootstrap/pen/zYBXGwX?editors=1010">an informative example</a>.</td>
    </tr>
    <tr>
      <td><code>template</code></td>
      <td>string</td>
      <td><code>'&lt;div class="popover" role="tooltip"&gt;&lt;div class="popover-arrow"&gt;&lt;/div&gt;&lt;h3 class="popover-header"&gt;&lt;/h3&gt;&lt;div class="popover-body"&gt;&lt;/div&gt;&lt;/div&gt;'</code></td>
      <td>
        <p>Base HTML to use when creating the popover.</p>
        <p>The popover's <code>title</code> will be injected into the <code>.popover-header</code>.</p>
        <p>The popover's <code>content</code> will be injected into the <code>.popover-body</code>.</p>
        <p><code>.popover-arrow</code> will become the popover's arrow.</p>
        <p>The outermost wrapper element should have the <code>.popover</code> class.</p>
      </td>
    </tr>
    <tr>
      <td><code>title</code></td>
      <td>string | element | function</td>
      <td><code>''</code></td>
      <td>
        <p>Default title value if <code>title</code> attribute isn't present.</p>
        <p>If a function is given, it will be called with its <code>this</code> reference set to the element that the popover is attached to.</p>
      </td>
    </tr>
    <tr>
      <td><code>trigger</code></td>
      <td>string</td>
      <td><code>'click'</code></td>
      <td>How popover is triggered - click | hover | focus | manual. You may pass multiple triggers; separate them with a space. <code>manual</code> cannot be combined with any other trigger.</td>
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
      <td>Overflow constraint boundary of the popover (applies only to Popper's preventOverflow modifier). By default it's <code>'clippingParents'</code> and can accept an HTMLElement reference (via JavaScript only). For more information refer to Popper's <a href="https://popper.js.org/docs/v2/utils/detect-overflow/#boundary">detectOverflow docs</a>.</td>
    </tr>
    <tr>
      <td><code>customClass</code></td>
      <td>string | function</td>
      <td><code>''</code></td>
      <td>
        <p>Add classes to the popover when it is shown. Note that these classes will be added in addition to any classes specified in the template. To add multiple classes, separate them with spaces: <code>'class-1 class-2'</code>.</p>
        <p>You can also pass a function that should return a single string containing additional class names.</p>
      </td>
    </tr>
    <tr>
      <td><code>sanitize</code></td>
      <td>boolean</td>
      <td><code>true</code></td>
      <td>Enable or disable the sanitization. If activated <code>'template'</code>, <code>'content'</code> and <code>'title'</code> options will be sanitized. See the <a href="{{< docsref "/getting-started/javascript#sanitizer" >}}">sanitizer section in our JavaScript documentation</a>.</td>
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
      <td><code>[0, 8]</code></td>
      <td>
        <p>Offset of the popover relative to its target. You can pass a string in data attributes with comma separated values like: <code>data-bs-offset="10,20"</code></p>
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
#### Data attributes for individual popovers

Options for individual popovers can alternatively be specified through the use of data attributes, as explained above.
{{< /callout >}}

#### Using function with `popperConfig`

```js
var popover = new bootstrap.Popover(element, {
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

Reveals an element's popover. **Returns to the caller before the popover has actually been shown** (i.e. before the `shown.bs.popover` event occurs). This is considered a "manual" triggering of the popover. Popovers whose title and content are both zero-length are never displayed.

```js
myPopover.show()
```

#### hide

Hides an element's popover. **Returns to the caller before the popover has actually been hidden** (i.e. before the `hidden.bs.popover` event occurs). This is considered a "manual" triggering of the popover.

```js
myPopover.hide()
```

#### toggle

Toggles an element's popover. **Returns to the caller before the popover has actually been shown or hidden** (i.e. before the `shown.bs.popover` or `hidden.bs.popover` event occurs). This is considered a "manual" triggering of the popover.

```js
myPopover.toggle()
```

#### dispose

Hides and destroys an element's popover (Removes stored data on the DOM element). Popovers that use delegation (which are created using [the `selector` option](#options)) cannot be individually destroyed on descendant trigger elements.

```js
myPopover.dispose()
```

#### enable

Gives an element's popover the ability to be shown. **Popovers are enabled by default.**

```js
myPopover.enable()
```

#### disable

Removes the ability for an element's popover to be shown. The popover will only be able to be shown if it is re-enabled.

```js
myPopover.disable()
```

#### toggleEnabled

Toggles the ability for an element's popover to be shown or hidden.

```js
myPopover.toggleEnabled()
```

#### update

Updates the position of an element's popover.

```js
myPopover.update()
```

#### getInstance

*Static* method which allows you to get the popover instance associated with a DOM element

```js
var exampleTriggerEl = document.getElementById('example')
var popover = bootstrap.Popover.getInstance(exampleTriggerEl) // Returns a Bootstrap popover instance
```

#### getOrCreateInstance

*Static* method which allows you to get the popover instance associated with a DOM element, or create a new one in case it wasn't initialised

```js
var exampleTriggerEl = document.getElementById('example')
var popover = bootstrap.Popover.getOrCreateInstance(exampleTriggerEl) // Returns a Bootstrap popover instance
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
      <td>show.bs.popover</td>
      <td>This event fires immediately when the <code>show</code> instance method is called.</td>
    </tr>
    <tr>
      <td>shown.bs.popover</td>
      <td>This event is fired when the popover has been made visible to the user (will wait for CSS transitions to complete).</td>
    </tr>
    <tr>
      <td>hide.bs.popover</td>
      <td>This event is fired immediately when the <code>hide</code> instance method has been called.</td>
    </tr>
    <tr>
      <td>hidden.bs.popover</td>
      <td>This event is fired when the popover has finished being hidden from the user (will wait for CSS transitions to complete).</td>
    </tr>
    <tr>
      <td>inserted.bs.popover</td>
      <td>This event is fired after the <code>show.bs.popover</code> event when the popover template has been added to the DOM.</td>
    </tr>
  </tbody>
</table>

```js
var myPopoverTrigger = document.getElementById('myPopover')
myPopoverTrigger.addEventListener('hidden.bs.popover', function () {
  // do something...
})
```
