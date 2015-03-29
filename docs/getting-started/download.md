---
layout: page
title: Download
---

Bootstrap is available for download via ZIP file in two flavors: precompiled CSS and Javascript, and the complete source code with documentation.

{% comment %}
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
{% endcomment %}

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

`require('bootstrap')` will load all of Bootstrap's jQuery plugins onto the jQuery object. The `bootstrap` module itself does not export anything. You can manually load Bootstrap's jQuery plugins individually by loading the `/js/*.js` files under the package's top-level directory.

Bootstrap's `package.json` contains some additional metadata under the following keys:

- `less` - path to Bootstrap's main [Less](http://lesscss.org) source file
- `style` - path to Bootstrap's non-minified CSS that's been precompiled using the default settings (no customization)

### Meteor

{% highlight bash %}
$ meteor add twbs:bootstrap
{% endhighlight %}

### Composer

{% highlight bash %}
$ composer require twbs/bootstrap
{% endhighlight %}


### Autoprefixer required

Bootstrap uses [Autoprefixer](https://github.com/postcss/autoprefixer) to deal with [CSS vendor prefixes](http://webdesign.about.com/od/css/a/css-vendor-prefixes.htm). If you're compiling Bootstrap from its source Sass and not using our Gruntfile, you'll need to integrate Autoprefixer into your build process yourself. If you're using precompiled Bootstrap or using our Gruntfile, you don't need to worry about this as Autoprefixer is already integrated into our Gruntfile.
