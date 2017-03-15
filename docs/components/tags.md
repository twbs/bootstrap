---
layout: docs
title: Tags
description: Documentation and examples for tags, and tag-groups.
group: components
---

Use tags to indicate contextual filtering of results or general content.

## Contents

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## Example

A `tag` can be used standalone or grouped in a `tag-group`.

{% example html %}
<div class="tag-group">
  <a href="#" class="tag">Some</a>
  <a href="#" class="tag">Tags</a>
  <a href="#" class="tag">Are</a>
  <a href="#" class="tag">Special</a>
</div>
{% endexample %}

## Tag

A `tag` can also stand alone.

{% example html %}
<a href="#" class="tag">Alone</a>
{% endexample %}

## Tag-Group

A `tag-group` should consist of related `tags`.

{% example html %}
<div class="tag-group">
  <a href="#" class="tag">Munich</a>
  <a href="#" class="tag">Frankfurt</a>
  <a href="#" class="tag">Berlin</a>
</div>
{% endexample %}
