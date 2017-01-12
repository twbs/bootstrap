---
layout: docs
title: Download
description: Download Bootstrap's compiled CSS and JavaScript, source code, or include it with your favorite package manager.
group: getting-started
---

**Bootstrap v{{ site.current_version}}** is available for download in several ways, including some of your favorite package managers. Choose from the options below to snag just what you need.

## Contents

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## Bootstrap CSS and JS

**Download Bootstrap's ready-to-use code to easily drop into your project.** Includes compiled and minified versions of all our CSS bundles (default, grid only, or Reboot only) and JavaScript plugins. Doesn't include documentation or source files.

<a href="{{ site.download.dist }}" class="btn btn-lg btn-bs" onclick="ga('send', 'event', 'Getting started', 'Download', 'Download Bootstrap');">Download Bootstrap</a>

## Source files
**Want to compile Bootstrap with your project's asset pipeline?** Choose this option to download our source Sass, JavaScript, and documentation files. Requires a Sass compiler, [Autoprefixer](https://github.com/postcss/autoprefixer), [postcss-flexbugs-fixes](https://github.com/luisrudge/postcss-flexbugs-fixes), and [some setup]({{ site.baseurl }}/getting-started/build-tools/#tooling-setup).

<a href="{{ site.download.source }}" class="btn btn-bs" onclick="ga('send', 'event', 'Getting started', 'Download', 'Download source');">Download source</a>

## Bootstrap CDN

Skip the download and use the Bootstrap CDN to deliver Bootstrap's compiled CSS and JS to your project.

{% highlight html %}
<link rel="stylesheet" href="{{ site.cdn.css }}" integrity="{{ site.cdn.css_hash }}" crossorigin="anonymous">
<script src="{{ site.cdn.js }}" integrity="{{ site.cdn.js_hash }}" crossorigin="anonymous"></script>
{% endhighlight %}

## Package managers

Pull in Bootstrap's **source files** into nearly any project with some of the most popular package managers. No matter the package manager, Bootstrap will **require a Sass compiler, [Autoprefixer](https://github.com/postcss/autoprefixer), and [postcss-flexbugs-fixes](https://github.com/luisrudge/postcss-flexbugs-fixes)** for a setup that matches our official compiled versions.

### npm

Install Bootstrap in your Node powered apps with [the npm package](https://www.npmjs.org/package/bootstrap):

{% highlight bash %}
npm install bootstrap@{{ site.current_version }}
{% endhighlight %}

`require('bootstrap')` will load all of Bootstrap's jQuery plugins onto the jQuery object. The `bootstrap` module itself does not export anything. You can manually load Bootstrap's jQuery plugins individually by loading the `/js/*.js` files under the package's top-level directory.

Bootstrap's `package.json` contains some additional metadata under the following keys:

- `sass` - path to Bootstrap's main [Sass](http://sass-lang.com/) source file
- `style` - path to Bootstrap's non-minified CSS that's been precompiled using the default settings (no customization)

### RubyGems

Install Bootstrap in your Ruby apps using [Bundler](https://bundler.io/) (**recommended**) and [RubyGems](https://rubygems.org/) by adding the following line to your [`Gemfile`](https://bundler.io/gemfile.html):

{% highlight ruby %}
gem 'bootstrap', '~> 4.0.0.alpha6'
{% endhighlight %}

Alternatively, if you're not using Bundler, you can install the gem by running this command:

{% highlight bash %}
gem install bootstrap -v 4.0.0.alpha6
{% endhighlight %}

[See the gem's README](https://github.com/twbs/bootstrap-rubygem/blob/master/README.md) for further details.

### Composer

You can also install and manage Bootstrap's Sass and JavaScript using [Composer](https://getcomposer.org):

{% highlight bash %}
composer require twbs/bootstrap:{{ site.current_version }}
{% endhighlight %}

### Bower

Install and manage Bootstrap's Sass and JavaScript using [Bower](https://bower.io).

{% highlight bash %}
bower install bootstrap#v{{ site.current_version }}
{% endhighlight %}

### NuGet

If you develop in .NET, you can also install and manage Bootstrap's [CSS](https://www.nuget.org/packages/bootstrap/) or [Sass](https://www.nuget.org/packages/bootstrap.sass/) and JavaScript using [NuGet](https://www.nuget.org):

{% highlight powershell %}
Install-Package bootstrap -Pre
{% endhighlight %}

{% highlight powershell %}
Install-Package bootstrap.sass -Pre
{% endhighlight %}

The `-Pre` is required until Bootstrap v4 has a stable release.
