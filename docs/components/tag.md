---
layout: docs
title: Tags
group: components
---

Small and adaptive tag for adding context to just about any content.

## Example

Tags scale to match the size of the immediate parent element by using relative font sizing and `em` units.

{% example html %}
<h1>Example heading <span class="tag tag-default">New</span></h1>
<h2>Example heading <span class="tag tag-default">New</span></h2>
<h3>Example heading <span class="tag tag-default">New</span></h3>
<h4>Example heading <span class="tag tag-default">New</span></h4>
<h5>Example heading <span class="tag tag-default">New</span></h5>
<h6>Example heading <span class="tag tag-default">New</span></h6>
{% endexample %}

## Contextual variations

Add any of the below mentioned modifier classes to change the appearance of a tag.

{% example html %}
<span class="tag tag-default">Default</span>
<span class="tag tag-primary">Primary</span>
<span class="tag tag-success">Success</span>
<span class="tag tag-info">Info</span>
<span class="tag tag-warning">Warning</span>
<span class="tag tag-danger">Danger</span>
{% endexample %}

{% capture callout-include %}{% include callout-warning-color-assistive-technologies.md %}{% endcapture %}
{{ callout-include | markdownify }}

## Pill tags

Use the `.tag-pill` modifier class to make tags more rounded (with a larger `border-radius` and additional horizontal `padding`). Useful if you miss the badges from v3.

{% example html %}
<span class="tag tag-pill tag-default">Default</span>
<span class="tag tag-pill tag-primary">Primary</span>
<span class="tag tag-pill tag-success">Success</span>
<span class="tag tag-pill tag-info">Info</span>
<span class="tag tag-pill tag-warning">Warning</span>
<span class="tag tag-pill tag-danger">Danger</span>
{% endexample %}
