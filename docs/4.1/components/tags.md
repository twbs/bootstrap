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

{% capture example %}
<div class="tag-group">
  <a href="#" class="tag">Some</a>
  <a href="#" class="tag">Tags</a>
  <a href="#" class="tag">Are</a>
  <a href="#" class="tag">Special</a>
</div>
{% endcapture %}
{% include example.html content=example %}

## Tag

A `tag` can also stand alone.

{% capture example %}
<a href="#" class="tag">Alone</a>
{% endcapture %}
{% include example.html content=example %}

## Tag-Group

A `tag-group` should consist of related `tags`.

{% capture example %}
<div class="tag-group">
  <a href="#" class="tag">Munich</a>
  <a href="#" class="tag">Frankfurt</a>
  <a href="#" class="tag">Berlin</a>
</div>
{% endcapture %}
{% include example.html content=example %}

## Sizes

Fancy smaller tags? Add `.tag-sm` for a smaller version.

{% capture example %}
<div class="tag-group">
  <a href="#" class="tag tag-sm">Kleinhüpfigen</a>
  <a href="#" class="tag tag-sm">Hinterdupfing</a>
  <a href="#" class="tag tag-sm">Ecking</a>
</div>
{% endcapture %}
{% include example.html content=example %}
