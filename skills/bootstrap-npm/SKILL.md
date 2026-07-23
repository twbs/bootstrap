---
name: bootstrap-npm
description: Build a Bootstrap 6 starter project using just npm and command-line tools (no bundler). Use when setting up Bootstrap with npm, compiling Bootstrap's Sass to CSS from the command line, or creating an npm-based Bootstrap project.
---

# Bootstrap 6 with npm

Set up a Bootstrap 6 project that compiles Sass to CSS using npm command-line tools, with no JavaScript bundler. Bootstrap's pre-built JS bundle is loaded directly via a `<script>` tag. Requires Node.js and terminal familiarity.

## Workflow

- [ ] Phase 1: Set up npm and install dependencies
- [ ] Phase 2: Create the project structure
- [ ] Phase 3: Configure npm scripts and config files
- [ ] Phase 4: Import Bootstrap's Sass
- [ ] Phase 5: Verify

---

## Phase 1: Set up npm and install dependencies

1. Create the project and initialize npm:

   ```sh
   mkdir my-project && cd my-project
   npm init -y
   ```

2. Install Bootstrap and its optional peer dependencies (omit `@floating-ui/dom` if not using menus/popovers/tooltips; omit `vanilla-calendar-pro` if not using the datepicker):

   ```sh
   npm i --save bootstrap @floating-ui/dom vanilla-calendar-pro
   ```

3. Install the tools to compile and post-process CSS:

   ```sh
   npm i --save-dev autoprefixer postcss postcss-cli sass
   ```

4. Install local dev tooling (watch, run scripts, serve, lint):

   ```sh
   npm i --save-dev nodemon npm-run-all sirv-cli stylelint stylelint-config-twbs-bootstrap
   ```

---

## Phase 2: Create the project structure

```sh
mkdir {css,scss}
touch index.html scss/styles.scss postcss.config.js stylelint.config.mjs
```

Target layout:

```text
my-project/
├── css/
├── scss/
│   └── styles.scss
├── stylelint.config.mjs
├── index.html
├── package-lock.json
├── package.json
└── postcss.config.js
```

---

## Phase 3: Configure npm scripts and config files

1. `postcss.config.js` — run Autoprefixer after Sass:

   ```js
   const autoprefixer = require('autoprefixer')

   module.exports = {
     plugins: [
       autoprefixer
     ]
   }
   ```

2. `index.html` — link the compiled CSS and load Bootstrap's pre-built JS bundle (no bundler here, so use `dist`):

   ```html
   <!doctype html>
   <html lang="en">
     <head>
       <meta charset="utf-8">
       <meta name="viewport" content="width=device-width, initial-scale=1">
       <title>Bootstrap w/ npm</title>
       <link rel="stylesheet" href="css/styles.css">
     </head>
     <body>
       <div class="container py-4 px-3 mx-auto">
         <h1>Hello, Bootstrap and npm!</h1>
         <button class="btn-solid theme-primary">Primary button</button>
       </div>
       <script type="module" src="node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
     </body>
   </html>
   ```

3. `package.json` — add scripts. Note `--load-path=node_modules` so Sass resolves `bootstrap`:

   ```json
   {
     "scripts": {
       "css-compile": "sass --load-path=node_modules --style expanded --source-map --embed-sources scss:css",
       "css-prefix": "postcss --config postcss.config.js --replace \"css/*.css\" \"!css/*.min.css\"",
       "build": "npm-run-all --sequential css-compile css-prefix",
       "watch": "nodemon --watch scss/ --ext scss --exec \"npm run build\"",
       "serve": "sirv --port 8080 --dev .",
       "start": "npm-run-all build --parallel watch serve",
       "lint": "stylelint \"scss/**/*.scss\""
     }
   }
   ```

4. `stylelint.config.mjs`:

   ```js
   /** @type {import('stylelint').Config} */
   export default {
     extends: 'stylelint-config-twbs-bootstrap'
   }
   ```

5. Start the dev server:

   ```sh
   npm start
   ```

---

## Phase 4: Import Bootstrap's Sass

Add to `scss/styles.scss` using the modern `@use` rule (never `@import`):

```scss
// Import all of Bootstrap's CSS
@use "bootstrap/scss/bootstrap";
```

Customize tokens with `with ()` — include only the keys you want to change:

```scss
@use "bootstrap/scss/bootstrap" with (
  $root-tokens: (
    --border-radius: .25rem,
    --spacer: 1.5rem,
  )
);
```

---

## Phase 5: Verify

1. Run `npm start` and open `http://localhost:8080` — the `.container` and `.btn-solid.theme-primary` button should be styled once the CSS compiles.
2. Confirm `css/styles.css` is generated and updates when you edit `scss/styles.scss` (watch is running).
3. Confirm no console errors from the JS bundle.
4. Run `npm run lint` to check Sass against Bootstrap's stylelint config.
5. Bootstrap 6 requires a browser that supports `oklch()` and `color-mix()`.

For an optimized build that imports only the parts of Bootstrap you use, see the [twbs/examples sass-js project](https://github.com/twbs/examples/tree/main/sass-js).
