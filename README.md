[Twitter Bootstrap](http://twitter.github.com/bootstrap) [![Build Status](https://secure.travis-ci.org/twitter/bootstrap.png)](http://travis-ci.org/twitter/bootstrap)
=================

Bootstrap is a sleek, intuitive, and powerful front-end framework for faster and easier web development, created and maintained by [Mark Otto](http://twitter.com/mdo) and [Jacob Thornton](http://twitter.com/fat) at Twitter.

To get started, checkout http://getbootstrap.com!



Quick start
-----------

Clone the repo, `git clone git://github.com/twitter/bootstrap.git`, or [download the latest release](https://github.com/twitter/bootstrap/zipball/master).



Versioning
----------

For transparency and insight into our release cycle, and for striving to maintain backward compatibility, Bootstrap will be maintained under the Semantic Versioning guidelines as much as possible.

Releases will be numbered with the following format:

`<major>.<minor>.<patch>`

And constructed with the following guidelines:

* Breaking backward compatibility bumps the major (and resets the minor and patch)
* New additions without breaking backward compatibility bumps the minor (and resets the patch)
* Bug fixes and misc changes bumps the patch

For more information on SemVer, please visit http://semver.org/.



Bug tracker
-----------

Have a bug? Please create an issue here on GitHub that conforms with [necolas's guidelines](https://github.com/necolas/issue-guidelines).

https://github.com/twitter/bootstrap/issues



Twitter account
---------------

Keep up to date on announcements and more by following Bootstrap on Twitter, [@TwBootstrap](http://twitter.com/TwBootstrap).



Blog
----

Read more detailed announcements, discussions, and more on [The Official Twitter Bootstrap Blog](http://blog.getbootstrap.com).



Mailing list
------------

Have a question? Ask on our mailing list!

twitter-bootstrap@googlegroups.com

http://groups.google.com/group/twitter-bootstrap



IRC
---

Server: irc.freenode.net

Channel: ##twitter-bootstrap (the double ## is not a typo)



Developers
----------

We have included a makefile with convenience methods for working with the Bootstrap library.

+ **dependencies**
Our makefile depends on you having recess, connect, uglify.js, and jshint installed. To install, just run the following command in npm:

```
$ npm install recess connect uglify-js jshint -g
```

+ **build** - `make`
Runs the recess compiler to rebuild the `/less` files and compiles the docs pages. Requires recess and uglify-js. <a href="http://twitter.github.com/bootstrap/less.html#compiling">Read more in our docs &raquo;</a>

+ **test** - `make test`
Runs jshint and qunit tests headlessly in [phatomjs] (http://code.google.com/p/phantomjs/) (used for ci). Depends on having phantomjs installed.

+ **watch** - `make watch`
This is a convenience method for watching just Less files and automatically building them whenever you save. Requires the Watchr gem.



Contributing
------------

Please submit all pull requests against *-wip branches. If your unit test contains javascript patches or features, you must include relevant unit tests. Thanks!



Authors
-------

**Mark Otto**

+ http://twitter.com/mdo
+ http://github.com/markdotto

**Jacob Thornton**

+ http://twitter.com/fat
+ http://github.com/fat



Copyright and license
---------------------

Copyright 2012 Twitter, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this work except in compliance with the License.
You may obtain a copy of the License in the LICENSE file, or at:

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
