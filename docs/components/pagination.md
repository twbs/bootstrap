---
layout: docs
title: Pagination
group: components
---

Provide pagination links for your site or app with the multi-page pagination component, or the simpler [pager alternative](#pagination-pager).

## Contents

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## Default pagination

Simple pagination inspired by Rdio, great for apps and search results. The large block is hard to miss, easily scalable, and provides large click areas.

{% example html %}
<nav>
  <ul class="pagination">
    <li>
      <a href="#" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
        <span class="sr-only">Previous</span>
      </a>
    </li>
    <li><a href="#">1</a></li>
    <li><a href="#">2</a></li>
    <li><a href="#">3</a></li>
    <li><a href="#">4</a></li>
    <li><a href="#">5</a></li>
    <li>
      <a href="#" aria-label="Next">
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
    <li class="disabled">
      <a href="#" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
        <span class="sr-only">Previous</span>
      </a>
    </li>
    <li class="active">
      <a href="#">1 <span class="sr-only">(current)</span></a>
    </li>
    <li><a href="#">2</a></li>
    <li><a href="#">3</a></li>
    <li><a href="#">4</a></li>
    <li><a href="#">5</a></li>
    <li>
      <a href="#" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
        <span class="sr-only">Next</span>
      </a>
    </li>
  </ul>
</nav>
{% endexample %}

You can optionally swap out active or disabled anchors for `<span>`, or omit the anchor in the case of the prev/next arrows, to remove click functionality while retaining intended styles.

{% highlight html %}
<nav>
  <ul class="pagination">
    <li class="disabled">
      <span aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
        <span class="sr-only">Previous</span>
      </span>
    </li>
    <li class="active"><span>1 <span class="sr-only">(current)</span></span></li>
  </ul>
</nav>
{% endhighlight %}


### Sizing

Fancy larger or smaller pagination? Add `.pagination-lg` or `.pagination-sm` for additional sizes.

{% example html %}
<nav>
  <ul class="pagination pagination-lg">
    <li>
      <a href="#" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
        <span class="sr-only">Previous</span>
      </a>
    </li>
    <li><a href="#">1</a></li>
    <li><a href="#">2</a></li>
    <li><a href="#">3</a></li>
    <li>
      <a href="#" aria-label="Next">
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
    <li>
      <a href="#" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
        <span class="sr-only">Previous</span>
      </a>
    </li>
    <li><a href="#">1</a></li>
    <li><a href="#">2</a></li>
    <li><a href="#">3</a></li>
    <li>
      <a href="#" aria-label="Next">
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
    <li><a href="#">Previous</a></li>
    <li><a href="#">Next</a></li>
  </ul>
</nav>
{% endexample %}

### Aligned links

Alternatively, you can align each link to the sides:

{% example html %}
<nav>
  <ul class="pager">
    <li class="pager-prev"><a href="#">Older</a></li>
    <li class="pager-next"><a href="#">Newer</a></li>
  </ul>
</nav>
{% endexample %}


### Optional disabled state

Pager links also use the `.disabled` class.

{% example html %}
<nav>
  <ul class="pager">
    <li class="pager-prev disabled"><a href="#">Older</a></li>
    <li class="pager-next"><a href="#">Newer</a></li>
  </ul>
</nav>
{% endexample %}
