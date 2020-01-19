---
layout: docs
title: Optimize
description: Keep your projects lean, responsive, and maintainable so you can deliver the best experience and focus on more important jobs.
group: customize
toc: true
---

## Lean Sass imports

When using Sass in your asset pipeline, make sure you optimize Bootstrap by only `@import`ing the components you need. Your largest optimizations will likely come from the `Layout & Components` section of our `bootstrap.scss`.

```scss
@import "root";
@import "reboot";
@import "type";
@import "images";
@import "grid";
@import "tables";
@import "forms";
@import "buttons";
@import "transitions";
@import "dropdown";
@import "button-group";
@import "nav";
@import "navbar";
@import "card";
@import "breadcrumb";
@import "pagination";
@import "badge";
@import "alert";
@import "progress";
@import "list-group";
@import "close";
@import "toasts";
@import "modal";
@import "tooltip";
@import "popover";
@import "carousel";
@import "spinners";
```

If you're not using a component, simply comment it out or delete it entirely. For example, if you're not using the carousel, remove that import to save some file size in your compiled CSS. Keep in mind there are some dependencies across Sass imports that may make it more difficult to omit a file.

## Lean JavaScript

Bootstrap's JavaScript includes every component in our primary dist files (`bootstrap.js` and `bootstrap.min.js`), and even our primary dependency (Popper.js) with our bundle files (`bootstrap.bundle.js` and `bootstrap.bundle.min.js`). While you're customizing via Sass, be sure to remove related JavaScript.

Beyond that, ...

## Autoprefixer browserslist.rc

TBD...

## Use Purge CSS

TBD...

## Minimize and gzip

TBD...

## Nonblocking files

TBD...

## Always use https

TBD...
