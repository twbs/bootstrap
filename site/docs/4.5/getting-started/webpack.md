---
layout: docs
title: Webpack
description: Learn how to include Bootstrap in your project using Webpack.
group: getting-started
toc: true
---

## Installing Bootstrap

[Install bootstrap]({{ site.baseurl }}/docs/{{ site.docs_version }}/getting-started/download/#npm) as a Node.js module using npm.

## Importing JavaScript

Import [Bootstrap's JavaScript]({{ site.baseurl }}/docs/{{ site.docs_version }}/getting-started/javascript/) by adding this line to your app's entry point (usually `index.js` or `app.js`):

{% highlight js %}
import 'bootstrap';
{% endhighlight %}

Alternatively, you may **import plugins individually** as needed:

{% highlight js %}
import 'bootstrap/js/dist/util';
import 'bootstrap/js/dist/alert';
...
{% endhighlight %}

Bootstrap depends on [jQuery](https://jquery.com/) and [Popper](https://popper.js.org/),
which are specified in the `peerDependencies` property; this means that you will have to make sure to add both of them
to your `package.json` using `npm install --save jquery popper.js`.

## Importing Styles

### Importing Precompiled Sass

To enjoy the full potential of Bootstrap and customize it to your needs, use the source files as a part of your project's bundling process.

First, create your own `_custom.scss` and use it to override the [built-in custom variables]({{ site.baseurl }}/docs/{{ site.docs_version }}/getting-started/theming/). Then, use your main Sass file to import your custom variables, followed by Bootstrap:

{% highlight scss %}
@import "custom";
@import "~bootstrap/scss/bootstrap";
{% endhighlight %}

For Bootstrap to compile, make sure you install and use the required loaders: [sass-loader](https://github.com/webpack-contrib/sass-loader), [postcss-loader](https://github.com/webpack-contrib/postcss-loader) with [Autoprefixer](https://github.com/postcss/autoprefixer#webpack). With minimal setup, your webpack config should include this rule or similar:

{% highlight js %}
...
{
  test: /\.(scss)$/,
  use: [{
    loader: 'style-loader', // inject CSS to page
  }, {
    loader: 'css-loader', // translates CSS into CommonJS modules
  }, {
    loader: 'postcss-loader', // Run postcss actions
    options: {
      plugins: function () { // postcss plugins, can be exported to postcss.config.js
        return [
          require('autoprefixer')
        ];
      }
    }
  }, {
    loader: 'sass-loader' // compiles Sass to CSS
  }]
},
...
{% endhighlight %}

### Importing Compiled CSS

Alternatively, you may use Bootstrap's ready-to-use CSS by simply adding this line to your project's entry point:

{% highlight js %}
import 'bootstrap/dist/css/bootstrap.min.css';
{% endhighlight %}

In this case you may use your existing rule for `css` without any special modifications to webpack config, except you don't need `sass-loader` just [style-loader](https://github.com/webpack-contrib/style-loader) and [css-loader](https://github.com/webpack-contrib/css-loader).

{% highlight js %}
...
module: {
  rules: [
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }
  ]
}
...
{% endhighlight %}
