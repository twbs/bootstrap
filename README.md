CommCareHQ Bootstrap, forked from Twitter Bootstrap
===================================================

HQ Bootstrap is a flavor of Twitter Bootstrap designed to work specifically with [CommCare HQ](https://github.com/dimagi/commcare-hq).
It provides all of the styling and basic javascript for HQ's user interface.

HQ Bootstrap Requirements
-------------------------

### lessc

The LESS CSS compiler is required to compile all the .less files from hq-boostrap.

You must first [install nodejs](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager).

Do the following to install `lessc`.

+ `sudo git clone https://github.com/cloudhead/less.js.git /opt/lessc`
+ add `alias lessc='nodejs /opt/lessc/bin/lessc'` to your bash profile

**Note to OSX users:**

This [LESS app](http://incident57.com/less/) is super useful for working with LESS.
It's highly recommended that you use this when making changes to the .less files. Use this along side the `make extra` command described below for updating changes to javascript or image files.

### uglify-js

Check the README for [uglify-js on GitHub](https://github.com/mishoo/UglifyJS) for instructions of how to install uglify-js for your system.

Building Bootstrap
------------------

+ **build** - `make`
This will run the less compiler on the bootstrap lib and compile to core-hq/hqwebapp/static/hq-bootstrap
The lessc compiler and uglifyjs are required for this command to run.

+ **build** - `make extra`
This will compile everything but the .less files. uglify-js is necessary for this.

+ **watch** - `make watch`
This is a convenience method for watching your less files and automatically building them whenever you save.
Watchr is required for this command to run.


Authors of Twitter Bootstrap
----------------------------

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

