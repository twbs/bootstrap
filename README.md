TWITTER BOOTSTRAP
=================

Bootstrap is Twitter's toolkit for kickstarting CSS for websites, apps, and more. It includes base CSS styles for typography, forms, buttons, tables, grids, navigation, alerts, and more.

To get started -- checkout http://twitter.github.com/bootstrap!


Usage
-----

You can use the SASS Twitter Bootstrap by dropping the compiled CSS into any new project and start cranking.

Because SASS always outputs standard css, just link to the final output like normal:

    <link rel="stylesheet" type="text/css" href="bootstrap-1.1.1.css">

For more info, refer to the docs!


Basic modification
------------------

You can learn more about SASS at http://sass-lang.com

SASS runs as a local GEM on your system. You can run "sass --watch lib/bootstrap.scss:bootstrap-1.1.1.css" 


Versioning
----------

For transparency and insight into our release cycle, and for striving to maintain backwards compatibility, Bootstrap will be maintained under the Semantic Versioning guidelines as much as possible.

Releases will be numbered with the follow format:

`<major>.<minor>.<patch>`

And constructed with the following guidelines:

* Breaking backwards compatibility bumps the major
* New additions without breaking backwards compatibility bumps the minor
* Bug fixes and misc changes bump the patch

For more information on SemVer, please visit http://semver.org/.


Bug Tracker
-----------

Have a bug? Please create an issue here on GitHub!

https://github.com/twitter/bootstrap/issues


Mailing List
------------

Have a question? Ask on our mailing list!

twitter-bootstrap@googlegroups.com

http://groups.google.com/group/twitter-bootstrap


Developers
----------

We have included a makefile with convenience methods for working with the bootstrap library.

+ **build** - `make build`
This will run the less compiler on the bootstrap lib and generate a bootstrap.css and bootstrap.min.css file.
The lessc compiler is required for this command to run.

+ **watch** - `make watch`
This is a convenience method for watching your less files and automatically building them whenever you save.
Watchr is required for this command to run.


AUTHORS
-------

**Mark Otto**

+ http://twitter.com/mdo
+ http://github.com/markdotto

**Jacob Thornton**

+ http://twitter.com/fat
+ http://github.com/fat


Copyright and License
---------------------

Copyright 2011 Twitter, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this work except in compliance with the License.
You may obtain a copy of the License in the LICENSE file, or at:

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.