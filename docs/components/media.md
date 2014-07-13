---
layout: page
title: Media
---

<div class="bs-docs-section">
  <h1 id="media" class="page-header">Media object</h1>

  <p class="lead">Abstract object styles for building various types of components (like blog comments, Tweets, etc) that feature a left- or right-aligned image alongside textual content.</p>

  <h3 id="media-default">Default media</h3>
  <p>The default media allow to float a media object (images, video, audio) to the left or right of a content block.</p>
  <div class="bs-example">
    <div class="media">
      <a class="pull-left" href="#">
        <img class="media-object" data-src="holder.js/64x64" alt="Generic placeholder image">
      </a>
      <div class="media-body">
        <h4 class="media-heading">Media heading</h4>
        Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
      </div>
    </div>
    <div class="media">
      <a class="pull-left" href="#">
        <img class="media-object" data-src="holder.js/64x64" alt="Generic placeholder image">
      </a>
      <div class="media-body">
        <h4 class="media-heading">Media heading</h4>
        Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
        <div class="media">
          <a class="pull-left" href="#">
            <img class="media-object" data-src="holder.js/64x64" alt="Generic placeholder image">
          </a>
          <div class="media-body">
            <h4 class="media-heading">Nested media heading</h4>
            Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
          </div>
        </div>
      </div>
    </div>
  </div><!-- /.bs-example -->
{% highlight html %}
<div class="media">
  <a class="pull-left" href="#">
    <img class="media-object" src="..." alt="...">
  </a>
  <div class="media-body">
    <h4 class="media-heading">Media heading</h4>
    ...
  </div>
</div>
{% endhighlight %}

  <h3 id="media-list">Media list</h3>
  <p>With a bit of extra markup, you can use media inside list (useful for comment threads or articles lists).</p>
  <div class="bs-example">
    <ul class="media-list">
      <li class="media">
        <a class="pull-left" href="#">
          <img class="media-object" data-src="holder.js/64x64" alt="Generic placeholder image">
        </a>
        <div class="media-body">
          <h4 class="media-heading">Media heading</h4>
          <p>Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.</p>
          <!-- Nested media object -->
          <div class="media">
            <a class="pull-left" href="#">
              <img class="media-object" data-src="holder.js/64x64" alt="Generic placeholder image">
            </a>
            <div class="media-body">
              <h4 class="media-heading">Nested media heading</h4>
              Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
              <!-- Nested media object -->
              <div class="media">
                <a class="pull-left" href="#">
                  <img class="media-object" data-src="holder.js/64x64" alt="Generic placeholder image">
                </a>
                <div class="media-body">
                  <h4 class="media-heading">Nested media heading</h4>
                  Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
                </div>
              </div>
            </div>
          </div>
          <!-- Nested media object -->
          <div class="media">
            <a class="pull-left" href="#">
              <img class="media-object" data-src="holder.js/64x64" alt="Generic placeholder image">
            </a>
            <div class="media-body">
              <h4 class="media-heading">Nested media heading</h4>
              Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
            </div>
          </div>
        </div>
      </li>
      <li class="media">
        <a class="pull-right" href="#">
          <img class="media-object" data-src="holder.js/64x64" alt="Generic placeholder image">
        </a>
        <div class="media-body">
          <h4 class="media-heading">Media heading</h4>
          Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
        </div>
      </li>
    </ul>
  </div>
{% highlight html %}
<ul class="media-list">
  <li class="media">
    <a class="pull-left" href="#">
      <img class="media-object" src="..." alt="...">
    </a>
    <div class="media-body">
      <h4 class="media-heading">Media heading</h4>
      ...
    </div>
  </li>
</ul>
{% endhighlight %}
</div>
