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
3. [Install Ruby][install-ruby], install [Bundler][gembundler] with `gem install bundler`, and finally run `bundle`. This will install all Ruby dependencies, such as Jekyll and Sass linter.

When completed, you'll be able to run the various Grunt commands provided from the command line.

**Unfamiliar with npm? Don't have node installed?** That's a-okay. npm stands for [node packaged modules](http://npmjs.org/) and is a way to manage development dependencies through node.js. [Download and install node.js](http://nodejs.org/download/) before proceeding.

[install-ruby]: https://www.ruby-lang.org/en/documentation/installation/
[gembundler]: http://bundler.io/

### Available Grunt commands

#### Build - `grunt`
Run `grunt` to run tests locally and compile the CSS and JavaScript into `/dist`. **Uses [Sass](http://sass-lang.com/) and [UglifyJS](http://lisperator.net/uglifyjs/).**

#### Only compile CSS and JavaScript - `grunt dist`
`grunt dist` creates the `/dist` directory with compiled files. **Uses [Sass](http://sass-lang.com/) and [UglifyJS](http://lisperator.net/uglifyjs/).**

#### Tests - `grunt test`
Runs [JSHint](http://jshint.com) and [QUnit](http://qunitjs.com/) tests headlessly in [PhantomJS](http://phantomjs.org/) (used for CI).

#### Build and test docs assets - `grunt docs`
Builds and tests CSS, JavaScript, and other assets which are used when running the documentation locally via `jekyll serve`.

#### Watch - `grunt watch`
This is a convenience method for watching just Sass files and automatically building them whenever you save.

### Use another Sass compiler
Bootstrap is compiled with [libsass][libsass] by default.
Use another compiler by setting `TWBS_SASS` environment variable to:

* `sass` to use [Ruby Sass][ruby-sass] via [grunt-contrib-sass][grunt-contrib-sass].
* `libsass` (default) to use [libsass][libsass] via [grunt-sass][grunt-sass].

For example, run `TWBS_SASS=sass grunt` to test and build Bootstrap with Ruby Sass.

[ruby-sass]: https://github.com/sass/sass
[grunt-contrib-sass]: https://github.com/gruntjs/grunt-contrib-sass
[libsass]: https://github.com/sass/libsass
[grunt-sass]: https://github.com/sindresorhus/grunt-sass

### Troubleshooting dependencies

Should you encounter problems with installing dependencies or running Grunt commands, uninstall all previous dependency versions (global and local). Then, rerun `npm install`.
