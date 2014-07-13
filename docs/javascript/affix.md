---
layout: page
title: Affix
---

## Example

The subnavigation on the right is a live demo of the affix plugin.

## Usage

Use the affix plugin via data attributes or manually with your own JavaScript. **In both situations, you must provide CSS for the positioning and width of your affixed content.**

### Position via CSS

The affix plugin toggles between three classes, each representing a particular state: `.affix`, `.affix-top`, and `.affix-bottom`. You must provide the styles for these classes yourself (independent of this plugin) to handle the actual positions.

Here's how the affix plugin works:

- To start, the plugin adds `.affix-top` to indicate the element is in its top-most position. At this point no CSS positioning is required.
- Scrolling past the element you want affixed should trigger the actual affixing. This is where `.affix` replaces `.affix-top` and sets `position: fixed;` (provided by Bootstrap's code CSS).
- If a bottom offset is defined, scrolling past that should replace `.affix` with `.affix-bottom`. Since offsets are optional, setting one requires you to set the appropriate CSS. In this case, add `position: absolute;` when necessary. The plugin uses the data attribute or JavaScript option to determine where to position the element from there.

Follow the above steps to set your CSS for either of the usage options below.

### Via data attributes

To easily add affix behavior to any element, just add `data-spy="affix"` to the element you want to spy on. Use offsets to define when to toggle the pinning of an element.

{% highlight html %}
<div data-spy="affix" data-offset-top="60" data-offset-bottom="200">
  ...
</div>
{% endhighlight %}

### Via JavaScript

Call the affix plugin via JavaScript:

{% highlight js %}
  $('#my-affix').affix({
    offset: {
      top: 100
    , bottom: function () {
        return (this.bottom = $('.footer').outerHeight(true))
      }
    }
  })
{% endhighlight %}


### Options

Options can be passed via data attributes or JavaScript. For data attributes, append the option name to `data-`, as in `data-offset-top="200"`.

<div class="table-responsive">
  <table class="table table-bordered table-striped">
    <thead>
     <tr>
       <th style="width: 100px;">Name</th>
       <th style="width: 100px;">type</th>
       <th style="width: 50px;">default</th>
       <th>description</th>
     </tr>
    </thead>
    <tbody>
     <tr>
       <td>offset</td>
       <td>number | function | object</td>
       <td>10</td>
       <td>Pixels to offset from screen when calculating position of scroll. If a single number is provided, the offset will be applied in both top and bottom directions. To provide a unique, bottom and top offset just provide an object <code>offset: { top: 10 }</code> or <code>offset: { top: 10, bottom: 5 }</code>. Use a function when you need to dynamically calculate an offset.</td>
     </tr>
     <tr>
       <td>target</td>
       <td>selector | node | jQuery element</td>
       <td>the <code>window</code> object</td>
       <td>Specifies the target element of the affix.</td>
     </tr>
    </tbody>
  </table>
</div>

### Events

Bootstrap's affix class exposes a few events for hooking into affix functionality.

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
        <td>affix.bs.affix</td>
        <td>This event fires immediately before the element has been affixed.</td>
      </tr>
      <tr>
        <td>affixed.bs.affix</td>
        <td>This event is fired after the element has been affixed.</td>
      </tr>
      <tr>
        <td>affix-top.bs.affix</td>
        <td>This event fires immediately before the element has been affixed-top.</td>
      </tr>
      <tr>
        <td>affixed-top.bs.affix</td>
        <td>This event is fired after the element has been affixed-top.</td>
      </tr>
     <tr>
      <td>affix-bottom.bs.affix</td>
        <td>This event fires immediately before the element has been affixed-bottom.</td>
      </tr>
      <tr>
        <td>affixed-bottom.bs.affix</td>
        <td>This event is fired after the element has been affixed-bottom.</td>
      </tr>
    </tbody>
  </table>
</div>
