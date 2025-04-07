---
layout: docs
title: Bootstrap and Webpack
description: The official guide for how to include and bundle Bootstrap's CSS and JavaScript in your project using Webpack.
group: getting-started
toc: true
thumbnail: guides/bootstrap-webpack@2x.png
---

<img class="d-block mx-auto mb-4 img-fluid rounded-3" srcset="/docs/{{< param docs_version >}}/assets/img/guides/bootstrap-webpack.png, /docs/{{< param docs_version >}}/assets/img/guides/bootstrap-webpack@2x.png 2x" src="/docs/{{< param docs_version >}}/assets/img/guides/bootstrap-webpack.png" width="800" height="400" alt="">

{{< callout >}}
**Want to skip to the end?** Download the source code and working demo for this guide from the [twbs/examples repository](https://github.com/twbs/examples/tree/main/webpack). You can also [open the example in StackBlitz](https://stackblitz.com/github/twbs/examples/tree/main/webpack?file=index.html) for live editing.
{{< /callout >}}

## What is Webpack?

[Webpack](https://webpack.js.org/) is a JavaScript module bundler that processes modules and their dependencies to generate static assets. It simplifies managing complex web applications with multiple files and dependencies.

## Setup

We're building a Webpack project with Bootstrap from scratch, so there are some prerequisites and upfront steps before we can really get started. This guide requires you to have Node.js installed and some familiarity with the terminal.

1. **Create a project folder and set up npm.** We'll create the `my-project` folder and initialize npm with the `-y` argument to avoid it asking us all the interactive questions.

   ```sh
   mkdir my-project && cd my-project
   npm init -y
   ```

2. **Install Webpack.** Next we need to install our Webpack development dependencies: `webpack` for the core of Webpack, `webpack-cli` so we can run Webpack commands from the terminal, and `webpack-dev-server` so we can run a local development server. Additionally, we'll install `html-webpack-plugin` to be able to store our `index.html` in `src` directory instead of the default `dist` one. We use `--save-dev` to signal that these dependencies are only for development use and not for production.

   ```sh
   npm i --save-dev webpack webpack-cli webpack-dev-server html-webpack-plugin
   ```

3. **Install Bootstrap.** Now we can install Bootstrap. We'll also install Popper since our dropdowns, popovers, and tooltips depend on it for their positioning. If you don't plan on using those components, you can omit Popper here.

   ```sh
   npm i --save bootstrap @popperjs/core
   ```

4. **Install additional dependencies.** In addition to Webpack and Bootstrap, we need a few more dependencies to properly import and bundle Bootstrap's CSS and JS with Webpack. These include Sass, some loaders, and Autoprefixer.

   ```sh
   npm i --save-dev autoprefixer css-loader postcss-loader sass sass-loader style-loader
   ```

Now that we have all the necessary dependencies installed, we can get to work creating the project files and importing Bootstrap.

## Project structure

We've already created the `my-project` folder and initialized npm. Now we'll also create our `src` and `dist` folders to round out the project structure. Run the following from `my-project`, or manually create the folder and file structure shown below.

```sh
mkdir {src,src/js,src/scss}
touch src/index.html src/js/main.js src/scss/styles.scss webpack.config.js
```

When you're done, your complete project should look like this:

```text
my-project/
├── src/
│   ├── js/
│   │   └── main.js
│   ├── scss/
│   │   └── styles.scss
│   └── index.html
├── package-lock.json
├── package.json
└── webpack.config.js
```

At this point, everything is in the right place, but Webpack won't work because we haven't filled in our `webpack.config.js` yet.

## Configure Webpack

With dependencies installed and our project folder ready for us to start coding, we can now configure Webpack and run our project locally.

1. **Open `webpack.config.js` in your editor.** Since it's blank, we'll need to add some boilerplate config to it so we can start our server. This part of the config tells Webpack where to look for our project's JavaScript, where to output the compiled code to (`dist`), and how the development server should behave (pulling from the `dist` folder with hot reload).

   ```js
   'use strict'

   const path = require('path')
   const HtmlWebpackPlugin = require('html-webpack-plugin')

   module.exports = {
     mode: 'development',
     entry: './src/js/main.js',
     output: {
       filename: 'main.js',
       path: path.resolve(__dirname, 'dist')
     },
     devServer: {
       static: path.resolve(__dirname, 'dist'),
       port: 8080,
       hot: true
     },
     plugins: [
       new HtmlWebpackPlugin({ template: './src/index.html' })
     ]
   }
   ```

2. **Next we fill in our `src/index.html`.** This is the HTML page Webpack will load in the browser to utilize the bundled CSS and JS we'll add to it in later steps. Before we can do that, we have to give it something to render and include the `output` JS from the previous step.

   ```html
   <!doctype html>
   <html lang="en">
     <head>
       <meta charset="utf-8">
       <meta name="viewport" content="width=device-width, initial-scale=1">
       <title>Bootstrap w/ Webpack</title>
     </head>
     <body>
       <div class="container py-4 px-3 mx-auto">
         <h1>Hello, Bootstrap and Webpack!</h1>
         <button class="btn btn-primary">Primary button</button>
       </div>
     </body>
   </html>
   ```

   We're including a little bit of Bootstrap styling here with the `div class="container"` and `<button>` so that we see when Bootstrap's CSS is loaded by Webpack.

3. **Now we need an npm script to run Webpack.** Open `package.json` and add the `start` script shown below (you should already have the test script). We'll use this script to start our local Webpack dev server. You can also add a `build` script shown below to build your project.

   ```json
   {
     // ...
     "scripts": {
       "start": "webpack serve",
       "build": "webpack build --mode=production",
       "test": "echo \"Error: no test specified\" && exit 1"
     },
     // ...
   }
   ```

4. **And finally, we can start Webpack.** From the `my-project` folder in your terminal, run that newly added npm script:

   ```sh
   npm start
   ```

   ![Webpack dev server running](/assets/img/guides/webpack-dev-server.png)

In the next and final section to this guide, we'll set up the Webpack loaders and import all of Bootstrap's CSS and JavaScript.

## Import Bootstrap

Importing Bootstrap into Webpack requires the loaders we installed in the first section. We've installed them with npm, but now Webpack needs to be configured to use them.

1. **Set up the loaders in `webpack.config.js`.** Your configuration file is now complete and should match the snippet below. The only new part here is the `module` section.

   ```js
   'use strict'

   const path = require('path')
   const autoprefixer = require('autoprefixer')
   const HtmlWebpackPlugin = require('html-webpack-plugin')

   module.exports = {
     mode: 'development',
     entry: './src/js/main.js',
     output: {
       filename: 'main.js',
       path: path.resolve(__dirname, 'dist')
     },
     devServer: {
       static: path.resolve(__dirname, 'dist'),
       port: 8080,
       hot: true
     },
     plugins: [
       new HtmlWebpackPlugin({ template: './src/index.html' })
     ],
     module: {
       rules: [
         {
           test: /\.(scss)$/,
           use: [
             {
               // Adds CSS to the DOM by injecting a `<style>` tag
               loader: 'style-loader'
             },
             {
               // Interprets `@import` and `url()` like `import/require()` and will resolve them
               loader: 'css-loader'
             },
             {
               // Loader for webpack to process CSS with PostCSS
               loader: 'postcss-loader',
               options: {
                 postcssOptions: {
                   plugins: [
                     autoprefixer
                   ]
                 }
               }
             },
             {
               // Loads a SASS/SCSS file and compiles it to CSS
               loader: 'sass-loader',
               options: {
                 sassOptions: {
                   // Optional: Silence Sass deprecation warnings. See note below.
                   silenceDeprecations: [
                     'mixed-decls',
                     'color-functions',
                     'global-builtin',
                     'import'
                   ]
                 }
               }
             }
           ]
         }
       ]
     }
   }
   ```

   Here's a recap of why we need all these loaders. `style-loader` injects the CSS into a `<style>` element in the `<head>` of the HTML page, `css-loader` helps with using `@import` and `url()`, `postcss-loader` is required for Autoprefixer, and `sass-loader` allows us to use Sass.

   **Note:** Sass deprecation warnings are shown when compiling source Sass files with the latest versions of Dart Sass. This does not prevent compilation or usage of Bootstrap. We're [working on a long-term fix]({{< param repo >}}/issues/40962), but in the meantime these deprecation notices can be ignored.

2. **Now, let's import Bootstrap's CSS.** Add the following to `src/scss/styles.scss` to import all of Bootstrap's source Sass.

   ```scss
   // Import all of Bootstrap's CSS
   @import "bootstrap/scss/bootstrap";
   ```

   *You can also import our stylesheets individually if you want. [Read our Sass import docs]({{< docsref "/customize/sass#importing" >}}) for details.*

3. **Next we load the CSS and import Bootstrap's JavaScript.** Add the following to `src/js/main.js` to load the CSS and import all of Bootstrap's JS. Popper will be imported automatically through Bootstrap.

   <!-- eslint-skip -->
   ```js
   // Import our custom CSS
   import '../scss/styles.scss'

   // Import all of Bootstrap's JS
   import * as bootstrap from 'bootstrap'
   ```

   You can also import JavaScript plugins individually as needed to keep bundle sizes down:

   <!-- eslint-skip -->
   ```js
   import Alert from 'bootstrap/js/dist/alert'

   // or, specify which plugins you need:
   import { Tooltip, Toast, Popover } from 'bootstrap'
   ```

   *[Read our JavaScript docs]({{< docsref "/getting-started/javascript/" >}}) for more information on how to use Bootstrap's plugins.*

4. **And you're done! 🎉** With Bootstrap's source Sass and JS fully loaded, your local development server should now look like this:

   ![Webpack dev server running with Bootstrap](/assets/img/guides/webpack-dev-server-bootstrap.png)

   Now you can start adding any Bootstrap components you want to use. Be sure to [check out the complete Webpack example project](https://github.com/twbs/examples/tree/main/webpack) for how to include additional custom Sass and optimize your build by importing only the parts of Bootstrap's CSS and JS that you need.

## Production optimizations

Depending on your setup, you may want to implement some additional security and speed optimizations useful for running the project in production. Note that these optimizations are not applied on [the Webpack example project](https://github.com/twbs/examples/tree/main/webpack) and are up to you to implement.

### Extracting CSS

The `style-loader` we configured above conveniently emits CSS into the bundle so that manually loading a CSS file in `dist/index.html` isn't necessary. This approach may not work with a strict Content Security Policy, however, and it may become a bottleneck in your application due to the large bundle size.

To separate the CSS so that we can load it directly from `dist/index.html`, use the `mini-css-extract-loader` Webpack plugin.

First, install the plugin:

```sh
npm install --save-dev mini-css-extract-plugin
```

Then instantiate and use the plugin in the Webpack configuration:

```diff
--- a/webpack.config.js
+++ b/webpack.config.js
@@ -3,6 +3,7 @@
 const path = require('path')
 const autoprefixer = require('autoprefixer')
 const HtmlWebpackPlugin = require('html-webpack-plugin')
+const miniCssExtractPlugin = require('mini-css-extract-plugin')

 module.exports = {
   mode: 'development',
@@ -17,7 +18,8 @@ module.exports = {
     hot: true
   },
   plugins: [
-    new HtmlWebpackPlugin({ template: './src/index.html' })
+    new HtmlWebpackPlugin({ template: './src/index.html' }),
+    new miniCssExtractPlugin()
   ],
   module: {
     rules: [
@@ -25,8 +27,8 @@ module.exports = {
         test: /\.(scss)$/,
         use: [
           {
-            // Adds CSS to the DOM by injecting a `<style>` tag
-            loader: 'style-loader'
+            // Extracts CSS for each JS file that includes CSS
+            loader: miniCssExtractPlugin.loader
           },
           {
```

After running `npm run build` again, there will be a new file `dist/main.css`, which will contain all of the CSS imported by `src/js/main.js`. If you view `dist/index.html` in your browser now, the style will be missing, as it is now in `dist/main.css`. You can include the generated CSS in `dist/index.html` like this:

```diff
--- a/dist/index.html
+++ b/dist/index.html
@@ -3,6 +3,7 @@
   <head>
     <meta charset="utf-8">
     <meta name="viewport" content="width=device-width, initial-scale=1">
+    <link rel="stylesheet" href="./main.css">
     <title>Bootstrap w/ Webpack</title>
   </head>
   <body>
```

### Extracting SVG files

Bootstrap's CSS includes multiple references to SVG files via inline `data:` URIs. If you define a Content Security Policy for your project that blocks `data:` URIs for images, then these SVG files will not load. You can get around this problem by extracting the inline SVG files using Webpack's asset modules feature.

Configure Webpack to extract inline SVG files like this:

```diff
--- a/webpack.config.js
+++ b/webpack.config.js
@@ -23,6 +23,14 @@ module.exports = {
   },
   module: {
     rules: [
+      {
+        mimetype: 'image/svg+xml',
+        scheme: 'data',
+        type: 'asset/resource',
+        generator: {
+          filename: 'icons/[hash].svg'
+        }
+      },
       {
         test: /\.(scss)$/,
         use: [
```

After running `npm run build` again, you'll find the SVG files extracted into `dist/icons` and properly referenced from CSS.

{{< markdown >}}
{{< partial "guide-footer.md" >}}
{{< /markdown >}}
