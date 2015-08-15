---
layout: docs
title: Images
group: content
---

Anytime you need to display a piece of content—like an image—with an optional caption, consider using a `<figure>`.

Use the included `.figure` and `.figure-caption` classes to provide some baseline styles for the HTML5 `<figure>` and `<figcaption>` elements. As a bonus, immediate children images are automatically responsive.

{% example html %}
<figure class="figure">
  <img data-src="holder.js/400x300" class="img-rounded" alt="A generic square placeholder image with rounded corners in a figure.">
  <figcaption class="figure-caption">A caption for the above image.</figcaption>
</figure>
{% endexample %}

Aligning the figure's caption is easy with our [text utilities]().

{% example html %}
<figure class="figure">
  <img data-src="holder.js/400x300" class="img-rounded" alt="A generic square placeholder image with rounded corners in a figure.">
  <figcaption class="figure-caption text-right">A caption for the above image.</figcaption>
</figure>
{% endexample %}
