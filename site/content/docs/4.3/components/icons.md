---
layout: docs
title: Icons
description: For the first time ever, Bootstrap features its own icon library, custom designed and built for our components and documentation.
group: components
toc: true
---

## Booticons

Meet the Booticons, a limited set of icons designed first and foremost to work with Bootstrap's components. From form controls to navigation, these icons are the perfect complement to our toolkit. They're SVGs, so they'll scale quickly and easily to any size, they can be easily recolored with CSS, and more. They're also included in Bootstrap under the MIT license.

<table class="table bd-booticons-table">
  <thead class="text-left">
    <tr>
      <th>Name</th>
      <th>Icon</th>
      <th>Class</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Chevron left</td>
      <td>
        <svg class="booticon booticon-chevron-left" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 2L5 8l6 6"/></svg>
      </td>
      <td>
        <code>.booticon-chevron-left</code>
      </td>
    </tr>
    <tr>
      <td>Chevron right</td>
      <td>
        <svg class="booticon booticon-chevron-right" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 14l6-6-6-6"/></svg>
      </td>
      <td>
        <code>.booticon-chevron-right</code>
      </td>
    </tr>
    <tr>
      <td>Chevron down</td>
      <td>
        <svg class="booticon booticon-chevron-down" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 5l6 6 6-6"/></svg>
      </td>
      <td>
        <code>.booticon-chevron-down</code>
      </td>
    </tr>
    <tr>
      <td>Chevron up</td>
      <td>
        <svg class="booticon booticon-chevron-up" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 11l6-6 6 6"/></svg>
      </td>
      <td>
        <code>.booticon-chevron-left</code>
      </td>
    </tr>
    <tr>
      <td>Chevron condensed left</td>
      <td>
        <svg class="booticon booticon-chevron-condensed-left" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 2L6 8l3 6"/></svg>
      </td>
      <td>
        <code>.booticon-chevron-condensed-left</code>
      </td>
    </tr>
    <tr>
      <td>Chevron condensed right</td>
      <td>
        <svg class="booticon booticon-chevron-condensed-right" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 14l3-6-3-6"/></svg>
      </td>
      <td>
        <code>.booticon-chevron-condensed-right</code>
      </td>
    </tr>
    <tr>
      <td>Check</td>
      <td>
        <svg class="booticon booticon-check" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8.5L6.5 11l6-6"/></svg>
      </td>
      <td>
        <code>.booticon-check</code>
      </td>
    </tr>
    <tr>
      <td>X</td>
      <td>
        <svg class="booticon booticon-x" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 8l-3 3 3-3 3 3-3-3zm0 0l3-3-3 3-3-3 3 3z"/></svg>
      </td>
      <td>
        <code>.booticon-x</code>
      </td>
    </tr>
    <tr>
      <td>Dash</td>
      <td>
        <svg class="booticon booticon-dash" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h6"/></svg>
      </td>
      <td>
        <code>.booticon-dash</code>
      </td>
    </tr>
    <tr>
      <td>Circle</td>
      <td>
        <svg class="booticon booticon-circle" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12zm0-2a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/></svg>
      </td>
      <td>
        <code>.booticon-circle</code>
      </td>
    </tr>
    <tr>
      <td>Dot</td>
      <td>
        <svg class="booticon booticon-dot" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 8v.082"/></svg>
      </td>
      <td>
        <code>.booticon-dot</code>
      </td>
    </tr>
  </tbody>
</table>

### How to use

Booticons are SVGs, so you can include them into your HTML in a few ways depending on how your project is setup.

For example, you can use the SVG as HTML (remember to specify a `width` and `height`).

{{< example >}}
<svg class="booticon booticon-chevron-right" width="24" height="24" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 14l6-6-6-6"/></svg>
{{< /example >}}

You can also use the SVG within your CSS (**be sure to escape any characters**, such as `#` to `%23` when specifying hex color values):

{{< highlight css >}}
.booticon::before {
  display: inline-block;
  content: "";
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path fill='none' stroke='%23333' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 14l6-6-6-6'/></svg>");
  background-repeat: no-repeat;
  background-size: 1rem 1rem;
}
{{< /highlight >}}

## Additional libraries

Need or want something else? Check out these recommended icon libraries. While most icon sets include multiple file formats, we prefer SVG implementations for their improved accessibility and vector support.

### Preferred

We've tested and used these icon sets ourselves.

- [Font Awesome](https://fontawesome.com/)
- [Feather](https://feathericons.com/)
- [Octicons](https://octicons.github.com/)

### More options

While we haven't tried these out, they do look promising and provide multiple formats—including SVG.

- [Bytesize](https://github.com/danklammer/bytesize-icons)
- [Google Material icons](https://material.io/tools/icons/)
- [Ionicons](https://ionicons.com/)
- [Dripicons](http://demo.amitjakhu.com/dripicons/)
- [Ikons](http://ikons.piotrkwiatkowski.co.uk/)
- [Glyph](https://glyph.smarticons.co/)
- [Icons8](https://icons8.com/)
- [icofont](https://icofont.com/)
