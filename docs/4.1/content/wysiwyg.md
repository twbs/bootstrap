---
layout: docs
title: WYSIWYG
description: Documentation and examples for displaying WYSIWYG content.
group: content
---

Styles for content created using a WYSIWYG editor.

## Contents

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## Paragraph margins

Inside a `.wysiwyg` paragraphs have no margin. This allows for the use of empty `p` usually the case when end users format content using a WYSIWYG editor.

{% capture example %}
<div class="wysiwyg">
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent non faucibus quam. Pellentesque venenatis odio justo, ac fermentum lacus molestie ac. Curabitur id orci sit amet nunc finibus commodo.</p>
  <p>&nbsp;</p>
  <p>Sed vel viverra leo. Sed rhoncus, felis in mattis rutrum, dui felis aliquam est, faucibus hendrerit odio nulla nec odio.</p>
</div>
{% endcapture %}
{% include example.html content=example %}

## List margins

Inside a `.wysiwyg` lists `ol` and `ul` don't have any margin to make it easier for the end user to format the content to his or her liking.

{% capture example %}
<div class="wysiwyg">
  <ol>
    <li>Lorem ipsum</li>
    <li>Dolor sit amet</li>
    <li>Consectetur adipiscing</li>
  </ol>
  <ul>
    <li>Lorem ipsum</li>
    <li>Dolor sit amet</li>
    <li>Consectetur adipiscing</li>
  </ul>
</div>
{% endcapture %}
{% include example.html content=example %}
