---
layout: page
title: Scaffolding
---

The scaffolding of Bootstrap refers to our general approach to building the project. It outlines the basic document requirements and project dependencies.

Bootstrap's general approach to writing HTML, CSS, and JavaScript, as well as our core settings, is referred to as scaffolding. This includes required responsive and cross browser enhancements, dependencies, and more.

### HTML5 doctype

Bootstrap makes use of certain HTML elements and CSS properties that **require** the use of the HTML5 doctype. Include it at the beginning of all your projects.

{% highlight html %}
<!DOCTYPE html>
<html lang="en">
  ...
</html>
{% endhighlight %}

### Mobile first

Bootstrap is developed *mobile first*, a strategy in which we optimize code for mobile devices first and then scale up components as necessary using CSS media queries.

To ensure proper rendering and touch zooming, **add the viewport meta tag** to your `<head>`.

{% highlight html %}
<meta name="viewport" content="width=device-width, initial-scale=1">
{% endhighlight %}

### Normalize

For improved cross-browser rendering, we use [Normalize.css](http://necolas.github.io/normalize.css/) to correct small inconsistencies across browsers and devices.

### jQuery plugins

All our JavaScript plugins are built on top of jQuery.

### Important CSS resets

Still need to do this section. Should port the third party section about box sizing and edit it for here, then add the rest of the list items.

Will also require rearranging the scaffolding.less file.

- Box sizing
- Form elements and their fonts
- Global link colors
- Responsive images
