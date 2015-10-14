---
layout: docs
title: Utility classes
group: components
---

Bootstrap includes dozens of utilities—classes with a single purpose. They're designed to reduce the frequency of highly repetitive declarations in your CSS down while allowing for quick and easy development.

## Contents

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## Spacing

Assign `margin` or `padding` to an element or a subset of it's sides with shorthand classes. Includes support for individual properties, all properties, and vertical and horizontal properties. All classes are multiples on the global default value, `1rem`.

### Margin

{% highlight scss %}
.m-a-0 { margin:        0 !important; }
.m-t-0 { margin-top:    0 !important; }
.m-r-0 { margin-right:  0 !important; }
.m-b-0 { margin-bottom: 0 !important; }
.m-l-0 { margin-left:   0 !important; }
.m-x-0 { margin-right:  0 !important; margin-left:   0 !important; }
.m-y-0 { margin-top:    0 !important; margin-bottom: 0 !important; }

.m-a { margin:        $spacer !important; }
.m-t { margin-top:    $spacer-y !important; }
.m-r { margin-right:  $spacer-x !important; }
.m-b { margin-bottom: $spacer-y !important; }
.m-l { margin-left:   $spacer-x !important; }
.m-x { margin-right:  $spacer-x !important; margin-left: $spacer-x !important; }
.m-y { margin-top:    $spacer-y !important; margin-bottom: $spacer-y !important; }
.m-x-auto { margin-right: auto !important; margin-left: auto !important; }

.m-a-md { margin:        ($spacer * 1.5) !important; }
.m-t-md { margin-top:    ($spacer-y * 1.5) !important; }
.m-r-md { margin-right:  ($spacer-y * 1.5) !important; }
.m-b-md { margin-bottom: ($spacer-y * 1.5) !important; }
.m-l-md { margin-left:   ($spacer-y * 1.5) !important; }
.m-x-md { margin-right:  ($spacer-x * 1.5) !important; margin-left:   ($spacer-x * 1.5) !important; }
.m-y-md { margin-top:    ($spacer-y * 1.5) !important; margin-bottom: ($spacer-y * 1.5) !important; }

.m-a-lg { margin:        ($spacer * 3) !important; }
.m-t-lg { margin-top:    ($spacer-y * 3) !important; }
.m-r-lg { margin-right:  ($spacer-y * 3) !important; }
.m-b-lg { margin-bottom: ($spacer-y * 3) !important; }
.m-l-lg { margin-left:   ($spacer-y * 3) !important; }
.m-x-lg { margin-right:  ($spacer-x * 3) !important; margin-left:   ($spacer-x * 3) !important; }
.m-y-lg { margin-top:    ($spacer-y * 3) !important; margin-bottom: ($spacer-y * 3) !important; }
{% endhighlight %}

### Padding

{% highlight scss %}
.p-a-0 { padding:        0 !important; }
.p-t-0 { padding-top:    0 !important; }
.p-r-0 { padding-right:  0 !important; }
.p-b-0 { padding-bottom: 0 !important; }
.p-l-0 { padding-left:   0 !important; }
.p-x-0 { padding-left:   0 !important; padding-right: 0 !important; }
.p-y-0 { padding-top:    0 !important; padding-bottom: 0 !important; }

.p-a { padding:        $spacer !important; }
.p-t { padding-top:    $spacer-y !important; }
.p-r { padding-right:  $spacer-x !important; }
.p-b { padding-bottom: $spacer-y !important; }
.p-l { padding-left:   $spacer-x !important; }
.p-x { padding-right:  $spacer-x !important; padding-left:   $spacer-x !important; }
.p-y { padding-top:    $spacer-y !important; padding-bottom: $spacer-y !important; }

