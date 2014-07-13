---
layout: page
title: Pagination
---

Provide pagination links for your site or app with the multi-page pagination component, or the simpler [pager alternative](#pagination-pager).

## Default pagination

Simple pagination inspired by Rdio, great for apps and search results. The large block is hard to miss, easily scalable, and provides large click areas.

{% example html %}
<ul class="pagination">
  <li><a href="#">&laquo;</a></li>
  <li><a href="#">1</a></li>
  <li><a href="#">2</a></li>
  <li><a href="#">3</a></li>
  <li><a href="#">4</a></li>
  <li><a href="#">5</a></li>
  <li><a href="#">&raquo;</a></li>
</ul>
{% endexample %}

### Disabled and active states

Links are customizable for different circumstances. Use `.disabled` for unclickable links and `.active` to indicate the current page.

{% example html %}
<ul class="pagination">
  <li class="disabled"><a href="#">&laquo;</a></li>
  <li class="active"><a href="#">1 <span class="sr-only">(current)</span></a></li>
  <li><a href="#">2</a></li>
  <li><a href="#">3</a></li>
  <li><a href="#">4</a></li>
  <li><a href="#">5</a></li>
  <li><a href="#">&raquo;</a></li>
</ul>
{% endexample %}

You can optionally swap out active or disabled anchors for `<span>` to remove click functionality while retaining intended styles.

{% highlight html %}
<ul class="pagination">
  <li class="disabled"><span>&laquo;</span></li>
  <li class="active"><span>1 <span class="sr-only">(current)</span></span></li>
  ...
</ul>
{% endhighlight %}


### Sizing

Fancy larger or smaller pagination? Add `.pagination-lg` or `.pagination-sm` for additional sizes.

{% example html %}
<ul class="pagination pagination-lg">
  <li><a href="#">&laquo;</a></li>
  <li><a href="#">1</a></li>
  <li><a href="#">2</a></li>
  <li><a href="#">3</a></li>
  <li><a href="#">&raquo;</a></li>
</ul>
{% endexample %}

{% example html %}
<ul class="pagination pagination-sm">
  <li><a href="#">&laquo;</a></li>
  <li><a href="#">1</a></li>
  <li><a href="#">2</a></li>
  <li><a href="#">3</a></li>
  <li><a href="#">&raquo;</a></li>
</ul>
{% endexample %}

## Pager

Quick previous and next links for simple pagination implementations with light markup and styles. It's great for simple sites like blogs or magazines.

### Default example

By default, the pager centers links.

{% example html %}
<ul class="pager">
  <li><a href="#">Previous</a></li>
  <li><a href="#">Next</a></li>
</ul>
{% endexample %}

### Aligned links

Alternatively, you can align each link to the sides:

{% example html %}
<ul class="pager">
  <li class="previous"><a href="#">&larr; Older</a></li>
  <li class="next"><a href="#">Newer &rarr;</a></li>
</ul>
{% endexample %}


### Optional disabled state

Pager links also use the `.disabled` class.

{% highlight html %}
<ul class="pager">
  <li class="previous disabled"><a href="#">&larr; Older</a></li>
  <li class="next"><a href="#">Newer &rarr;</a></li>
</ul>
{% endhighlight %}
