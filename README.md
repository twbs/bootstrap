# [Bootstrap v3.0.0](http://getbootstrap.com) [![Build Status](https://secure.travis-ci.org/twitter/bootstrap.png)](http://travis-ci.org/twitter/bootstrap)

Bootstrap is a sleek, intuitive, and powerful front-end framework for faster and easier web development, created and maintained by [Mark Otto](http://twitter.com/mdo) and [Jacob Thornton](http://twitter.com/fat).

To get started, check out [http://getbootstrap.com](http://getbootstrap.com)!



## Quick start

Three quick start options are available:

* [Download the latest release](https://github.com/twitter/bootstrap/zipball/master).
* Clone the repo: `git clone git://github.com/twitter/bootstrap.git`.
* Install with Twitter's [Bower](http://twitter.github.com/bower): `bower install bootstrap`.

Read the [Getting Started page](http://getbootstrap.com/getting-started/) for information on the framework contents, basic template guidelines, and more.


## Bootstrap elsewhere

Beyond getting started with the Bootstrap core, there are ways to use Bootstrap in other tools and services:

* [Roots WordPress theme](https://github.com/retlehs/roots) - A WordPress starter theme based on HTML5 Boilerplate & Bootstrap from Twitter.

Have suggestions? Let us know with a [new issue](https://github.com/twitter/bootstrap/issues).



## Bugs and feature requests

Have a bug or a feature request? [Please open a new issue](https://github.com/twitter/bootstrap/issues). Before opening any issue, please search for existing issues and read the [Issue Guidelines](https://github.com/necolas/issue-guidelines), written by [Nicolas Gallagher](https://github.com/necolas/).



## Documentation

Bootstrap's docs are built using [Jekyll](http://jekyllrb.com) and hosted on GitHub Pages at [http://getbootstrap.com](http://getbootstrap.com). To view our docs locally, you'll need to [install Jekyll](https://github.com/mojombo/jekyll/wiki/install) to run a local server.

Documentation for [previous versions](https://github.com/twitter/bootstrap/tags) is also available via tags.



## Compiling CSS and JavaScript

Bootstrap includes a [makefile](Makefile) with convenient methods for working with the framework. Before getting started, be sure to install [the necessary local dependencies](package.json):

```
$ npm install
```

When completed, you'll be able to run the various make commands provided:

#### Build - `make`
`make` runs the Recess compiler to rebuild the `/less` files and compile the docs. **Requires recess and uglify-js.**

#### Compile CSS, JS, and fonts - `make bootstrap`
`make bootstrap` creates the `/bootstrap` directory with compiled files. **Requires recess and uglify-js.**

#### Tests - `make test`
Runs jshint and qunit tests headlessly in [phantomjs](http://code.google.com/p/phantomjs/) (used for ci). **Requires phantomjs.**

#### Watch - `make watch`
This is a convenience method for watching just Less files and automatically building them whenever you save. **Requires the watchr gem.**

Should you encounter problems with installing dependencies or running the makefile commands, uninstall any previous versions (global and local) you may have installed, and then rerun `npm install`.



## Contributing

Please submit all pull requests against *-wip branches. If your pull request contains JavaScript patches or features, you must include relevant unit tests. All HTML and CSS should conform to the [Code Guide](http://github.com/mdo/code-guide), maintained by [Mark Otto](http://github.com/mdo).

Editor preferences are also available in the [editor config](.editorconfig) for easy application in common text editors. Read more and download plugins at [http://editorconfig.com](http://editorconfig.com).



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



## Authors

**Mark Otto**

+ [http://twitter.com/mdo](http://twitter.com/mdo)
+ [http://github.com/mdo](http://github.com/mdo)

**Jacob Thornton**

+ [http://twitter.com/fat](http://twitter.com/fat)
+ [http://github.com/fat](http://github.com/fat)



## Copyright and license

Copyright 2012 Twitter, Inc under [the Apache 2.0 license](LICENSE).
