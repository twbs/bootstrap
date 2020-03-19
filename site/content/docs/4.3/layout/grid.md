---
layout: docs
title: Grid system
description: Use our powerful mobile-first flexbox grid to build layouts of all shapes and sizes thanks to a twelve column system, five default responsive tiers, Sass variables and mixins, and dozens of predefined classes.
group: layout
toc: true
---

## How it works

Bootstrap's grid system uses a series of containers, rows, and columns to layout and align content. It's built with [flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox) and is fully responsive. Below is an example and an in-depth look at how the grid comes together.

**New to or unfamiliar with flexbox?** [Read this CSS Tricks flexbox guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/#flexbox-background) for background, terminology, guidelines, and code snippets.

{{< example class="bd-example-row" >}}
<div class="container">
  <div class="row">
    <div class="col-sm">
      One of three columns
    </div>
    <div class="col-sm">
      One of three columns
    </div>
    <div class="col-sm">
      One of three columns
    </div>
  </div>
</div>
{{< /example >}}

The above example creates three equal-width columns on small, medium, large, and extra large devices using our predefined grid classes. Those columns are centered in the page with the parent `.container`.

Breaking it down, here's how it works:

- Containers provide a means to center and horizontally pad your site's contents. Use `.container` for a responsive pixel width or `.container-fluid` for `width: 100%` across all viewport and device sizes.
- Rows are wrappers for columns. Each column has horizontal `padding` (called a gutter) for controlling the space between them. This `padding` is then counteracted on the rows with negative margins. This way, all the content in your columns is visually aligned down the left side.
- In a grid layout, content must be placed within columns and only columns may be immediate children of rows.
- Thanks to flexbox, grid columns without a specified `width` will automatically layout as equal width columns. For example, four instances of `.col-sm` will each automatically be 25% wide from the small breakpoint and up. See the [auto-layout columns](#auto-layout-columns) section for more examples.
- Column classes indicate the number of columns you'd like to use out of the possible 12 per row. So, if you want three equal-width columns across, you can use `.col-4`.
- Column `width`s are set in percentages, so they're always fluid and sized relative to their parent element.
- Columns have horizontal `padding` to create the gutters between individual columns, however, you can remove the `margin` from rows and `padding` from columns with `.g-0` on the `.row`.
- To make the grid responsive, there are five grid breakpoints, one for each [responsive breakpoint]({{< docsref "/layout/overview#responsive-breakpoints" >}}): all breakpoints (extra small), small, medium, large, and extra large.
- Grid breakpoints are based on minimum width media queries, meaning **they apply to that one breakpoint and all those above it** (e.g., `.col-sm-4` applies to small, medium, large, and extra large devices, but not the first `xs` breakpoint).
- You can use predefined grid classes (like `.col-4`) or [Sass mixins](#sass-mixins) for more semantic markup.
- The horizontal gutter width can be changed with `.gx-*` classes like `.gx-2` (smaller horizontal gutters) or `.gx-xl-4` (larger horizontal gutters on viewports larger than the `xl` breakpoint).
- The vertical gutter width can be changed with `.gy-*` classes like `.gy-2` (smaller vertical gutters) or `.gy-xl-4` (larger vertical gutters on viewports larger than the `xl` breakpoint). To achieve vertical gutters, additional margin is added to the top of each column. The `.row` counteracts this margin to the top with a negative margin.
- The gutter width in both directions can be changed with `.g-*` classes like `.g-2` (smaller gutters) or `.g-xl-4` (larger gutters on viewports larger than the `xl` breakpoint)

Be aware of the limitations and [bugs around flexbox](https://github.com/philipwalton/flexbugs), like the [inability to use some HTML elements as flex containers](https://github.com/philipwalton/flexbugs#flexbug-9).

## Grid options

While Bootstrap uses `em`s or `rem`s for defining most sizes, `px`s are used for grid breakpoints and container widths. This is because the viewport width is in pixels and does not change with the [font size](https://drafts.csswg.org/mediaqueries-3/#units).

See how aspects of the Bootstrap grid system work across multiple devices with a handy table.

<table class="table">
  <thead>
    <tr>
      <th></th>
      <th>
        Extra small<br>
        <span class="font-weight-normal">&lt;576px</span>
      </th>
      <th>
        Small<br>
        <span class="font-weight-normal">&ge;576px</span>
      </th>
      <th>
        Medium<br>
        <span class="font-weight-normal">&ge;768px</span>
      </th>
      <th>
        Large<br>
        <span class="font-weight-normal">&ge;992px</span>
      </th>
      <th>
        Extra large<br>
        <span class="font-weight-normal">&ge;1200px</span>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th class="text-nowrap" scope="row">Container <code class="font-weight-normal">max-width</code></th>
      <td>None (auto)</td>
      <td>540px</td>
      <td>720px</td>
      <td>960px</td>
      <td>1140px</td>
    </tr>
    <tr>
      <th class="text-nowrap" scope="row">Class prefix</th>
      <td><code>.col-</code></td>
      <td><code>.col-sm-</code></td>
      <td><code>.col-md-</code></td>
      <td><code>.col-lg-</code></td>
      <td><code>.col-xl-</code></td>
    </tr>
    <tr>
      <th class="text-nowrap" scope="row"># of columns</th>
      <td colspan="5">12</td>
    </tr>
    <tr>
      <th class="text-nowrap" scope="row">Gutter width</th>
      <td colspan="5">1.5rem (.75rem on each side of a column)</td>
    </tr>
    <tr>
      <th class="text-nowrap" scope="row">Nestable</th>
      <td colspan="5">Yes</td>
    </tr>
    <tr>
      <th class="text-nowrap" scope="row">Column ordering</th>
      <td colspan="5">Yes</td>
    </tr>
  </tbody>
</table>

## Auto-layout columns

Utilize breakpoint-specific column classes for easy column sizing without an explicit numbered class like `.col-sm-6`.

### Equal-width

For example, here are two grid layouts that apply to every device and viewport, from `xs` to `xl`. Add any number of unit-less classes for each breakpoint you need and every column will be the same width.

{{< example class="bd-example-row" >}}
<div class="container">
  <div class="row">
    <div class="col">
      1 of 2
    </div>
    <div class="col">
      2 of 2
    </div>
  </div>
  <div class="row">
    <div class="col">
      1 of 3
    </div>
    <div class="col">
      2 of 3
    </div>
    <div class="col">
      3 of 3
    </div>
  </div>
</div>
{{< /example >}}

### Setting one column width

Auto-layout for flexbox grid columns also means you can set the width of one column and have the sibling columns automatically resize around it. You may use predefined grid classes (as shown below), grid mixins, or inline widths. Note that the other columns will resize no matter the width of the center column.

{{< example class="bd-example-row" >}}
<div class="container">
  <div class="row">
    <div class="col">
      1 of 3
    </div>
    <div class="col-6">
      2 of 3 (wider)
    </div>
    <div class="col">
      3 of 3
    </div>
  </div>
  <div class="row">
    <div class="col">
      1 of 3
    </div>
    <div class="col-5">
      2 of 3 (wider)
    </div>
    <div class="col">
      3 of 3
    </div>
  </div>
</div>
{{< /example >}}

### Variable width content

Use `col-{breakpoint}-auto` classes to size columns based on the natural width of their content.

{{< example class="bd-example-row" >}}
<div class="container">
  <div class="row justify-content-md-center">
    <div class="col col-lg-2">
      1 of 3
    </div>
    <div class="col-md-auto">
      Variable width content
    </div>
    <div class="col col-lg-2">
      3 of 3
    </div>
  </div>
  <div class="row">
    <div class="col">
      1 of 3
    </div>
    <div class="col-md-auto">
      Variable width content
    </div>
    <div class="col col-lg-2">
      3 of 3
    </div>
  </div>
</div>
{{< /example >}}

## Responsive classes

Bootstrap's grid includes five tiers of predefined classes for building complex responsive layouts. Customize the size of your columns on extra small, small, medium, large, or extra large devices however you see fit.

### All breakpoints

For grids that are the same from the smallest of devices to the largest, use the `.col` and `.col-*` classes. Specify a numbered class when you need a particularly sized column; otherwise, feel free to stick to `.col`.

{{< example class="bd-example-row" >}}
<div class="container">
  <div class="row">
    <div class="col">col</div>
    <div class="col">col</div>
    <div class="col">col</div>
    <div class="col">col</div>
  </div>
  <div class="row">
    <div class="col-8">col-8</div>
    <div class="col-4">col-4</div>
  </div>
</div>
{{< /example >}}

### Stacked to horizontal

Using a single set of `.col-sm-*` classes, you can create a basic grid system that starts out stacked and becomes horizontal at the small breakpoint (`sm`).

{{< example class="bd-example-row" >}}
<div class="container">
  <div class="row">
    <div class="col-sm-8">col-sm-8</div>
    <div class="col-sm-4">col-sm-4</div>
  </div>
  <div class="row">
    <div class="col-sm">col-sm</div>
    <div class="col-sm">col-sm</div>
    <div class="col-sm">col-sm</div>
  </div>
</div>
{{< /example >}}

### Mix and match

Don't want your columns to simply stack in some grid tiers? Use a combination of different classes for each tier as needed. See the example below for a better idea of how it all works.

{{< example class="bd-example-row" >}}
<div class="container">
  <!-- Stack the columns on mobile by making one full-width and the other half-width -->
  <div class="row">
    <div class="col-md-8">.col-md-8</div>
    <div class="col-6 col-md-4">.col-6 .col-md-4</div>
  </div>

  <!-- Columns start at 50% wide on mobile and bump up to 33.3% wide on desktop -->
  <div class="row">
    <div class="col-6 col-md-4">.col-6 .col-md-4</div>
    <div class="col-6 col-md-4">.col-6 .col-md-4</div>
    <div class="col-6 col-md-4">.col-6 .col-md-4</div>
  </div>

  <!-- Columns are always 50% wide, on mobile and desktop -->
  <div class="row">
    <div class="col-6">.col-6</div>
    <div class="col-6">.col-6</div>
  </div>
</div>
{{< /example >}}

### Row columns

Use the responsive `.row-cols-*` classes to quickly set the number of columns that best render your content and layout. Whereas normal `.col-*` classes apply to the individual columns (e.g., `.col-md-4`), the row columns classes are set on the parent `.row` as a shortcut. With `.row-cols-auto` you can give the columns their natural width.

Use these row columns classes to quickly create basic grid layouts or to control your card layouts.

{{< example class="bd-example-row" >}}
<div class="container">
  <div class="row row-cols-2">
    <div class="col">Column</div>
    <div class="col">Column</div>
    <div class="col">Column</div>
    <div class="col">Column</div>
  </div>
</div>
{{< /example >}}

{{< example class="bd-example-row" >}}
<div class="container">
  <div class="row row-cols-3">
    <div class="col">Column</div>
    <div class="col">Column</div>
    <div class="col">Column</div>
    <div class="col">Column</div>
  </div>
</div>
{{< /example >}}

{{< example class="bd-example-row" >}}
<div class="container">
  <div class="row row-cols-auto">
    <div class="col">Column</div>
    <div class="col">Column</div>
    <div class="col">Column</div>
    <div class="col">Column</div>
  </div>
</div>
{{< /example >}}

{{< example class="bd-example-row" >}}
<div class="container">
  <div class="row row-cols-4">
    <div class="col">Column</div>
    <div class="col">Column</div>
    <div class="col">Column</div>
    <div class="col">Column</div>
  </div>
</div>
{{< /example >}}

{{< example class="bd-example-row" >}}
<div class="container">
  <div class="row row-cols-4">
    <div class="col">Column</div>
    <div class="col">Column</div>
    <div class="col-6">Column</div>
    <div class="col">Column</div>
  </div>
</div>
{{< /example >}}

{{< example class="bd-example-row" >}}
<div class="container">
  <div class="row row-cols-1 row-cols-sm-2 row-cols-md-4">
    <div class="col">Column</div>
    <div class="col">Column</div>
    <div class="col">Column</div>
    <div class="col">Column</div>
  </div>
</div>
{{< /example >}}

You can also use the accompanying Sass mixin, `row-cols()`:

{{< highlight scss >}}
.element {
  // Three columns to start
  @include row-cols(3);

  // Five columns from medium breakpoint up
  @include media-breakpoint-up(md) {
    @include row-cols(5);
  }
}
{{< /highlight >}}

## Gutters

Gutters can be responsively adjusted by breakpoint-specific gutter classes in as well horizontal, vertical and both directions. By default, `.row`s have a horizontal gutter of `1.5rem`. Removing this default gutter is possible by adding the `.g-0` class.

### Changing the gutters

Classes are built from the `$gutters` Sass map which is inherited from the `$spacers` Sass map.

```sass
$grid-gutter-width: 1.5rem;
$gutters: (
  0: 0,
  1: $spacer * .25,
  2: $spacer * .5,
  3: $spacer,
  4: $spacer * 1.5,
  5: $spacer * 3,
);
```

### Horizontal gutters

`.gx-*` classes can be used to control the horizontal gutter widths. The `.container` or `.container-fluid` parent may need to be adjusted if larger gutters are used too to avoid unwanted overflow, using a matching padding utility. For example, in the following example we've increased the padding with `.px-4`:

{{< example >}}
<div class="container px-4">
  <div class="row gx-5">
    <div class="col">
     <div class="p-3 border bg-light">Custom column padding</div>
    </div>
    <div class="col">
      <div class="p-3 border bg-light">Custom column padding</div>
    </div>
  </div>
</div>
{{< /example >}}

An alternative solution is to add a wrapper around the `.row` with the `.overflow-hidden` class:

{{< example >}}
<div class="container overflow-hidden">
  <div class="row gx-5">
    <div class="col">
     <div class="p-3 border bg-light">Custom column padding</div>
    </div>
    <div class="col">
      <div class="p-3 border bg-light">Custom column padding</div>
    </div>
  </div>
</div>
{{< /example >}}

### Vertical gutters

`.gy-*` classes can be used to control the vertical gutter widths. Like the horizontal gutters, the vertical gutters can cause some overflow below the `.row` at the end of a page. If this occurs, you add a wrapper around `.row` with the `.overflow-hidden` class:

{{< example >}}
<div class="container overflow-hidden">
  <div class="row gy-5">
    <div class="col-6">
      <div class="p-3 border bg-light">Custom column padding</div>
    </div>
    <div class="col-6">
      <div class="p-3 border bg-light">Custom column padding</div>
    </div>
    <div class="col-6">
      <div class="p-3 border bg-light">Custom column padding</div>
    </div>
    <div class="col-6">
      <div class="p-3 border bg-light">Custom column padding</div>
    </div>
  </div>
</div>
{{< /example >}}

### Horizontal & vertical gutters

`.g-*` classes can be used to control the horizontal gutter widths, for the following example we use a smaller gutter width, so there won't be a need to add the `.overflow-hidden` wrapper class.

{{< example >}}
<div class="container">
  <div class="row g-2">
    <div class="col-6">
      <div class="p-3 border bg-light">Custom column padding</div>
    </div>
    <div class="col-6">
      <div class="p-3 border bg-light">Custom column padding</div>
    </div>
    <div class="col-6">
      <div class="p-3 border bg-light">Custom column padding</div>
    </div>
    <div class="col-6">
      <div class="p-3 border bg-light">Custom column padding</div>
    </div>
  </div>
</div>
{{< /example >}}

### Row columns gutters

Gutter classes can also be added to [row columns](#row-columns). In the following example, we use responsive row columns and responsive gutter classes.

{{< example >}}
<div class="container">
  <div class="row row-cols-2 row-cols-lg-5 g-2 g-lg-3">
    <div class="col">
      <div class="p-3 border bg-light">Row column</div>
    </div>
    <div class="col">
      <div class="p-3 border bg-light">Row column</div>
    </div>
    <div class="col">
      <div class="p-3 border bg-light">Row column</div>
    </div>
    <div class="col">
      <div class="p-3 border bg-light">Row column</div>
    </div>
    <div class="col">
      <div class="p-3 border bg-light">Row column</div>
    </div>
    <div class="col">
      <div class="p-3 border bg-light">Row column</div>
    </div>
    <div class="col">
      <div class="p-3 border bg-light">Row column</div>
    </div>
    <div class="col">
      <div class="p-3 border bg-light">Row column</div>
    </div>
    <div class="col">
      <div class="p-3 border bg-light">Row column</div>
    </div>
    <div class="col">
      <div class="p-3 border bg-light">Row column</div>
    </div>
  </div>
</div>
{{< /example >}}

### No gutters

The gutters between columns in our predefined grid classes can be removed with `.g-0`. This removes the negative `margin`s from `.row` and the horizontal `padding` from all immediate children columns.

**Need an edge-to-edge design?** Drop the parent `.container` or `.container-fluid`.

In practice, here's how it looks. Note you can continue to use this with all other predefined grid classes (including column widths, responsive tiers, reorders, and more).

{{< example class="bd-example-row" >}}
<div class="row g-0">
  <div class="col-sm-6 col-md-8">.col-sm-6 .col-md-8</div>
  <div class="col-6 col-md-4">.col-6 .col-md-4</div>
</div>
{{< /example >}}

## Alignment

Use flexbox alignment utilities to vertically and horizontally align columns.

### Vertical alignment

{{< example class="bd-example-row bd-example-row-flex-cols" >}}
<div class="container">
  <div class="row align-items-start">
    <div class="col">
      One of three columns
    </div>
    <div class="col">
      One of three columns
    </div>
    <div class="col">
      One of three columns
    </div>
  </div>
  <div class="row align-items-center">
    <div class="col">
      One of three columns
    </div>
    <div class="col">
      One of three columns
    </div>
    <div class="col">
      One of three columns
    </div>
  </div>
  <div class="row align-items-end">
    <div class="col">
      One of three columns
    </div>
    <div class="col">
      One of three columns
    </div>
    <div class="col">
      One of three columns
    </div>
  </div>
</div>
{{< /example >}}

{{< example class="bd-example-row bd-example-row-flex-cols" >}}
<div class="container">
  <div class="row">
    <div class="col align-self-start">
      One of three columns
    </div>
    <div class="col align-self-center">
      One of three columns
    </div>
    <div class="col align-self-end">
      One of three columns
    </div>
  </div>
</div>
{{< /example >}}

### Horizontal alignment

{{< example class="bd-example-row" >}}
<div class="container">
  <div class="row justify-content-start">
    <div class="col-4">
      One of two columns
    </div>
    <div class="col-4">
      One of two columns
    </div>
  </div>
  <div class="row justify-content-center">
    <div class="col-4">
      One of two columns
    </div>
    <div class="col-4">
      One of two columns
    </div>
  </div>
  <div class="row justify-content-end">
    <div class="col-4">
      One of two columns
    </div>
    <div class="col-4">
      One of two columns
    </div>
  </div>
  <div class="row justify-content-around">
    <div class="col-4">
      One of two columns
    </div>
    <div class="col-4">
      One of two columns
    </div>
  </div>
  <div class="row justify-content-between">
    <div class="col-4">
      One of two columns
    </div>
    <div class="col-4">
      One of two columns
    </div>
  </div>
</div>
{{< /example >}}

### Column wrapping

If more than 12 columns are placed within a single row, each group of extra columns will, as one unit, wrap onto a new line.

{{< example class="bd-example-row" >}}
<div class="container">
  <div class="row">
    <div class="col-9">.col-9</div>
    <div class="col-4">.col-4<br>Since 9 + 4 = 13 &gt; 12, this 4-column-wide div gets wrapped onto a new line as one contiguous unit.</div>
    <div class="col-6">.col-6<br>Subsequent columns continue along the new line.</div>
  </div>
</div>
{{< /example >}}

### Column breaks

Breaking columns to a new line in flexbox requires a small hack: add an element with `width: 100%` wherever you want to wrap your columns to a new line. Normally this is accomplished with multiple `.row`s, but not every implementation method can account for this.

{{< example class="bd-example-row" >}}
<div class="container">
  <div class="row">
    <div class="col-6 col-sm-3">.col-6 .col-sm-3</div>
    <div class="col-6 col-sm-3">.col-6 .col-sm-3</div>

    <!-- Force next columns to break to new line -->
    <div class="w-100"></div>

    <div class="col-6 col-sm-3">.col-6 .col-sm-3</div>
    <div class="col-6 col-sm-3">.col-6 .col-sm-3</div>
  </div>
</div>
{{< /example >}}

You may also apply this break at specific breakpoints with our [responsive display utilities]({{< docsref "/utilities/display" >}}).

{{< example class="bd-example-row" >}}
<div class="container">
  <div class="row">
    <div class="col-6 col-sm-4">.col-6 .col-sm-4</div>
    <div class="col-6 col-sm-4">.col-6 .col-sm-4</div>

    <!-- Force next columns to break to new line at md breakpoint and up -->
    <div class="w-100 d-none d-md-block"></div>

    <div class="col-6 col-sm-4">.col-6 .col-sm-4</div>
    <div class="col-6 col-sm-4">.col-6 .col-sm-4</div>
  </div>
</div>
{{< /example >}}

## Reordering

### Order classes

Use `.order-` classes for controlling the **visual order** of your content. These classes are responsive, so you can set the `order` by breakpoint (e.g., `.order-1.order-md-2`). Includes support for `1` through `5` across all five grid tiers.

{{< example class="bd-example-row" >}}
<div class="container">
  <div class="row">
    <div class="col">
      First in DOM, no order applied
    </div>
    <div class="col order-5">
      Second in DOM, with a larger order
    </div>
    <div class="col order-1">
      Third in DOM, with an order of 1
    </div>
  </div>
</div>
{{< /example >}}

There are also responsive `.order-first` and `.order-last` classes that change the `order` of an element by applying `order: -1` and `order: 6`, respectively. These classes can also be intermixed with the numbered `.order-*` classes as needed.

{{< example class="bd-example-row" >}}
<div class="container">
  <div class="row">
    <div class="col order-last">
      First in DOM, ordered last
    </div>
    <div class="col">
      Second in DOM, unordered
    </div>
    <div class="col order-first">
      Third in DOM, ordered first
    </div>
  </div>
</div>
{{< /example >}}

### Offsetting columns

You can offset grid columns in two ways: our responsive `.offset-` grid classes and our [margin utilities]({{< docsref "/utilities/spacing" >}}). Grid classes are sized to match columns while margins are more useful for quick layouts where the width of the offset is variable.

#### Offset classes

Move columns to the right using `.offset-md-*` classes. These classes increase the left margin of a column by `*` columns. For example, `.offset-md-4` moves `.col-md-4` over four columns.

{{< example class="bd-example-row" >}}
<div class="container">
  <div class="row">
    <div class="col-md-4">.col-md-4</div>
    <div class="col-md-4 offset-md-4">.col-md-4 .offset-md-4</div>
  </div>
  <div class="row">
    <div class="col-md-3 offset-md-3">.col-md-3 .offset-md-3</div>
    <div class="col-md-3 offset-md-3">.col-md-3 .offset-md-3</div>
  </div>
  <div class="row">
    <div class="col-md-6 offset-md-3">.col-md-6 .offset-md-3</div>
  </div>
</div>
{{< /example >}}

In addition to column clearing at responsive breakpoints, you may need to reset offsets. See this in action in [the grid example]({{< docsref "/examples/grid" >}}).

{{< example class="bd-example-row" >}}
<div class="container">
  <div class="row">
    <div class="col-sm-5 col-md-6">.col-sm-5 .col-md-6</div>
    <div class="col-sm-5 offset-sm-2 col-md-6 offset-md-0">.col-sm-5 .offset-sm-2 .col-md-6 .offset-md-0</div>
  </div>
  <div class="row">
    <div class="col-sm-6 col-md-5 col-lg-6">.col-sm-6 .col-md-5 .col-lg-6</div>
    <div class="col-sm-6 col-md-5 offset-md-2 col-lg-6 offset-lg-0">.col-sm-6 .col-md-5 .offset-md-2 .col-lg-6 .offset-lg-0</div>
  </div>
</div>
{{< /example >}}

#### Margin utilities

With the move to flexbox in v4, you can use margin utilities like `.mr-auto` to force sibling columns away from one another.

{{< example class="bd-example-row" >}}
<div class="container">
  <div class="row">
    <div class="col-md-4">.col-md-4</div>
    <div class="col-md-4 ml-auto">.col-md-4 .ml-auto</div>
  </div>
  <div class="row">
    <div class="col-md-3 ml-md-auto">.col-md-3 .ml-md-auto</div>
    <div class="col-md-3 ml-md-auto">.col-md-3 .ml-md-auto</div>
  </div>
  <div class="row">
    <div class="col-auto mr-auto">.col-auto .mr-auto</div>
    <div class="col-auto">.col-auto</div>
  </div>
</div>
{{< /example >}}

## Nesting

To nest your content with the default grid, add a new `.row` and set of `.col-sm-*` columns within an existing `.col-sm-*` column. Nested rows should include a set of columns that add up to 12 or fewer (it is not required that you use all 12 available columns).

{{< example class="bd-example-row" >}}
<div class="container">
  <div class="row">
    <div class="col-sm-3">
      Level 1: .col-sm-3
    </div>
    <div class="col-sm-9">
      <div class="row">
        <div class="col-8 col-sm-6">
          Level 2: .col-8 .col-sm-6
        </div>
        <div class="col-4 col-sm-6">
          Level 2: .col-4 .col-sm-6
        </div>
      </div>
    </div>
  </div>
</div>
{{< /example >}}

## Standalone column classes

The `.col-*` classes can also be used outside a `.row` to give an element a specific width. Whenever column classes are used as non direct children of a row, the paddings are omitted.

{{< example >}}
<div class="col-3 bg-light p-3 border">
  .col-3: width of 25%
</div>
<div class="col-sm-9 bg-light p-3 border">
  .col-sm-9: width of 75% above sm breakpoint
</div>
{{< /example >}}

The classes can be used together with utilities to create responsive floated images. Make sure to wrap the content in a [`.clearfix`]({{< docsref "/helpers/clearfix" >}}) wrapper to clear the float if the text is shorter.

{{< example >}}
<div class="clearfix">
  {{< placeholder width="100%" height="210" class="col-md-6 float-md-right mb-3 ml-md-3" text="Responsive floated image" >}}

  <p>
    Donec ullamcorper nulla non metus auctor fringilla. Nulla vitae elit libero, a pharetra augue. Fusce dapibus, tellus ac cursus commodo, tortor mauris paddenstoel nibh, ut fermentum massa justo sit amet risus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  </p>

  <p>
    Sed posuere consectetur est at lobortis. Etiam porta sem malesuada magna mollis euismod. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Id nullam tellus relem amet commodo telemque olemit. Sed posuere consectetur est at lobortis. Maecenas sed diam eget risus varius blandit sit amet non magna. Cras justo odio, dapibus ac facilisis in, egestas eget quam.
  </p>

  <p>
    Donec id elit non mi porta gravida at eget metus. Aenean eu leo quam. Pellentesque ornare sem lantaarnpaal quam venenatis vestibulum. Donec sed odio dui. Maecenas faucibus mollis interdum. Nullam quis risus eget urna salsa tequila vel eu leo. Donec id elit non mi porta gravida at eget metus.
  </p>
</div>
{{< /example >}}

## Sass mixins

When using Bootstrap's source Sass files, you have the option of using Sass variables and mixins to create custom, semantic, and responsive page layouts. Our predefined grid classes use these same variables and mixins to provide a whole suite of ready-to-use classes for fast responsive layouts.

### Variables

Variables and maps determine the number of columns, the gutter width, and the media query point at which to begin floating columns. We use these to generate the predefined grid classes documented above, as well as for the custom mixins listed below.

{{< highlight scss >}}
$grid-columns:      12;
$grid-gutter-width: 1.5rem;

$grid-breakpoints: (
  // Extra small screen / phone
  xs: 0,
  // Small screen / phone
  sm: 576px,
  // Medium screen / tablet
  md: 768px,
  // Large screen / desktop
  lg: 992px,
  // Extra large screen / wide desktop
  xl: 1200px
);

$container-max-widths: (
  sm: 540px,
  md: 720px,
  lg: 960px,
  xl: 1140px
);
{{< /highlight >}}

### Mixins

Mixins are used in conjunction with the grid variables to generate semantic CSS for individual grid columns.

{{< highlight scss >}}
// Creates a wrapper for a series of columns
@include make-row();

// Make the element grid-ready (applying everything but the width)
@include make-col-ready();
@include make-col($size, $columns: $grid-columns);

// Get fancy by offsetting, or changing the sort order
@include make-col-offset($size, $columns: $grid-columns);
{{< /highlight >}}

### Example usage

You can modify the variables to your own custom values, or just use the mixins with their default values. Here's an example of using the default settings to create a two-column layout with a gap between.

{{< highlight scss >}}
.example-container {
  @include make-container();
  // Make sure to define this width after the mixin to override
  // `width: 100%` generated by `make-container()`
  width: 800px;
}

.example-row {
  @include make-row();
}

.example-content-main {
  @include make-col-ready();

  @include media-breakpoint-up(sm) {
    @include make-col(6);
  }
  @include media-breakpoint-up(lg) {
    @include make-col(8);
  }
}

.example-content-secondary {
  @include make-col-ready();

  @include media-breakpoint-up(sm) {
    @include make-col(6);
  }
  @include media-breakpoint-up(lg) {
    @include make-col(4);
  }
}
{{< /highlight >}}

{{< example >}}
<div class="example-container">
  <div class="example-row">
    <div class="example-content-main">Main content</div>
    <div class="example-content-secondary">Secondary content</div>
  </div>
</div>
{{< /example >}}

## Customizing the grid

Using our built-in grid Sass variables and maps, it's possible to completely customize the predefined grid classes. Change the number of tiers, the media query dimensions, and the container widths—then recompile.

### Columns and gutters

The number of grid columns can be modified via Sass variables. `$grid-columns` is used to generate the widths (in percent) of each individual column while `$grid-gutter-width` sets the width for the column gutters.

{{< highlight scss >}}
$grid-columns: 12 !default;
$grid-gutter-width: 1.5rem !default;
{{< /highlight >}}

### Grid tiers

Moving beyond the columns themselves, you may also customize the number of grid tiers. If you wanted just four grid tiers, you'd update the `$grid-breakpoints` and `$container-max-widths` to something like this:

{{< highlight scss >}}
$grid-breakpoints: (
  xs: 0,
  sm: 480px,
  md: 768px,
  lg: 1024px
);

$container-max-widths: (
  sm: 420px,
  md: 720px,
  lg: 960px
);
{{< /highlight >}}

When making any changes to the Sass variables or maps, you'll need to save your changes and recompile. Doing so will output a brand new set of predefined grid classes for column widths, offsets, and ordering. Responsive visibility utilities will also be updated to use the custom breakpoints. Make sure to set grid values in `px` (not `rem`, `em`, or `%`).
