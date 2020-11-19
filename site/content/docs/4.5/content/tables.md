---
layout: docs
title: Tables
description: Documentation and examples for opt-in styling of tables (given their prevalent use in JavaScript plugins) with Bootstrap.
group: content
toc: true
---

## Examples

Due to the widespread use of tables across third-party widgets like calendars and date pickers, we've designed our tables to be **opt-in**. Just add the base class `.table` to any `<table>`, then extend with custom styles or our various included modifier classes.

Using the most basic table markup, here's how `.table`-based tables look in Bootstrap. **All table styles are inherited in Bootstrap 4**, meaning any nested tables will be styled in the same manner as the parent.

{{< example >}}
<table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>Larry</td>
      <td>the Bird</td>
      <td>@twitter</td>
    </tr>
  </tbody>
</table>
{{< /example >}}

You can also invert the colors—with light text on dark backgrounds—with `.table-dark`.

{{< example >}}
<table class="table table-dark">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>Larry</td>
      <td>the Bird</td>
      <td>@twitter</td>
    </tr>
  </tbody>
</table>
{{< /example >}}

## Table head options

Similar to tables and dark tables, use the modifier classes `.thead-light` or `.thead-dark` to make `<thead>`s appear light or dark gray.

{{< example >}}
<table class="table">
  <thead class="thead-dark">
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>Larry</td>
      <td>the Bird</td>
      <td>@twitter</td>
    </tr>
  </tbody>
</table>

<table class="table">
  <thead class="thead-light">
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>Larry</td>
      <td>the Bird</td>
      <td>@twitter</td>
    </tr>
  </tbody>
</table>
{{< /example >}}

## Striped rows

Use `.table-striped` to add zebra-striping to any table row within the `<tbody>`.

{{< example >}}
<table class="table table-striped">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>Larry</td>
      <td>the Bird</td>
      <td>@twitter</td>
    </tr>
  </tbody>
</table>
{{< /example >}}

{{< example >}}
<table class="table table-striped table-dark">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>Larry</td>
      <td>the Bird</td>
      <td>@twitter</td>
    </tr>
  </tbody>
</table>
{{< /example >}}

## Bordered table

Add `.table-bordered` for borders on all sides of the table and cells.

{{< example >}}
<table class="table table-bordered">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td colspan="2">Larry the Bird</td>
      <td>@twitter</td>
    </tr>
  </tbody>
</table>
{{< /example >}}

{{< example >}}
<table class="table table-bordered table-dark">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td colspan="2">Larry the Bird</td>
      <td>@twitter</td>
    </tr>
  </tbody>
</table>
{{< /example >}}

## Borderless table

Add `.table-borderless` for a table without borders.

{{< example >}}
<table class="table table-borderless">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td colspan="2">Larry the Bird</td>
      <td>@twitter</td>
    </tr>
  </tbody>
</table>
{{< /example >}}

`.table-borderless` can also be used on dark tables.

{{< example >}}
<table class="table table-borderless table-dark">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td colspan="2">Larry the Bird</td>
      <td>@twitter</td>
    </tr>
  </tbody>
</table>
{{< /example >}}

## Hoverable rows

Add `.table-hover` to enable a hover state on table rows within a `<tbody>`.

{{< example >}}
<table class="table table-hover">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td colspan="2">Larry the Bird</td>
      <td>@twitter</td>
    </tr>
  </tbody>
</table>
{{< /example >}}

{{< example >}}
<table class="table table-hover table-dark">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td colspan="2">Larry the Bird</td>
      <td>@twitter</td>
    </tr>
  </tbody>
</table>
{{< /example >}}

## Small table

Add `.table-sm` to make tables more compact by cutting cell padding in half.

{{< example >}}
<table class="table table-sm">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td colspan="2">Larry the Bird</td>
      <td>@twitter</td>
    </tr>
  </tbody>
</table>
{{< /example >}}

{{< example >}}
<table class="table table-sm table-dark">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td colspan="2">Larry the Bird</td>
      <td>@twitter</td>
    </tr>
  </tbody>
</table>
{{< /example >}}

## Contextual classes

Use contextual classes to color table rows or individual cells.

<div class="bd-example">
  <table class="table">
    <thead>
      <tr>
        <th scope="col">Class</th>
        <th scope="col">Heading</th>
        <th scope="col">Heading</th>
      </tr>
    </thead>
    <tbody>
      <tr class="table-active">
        <th scope="row">Active</th>
        <td>Cell</td>
        <td>Cell</td>
      </tr>
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
</div>

{{< highlight html >}}
<!-- On rows -->
<tr class="table-active">...</tr>{{< table.inline >}}
{{- range (index $.Site.Data "theme-colors") }}
<tr class="table-{{ .name }}">...</tr>
{{- end -}}
{{< /table.inline >}}

