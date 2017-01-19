---
layout: docs
title: Build tools
description: Details on how to use Bootstrap's included build tools to compile source code, run tests, and more.
group: getting-started
---

Bootstrap uses [Grunt](http://gruntjs.com) and [NPM](https://www.npmjs.com) for its CSS and JavaScript build system and Jekyll for the written documentation. Our package.json file includes convenient methods for working with the framework, including compiling code, running tests, and more.

## Contents

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## Tooling setup

To use our build tasks and run our documentation locally, you'll need a copy of Bootstrap's source files, Node, and Ruby. Follow these steps and you should be ready to rock:

1. [Download and install Node](https://nodejs.org/download/), which we use to manage our dependencies.
2. [Install Ruby][install-ruby], that is required to run Jekyll.
3. Navigate to the root `/bootstrap` directory and run `npm install` to install our local dependencies listed in [package.json](https://github.com/twbs/bootstrap/blob/v4-dev/package.json).


**Windows users:** Read [this unofficial guide](http://jekyll-windows.juthilo.com/) to get Jekyll up and running without problems.

When completed, you'll be able to run the NPM commands provided from the command line.

[install-ruby]: https://www.ruby-lang.org/en/documentation/installation/
[gembundler]: https://bundler.io/

## Using NPM

Our build tool includes the following commands and tasks:

| Task | Description |
| --- | --- |
| `npm run dist` | Run `grunt` to  compile the CSS and JavaScript into `/dist` and generate the documentation site. **Uses [Sass](http://sass-lang.com/), [Autoprefixer][autoprefixer], and [UglifyJS](http://lisperator.net/uglifyjs/).** |
| `npm run test` | Compile the CSS and Javascript, generate the documentation site, runs [Stylelint](http://stylelint.io/), [ESLint](http://eslint.org/) and [QUnit](https://qunitjs.com/) tests headlessly in [PhantomJS](http://phantomjs.org/) (used for CI). |
| `npm run watch` | This is a convenience method for watching Sass, Javascript and documentation sources and automatically building them. |

## Local development
Our build tool offer the `npm run watch` command that start a local webserver hosting the documentation site. Each modification of the sources files will rebuild the necessary components and reload the site <http://localhost:9001> in your browser.

Here's how to get started:
1. Run through the [tooling setup](#tooling-setup) above to install NPM, Ruby dependencies and the project dependencies.
2. From the root `/bootstrap` directory, run `npm run watch` in the command line.
3. Open <http://localhost:9001> in your browser.
4. All the modification to the Javascript, Sass, Documentation sources will be immediately reflected in your browser.

## Autoprefixer

Bootstrap uses [Autoprefixer][autoprefixer] (included in our build process) to automatically add vendor prefixes to some CSS properties at build time. Doing so saves us time and code by allowing us to write key parts of our CSS a single time while eliminating the need for vendor mixins like those found in v3.

We maintain the list of browsers supported through Autoprefixer in a separate file within our GitHub repository. See [`build/grunt/postcss.js`](https://github.com/twbs/bootstrap/blob/v4-dev/build/grunt/postcss.js) for details.

## Local documentation

Running our documentation locally requires the use of Jekyll, a decently flexible static site generator that provides us: basic includes, Markdown-based files, templates, and more. Here's how to get it started:

1. Run through the [tooling setup](#tooling-setup) above to install NPM, Ruby dependencies and the project dependencies.
2. From the root `/bootstrap` directory, run `npm run watch` in the command line.
3. Open <http://localhost:9001> in your browser, and voilà.

Learn more about using Jekyll by reading its [documentation](https://jekyllrb.com/docs/home/).

## Troubleshooting

Should you encounter problems with installing dependencies or running Grunt commands, uninstall all previous dependency versions (global and local). Then, rerun `npm install`.

[autoprefixer]: https://github.com/postcss/autoprefixer