.p-a-md { padding:        ($spacer * 1.5) !important; }
.p-t-md { padding-top:    ($spacer-y * 1.5) !important; }
.p-r-md { padding-right:  ($spacer-y * 1.5) !important; }
.p-b-md { padding-bottom: ($spacer-y * 1.5) !important; }
.p-l-md { padding-left:   ($spacer-y * 1.5) !important; }
.p-x-md { padding-right:  ($spacer-x * 1.5) !important; padding-left:   ($spacer-x * 1.5) !important; }
.p-y-md { padding-top:    ($spacer-y * 1.5) !important; padding-bottom: ($spacer-y * 1.5) !important; }

.p-a-lg { padding:        ($spacer * 3) !important; }
.p-t-lg { padding-top:    ($spacer-y * 3) !important; }
.p-r-lg { padding-right:  ($spacer-y * 3) !important; }
.p-b-lg { padding-bottom: ($spacer-y * 3) !important; }
.p-l-lg { padding-left:   ($spacer-y * 3) !important; }
.p-x-lg { padding-right:  ($spacer-x * 3) !important; padding-left:   ($spacer-x * 3) !important; }
.p-y-lg { padding-top:    ($spacer-y * 3) !important; padding-bottom: ($spacer-y * 3) !important; }
{% endhighlight %}


## Text alignment

Easily realign text to components with text alignment classes.

{% example html %}
<p class="text-left">Left aligned text.</p>
<p class="text-center">Center aligned text.</p>
<p class="text-right">Right aligned text.</p>
<p class="text-justify">Justified text.</p>
<p class="text-nowrap">No wrap text.</p>
{% endexample %}

## Text transform

Transform text in components with text capitalization classes.

{% example html %}
<p class="text-lowercase">Lowercased text.</p>
<p class="text-uppercase">Uppercased text.</p>
<p class="text-capitalize">Capitalized text.</p>
{% endexample %}

## Contextual colors and backgrounds

Convey meaning through color with a handful of emphasis utility classes. These may also be applied to links and will darken on hover just like our default link styles.

{% example html %}
<p class="text-muted">Fusce dapibus, tellus ac cursus commodo, tortor mauris nibh.</p>
<p class="text-primary">Nullam id dolor id nibh ultricies vehicula ut id elit.</p>
<p class="text-success">Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>
<p class="text-info">Maecenas sed diam eget risus varius blandit sit amet non magna.</p>
<p class="text-warning">Etiam porta sem malesuada magna mollis euismod.</p>
<p class="text-danger">Donec ullamcorper nulla non metus auctor fringilla.</p>
{% endexample %}

Similar to the contextual text color classes, easily set the background of an element to any contextual class. Anchor components will darken on hover, just like the text classes.

{% example html %}
<div class="bg-primary">Nullam id dolor id nibh ultricies vehicula ut id elit.</div>
<div class="bg-success">Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</div>
<div class="bg-info">Maecenas sed diam eget risus varius blandit sit amet non magna.</div>
<div class="bg-warning">Etiam porta sem malesuada magna mollis euismod.</div>
<div class="bg-danger">Donec ullamcorper nulla non metus auctor fringilla.</div>
{% endexample %}

{% callout info %}
#### Dealing with specificity

Sometimes contextual classes cannot be applied due to the specificity of another selector. In some cases, a sufficient workaround is to wrap your element's content in a `<div>` with the class.
{% endcallout %}

{% callout warning %}
#### Conveying meaning to assistive technologies

Ensure that any meaning conveyed through color is also conveyed in a format that is not purely presentational.
{% endcallout %}

## Close icon

Use a generic close icon for dismissing content like modals and alerts. **Be sure to include screen reader text when you can** as we've done with `.sr-only`.

{% example html %}
<button type="button" class="close" aria-label="Close">
  <span aria-hidden="true">&times;</span>
  <span class="sr-only">Close</span>
</button>
{% endexample %}

## Floats

Float an element to the left or right with a class. `!important` is included to avoid specificity issues. Classes can also be used as mixins.

{% example html %}
<div class="pull-left">Float left</div>
<div class="pull-right">Float right</div>
{% endexample %}

{% highlight scss %}
// Classes
.pull-left {
  float: left !important;
}
.pull-right {
  float: right !important;
}

