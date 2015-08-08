---
layout: page
title: Quick start
group: getting-started
---

Looking to quickly add Bootstrap to your project? Use the Bootstrap CDN, graciously provided by the MaxCDN folks.

Copy-paste the stylesheet `<link>` into your `<head>` before all other stylesheets to load our CSS.

{% highlight html %}
<link rel="stylesheet" href="{{ site.cdn.css }}">
{% endhighlight %}

Add our JavaScript plugins and jQuery near the end of your pages, right before the closing `</body>` tag. Be sure to place jQuery first as our code depends on it.

{% highlight html %}
<script src="{{ site.cdn.jquery }}"></script>
<script src="{{ site.cdn.js }}"></script>
{% endhighlight %}

And that's it—you're your way to a fully Bootstrapped site. If you're at all unsure about the general page structure, keep reading for an example page template.

## Page template

Be sure to have your pages set up with the latest design and development standards. That means:

* Using an HTML5 doctype
* Forcing Internet Explorer to use its latest rendering mode ([read more]())
* And, utilizing the viewport meta tag.

Put it all together and your pages should look like this:

{% highlight html %}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="{{ site.cdn.css }}">
  </head>
  <body>
    <h1>Hello, world!</h1>

    <!-- jQuery first, then Bootstrap JS. -->
    <script src="{{ site.cdn.jquery }}"></script>
    <script src="{{ site.cdn.js }}"></script>
  </body>
</html>
{% endhighlight %}

That's all you need for overall page requirements. Visit the [Layout docs]({{ site.baseurl }}/layout/scaffolding) to start laying out your site's content before adding components.
