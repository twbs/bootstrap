---
layout: docs
title: Badges
description: Documentation and examples for badges, our small count and labelling component.
group: components
---

Small and adaptive tag for adding context to just about any content.

## Contents

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## Example

Badges scale to match the size of the immediate parent element by using relative font sizing and `em` units.

{% example html %}
<h1>Example heading <span class="badge badge-default">New</span></h1>
<h2>Example heading <span class="badge badge-default">New</span></h2>
<h3>Example heading <span class="badge badge-default">New</span></h3>
<h4>Example heading <span class="badge badge-default">New</span></h4>
<h5>Example heading <span class="badge badge-default">New</span></h5>
<h6>Example heading <span class="badge badge-default">New</span></h6>
{% endexample %}

## Contextual variations

Add any of the below mentioned modifier classes to change the appearance of a badge.

{% example html %}
<span class="badge badge-default">Default</span>
<span class="badge badge-primary">Primary</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-info">Info</span>
<span class="badge badge-warning">Warning</span>
<span class="badge badge-danger">Danger</span>
{% endexample %}

{% capture callout-include %}{% include callout-warning-color-assistive-technologies.md %}{% endcapture %}
{{ callout-include | markdownify }}

## Pill badges

Use the `.badge-pill` modifier class to make badges more rounded (with a larger `border-radius` and additional horizontal `padding`). Useful if you miss the badges from v3.

{% example html %}
<span class="badge badge-pill badge-default">Default</span>
<span class="badge badge-pill badge-primary">Primary</span>
<span class="badge badge-pill badge-success">Success</span>
<span class="badge badge-pill badge-info">Info</span>
<span class="badge badge-pill badge-warning">Warning</span>
<span class="badge badge-pill badge-danger">Danger</span>
{% endexample %}

## Links

Using the `.badge` classes with the `<a>` element quickly provide _actionable_ badges with hover and focus states.

{% example html %}
<a href="#" class="badge badge-default">Default</a>
<a href="#" class="badge badge-primary">Primary</a>
<a href="#" class="badge badge-success">Success</a>
<a href="#" class="badge badge-info">Info</a>
<a href="#" class="badge badge-warning">Warning</a>
<a href="#" class="badge badge-danger">Danger</a>
{% endexample %}
