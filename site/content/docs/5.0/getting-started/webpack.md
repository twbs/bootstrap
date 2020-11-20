---
layout: docs
title: Webpack and bundlers
description: Learn how to include Bootstrap in your project using Webpack or other bundlers.
group: getting-started
toc: true
---

## Installing Bootstrap

[Install bootstrap]({{< docsref "/getting-started/download#npm" >}}) as a Node.js module using npm.

## Importing JavaScript

Import [Bootstrap's JavaScript]({{< docsref "/getting-started/javascript" >}}) by adding this line to your app's entry point (usually `index.js` or `app.js`):

```js
// You can specify which plugins you need
import { Tooltip, Toast, Popover } from 'bootstrap';
```

Alternatively, if you only need just a few of our plugins, you may **import plugins individually** as needed:

```js
import Alert from 'bootstrap/js/dist/alert';
...
```

Bootstrap depends on [Popper](https://popper.js.org/), which is specified in the `peerDependencies` property.
This means that you will have to make sure to add it to your `package.json` using `npm install popper.js`.

## Importing Styles

### Importing Precompiled Sass

To enjoy the full potential of Bootstrap and customize it to your needs, use the source files as a part of your project's bundling process.

First, create your own `_custom.scss` and use it to override the [built-in custom variables]({{< docsref "/customize/sass" >}}). Then, use your main Sass file to import your custom variables, followed by Bootstrap:

```scss
@import "custom";
@import "~bootstrap/scss/bootstrap";
```

For Bootstrap to compile, make sure you install and use the required loaders: [sass-loader](https://github.com/webpack-contrib/sass-loader), [postcss-loader](https://github.com/webpack-contrib/postcss-loader) with [Autoprefixer](https://github.com/postcss/autoprefixer#webpack). With minimal setup, your webpack config should include this rule or similar:

```js
// ...
{
  test: /\.(scss)$/,
  use: [{
    // inject CSS to page
    loader: 'style-loader'
  }, {
    // translates CSS into CommonJS modules
    loader: 'css-loader'
  }, {
    // Run postcss actions
    loader: 'postcss-loader',
    options: {
      // `postcssOptions` is needed for postcss 8.x;
      // if you use postcss 7.x skip the key
      postcssOptions: {
        // postcss plugins, can be exported to postcss.config.js
        plugins: function () {
          return [
            require('autoprefixer')
          ];
        }
      }
    }
  }, {
    // compiles Sass to CSS
    loader: 'sass-loader'
  }]
}
// ...
```

### Importing Compiled CSS

Alternatively, you may use Bootstrap's ready-to-use CSS by simply adding this line to your project's entry point:

```js
import 'bootstrap/dist/css/bootstrap.min.css';
```

In this case you may use your existing rule for `css` without any special modifications to webpack config, except you don't need `sass-loader` just [style-loader](https://github.com/webpack-contrib/style-loader) and [css-loader](https://github.com/webpack-contrib/css-loader).

```js
// ...
module: {
  rules: [
    {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    }
  ]
}
// ...
```
