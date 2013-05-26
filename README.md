# [Bootstrap v3.0.0](http://getbootstrap.com) [![Build Status](https://secure.travis-ci.org/twitter/bootstrap.png)](http://travis-ci.org/twitter/bootstrap)

Bootstrap is a sleek, intuitive, and powerful front-end framework for faster and easier web development, created and maintained by [Mark Otto](http://twitter.com/mdo) and [Jacob Thornton](http://twitter.com/fat).

To get started, check out [http://getbootstrap.com](http://getbootstrap.com)!



## Quick start

Three quick start options are available:

* [Download the latest release](https://github.com/twitter/bootstrap/zipball/master).
* Clone the repo: `git clone git://github.com/twitter/bootstrap.git`.
* Install with [Bower](http://bower.io): `bower install bootstrap`.

Read the [Getting Started page](http://getbootstrap.com/getting-started/) for information on the framework contents, templates and examples, and more.



## SASS: Quick start

Three quick start options are available:

* [Download the latest release](https://github.com/jlong/sass-twitter-bootstrap/zipball/master).
* Clone the repo: `git clone git://github.com/jlong/sass-twitter-bootstrap.git`.
* Install with [Bower](http://bower.io): `bower install --save sass-bootstrap`.



## SASS: Usage

You can use the SASS Twitter Bootstrap by dropping the compiled CSS into any new project and start cranking.

Because SASS always outputs standard css, just link to the final output like normal:

`<link rel="stylesheet" type="text/css" href="bootstrap-3.0.0.css">`

For more info, refer to the docs!



## SASS: Basic modification

You can learn more about SASS at:

[sass-lang.com](http://sass-lang.com)

SASS runs as a local GEM on your system. You can run `sass --watch lib/bootstrap.scss:bootstrap-3.0.0.css`



## Bugs and feature requests

Have a bug or a feature request? [Please open a new issue](https://github.com/twitter/bootstrap/issues). Before opening any issue, please search for existing issues and read the [Issue Guidelines](https://github.com/necolas/issue-guidelines), written by [Nicolas Gallagher](https://github.com/necolas/).



## Documentation

Bootstrap's documentation, included in this repo in the `/docs` directory, is built with [Jekyll](http://jekyllrb.com) and publicly hosted on GitHub Pages at [http://getbootstrap.com](http://getbootstrap.com). The docs maybe also be run locally.

### Running documentation locally

1. If necessary, [install Jekyll](http://jekyllrb.com/docs/installation).
2. From the `/bootstrap` directory, run `jekyll serve` in the command line.
3. Open [http://getbootstrap.dev:9001](http://getbootstrap.dev:9001) in your browser, and voilà.

Learn more about using Jekyll by reading their [documentation](http://jekyllrb.com/docs/home/).

### Documentation for previous releases

Documentation for v2.3.2 has been made available for the time being at [http://getbootstrap.com/2.3.2/docs](http://getbootstrap.com/2.3.2/docs) while folks transition to Bootstrap 3.

For previous releases, documentation is available for [download via Git tags](https://github.com/twitter/bootstrap/tags).



## Compiling CSS and JavaScript

Bootstrap includes a [makefile](Makefile) with convenient methods for working with the framework. Before getting started, install [the necessary local dependencies](package.json):

```
$ npm install
```

When completed, you'll be able to run the various make commands provided.

### Available makefile commands

#### Build - `make`
`make` runs the Recess compiler to rebuild the `/less` files and compile the docs. **Requires recess and uglify-js.**

#### Compile CSS, JS, and fonts - `make bootstrap`
`make bootstrap` creates the `/bootstrap` directory with compiled files. **Requires recess and uglify-js.**

#### Tests - `make test`
Runs jshint and qunit tests headlessly in [phantomjs](http://code.google.com/p/phantomjs/) (used for ci). **Requires phantomjs.**

#### Watch - `make watch`
This is a convenience method for watching just Less files and automatically building them whenever you save. **Requires the watchr gem.**

### Troubleshooting dependencies

Should you encounter problems with installing dependencies or running makefile commands, uninstall all previous dependency versions (global and local). Then, rerun `npm install`.



## Contributing

Please read through our guidelines for contributing to Bootstrap. Included are directions for opening issues, coding standards, and notes on development. 

More over, if your pull request contains JavaScript patches or features, you must include relevant unit tests. All HTML and CSS should conform to the [Code Guide](http://github.com/mdo/code-guide), maintained by [Mark Otto](http://github.com/mdo).

Editor preferences are available in the [editor config](.editorconfig) for easy use in common text editors. Read more and download plugins at [http://editorconfig.com](http://editorconfig.com).



## Community

Keep track of development and community news.

* Follow [@twbootstrap on Twitter](http://twitter.com/twbootstrap).
* Read and subscribe to the [The Official Twitter Bootstrap Blog](http://blog.getbootstrap.com).
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

For more information on SemVer, please visit [http://semver.org/](http://semver.org/).



## SASS: Developers

We have included a Rakefile with convenience methods for working with the SASS Bootstrap library.

+ **build** - `rake build`
This will run the less compiler on the bootstrap lib and regenerate the docs dir.
The lessc compiler is required for this command to run.

+ **watch** - `rake watch`
This is a convenience method for watching your Sass files and automatically building them whenever you save.



## Authors

**Mark Otto**

+ [http://twitter.com/mdo](http://twitter.com/mdo)
+ [http://github.com/mdo](http://github.com/mdo)

**Jacob Thornton**

+ [http://twitter.com/fat](http://twitter.com/fat)
+ [http://github.com/fat](http://github.com/fat)



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



## SASS: Installation via Composer

If you already use Composer, the php dependency manager, installing
sass-twitter-bootstrap is as simple as typing :
```shell
composer.phar require jlong/sass-twitter-bootstrap:x.y.z
```
This will install version x.y.z from packagist.org

You'll probably want to make sure you get minor updates, like this:
```shell
composer.phar require jlong/sass-twitter-bootstrap:~x.y.z
```
or like this:
```shell
composer.phar require jlong/sass-twitter-bootstrap:x.y.*
```



## Copyright and license

Copyright 2012 Twitter, Inc under [the Apache 2.0 license](LICENSE).
