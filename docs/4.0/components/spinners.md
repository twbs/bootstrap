---
layout: docs
title: Spinners
description: Indicate the loading state of a component or page with Bootstrap spinners, built entirely with HTML, CSS, and no JavaScript.
group: components
toc: true
---

## About

Bootstrap "spinners" can be used to show the loading state in your projects. They're built only with HTML and CSS, meaning you don't need any JavaScript to create them. You will, however, need some custom JavaScript to toggle their visibility. They're appearance, alignment, and sizing can be easily customized with our amazing utility classes.

For accessibility purposes, each loader here includes `Loading...` text within. We account for this in our CSS, using a text hiding technique to prevent it from rendering on screen.

## Border spinner

Use the border spinners for a lightweight loading indicator.

{% example html %}
<div class="spinner-border">Loading...</div>
{% endexample %}

You can also reverse the spinner's border.

{% example html %}
<div class="spinner-border spinner-border-reverse">Loading...</div>
{% endexample %}

The border spinner uses `currentColor` for it's `border-color`, meaning you can customize the color with [text color utilities][color]. Here's the regular and reverse border spinner in blue, along with the supported variants.

<div class="bd-example">
  <div class="spinner-border text-primary">Loading...</div>
  <div class="spinner-border spinner-border-reverse text-primary">Loading...</div>
</div>

{% highlight html %}
{% for color in site.data.theme-colors %}
<div class="spinner-border text-{{ color.name }}">Loading...</div>{% endfor %}
{% endhighlight %}

{% callout info %}
**Why not use `border-color` utilities?** Each border spinner specifies a `transparent` border for at least one side, so `.border-{color}` utilities would override that.
{% endcallout %}

## Growing spinner

If you don't fancy a border spinner, switch to the grow spinner. While it doesn't technically spin, it does repeatedly grow!

{% example html %}
<div class="spinner-grow">Loading...</div>
{% endexample %}

Once again, this spinner is built with `currentColor`, so you can easily change it's appearance with [text color utilities][color]. Here it is in blue, along with the supported variants.

<div class="bd-example">
  <div class="spinner-grow text-primary">Loading...</div>
</div>

{% highlight html %}
{% for color in site.data.theme-colors %}
<div class="spinner-grow text-{{ color.name }}">Loading...</div>{% endfor %}
{% endhighlight %}

## Alignment

Spinners in Bootstrap are built with `rem`s, `currentColor`, and `display: inline-flex`. This means they can easily be resized, recolored, and quickly aligned.

### Margin

Use [margin utilities][margin] like `.m-5` for easy spacing.

{% example html %}
<div class="spinner-border m-5">Loading...</div>
<div class="spinner-border spinner-border-reverse m-5">Loading...</div>
{% endexample %}

### Placement

Use [flexbox utilities][flex], [float utilities][float], or [text alignment][text] utilities to place spinners exactly where you need them in any situation.

#### Flex

{% example html %}
<div class="d-flex justify-content-center">
  <div class="spinner-border">Loading...</div>
</div>
{% endexample %}

{% example html %}
<div class="d-flex align-items-center text-muted">
  <strong>Loading...</strong>
  <div class="spinner-border ml-auto"></div>
</div>
{% endexample %}

#### Floats

{% example html %}
<div class="clearfix">
  <div class="spinner-border float-right">Loading...</div>
</div>
{% endexample %}

#### Text align

{% example html %}
<div class="text-center">
  <div class="spinner-border">Loading...</div>
</div>
{% endexample %}

## Size

Use custom CSS or inline styles to change the dimensions as needed.

{% example html %}
<div class="spinner-border" style="width: 1rem; height: 1rem;">Loading...</div>
<div class="spinner-border spinner-border-reverse" style="width: 1rem; height: 1rem;">Loading...</div>
{% endexample %}

You can also use our `width` and `height` [sizing utilities][sizing] with a parent element that has some set dimensions.

{% example html %}
<div style="width: 200px; height: 200px;">
  <div class="spinner-border w-50 h-50">Loading...</div>
  <div class="spinner-border spinner-border-reverse w-50 h-50">Loading...</div>
</div>
{% endexample %}



[flex]:    {{ site.baseurl }}/docs/{{ site.docs_version }}/utilities/flexbox/
[sizing]:  {{ site.baseurl }}/docs/{{ site.docs_version }}/utilities/sizing/
[margin]:  {{ site.baseurl }}/docs/{{ site.docs_version }}/utilities/spacing/
[display]: {{ site.baseurl }}/docs/{{ site.docs_version }}/utilities/display/
[float]:   {{ site.baseurl }}/docs/{{ site.docs_version }}/utilities/float/
[text]:    {{ site.baseurl }}/docs/{{ site.docs_version }}/utilities/typography/
[color]:   {{ site.baseurl }}/docs/{{ site.docs_version }}/utilities/colors/
