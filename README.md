# [Jasny Bootstrap](http://jasny.github.io/bootstrap/) [![Build Status](https://secure.travis-ci.org/jasny/bootstrap.png)](http://travis-ci.org/jasny/bootstrap)[![devDependency Status](https://david-dm.org/jasny/bootstrap/dev-status.png)](https://david-dm.org/jasny/bootstrap#info=devDependencies)

Jasny Bootstrap is a fork of the famous [Twitter Bootstrap](http://getbootstrap.com/) with added components.

* [Button labels](http://jasny.github.io/bootstrap/css/#buttons-labels)
* [Off canvas navmenu](http://jasny.github.io/bootstrap/components/#navmenu)
* [Fixed alerts](http://jasny.github.io/bootstrap/components/#alerts-fixed)
* [Row link](http://jasny.github.io/bootstrap/javascript/#rowlink)
* [Input mask](http://jasny.github.io/bootstrap/javascript/#inputmask)
* [File input widget](http://jasny.github.io/bootstrap/javascript/#fileinput)

To get started, check out <http://jasny.github.io/bootstrap>!


## Quick start

Three quick start options are available:

* [Download the latest release](https://github.com/jasny/bootstrap/releases/tag/v3.0.0-p7).
* Clone the repo: `git clone git://github.com/jasny/bootstrap.git`.
* Install with [Bower](http://bower.io): `bower install jasny/bootstrap`.

Read the [Getting Started page](http://jasny.github.io/bootstrap/getting-started/) for information on the framework contents, templates and examples, and more.

### What's included

Within the download you'll find the following directories and files, logically grouping common assets and providing both compiled and minified variations. You'll see something like this:

```
bootstrap/
├── css/
│   ├── bootstrap.css
│   ├── bootstrap.min.css
│   ├── bootstrap-theme.css
│   └── bootstrap-theme.min.css
├── js/
│   ├── bootstrap.js
│   └── bootstrap.min.js
└── fonts/
    ├── glyphicons-halflings-regular.eot
    ├── glyphicons-halflings-regular.svg
    ├── glyphicons-halflings-regular.ttf
    └── glyphicons-halflings-regular.woff
```

We provide compiled CSS and JS (`bootstrap.*`), as well as compiled and minified CSS and JS (`bootstrap.min.*`). Fonts from Glyphicons are included, as is the optional Bootstrap theme.

Alternatively you can extend Twitter Bootstrap by downloading <code>jasny-bootstrap.*</code> files from the extension package, in conjunction with the original Twitter Bootstrap files or a custom build of Bootstrap. The structure of (the compiled) Jasny Bootstrap extension package is:

```
extend/
├── css/
│   ├── jasny-bootstrap.css
│   ├── jasny-bootstrap.min.css
└── js/
    ├── jasny-bootstrap.js
    └── jasny-bootstrap.min.js
```

## Bugs and feature requests

Have a bug or a feature request? [Please open a new issue](https://github.com/jasny/bootstrap/issues). Before opening any issue, please search for existing issues and read the [Issue Guidelines](https://github.com/necolas/issue-guidelines), written by [Nicolas Gallagher](https://github.com/necolas/).

You may use [this JS Bin](http://jsbin.com/iKumuWo/1/edit) as a template for your bug reports.



## Documentation

Bootstrap's documentation, included in this repo in the root directory, is built with [Jekyll](http://jekyllrb.com) and publicly hosted on GitHub Pages at <http://jasny.github.io/bootstrap>. The docs may also be run locally.

### Running documentation locally

1. If necessary, [install Jekyll](http://jekyllrb.com/docs/installation) (requires v1.x).
2. From the root `/bootstrap` directory, run `jekyll serve` in the command line.
  - **Windows users:** run `chcp 65001` first to change the command prompt's character encoding ([code page](http://en.wikipedia.org/wiki/Windows_code_page)) to UTF-8 so Jekyll runs without errors.
3. Open <http://localhost:9001> in your browser, and voilà.

Learn more about using Jekyll by reading its [documentation](http://jekyllrb.com/docs/home/).

### Documentation for previous releases

Documentation for v2.3.2 has been made available for the time being at <http://jasny.github.io/bootstrap/2.3.2/> while folks transition to Bootstrap 3.

[Previous releases](https://github.com/jasny/bootstrap/releases) and their documentation are also available for download.



## Compiling CSS and JavaScript

Bootstrap uses [Grunt](http://gruntjs.com/) with convenient methods for working with the framework. It's how we compile our code, run tests, and more. To use it, install the required dependencies as directed and then run some Grunt commands.

### Install Grunt

From the command line:

1. Install `grunt-cli` globally with `npm install -g grunt-cli`.
2. Navigate to the root `/bootstrap` directory, then run `npm install`. npm will look at [package.json](package.json) and automatically install the necessary local dependencies listed there.

When completed, you'll be able to run the various Grunt commands provided from the command line.

**Unfamiliar with `npm`? Don't have node installed?** That's a-okay. npm stands for [node packaged modules](http://npmjs.org/) and is a way to manage development dependencies through node.js. [Download and install node.js](http://nodejs.org/download/) before proceeding.

### Available Grunt commands

#### Build - `grunt`
Run `grunt` to run tests locally and compile the CSS and JavaScript into `/dist`. **Uses [recess](http://twitter.github.io/recess/) and [UglifyJS](http://lisperator.net/uglifyjs/).**

#### Only compile CSS and JavaScript - `grunt dist`
`grunt dist` creates the `/dist` directory with compiled files. **Uses [recess](http://twitter.github.io/recess/) and [UglifyJS](http://lisperator.net/uglifyjs/).**

#### Tests - `grunt test`
Runs [JSHint](http://jshint.com) and [QUnit](http://qunitjs.com/) tests headlessly in [PhantomJS](http://phantomjs.org/) (used for CI).

#### Watch - `grunt watch`
This is a convenience method for watching just Less files and automatically building them whenever you save.

### Troubleshooting dependencies

Should you encounter problems with installing dependencies or running Grunt commands, uninstall all previous dependency versions (global and local). Then, rerun `npm install`.



## Contributing

Please read through our [contributing guidelines](https://github.com/twbs/bootstrap/blob/master/CONTRIBUTING.md). Included are directions for opening issues, coding standards, and notes on development.

More over, if your pull request contains JavaScript patches or features, you must include relevant unit tests. All HTML and CSS should conform to the [Code Guide](http://github.com/mdo/code-guide), maintained by [Mark Otto](http://github.com/mdo).

Editor preferences are available in the [editor config](.editorconfig) for easy use in common text editors. Read more and download plugins at <http://editorconfig.org>.

With v3.1, we're moving from the Apache 2 to the MIT license for the Bootstrap code (not the docs). Please see the [contributing guidelines](https://github.com/twbs/bootstrap/blob/master/CONTRIBUTING.md) for more information.


## Community

Keep track of development and community news.

* Follow [@ArnoldDaniels on Twitter](http://twitter.com/ArnoldDaniels).
* Have a question that's not a feature request or bug report? [Ask on stackoverflow.](http://stackoverflow.com/)




## Versioning

Jasny Bootstrap follows the version of Twitter Bootstrap added with a custom patch number.

`<major>.<minor>.<patch>-p<jasny patch>`

Backwards compatibility is only broken if Twitter Bootstrap also does so, in which case the major is incremented.


## Authors

**Mark Otto**

+ <http://twitter.com/mdo>
+ <http://github.com/mdo>

**Jacob Thornton**

+ <http://twitter.com/fat>
+ <http://github.com/fat>

**Arnold Daniels**

+ [http://twitter.com/ArnoldDaniels](http://twitter.com/ArnoldDaniels)
+ [http://github.com/jasny](http://github.com/jasny)
+ [http://jasny.net](http://jasny.net)


## Copyright and license

Copyright 2013 Twitter, Inc under [the Apache 2.0 license](LICENSE).
Copyright 2013 Jasny BV under [the Apache 2.0 license](LICENSE).
