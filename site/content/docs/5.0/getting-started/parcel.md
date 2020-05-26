---
layout: docs
title: Parcel
description: Learn how to include Bootstrap in your project using Parcel.
group: getting-started
toc: true
---

## Installing Parcel Bundler

[Install Parcel Bundler](https://en.parceljs.org/getting_started.html)

## Installing Bootstrap

[Install bootstrap]({{< docsref "/getting-started/download#npm" >}}) as a Node.js module using npm.

Bootstrap depends on [Popper](https://popper.js.org/), which is specified in the `peerDependencies` property.
This means that you will have to make sure to add both of them to your `package.json` using `npm install popper.js`.

When all will be completed, your app project will be structured like this :

{{< highlight text >}}
myProjectName/
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
{{< /highlight >}}

## Importing JavaScript

Import [Bootstrap's JavaScript]({{< docsref "/getting-started/javascript" >}}) by adding this line to your app's entry point (usually `src/index.js`):

{{< highlight js >}}
// Import all plugins
import * as bootstrap from 'bootstrap';
//Or import only needed plugins
import { Tooltip as Tooltip, Toast as Toast, Popover as Popover } from 'bootstrap';
{{< /highlight >}}

Alternatively, if you only need just a few of our plugins, you may **import plugins individually** as needed:

{{< highlight js >}}
import Alert as Alert from '../node_modules/bootstrap/js/dist/alert';
...
{{< /highlight >}}

## Importing Styles

### Importing Precompiled Sass

To enjoy the full potential of Bootstrap and customize it to your needs, use the source files as a part of your project's bundling process.

Create your own `scss/custom.scss` and use it to override the [built-in custom variables]({{< docsref "/customize/sass" >}}). Then, use it to add your customized variables, followed by Bootstrap import:

{{< highlight scss >}}
//override buit-in custom variables
//** Background color for `<body>`.
$body-bg: #9cf;

// breadcrumb
$breadcrumb-divider: quote(">");

// import all bootstrap scss
@import "../node_modules/bootstrap/scss/bootstrap";

//Or import only needed scss
// Configuration
@import "../node_modules/bootstrap/scss/functions";
@import "../node_modules/bootstrap/scss/variables";
@import "../node_modules/bootstrap/scss/mixins";
@import "../node_modules/bootstrap/scss/utilities";

// Layout & components
@import "../node_modules/bootstrap/scss/root";
@import "../node_modules/bootstrap/scss/reboot";
@import "../node_modules/bootstrap/scss/type";
@import "../node_modules/bootstrap/scss/images";
@import "../node_modules/bootstrap/scss/containers";
@import "../node_modules/bootstrap/scss/grid";
...

// Helpers
@import "../node_modules/bootstrap/scss/helpers";

// Utilities
@import "../node_modules/bootstrap/scss/utilities/api";
{{< /highlight >}}

## Build app

### Create App HTML

Include `src/index.js`

{{< highlight html >}}
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body>
    <!-- Here 👇 -->
    <script src="./index.js"></script>
  </body>
</html>
{{< /highlight >}}

### Edit `package.json`

Add dev and build scripts.

{{< highlight json >}}
...
  scripts{
    "dev": "parcel ./src/index.html",
    "prebuild": "rm -rf build",
    "build": "parcel build --public-url ./ ./src/index.html --experimental-scope-hoisting  --out-dir build"
  },
...
{{< /highlight >}}

### Run dev script

App is accessible at `http://127.0.0.1:1234`

{{< highlight bash >}}
npm run dev
{{< /highlight >}}

### Or build app files

Builded files are in build/ folder

{{< highlight bash >}}
npm run build
{{< /highlight >}}
