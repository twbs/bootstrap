---
layout: page
title: Download
---

Bootstrap is available for download via ZIP file in two flavors: precompiled CSS and Javascript, and the complete source code with documentation.

## Optional builds

### Scaffolding only
Just our global CSS resets, including Normalize and more. No custom CSS components or JavaScript.

### Grid only
Literally just our grid container and columns. No global CSS resets, custom CSS components, or JavaScript.

### Individual components
Choose what CSS and JS components to download and customize further for your own use. Include the global CSS resets.

### Kitchen sink
Download the entire project and quickly get developing. Includes all CSS and JavaScript, including the source files and basic build tools.

---

### Precompiled

Compiled and minified CSS and JavaScript. No docs or original source files are included.

<a href="{{ site.download.dist }}" class="btn btn-lg btn-outline" role="button" onclick="ga('send', 'event', 'Getting started', 'Download', 'Download compiled');">Download Bootstrap</a>

### Download source and docs

Source Sass, JavaScript, and documentation. **Requires a Sass compiler and [some setup](#grunt).**

<a href="{{ site.download.source }}" class="btn btn-lg btn-outline" role="button" onclick="ga('send', 'event', 'Getting started', 'Download', 'Download source');">Download source</a>

### Bower

You can also install and manage Bootstrap's Sass, CSS, and JavaScript using [Bower](http://bower.io).

{% highlight bash %}$ bower install bootstrap{% endhighlight %}

### npm

Bootstrap is available as [an npm package](https://www.npmjs.org/package/bootstrap). Install it into your Node powered apps with:

{% highlight bash %}$ npm install bootstrap{% endhighlight %}
