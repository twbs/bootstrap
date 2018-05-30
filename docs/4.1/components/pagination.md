---
layout: docs
title: Pagination
description: Documentation and examples for showing pagination to indicate a series of related content exists across multiple pages.
group: components
toc: true
---

## Overview

We use a large block of connected links for our pagination, making links hard to miss and easily scalable—all while providing large hit areas. Pagination is built with list HTML elements so screen readers can announce the number of available links. Use a wrapping `<nav>` element to identify it as a navigation section to screen readers and other assistive technologies.

In addition, as pages likely have more than one such navigation section, it's advisable to provide a descriptive `aria-label` for the `<nav>` to reflect its purpose. For example, if the pagination component is used to navigate between a set of search results, an appropriate label could be `aria-label="Search results pages"`.

{% capture example %}
<nav class="card" aria-label="Page navigation example">
  <ul class="pagination">
    <li class="page-item page-prev"><a class="page-link" href="#">Previous</a></li>
    <li class="page-item"><a class="page-link" href="#">1</a></li>
    <li class="page-item"><a class="page-link" href="#">2</a></li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item page-next"><a class="page-link" href="#">Next</a></li>
  </ul>
</nav>
{% endcapture %}
{% include example.html content=example %}

## Working with icons

Looking to use an icon or symbol in place of text for some pagination links? Be sure to provide proper screen reader support with `aria` attributes and the `.sr-only` utility.

{% capture example %}
<nav class="card" aria-label="Page navigation example">
  <ul class="pagination">
    <li class="page-item page-prev">
      <a class="page-link" href="#" aria-label="Previous">
        <span aria-hidden="true" class="icon-arrow-left"></span>
        <span class="sr-only">Previous</span>
      </a>
    </li>
    <li class="page-item"><a class="page-link" href="#">1</a></li>
    <li class="page-item"><a class="page-link" href="#">2</a></li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item page-next">
      <a class="page-link" href="#" aria-label="Next">
        <span aria-hidden="true" class="icon-arrow-right"></span>
        <span class="sr-only">Next</span>
      </a>
    </li>
  </ul>
</nav>
{% endcapture %}
{% include example.html content=example %}

{% capture example %}
<nav class="card" aria-label="Page navigation example">
  <ul class="pagination">
    <li class="page-item page-prev">
      <a class="page-link" href="#" aria-label="Previous">
        <span aria-hidden="true" class="icon-arrow-left"></span> Previous
      </a>
    </li>
    <li class="page-item"><a class="page-link" href="#">1</a></li>
    <li class="page-item"><a class="page-link" href="#">2</a></li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item page-next">
      <a class="page-link" href="#" aria-label="Next">
        Next <span aria-hidden="true" class="icon-arrow-right"></span>
      </a>
    </li>
  </ul>
</nav>
{% endcapture %}
{% include example.html content=example %}

## Disabled and active states

Pagination links are customizable for different circumstances. Use `.disabled` for links that appear un-clickable and `.active` to indicate the current page.

While the `.disabled` class uses `pointer-events: none` to _try_ to disable the link functionality of `<a>`s, that CSS property is not yet standardized and doesn't account for keyboard navigation. As such, you should always add `tabindex="-1"` on disabled links and use custom JavaScript to fully disable their functionality.

{% capture example %}
<nav class="card" aria-label="...">
  <ul class="pagination">
    <li class="page-item page-prev disabled">
      <a class="page-link" href="#" tabindex="-1">Previous</a>
    </li>
    <li class="page-item"><a class="page-link" href="#">1</a></li>
    <li class="page-item active">
      <a class="page-link" href="#">2 <span class="sr-only">(current)</span></a>
    </li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item page-next">
      <a class="page-link" href="#">Next</a>
    </li>
  </ul>
</nav>
{% endcapture %}
{% include example.html content=example %}

You can optionally swap out active or disabled anchors for `<span>`, or omit the anchor in the case of the prev/next arrows, to remove click functionality and prevent keyboard focus while retaining intended styles.

{% capture example %}
<nav class="card" aria-label="...">
  <ul class="pagination">
    <li class="page-item page-prev disabled">
      <span class="page-link">Previous</span>
    </li>
    <li class="page-item"><a class="page-link" href="#">1</a></li>
    <li class="page-item active">
      <span class="page-link">
        2
        <span class="sr-only">(current)</span>
      </span>
    </li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item page-next">
      <a class="page-link" href="#">Next</a>
    </li>
  </ul>
</nav>
{% endcapture %}
{% include example.html content=example %}

## Sizing

Fancy larger or smaller pagination? Add `.pagination-lg` or `.pagination-sm` for additional sizes.

{% capture example %}
<nav class="card" aria-label="...">
  <ul class="pagination pagination-lg">
    <li class="page-item page-prev disabled">
      <a class="page-link" href="#" tabindex="-1">Previous</a>
    </li>
    <li class="page-item"><a class="page-link" href="#">2</a></li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item page-next">
      <a class="page-link" href="#">Next</a>
    </li>
  </ul>
</nav>
{% endcapture %}
{% include example.html content=example %}

{% capture example %}
<nav class="card" aria-label="...">
  <ul class="pagination pagination-sm">
    <li class="page-item page-prev disabled">
      <a class="page-link" href="#" tabindex="-1">Previous</a>
    </li>
    <li class="page-item"><a class="page-link" href="#">1</a></li>
    <li class="page-item"><a class="page-link" href="#">2</a></li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item page-next">
      <a class="page-link" href="#">Next</a>
    </li>
  </ul>
</nav>
{% endcapture %}
{% include example.html content=example %}
