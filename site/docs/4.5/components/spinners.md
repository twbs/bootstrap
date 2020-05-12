---
layout: docs
title: Spinners
description: Indicate the loading state of a component or page with Bootstrap spinners, built entirely with HTML, CSS, and no JavaScript.
group: components
toc: true
---

## About

Bootstrap "spinners" can be used to show the loading state in your projects. They're built only with HTML and CSS, meaning you don't need any JavaScript to create them. You will, however, need some custom JavaScript to toggle their visibility. Their appearance, alignment, and sizing can be easily customized with our amazing utility classes.

For accessibility purposes, each loader here includes `role="status"` and a nested `<span class="sr-only">Loading...</span>`.

## Border spinner

Use the border spinners for a lightweight loading indicator.

{% capture example %}
<div class="spinner-border" role="status">
  <span class="sr-only">Loading...</span>
</div>
{% endcapture %}
{% include example.html content=example %}

### Colors

The border spinner uses `currentColor` for its `border-color`, meaning you can customize the color with [text color utilities][color]. You can use any of our text color utilities on the standard spinner.

{% capture example %}
{% for color in site.data.theme-colors %}
<div class="spinner-border text-{{ color.name }}" role="status">
  <span class="sr-only">Loading...</span>
</div>{% endfor %}
{% endcapture %}
{% include example.html content=example %}

{% capture callout %}
**Why not use `border-color` utilities?** Each border spinner specifies a `transparent` border for at least one side, so `.border-{color}` utilities would override that.
{% endcapture %}
{% include callout.html content=callout type="info" %}

## Growing spinner

If you don't fancy a border spinner, switch to the grow spinner. While it doesn't technically spin, it does repeatedly grow!

{% capture example %}
<div class="spinner-grow" role="status">
  <span class="sr-only">Loading...</span>
</div>
{% endcapture %}
{% include example.html content=example %}

Once again, this spinner is built with `currentColor`, so you can easily change its appearance with [text color utilities][color]. Here it is in blue, along with the supported variants.

{% capture example %}
{% for color in site.data.theme-colors %}
<div class="spinner-grow text-{{ color.name }}" role="status">
  <span class="sr-only">Loading...</span>
</div>{% endfor %}
{% endcapture %}
{% include example.html content=example %}

## Alignment

Spinners in Bootstrap are built with `rem`s, `currentColor`, and `display: inline-flex`. This means they can easily be resized, recolored, and quickly aligned.

### Margin

Use [margin utilities][margin] like `.m-5` for easy spacing.

{% capture example %}
<div class="spinner-border m-5" role="status">
  <span class="sr-only">Loading...</span>
</div>
{% endcapture %}
{% include example.html content=example %}

### Placement

Use [flexbox utilities][flex], [float utilities][float], or [text alignment][text] utilities to place spinners exactly where you need them in any situation.

#### Flex

{% capture example %}
<div class="d-flex justify-content-center">
  <div class="spinner-border" role="status">
    <span class="sr-only">Loading...</span>
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}

{% capture example %}
<div class="d-flex align-items-center">
  <strong>Loading...</strong>
  <div class="spinner-border ml-auto" role="status" aria-hidden="true"></div>
</div>
{% endcapture %}
{% include example.html content=example %}

#### Floats

{% capture example %}
<div class="clearfix">
  <div class="spinner-border float-right" role="status">
    <span class="sr-only">Loading...</span>
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}

#### Text align

{% capture example %}
<div class="text-center">
  <div class="spinner-border" role="status">
    <span class="sr-only">Loading...</span>
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}

## Size

Add `.spinner-border-sm` and `.spinner-grow-sm` to make a smaller spinner that can quickly be used within other components.

{% capture example %}
<div class="spinner-border spinner-border-sm" role="status">
  <span class="sr-only">Loading...</span>
</div>
<div class="spinner-grow spinner-grow-sm" role="status">
  <span class="sr-only">Loading...</span>
</div>
{% endcapture %}
{% include example.html content=example %}

Or, use custom CSS or inline styles to change the dimensions as needed.

{% capture example %}
<div class="spinner-border" style="width: 3rem; height: 3rem;" role="status">
  <span class="sr-only">Loading...</span>
</div>
<div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
  <span class="sr-only">Loading...</span>
</div>
{% endcapture %}
{% include example.html content=example %}

## Buttons

Use spinners within buttons to indicate an action is currently processing or taking place. You may also swap the text out of the spinner element and utilize button text as needed.

{% capture example %}
<button class="btn btn-primary" type="button" disabled>
  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  <span class="sr-only">Loading...</span>
</button>
<button class="btn btn-primary" type="button" disabled>
  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  Loading...
</button>
{% endcapture %}
{% include example.html content=example %}

{% capture example %}
<button class="btn btn-primary" type="button" disabled>
  <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
  <span class="sr-only">Loading...</span>
</button>
<button class="btn btn-primary" type="button" disabled>
  <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
  Loading...
</button>
{% endcapture %}
{% include example.html content=example %}


[color]:   {{ site.baseurl }}/docs/{{ site.docs_version }}/utilities/colors/
[display]: {{ site.baseurl }}/docs/{{ site.docs_version }}/utilities/display/
[flex]:    {{ site.baseurl }}/docs/{{ site.docs_version }}/utilities/flex/
[float]:   {{ site.baseurl }}/docs/{{ site.docs_version }}/utilities/float/
[margin]:  {{ site.baseurl }}/docs/{{ site.docs_version }}/utilities/spacing/
[sizing]:  {{ site.baseurl }}/docs/{{ site.docs_version }}/utilities/sizing/
[text]:    {{ site.baseurl }}/docs/{{ site.docs_version }}/content/typography/
