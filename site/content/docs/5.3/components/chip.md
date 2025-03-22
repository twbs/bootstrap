---
layout: docs
title: Chips
description: Use chips to convey information, apply filters or display a selection of items.
group: components
toc: true
added: "5.3"
---

## Examples

A chip is basically a `<span>` that can contain text, and optionally an image and/or a close button. Please **adapt the HTML** to be semantically correct.

{{< callout warning >}}
You shouldn't mix the different chips versions in the same area since they look the same and have different behaviors.
{{< /callout >}}

### Informative

Informative chips are built on top of `<span>` and are usually used to display categories. They have no specific interaction.

For a list of chips of an article, for example, add a heading (`<h1>–<h6>`) to explain that we are in a chips list and use `<ul>` or `<ol>` depending on the use case.

{{< example >}}
<ul class="list-unstyled m-0 d-flex gap-2 flex-wrap m-0">
  <li><span class="chip">Bird</span></li>
  <li>
    <span class="chip">
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><path d='M32 7a13 13 0 01-3.8 1.1 6.6 6.6 0 003-3.6c-1.4.7-2.8 1.3-4.3 1.6a6.6 6.6 0 00-11.1 6A18.6 18.6 0 012.2 5a6.6 6.6 0 002 8.9c-1 0-2-.4-3-.9v.1c0 3.2 2.4 5.9 5.4 6.5a6.6 6.6 0 01-3 0 6.6 6.6 0 006.1 4.6A13.2 13.2 0 010 27.1a18.6 18.6 0 0028.7-16.6C30 9.5 31.1 8.4 32 7z'/></svg>
      Twitter
    </span>
  </li>
</ul>
{{< /example >}}

### Filter

A chip can be actionable either when built on top of a `<button>` or a `<label>`. These `<label>`s are based on either checkboxes or radios `<input>`. These chips are usually used as filters and have an `.active` state.

Most of the time, chips must be inside a list (`<ul>` or `<ol>`).

{{< example >}}
<ul class="list-unstyled d-flex gap-2 flex-wrap m-0">
  <li>
    <input type="checkbox" class="btn-check" id="btncheck-mobile" autocomplete="off">
    <label class="chip" for="btncheck-mobile"><span class="visually-hidden">Filter by</span>Mobile</label>
  </li>
  <li>
    <input type="checkbox" class="btn-check" id="btncheck-tv" autocomplete="off" checked>
    <label class="chip" for="btncheck-tv">
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path d="M2.5 13.5A.5.5 0 0 1 3 13h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zM13.991 3l.024.001a1.46 1.46 0 0 1 .538.143.757.757 0 0 1 .302.254c.067.1.145.277.145.602v5.991l-.001.024a1.464 1.464 0 0 1-.143.538.758.758 0 0 1-.254.302c-.1.067-.277.145-.602.145H2.009l-.024-.001a1.464 1.464 0 0 1-.538-.143.758.758 0 0 1-.302-.254C1.078 10.502 1 10.325 1 10V4.009l.001-.024a1.46 1.46 0 0 1 .143-.538.758.758 0 0 1 .254-.302C1.498 3.078 1.675 3 2 3h11.991zM14 2H2C0 2 0 4 0 4v6c0 2 2 2 2 2h12c2 0 2-2 2-2V4c0-2-2-2-2-2z"/>
      </svg>
      <span class="visually-hidden">Filter by</span>TV
    </label>
  </li>
</ul>
{{< /example >}}

If the chip filter triggers some action, you should use the version built on top of a `<button>`.
The text of the button must be clear enough to explain the function.

{{< example >}}
<ul class="list-unstyled d-flex gap-2 flex-wrap m-0">
  <li><button class="chip"><span class="visually-hidden">Filter by</span>Mobile</button></li>
  <li>
    <button class="chip active">
      <svg width="1.5rem" height="1.5rem" viewBox="0 0 1000 1000" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M75,200V720H225v80H775V720H925V200H75ZM500,755a30,30,0,1,1,30-30A30,30,0,0,1,500,755Zm365-95H135V260H865V660Z"></path>
      </svg>
      <span class="visually-hidden">Filter by</span>TV
    </button>
  </li>
</ul>
{{< /example >}}

### Navigation

Another way to build actionable chips is to build them on top of `<a>`. These kind of chips are usually used as anchor links.

Put an explicit heading to add semantics. The text of the link must be clear enough to explain the destination of the chip.
Most of the time, chips must be inside a list (`<ul>` or `<ol>`).

