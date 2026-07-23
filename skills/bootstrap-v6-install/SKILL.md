---
name: bootstrap-v6-install
description: Add Bootstrap 6 to a project and set it up for local development. Use when installing Bootstrap, adding Bootstrap to a new or existing project, or setting up Bootstrap's CSS and JavaScript via CDN or a package manager.
---

# Add Bootstrap 6 to a Project

This skill sets up Bootstrap 6 in a user's project. Pick the path that matches the project: **CDN** for the fastest start with no build step, or **package manager** (npm) for customizing Sass and bundling JS. For a full bundler-specific setup, use the dedicated `bootstrap-npm`, `bootstrap-vite`, `bootstrap-webpack`, or `bootstrap-parcel` skills instead.

## Workflow

- [ ] Step 1: Choose an install path (CDN vs. package manager)
- [ ] Step 2: Install Bootstrap and dependencies
- [ ] Step 3: Include Bootstrap's CSS
- [ ] Step 4: Include Bootstrap's JavaScript
- [ ] Step 5: Verify

---

## Step 1: Choose an install path

- **CDN** — no build step. Best for static pages, demos, and prototypes. Skip to the CDN section below.
- **Package manager (npm)** — required to customize Bootstrap's Sass tokens or tree-shake JS. Requires Node.js and a Sass compiler. Continue with the npm section.

Bootstrap 6 depends on two optional peer packages:

- `@floating-ui/dom` — positioning for menus, popovers, and tooltips. Omit if you don't use them.
- `vanilla-calendar-pro` — the datepicker. Omit if you don't use it.

---

## Step 2 & 3 (CDN): Include via CDN

Add Bootstrap's CSS in `<head>` and the JS bundle before the closing `</body>`. The bundle includes Floating UI and Vanilla Calendar Pro.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Bootstrap demo</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
  </head>
  <body>
    <div class="container py-4 px-3 mx-auto">
      <h1>Hello, Bootstrap!</h1>
      <button class="btn-solid theme-primary">Primary button</button>
    </div>
    <script type="module" src="https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha1/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
  </body>
</html>
```

Always add the `integrity` (SRI hash) and `crossorigin="anonymous"` attributes in production. Copy the exact URLs and hashes for the target version from the Install docs — do not guess hashes.

To load Floating UI and Vanilla Calendar Pro separately (smaller payload), use the non-bundle JS with an import map:

```html
<script type="importmap">
{
  "imports": {
    "@floating-ui/dom": "https://cdn.jsdelivr.net/npm/@floating-ui/dom/+esm",
    "vanilla-calendar-pro": "https://cdn.jsdelivr.net/npm/vanilla-calendar-pro/+esm"
  }
}
</script>
<script type="module" src="https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha1/dist/js/bootstrap.min.js" crossorigin="anonymous"></script>
```

For a CDN setup you're done — skip to **Step 5: Verify**.

---

## Step 2 (npm): Install

```sh
npm install bootstrap @floating-ui/dom vanilla-calendar-pro
```

Bootstrap 6 requires a **Sass compiler** (Dart Sass) and **PostCSS/Autoprefixer** to match the official compiled output. Node Sass is not supported. Install the build tooling your setup needs, e.g.:

```sh
npm install --save-dev sass autoprefixer postcss postcss-cli
```

## Step 3 (npm): Include Bootstrap's CSS

Import Bootstrap's source Sass with the modern `@use` rule (never `@import` — it's removed in Dart Sass and unsupported in v6):

```scss
// Import all of Bootstrap's CSS
@use "bootstrap/scss/bootstrap";
```

Customize tokens with the `with ()` syntax. Only include the keys you want to change — Bootstrap merges overrides with its defaults:

```scss
@use "bootstrap/scss/bootstrap" with (
  $root-tokens: (
    --border-radius: .25rem,
    --spacer: 1.5rem,
  )
);
```

Compile the Sass to CSS with a `--load-path=node_modules` so `bootstrap` resolves, then run Autoprefixer via PostCSS.

## Step 4 (npm): Include Bootstrap's JavaScript

Bootstrap 6 JavaScript is ESM-only. Import all plugins onto a `bootstrap` object:

```js
import * as bootstrap from 'bootstrap'
```

Or import only what you need for automatic tree-shaking:

```js
import { Tooltip, Toast, Popover } from 'bootstrap'
```

You can also import a single plugin directly from its file under `bootstrap/js/dist/`.

Floating UI and Vanilla Calendar Pro are imported automatically through Bootstrap when a bundler is used.

---

## Step 5: Verify

1. Load the page (or run the dev server) and confirm the sample `.btn-solid.theme-primary` button and `.container` are styled — that proves Bootstrap's CSS is loaded.
2. Trigger a JS component (e.g. a tooltip or dialog) to confirm the JavaScript loaded without console errors.
3. For CDN setups, confirm the `integrity` hashes match the version you linked (mismatched hashes block the file from loading).
4. If Sass fails to compile, confirm you used `@use` (not `@import`) and passed `--load-path=node_modules`.
5. Bootstrap 6 requires a browser that supports `oklch()` and `color-mix()`.
