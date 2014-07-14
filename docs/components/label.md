---
layout: page
title: Labels
---

Small and adaptive tag for adding context to just about any content.

### Example

Labels scale to match the size of the immediate parent element by using relative font sizing and `em` units.

{% example html %}
<h1>Example heading <span class="label label-default">New</span></h1>
<h2>Example heading <span class="label label-default">New</span></h2>
<h3>Example heading <span class="label label-default">New</span></h3>
<h4>Example heading <span class="label label-default">New</span></h4>
<h5>Example heading <span class="label label-default">New</span></h5>
<h6>Example heading <span class="label label-default">New</span></h6>
{% endexample %}

### Contextual variations

Add any of the below mentioned modifier classes to change the appearance of a label.

{% example html %}
<span class="label label-default">Default</span>
<span class="label label-primary">Primary</span>
<span class="label label-success">Success</span>
<span class="label label-info">Info</span>
<span class="label label-warning">Warning</span>
<span class="label label-danger">Danger</span>
{% endexample %}

<div class="bs-callout bs-callout-info">
  <h4>Have tons of labels?</h4>
  <p>Rendering problems can arise when you have dozens of inline labels within a narrow container, each containing its own <code>inline-block</code> element (like an icon). The way around this is setting <code>display: inline-block;</code>. For context and an example, <a href="https://github.com/twbs/bootstrap/issues/13219">see #13219</a>.</p>
</div>
