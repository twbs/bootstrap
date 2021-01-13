---
layout: docs
title: Build tools
description: Learn how to use Bootstrap's included npm scripts to build our documentation, compile source code, run tests, and more.
group: getting-started
toc: true
---

## Tooling setup

Bootstrap uses [npm scripts](https://docs.npmjs.com/misc/scripts/) for its build system. Our [package.json]({{< param repo >}}/blob/v{{< param current_version >}}/package.json) includes convenient methods for working with the framework, including compiling code, running tests, and more.

To use our build system and run our documentation locally, you'll need a copy of Bootstrap's source files and Node. Follow these steps and you should be ready to rock:

1. [Download and install Node.js](https://nodejs.org/en/download/), which we use to manage our dependencies.
2. Either [download Bootstrap's sources]({{< param "download.source" >}}) or fork [Bootstrap's repository]({{< param repo >}}).
3. Navigate to the root `/bootstrap` directory and run `npm install` to install our local dependencies listed in [package.json]({{< param repo >}}/blob/v{{< param current_version >}}/package.json).

When completed, you'll be able to run the various commands provided from the command line.

## Using npm scripts

Our [package.json]({{< param repo >}}/blob/v{{< param current_version >}}/package.json) includes the following commands and tasks:

| Task | Description |
| --- | --- |
| `npm run dist` | `npm run dist` creates the `/dist/` directory with compiled files. **Uses [Sass](https://sass-lang.com/), [Autoprefixer][autoprefixer], and [terser](https://github.com/terser/terser).** |
| `npm test` | Runs tests locally after running `npm run dist` |
| `npm run docs-serve` | Builds and runs the documentation locally. |

Run `npm run` to see all the npm scripts.

{{< callout info >}}
{{< partial "callout-info-npm-starter.md" >}}
{{< /callout >}}

## Sass

Bootstrap v4 uses [Node Sass](https://github.com/sass/node-sass) for compiling our Sass source files into CSS files (included in our build process). In order to end up with the same generated CSS when compiling Sass using your own asset pipeline, you'll need to use a Sass compiler that supports at least the features that Node Sass does. This is important to note because as of October 26, 2020, LibSass and packages built on top of it—including Node Sass—are [deprecated](https://sass-lang.com/blog/libsass-is-deprecated).

If you require newer Sass features or compatibility with newer CSS standards, [Dart Sass](https://sass-lang.com/dart-sass) is now the primary implementation of Sass and supports a JavaScript API that's fully compatible with Node Sass (with a few exceptions listed on Dart Sass's [GitHub page](https://github.com/sass/dart-sass)).

We increase the Sass rounding precision to 6 (by default, it's 5 in Node Sass) to prevent issues with browser rounding. If you use Dart Sass this won't be something you need to adjust, as that compiler uses a rounding precision of 10 and for efficiency reasons does not allow it to be adjusted.

## Autoprefixer

Bootstrap uses [Autoprefixer][autoprefixer] (included in our build process) to automatically add vendor prefixes to some CSS properties at build time. Doing so saves us time and code by allowing us to write key parts of our CSS a single time while eliminating the need for vendor mixins like those found in v3.

We maintain the list of browsers supported through Autoprefixer in a separate file within our GitHub repository. See [.browserslistrc]({{< param repo >}}/blob/v{{< param current_version >}}/.browserslistrc) for details.

## Local documentation

Running our documentation locally requires the use of Hugo, which gets installed via the [hugo-bin](https://www.npmjs.com/package/hugo-bin) npm package. Hugo is a blazingly fast and quite extensible static site generator that provides us: basic includes, Markdown-based files, templates, and more. Here's how to get it started:

1. Run through the [tooling setup](#tooling-setup) above to install all dependencies.
2. From the root `/bootstrap` directory, run `npm run docs-serve` in the command line.
3. Open `http://localhost:9001/` in your browser, and voilà.

Learn more about using Hugo by reading its [documentation](https://gohugo.io/documentation/).

## Troubleshooting

Should you encounter problems with installing dependencies, uninstall all previous dependency versions (global and local). Then, rerun `npm install`.

[autoprefixer]: https://github.com/postcss/autoprefixer
