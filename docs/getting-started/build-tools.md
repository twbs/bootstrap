---
layout: docs
title: Build tools
group: getting-started
---

Bootstrap uses [Grunt](http://gruntjs.com) for its CSS and JavaScript build system and Jekyll for the written documentation. Our Gruntfile includes convenient methods for working with the framework, including compiling code, running tests, and more.

## Tooling setup

To use our Gruntfile and run our documentation locally, you'll need a copy of Bootstrap's source files, Node, and Grunt. Follow these steps and you should be ready to rock:

1. [Download and install Node](https://nodejs.org/download), which we use to manage our dependencies.
2. Install the Grunt command line tools, `grunt-cli`, with `npm install -g grunt-cli`.
3. Navigate to the root `/bootstrap` directory and run `npm install` to install our local dependencies listed in [package.json](https://github.com/twbs/bootstrap/blob/master/package.json).
4. [Install Ruby][install-ruby], install [Bundler][gembundler] with `gem install bundler`, and finally run `bundle`. This will install all Ruby dependencies, such as Jekyll and Sass linter.

When completed, you'll be able to run the various Grunt commands provided from the command line.

[install-ruby]: https://www.ruby-lang.org/en/documentation/installation/
[gembundler]: http://bundler.io/

## Using Grunt

Our Gruntfile includes the following commands and tasks:

| Task | Description |
| --- | --- |
| `grunt` | Run `grunt` to run tests locally and compile the CSS and JavaScript into `/dist`. **Uses [Sass](http://sass-lang.com/) and [UglifyJS](http://lisperator.net/uglifyjs/).** |
| `grunt dist` | `grunt dist` creates the `/dist` directory with compiled files. **Uses [Sass](http://sass-lang.com/) and [UglifyJS](http://lisperator.net/uglifyjs/).** |
| `grunt test` | Runs [JSHint](http://jshint.com) and [QUnit](http://qunitjs.com/) tests headlessly in [PhantomJS](http://phantomjs.org/) (used for CI). |
| `grunt docs` | Builds and tests CSS, JavaScript, and other assets which are used when running the documentation locally via `jekyll serve`. |
| `grunt watch` | This is a convenience method for watching just Sass files and automatically building them whenever you save. |

## Switching Sass compilers

Bootstrap will be compiled with [libsass][libsass] by default, but you can opt into traditional Ruby Sass by setting the `TWBS_SASS` environment variable. Two options are supported:

* `libsass` (default) to use [libsass][libsass] via [grunt-sass][grunt-sass].
* `sass` to use [Ruby Sass][ruby-sass] via [grunt-contrib-sass][grunt-contrib-sass].

For example, run `TWBS_SASS=sass grunt` to test and build Bootstrap with Ruby Sass.

[ruby-sass]: https://github.com/sass/sass
[grunt-contrib-sass]: https://github.com/gruntjs/grunt-contrib-sass
[libsass]: https://github.com/sass/libsass
[grunt-sass]: https://github.com/sindresorhus/grunt-sass

## Local documentation

Running our documentation locally requires the use of Jekyll, a decently flexible static site generator that provides us basic includes, Markdown-based files, templates, and more. Here's how to get it started:

1. Run through the [tooling setup](#tooling-setup) above to install Jekyll (the site builder) and Rouge (our syntax highlighter).
  - **Windows users:** Read [this unofficial guide](http://jekyll-windows.juthilo.com/) to get Jekyll up and running without problems.
2. From the root `/bootstrap` directory, run `jekyll serve` in the command line.
3. Open <http://localhost:9001> in your browser, and voilà.

Learn more about using Jekyll by reading its [documentation](http://jekyllrb.com/docs/home/).

## Troubleshooting

Should you encounter problems with installing dependencies or running Grunt commands, uninstall all previous dependency versions (global and local). Then, rerun `npm install`.
