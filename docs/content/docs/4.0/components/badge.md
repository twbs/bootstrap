---
layout: docs
title: Badges
description: Documentation and examples for badges, our small count and labeling component.
menu:
  docs:
    name: Badge
    parent: components
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

{{< highlight html >}}
<h1>Example heading <span class="badge badge-secondary">New</span></h1>
<h2>Example heading <span class="badge badge-secondary">New</span></h2>
<h3>Example heading <span class="badge badge-secondary">New</span></h3>
<h4>Example heading <span class="badge badge-secondary">New</span></h4>
<h5>Example heading <span class="badge badge-secondary">New</span></h5>
<h6>Example heading <span class="badge badge-secondary">New</span></h6>
{{< /highlight >}}

Badges can be used as part of links or buttons to provide a counter.

{{< example html >}}
<button type="button" class="btn btn-primary">
  Notifications <span class="badge badge-light">4</span>
</button>
{{< /example >}}

Note that depending on how they are used, badges may be confusing for users of screen readers and similar assistive technologies. While the styling of badges provides a visual cue as to their purpose, these users will simply be presented with the content of the badge. Depending on the specific situation, these badges may seem like random additional words or numbers at the end of a sentence, link, or button.

Unless the context is clear (as with the "Notifications" example, where it is understood that the "4" is the number of notifications), consider including additional context with a visually hidden piece of additional text.

{{< example html >}}
<button type="button" class="btn btn-primary">
  Profile <span class="badge badge-light">9</span>
  <span class="sr-only">unread messages</span>
</button>
{{< /example >}}

## Contextual variations

Add any of the below mentioned modifier classes to change the appearance of a badge.

{{< example html >}}
{% for color in .Site.Data.theme-colors %}
<span class="badge badge-{{ color.name }}">{{ color.name | capitalize }}</span>{% endfor %}
{{< /example >}}

{{< callout warning >}}
{{< partial "callout-warning-color-assistive-technologies.md" >}}
{{< /callout >}}

## Pill badges

Use the `.badge-pill` modifier class to make badges more rounded (with a larger `border-radius` and additional horizontal `padding`). Useful if you miss the badges from v3.

{{< example html >}}
{% for color in .Site.Data.theme-colors %}
<span class="badge badge-pill badge-{{ color.name }}">{{ color.name | capitalize }}</span>{% endfor %}
{{< /example >}}

## Links

Using the contextual `.badge-*` classes on an `<a>` element quickly provide _actionable_ badges with hover and focus states.

{{< example html >}}
{% for color in .Site.Data.theme-colors %}
<a href="#" class="badge badge-{{ color.name }}">{{ color.name | capitalize }}</a>{% endfor %}
{{< /example >}}
