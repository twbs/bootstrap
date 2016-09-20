---
layout: docs
title: Figures
group: content
---

Anytime you need to display a piece of content—like an image—with an optional caption, consider using a `<figure>`.

Use the included `.figure` , `.figure-img` and `.figure-caption` classes to provide some baseline styles for the HTML5 `<figure>` and `<figcaption>` elements. Images in figures have no explicit size, so be sure to add the `.img-fluid` class to your `<img>` to make it responsive.

{% example html %}
<figure class="figure">
  <img data-src="holder.js/400x300" class="figure-img img-fluid img-rounded" alt="A generic square placeholder image with rounded corners in a figure.">
  <figcaption class="figure-caption">A caption for the above image.</figcaption>
</figure>
{% endexample %}

Aligning the figure's caption is easy with our [text utilities]({{ site.baseurl }}/components/utilities/#text-alignment).

{% example html %}
<figure class="figure">
  <img data-src="holder.js/400x300" class="figure-img img-fluid img-rounded" alt="A generic square placeholder image with rounded corners in a figure.">
  <figcaption class="figure-caption text-xs-right">A caption for the above image.</figcaption>
</figure>
{% endexample %}
