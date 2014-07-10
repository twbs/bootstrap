<a id="quick-start"></a>

# Quick start

Quickly add Bootstrap to your project via the [Bootstrap CDN](http://bootstrapcdn.com), graciously provided by the [MaxCDN](http://www.maxcdn.com/) folks. Copy-paste the stylesheet `<link>` into your `<head>` before all other stylesheets.

{% highlight html %}
<link rel="stylesheet" href="{{ site.cdn.css }}">
{% endhighlight %}

Then, add the Bootstrap JavaScript—and jQuery—near the end of your project. It's best placed right before the closing `</body>` tag. Be sure to place jQuery first.

{% highlight html %}
<script src="">jQuery</script>
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

    <script src="">jQuery</script>
    <script src="{{ site.cdn.js }}"></script>
  </body>
</html>
{% endhighlight %}

And that's it. Happy Bootstrapping!



<a id="download"></a>

# Download

Bootstrap is available for download via ZIP file in two flavors: precompiled CSS and Javascript, and the complete source code with documentation.

<a id="download-precompiled"></a>

### Precompiled

Compiled and minified CSS and JavaScript. No docs or original source files are included.

<a href="{{ site.download.dist }}" class="btn btn-lg btn-outline" role="button" onclick="ga('send', 'event', 'Getting started', 'Download', 'Download compiled');">Download Bootstrap</a>

<a id="download-source"></a>

### Source code and docs

Source Less, JavaScript, and documentation. **Requires a Less compiler and [some setup](#grunt).**

<a href="{{ site.download.source }}" class="btn btn-lg btn-outline" role="button" onclick="ga('send', 'event', 'Getting started', 'Download', 'Download source');">Download source</a>

<a id="download-bower"></a>

### Bower

Install and manage Bootstrap's Less, CSS, and JavaScript using [Bower](http://bower.io).

{% highlight bash %}$ bower install bootstrap{% endhighlight %}


<a id="download-npm"></a>

### npm

Bootstrap is available as [an npm package](https://www.npmjs.org/package/bootstrap). Install it into your Node powered apps with:

{% highlight bash %}$ npm install bootstrap{% endhighlight %}
