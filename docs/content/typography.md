---
layout: docs
title: Typography
group: content
---

Bootstrap includes simple and easily customized typography for headings, body text, lists, and more. For even more control, check out the [textual utility classes](/components/utilities/).

## Contents

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## Global settings

Bootstrap sets basic global display, typography, and link styles. Specifically, we:

- Set `background-color: #fff;` on the `<body>`
- Use the `@font-family-base`, `@font-size-base`, and `@line-height-base` attributes as our typographic base
- Set the global link color via `@link-color` and apply link underlines only on `:hover`

These styles can be found within `scaffolding.less`.


## Headings

All HTML headings, `<h1>` through `<h6>`, are available. `.h1` through `.h6` classes are also available, for when you want to match the font styling of a heading but still want your text to be displayed inline.

<div class="bd-example bd-example-type">
  <table class="table">
    <tbody>
      <tr>
        <td><h1>h1. Bootstrap heading</h1></td>
        <td class="type-info">Semibold 36px</td>
      </tr>
      <tr>
        <td><h2>h2. Bootstrap heading</h2></td>
        <td class="type-info">Semibold 30px</td>
      </tr>
      <tr>
        <td><h3>h3. Bootstrap heading</h3></td>
        <td class="type-info">Semibold 24px</td>
      </tr>
      <tr>
        <td><h4>h4. Bootstrap heading</h4></td>
        <td class="type-info">Semibold 18px</td>
      </tr>
      <tr>
        <td><h5>h5. Bootstrap heading</h5></td>
        <td class="type-info">Semibold 14px</td>
      </tr>
      <tr>
        <td><h6>h6. Bootstrap heading</h6></td>
        <td class="type-info">Semibold 12px</td>
      </tr>
    </tbody>
  </table>
</div>

{% highlight html %}
<h1>h1. Bootstrap heading</h1>
<h2>h2. Bootstrap heading</h2>
<h3>h3. Bootstrap heading</h3>
<h4>h4. Bootstrap heading</h4>
<h5>h5. Bootstrap heading</h5>
<h6>h6. Bootstrap heading</h6>
{% endhighlight %}

### Customizing headings

Use the included utility classes to recreate the small secondary heading text from Bootstrap 3.

{% example html %}
<h3>
  Fancy display heading
  <small class="text-muted">With faded secondary text</small>
</h3>
{% endexample %}

## Display headings

Traditional heading elements are designed to work best in the meat of your page content. When you need a heading to stand out, consider using a **display heading**—a larger, slightly more opinionated heading style.

<div class="bd-example bd-example-type">
  <table class="table">
    <tbody>
      <tr>
        <td><h1 class="display-4">Display 4</h1></td>
      </tr>
      <tr>
      <td><h1 class="display-3">Display 3</h1></td>
      </tr>
      <tr>
      <td><h1 class="display-2">Display 2</h1></td>
      </tr>
      <tr>
      <td><h1 class="display-1">Display 1</h1></td>
      </tr>
    </tbody>
  </table>
</div>

## Lead

Make a paragraph stand out by adding `.lead`.

{% example html %}
<p class="lead">
  Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Duis mollis, est non commodo luctus.
</p>
{% endexample %}

## Inline text elements

Styling for common inline HTML5 elements.

{% example html %}
<p>You can use the mark tag to <mark>highlight</mark> text.</p>
<p><del>This line of text is meant to be treated as deleted text.</del></p>
<p><s>This line of text is meant to be treated as no longer accurate.</s></p>
<p><ins>This line of text is meant to be treated as an addition to the document.</ins></p>
<p><u>This line of text will render as underlined</u></p>
<p><small>This line of text is meant to be treated as fine print.</small></p>
<p><strong>This line rendered as bold text.</strong></p>
<p><em>This line rendered as italicized text.</em></p>
{% endexample %}

While not shown above, feel free to use `<b>` and `<i>` in HTML5. `<b>` is meant to highlight words or phrases without conveying additional importance while `<i>` is mostly for voice, technical terms, etc.

## Abbreviations

Stylized implementation of HTML's `<abbr>` element for abbreviations and acronyms to show the expanded version on hover. Abbreviations with a `title` attribute have a light dotted bottom border and a help cursor on hover, providing additional context on hover and to users of assistive technologies.

Add `.initialism` to an abbreviation for a slightly smaller font-size.

{% example html %}
<p><abbr title="attribute">attr</abbr></p>
<p><abbr title="HyperText Markup Language" class="initialism">HTML</abbr></p>
{% endexample %}

## Blockquotes

For quoting blocks of content from another source within your document. Wrap `<blockquote>` around any <abbr title="HyperText Markup Language">HTML</abbr> as the quote. For straight quotes, we recommend a `<p>`.

{% example html %}
<blockquote>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
</blockquote>
{% endexample %}

### Naming a source

Add a `<footer>` for identifying the source. Wrap the name of the source work in `<cite>`.

{% example html %}
<blockquote class="blockquote">
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
  <footer>Someone famous in <cite title="Source Title">Source Title</cite></footer>
</blockquote>
{% endexample %}

### Reverse layout

Add `.blockquote-reverse` for a blockquote with right-aligned content.

{% example html %}
<blockquote class="blockquote blockquote-reverse">
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
  <footer>Someone famous in <cite title="Source Title">Source Title</cite></footer>
</blockquote>
{% endexample %}

## Lists

### Unstyled

Remove the default `list-style` and left margin on list items (immediate children only). **This only applies to immediate children list items**, meaning you will need to add the class for any nested lists as well.

{% example html %}
<ul class="list-unstyled">
  <li>Lorem ipsum dolor sit amet</li>
  <li>Consectetur adipiscing elit</li>
  <li>Integer molestie lorem at massa</li>
  <li>Facilisis in pretium nisl aliquet</li>
  <li>Nulla volutpat aliquam velit
    <ul>
      <li>Phasellus iaculis neque</li>
      <li>Purus sodales ultricies</li>
      <li>Vestibulum laoreet porttitor sem</li>
      <li>Ac tristique libero volutpat at</li>
    </ul>
  </li>
  <li>Faucibus porta lacus fringilla vel</li>
  <li>Aenean sit amet erat nunc</li>
  <li>Eget porttitor lorem</li>
</ul>
{% endexample %}

### Inline

Place all list items on a single line with `display: inline-block;` and some light padding.

{% example html %}
<ul class="list-inline">
  <li>Lorem ipsum</li>
  <li>Phasellus iaculis</li>
  <li>Nulla volutpat</li>
</ul>
{% endexample %}

### Horizontal description

Align terms and descriptions horizontally by using our grid system's predefined classes (or semantic mixins). For longer terms, you can optionally add a `.text-truncate` class to truncate the text with an ellipsis.

{% example html %}
<dl class="dl-horizontal">
  <dt class="col-sm-3">Description lists</dt>
  <dd class="col-sm-9">A description list is perfect for defining terms.</dd>

  <dt class="col-sm-3">Euismod</dt>
  <dd class="col-sm-9">Vestibulum id ligula porta felis euismod semper eget lacinia odio sem nec elit.</dd>
  <dd class="col-sm-9 col-sm-offset-3">Donec id elit non mi porta gravida at eget metus.</dd>

  <dt class="col-sm-3">Malesuada porta</dt>
  <dd class="col-sm-9">Etiam porta sem malesuada magna mollis euismod.</dd>

  <dt class="col-sm-3 text-truncate">Truncated term is truncated</dt>
  <dd class="col-sm-9">Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.</dd>
</dl>
{% endexample %}
