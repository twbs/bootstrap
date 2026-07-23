---
name: bootstrap-vite
description: Include and bundle Bootstrap 6's CSS and JavaScript in a project using Vite. Use when setting up Bootstrap with Vite, bundling Bootstrap's Sass and JS through Vite, or creating a Vite-based Bootstrap project.
---

# Bootstrap 6 with Vite

Set up a Bootstrap 6 project bundled with Vite. Requires Node.js and terminal familiarity.

## Workflow

- [ ] Phase 1: Set up npm and install dependencies
- [ ] Phase 2: Create the project structure
- [ ] Phase 3: Configure Vite
- [ ] Phase 4: Import Bootstrap's CSS and JS
- [ ] Phase 5: Verify

---

## Phase 1: Set up npm and install dependencies

1. Create the project and initialize npm:

   ```sh
   mkdir my-project && cd my-project
   npm init -y
   ```

2. Install Vite:

   ```sh
   npm i --save-dev vite
   ```

3. Install Bootstrap and its optional peer dependencies (omit `@floating-ui/dom` if not using menus/popovers/tooltips; omit `vanilla-calendar-pro` if not using the datepicker):

   ```sh
   npm i --save bootstrap @floating-ui/dom vanilla-calendar-pro
   ```

4. Install Sass to compile Bootstrap's source:

   ```sh
   npm i --save-dev sass
   ```

---

## Phase 2: Create the project structure

```sh
mkdir {src,src/js,src/scss}
touch src/index.html src/js/main.js src/scss/styles.scss vite.config.js
```

Target layout:

```text
my-project/
├── src/
│   ├── js/
│   │   └── main.js
│   └── scss/
│   |   └── styles.scss
|   └── index.html
├── package-lock.json
├── package.json
└── vite.config.js
```

---

## Phase 3: Configure Vite

1. `vite.config.js`:

   ```js
   import path from 'path'

   export default {
     root: path.resolve(__dirname, 'src'),
     build: {
       outDir: '../dist'
     },
     server: {
       port: 8080
     }
   }
   ```

2. `src/index.html` — load the entry module:

   ```html
   <!doctype html>
   <html lang="en">
     <head>
       <meta charset="utf-8">
       <meta name="viewport" content="width=device-width, initial-scale=1">
       <title>Bootstrap w/ Vite</title>
       <script type="module" src="./js/main.js"></script>
     </head>
     <body>
       <div class="container py-4 px-3 mx-auto">
         <h1>Hello, Bootstrap and Vite!</h1>
         <button class="btn-solid theme-primary">Primary button</button>
       </div>
     </body>
   </html>
   ```

3. `package.json` — add the start script:

   ```json
   {
     "scripts": {
       "start": "vite",
       "test": "echo \"Error: no test specified\" && exit 1"
     }
   }
   ```

4. Start Vite:

   ```sh
   npm start
   ```

---

## Phase 4: Import Bootstrap's CSS and JS

1. `src/scss/styles.scss` — import the source Sass with `@use` (never `@import`):

   ```scss
   // Import all of Bootstrap's CSS
   @use "bootstrap/scss/bootstrap";
   ```

2. `src/js/main.js` — load the CSS and import Bootstrap's JS. Floating UI and Vanilla Calendar Pro are imported automatically through Bootstrap:

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
2. Confirm the browser console is free of module-resolution errors (Bootstrap, Floating UI, Vanilla Calendar Pro).
3. Trigger a JS component (tooltip/dialog) to confirm the JS bundle works.
4. Bootstrap 6 requires a browser that supports `oklch()` and `color-mix()`.

For an optimized build that imports only the parts of Bootstrap you use, see the [twbs/examples Vite project](https://github.com/twbs/examples/tree/main/vite).
