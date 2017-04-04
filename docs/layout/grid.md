---
layout: docs
title: Grid system
description: Documentation and examples for using Bootstrap's responsive flexbox grid system.
group: layout
---

Bootstrap includes a powerful mobile-first flexbox grid system for building layouts of all shapes and sizes. It's based on a 12 column layout and has multiple tiers, one for each [media query range]({{ site.baseurl }}/layout/overview/#responsive-breakpoints). You can use it with Sass mixins or our predefined classes.

## Contents

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## How it works

Bootstrap's grid system uses a series of containers, rows, and columns to layout and align content. It's built with flexbox and is fully responsive. Below is an example and an in-depth look at how the grid comes together.

<div class="bd-example bd-example-row">
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
</div>

The above example creates three equal-width columns on small, medium, large, and extra large devices using our predefined grid classes. Those columns are centered in the page with the parent `.container`.

Breaking it down, here's how it works:

- Containers provide a means to center your site's contents. Use `.container` for fixed width or `.container-fluid` for full width.
- Rows are horizontal groups of columns that ensure your columns are lined up properly. We use the negative margin method on `.row` to ensure all your content is aligned properly down the left side.
- Content should be placed within columns, and only columns may be immediate children of rows.
- Thanks to flexbox, grid columns without a set width will automatically layout with equal widths. For example, four instances of `.col-sm` will each automatically be 25% wide for small breakpoints.
- Column classes indicate the number of columns you'd like to use out of the possible 12 per row. So, if you want three equal-width columns, you can use `.col-sm-4`.
- Column `width`s are set in percentages, so they're always fluid and sized relative to their parent element.
- Columns have horizontal `padding` to create the gutters between individual columns, however, you can remove the `margin` from rows and `padding` from columns with `.no-gutters` on the `.row`.
- There are five grid tiers, one for each [responsive breakpoint]({{ site.baseurl }}/layout/overview/#responsive-breakpoints): all breakpoints (extra small), small, medium, large, and extra large.
- Grid tiers are based on minimum widths, meaning they apply to that one tier and all those above it (e.g., `.col-sm-4` applies to small, medium, large, and extra large devices).
- You can use predefined grid classes or Sass mixins for more semantic markup.

Be aware of the limitations and [bugs around flexbox](https://github.com/philipwalton/flexbugs), like the [inability to use some HTML elements as flex containers](https://github.com/philipwalton/flexbugs#9-some-html-elements-cant-be-flex-containers).

Sounds good? Great, let's move on to seeing all that in an example.

## Grid options

While Bootstrap uses `em`s or `rem`s for defining most sizes, `px`s are used for grid breakpoints and container widths. This is because the viewport width is in pixels and does not change with the [font size](https://drafts.csswg.org/mediaqueries-3/#units).

See how aspects of the Bootstrap grid system work across multiple devices with a handy table.

<table class="table table-bordered table-striped table-responsive">
  <thead>
    <tr>
      <th></th>
      <th class="text-center">
        Extra small<br>
        <small>&lt;576px</small>
      </th>
      <th class="text-center">
        Small<br>
        <small>&ge;576px</small>
      </th>
      <th class="text-center">
        Medium<br>
        <small>&ge;768px</small>
      </th>
      <th class="text-center">
        Large<br>
        <small>&ge;992px</small>
      </th>
      <th class="text-center">
        Extra large<br>
        <small>&ge;1200px</small>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th class="text-nowrap" scope="row">Grid behavior</th>
      <td>Horizontal at all times</td>
      <td colspan="4">Collapsed to start, horizontal above breakpoints</td>
    </tr>
    <tr>
      <th class="text-nowrap" scope="row">Max container width</th>
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
      <td colspan="5">30px (15px on each side of a column)</td>
    </tr>
    <tr>
      <th class="text-nowrap" scope="row">Nestable</th>
      <td colspan="5">Yes</td>
    </tr>
    <tr>
      <th class="text-nowrap" scope="row">Offsets</th>
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

<div class="bd-example-row">
{% example html %}
<div class="container">
  <div class="row">
    <div class="col">
      1 of 2
    </div>
    <div class="col">
      1 of 2
    </div>
  </div>
  <div class="row">
    <div class="col">
      1 of 3
    </div>
    <div class="col">
      1 of 3
    </div>
    <div class="col">
      1 of 3
    </div>
  </div>
</div>
{% endexample %}
</div>

Equal-width columns can be broken into multiple lines, but there is a [Safari flexbox bug](https://github.com/philipwalton/flexbugs#11-min-and-max-size-declarations-are-ignored-when-wrapping-flex-items) that prevents this from working without an explicit `flex-basis` or `border`. Our example works thanks to the `border` being set; you can do the same with `.col { border: 1px solid transparent; }`. Alternatively, you can set the flex-basis to the width of the column (e.g., `.col { flex: 1 0 50%; }`).

Both these fixes have been documented in a [reduced test case outside Bootstrap](https://output.jsbin.com/micohor).

<div class="bd-example-row">
{% example html %}
<div class="container">
  <div class="row">
    <div class="col">Column</div>
    <div class="col">Column</div>
    <div class="w-100"></div>
    <div class="col">Column</div>
    <div class="col">Column</div>
  </div>
</div>
{% endexample %}
</div>

### Setting one column width

Auto-layout for flexbox grid columns also means you can set the width of one column and have the sibling columns automatically resize around it. You may use predefined grid classes (as shown below), grid mixins, or inline widths. Note that the other columns will resize no matter the width of the center column.

<div class="bd-example-row">
{% example html %}
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
{% endexample %}
</div>

### Variable width content

Use `col-{breakpoint}-auto` classes to size columns based on the natural width of their content.

<div class="bd-example-row">
{% example html %}
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
{% endexample %}
</div>

### Equal-width multi-row

Create equal-width columns that span multiple rows by inserting a `.w-100` where you want the columns to break to a new line. Make the breaks responsive by mixing the `.w-100` with some [responsive display utilities]({{ site.baseurl }}/utilities/display-property/).

<div class="bd-example-row">
{% example html %}
<div class="row">
  <div class="col">col</div>
  <div class="col">col</div>
  <div class="w-100"></div>
  <div class="col">col</div>
  <div class="col">col</div>
</div>
{% endexample %}
</div>

## Responsive classes

Bootstrap's grid includes five tiers of predefined classes for building complex responsive layouts. Customize the size of your columns on extra small, small, medium, large, or extra large devices however you see fit.

### All breakpoints

For grids that are the same from the smallest of devices to the largest, use the `.col` and `.col-*` classes. Specify a numbered class when you need a particularly sized column; otherwise, feel free to stick to `.col`.

<div class="bd-example-row">
{% example html %}
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
{% endexample %}
</div>

### Stacked to horizontal

Using a single set of `.col-sm-*` classes, you can create a basic grid system that starts out stacked on extra small devices before becoming horizontal on desktop (medium) devices.

<div class="bd-example-row">
{% example html %}
<div class="row">
  <div class="col-sm-8">col-sm-8</div>
  <div class="col-sm-4">col-sm-4</div>
</div>
<div class="row">
  <div class="col-sm">col-sm</div>
  <div class="col-sm">col-sm</div>
  <div class="col-sm">col-sm</div>
</div>
{% endexample %}
</div>

### Mix and match

Don't want your columns to simply stack in some grid tiers? Use a combination of different classes for each tier as needed. See the example below for a better idea of how it all works.

<div class="bd-example-row">
{% example html %}
<!-- Stack the columns on mobile by making one full-width and the other half-width -->
<div class="row">
  <div class="col-12 col-md-8">.col-12 .col-md-8</div>
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
{% endexample %}
</div>

## Alignment

Use flexbox alignment utilities to vertically and horizontally align columns.

### Vertical alignment

<div class="bd-example-row bd-example-row-flex-cols">
{% example html %}
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
{% endexample %}
</div>

<div class="bd-example-row bd-example-row-flex-cols">
{% example html %}
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
{% endexample %}
</div>

### Horizontal alignment

<div class="bd-example-row">
{% example html %}
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
{% endexample %}
</div>

### No gutters

The gutters between columns in our predefined grid classes can be removed with `.no-gutters`. This removes the negative `margin`s from `.row` and the horizontal `padding` from all immediate children columns.

Here's the source code for creating these styles. Note that column overrides are scoped to only the first children columns and are targeted via [attribute selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors). While this generates a more specific selector, column padding can still be further customized with [spacing utilities]({{ site.baseurl }}/utilities/spacing/).

{% highlight sass %}
.no-gutters {
  margin-right: 0;
  margin-left: 0;

  > .col,
  > [class*="col-"] {
    padding-right: 0;
    padding-left: 0;
  }
}
{% endhighlight %}

In practice, here's how it looks. Note you can continue to use this with all other predefined grid classes (including column widths, responsive tiers, reorders, and more).

<div class="bd-example-row">
{% example html %}
<div class="row no-gutters">
  <div class="col-12 col-sm-6 col-md-8">.col-12 .col-sm-6 .col-md-8</div>
  <div class="col-6 col-md-4">.col-6 .col-md-4</div>
</div>
{% endexample %}
</div>

### Column wrapping

If more than 12 columns are placed within a single row, each group of extra columns will, as one unit, wrap onto a new line.

<div class="bd-example-row">
{% example html %}
<div class="row">
  <div class="col-9">.col-9</div>
  <div class="col-4">.col-4<br>Since 9 + 4 = 13 &gt; 12, this 4-column-wide div gets wrapped onto a new line as one contiguous unit.</div>
  <div class="col-6">.col-6<br>Subsequent columns continue along the new line.</div>
</div>
{% endexample %}
</div>

### Column resets

With the handful of grid tiers available, you're bound to run into issues where, at certain breakpoints, your columns don't clear quite right as one is taller than the other. To fix that, use a combination of a `.clearfix` and our [responsive display utilities]({{ site.baseurl }}/utilities/display/).

<div class="bd-example-row">
{% example html %}
<div class="row">
  <div class="col-6 col-sm-3">.col-6 .col-sm-3</div>
  <div class="col-6 col-sm-3">.col-6 .col-sm-3</div>

  <!-- Add the extra clearfix for only the required viewport -->
  <div class="clearfix d-none d-sm-block"></div>

  <div class="col-6 col-sm-3">.col-6 .col-sm-3</div>
  <div class="col-6 col-sm-3">.col-6 .col-sm-3</div>
</div>
{% endexample %}
</div>

In addition to column clearing at responsive breakpoints, you may need to **reset offsets, pushes, or pulls**. See this in action in [the grid example]({{ site.baseurl }}/examples/grid/).

<div class="bd-example-row">
{% example html %}
<div class="row">
  <div class="col-sm-5 col-md-6">.col-sm-5 .col-md-6</div>
  <div class="col-sm-5 offset-sm-2 col-md-6 offset-md-0">.col-sm-5 .offset-sm-2 .col-md-6 .offset-md-0</div>
</div>

<div class="row">
  <div class="col-sm-6 col-md-5 col-lg-6">.col.col-sm-6.col-md-5.col-lg-6</div>
  <div class="col-sm-6 col-md-5 offset-md-2 col-lg-6 offset-lg-0">.col-sm-6 .col-md-5 .offset-md-2 .col-lg-6 .offset-lg-0</div>
</div>
{% endexample %}
</div>

## Reordering

### Flex order

Use flexbox utilities for controlling the **visual order** of your content.

<div class="bd-example-row">
{% example html %}
<div class="container">
  <div class="row">
    <div class="col order-0">
      First, but unordered
    </div>
    <div class="col order-last">
      Second, but last
    </div>
    <div class="col order-first">
      Third, but first
    </div>
  </div>
</div>
{% endexample %}
</div>

### Offsetting columns

Move columns to the right using `.offset-md-*` classes. These classes increase the left margin of a column by `*` columns. For example, `.offset-md-4` moves `.col-md-4` over four columns.

<div class="bd-example-row">
{% example html %}
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
{% endexample %}
</div>

### Push and pull

Easily change the order of our built-in grid columns with `.push-md-*` and `.pull-md-*` modifier classes.

<div class="bd-example-row">
{% example html %}
<div class="row">
  <div class="col-md-9 push-md-3">.col-md-9 .push-md-3</div>
  <div class="col-md-3 pull-md-9">.col-md-3 .pull-md-9</div>
</div>
{% endexample %}
</div>

## Nesting

To nest your content with the default grid, add a new `.row` and set of `.col-sm-*` columns within an existing `.col-sm-*` column. Nested rows should include a set of columns that add up to 12 or fewer (it is not required that you use all 12 available columns).

<div class="bd-example-row">
{% example html %}
<div class="row">
  <div class="col-sm-9">
    Level 1: .col-sm-9
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
{% endexample %}
</div>

## Sass mixins

When using Bootstrap's source Sass files, you have the option of using Sass variables and mixins to create custom, semantic, and responsive page layouts. Our predefined grid classes use these same variables and mixins to provide a whole suite of ready-to-use classes for fast responsive layouts.

### Variables

Variables and maps determine the number of columns, the gutter width, and the media query point at which to begin floating columns. We use these to generate the predefined grid classes documented above, as well as for the custom mixins listed below.

{% highlight scss %}
$grid-columns:      12;
$grid-gutter-width-base: 30px;

$grid-gutter-widths: (
  xs: $grid-gutter-width-base, // 30px
  sm: $grid-gutter-width-base, // 30px
  md: $grid-gutter-width-base, // 30px
  lg: $grid-gutter-width-base, // 30px
  xl: $grid-gutter-width-base  // 30px
)

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
{% endhighlight %}

### Mixins

Mixins are used in conjunction with the grid variables to generate semantic CSS for individual grid columns.

{% highlight scss %}
// Creates a wrapper for a series of columns
@include make-row($gutters: $grid-gutter-widths);

// Make the element grid-ready (applying everything but the width)
@include make-col-ready($gutters: $grid-gutter-widths);
@include make-col($size, $columns: $grid-columns);

// Get fancy by offsetting, or changing the sort order
@include make-col-offset($size, $columns: $grid-columns);
@include make-col-push($size, $columns: $grid-columns);
@include make-col-pull($size, $columns: $grid-columns);
{% endhighlight %}

### Example usage

You can modify the variables to your own custom values, or just use the mixins with their default values. Here's an example of using the default settings to create a two-column layout with a gap between.

{% highlight scss %}
.example-container {
  width: 800px;
  @include make-container();
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
{% endhighlight %}

{% example html %}
<div class="example-container">
  <div class="example-row">
    <div class="example-content-main">Main content</div>
    <div class="example-content-secondary">Secondary content</div>
  </div>
</div>
{% endexample %}

## Customizing the grid

Using our built-in grid Sass variables and maps, it's possible to completely customize the predefined grid classes. Change the number of tiers, the media query dimensions, and the container widths—then recompile.

### Columns and gutters

The number of grid columns and their horizontal padding (aka, gutters) can be modified via Sass variables. `$grid-columns` is used to generate the widths (in percent) of each individual column while `$grid-gutter-widths` allows breakpoint-specific widths that are divided evenly across `padding-left` and `padding-right` for the column gutters.

{% highlight scss %}
$grid-columns:               12 !default;
$grid-gutter-width-base:     30px !default;
$grid-gutter-widths: (
  xs: $grid-gutter-width-base,
  sm: $grid-gutter-width-base,
  md: $grid-gutter-width-base,
  lg: $grid-gutter-width-base,
  xl: $grid-gutter-width-base
) !default;
{% endhighlight %}

### Grid tiers

Moving beyond the columns themselves, you may also customize the number of grid tiers. If you wanted just four grid tiers, you'd update the `$grid-breakpoints` and `$container-max-widths` to something like this:

{% highlight scss %}
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
{% endhighlight %}

When making any changes to the Sass variables or maps, you'll need to save your changes and recompile. Doing so will out a brand new set of predefined grid classes for column widths, offsets, pushes, and pulls. Responsive visibility utilities will also be updated to use the custom breakpoints.
