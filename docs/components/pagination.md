---
layout: docs
title: Pagination
group: components
---

Provide pagination links for your site or app with the multi-page pagination component, or the simpler [pager alternative](#pager).

## Contents

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## Default pagination

Simple pagination inspired by Rdio, great for apps and search results. The large block is hard to miss, easily scalable, and provides large click areas.

{% example html %}
<nav>
  <ul class="pagination">
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
        <span class="sr-only">Previous</span>
      </a>
    </li>
    <li class="page-item"><a class="page-link" href="#">1</a></li>
    <li class="page-item"><a class="page-link" href="#">2</a></li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item"><a class="page-link" href="#">4</a></li>
    <li class="page-item"><a class="page-link" href="#">5</a></li>
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
        <span class="sr-only">Next</span>
      </a>
    </li>
  </ul>
</nav>
{% endexample %}

### Disabled and active states

Links are customizable for different circumstances. Use `.disabled` for unclickable links and `.active` to indicate the current page.

{% example html %}
<nav>
  <ul class="pagination">
    <li class="page-item disabled">
      <a class="page-link" href="#" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
        <span class="sr-only">Previous</span>
      </a>
    </li>
    <li class="page-item active">
      <a class="page-link" href="#">1 <span class="sr-only">(current)</span></a>
    </li>
    <li class="page-item"><a class="page-link" href="#">2</a></li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item"><a class="page-link" href="#">4</a></li>
    <li class="page-item"><a class="page-link" href="#">5</a></li>
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
        <span class="sr-only">Next</span>
      </a>
    </li>
  </ul>
</nav>
{% endexample %}

You can optionally swap out active or disabled anchors for `<span>`, or omit the anchor in the case of the prev/next arrows, to remove click functionality while retaining intended styles.

{% example html %}
<nav>
  <ul class="pagination">
    <li class="page-item disabled">
      <span class="page-link" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
        <span class="sr-only">Previous</span>
      </span>
    </li>
    <li class="page-item active"><span class="page-link">1 <span class="sr-only">(current)</span></span></li>
  </ul>
</nav>
{% endexample %}


### Sizing

Fancy larger or smaller pagination? Add `.pagination-lg` or `.pagination-sm` for additional sizes.

{% example html %}
<nav>
  <ul class="pagination pagination-lg">
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
        <span class="sr-only">Previous</span>
      </a>
    </li>
    <li class="page-item"><a class="page-link" href="#">1</a></li>
    <li class="page-item"><a class="page-link" href="#">2</a></li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
        <span class="sr-only">Next</span>
      </a>
    </li>
  </ul>
</nav>
{% endexample %}

{% example html %}
<nav>
  <ul class="pagination pagination-sm">
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
        <span class="sr-only">Previous</span>
      </a>
    </li>
    <li class="page-item"><a class="page-link" href="#">1</a></li>
    <li class="page-item"><a class="page-link" href="#">2</a></li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
        <span class="sr-only">Next</span>
      </a>
    </li>
  </ul>
</nav>
{% endexample %}

## Pager

Quick previous and next links for simple pagination implementations with light markup and styles. It's great for simple sites like blogs or magazines.

### Default example

By default, the pager centers links.

{% example html %}
<nav>
  <ul class="pager">
    <li class="pager-item"><a class="pager-link" href="#">Previous</a></li>
    <li class="pager-item"><a class="pager-link" href="#">Next</a></li>
  </ul>
</nav>
{% endexample %}

### Aligned links

Alternatively, you can align each link to the sides:

{% example html %}
<nav>
  <ul class="pager">
    <li class="pager-item pager-prev"><a class="pager-link" href="#">Older</a></li>
    <li class="pager-item pager-next"><a class="pager-link" href="#">Newer</a></li>
  </ul>
</nav>
{% endexample %}


### Optional disabled state

Pager links also use the `.disabled` class.

{% example html %}
<nav>
  <ul class="pager">
    <li class="pager-item pager-prev"><a class="pager-link disabled" href="#">Older</a></li>
    <li class="pager-item pager-next"><a class="pager-link" href="#">Newer</a></li>
  </ul>
</nav>
{% endexample %}

### Without lists

Classes are used throughout, so your markup can be super flexible. Use `<ul>`s like above, or roll your own with say a `<nav>` element.

{% example html %}
<nav class="pager">
  <a class="pager-prev pager-link" href="#">Previous</a>
  <a class="pager-next pager-link" href="#">Next</a>
</nav>
{% endexample %}

### Pager texts

{% example html %}
<nav>
  <ul class="pager">
    <li class="pager-item"><span class="pager-text">Previous</span></li>
    <li class="pager-item"><span class="pager-text">Next</span></li>
  </ul>
</nav>
{% endexample %}
