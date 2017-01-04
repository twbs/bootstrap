---
layout: docs
title: Responsive utilities
description: Use responsive display utility classes for showing and hiding content by device, via media query.
group: layout
---

For faster mobile-friendly development, use these utility classes for showing and hiding content by device via media query. Also included are utility classes for toggling content when printed.

Try to use these on a limited basis and avoid creating entirely different versions of the same site. Instead, use them to complement each device's presentation.

## Contents

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

##  Available classes

* The `.hidden-*-up` classes hide the element when the viewport is at the given breakpoint or wider. For example, `.hidden-md-up` hides an element on medium, large, and extra-large viewports.
* The `.hidden-*-down` classes hide the element when the viewport is at the given breakpoint or smaller. For example, `.hidden-md-down` hides an element on extra-small, small, and medium viewports.
* There are no explicit "visible"/"show" responsive utility classes; you make an element visible by simply not hiding it at that breakpoint size.
* You can combine one `.hidden-*-up` class with one `.hidden-*-down` class to show an element only on a given interval of screen sizes. For example, `.hidden-sm-down.hidden-xl-up` shows the element only on medium and large viewports. Using multiple `.hidden-*-up` classes or multiple `.hidden-*-down` classes is redundant and pointless.
* These classes don't attempt to accommodate less common cases where an element's visibility can't be expressed as a single contiguous range of viewport breakpoint sizes; you will instead need to use custom CSS in such cases.

<table class="table table-bordered table-striped responsive-utilities table-responsive">
  <thead>
    <tr>
      <th></th>
      <th>
        Extra small devices
        <small>Portrait phones (&lt;544px)</small>
      </th>
      <th>
        Small devices
        <small>Landscape phones (&ge;544px - &lt;768px)</small>
      </th>
      <th>
        Medium devices
        <small>Tablets (&ge;768px - &lt;992px)</small>
      </th>
      <th>
        Large devices
        <small>Desktops (&ge;992px - &lt;1200px)</small>
      </th>
      <th>
        Extra large devices
        <small>Desktops (&ge;1200px)</small>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row"><code>.hidden-xs-down</code></th>
      <td class="is-hidden">Hidden</td>
      <td class="is-visible">Visible</td>
      <td class="is-visible">Visible</td>
      <td class="is-visible">Visible</td>
      <td class="is-visible">Visible</td>
    </tr>
    <tr>
      <th scope="row"><code>.hidden-sm-down</code></th>
      <td class="is-hidden">Hidden</td>
      <td class="is-hidden">Hidden</td>
      <td class="is-visible">Visible</td>
      <td class="is-visible">Visible</td>
      <td class="is-visible">Visible</td>
    </tr>
    <tr>
      <th scope="row"><code>.hidden-md-down</code></th>
      <td class="is-hidden">Hidden</td>
      <td class="is-hidden">Hidden</td>
      <td class="is-hidden">Hidden</td>
      <td class="is-visible">Visible</td>
      <td class="is-visible">Visible</td>
    </tr>
    <tr>
      <th scope="row"><code>.hidden-lg-down</code></th>
      <td class="is-hidden">Hidden</td>
      <td class="is-hidden">Hidden</td>
      <td class="is-hidden">Hidden</td>
      <td class="is-hidden">Hidden</td>
      <td class="is-visible">Visible</td>
    </tr>
    <tr>
      <th scope="row"><code>.hidden-xl-down</code></th>
      <td class="is-hidden">Hidden</td>
      <td class="is-hidden">Hidden</td>
      <td class="is-hidden">Hidden</td>
      <td class="is-hidden">Hidden</td>
      <td class="is-hidden">Hidden</td>
    </tr>
    <tr>
      <th scope="row"><code>.hidden-xs-up</code></th>
      <td class="is-hidden">Hidden</td>
      <td class="is-hidden">Hidden</td>
      <td class="is-hidden">Hidden</td>
      <td class="is-hidden">Hidden</td>
      <td class="is-hidden">Hidden</td>
    </tr>
    <tr>
      <th scope="row"><code>.hidden-sm-up</code></th>
      <td class="is-visible">Visible</td>
      <td class="is-hidden">Hidden</td>
      <td class="is-hidden">Hidden</td>
      <td class="is-hidden">Hidden</td>
      <td class="is-hidden">Hidden</td>
    </tr>
    <tr>
      <th scope="row"><code>.hidden-md-up</code></th>
      <td class="is-visible">Visible</td>
      <td class="is-visible">Visible</td>
      <td class="is-hidden">Hidden</td>
      <td class="is-hidden">Hidden</td>
      <td class="is-hidden">Hidden</td>
    </tr>
    <tr>
      <th scope="row"><code>.hidden-lg-up</code></th>
      <td class="is-visible">Visible</td>
      <td class="is-visible">Visible</td>
      <td class="is-visible">Visible</td>
      <td class="is-hidden">Hidden</td>
      <td class="is-hidden">Hidden</td>
    </tr>
    <tr>
      <th scope="row"><code>.hidden-xl-up</code></th>
      <td class="is-visible">Visible</td>
      <td class="is-visible">Visible</td>
      <td class="is-visible">Visible</td>
      <td class="is-visible">Visible</td>
      <td class="is-hidden">Hidden</td>
    </tr>
  </tbody>