{{< example >}}
<ol class="list-unstyled d-flex gap-2 flex-wrap m-0">
  <li><a class="chip" href="#">1. Introduction</a></li>
  <li><a class="chip" href="#">2. Exposure</a></li>
</ol>
{{< /example >}}

### Input

This kind of chips are built on `<span>`.

For a list of selected items use `<ul>` or `<ol>`.

{{< example class="d-flex gap-2 align-items-center" >}}
<ul class="list-unstyled d-flex gap-2 flex-wrap m-0">
  <li><span class="chip" id="chip-label1">
    Dismissible chip
    <button type="button" class="btn-close" aria-labelledby="chip-label1" aria-label="Close"></button>
  </span></li>
  <li><span class="chip" id="chip-label2">
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5z"/>
      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
    </svg>
    Dismissible chip
    <button type="button" class="btn-close" aria-labelledby="chip-label2" aria-label="Close"></button>
  </span></li>
</ul>
{{< /example >}}

## Sizes

{{< callout info >}}
We add an extra `<p>` around the `<span>` here for accessibility concerns.
{{< /callout >}}

Add `.chip-sm` to the `.chip` for a small variant.

{{< example class="d-flex gap-2 align-items-center" >}}
<h3 class="visually-hidden">Small chip variant</h3>
<p class="mb-0"><span class="chip chip-sm">Informative</span></p>
<button class="chip chip-sm">Filter</button>
<a class="chip chip-sm" href="#">Navigation</a>
<p><span class="chip chip-sm" id="chip-label4">
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5z"/>
    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
  </svg>
  Input
  <button type="button" class="btn-close" aria-labelledby="chip-label4" aria-label="Close"></button>
</span></p>
{{< /example >}}

## Disabled state

{{< callout info >}}
We add an extra `<p>` around the `<span>` here for accessibility concerns.
{{< /callout >}}

Add `.disabled` to the `.chip` for a disabled variant. Don't forget to add `aria-disabled` to `<span>` and `disabled` attribute to `<button>`.

Disabled chips using the `<a>` element behave a bit different:

- `<a>`s don't support the `disabled` attribute, so you must add the `.disabled` class to make it visually appear disabled.
- Some future-friendly styles are included to disable all `pointer-events` on anchor chips.
- Disabled chips using `<a>` should include the `aria-disabled="true"` attribute to indicate the state of the element to assistive technologies.
- Disabled chips using `<a>` *should not* include the `href` attribute.

{{< example class="d-flex gap-2 align-items-center" >}}
<h3 class="visually-hidden">Disabled chips for the different variants</h3>
<p class="mb-0"><span class="chip disabled" aria-disabled="true">Informative</span></p>
<button class="chip" disabled>Filter</button>
<a class="chip disabled" aria-disabled="true">Navigation</a>
<p><span class="chip disabled" id="chip-label5" aria-disabled="true">
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5z"/>
    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
  </svg>
  Input
  <button type="button" class="btn-close" aria-labelledby="chip-label5" aria-label="Close"></button>
</span></p>
{{< /example >}}

## Rounded chips

Use the `.rounded-pill` utility class to make chips more rounded with a larger `border-radius`.

{{< example class="d-flex gap-2 align-items-center" >}}
<h3 class="visually-hidden">Rounded chip variant</h3>
<p class="mb-0"><span class="chip rounded-pill">Informative</span></p>
<button class="chip rounded-pill">Filter</button>
<a class="chip chip rounded-pill" href="#">Navigation</a>
<p><span class="chip chip rounded-pill" id="chip-label6">
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5z"/>
    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
  </svg>
  Input
  <button type="button" class="btn-close" aria-labelledby="chip-label6" aria-label="Close"></button>
</span></p>
{{< /example >}}

## CSS

### Variables

Values for the CSS variables are set via Sass, so Sass customization is still supported, too.

{{< scss-docs name="chip-css-vars" file="scss/_chip.scss" >}}

Customization through CSS variables can be seen on the `.chip-sm` class where we override specific values without adding duplicate CSS selectors.

{{< scss-docs name="chip-sm-css-vars" file="scss/_chip.scss" >}}

### Sass Variables

Variables for all chips:

{{< scss-docs name="chip-variables" file="scss/_variables.scss" >}}

Variables for the [small chip](#sizes):

{{< scss-docs name="chip-sm-variables" file="scss/_variables.scss" >}}
