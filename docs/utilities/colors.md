---
layout: docs
title: Colors
group: utilities
---

Convey meaning through color with a handful of emphasis utility classes. These may also be applied to links and will darken on hover just like our default link styles.

{% example html %}
<p class="text-muted">Fusce dapibus, tellus ac cursus commodo, tortor mauris nibh.</p>
<p class="text-primary">Nullam id dolor id nibh ultricies vehicula ut id elit.</p>
<p class="text-success">Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>
<p class="text-info">Maecenas sed diam eget risus varius blandit sit amet non magna.</p>
<p class="text-warning">Etiam porta sem malesuada magna mollis euismod.</p>
<p class="text-danger">Donec ullamcorper nulla non metus auctor fringilla.</p>
<p class="text-gray-dark">Eget risus varius blandit sit ultricies vehicula amet non magna.</p>
<p class="text-white">Etiam porta sem malesuada ultricies vehicula.</p>
{% endexample %}

Contextual text classes also work well on anchors with the provided hover and focus states. **Note that the `.text-white` class has no link styling.**

{% example html %}
<a href="#" class="text-muted">Muted link</a>
<a href="#" class="text-primary">Primary link</a>
<a href="#" class="text-success">Success link</a>
<a href="#" class="text-info">Info link</a>
<a href="#" class="text-warning">Warning link</a>
<a href="#" class="text-danger">Danger link</a>
{% endexample %}

Similar to the contextual text color classes, easily set the background of an element to any contextual class. Anchor components will darken on hover, just like the text classes. Background utilities **do not set `color`**, so in some cases you'll want to use `.text-*` utilities.

{% example html %}
<div class="bg-primary text-white">Nullam id dolor id nibh ultricies vehicula ut id elit.</div>
<div class="bg-success text-white">Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</div>
<div class="bg-info text-white">Maecenas sed diam eget risus varius blandit sit amet non magna.</div>
<div class="bg-warning text-white">Etiam porta sem malesuada magna mollis euismod.</div>
<div class="bg-danger text-white">Donec ullamcorper nulla non metus auctor fringilla.</div>
<div class="bg-inverse text-white">Cras mattis consectetur purus sit amet fermentum.</div>
<div class="bg-faded">Cras mattis consectetur purus sit amet fermentum.</div>
{% endexample %}

{% callout info %}
#### Dealing with specificity

Sometimes contextual classes cannot be applied due to the specificity of another selector. In some cases, a sufficient workaround is to wrap your element's content in a `<div>` with the class.
{% endcallout %}

{% capture callout-include %}{% include callout-warning-color-assistive-technologies.md %}{% endcapture %}
{{ callout-include | markdownify }}
