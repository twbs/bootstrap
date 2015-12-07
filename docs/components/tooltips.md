---
layout: docs
title: Tooltips
group: components
---

Inspired by the excellent Tipsy jQuery plugin written by Jason Frame. Tooltips are an updated version, which don't rely on images, use CSS3 for animations, and data-attributes for local title storage.

## Contents

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## Overview

Things to know when using the tooltip plugin:

- Tooltips rely on the 3rd party library [Tether](http://github.hubspot.com/tether/) for positioning. You must include [tether.min.js](https://github.com/HubSpot/tether/blob/master/dist/js/tether.min.js) before bootstrap.js in order for tooltips to work!
- Tooltips are opt-in for performance reasons, so **you must initialize them yourself**.
- Tooltips with zero-length titles are never displayed.
- Specify `container: 'body'` to avoid rendering problems in more complex components (like our input groups, button groups, etc).
- Triggering tooltips on hidden elements will not work.
- Tooltips for `.disabled` or `disabled` elements must be triggered on a wrapper element.
- When triggered from hyperlinks that span multiple lines, tooltips will be centered. Use `white-space: nowrap;` on your `<a>`s to avoid this behavior.

Got all that? Great, let's see how they work with some examples.

## Example: Enable tooltips everywhere

One way to initialize all tooltips on a page would be to select them by their `data-toggle` attribute:

{% highlight js %}
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})
{% endhighlight %}

## Examples

Hover over the links below to see tooltips:

<div class="bd-example tooltip-demo">
  <p class="muted">Tight pants next level keffiyeh <a href="#" data-toggle="tooltip" title="Default tooltip">you probably</a> haven't heard of them. Photo booth beard raw denim letterpress vegan messenger bag stumptown. Farm-to-table seitan, mcsweeney's fixie sustainable quinoa 8-bit american apparel <a href="#" data-toggle="tooltip" title="Another tooltip">have a</a> terry richardson vinyl chambray. Beard stumptown, cardigans banh mi lomo thundercats. Tofu biodiesel williamsburg marfa, four loko mcsweeney's cleanse vegan chambray. A really ironic artisan <a href="#" data-toggle="tooltip" title="Another one here too">whatever keytar</a>, scenester farm-to-table banksy Austin <a href="#" data-toggle="tooltip" title="The last tip!">twitter handle</a> freegan cred raw denim single-origin coffee viral.
  </p>
</div>

### Static demo

Four options are available: top, right, bottom, and left aligned.

<div class="bd-example bd-example-tooltip-static">
  <div class="tooltip top" role="tooltip">
    <div class="tooltip-arrow"></div>
    <div class="tooltip-inner">
      Tooltip on the top
    </div>
  </div>
  <div class="tooltip right" role="tooltip">
    <div class="tooltip-arrow"></div>
    <div class="tooltip-inner">
      Tooltip on the right
    </div>
  </div>
  <div class="tooltip bottom" role="tooltip">
    <div class="tooltip-arrow"></div>
    <div class="tooltip-inner">
      Tooltip on the bottom
    </div>
  </div>
  <div class="tooltip left" role="tooltip">
    <div class="tooltip-arrow"></div>
    <div class="tooltip-inner">
      Tooltip on the left
    </div>
  </div>
</div>

### Interactive demo

Hover over the buttons below to see their tooltips.

<div class="bd-example tooltip-demo">
  <div class="bd-example-tooltips">
    <button type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="top" title="Tooltip on top">Tooltip on top</button>
    <button type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="right" title="Tooltip on right">Tooltip on right</button>
    <button type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="bottom" title="Tooltip on bottom">Tooltip on bottom</button>
    <button type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="left" title="Tooltip on left">Tooltip on left</button>
  </div>
</div>

{% highlight html %}
<button type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="top" title="Tooltip on top">
  Tooltip on top
</button>
<button type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="right" title="Tooltip on right">
  Tooltip on right
