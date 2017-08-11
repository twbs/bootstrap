---
layout: docs
title: Media object
description: Documentation and examples for Bootstrap's media object to construct highly repetitive components like blog comments, tweets, and the like.
group: layout
toc: true
---

## Example

The [media object](http://www.stubbornella.org/content/2010/06/25/the-media-object-saves-hundreds-of-lines-of-code/) helps build complex and repetitive components where some media is positioned alongside content that doesn't wrap around said media. Plus, it does this with only two required classes thanks to flexbox.

Below is an example of a single media object. Only two classes are required—the wrapping `.media` and the `.media-body` around your content. Optional padding and margin can be controlled through [spacing utilities]({{ site.baseurl }}/docs/{{ site.docs_version }}/utilities/spacing/).

{% example html %}
<div class="media">
  <img class="d-flex mr-3" data-src="holder.js/64x64" alt="Generic placeholder image">
  <div class="media-body">
    <h5 class="mt-0">Media heading</h5>
    Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
  </div>
</div>
{% endexample %}

{% callout warning %}
##### Flexbug #12: Inline elements aren't treated as flex items

Internet Explorer 10-11 do not render inline elements like links or images (or `::before` and `::after` pseudo-elements) as flex items. The only workaround is to set a non-inline `display` value (e.g., `block`, `inline-block`, or `flex`). We suggest using `.d-flex`, one of our [display utilities]({{ site.baseurl }}/docs/{{ site.docs_version }}/utilities/display/), as an easy fix.

**Source:** [Flexbugs on GitHub](https://github.com/philipwalton/flexbugs#12-inline-elements-are-not-treated-as-flex-items)
{% endcallout %}

## Nesting

Media objects can be infinitely nested, though we suggest you stop at some point. Place nested `.media` within the `.media-body` of a parent media object.

{% example html %}
<div class="media">
  <img class="d-flex mr-3" data-src="holder.js/64x64" alt="Generic placeholder image">
  <div class="media-body">
    <h5 class="mt-0">Media heading</h5>
    Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.

    <div class="media mt-3">
      <a class="d-flex pr-3" href="#">
        <img data-src="holder.js/64x64" alt="Generic placeholder image">
      </a>
      <div class="media-body">
        <h5 class="mt-0">Media heading</h5>
        Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
      </div>
    </div>
  </div>
</div>
{% endexample %}

## Alignment

Media in a media object can be aligned with flexbox utilities to the top (default), middle, or end of your `.media-body` content.

{% example html %}
<div class="media">
  <img class="d-flex align-self-start mr-3" data-src="holder.js/64x64" alt="Generic placeholder image">
  <div class="media-body">
    <h5 class="mt-0">Top-aligned media</h5>
    <p>Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.</p>
    <p>Donec sed odio dui. Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>
  </div>
</div>
{% endexample %}

{% example html %}
<div class="media">
  <img class="d-flex align-self-center mr-3" data-src="holder.js/64x64" alt="Generic placeholder image">
  <div class="media-body">
    <h5 class="mt-0">Center-aligned media</h5>
    <p>Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.</p>
    <p class="mb-0">Donec sed odio dui. Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>
  </div>
</div>
{% endexample %}

{% example html %}
<div class="media">
  <img class="d-flex align-self-end mr-3" data-src="holder.js/64x64" alt="Generic placeholder image">
  <div class="media-body">
    <h5 class="mt-0">Bottom-aligned media</h5>
    <p>Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.</p>
    <p class="mb-0">Donec sed odio dui. Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>
  </div>
</div>
{% endexample %}

## Order

Change the order of content in media objects by modifying the HTML itself, or by adding some custom flexbox CSS to set the `order` property (to an integer of your choosing).

{% example html %}
<div class="media">
  <div class="media-body">
    <h5 class="mt-0 mb-1">Media object</h5>
    Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
  </div>
  <img class="d-flex ml-3" data-src="holder.js/64x64" alt="Generic placeholder image">
</div>
{% endexample %}

## Media list

Because the media object has so few structural requirements, you can also use these classes on list HTML elements. On your `<ul>` or `<ol>`, add the `.list-unstyled` to remove any browser default list styles, and then apply `.media` to your `<li>`s. As always, use spacing utilities wherever needed to fine tune.

{% example html %}
<ul class="list-unstyled">
  <li class="media">
    <img class="d-flex mr-3" data-src="holder.js/64x64" alt="Generic placeholder image">
    <div class="media-body">
      <h5 class="mt-0 mb-1">List-based media object</h5>
      Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
    </div>
  </li>
  <li class="media my-4">
    <img class="d-flex mr-3" data-src="holder.js/64x64" alt="Generic placeholder image">
    <div class="media-body">
      <h5 class="mt-0 mb-1">List-based media object</h5>
      Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
    </div>
  </li>
  <li class="media">
    <img class="d-flex mr-3" data-src="holder.js/64x64" alt="Generic placeholder image">
    <div class="media-body">
      <h5 class="mt-0 mb-1">List-based media object</h5>
      Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
    </div>
  </li>
</ul>
{% endexample %}
