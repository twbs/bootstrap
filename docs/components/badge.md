---
layout: docs
title: Badges
description: Documentation and examples for badges, our small count and labeling component.
group: components
---

Small and adaptive tag for adding context to just about any content. Use with background utilities to mix and match colors as you need them.

## Contents

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## Example

Badges scale to match the size of the immediate parent element by using relative font sizing and `em` units.

{% example html %}
<h1>Example heading <span class="badge bg-gray">New</span></h1>
<h2>Example heading <span class="badge bg-gray">New</span></h2>
<h3>Example heading <span class="badge bg-gray">New</span></h3>
<h4>Example heading <span class="badge bg-gray">New</span></h4>
<h5>Example heading <span class="badge bg-gray">New</span></h5>
<h6>Example heading <span class="badge bg-gray">New</span></h6>
{% endexample %}

## Contextual variations

Add any of the below mentioned modifier classes to change the appearance of a badge. **Note the addition of `.text-gray` on the badge with `.bg-white`.**

{% example html %}
{% for color in site.data.colors %}
<span class="badge bg-{{ color.name }}{% if color.name == "white" %} text-gray{% endif %}">{{ color.name | capitalize }}</span>{% endfor %}
{% endexample %}

{% capture callout-include %}{% include callout-warning-color-assistive-technologies.md %}{% endcapture %}
{{ callout-include | markdownify }}

## Pill badges

Use the `.badge-pill` modifier class to make badges more rounded (with a larger `border-radius` and additional horizontal `padding`). Useful if you miss the badges from v3.

{% example html %}
{% for color in site.data.colors %}
<span class="badge badge-pill bg-{{ color.name }}{% if color.name == "white" %} text-gray{% endif %}">{{ color.name | capitalize }}</span>{% endfor %}
{% endexample %}

## Links

Using the `.badge` classes with the `<a>` element quickly provide _actionable_ badges with hover states.

{% example html %}
{% for color in site.data.colors %}
<a href="#" class="badge bg-{{ color.name }}{% if color.name == "white" %} text-gray{% endif %}">{{ color.name | capitalize }}</a>{% endfor %}
{% endexample %}
