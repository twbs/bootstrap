---
layout: docs
title: Grid system
group: layout
---

Bootstrap includes a powerful mobile-first grid system for building layouts of all shapes and sizes. It's based on a 12 column layout and has multiple tiers, one for each [media query range]({{ site.baseurl }}/layout/overview/#responsive-breakpoints). You can use it with Sass mixins or our predefined classes.

## Contents

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## How it works

At a high level, here's how the grid system works:

- There are three major components—containers, rows, and columns.
- Containers—`.container` for fixed width or `.container-fluid` for full width—center your site's contents and help align your grid content.
- Rows are horizontal groups of columns that ensure your columns are lined up properly.
- Content should be placed within columns, and only columns may be immediate children of rows.
- Column classes indicate the number of columns you'd like to use out of the possible 12 per row. So if you want three equal-width columns, you'd use `.col-sm-4`.
- Column `width`s are set in percentages, so they're always fluid and sized relative to their parent element.
- Columns have horizontal `padding` to create the gutters between individual columns.
- There are five grid tiers, one for each [responsive breakpoint]({{ site.baseurl }}/layout/overview/#responsive-breakpoints): extra small, small, medium, large, and extra large.
- Grid tiers are based on minimum widths, meaning they apply to that one tier and all those above it (e.g., `.col-sm-4` applies to small, medium, large, and extra large devices).
- You can use predefined grid classes or Sass mixins for more semantic markup.

Sounds good? Great, let's move on to seeing all that in an example.

## Quick start example

If you're using Bootstrap's compiled CSS, this the example you'll want to start with.

{% example html %}
<div class="container">
  <div class="row">
    <div class="col-sm-4">
      One of three columns
    </div>
    <div class="col-sm-4">
      One of three columns
    </div>
    <div class="col-sm-4">
      One of three columns
    </div>
  </div>
</div>
{% endexample %}

The above example creates three equal-width columns on small, medium, large, and extra large devices using our [predefined grid classes](). Those columns are centered in the page with the parent `.container`.

## Grid options

See how aspects of the Bootstrap grid system work across multiple devices with a handy table.

<div class="table-responsive">
  <table class="table table-bordered table-striped">
    <thead>
      <tr>
        <th></th>
        <th>
          Extra small
          <small>&lt;34em</small>
        </th>
        <th>
          Small
          <small>&ge;34em</small>
        </th>
        <th>
          Medium
          <small>&ge;48em</small>
        </th>
        <th>
          Large
          <small>&ge;62em</small>
        </th>
        <th>
          Extra large
          <small>&ge;75em</small>
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
        <th class="text-nowrap" scope="row">Container width</th>
        <td>None (auto)</td>
        <td>34rem</td>
        <td>45rem</td>
        <td>60rem</td>
        <td>72.25rem</td>
      </tr>
      <tr>
        <th class="text-nowrap" scope="row">Class prefix</th>
        <td><code>.col-xs-</code></td>
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
</div>

## Sass mixins

When using Bootstrap's source Sass files, you have the option of using Sass variables and mixins to create custom, semantic, and responsive page layouts. Our [prebuilt grid classes](#grid-example-basic) use these same variables and mixins to provide a whole suite of ready-to-use classes for fast responsive layouts.

### Variables

Variables determine the number of columns, the gutter width, and the media query point at which to begin floating columns. We use these to generate the predefined grid classes documented above, as well as for the custom mixins listed below.

{% highlight scss %}
$grid-breakpoints: (
  // Extra small screen / phone
  xs: 0,
  // Small screen / phone
  sm: 34em,
  // Medium screen / tablet
  md: 48em,
  // Large screen / desktop
  lg: 62em,
  // Extra large screen / wide desktop
  xl: 75em
) !default;

$grid-columns:      12;
$grid-gutter-width: 1.5rem;
{% endhighlight %}

### Mixins

Mixins are used in conjunction with the grid variables to generate semantic CSS for individual grid columns.

{% highlight scss %}
// Creates a wrapper for a series of columns
@mixin make-row($gutter: $grid-gutter-width) {
  margin-left:  ($gutter / -2);
  margin-right: ($gutter / -2);
  @include clearfix();
}

// Make the element grid-ready (applying everything but the width)
@mixin make-col($gutter: $grid-gutter-width) {
  position: relative;
  float: left;
  min-height: 1px;
  padding-left:  ($gutter / 2);
  padding-right: ($gutter / 2);
}

// Set a width (to be used in or out of media queries)
@mixin make-col-span($columns) {
  width: percentage(($columns / $grid-columns));
}

// Get fancy by offsetting, or changing the sort order
@mixin make-col-offset($columns) {
  margin-left: percentage(($columns / $grid-columns));
}
@mixin make-col-push($columns) {
  left: percentage(($columns / $grid-columns));
}
@mixin make-col-pull($columns) {
  right: percentage(($columns / $grid-columns));
}
{% endhighlight %}

### Example usage

You can modify the variables to your own custom values, or just use the mixins with their default values. Here's an example of using the default settings to create a two-column layout with a gap between.

See it in action in <a href="http://jsbin.com/qiqet/3/edit">this rendered example</a>.

{% highlight scss %}
.container {
  max-width: 60em;
  @include make-container();
}
.row {
  @include make-row();
}
.content-main {
  @include make-col();

  @media (max-width: 32em) {
    @include make-col-span(6);
  }
  @media (min-width: 32.1em) {
    @include make-col-span(8);
  }
}
.content-secondary {
  @include make-col();

  @media (max-width: 32em) {
    @include make-col-span(6);
  }
  @media (min-width: 32.1em) {
    @include make-col-span(4);
  }
}
{% endhighlight %}

{% highlight html %}
<div class="container">
  <div class="row">
    <div class="content-main">...</div>
    <div class="content-secondary">...</div>
  </div>
</div>
{% endhighlight %}

## Predefined classes

In addition to our semantic mixins, Bootstrap includes an extensive set of prebuilt classes for quickly creating grid columns. It includes options for device-based column sizing, reordering columns, and more.

### Example: Stacked-to-horizontal

Using a single set of `.col-md-*` grid classes, you can create a basic grid system that starts out stacked on mobile devices and tablet devices (the extra small to small range) before becoming horizontal on desktop (medium) devices. Place grid columns in any `.row`.

<div class="bd-example-row">
{% example html %}
<div class="row">
  <div class="col-md-1">.col-md-1</div>
  <div class="col-md-1">.col-md-1</div>
  <div class="col-md-1">.col-md-1</div>
  <div class="col-md-1">.col-md-1</div>
  <div class="col-md-1">.col-md-1</div>
  <div class="col-md-1">.col-md-1</div>
  <div class="col-md-1">.col-md-1</div>
  <div class="col-md-1">.col-md-1</div>
  <div class="col-md-1">.col-md-1</div>
  <div class="col-md-1">.col-md-1</div>
  <div class="col-md-1">.col-md-1</div>
  <div class="col-md-1">.col-md-1</div>
</div>
<div class="row">
  <div class="col-md-8">.col-md-8</div>
  <div class="col-md-4">.col-md-4</div>
</div>
<div class="row">
  <div class="col-md-4">.col-md-4</div>
  <div class="col-md-4">.col-md-4</div>
  <div class="col-md-4">.col-md-4</div>
</div>
<div class="row">
  <div class="col-md-6">.col-md-6</div>
  <div class="col-md-6">.col-md-6</div>
</div>
{% endexample %}
</div>

### Example: Mobile and desktop

Don't want your columns to simply stack in smaller devices? Use the extra small and medium device grid classes by adding `.col-xs-*` and `.col-md-*` to your columns. See the example below for a better idea of how it all works.

<div class="bd-example-row">
{% example html %}
<!-- Stack the columns on mobile by making one full-width and the other half-width -->
<div class="row">
  <div class="col-xs-12 col-md-8">.col-xs-12 .col-md-8</div>
  <div class="col-xs-6 col-md-4">.col-xs-6 .col-md-4</div>
</div>

<!-- Columns start at 50% wide on mobile and bump up to 33.3% wide on desktop -->
<div class="row">
  <div class="col-xs-6 col-md-4">.col-xs-6 .col-md-4</div>
  <div class="col-xs-6 col-md-4">.col-xs-6 .col-md-4</div>
  <div class="col-xs-6 col-md-4">.col-xs-6 .col-md-4</div>
</div>

<!-- Columns are always 50% wide, on mobile and desktop -->
<div class="row">
  <div class="col-xs-6">.col-xs-6</div>
  <div class="col-xs-6">.col-xs-6</div>
</div>
{% endexample %}
</div>

### Example: Mobile, tablet, desktop

Build on the previous example by creating even more dynamic and powerful layouts with tablet `.col-sm-*` classes.

<div class="bd-example-row">
{% example html %}
<div class="row">
  <div class="col-xs-12 col-sm-6 col-md-8">.col-xs-12 .col-sm-6 .col-md-8</div>
  <div class="col-xs-6 col-md-4">.col-xs-6 .col-md-4</div>
</div>
<div class="row">
  <div class="col-xs-6 col-sm-4">.col-xs-6 .col-sm-4</div>
  <div class="col-xs-6 col-sm-4">.col-xs-6 .col-sm-4</div>
  <!-- Optional: clear the XS cols if their content doesn't match in height -->
  <div class="clearfix visible-xs-block"></div>
  <div class="col-xs-6 col-sm-4">.col-xs-6 .col-sm-4</div>
</div>
{% endexample %}
</div>

### Example: Column wrapping

If more than 12 columns are placed within a single row, each group of extra columns will, as one unit, wrap onto a new line.

<div class="bd-example-row">
{% example html %}
<div class="row">
  <div class="col-xs-9">.col-xs-9</div>
  <div class="col-xs-4">.col-xs-4<br>Since 9 + 4 = 13 &gt; 12, this 4-column-wide div gets wrapped onto a new line as one contiguous unit.</div>
  <div class="col-xs-6">.col-xs-6<br>Subsequent columns continue along the new line.</div>
</div>
{% endexample %}
</div>

### Example: Responsive column resets

With the four tiers of grids available you're bound to run into issues where, at certain breakpoints, your columns don't clear quite right as one is taller than the other. To fix that, use a combination of a `.clearfix` and our [responsive utility classes](#responsive-utilities).

<div class="bd-example-row">
{% example html %}
<div class="row">
  <div class="col-xs-6 col-sm-3">.col-xs-6 .col-sm-3</div>
  <div class="col-xs-6 col-sm-3">.col-xs-6 .col-sm-3</div>

  <!-- Add the extra clearfix for only the required viewport -->
  <div class="clearfix visible-xs-block"></div>

  <div class="col-xs-6 col-sm-3">.col-xs-6 .col-sm-3</div>
  <div class="col-xs-6 col-sm-3">.col-xs-6 .col-sm-3</div>
</div>
{% endexample %}
</div>

In addition to column clearing at responsive breakpoints, you may need to **reset offsets, pushes, or pulls**. See this in action in [the grid example](../examples/grid/).

<div class="bd-example-row">
{% example html %}
<div class="row">
  <div class="col-sm-5 col-md-6">.col-sm-5 .col-md-6</div>
  <div class="col-sm-5 col-sm-offset-2 col-md-6 col-md-offset-0">.col-sm-5 .col-sm-offset-2 .col-md-6 .col-md-offset-0</div>
</div>

<div class="row">
  <div class="col-sm-6 col-md-5 col-lg-6">.col-sm-6 .col-md-5 .col-lg-6</div>
  <div class="col-sm-6 col-md-5 col-md-offset-2 col-lg-6 col-lg-offset-0">.col-sm-6 .col-md-5 .col-md-offset-2 .col-lg-6 .col-lg-offset-0</div>
</div>
{% endexample %}
</div>

### Example: Offsetting columns

Move columns to the right using `.col-md-offset-*` classes. These classes increase the left margin of a column by `*` columns. For example, `.col-md-offset-4` moves `.col-md-4` over four columns.

<div class="bd-example-row">
{% example html %}
<div class="row">
  <div class="col-md-4">.col-md-4</div>
  <div class="col-md-4 col-md-offset-4">.col-md-4 .col-md-offset-4</div>
</div>
<div class="row">
  <div class="col-md-3 col-md-offset-3">.col-md-3 .col-md-offset-3</div>
  <div class="col-md-3 col-md-offset-3">.col-md-3 .col-md-offset-3</div>
</div>
<div class="row">
  <div class="col-md-6 col-md-offset-3">.col-md-6 .col-md-offset-3</div>
</div>
{% endexample %}
</div>

### Example: Nesting columns

To nest your content with the default grid, add a new `.row` and set of `.col-sm-*` columns within an existing `.col-sm-*` column. Nested rows should include a set of columns that add up to 12 or fewer (it is not required that you use all 12 available columns).

<div class="bd-example-row">
{% example html %}
<div class="row">
  <div class="col-sm-9">
    Level 1: .col-sm-9
    <div class="row">
      <div class="col-xs-8 col-sm-6">
        Level 2: .col-xs-8 .col-sm-6
      </div>
      <div class="col-xs-4 col-sm-6">
        Level 2: .col-xs-4 .col-sm-6
      </div>
    </div>
  </div>
</div>
{% endexample %}
</div>

### Example: Column ordering

Easily change the order of our built-in grid columns with `.col-md-push-*` and `.col-md-pull-*` modifier classes.

<div class="bd-example-row">
{% example html %}
<div class="row">
  <div class="col-md-9 col-md-push-3">.col-md-9 .col-md-push-3</div>
  <div class="col-md-3 col-md-pull-9">.col-md-3 .col-md-pull-9</div>
</div>
{% endexample %}
</div>
