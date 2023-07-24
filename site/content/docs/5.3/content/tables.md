---
layout: docs
title: Tables
description: Documentation and examples for opt-in styling of tables (given their prevalent use in JavaScript plugins) with Bootstrap.
group: content
toc: true
---

## Overview

Due to the widespread use of `<table>` elements across third-party widgets like calendars and date pickers, Bootstrap's tables are **opt-in**. Add the base class `.table` to any `<table>`, then extend with our optional modifier classes or custom styles. All table styles are not inherited in Bootstrap, meaning any nested tables can be styled independent from the parent.

Using the most basic table markup, here's how `.table`-based tables look in Bootstrap.

{{< table class="table" simplified="false" >}}

## Variants

Use contextual classes to color tables, table rows or individual cells.

{{< callout info >}}
**Heads up!** Because of the more complicated CSS used to generate our table variants, they most likely won't see color mode adaptive styling until v6.
{{< /callout >}}

{{< example show_markup=false >}}
<table class="table">
  <thead>
    <tr>
      <th scope="col">Class</th>
      <th scope="col">Heading</th>
      <th scope="col">Heading</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Default</th>
      <td>Cell</td>
      <td>Cell</td>
    </tr>
    {{< table.inline >}}
    {{- range (index $.Site.Data "theme-colors") }}
    <tr class="table-{{ .name }}">
      <th scope="row">{{ .name | title }}</th>
      <td>Cell</td>
      <td>Cell</td>
    </tr>
    {{- end -}}
    {{< /table.inline >}}
  </tbody>
</table>
{{< /example >}}

{{< highlight html >}}
<!-- On tables -->{{< table.inline >}}
{{- range (index $.Site.Data "theme-colors") }}
<table class="table-{{ .name }}">...</table>
{{- end -}}
{{< /table.inline >}}

<!-- On rows -->{{< table.inline >}}
{{- range (index $.Site.Data "theme-colors") }}
<tr class="table-{{ .name }}">...</tr>
{{- end -}}
{{< /table.inline >}}

<!-- On cells (`td` or `th`) -->
<tr>{{< table.inline >}}
{{- range (index $.Site.Data "theme-colors") }}
  <td class="table-{{ .name }}">...</td>
{{- end -}}
{{< /table.inline >}}
</tr>
{{< /highlight >}}

{{< callout info >}}
{{< partial "callouts/warning-color-assistive-technologies.md" >}}
{{< /callout >}}

## Accented tables

### Striped rows

Use `.table-striped` to add zebra-striping to any table row within the `<tbody>`.

{{< table class="table table-striped" >}}

### Striped columns

Use `.table-striped-columns` to add zebra-striping to any table column.

{{< table class="table table-striped-columns" >}}

These classes can also be added to table variants:

{{< table class="table table-dark table-striped" >}}

{{< table class="table table-dark table-striped-columns" >}}

{{< table class="table table-success table-striped" >}}

{{< table class="table table-success table-striped-columns" >}}

### Hoverable rows

Add `.table-hover` to enable a hover state on table rows within a `<tbody>`.

{{< table class="table table-hover" >}}

{{< table class="table table-dark table-hover" >}}

These hoverable rows can also be combined with the striped rows variant:

{{< table class="table table-striped table-hover" >}}

### Active tables

Highlight a table row or cell by adding a `.table-active` class.

{{< example skip=tr >}}
<table class="table">
  <thead>
    <skip>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </skip>
  </thead>
  <tbody>
    <skip class="table-active">
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </skip>
    <skip>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </skip>
    <tr>
      <th scope="row">3</th>
      <td colspan="2" class="table-active">Larry the Bird</td>
      <td>@twitter</td>
    </tr>
  </tbody>
</table>
{{< /example >}}

{{< example skip=tr >}}
<table class="table table-dark">
  <thead>
    <skip>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </skip>
  </thead>
  <tbody>
    <skip class="table-active">
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </skip>
    <skip>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </skip>
    <tr>
      <th scope="row">3</th>
      <td colspan="2" class="table-active">Larry the Bird</td>
      <td>@twitter</td>
    </tr>
  </tbody>
