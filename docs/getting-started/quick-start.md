---
layout: page
title: Quick start
---

Quickly add Bootstrap to your project via the [Bootstrap CDN](http://bootstrapcdn.com), graciously provided by the [MaxCDN](http://www.maxcdn.com/) folks. Copy-paste the stylesheet `<link>` into your `<head>` before all other stylesheets.

{% highlight html %}
<link rel="stylesheet" href="{{ site.cdn.css }}">
{% endhighlight %}

Then, add the Bootstrap JavaScript—and jQuery—near the end of your pages. It's best placed right before the closing `</body>` tag. Be sure to place jQuery first as our code depends on it.

{% highlight html %}
<script src="{{ site.cdn.jquery }}"></script>
<script src="{{ site.cdn.js }}"></script>
{% endhighlight %}

Be sure to have your pages set up with the latest design and development standards. That means:

* Using an HTML5 doctype
* Forcing Internet Explorer to use it's latest rendering mode ([read more]())
* And, utilizing the viewport meta tag.

Put it all together and your pages should look like this:

{% highlight html %}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <link rel="stylesheet" href="{{ site.cdn.css }}">
  </head>
  <body>
    <h1>Hello, world!</h1>

    <script src="{{ site.cdn.jquery }}"></script>
    <script src="{{ site.cdn.js }}"></script>
  </body>
</html>
{% endhighlight %}

And that's it. Happy Bootstrapping!
