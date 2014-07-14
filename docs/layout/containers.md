---
layout: page
title: Containers
---

Bootstrap requires a containing element to wrap site contents and house our grid system. You may choose from one of two containers—fixed width or fluid width—to use in your projects.

Containers *can* be nested, but be aware that most layouts don't require it.

Use `.container` for a responsive fixed width container. This will center content withing the viewport and apply the appropriate `width` for a given device size.

{% highlight html %}
<div class="container">
  ...
</div>
{% endhighlight %}

Use `.container-fluid` for a full width container, spanning the entire width of the viewport.

{% highlight html %}
<div class="container-fluid">
  ...
</div>
{% endhighlight %}
