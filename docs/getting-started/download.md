---
layout: docs
title: Download
group: getting-started
---

**Bootstrap v{{ site.current_version}}** is available for download in several ways, including some of your favorite package managers. Choose from the options below to snag just what you need.

### Source files
Download everything: source Sass, JavaScript, and documentation files. **Requires a Sass compiler, [Autoprefixer](https://github.com/postcss/autoprefixer), [postcss-flexbugs-fixes](https://github.com/luisrudge/postcss-flexbugs-fixes), and [some setup]({{ site.baseurl }}/getting-started/build-tools/#tooling-setup).**

<a href="{{ site.download.source }}" class="btn btn-bs btn-outline" onclick="ga('send', 'event', 'Getting started', 'Download', 'Download source');">Download source</a>

## Package managers

Pull in Bootstrap's **source files** into nearly any project with some of the most popular package managers. No matter the package manager, Bootstrap will **require a Sass compiler, [Autoprefixer](https://github.com/postcss/autoprefixer), and [postcss-flexbugs-fixes](https://github.com/luisrudge/postcss-flexbugs-fixes)** for a setup that matches our official compiled versions.

{% callout warning %}
**Heads up!** Not all package managers have the v4 alpha published yet, but we should have them up shortly!
{% endcallout %}

### npm

Install Bootstrap in your Node powered apps with [the npm package](https://www.npmjs.org/package/bootstrap):

{% highlight bash %}
$ npm install bootstrap@{{ site.current_version }}
{% endhighlight %}

`require('bootstrap')` will load all of Bootstrap's jQuery plugins onto the jQuery object. The `bootstrap` module itself does not export anything. You can manually load Bootstrap's jQuery plugins individually by loading the `/js/*.js` files under the package's top-level directory.

Bootstrap's `package.json` contains some additional metadata under the following keys:

- `sass` - path to Bootstrap's main [Sass](http://sass-lang.com/) source file
- `style` - path to Bootstrap's non-minified CSS that's been precompiled using the default settings (no customization)

### RubyGems

Install Bootstrap in your Ruby apps using [Bundler](http://bundler.io/) (**recommended**) and [RubyGems](https://rubygems.org/) by adding the following line to your [`Gemfile`](http://bundler.io/gemfile.html):

{% highlight ruby %}
gem 'bootstrap', '~> 4.0.0.alpha3'
{% endhighlight %}

Alternatively, if you're not using Bundler, you can install the gem by running this command:

{% highlight bash %}
$ gem install bootstrap -v 4.0.0.alpha3
{% endhighlight %}

[See the gem's README](https://github.com/twbs/bootstrap-rubygem/blob/master/README.md) for further details.

### Meteor

{% highlight bash %}
$ meteor add twbs:bootstrap@={{ site.current_version }}
{% endhighlight %}

### Composer

You can also install and manage Bootstrap's Sass and JavaScript using [Composer](https://getcomposer.org):

{% highlight bash %}
$ composer require twbs/bootstrap:{{ site.current_version }}
{% endhighlight %}

### Bower

Install and manage Bootstrap's Sass and JavaScript using [Bower](http://bower.io).

{% highlight bash %}
$ bower install bootstrap#v{{ site.current_version }}
{% endhighlight %}

### NuGet

If you develop in .NET, you can also install and manage Bootstrap's [CSS](https://www.nuget.org/packages/bootstrap/) or [Sass](https://www.nuget.org/packages/bootstrap.sass/) and JavaScript using [NuGet](https://www.nuget.org):

{% highlight powershell %}
PM> Install-Package bootstrap -Pre
PM> Install-Package bootstrap.sass -Pre
{% endhighlight %}

The `-Pre` is required until Bootstrap v4 has a stable release.

{% comment %}
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
{% endcomment %}
