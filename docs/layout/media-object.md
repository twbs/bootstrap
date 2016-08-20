---
layout: docs
title: Media object
group: layout
---

The [media object](http://www.stubbornella.org/content/2010/06/25/the-media-object-saves-hundreds-of-lines-of-code/) is an abstract element used as the basis for building more complex and repetitive components (like blog comments, Tweets, etc). Included is support for left and right aligned content, content alignment options, nesting, and more.

{% callout info %}
**Heads up!** When [flexbox mode]({{ site.baseurl }}/getting-started/flexbox/) is enabled, the media object will use `flex` styles wherever possible.
{% endcallout %}

## Contents

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## Default media

The default media allow to float a media object (images, video, audio) to the left or right of a content block.

{% example html %}
<div class="media">
  <a class="media-left" href="#">
    <img class="media-object" data-src="holder.js/64x64" alt="Generic placeholder image">
  </a>
  <div class="media-body">
    <h4 class="media-heading">Media heading</h4>
    Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
  </div>
</div>
{% endexample %}

## Nesting

Media components can also be nested.

{% example html %}
<div class="media">
  <div class="media-left">
    <a href="#">
      <img class="media-object" data-src="holder.js/64x64" alt="Generic placeholder image">
    </a>
  </div>
  <div class="media-body">
    <h4 class="media-heading">Media heading</h4>
    Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
    <div class="media m-t-2">
      <a class="media-left" href="#">
        <img class="media-object" data-src="holder.js/64x64" alt="Generic placeholder image">
      </a>
      <div class="media-body">
        <h4 class="media-heading">Nested media heading</h4>
        Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
      </div>
    </div>
  </div>
</div>
{% endexample %}

## Alignment

The images or other media can be aligned top, middle, or bottom. The default is top aligned.

{% example html %}
<div class="media">
  <div class="media-left">
    <a href="#">
      <img class="media-object" data-src="holder.js/64x64" alt="Generic placeholder image">
    </a>
  </div>
  <div class="media-body">
    <h4 class="media-heading">Top aligned media</h4>
    <p>Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.</p>
    <p>Donec sed odio dui. Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>
  </div>
</div>
{% endexample %}

{% example html %}
<div class="media">
  <div class="media-left media-middle">
    <a href="#">
      <img class="media-object" data-src="holder.js/64x64" alt="Generic placeholder image">
    </a>
  </div>
  <div class="media-body">
    <h4 class="media-heading">Middle aligned media</h4>
    <p>Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.</p>
    <p>Donec sed odio dui. Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>
  </div>
</div>
{% endexample %}

{% example html %}
<div class="media">
  <div class="media-left media-bottom">
    <a href="#">
      <img class="media-object" data-src="holder.js/64x64" alt="Generic placeholder image">
    </a>
  </div>
  <div class="media-body">
    <h4 class="media-heading">Bottom aligned media</h4>
    <p>Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.</p>
    <p>Donec sed odio dui. Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>
  </div>
</div>
{% endexample %}

## Media list

With a bit of extra markup, you can use media inside list (useful for comment threads or articles lists).

{% example html %}
<ul class="media-list">
  <li class="media">
    <div class="media-left">
      <a href="#">
        <img class="media-object" data-src="holder.js/64x64" alt="Generic placeholder image">
      </a>
    </div>
    <div class="media-body">
      <h4 class="media-heading">Media heading</h4>
      <p>Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.</p>
      <!-- Nested media object -->
      <div class="media m-t-2">
        <a class="media-left" href="#">
          <img class="media-object" data-src="holder.js/64x64" alt="Generic placeholder image">
        </a>
        <div class="media-body">
          <h4 class="media-heading">Nested media heading</h4>
          Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
          <!-- Nested media object -->
          <div class="media m-t-2">
            <div class="media-left">
              <a href="#">
                <img class="media-object" data-src="holder.js/64x64" alt="Generic placeholder image">
              </a>
            </div>
            <div class="media-body">
              <h4 class="media-heading">Nested media heading</h4>
              Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
            </div>
          </div>
        </div>
      </div>
      <!-- Nested media object -->
      <div class="media m-t-2">
        <div class="media-left">
          <a href="#">
            <img class="media-object" data-src="holder.js/64x64" alt="Generic placeholder image">
          </a>
        </div>
        <div class="media-body">
          <h4 class="media-heading">Nested media heading</h4>
          Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
        </div>
      </div>
    </div>
  </li>
  <li class="media m-t-2">
    <div class="media-body">
      <h4 class="media-heading">Media heading</h4>
      Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
    </div>
    <div class="media-right">
      <a href="#">
        <img class="media-object" data-src="holder.js/64x64" alt="Generic placeholder image">
      </a>
    </div>
  </li>
</ul>
{% endexample %}
