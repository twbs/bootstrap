---
name: bootstrap-webpack
description: Include and bundle Bootstrap 6's CSS and JavaScript in a project using Webpack. Use when setting up Bootstrap with Webpack, configuring Webpack loaders for Bootstrap's Sass and JS, or creating a Webpack-based Bootstrap project.
---

# Bootstrap 6 with Webpack

Set up a Bootstrap 6 project bundled with Webpack, including the loaders needed to process Sass. Requires Node.js and terminal familiarity.

## Workflow

- [ ] Phase 1: Set up npm and install dependencies
- [ ] Phase 2: Create the project structure
- [ ] Phase 3: Configure Webpack (boilerplate + dev server)
- [ ] Phase 4: Set up loaders and import Bootstrap
- [ ] Phase 5: Verify
- [ ] Phase 6 (optional): Production optimizations

---

## Phase 1: Set up npm and install dependencies

1. Create the project and initialize npm:

   ```sh
   mkdir my-project && cd my-project
   npm init -y
   ```

2. Install Webpack and its tooling:

   ```sh
   npm i --save-dev webpack webpack-cli webpack-dev-server html-webpack-plugin
   ```

3. Install Bootstrap and its optional peer dependencies (omit `@floating-ui/dom` if not using menus/popovers/tooltips; omit `vanilla-calendar-pro` if not using the datepicker):

   ```sh
   npm i --save bootstrap @floating-ui/dom vanilla-calendar-pro
   ```

4. Install the loaders and Sass/Autoprefixer needed to bundle Bootstrap's CSS:

   ```sh
   npm i --save-dev autoprefixer css-loader postcss-loader sass sass-loader style-loader
   ```

---

## Phase 2: Create the project structure

```sh
mkdir {src,src/js,src/scss}
touch src/index.html src/js/main.js src/scss/styles.scss webpack.config.js
```

Target layout:

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

---

## Phase 3: Configure Webpack

1. `webpack.config.js` — entry, output, and dev server:

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

2. `src/index.html`:

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
         <button class="btn-solid theme-primary">Primary button</button>
       </div>
     </body>
   </html>
   ```

3. `package.json` — add scripts:

   ```json
   {
     "scripts": {
       "start": "webpack serve",
       "build": "webpack build --mode=production",
       "test": "echo \"Error: no test specified\" && exit 1"
     }
   }
   ```

4. Start Webpack:

   ```sh
   npm start
   ```

---

## Phase 4: Set up loaders and import Bootstrap

1. Add the `module.rules` loader chain to `webpack.config.js` (order matters: `sass-loader` compiles, `postcss-loader` runs Autoprefixer, `css-loader` resolves imports, `style-loader` injects CSS):

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
             { loader: 'style-loader' },
             { loader: 'css-loader' },
             {
               loader: 'postcss-loader',
               options: {
                 postcssOptions: {
                   plugins: [
                     autoprefixer
                   ]
                 }
               }
             },
             { loader: 'sass-loader' }
           ]
         }
       ]
     }
   }
   ```

2. `src/scss/styles.scss` — import the source Sass with `@use` (never `@import`):

   ```scss
   // Import all of Bootstrap's CSS
   @use "bootstrap/scss/bootstrap";
   ```

3. `src/js/main.js` — load the CSS and import Bootstrap's JS. Floating UI and Vanilla Calendar Pro are imported automatically through Bootstrap:

   ```js
   // Import our custom CSS, then all of Bootstrap’s JS
   import '../scss/styles.scss'
   import * as bootstrap from 'bootstrap'
   ```

   Import only the plugins you need to keep bundle sizes down:

   ```js
   import { Tooltip, Toast, Popover } from 'bootstrap'
   ```

---

## Phase 5: Verify

1. Run `npm start` and open `http://localhost:8080` — the `.container` and `.btn-solid.theme-primary` button should be styled.
2. Confirm the console is free of module-resolution or loader errors.
3. Trigger a JS component (tooltip/dialog) to confirm the JS bundle works.
4. Bootstrap 6 requires a browser that supports `oklch()` and `color-mix()`.

---

## Phase 6 (optional): Production optimizations

Not required for a working setup; apply only if needed.

- **Extract CSS to a file** (for strict CSP or to avoid a large JS bundle): install `mini-css-extract-plugin`, replace `style-loader` with `miniCssExtractPlugin.loader`, add the plugin, then link the generated `dist/main.css` from your HTML.
- **Extract inline SVGs**: Bootstrap's CSS references SVGs via inline `data:` URIs. If your CSP blocks `data:` images, add a Webpack asset-module rule matching `mimetype: 'image/svg+xml'` / `scheme: 'data'` with `type: 'asset/resource'` to emit them as files.

For a complete reference, see the [twbs/examples Webpack project](https://github.com/twbs/examples/tree/main/webpack).
