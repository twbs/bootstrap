---
name: bootstrap-parcel
description: Include and bundle Bootstrap 6's CSS and JavaScript in a project using Parcel. Use when setting up Bootstrap with Parcel, bundling Bootstrap's Sass and JS through Parcel, or creating a Parcel-based Bootstrap project.
guide: /guides/parcel
---

# Bootstrap 6 with Parcel

Set up a Bootstrap 6 project bundled with Parcel. Parcel is zero-config and auto-installs language transformers (like Sass) as it detects them. Requires Node.js and terminal familiarity.

## Workflow

- [ ] Step 1: Set up npm and install dependencies
- [ ] Step 2: Create the project structure
- [ ] Step 3: Configure Parcel (HTML + npm script)
- [ ] Step 4: Import Bootstrap's CSS and JS
- [ ] Step 5: Verify

---

## Step 1: Set up npm and install dependencies

1. Create the project and initialize npm:

   ```sh
   mkdir my-project && cd my-project
   npm init -y
   ```

2. Install Parcel:

   ```sh
   npm i --save-dev parcel
   ```

3. Install Bootstrap and its optional peer dependencies (omit `@floating-ui/dom` if not using menus/popovers/tooltips; omit `vanilla-calendar-pro` if not using the datepicker):

   ```sh
   npm i --save bootstrap @floating-ui/dom vanilla-calendar-pro
   ```

Parcel will auto-install the [Sass plugin](https://parceljs.org/languages/sass/) when it detects `.scss`. To install it manually: `npm i --save-dev @parcel/transformer-sass`.

---

## Step 2: Create the project structure

```sh
mkdir {src,src/js,src/scss}
touch src/index.html src/js/main.js src/scss/styles.scss
```

Target layout (Parcel needs no config file):

```text
my-project/
├── src/
│   ├── js/
│   │   └── main.js
│   ├── scss/
│   │   └── styles.scss
│   └── index.html
├── package-lock.json
└── package.json
```

---

## Step 3: Configure Parcel

1. `src/index.html` — link the Sass and JS entry points directly (Parcel resolves and bundles them):

   ```html
   <!doctype html>
   <html lang="en">
     <head>
       <meta charset="utf-8">
       <meta name="viewport" content="width=device-width, initial-scale=1">
       <title>Bootstrap w/ Parcel</title>
       <link rel="stylesheet" href="scss/styles.scss">
       <script type="module" src="js/main.js"></script>
     </head>
     <body>
       <div class="container py-4 px-3 mx-auto">
         <h1>Hello, Bootstrap and Parcel!</h1>
         <button class="btn-solid theme-primary">Primary button</button>
       </div>
     </body>
   </html>
   ```

2. `package.json` — add the start script:

   ```json
   {
     "scripts": {
       "start": "parcel serve src/index.html --public-url / --dist-dir dist",
       "test": "echo \"Error: no test specified\" && exit 1"
     }
   }
   ```

3. Start Parcel:

   ```sh
   npm start
   ```

---

## Step 4: Import Bootstrap's CSS and JS

1. `src/scss/styles.scss` — import the source Sass with `@use` (never `@import`):

   ```scss
   // Import all of Bootstrap's CSS
   @use "bootstrap/scss/bootstrap";
   ```

   To customize, override Bootstrap's CSS token maps (`$root-tokens`, `$*-tokens`) — see [Customize › Sass](https://getbootstrap.com/docs/6.0/customize/sass/#compile-time-overrides). Token names are written unprefixed in Sass; Bootstrap's dist/CDN CSS adds the `--bs-` prefix via PostCSS, so compiling the source yourself keeps them unprefixed.

2. `src/js/main.js` — import Bootstrap's JS. Floating UI and Vanilla Calendar Pro are imported automatically through Bootstrap:

   ```js
   // Import all of Bootstrap's JS
   import * as bootstrap from 'bootstrap'
   ```

   Import only the plugins you need to keep bundle sizes down:

   ```js
   import { Tooltip, Toast, Popover } from 'bootstrap'
   ```

---

## Step 5: Verify

1. Run `npm start` and open the served URL — the `.container` and `.btn-solid.theme-primary` button should be styled.
2. Confirm Parcel installed the Sass transformer (no `.scss` build errors) and the console is free of module errors.
3. Trigger a JS component (tooltip/dialog) to confirm the JS bundle works.
4. Bootstrap 6 requires a browser that supports `oklch()` and `color-mix()`.

For an optimized build that imports only the parts of Bootstrap you use, see the [twbs/examples Parcel project](https://github.com/twbs/examples/tree/main/parcel).
