---
layout: page
title: Responsive embed
---

<div class="bs-docs-section">
  <h1 id="responsive-embed" class="page-header">Responsive embed</h1>

  <p>Allow browsers to determine video or slideshow dimensions based on the width of their containing block by creating an intrinsic ratio that will properly scale on any device.</p>
  <p>Rules are directly applied to <code>&lt;iframe&gt;</code>, <code>&lt;embed&gt;</code>, and <code>&lt;object&gt;</code> elements; optionally use an explicit descendant class <code>.embed-responsive-item</code> when you want to match the styling for other attributes.</p>
  <p><strong>Pro-Tip!</strong> You don't need to include <code>frameborder="0"</code> in your <code>&lt;iframe&gt;</code>s as we override that for you.</p>
  <div class="bs-example">
    <div class="embed-responsive embed-responsive-16by9">
      <iframe class="embed-responsive-item" src="//www.youtube.com/embed/zpOULjyy-n8?rel=0" allowfullscreen></iframe>
    </div>
  </div>
{% highlight html %}
<!-- 16:9 aspect ratio -->
<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="…"></iframe>
</div>

<!-- 4:3 aspect ratio -->
<div class="embed-responsive embed-responsive-4by3">
  <iframe class="embed-responsive-item" src="…"></iframe>
</div>
{% endhighlight %}
</div>
