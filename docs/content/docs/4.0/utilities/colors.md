---
layout: docs
title: Colors
description: Convey meaning through color with a handful of color utility classes. Includes support for styling links with hover states, too.
menu:
  docs:
    parent: utilities
toc: true
---

## Color

{{< example html >}}
{% for color in .Site.Data.theme-colors %}
<p class="text-{{ color.name }}{% if color.name == "light" %} bg-dark{{ end }}">.text-{{ color.name }}</p>{% endfor %}
<p class="text-muted">.text-muted</p>
<p class="text-white bg-dark">.text-white</p>
{{< /example >}}

Contextual text classes also work well on anchors with the provided hover and focus states. **Note that the `.text-white` and `.text-muted` class has no link styling.**

{{< example html >}}
{% for color in .Site.Data.theme-colors %}
<p><a href="#" class="text-{{ color.name }}{% if color.name == "light" %} bg-dark{{ end }}">{{ color.name | capitalize }} link</a></p>{% endfor %}
<p><a href="#" class="text-muted">Muted link</a></p>
<p><a href="#" class="text-white bg-dark">White link</a></p>
{{< /example >}}

## Background color

Similar to the contextual text color classes, easily set the background of an element to any contextual class. Anchor components will darken on hover, just like the text classes. Background utilities **do not set `color`**, so in some cases you'll want to use `.text-*` utilities.

{{< example html >}}
{% for color in .Site.Data.theme-colors %}
<div class="p-3 mb-2 bg-{{ color.name }} {% if color.name == "light" or color.name == "warning" %}text-dark{% else %}text-white{% endif %}">.bg-{{ color.name }}</div>{% endfor %}
<div class="p-3 mb-2 bg-white text-dark">.bg-white</div>
{{< /example >}}

## Background gradient

When `$enable-gradients` is set to true, you'll be able to use `.bg-gradient-` utility classes. **By default, `$enable-gradients` is disabled and the example below is intentionally broken.** This is done for easier customization from the moment you start using Bootstrap. [Learn about our Sass options]({{ .Site.BaseURL }}/docs/{{ .Site.Params.docs_version }}/getting-started/theming/#sass-options) to enable these classes and more.

{{< example html >}}
{% for color in .Site.Data.theme-colors %}
<div class="p-3 mb-2 bg-gradient-{{ color.name }} {% if color.name == "light" or color.name == "warning" %}text-dark{% else %}text-white{% endif %}">.bg-gradient-{{ color.name }}</div>{% endfor %}
{{< /example >}}

{{< callout info >}}
#### Dealing with specificity

Sometimes contextual classes cannot be applied due to the specificity of another selector. In some cases, a sufficient workaround is to wrap your element's content in a `<div>` with the class.
{{< /callout >}}

{{< callout warning >}}
{{< partial "callout-warning-color-assistive-technologies.md" >}}
{{< /callout >}}
