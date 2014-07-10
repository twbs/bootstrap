<a id="overview"></a>

# Overview

Get the lowdown on the key pieces of Bootstrap's infrastructure, including our approach to better, faster, stronger web development.



<a id="overview-doctype"></a>

### HTML5 doctype

Bootstrap makes use of certain HTML elements and CSS properties that require the use of the HTML5 doctype. Include it at the beginning of all your projects.

{% highlight html %}
<!DOCTYPE html>
<html lang="en">
  ...
</html>
{% endhighlight %}



<a id="overview-mobile"></a>

### Mobile first

With Bootstrap 2, we added optional mobile friendly styles for key aspects of the framework. With Bootstrap 3, we've rewritten the project to be mobile friendly from the start. Instead of adding on optional mobile styles, they're baked right into the core. In fact, **Bootstrap is mobile first**. Mobile first styles can be found throughout the entire library instead of in separate files.

To ensure proper rendering and touch zooming, **add the viewport meta tag** to your `<head>`.

{% highlight html %}
<meta name="viewport" content="width=device-width, initial-scale=1">
{% endhighlight %}

You can disable zooming capabilities on mobile devices by adding `user-scalable=no` to the viewport meta tag. This disables zooming, meaning users are only able to scroll, and results in your site feeling a bit more like a native application. Overall, we don't recommend this on every site, so use caution!

{% highlight html %}
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
{% endhighlight %}



<a id="overview-type-links"></a>

### Typography and links

Bootstrap sets basic global display, typography, and link styles. Specifically, we:

- Set `background-color: #fff;` on the `<body>`
- Use the `@font-family-base`, `@font-size-base`, and `@line-height-base` attributes as our typographic base
- Set the global link color via `@link-color` and apply link underlines only on `:hover`

These styles can be found within `scaffolding.less`.



<a id="overview-normalize"></a>

### Normalize

For improved cross-browser rendering, we use [Normalize.css](http://necolas.github.io/normalize.css/) to correct small inconsistencies across browsers and devices.



<a id="overview-containers"></a>

### Containers

Bootstrap requires a containing element to wrap site contents and house our grid system. You may choose one of two containers to use in your projects. Note that, due to `padding` and more, neither container is nestable.

Use `.container` for a responsive fixed width container.

{% highlight html %}
<div class="container">
  ...
</div>
{% endhighlight %}

Use `.container-fluid` for a full width container, spanning the entire width of your viewport.

{% highlight html %}
<div class="container-fluid">
  ...
</div>
{% endhighlight %}
