---
layout: docs
title: Download
description: Download Bootstrap to get the compiled CSS and JavaScript, source code, or include it with your favorite package managers like npm, RubyGems, and more.
group: getting-started
toc: true
---

## Compiled CSS and JS

Download ready-to-use compiled code for **Bootstrap v{{< param current_version >}}** to easily drop into your project, which includes:

- Compiled and minified CSS bundles (see [CSS files comparison]({{< docsref "/getting-started/contents#css-files" >}}))
- Compiled and minified JavaScript plugins

This doesn't include documentation, source files, or any optional JavaScript dependencies like Popper.js.

<a href="{{< param "download.dist" >}}" class="btn btn-bd-primary" onclick="ga('send', 'event', 'Getting started', 'Download', 'Download Bootstrap');">Download</a>

## Source files

Compile Bootstrap with your own asset pipeline by downloading our source Sass, JavaScript, and documentation files. This option requires some additional tooling:

- Sass compiler (Libsass or Ruby Sass is supported) for compiling your CSS.
- [Autoprefixer](https://github.com/postcss/autoprefixer) for CSS vendor prefixing

Should you require [build tools]({{< docsref "/getting-started/build-tools#tooling-setup" >}}), they are included for developing Bootstrap and its docs, but they're likely unsuitable for your own purposes.

<a href="{{< param "download.source" >}}" class="btn btn-bd-primary" onclick="ga('send', 'event', 'Getting started', 'Download', 'Download source');">Download source</a>

## Examples

If you want to download and examine our [examples]({{< docsref "/examples" >}}), you can grab the already built examples:

<a href="{{< param "download.dist_examples" >}}" class="btn btn-bd-primary" onclick="ga('send', 'event', 'Getting started', 'Download', 'Download Examples');">Download Examples</a>

## BootstrapCDN

Skip the download with [BootstrapCDN](https://www.bootstrapcdn.com/) to deliver cached version of Bootstrap's compiled CSS and JS to your project.

{{< highlight html >}}
<link rel="stylesheet" href="{{< param "cdn.css" >}}" integrity="{{< param "cdn.css_hash" >}}" crossorigin="anonymous">
<script src="{{< param "cdn.js_bundle" >}}" integrity="{{< param "cdn.js_bundle_hash" >}}" crossorigin="anonymous"></script>
{{< /highlight >}}

If you're using our compiled JavaScript and prefer to include Popper.js separately, add Popper.js before our JS, via a CDN preferably.

{{< highlight html >}}
<script src="{{< param "cdn.popper" >}}" integrity="{{< param "cdn.popper_hash" >}}" crossorigin="anonymous"></script>
<script src="{{< param "cdn.js" >}}" integrity="{{< param "cdn.js_hash" >}}" crossorigin="anonymous"></script>
{{< /highlight >}}

## Package managers

Pull in Bootstrap's **source files** into nearly any project with some of the most popular package managers. No matter the package manager, Bootstrap will **require a Sass compiler and [Autoprefixer](https://github.com/postcss/autoprefixer)** for a setup that matches our official compiled versions.

### npm

Install Bootstrap in your Node.js powered apps with [the npm package](https://www.npmjs.com/package/bootstrap):

{{< highlight sh >}}
npm install bootstrap@next
{{< /highlight >}}

`const bootstrap = require('bootstrap')` or `import bootstrap from 'bootstrap'` will load all of Bootstrap's plugins onto a `bootstrap` object.
The `bootstrap` module itself exports all of our plugins. You can manually load Bootstrap's plugins individually by loading the `/js/dist/*.js` files under the package's top-level directory.

Bootstrap's `package.json` contains some additional metadata under the following keys:

- `sass` - path to Bootstrap's main [Sass](https://sass-lang.com/) source file
- `style` - path to Bootstrap's non-minified CSS that's been precompiled using the default settings (no customization)

### yarn

Install Bootstrap in your Node.js powered apps with [the yarn package](https://yarnpkg.com/en/package/bootstrap):

{{< highlight sh >}}
yarn add bootstrap@next
{{< /highlight >}}

### RubyGems

Install Bootstrap in your Ruby apps using [Bundler](https://bundler.io/) (**recommended**) and [RubyGems](https://rubygems.org/) by adding the following line to your [`Gemfile`](https://bundler.io/gemfile.html):

{{< highlight ruby >}}
gem 'bootstrap', '~> {{< param current_ruby_version >}}'
{{< /highlight >}}

Alternatively, if you're not using Bundler, you can install the gem by running this command:

{{< highlight sh >}}
gem install bootstrap -v {{< param current_ruby_version >}}
{{< /highlight >}}

[See the gem's README](https://github.com/twbs/bootstrap-rubygem/blob/master/README.md) for further details.

### Composer

You can also install and manage Bootstrap's Sass and JavaScript using [Composer](https://getcomposer.org/):

{{< highlight sh >}}
composer require twbs/bootstrap:{{< param current_version >}}
{{< /highlight >}}

### NuGet

If you develop in .NET, you can also install and manage Bootstrap's [CSS](https://www.nuget.org/packages/bootstrap/) or [Sass](https://www.nuget.org/packages/bootstrap.sass/) and JavaScript using [NuGet](https://www.nuget.org/):

{{< highlight powershell >}}
Install-Package bootstrap
{{< /highlight >}}

{{< highlight powershell >}}
Install-Package bootstrap.sass
{{< /highlight >}}
