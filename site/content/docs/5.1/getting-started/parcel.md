---
layout: docs
title: Parcel
description: Learn how to include Bootstrap in your project using Parcel.
group: getting-started
toc: true
---

## Install Parcel

Install [Parcel Bundler](https://en.parceljs.org/getting_started.html).

## Install Bootstrap

[Install bootstrap]({{< docsref "/getting-started/download#npm" >}}) as a Node.js module using npm.

Bootstrap depends on [Popper](https://popper.js.org/), which is specified in the `peerDependencies` property. This means that you will have to make sure to add both of them to your `package.json` using `npm install @popperjs/core`.

When all will be completed, your project will be structured like this:

```text
project-name/
├── build/
├── node_modules/
│   └── bootstrap/
│   └── popper.js/
├── scss/
│   └── custom.scss
├── src/
│   └── index.html
│   └── index.js
└── package.json
```

## Importing JavaScript

Import [Bootstrap's JavaScript]({{< docsref "/getting-started/javascript" >}}) in your app's entry point (usually `src/index.js`). You can import all our plugins in one file or separately if you require only a subset of them.

```js
// Import all plugins
import * as bootstrap from 'bootstrap';

// Or import only needed plugins
import { Tooltip as Tooltip, Toast as Toast, Popover as Popover } from 'bootstrap';

// Or import just one
import Alert as Alert from '../node_modules/bootstrap/js/dist/alert';
```

## Importing CSS

To utilize the full potential of Bootstrap and customize it to your needs, use the source files as a part of your project's bundling process.

Create your own `scss/custom.scss` to [import Bootstrap's Sass files]({{< docsref "/customize/sass#importing" >}}) and then override the [built-in custom variables]({{< docsref "/customize/sass#variable-defaults" >}}).

## Build app

Include `src/index.js` before the closing `</body>` tag.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body>
    <script src="./index.js"></script>
  </body>
</html>
```

### Edit `package.json`

Add `dev` and `build` scripts in your `package.json` file.

```json
"scripts": {
  "dev": "parcel ./src/index.html",
  "prebuild": "npx rimraf build",
  "build": "parcel build --public-url ./ ./src/index.html --experimental-scope-hoisting --out-dir build"
}
```

### Run dev script

Your app will be accessible at `http://127.0.0.1:1234`.

```sh
npm run dev
```

### Build app files

Built files are in the `build/` folder.

```sh
npm run build
```
