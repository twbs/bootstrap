---
layout: docs
title: Download
description: Download Bootstrap to get the compiled CSS and JavaScript, source code, or include it with your favorite package managers like npm, RubyGems, and more.
group: getting-started
toc: true
---

## Compiled CSS and JS

Download ready-to-use compiled code for **Bootstrap v{{ .Site.Params.current_version}}** to easily drop into your project, which includes:

- Compiled and minified CSS bundles (see [CSS files comparison]({{ .Site.BaseURL }}/docs/{{ .Site.Params.docs_version }}/getting-started/contents/#comparison-of-css-files))
- Compiled and minified JavaScript plugins

This doesn't include documentation, source files, or any optional JavaScript dependencies (jQuery and Popper.js).

<a href="{{ .Site.Params.download.dist }}" class="btn btn-bd-purple" onclick="ga('send', 'event', 'Getting started', 'Download', 'Download Bootstrap');">Download</a>

## Source files

Compile Bootstrap with your own asset pipeline by downloading our source Sass, JavaScript, and documentation files. This option requires some additional tooling:

- Sass compiler (Libsass or Ruby Sass is supported) for compiling your CSS.
- [Autoprefixer](https://github.com/postcss/autoprefixer) for CSS vendor prefixing

Should you require [build tools]({{ .Site.BaseURL }}/docs/{{ .Site.Params.docs_version }}/getting-started/build-tools/#tooling-setup), they are included for developing Bootstrap and its docs, but they're likely unsuitable for your own purposes.

<a href="{{ .Site.Params.download.source }}" class="btn btn-bd-purple" onclick="ga('send', 'event', 'Getting started', 'Download', 'Download source');">Download source</a>

## Bootstrap CDN

Skip the download with the Bootstrap CDN to deliver cached version of Bootstrap's compiled CSS and JS to your project.

{{< highlight html >}}
<link rel="stylesheet" href="{{ .Site.Params.cdn.css }}" integrity="{{ .Site.Params.cdn.css_hash }}" crossorigin="anonymous">
<script src="{{ .Site.Params.cdn.js }}" integrity="{{ .Site.Params.cdn.js_hash }}" crossorigin="anonymous"></script>
{{< /highlight >}}

If you're using our compiled JavaScript, don't forget to include CDN versions of jQuery and Popper.js before it.

{{< highlight html >}}
<script src="{{ .Site.Params.cdn.jquery }}" integrity="{{ .Site.Params.cdn.jquery_hash }}" crossorigin="anonymous"></script>
<script src="{{ .Site.Params.cdn.popper }}" integrity="{{ .Site.Params.cdn.popper_hash }}" crossorigin="anonymous"></script>
{{< /highlight >}}

## Package managers

Pull in Bootstrap's **source files** into nearly any project with some of the most popular package managers. No matter the package manager, Bootstrap will **require a Sass compiler and [Autoprefixer](https://github.com/postcss/autoprefixer)** for a setup that matches our official compiled versions.

### npm

Install Bootstrap in your Node.js powered apps with [the npm package](https://www.npmjs.com/package/bootstrap):

{{< highlight sh >}}
npm install bootstrap@{{ .Site.Params.current_version }}
{{< /highlight >}}

`require('bootstrap')` will load all of Bootstrap's jQuery plugins onto the jQuery object. The `bootstrap` module itself does not export anything. You can manually load Bootstrap's jQuery plugins individually by loading the `/js/*.js` files under the package's top-level directory.

Bootstrap's `package.json` contains some additional metadata under the following keys:

- `sass` - path to Bootstrap's main [Sass](http://sass-lang.com/) source file
- `style` - path to Bootstrap's non-minified CSS that's been precompiled using the default settings (no customization)

### RubyGems

Install Bootstrap in your Ruby apps using [Bundler](https://bundler.io/) (**recommended**) and [RubyGems](https://rubygems.org/) by adding the following line to your [`Gemfile`](https://bundler.io/gemfile.html):

{{< highlight ruby >}}
gem 'bootstrap', '~> {{ .Site.Params.current_ruby_version }}'
{{< /highlight >}}

Alternatively, if you're not using Bundler, you can install the gem by running this command:

{{< highlight sh >}}
gem install bootstrap -v {{ .Site.Params.current_ruby_version }}
{{< /highlight >}}

[See the gem's README](https://github.com/twbs/bootstrap-rubygem/blob/master/README.md) for further details.

### Composer

You can also install and manage Bootstrap's Sass and JavaScript using [Composer](https://getcomposer.org/):

{{< highlight sh >}}
composer require twbs/bootstrap:{{ .Site.Params.current_version }}
{{< /highlight >}}

### NuGet

If you develop in .NET, you can also install and manage Bootstrap's [CSS](https://www.nuget.org/packages/bootstrap/) or [Sass](https://www.nuget.org/packages/bootstrap.sass/) and JavaScript using [NuGet](https://www.nuget.org/):

{{< highlight powershell >}}
Install-Package bootstrap -Pre
{{< /highlight >}}

{{< highlight powershell >}}
Install-Package bootstrap.sass -Pre
{{< /highlight >}}

The `-Pre` is required until Bootstrap v4 has a stable release.
