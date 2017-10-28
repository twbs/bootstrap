---
layout: docs
title: Webpack
description: Learn how to include Bootstrap in your project using Webpack 2.
group: getting-started
toc: true
---

## Installing Bootstrap

[Install bootstrap]({{ .Site.BaseURL }}/docs/{{ .Site.Params.docs_version }}/getting-started/download/#npm) as a Node.js module using npm.

## Importing JavaScript

Import [Bootstrap's JavaScript]({{ .Site.BaseURL }}/docs/{{ .Site.Params.docs_version }}/getting-started/javascript/) by adding this line to your app's entry point (usually `index.js` or `app.js`):

{{< highlight js >}}
import 'bootstrap';
{{< /highlight >}}

Alternatively, you may **import plugins individually** as needed:

{{< highlight js >}}
import 'bootstrap/js/dist/util';
import 'bootstrap/js/dist/dropdown';
...
{{< /highlight >}}

Bootstrap is dependent on [jQuery](https://jquery.com/) and [Popper](https://popper.js.org/), so npm will install them for you if needed. But they must be explicitly provided by webpack. Add the following code to the `plugins` section in your webpack config file:

{{< highlight js >}}
  plugins: [
    ...
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        Popper: ['popper.js', 'default'],
        // In case you imported plugins individually, you must also require them here:
        Util: "exports-loader?Util!bootstrap/js/dist/util",
        Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
        ...
      })
    ...
  ]
{{< /highlight >}}

{{< callout warning >}}
Notice that if you chose to **import plugins individually**, you must also install [exports-loader](https://github.com/webpack-contrib/exports-loader)
{{< /callout >}}

## Importing Styles

### Importing Precompiled Sass

To enjoy the full potential of Bootstrap and customize it to your needs, use the source files as a part of your project's bundling process.

First, create your own `_custom.scss` and use it to override the [built-in custom variables]({{ .Site.BaseURL }}/docs/{{ .Site.Params.docs_version }}/getting-started/options/). Then, use your main sass file to import your custom variables, followed by Bootstrap:
{{< highlight sass >}}
@import "custom";
@import "~bootstrap/scss/bootstrap";
{{< /highlight >}}

For Bootstrap to compile, make sure you install and use the required loaders: [sass-loader](https://github.com/webpack-contrib/sass-loader), [postcss-loader](https://github.com/postcss/postcss-loader) with [Autoprefixer](https://github.com/postcss/autoprefixer#webpack). With minimal setup, your webpack config should include this rule or similar:

{{< highlight js >}}
  ...
  {
    test: /\.(scss)$/,
    use: [{
      loader: 'style-loader', // inject CSS to page
    }, {
      loader: 'css-loader', // translates CSS into CommonJS modules
    }, {
      loader: 'postcss-loader', // Run post css actions
      options: {
        plugins: function () { // post css plugins, can be exported to postcss.config.js
          return [
            require('precss'),
            require('autoprefixer')
          ];
        }
      }
    }, {
      loader: 'sass-loader' // compiles SASS to CSS
    }]
  },
  ...
{{< /highlight >}}

### Importing Compiled CSS

Alternatively, you may use Bootstrap's ready-to-use css by simply adding this line to your project's entry point:

{{< highlight js >}}
import 'bootstrap/dist/css/bootstrap.min.css';
{{< /highlight >}}

In this case you may use your existing rule for `css` without any special modifications to webpack config.
