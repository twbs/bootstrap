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
- Compiled and minified JavaScript plugins (see [JS files comparison]({{< docsref "/getting-started/contents#js-files" >}}))

This doesn't include documentation, source files, or any optional JavaScript dependencies like Popper.

<a href="{{< param "download.dist" >}}" class="btn btn-bd-primary" onclick="ga('send', 'event', 'Getting started', 'Download', 'Download Bootstrap');">Download</a>

## Source files

Compile Bootstrap with your own asset pipeline by downloading our source Sass, JavaScript, and documentation files. This option requires some additional tooling:

- [Sass compiler]({{< docsref "/getting-started/contribute#sass" >}}) for compiling Sass source files into CSS files
- [Autoprefixer](https://github.com/postcss/autoprefixer) for CSS vendor prefixing

Should you require our full set of [build tools]({{< docsref "/getting-started/contribute#tooling-setup" >}}), they are included for developing Bootstrap and its docs, but they're likely unsuitable for your own purposes.

<a href="{{< param "download.source" >}}" class="btn btn-bd-primary" onclick="ga('send', 'event', 'Getting started', 'Download', 'Download source');">Download source</a>

## Examples

If you want to download and examine our [examples]({{< docsref "/examples" >}}), you can grab the already built examples:

<a href="{{< param "download.dist_examples" >}}" class="btn btn-bd-primary" onclick="ga('send', 'event', 'Getting started', 'Download', 'Download Examples');">Download Examples</a>

## CDN via jsDelivr

Skip the download with [jsDelivr](https://www.jsdelivr.com/) to deliver cached version of Bootstrap's compiled CSS and JS to your project.

```html
<link href="{{< param "cdn.css" >}}" rel="stylesheet" integrity="{{< param "cdn.css_hash" >}}" crossorigin="anonymous">
<script src="{{< param "cdn.js_bundle" >}}" integrity="{{< param "cdn.js_bundle_hash" >}}" crossorigin="anonymous"></script>
```

If you're using our compiled JavaScript and prefer to include Popper separately, add Popper before our JS, via a CDN preferably.

```html
<script src="{{< param "cdn.popper" >}}" integrity="{{< param "cdn.popper_hash" >}}" crossorigin="anonymous"></script>
<script src="{{< param "cdn.js" >}}" integrity="{{< param "cdn.js_hash" >}}" crossorigin="anonymous"></script>
```

## Package managers

Pull in Bootstrap's **source files** into nearly any project with some of the most popular package managers. No matter the package manager, Bootstrap will **require a [Sass compiler]({{< docsref "/getting-started/contribute#sass" >}}) and [Autoprefixer](https://github.com/postcss/autoprefixer)** for a setup that matches our official compiled versions.

### npm

Install Bootstrap in your Node.js powered apps with [the npm package](https://www.npmjs.com/package/bootstrap):

```sh
npm install bootstrap@{{< param "current_version" >}}
```

`const bootstrap = require('bootstrap')` or `import bootstrap from 'bootstrap'` will load all of Bootstrap's plugins onto a `bootstrap` object.
The `bootstrap` module itself exports all of our plugins. You can manually load Bootstrap's plugins individually by loading the `/js/dist/*.js` files under the package's top-level directory.

Bootstrap's `package.json` contains some additional metadata under the following keys:

- `sass` - path to Bootstrap's main [Sass](https://sass-lang.com/) source file
- `style` - path to Bootstrap's non-minified CSS that's been precompiled using the default settings (no customization)

{{< callout info >}}
{{< partial "callout-info-npm-starter.md" >}}
{{< /callout >}}

### yarn

Install Bootstrap in your Node.js powered apps with [the yarn package](https://yarnpkg.com/en/package/bootstrap):

```sh
yarn add bootstrap@{{< param "current_version" >}}
```

### RubyGems

Install Bootstrap in your Ruby apps using [Bundler](https://bundler.io/) (**recommended**) and [RubyGems](https://rubygems.org/) by adding the following line to your [`Gemfile`](https://bundler.io/gemfile.html):

```ruby
gem 'bootstrap', '~> {{< param current_ruby_version >}}'
```

Alternatively, if you're not using Bundler, you can install the gem by running this command:

```sh
gem install bootstrap -v {{< param current_ruby_version >}}
```

[See the gem's README](https://github.com/twbs/bootstrap-rubygem/blob/master/README.md) for further details.

### Composer

You can also install and manage Bootstrap's Sass and JavaScript using [Composer](https://getcomposer.org/):

```sh
composer require twbs/bootstrap:{{< param current_version >}}
```

### NuGet

If you develop in .NET Framework, you can also install and manage Bootstrap's [CSS](https://www.nuget.org/packages/bootstrap/) or [Sass](https://www.nuget.org/packages/bootstrap.sass/) and JavaScript using [NuGet](https://www.nuget.org/). Newer projects should use [libman](https://docs.microsoft.com/en-us/aspnet/core/client-side/libman/) or another method as NuGet is designed for compiled code, not frontend assets.

```powershell
Install-Package bootstrap
```

```powershell
Install-Package bootstrap.sass
```