// Usage as mixins
.element {
  @include pull-left;
}
.another-element {
  @include pull-right;
}
{% endhighlight %}

## Center content

Set an element to `display: block;` and center via `margin`. Available as a mixin and class.

{% example html %}
<div class="center-block">Centered block</div>
{% endexample %}

{% highlight scss %}
// Class
.center-block {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

// Usage as a mixin
.element {
  @include center-block;
}
{% endhighlight %}

Easily clear `float`s by adding `.clearfix` **to the parent element**. Utilizes [the micro clearfix](http://nicolasgallagher.com/micro-clearfix-hack/) as popularized by Nicolas Gallagher. Can also be used as a mixin.

{% highlight html %}
<div class="clearfix">...</div>
{% endhighlight %}

{% highlight scss %}
// Mixin itself
.clearfix() {
  &:before,
  &:after {
    content: " ";
    display: table;
  }
  &:after {
    clear: both;
  }
}

// Usage as a mixin
.element {
  @include clearfix;
}
{% endhighlight %}

## Hidden content

Hide any HTML element with the `[hidden]` attribute. Previously, v3.x included a `.hidden` class that forced toggled content. However, we removed it due to conflicts with jQuery's `hide()` function. It's taken from [PureCSS](http://purecss.io).

Furthermore, `.invisible` can be used to toggle the visibility of an element, meaning its `display` is not modified and the element can still affect the flow of the document.

{% highlight html %}
<input type="text" hidden>
{% endhighlight %}

## Invisible content

The `.invisible` class can be used to toggle only the visibility of an element, meaning its `display` is not modified and the element can still affect the flow of the document.

{% highlight html %}
<div class="invisible">...</div>
{% endhighlight %}

{% highlight scss %}
// Class
.invisible {
  visibility: hidden;
}

// Usage as a mixin
.element {
  .invisible();
}
{% endhighlight %}

## Screen readers

Hide an element to all devices **except screen readers** with `.sr-only`. Combine `.sr-only` with `.sr-only-focusable` to show the element again when it's focused (e.g. by a keyboard-only user). Necessary for following [accessibility best practices](../getting-started/#accessibility). Can also be used as mixins.

{% highlight html %}
<a class="sr-only sr-only-focusable" href="#content">Skip to main content</a>
{% endhighlight %}

{% highlight scss %}
// Usage as a mixin
.skip-navigation {
  @include sr-only;
  @include sr-only-focusable;
}
{% endhighlight %}

## Image replacement

Utilize the `.text-hide` class or mixin to help replace an element's text content with a background image.

{% highlight html %}
<h1 class="text-hide">Custom heading</h1>
{% endhighlight %}

{% highlight scss %}
// Usage as a mixin
.heading {
  @include text-hide;
}
{% endhighlight %}

## Responsive embeds

Allow browsers to determine video or slideshow dimensions based on the width of their containing block by creating an intrinsic ratio that will properly scale on any device.

Rules are directly applied to `<iframe>`, `<embed>`, `<video>`, and `<object>` elements; optionally use an explicit descendant class `.embed-responsive-item` when you want to match the styling for other attributes.

**Pro-Tip!** You don't need to include `frameborder="0"` in your `<iframe>`s as we override that for you.

{% example html %}
<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="//www.youtube.com/embed/zpOULjyy-n8?rel=0" allowfullscreen></iframe>
</div>
{% endexample %}

Aspect ratios can be customized with modifier classes.

{% highlight html %}
<!-- 21:9 aspect ratio -->
<div class="embed-responsive embed-responsive-21by9">
  <iframe class="embed-responsive-item" src="..."></iframe>
</div>

<!-- 16:9 aspect ratio -->
<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="..."></iframe>
</div>

<!-- 4:3 aspect ratio -->
<div class="embed-responsive embed-responsive-4by3">
  <iframe class="embed-responsive-item" src="..."></iframe>
</div>
{% endhighlight %}
