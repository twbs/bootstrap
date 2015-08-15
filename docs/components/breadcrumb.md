---
layout: docs
title: Breadcrumb
group: components
---

Indicate the current page's location within a navigational hierarchy.

Separators are automatically added in CSS through `:before` and `content`.

{% example html %}
<ol class="breadcrumb">
  <li class="active">Home</li>
</ol>
<ol class="breadcrumb">
  <li><a href="#">Home</a></li>
  <li class="active">Library</li>
</ol>
<ol class="breadcrumb" style="margin-bottom: 5px;">
  <li><a href="#">Home</a></li>
  <li><a href="#">Library</a></li>
  <li class="active">Data</li>
</ol>
{% endexample %}
