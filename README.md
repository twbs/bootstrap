# [Bootstrap](http://getbootstrap.com) [![Build Status](https://secure.travis-ci.org/twbs/bootstrap.png)](http://travis-ci.org/twbs/bootstrap) [![devDependency Status](https://david-dm.org/twbs/bootstrap/dev-status.png)](https://david-dm.org/twbs/bootstrap#info=devDependencies)

Bootstrap is a sleek, intuitive, and powerful front-end framework for faster and easier web development, created and maintained by [Mark Otto](http://twitter.com/mdo) and [Jacob Thornton](http://twitter.com/fat).

This is the Sass version of Bootstrap. A port of Bootstrap from Less to Sass. This project is focused on being a 1:1 port of the original. Please do not submit issues or pull requests for issues with Bootstrap itself. Those should be pushed upstream in the Less version.

To get started, check out <http://getbootstrap.com>!



## SASS: Quick start

Three quick start options are available:

* [Download the latest release](https://github.com/jlong/sass-twitter-bootstrap/zipball/master).
* Clone the repo: `git clone git://github.com/jlong/sass-bootstrap.git`.
* Install with [Bower](http://bower.io): `bower install --save sass-bootstrap`.



## SASS: Usage

You can use the Sass Bootstrap by dropping the compiled CSS into any new project and start cranking.

Because SASS always outputs standard css, just link to the final output like normal:

`<link rel="stylesheet" type="text/css" href="./dist/css/bootstrap.css">`

For more info, refer to the docs!



## SASS: Basic modification

You can learn more about Sass at:

[sass-lang.com](http://sass-lang.com)

Sass runs as a local GEM on your system. You can run `sass --watch lib/bootstrap.scss:dist/css/bootstrap.css`



## Quick start

Three quick start options are available:

* [Download the latest release](https://github.com/twbs/bootstrap/archive/v3.0.2.zip).
* Clone the repo: `git clone https://github.com/twbs/bootstrap.git`.
* Install with [Bower](http://bower.io): `bower install bootstrap`.

Read the [Getting Started page](http://getbootstrap.com/getting-started/) for information on the framework contents, templates and examples, and more.

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



## Bugs and feature requests

Have a bug or a feature request? [Please open a new issue](https://github.com/twbs/bootstrap/issues). Before opening any issue, please search for existing issues and read the [Issue Guidelines](https://github.com/necolas/issue-guidelines), written by [Nicolas Gallagher](https://github.com/necolas/).

You may use [this JS Bin](http://jsbin.com/aKiCIDO/1/edit) as a template for your bug reports.



## Documentation

Bootstrap's documentation, included in this repo in the root directory, is built with [Jekyll](http://jekyllrb.com) and publicly hosted on GitHub Pages at <http://getbootstrap.com>. The docs may also be run locally.

### Running documentation locally

1. If necessary, [install Jekyll](http://jekyllrb.com/docs/installation) (requires v1.x).
2. From the root `/bootstrap` directory, run `jekyll serve` in the command line.
  - **Windows users:** run `chcp 65001` first to change the command prompt's character encoding ([code page](http://en.wikipedia.org/wiki/Windows_code_page)) to UTF-8 so Jekyll runs without errors.
3. Open <http://localhost:9001> in your browser, and voilà.

Learn more about using Jekyll by reading its [documentation](http://jekyllrb.com/docs/home/).

### Documentation for previous releases

Documentation for v2.3.2 has been made available for the time being at <http://getbootstrap.com/2.3.2/> while folks transition to Bootstrap 3.

[Previous releases](https://github.com/twbs/bootstrap/releases) and their documentation are also available for download.



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

* Follow [@twbootstrap on Twitter](http://twitter.com/twbootstrap).
* Read and subscribe to [The Official Bootstrap Blog](http://blog.getbootstrap.com).
* Have a question that's not a feature request or bug report? [Ask on the mailing list.](http://groups.google.com/group/twitter-bootstrap)
* Chat with fellow Bootstrappers in IRC. On the `irc.freenode.net` server, in the `##twitter-bootstrap` channel.




## Versioning

For transparency and insight into our release cycle, and for striving to maintain backward compatibility, Bootstrap will be maintained under the Semantic Versioning guidelines as much as possible.

Releases will be numbered with the following format:

`<major>.<minor>.<patch>`

And constructed with the following guidelines:

* Breaking backward compatibility bumps the major (and resets the minor and patch)
* New additions without breaking backward compatibility bumps the minor (and resets the patch)
* Bug fixes and misc changes bumps the patch

For more information on SemVer, please visit <http://semver.org/>.



## SASS: Developers

We have included a Rakefile with convenience methods for working with the SASS Bootstrap library.

+ **build** - `rake build`
This will run the less compiler on the bootstrap lib and regenerate the docs dir.
The lessc compiler is required for this command to run.

+ **watch** - `rake watch`
This is a convenience method for watching your Sass files and automatically building them whenever you save.



## Authors

**Mark Otto**

+ <http://twitter.com/mdo>
+ <http://github.com/mdo>

**Jacob Thornton**

+ <http://twitter.com/fat>
+ <http://github.com/fat>



## SASS: Conversion less to Sass

The Twitter Bootstrap was lovingly converted to Sass by:

**John W. Long**

+ http://twitter.com/johnwlong
+ http://github.com/jlong

**Jeremy Hinegardner**

+ http://twitter.com/copiousfreetime
+ http://github.com/copiousfreetime

**m5o**

+ http://twitter.com/m5o
+ http://github.com/m5o

**smt**

+ http://twitter.com/tudorstudio
+ http://github.com/smt

And [others](https://github.com/jlong/sass-twitter-bootstrap/contributors)



## SASS: Conversion Quick Tips

* replace @ with $
* replace . with @include for mixins
* replace `spin` with `adjust-hue`
* add !default to variable definitions
* replace #gradient > .vertical with @include gradient-vertical
* replace #grid > .style with @include grid-style
* use grid-core and grid-fluid mixins instead of #grid > .core and #grid > .fluid
* use font-shorthand instead of #font > .shorthand
* replace fadein with fade-in
* move @import for reset below mixins, because it uses tab-focus mixin in bootstrap.scss
* explicitly provide .clearfix, .hide-text and .input-block-level for compatibility with LESS output
* pass grid-* mixin arguments to generators, because otherwise the generator mixins will use the default variables pull transition definition into variable



## Sass: Installation via Composer

If you already use Composer, the php dependency manager, installing
sass-twitter-bootstrap is as simple as typing :
```shell
composer.phar require jlong/sass-bootstrap:x.y.z
```
This will install version x.y.z from packagist.org

You'll probably want to make sure you get minor updates, like this:
```shell
composer.phar require jlong/sass-bootstrap:~x.y.z
```
or like this:
```shell
composer.phar require jlong/sass-bootstrap:x.y.*
```



## Copyright and license

Copyright 2013 Twitter, Inc under [the Apache 2.0 license](LICENSE).
