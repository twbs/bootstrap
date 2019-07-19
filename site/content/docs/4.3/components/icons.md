---
layout: docs
title: Icons
description: For the first time ever, Bootstrap features its own icon library, custom designed and built for our components and documentation.
group: components
toc: true
---

## Bootstrap icons

Meet the Bootstrap icons, a limited set of icons designed first and foremost to work with Bootstrap's components. From form controls to navigation, these icons are the perfect complement to our toolkit. They're SVGs, so they'll scale quickly and easily to any size, they can be easily recolored with CSS, and more. They're also included in Bootstrap under the MIT license.

<table class="table bd-bi-table">
  <thead class="text-left">
    <tr>
      <th>Name</th>
      <th>Icon</th>
      <th>Class</th>
    </tr>
  </thead>
  <tbody>
    {{< listIcons.inline >}}
    {{- $dirName := printf "site/content/docs/%s/icons/" .Site.Params.docs_version -}}

    {{- range (readDir $dirName) -}}
      {{- $filenameWithExt := split .Name "." -}}
      {{- $filename := index $filenameWithExt 0 -}}
      {{- $name := humanize $filename -}}
        <tr>
          <td>{{ $name }}</td>
          <td>{{ readFile (printf "%s%s" $dirName .Name) }}</td>
          <td>
            <code>.bi-{{ $filename }}</code>
          </td>
        </tr>
    {{ end -}}
    {{< /listIcons.inline >}}
  </tbody>
</table>

## How to use

Bootstrap icons are SVGs, so you can include them into your HTML in a few ways depending on how your project is setup.

### Embedded

For example, you can use the SVG as HTML (remember to specify a `width` and `height`).

{{< example >}}
<svg class="bi bi-chevron-right" width="24" height="24" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 14l6-6-6-6"/></svg>
{{< /example >}}

### External image

Copy the Bootstrap icons SVGs to your directory of choice and reference them like normal images with the `<img>` element.

{{< highlight html >}}
<img src="assets/images/bi-bootstrap.svg" width="24" height="24" title="Bootstrap">
{{< /highlight >}}

### CSS

You can also use the SVG within your CSS (**be sure to escape any characters**, such as `#` to `%23` when specifying hex color values):

{{< highlight css >}}
.bi::before {
  display: inline-block;
  content: "";
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path fill='none' stroke='%23333' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 14l6-6-6-6'/></svg>");
  background-repeat: no-repeat;
  background-size: 1rem 1rem;
}
{{< /highlight >}}

### Customizing

Depending on the icon, you may add `.bi-light` (`1px`) or `.bi-bold` (`3px`) to make an icon's `stoke-width` lighter or bold. Most Bootstrap icons have a `2px` stroke.

{{< example >}}
<svg class="bi bi-resize bi-light" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 20 20"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2px" d="M11.5 8.5L15 5l-3.5 3.5zM12 4h4-4zm4 4V4v4zm-7.5 3.5L5 15l3.5-3.5zM8 16H4h4zm-4-4v4-4z"></path></svg>

<svg class="bi bi-resize" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 20 20"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2px" d="M11.5 8.5L15 5l-3.5 3.5zM12 4h4-4zm4 4V4v4zm-7.5 3.5L5 15l3.5-3.5zM8 16H4h4zm-4-4v4-4z"></path></svg>

<svg class="bi bi-resize bi-bold" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 20 20"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2px" d="M11.5 8.5L15 5l-3.5 3.5zM12 4h4-4zm4 4V4v4zm-7.5 3.5L5 15l3.5-3.5zM8 16H4h4zm-4-4v4-4z"></path></svg>
{{< /example >}}

Color can be changed by setting a `.text-*` class or custom CSS:

{{< example >}}
<div class="text-success">
  <svg class="bi bi-resize" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 20 20"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2px" d="M11.5 8.5L15 5l-3.5 3.5zM12 4h4-4zm4 4V4v4zm-7.5 3.5L5 15l3.5-3.5zM8 16H4h4zm-4-4v4-4z"></path></svg>
</div>
{{< /example >}}

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
