---
layout: docs
title: Stretched link
description: Easily make an element which contains a stretched link clickable.
group: utilities
---

Adding the `.stretched-link` class to a link will make the [containing block](https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block) of the `::after` pseudo element of the link clickable. In most cases, this means that an element with `position: relative;` which contains a link with the `.stretched-link` class is clickable.

Cards are relative by default, so in this case you can safely add the `.stretched-link` class to a link in the card.

{% capture example %}
<div class="card" style="width: 18rem;">
  {% include icons/placeholder.svg width="100%" height="180" class="card-img-top" text=" " title="Card image cap" %}
  <div class="card-body">
    <h5 class="card-title">Card with stretched link</h5>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <a href="#" class="btn btn-primary stretched-link">Go somewhere</a>
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}

Media objects are not relative by default, we need to add the `.position-relative` here to prevent the link from stretching outside the media object.

{% capture example %}
<div class="media position-relative">
  {% include icons/placeholder.svg width="144" height="144" class="mr-3" text=" " title="Generic placeholder image" %}
  <div class="media-body">
    <h5 class="mt-0">Media with stretched link</h5>
    <p>Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.</p>
    <a href="#" class="stretched-link">Go somewhere</a>
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}

Columns are relative by default, so if we want to stretch the link over a row, we need to add the `.position-static` class to column and add the `.position-relative` to the row.

{% capture example %}
<div class="row no-gutters bg-light position-relative">
  <div class="col-md-6 mb-md-0 p-md-4">
    {% include icons/placeholder.svg width="100%" height="200" class="w-100" text=" " title="Generic placeholder image" %}
  </div>
  <div class="col-md-6 position-static p-4 pl-md-0">
    <h5 class="mt-0">Columns with stretched link</h5>
    <p>Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.</p>
    <a href="#" class="stretched-link">Go somewhere</a>
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}

Multiple links can be added to elements with a stretched link, but their `z-index` must be increased to be become clickable.

{% capture example %}
<div class="card" style="width: 18rem;">
  {% include icons/placeholder.svg width="100%" height="180" class="card-img-top" text=" " title="Card image cap" %}
  <div class="card-body">
    <h5 class="card-title">Card with multiple links</h5>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <p class="card-text">
      <a href="#" class="stretched-link">The whole card will be linked to this link</a>
    </p>
    <p class="card-text">
      <a href="#" class="text-danger">This link will be unclickable, because the previous link is stretched over this link</a>
    </p>
    <p class="card-text">
      <a href="#" style="position: relative; z-index: 2;" class="text-success">This link will be clickable because <code>position: relative</code> is added and the z-index is higher than the z-index of the <code>::after</code> pseudo element of the stretched link</a>
    </p>
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}

## Identifying the containing block

If the stretched link doesn't seem to work, the [containing block](https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#Identifying_the_containing_block) will probably be the cause. The following CSS properties will make an element the containing block:

- A `position` value other than `static`
- A `transform` or `perspective` value other than `none`
- A `will-change` value of `transform` or `perspective`
- A `filter` value other than `none` or a `will-change` value of `filter` (only works on Firefox)

{% capture example %}
<div class="card" style="width: 18rem;">
  {% include icons/placeholder.svg width="100%" height="180" class="card-img-top" text=" " title="Card image cap" %}
  <div class="card-body">
    <h5 class="card-title">Card with stretched links</h5>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <p class="card-text">
      <a href="#" class="stretched-link text-danger" style="position: relative;">Stretched link will not work here, because <code>position: relative</code> is added to the link</a>
    </p>
    <p class="card-text bg-light" style="transform: rotate(0);">
      This <a href="#" class="text-warning stretched-link">stretched link</a> will only be spread over the <code>p</code>-tag, because a transform is applied to it.
    </p>
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}
