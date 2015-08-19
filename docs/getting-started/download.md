---
layout: docs
title: Download
group: getting-started
---

**Bootstrap v{{ site.current_version}}** is available for download in several ways, including some of your favorite package managers. Choose from the options below to snag just what you need.

<div class="row m-t-md">
  <div class="col-sm-6">
{% markdown %}
### Compiled
Download just the compiled and minified CSS and JavaScript. Doesn't include any documentation or original source files.

{% comment %}
<a href="{{ site.download.dist }}" class="btn btn-bs btn-outline" onclick="ga('send', 'event', 'Getting started', 'Download', 'Download compiled');">Download Bootstrap</a>
{% endcomment %}
<span class="text-muted">Coming soon!</span>
{% endmarkdown %}
  </div>
  <div class="col-sm-6">
{% markdown %}
### Source files
Download everything: source Sass, JavaScript, and documentation files. **Requires a Sass compiler, [Autoprefixer](https://github.com/postcss/autoprefixer), and [some setup](../compiling).**

<a href="{{ site.download.source }}" class="btn btn-bs btn-outline" onclick="ga('send', 'event', 'Getting started', 'Download', 'Download source');">Download source</a>
{% endmarkdown %}
  </div>
</div>

## Package managers

Pull in Bootstrap's **source files** into nearly any project with some of the most popular package managers. No matter the package manager, Bootstrap will **require a Sass compiler and [Autoprefixer](https://github.com/postcss/autoprefixer)** for a setup that matches our official compiled versions.

{% callout warning %}
**Heads up!** Not all package managers have the v4 alpha published yet, but we should have them up shortly!
{% endcallout %}

### Bower

Install and manage Bootstrap's Sass and JavaScript using [Bower](http://bower.io).

{% highlight bash %}$ bower install bootstrap{% endhighlight %}

### npm

Install Bootstrap in your Node powered apps with [the npm package](https://www.npmjs.org/package/bootstrap):

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

You can also install and manage Bootstrap's Sass and JavaScript using [Composer](https://getcomposer.org):

{% highlight bash %}
$ composer require twbs/bootstrap
{% endhighlight %}


## Custom builds

Need only a part of Bootstrap's CSS or JS? Use one of the custom builds to snag just what you need.

<div class="row">
  <div class="col-sm-4">
    <h3>Reboot</h3>
    <p>Includes variables/mixins, Normalize, and Reboot. No JavaScript.</p>
    <a class="btn btn-bs btn-outline" href="#">Download</a>
  </div>
  <div class="col-sm-4">
    <h3>Grid only</h3>
    <p>Includes variables/mixins and our grid system. No JavaScript.</p>
    <a class="btn btn-bs btn-outline" href="#">Download</a>
  </div>
  <div class="col-sm-4">
    <h3>Flexbox</h3>
    <p>All of Bootstrap with flexbox enabled and <strong>lower browser support</strong>.</p>
    <a class="btn btn-bs btn-outline" href="#">Download</a>
  </div>
</div>