</table>

<h2 id="responsive-utilities-print">Print classes</h2>
<p>Similar to the regular responsive classes, use these for toggling content for print.</p>
<table class="table table-bordered table-striped responsive-utilities table-responsive">
  <thead>
    <tr>
      <th>Class</th>
      <th>Browser</th>
      <th>Print</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th><code>.visible-print-block</code></th>
      <td class="is-hidden">Hidden</td>
      <td class="is-visible">Visible<br>(as <code>display: block</code>)</td>
    </tr>
    <tr>
      <th><code>.visible-print-inline</code></th>
      <td class="is-hidden">Hidden</td>
      <td class="is-visible">Visible<br>(as <code>display: inline</code>)</td>
    </tr>
    <tr>
      <th><code>.visible-print-inline-block</code></th>
      <td class="is-hidden">Hidden</td>
      <td class="is-visible">Visible<br>(as <code>display: inline-block</code>)</td>
    </tr>
    <tr>
      <th><code>.hidden-print</code></th>
      <td class="is-visible">Visible</td>
      <td class="is-hidden">Hidden</td>
    </tr>
  </tbody>
</table>

## Test cases

Resize your browser or load on different devices to test the responsive utility classes.

Green checkmarks indicate the element **is visible** in your current viewport.

<div class="row responsive-utilities-test visible-on">
  <div class="col-6 col-sm-3">
    <span class="hidden-sm-up visible">&#10004; Visible on extra small</span>
    <span class="hidden-xs-down not-visible">Extra small</span>
  </div>
  <div class="col-6 col-sm-3">
    <span class="hidden-md-up visible">&#10004; Visible on small or narrower</span>
    <span class="hidden-sm-down not-visible">Small or narrower</span>
  </div>
  <div class="col-6 col-sm-3">
    <span class="hidden-lg-up visible">&#10004; Visible on medium or narrower</span>
    <span class="hidden-md-down not-visible">Medium or narrower</span>
  </div>
  <div class="col-6 col-sm-3">
    <span class="hidden-xl-up visible">&#10004; Visible on large or narrower</span>
    <span class="hidden-lg-down not-visible">Large or narrower</span>
  </div>
</div>

<hr>

<div class="row responsive-utilities-test visible-on">
  <div class="col-6 col-sm-3">
    <span class="hidden-xs-down visible">&#10004; Visible on small or wider</span>
    <span class="hidden-sm-up not-visible">Small or wider</span>
  </div>
  <div class="col-6 col-sm-3">
    <span class="hidden-sm-down visible">&#10004; Visible on medium or wider</span>
    <span class="hidden-md-up not-visible">Medium or wider</span>
  </div>
  <div class="col-6 col-sm-3">
    <span class="hidden-md-down visible">&#10004; Visible on large or wider</span>
    <span class="hidden-lg-up not-visible">Large or wider</span>
  </div>
  <div class="col-6 col-sm-3">
    <span class="hidden-lg-down visible">&#10004; Visible on extra large</span>
    <span class="hidden-xl-up not-visible">Extra large</span>
  </div>
</div>

<hr>

<div class="row responsive-utilities-test visible-on">
  <div class="col-6 col-sm-4">
    <span class="hidden-sm-up visible">&#10004; Your viewport is exactly extra small</span>
    <span class="hidden-xs-down not-visible">Your viewport is NOT exactly extra small</span>
  </div>
  <div class="col-6 col-sm-4">
    <span class="hidden-xs-down hidden-md-up visible">&#10004; Your viewport is exactly small</span>
    <span class="hidden-sm-only not-visible">Your viewport is NOT exactly small</span>
  </div>
  <div class="col-6 col-sm-4">
    <span class="hidden-sm-down hidden-lg-up visible">&#10004; Your viewport is exactly medium</span>
    <span class="hidden-md-only not-visible">Your viewport is NOT exactly medium</span>
  </div>
  </div>

<div class="row responsive-utilities-test visible-on">
  <div class="col-6 col-sm-4">
    <span class="hidden-md-down hidden-xl-up visible">&#10004; Your viewport is exactly large</span>
    <span class="hidden-lg-only not-visible">Your viewport is NOT exactly large</span>
  </div>
  <div class="col-6 col-sm-4">
    <span class="hidden-lg-down visible">&#10004; Your viewport is exactly extra large</span>
    <span class="hidden-xl-only not-visible">Your viewport is NOT exactly extra large</span>
  </div>
</div>
