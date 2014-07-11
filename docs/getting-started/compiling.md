---
layout: page
title: Compiling with Grunt
---

Bootstrap uses [Grunt](http://gruntjs.com) for its build system, with convenient methods for working with the framework. It's how we compile our code, run tests, and more.

### Install Grunt

**To install Grunt, you must first [download and install node.js](http://nodejs.org/download/)** (which includes npm). npm stands for [node packaged modules](http://npmjs.org/) and is a way to manage development dependencies through node.js.

From the command line:

1. Install `grunt-cli` globally with `npm install -g grunt-cli`.
2. Navigate to the root `/bootstrap` directory, then run `npm install`. npm will look at [package.json](https://github.com/twbs/bootstrap/blob/master/package.json) and automatically install the necessary local dependencies listed there.

When completed, you'll be able to run the various Grunt commands provided from the command line.

**Unfamiliar with npm? Don't have node installed?** That's a-okay. npm stands for [node packaged modules](http://npmjs.org/) and is a way to manage development dependencies through node.js. [Download and install node.js](http://nodejs.org/download/) before proceeding.

### Available Grunt commands

#### Build - `grunt`
Run `grunt` to run tests locally and compile the CSS and JavaScript into `/dist`. **Uses [Less](http://lesscss.org/) and [UglifyJS](http://lisperator.net/uglifyjs/).**

#### Only compile CSS and JavaScript - `grunt dist`
`grunt dist` creates the `/dist` directory with compiled files. **Uses [Less](http://lesscss.org/) and [UglifyJS](http://lisperator.net/uglifyjs/).**

#### Tests - `grunt test`
Runs [JSHint](http://jshint.com) and [QUnit](http://qunitjs.com/) tests headlessly in [PhantomJS](http://phantomjs.org/) (used for CI).

#### Watch - `grunt watch`
This is a convenience method for watching just Less files and automatically building them whenever you save.

### Troubleshooting dependencies

Should you encounter problems with installing dependencies or running Grunt commands, uninstall all previous dependency versions (global and local). Then, rerun `npm install`.