<!-- On cells (`td` or `th`) -->
<tr>
  <td class="table-active">...</td>{{< table.inline >}}
{{- range (index $.Site.Data "theme-colors") }}
  <td class="table-{{ .name }}">...</td>
{{- end -}}
{{< /table.inline >}}
</tr>
{{< /highlight >}}

Regular table background variants are not available with the dark table, however, you may use [text or background utilities]({{< docsref "/utilities/colors" >}}) to achieve similar styles.

<div class="bd-example">
  <table class="table table-dark">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Heading</th>
        <th scope="col">Heading</th>
      </tr>
    </thead>
    <tbody>
      <tr class="bg-primary">
        <th scope="row">1</th>
        <td>Cell</td>
        <td>Cell</td>
      </tr>
      <tr>
        <th scope="row">2</th>
        <td>Cell</td>
        <td>Cell</td>
      </tr>
      <tr class="bg-success">
        <th scope="row">3</th>
        <td>Cell</td>
        <td>Cell</td>
      </tr>
      <tr>
        <th scope="row">4</th>
        <td>Cell</td>
        <td>Cell</td>
      </tr>
      <tr class="bg-info">
        <th scope="row">5</th>
        <td>Cell</td>
        <td>Cell</td>
      </tr>
      <tr>
        <th scope="row">6</th>
        <td>Cell</td>
        <td>Cell</td>
      </tr>
      <tr class="bg-warning">
        <th scope="row">7</th>
        <td>Cell</td>
        <td>Cell</td>
      </tr>
      <tr>
        <th scope="row">8</th>
        <td>Cell</td>
        <td>Cell</td>
      </tr>
      <tr class="bg-danger">
        <th scope="row">9</th>
        <td>Cell</td>
        <td>Cell</td>
      </tr>
    </tbody>
  </table>
</div>

```html
<!-- On rows -->
<tr class="bg-primary">...</tr>
<tr class="bg-success">...</tr>
<tr class="bg-warning">...</tr>
<tr class="bg-danger">...</tr>
<tr class="bg-info">...</tr>

<!-- On cells (`td` or `th`) -->
<tr>
  <td class="bg-primary">...</td>
  <td class="bg-success">...</td>
  <td class="bg-warning">...</td>
  <td class="bg-danger">...</td>
  <td class="bg-info">...</td>
</tr>
```

{{< callout warning >}}
{{< partial "callout-warning-color-assistive-technologies.md" >}}
{{< /callout >}}

Create responsive tables by wrapping any `.table` with `.table-responsive{-sm|-md|-lg|-xl}`, making the table scroll horizontally at each `max-width` breakpoint of up to (but not including) 576px, 768px, 992px, and 1120px, respectively.

{{< callout info >}}
{{< partial "callout-info-mediaqueries-breakpoints.md" >}}
{{< /callout >}}

## Captions

A `<caption>` functions like a heading for a table. It helps users with screen readers to find a table and understand what it's about and decide if they want to read it.

{{< example >}}
<table class="table">
  <caption>List of users</caption>
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>Larry</td>
      <td>the Bird</td>
      <td>@twitter</td>
    </tr>
  </tbody>
</table>
{{< /example >}}

## Responsive tables

Responsive tables allow tables to be scrolled horizontally with ease. Make any table responsive across all viewports by wrapping a `.table` with `.table-responsive`. Or, pick a maximum breakpoint with which to have a responsive table up to by using `.table-responsive{-sm|-md|-lg|-xl}`.

{{< callout warning >}}
##### Vertical clipping/truncation

Responsive tables make use of `overflow-y: hidden`, which clips off any content that goes beyond the bottom or top edges of the table. In particular, this can clip off dropdown menus and other third-party widgets.
{{< /callout >}}

### Always responsive

Across every breakpoint, use `.table-responsive` for horizontally scrolling tables.

<div class="bd-example">
  <div class="table-responsive">
    <table class="table">
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
    </table>
  </div>
</div>

```html
<div class="table-responsive">
  <table class="table">
    ...
  </table>
</div>
```

### Breakpoint specific

Use `.table-responsive{-sm|-md|-lg|-xl}` as needed to create responsive tables up to a particular breakpoint. From that breakpoint and up, the table will behave normally and not scroll horizontally.

**These tables may appear broken until their responsive styles apply at specific viewport widths.**

{{< tables.inline >}}
{{ range $.Site.Data.breakpoints }}
{{ if not (eq .breakpoint "xs") }}
<div class="bd-example">
<div class="table-responsive{{ .abbr }}">
  <table class="table">
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
  </table>
</div>
</div>
{{ end -}}
{{- end -}}
{{< /tables.inline >}}

{{< highlight html >}}
{{< tables.inline >}}
{{- range $.Site.Data.breakpoints -}}
{{- if not (eq .breakpoint "xs") }}
<div class="table-responsive{{ .abbr }}">
  <table class="table">
    ...
  </table>
</div>
{{ end -}}
{{- end -}}
{{< /tables.inline >}}
{{< /highlight >}}