</button>
<button type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="bottom" title="Tooltip on bottom">
  Tooltip on bottom
</button>
<button type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="left" title="Tooltip on left">
  Tooltip on left
</button>
{% endhighlight %}

## Usage

The tooltip plugin generates content and markup on demand, and by default places tooltips after their trigger element.

Trigger the tooltip via JavaScript:

{% highlight js %}
$('#example').tooltip(options)
{% endhighlight %}

### Markup

The required markup for a tooltip is only a `data` attribute and `title` on the HTML element you wish to have a tooltip. The generated markup of a tooltip is rather simple, though it does require a position (by default, set to `top` by the plugin).

{% highlight html %}
<!-- HTML to write -->
<a href="#" data-toggle="tooltip" title="Some tooltip text!">Hover over me</a>

<!-- Generated markup by the plugin -->
<div class="tooltip top" role="tooltip">
  <div class="tooltip-arrow"></div>
  <div class="tooltip-inner">
    Some tooltip text!
  </div>
</div>
{% endhighlight %}

### Options

Options can be passed via data attributes or JavaScript. For data attributes, append the option name to `data-`, as in `data-animation=""`.

<div class="table-responsive">
  <table class="table table-bordered table-striped">
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
        <td>animation</td>
        <td>boolean</td>
        <td>true</td>
        <td>Apply a CSS fade transition to the tooltip</td>
      </tr>
      <tr>
        <td>container</td>
        <td>string | false</td>
        <td>false</td>
        <td>
          <p>Appends the tooltip to a specific element. Example: <code>container: 'body'</code>. This option is particularly useful in that it allows you to position the tooltip in the flow of the document near the triggering element - which will prevent the tooltip from floating away from the triggering element during a window resize.</p>
       </td>
      </tr>
      <tr>
        <td>delay</td>
        <td>number | object</td>
        <td>0</td>
        <td>
         <p>Delay showing and hiding the tooltip (ms) - does not apply to manual trigger type</p>
         <p>If a number is supplied, delay is applied to both hide/show</p>
         <p>Object structure is: <code>delay: { "show": 500, "hide": 100 }</code></p>
        </td>
      </tr>
      <tr>
        <td>html</td>
        <td>boolean</td>
        <td>false</td>
        <td>Insert HTML into the tooltip. If false, jQuery's <code>text</code> method will be used to insert content into the DOM. Use text if you're worried about XSS attacks.</td>
      </tr>
      <tr>
        <td>placement</td>
        <td>string | function</td>
        <td>'top'</td>
        <td>
          <p>How to position the tooltip - top | bottom | left | right | auto.<br>When "auto" is specified, it will dynamically reorient the tooltip. For example, if placement is "auto left", the tooltip will display to the left when possible, otherwise it will display right.</p>
          <p>When a function is used to determine the placement, it is called with the tooltip DOM node as its first argument and the triggering element DOM node as its second. The <code>this</code> context is set to the tooltip instance.</p>
        </td>
      </tr>
      <tr>
        <td>selector</td>
        <td>string</td>
        <td>false</td>
        <td>If a selector is provided, popover objects will be delegated to the specified targets. In practice, this is used to enable dynamic HTML content to have popovers added. See <a href="https://github.com/twbs/bootstrap/issues/4215">this</a> and <a href="http://jsbin.com/zopod/1/edit">an informative example</a>.</td>
      </tr>
      <tr>
        <td>template</td>
        <td>string</td>
        <td><code>'&lt;div class="tooltip" role="tooltip"&gt;&lt;div class="tooltip-arrow"&gt;&lt;/div&gt;&lt;div class="tooltip-inner"&gt;&lt;/div&gt;&lt;/div&gt;'</code></td>
        <td>
          <p>Base HTML to use when creating the tooltip.</p>
          <p>The tooltip's <code>title</code> will be injected into the <code>.tooltip-inner</code>.</p>
          <p><code>.tooltip-arrow</code> will become the tooltip's arrow.</p>
          <p>The outermost wrapper element should have the <code>.tooltip</code> class.</p>
        </td>
      </tr>
      <tr>
        <td>title</td>
        <td>string | element | function</td>
        <td>''</td>
        <td>
          <p>Default title value if <code>title</code> attribute isn't present.</p>
          <p>If a function is given, it will be called with its <code>this</code> reference set to the element that the tooltip is attached to.</p>
        </td>
      </tr>
      <tr>
        <td>trigger</td>
        <td>string</td>
        <td>'hover focus'</td>
        <td>How tooltip is triggered - click | hover | focus | manual. You may pass multiple triggers; separate them with a space. `manual` cannot be combined with any other trigger.</td>
      </tr>
      <tr>
        <td>constraints</td>
        <td>Array</td>
        <td>[]</td>
        <td>An array of constraints - passed through to Tether. For more information refer to Tether's <a href="http://github.hubspot.com/tether/#constraints">constraint docs</a>.</td>
      </tr>
      <tr>
        <td>offsets</td>
        <td>string</td>
        <td>'0 0'</td>
        <td>Offset of the popover relative to its target. For more information refer to Tether's <a href="http://github.hubspot.com/tether/#constraints">offset docs</a>.</td>
      </tr>
    </tbody>
  </table>
