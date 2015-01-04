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

Source Sass, JavaScript, and documentation. **Requires a Sass compiler and [some setup](../compiling).**

<a href="{{ site.download.source }}" class="btn btn-lg btn-outline" role="button" onclick="ga('send', 'event', 'Getting started', 'Download', 'Download source');">Download source</a>

### Bower

You can also install and manage Bootstrap's Sass, CSS, and JavaScript using [Bower](http://bower.io).

{% highlight bash %}$ bower install bootstrap{% endhighlight %}

### npm

Bootstrap is available as [an npm package](https://www.npmjs.org/package/bootstrap). Install it into your Node powered apps with:

{% highlight bash %}$ npm install bootstrap{% endhighlight %}

### Autoprefixer required for Less/Sass

Bootstrap uses [Autoprefixer](https://github.com/postcss/autoprefixer) to deal with [CSS vendor prefixes](http://webdesign.about.com/od/css/a/css-vendor-prefixes.htm). If you're compiling Bootstrap from its Less/Sass source and not using our Gruntfile, you'll need to integrate Autoprefixer into your build process yourself. If you're using precompiled Bootstrap or using our Gruntfile, you don't need to worry about this because Autoprefixer is already integrated into our Gruntfile.
