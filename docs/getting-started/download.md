---
layout: page
title: Download
---

Bootstrap is available for download via ZIP file in two flavors: precompiled CSS and Javascript, and the complete source code with documentation.

## Contents

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## Custom builds

Need only a part of Bootstrap's CSS or JS? Use one of the custom builds to snag just what you need.

<div class="row">
  <div class="col-sm-4">
    <h3>Reboot</h3>
    <p>Includes variables/mixins, Normalize, and Reboot. No JavaScript.</p>
    <a class="btn btn-primary" href="#">Download</a>
  </div>
  <div class="col-sm-4">
    <h3>Grid only</h3>
    <p>Includes variables/mixins and our grid system. No JavaScript.</p>
    <a class="btn btn-primary" href="#">Download</a>
  </div>
  <div class="col-sm-4">
    <h3>Flexbox</h3>
    <p>All of Bootstrap, with flexbox support enabled and <strong>lower browser support</strong>.</p>
    <a class="btn btn-primary" href="#">Download</a>
  </div>
</div>

## Precompiled

Compiled and minified CSS and JavaScript. No docs or original source files are included.

<a href="{{ site.download.dist }}" class="btn btn-lg btn-outline" role="button" onclick="ga('send', 'event', 'Getting started', 'Download', 'Download compiled');">Download Bootstrap</a>

## Download source and docs

Source Sass, JavaScript, and documentation. **Requires a Sass compiler and [some setup](../compiling).**

<a href="{{ site.download.source }}" class="btn btn-lg btn-outline" role="button" onclick="ga('send', 'event', 'Getting started', 'Download', 'Download source');">Download source</a>

## Package managers

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

## Autoprefixer required

Bootstrap uses [Autoprefixer](https://github.com/postcss/autoprefixer) to deal with [CSS vendor prefixes](http://webdesign.about.com/od/css/a/css-vendor-prefixes.htm). If you're compiling Bootstrap from its source Sass and not using our Gruntfile, you'll need to integrate Autoprefixer into your build process yourself. If you're using precompiled Bootstrap or using our Gruntfile, you don't need to worry about this as Autoprefixer is already integrated into our Gruntfile.
