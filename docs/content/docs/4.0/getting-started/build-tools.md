---
layout: docs
title: Build tools
description: Learn how to use Bootstrap's included npm scripts to build our documentation, compile source code, run tests, and more.
menu:
  docs:
    parent: getting-started
    weight: -40
toc: true
---

## Tooling setup

Bootstrap uses [NPM scripts](https://docs.npmjs.com/misc/scripts) for its build system. Our [package.json]({{ .Site.Params.repo }}/blob/v{{ .Site.Params.current_version }}/package.json) includes convenient methods for working with the framework, including compiling code, running tests, and more.

To use our build system and run our documentation locally, you'll need a copy of Bootstrap's source files and Node. Follow these steps and you should be ready to rock:

1. [Download and install Node.js](https://nodejs.org/download/), which we use to manage our dependencies.
2. Navigate to the root `/bootstrap` directory and run `npm install` to install our local dependencies listed in [package.json]({{ .Site.Params.repo }}/blob/v{{ .Site.Params.current_version }}/package.json).

When completed, you'll be able to run the various commands provided from the command line.

## Using NPM scripts

Our [package.json]({{ .Site.Params.repo }}/blob/v{{ .Site.Params.current_version }}/package.json) includes the following commands and tasks:

| Task | Description |
| --- | --- |
| `npm run dist` | `npm run dist` creates the `/dist` directory with compiled files. **Uses [Sass](http://sass-lang.com/), [Autoprefixer][autoprefixer], and [UglifyJS](https://github.com/mishoo/UglifyJS2).** |
| `npm test` | Same as `npm run dist` plus it runs tests locally |
| `npm run docs` | Builds and lints CSS and JavaScript for docs. You can then run the documentation locally via `npm run docs-serve`. |

Run `npm run` to see all the npm scripts.

## Autoprefixer

Bootstrap uses [Autoprefixer][autoprefixer] (included in our build process) to automatically add vendor prefixes to some CSS properties at build time. Doing so saves us time and code by allowing us to write key parts of our CSS a single time while eliminating the need for vendor mixins like those found in v3.

We maintain the list of browsers supported through Autoprefixer in a separate file within our GitHub repository. See [/package.json]({{ .Site.Params.repo }}/blob/v{{ .Site.Params.current_version }}/package.json) for details.

## Local documentation

Running our documentation locally requires the use of Hugo, a blazingly fast static site generator that provides us: basic includes, Markdown-based files, templates, and more. Here's how to get it started:

1. Run through the [tooling setup](#tooling-setup) above to install the Node.js dependencies and Hugo (the site builder).
2. From the root `/bootstrap` directory, run `npm run docs-serve` in the command line.
3. Open `http://localhost:9001` in your browser, and voilà.

Learn more about using Hugo by reading its [documentation](https://gohugo.io/documentation/).

## Troubleshooting

Should you encounter problems with installing dependencies, uninstall all previous dependency versions (global and local). Then, rerun `npm install`.

[autoprefixer]: https://github.com/postcss/autoprefixer
