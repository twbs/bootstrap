---
layout: docs
title: Optimize
description: Keep your projects lean, responsive, and maintainable so you can deliver the best experience and focus on more important jobs.
group: customize
toc: true
---

## Lean Sass imports

When using Sass in your asset pipeline, make sure you optimize Bootstrap by only `@import`ing the components you need. Your largest optimizations will likely come from the `Layout & Components` section of our `bootstrap.scss`.

{{< scss-docs name="import-stack" file="scss/bootstrap.scss" >}}


If you're not using a component, comment it out or delete it entirely. For example, if you're not using the carousel, remove that import to save some file size in your compiled CSS. Keep in mind there are some dependencies across Sass imports that may make it more difficult to omit a file.

## Lean JavaScript

Bootstrap's JavaScript includes every component in our primary dist files (`bootstrap.js` and `bootstrap.min.js`), and even our primary dependency (Popper.js) with our bundle files (`bootstrap.bundle.js` and `bootstrap.bundle.min.js`). While you're customizing via Sass, be sure to remove related JavaScript.

For instance, assuming you're using your own JavaScript bundler like Webpack or Rollup, you'd only import the JavaScript you plan on using. In the example below, we show how to just include our modal JavaScript:

```js
// Import just what we need

// If you're importing tooltips or popovers, be sure to include the Popper.js dependency
// import "../../node_modules/popper.js/dist/popper.min.js";

import "../../node_modules/bootstrap/js/dist/util.js";
import "../../node_modules/bootstrap/js/dist/modal.js";
```

This way, you're not including any JavaScript you don't intend to use for components like buttons, carousels, and tooltips.

## Autoprefixer .browserslistrc

Bootstrap depends on Autoprefixer to automatically add browser prefixes to certain CSS properties. Prefixes are dictated by our `.browserslistrc` file, found in the root of the Bootstrap repo. Customizing this list of browsers and recompiling the Sass will automatically remove some CSS from your compiled CSS, if there are vendor prefixes unique to that browser or version.

## Unused CSS

_Help wanted with this section, please consider opening a PR. Thanks!_

While we don't have a prebuilt example for using [PurgeCSS](https://github.com/FullHuman/purgecss) with Bootstrap, there are some helpful articles and walkthroughs that the community has written. Here are some options:

- <https://medium.com/dwarves-foundation/remove-unused-css-styles-from-bootstrap-using-purgecss-88395a2c5772>
- <https://lukelowrey.com/automatically-removeunused-css-from-bootstrap-or-other-frameworks/>

Lastly, this [CSS Tricks article on unused CSS](https://css-tricks.com/how-do-you-remove-unused-css-from-a-site/) shows how to use PurgeCSS and other similar tools.

## Minify and gzip

Whenever possible, be sure to compress all the code you serve to your visitors. If you're using Bootstrap dist files, try to stick to the minified versions (indicated by the `.min.css` and `.min.js` extensions). If you're building Bootstrap from the source with your own build system, be sure to implement your own minifiers for HTML, CSS, and JS.

## Nonblocking files

_Help wanted with this section, please consider opening a PR. Thanks!_

## Always use https

_Help wanted with this section, please consider opening a PR. Thanks!_
