---
layout: docs
title: Download
group: getting-started
---


Bootstrap can come in one of two forms, as precompiled or source code. Learn more about each flavor's contents and structure below. Remember, no matter the implementation flavor, **Bootstrap's JavaScript plugins require jQuery**.

## Precompiled Bootstrap

Once downloaded, unzip the compressed folder and you'll see something like this:

<!-- NOTE: This info is intentionally duplicated in the README. Copy any changes made here over to the README too. -->

{% highlight bash %}
bootstrap/
├── css/
│   ├── bootstrap.css
│   ├── bootstrap.css.map
│   ├── bootstrap.min.css
│   └── bootstrap.min.css.map
└── js/
    ├── bootstrap.js
    └── bootstrap.min.js
{% endhighlight %}

This is the most basic form of Bootstrap: precompiled files for quick drop-in usage in nearly any web project. We provide compiled CSS and JS (`bootstrap.*`), as well as compiled and minified CSS and JS (`bootstrap.min.*`). CSS [source maps](https://developer.chrome.com/devtools/docs/css-preprocessors) (`bootstrap.*.map`) are available for use with certain browsers' developer tools.


### Custom builds

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


## Bootstrap source code

The Bootstrap source code download includes the precompiled CSS and JavaScript assets, along with source Sass, JavaScript, and documentation. More specifically, it includes the following and more:

{% highlight bash %}
bootstrap/
├── dist/
│   ├── css/
│   └── js/
├── docs/
│   └── examples/
├── js/
└── scss/
{% endhighlight %}

The `scss/` and `js/` are the source code for our CSS and JavaScript. The `dist/` folder includes everything listed in the precompiled download section above. The `docs/` folder includes the source code for our documentation, and `examples/` of Bootstrap usage. Beyond that, any other included file provides support for packages, license information, and development.




**Bootstrap v{{ site.current_version}}** is available for download in several ways, including some of your favorite package managers. Choose from the options below to snag just what you need.

<div class="row m-t-md">
  <div class="col-sm-6">
{% markdown %}
#### Compiled
Download just the compiled and minified CSS and JavaScript. Doesn't include any documentation or original source files.

{% comment %}
<a href="{{ site.download.dist }}" class="btn btn-bs btn-outline" onclick="ga('send', 'event', 'Getting started', 'Download', 'Download compiled');">Download Bootstrap</a>
{% endcomment %}
<span class="text-muted">Coming soon!</span>
{% endmarkdown %}
  </div>
  <div class="col-sm-6">
{% markdown %}
#### Source files
Download everything: source Sass, JavaScript, and documentation files. **Requires a Sass compiler, [Autoprefixer](https://github.com/postcss/autoprefixer), and [some setup]({{ site.baseurl }}/getting-started/build-tools/#tooling-setup).**

<a href="{{ site.download.source }}" class="btn btn-bs btn-outline" onclick="ga('send', 'event', 'Getting started', 'Download', 'Download source');">Download source</a>
{% endmarkdown %}
  </div>
</div>

### Package managers

Pull in Bootstrap's **source files** into nearly any project with some of the most popular package managers. No matter the package manager, Bootstrap will **require a Sass compiler and [Autoprefixer](https://github.com/postcss/autoprefixer)** for a setup that matches our official compiled versions.

{% callout warning %}
**Heads up!** Not all package managers have the v4 alpha published yet, but we should have them up shortly!
{% endcallout %}

#### Bower

Install and manage Bootstrap's Sass and JavaScript using [Bower](http://bower.io).

{% highlight bash %}$ bower install bootstrap#v{{ site.current_version }}{% endhighlight %}

#### npm

Install Bootstrap in your Node powered apps with [the npm package](https://www.npmjs.org/package/bootstrap):

{% highlight bash %}$ npm install bootstrap@{{ site.current_version }}{% endhighlight %}

`require('bootstrap')` will load all of Bootstrap's jQuery plugins onto the jQuery object. The `bootstrap` module itself does not export anything. You can manually load Bootstrap's jQuery plugins individually by loading the `/js/*.js` files under the package's top-level directory.

Bootstrap's `package.json` contains some additional metadata under the following keys:

- `sass` - path to Bootstrap's main [Sass](http://sass-lang.com/) source file
- `style` - path to Bootstrap's non-minified CSS that's been precompiled using the default settings (no customization)

#### Meteor

{% highlight bash %}
$ meteor add twbs:bootstrap@={{ site.current_version }}
{% endhighlight %}

#### Composer

You can also install and manage Bootstrap's Sass and JavaScript using [Composer](https://getcomposer.org):

{% highlight bash %}
$ composer require twbs/bootstrap
{% endhighlight %}

#### NuGet

If you develop in .NET, you can also install and manage Bootstrap's [CSS](https://www.nuget.org/packages/bootstrap/) or [Sass](https://www.nuget.org/packages/bootstrap.sass/) and JavaScript using [NuGet](https://www.nuget.org):

{% highlight powershell %}
PM> Install-Package bootstrap -Pre
PM> Install-Package bootstrap.sass -Pre
{% endhighlight %}

The `-Pre` is required until Bootstrap v4 has a stable release.
