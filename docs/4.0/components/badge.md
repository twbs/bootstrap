---
layout: docs
title: Badges
description: Documentation and examples for badges, our small count and labeling component.
group: components
toc: true
---

## Example

Badges scale to match the size of the immediate parent element by using relative font sizing and `em` units.

<div class="bd-example">
<div class="h1">Example heading <span class="badge badge-secondary">New</span></div>
<div class="h2">Example heading <span class="badge badge-secondary">New</span></div>
<div class="h3">Example heading <span class="badge badge-secondary">New</span></div>
<div class="h4">Example heading <span class="badge badge-secondary">New</span></div>
<div class="h5">Example heading <span class="badge badge-secondary">New</span></div>
<div class="h6">Example heading <span class="badge badge-secondary">New</span></div>
</div>

{% highlight html %}
<h1>Example heading <span class="badge badge-secondary">New</span></h1>
<h2>Example heading <span class="badge badge-secondary">New</span></h2>
<h3>Example heading <span class="badge badge-secondary">New</span></h3>
<h4>Example heading <span class="badge badge-secondary">New</span></h4>
<h5>Example heading <span class="badge badge-secondary">New</span></h5>
<h6>Example heading <span class="badge badge-secondary">New</span></h6>
{% endhighlight %}

## Contextual variations

Add any of the below mentioned modifier classes to change the appearance of a badge.

{% example html %}
{% for color in site.data.theme-colors %}
<span class="badge badge-{{ color.name }}">{{ color.name | capitalize }}</span>{% endfor %}
{% endexample %}

{% capture callout-include %}{% include callout-warning-color-assistive-technologies.md %}{% endcapture %}
{{ callout-include | markdownify }}

## Pill badges

Use the `.badge-pill` modifier class to make badges more rounded (with a larger `border-radius` and additional horizontal `padding`). Useful if you miss the badges from v3.

{% example html %}
{% for color in site.data.theme-colors %}
<span class="badge badge-pill badge-{{ color.name }}">{{ color.name | capitalize }}</span>{% endfor %}
{% endexample %}

## Links

Using the `.badge` classes with the `<a>` element quickly provide _actionable_ badges with hover and focus states.

{% example html %}
{% for color in site.data.theme-colors %}
<a href="#" class="badge badge-{{ color.name }}">{{ color.name | capitalize }}</a>{% endfor %}
{% endexample %}