</div>

{% callout info %}
#### Data attributes for individual tooltips

Options for individual tooltips can alternatively be specified through the use of data attributes, as explained above.
{% endcallout %}

### Methods

#### `$().tooltip(options)`

Attaches a tooltip handler to an element collection.

#### `.tooltip('show')`

Reveals an element's tooltip. **Returns to the caller before the tooltip has actually been shown** (i.e. before the `shown.bs.tooltip` event occurs). This is considered a "manual" triggering of the tooltip. Tooltips with zero-length titles are never displayed.

{% highlight js %}$('#element').tooltip('show'){% endhighlight %}

#### `.tooltip('hide')`

Hides an element's tooltip. **Returns to the caller before the tooltip has actually been hidden** (i.e. before the `hidden.bs.tooltip` event occurs). This is considered a "manual" triggering of the tooltip.

{% highlight js %}$('#element').tooltip('hide'){% endhighlight %}

#### `.tooltip('toggle')`

Toggles an element's tooltip. **Returns to the caller before the tooltip has actually been shown or hidden** (i.e. before the `shown.bs.tooltip` or `hidden.bs.tooltip` event occurs). This is considered a "manual" triggering of the tooltip.

{% highlight js %}$('#element').tooltip('toggle'){% endhighlight %}

#### `.tooltip('dispose')`

Hides and destroys an element's tooltip. Tooltips that use delegation (which are created using [the `selector` option](#options)) cannot be individually destroyed on descendant trigger elements.

{% highlight js %}$('#element').tooltip('dispose'){% endhighlight %}

### Events

<div class="table-responsive">
  <table class="table table-bordered table-striped">
    <thead>
      <tr>
        <th style="width: 150px;">Event Type</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>show.bs.tooltip</td>
        <td>This event fires immediately when the <code>show</code> instance method is called.</td>
      </tr>
      <tr>
        <td>shown.bs.tooltip</td>
        <td>This event is fired when the tooltip has been made visible to the user (will wait for CSS transitions to complete).</td>
      </tr>
      <tr>
        <td>hide.bs.tooltip</td>
        <td>This event is fired immediately when the <code>hide</code> instance method has been called.</td>
      </tr>
      <tr>
        <td>hidden.bs.tooltip</td>
        <td>This event is fired when the tooltip has finished being hidden from the user (will wait for CSS transitions to complete).</td>
      </tr>
    </tbody>
  </table>
</div>

{% highlight js %}
$('#myTooltip').on('hidden.bs.tooltip', function () {
  // do something…
})
{% endhighlight %}