</table>
{{< /example >}}

## How do the variants and accented tables work?

For the accented tables ([striped rows](#striped-rows), [striped columns](#striped-columns), [hoverable rows](#hoverable-rows), and [active tables](#active-tables)), we used some techniques to make these effects work for all our [table variants](#variants):

- We start by setting the background of a table cell with the `--bs-table-bg` custom property. All table variants then set that custom property to colorize the table cells. This way, we don't get into trouble if semi-transparent colors are used as table backgrounds.
- Then we add an inset box shadow on the table cells with `box-shadow: inset 0 0 0 9999px var(--bs-table-bg-state, var(--bs-table-bg-type, var(--bs-table-accent-bg)));` to layer on top of any specified `background-color`. It uses custom cascade to override the `box-shadow`, regardless the CSS specificity. Because we use a huge spread and no blur, the color will be monotone. Since `--bs-table-accent-bg` is set to `transparent` by default, we don't have a default box shadow.
- When either `.table-striped`, `.table-striped-columns`, `.table-hover` or `.table-active` classes are added, either `--bs-table-bg-type` or `--bs-table-bg-state` (by default set to `initial`) are set to a semitransparent color (`--bs-table-striped-bg`, `--bs-table-active-bg` or `--bs-table-hover-bg`) to colorize the background and override default `--bs-table-accent-bg`.
- For each table variant, we generate a `--bs-table-accent-bg` color with the highest contrast depending on that color. For example, the accent color for `.table-primary` is darker while `.table-dark` has a lighter accent color.
- Text and border colors are generated the same way, and their colors are inherited by default.

Behind the scenes it looks like this:

{{< scss-docs name="table-variant" file="scss/mixins/_table-variants.scss" >}}

## Table borders

### Bordered tables

Add `.table-bordered` for borders on all sides of the table and cells.

{{< table class="table table-bordered" >}}

[Border color utilities]({{< docsref "/utilities/borders#border-color" >}}) can be added to change colors:

{{< table class="table table-bordered border-primary" >}}

### Tables without borders

Add `.table-borderless` for a table without borders.

{{< table class="table table-borderless" >}}

{{< table class="table table-dark table-borderless" >}}

## Small tables

Add `.table-sm` to make any `.table` more compact by cutting all cell `padding` in half.

{{< table class="table table-sm" >}}

{{< table class="table table-dark table-sm" >}}

## Table group dividers

Add a thicker border, darker between table groups—`<thead>`, `<tbody>`, and `<tfoot>`—with `.table-group-divider`. Customize the color by changing the `border-top-color` (which we don't currently provide a utility class for at this time).

{{< example skip=tr >}}
<table class="table">
  <thead>
    <skip>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </skip>
  </thead>
  <tbody class="table-group-divider">
    <skip>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </skip>
    <skip>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </skip>
    <skip>
      <th scope="row">3</th>
      <td colspan="2">Larry the Bird</td>
      <td>@twitter</td>
    </skip>
  </tbody>
</table>
{{< /example >}}

## Vertical alignment

Table cells of `<thead>` are always vertical aligned to the bottom. Table cells in `<tbody>` inherit their alignment from `<table>` and are aligned to the top by default. Use the [vertical align]({{< docsref "/utilities/vertical-align" >}}) classes to re-align where needed.

{{< example skip=tr >}}
<div class="table-responsive">
  <table class="table align-middle">
    <thead>
      <skip>
        <th scope="col" class="w-25">Heading 1</th>
        <th scope="col" class="w-25">Heading 2</th>
        <th scope="col" class="w-25">Heading 3</th>
        <th scope="col" class="w-25">Heading 4</th>
      </skip>
    </thead>
    <tbody>
      <skip>
        <td>This cell inherits <code>vertical-align: middle;</code> from the table</td>
        <td>This cell inherits <code>vertical-align: middle;</code> from the table</td>
        <td>This cell inherits <code>vertical-align: middle;</code> from the table</td>
        <td>This here is some placeholder text, intended to take up quite a bit of vertical space, to demonstrate how the vertical alignment works in the preceding cells.</td>
      </skip>
      <skip class="align-bottom">
        <td>This cell inherits <code>vertical-align: bottom;</code> from the table row</td>
        <td>This cell inherits <code>vertical-align: bottom;</code> from the table row</td>
        <td>This cell inherits <code>vertical-align: bottom;</code> from the table row</td>
        <td>This here is some placeholder text, intended to take up quite a bit of vertical space, to demonstrate how the vertical alignment works in the preceding cells.</td>
      </skip>
      <tr>
        <td>This cell inherits <code>vertical-align: middle;</code> from the table</td>
        <td>This cell inherits <code>vertical-align: middle;</code> from the table</td>
        <td class="align-top">This cell is aligned to the top.</td>
        <td>This here is some placeholder text, intended to take up quite a bit of vertical space, to demonstrate how the vertical alignment works in the preceding cells.</td>
      </tr>
    </tbody>
  </table>
</div>
{{< /example >}}

## Nesting

Border styles, active styles, and table variants are not inherited by nested tables.

{{< example skip=tr >}}
<table class="table table-striped table-bordered">
  <thead>
    <skip>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </skip>
  </thead>
  <tbody>
    <skip>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </skip>
    <tr>
      <td colspan="4">
        <table class="table mb-0">
          <thead>
            <skip>
              <th scope="col">Header</th>
              <th scope="col">Header</th>
              <th scope="col">Header</th>
            </skip>
          </thead>
          <tbody>
            <skip>
              <th scope="row">A</th>
              <td>First</td>
              <td>Last</td>
            </skip>
            <skip>
              <th scope="row">B</th>
              <td>First</td>
              <td>Last</td>
            </skip>
            <skip>
              <th scope="row">C</th>
              <td>First</td>
              <td>Last</td>
            </skip>
          </tbody>
        </table>
      </td>
    </tr>
    <skip>
      <th scope="row">3</th>
      <td>Larry</td>
      <td>the Bird</td>
      <td>@twitter</td>
    </skip>
  </tbody>
</table>
{{< /example >}}

## How nesting works

To prevent _any_ styles from leaking to nested tables, we use the child combinator (`>`) selector in our CSS. Since we need to target all the `td`s and `th`s in the `thead`, `tbody`, and `tfoot`, our selector would look pretty long without it. As such, we use the rather odd looking `.table > :not(caption) > * > *` selector to target all `td`s and `th`s of the `.table`, but none of any potential nested tables.

Note that if you add `<tr>`s as direct children of a table, those `<tr>` will be wrapped in a `<tbody>` by default, thus making our selectors work as intended.

## Anatomy

### Table head

Similar to tables and dark tables, use the modifier classes `.table-light` or `.table-dark` to make `<thead>`s appear light or dark gray.

{{< example skip=tr >}}
<table class="table">
  <thead class="table-light">
    <skip>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </skip>
  </thead>
  <tbody>
    <skip>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </skip>
    <skip>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </skip>
    <skip>
      <th scope="row">3</th>
      <td>Larry</td>
      <td>the Bird</td>
      <td>@twitter</td>
    </skip>
  </tbody>
</table>
{{< /example >}}

{{< example skip=tr >}}
<table class="table">
  <thead class="table-dark">
    <skip>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </skip>
  </thead>
  <tbody>
    <skip>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </skip>
    <skip>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </skip>
    <skip>
      <th scope="row">3</th>
      <td>Larry</td>
      <td>the Bird</td>
      <td>@twitter</td>
    </skip>
  </tbody>
</table>
{{< /example >}}

### Table foot

{{< example skip=tr >}}
<table class="table">
  <thead class="table-light">
    <skip>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </skip>
  </thead>
  <tbody>
    <skip>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </skip>
    <skip>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </skip>
    <skip>
      <th scope="row">3</th>
      <td>Larry</td>
      <td>the Bird</td>
      <td>@twitter</td>
    </skip>
  </tbody>
  <tfoot>
    <skip>
      <td>Footer</td>
      <td>Footer</td>
      <td>Footer</td>
      <td>Footer</td>
    </skip>
  </tfoot>
</table>
{{< /example >}}

### Captions

A `<caption>` functions like a heading for a table. It helps users with screen readers to find a table and understand what it's about and decide if they want to read it.

{{< example skip=tr >}}
<table class="table">
  <caption>List of users</caption>
  <thead>
    <skip>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </skip>
  </thead>
  <tbody>
    <skip>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </skip>
    <skip>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </skip>
    <skip>
      <th scope="row">3</th>
      <td>Larry</td>
      <td>the Bird</td>
      <td>@twitter</td>
    </skip>
  </tbody>
</table>
{{< /example >}}

You can also put the `<caption>` on the top of the table with `.caption-top`.

{{< example skip=tr >}}
<table class="table caption-top">
  <caption>List of users</caption>
  <thead>
    <skip>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </skip>
  </thead>
  <tbody>
    <skip>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </skip>
    <skip>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </skip>
    <skip>
      <th scope="row">3</th>
      <td>Larry</td>
      <td>the Bird</td>
      <td>@twitter</td>
    </skip>
  </tbody>
</table>
{{< /example >}}

## Responsive tables

Responsive tables allow tables to be scrolled horizontally with ease. Make any table responsive across all viewports by wrapping a `.table` with `.table-responsive`. Or, pick a maximum breakpoint with which to have a responsive table up to by using `.table-responsive{-sm|-md|-lg|-xl|-xxl}`.

{{< callout warning >}}
##### Vertical clipping/truncation

Responsive tables make use of `overflow-y: hidden`, which clips off any content that goes beyond the bottom or top edges of the table. In particular, this can clip off dropdown menus and other third-party widgets.
{{< /callout >}}

### Always responsive

Across every breakpoint, use `.table-responsive` for horizontally scrolling tables.

{{< example skip=table >}}
<div class="table-responsive">
  <skip class="table">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Heading</th>
        <th scope="col">Heading</th>
        <th scope="col">Heading</th>
        <th scope="col">Heading</th>
        <th scope="col">Heading</th>
        <th scope="col">Heading</th>
        <th scope="col">Heading</th>
        <th scope="col">Heading</th>
        <th scope="col">Heading</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">1</th>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
      </tr>
      <tr>
        <th scope="row">2</th>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
      </tr>
      <tr>
        <th scope="row">3</th>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
      </tr>
    </tbody>
  </skip>
</div>
{{< /example >}}

### Breakpoint specific

Use `.table-responsive{-sm|-md|-lg|-xl|-xxl}` as needed to create responsive tables up to a particular breakpoint. From that breakpoint and up, the table will behave normally and not scroll horizontally.

**These tables may appear broken until their responsive styles apply at specific viewport widths.**

{{< example skip=table >}}
{{< table.inline >}}
{{ range $.Site.Data.breakpoints }}
{{ if not (eq .breakpoint "xs") }}
<div class="table-responsive{{ .abbr }}{{ if not (eq .breakpoint "xxl") }} mb-4{{ end }}">
  <skip class="table">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Heading</th>
        <th scope="col">Heading</th>
        <th scope="col">Heading</th>
        <th scope="col">Heading</th>
        <th scope="col">Heading</th>
        <th scope="col">Heading</th>
        <th scope="col">Heading</th>
        <th scope="col">Heading</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">1</th>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
      </tr>
      <tr>
        <th scope="row">2</th>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
      </tr>
      <tr>
        <th scope="row">3</th>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
      </tr>
    </tbody>
  </skip>
</div>
{{ end -}}
{{- end -}}
{{< /table.inline >}}
{{< /example >}}

## CSS

### Sass variables

{{< scss-docs name="table-variables" file="scss/_variables.scss" >}}

### Sass loops

{{< scss-docs name="table-loop" file="scss/_variables.scss" >}}

### Customizing

- The factor variables (`$table-striped-bg-factor`, `$table-active-bg-factor` & `$table-hover-bg-factor`) are used to determine the contrast in table variants.
- Apart from the light & dark table variants, theme colors are lightened by the `$table-bg-scale` variable.
