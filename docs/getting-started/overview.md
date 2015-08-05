---
layout: page
title: Getting started
lead: Quickly add Bootstrap to your project via the Bootstrap CDN, graciously provided by the MaxCDN folks.
---


## Include CSS and JS

Copy-paste the stylesheet `<link>` into your `<head>` before all other stylesheets.

<div class="alert alert-warning">
  <strong>Heads up!</strong> Much of this page will be inaccurate during the v4 alpha releases.
</div>

{% highlight html %}
<link rel="stylesheet" href="{{ site.cdn.css }}">
{% endhighlight %}

Then, add the Bootstrap JavaScript—and jQuery—near the end of your pages. It's best placed right before the closing `</body>` tag. Be sure to place jQuery first as our code depends on it.

{% highlight html %}
<script src="{{ site.cdn.jquery }}"></script>
<script src="{{ site.cdn.js }}"></script>
{% endhighlight %}

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
