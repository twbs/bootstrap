Bootstrap Extra
=================

Bootstrap Extra uses the latest version of Twitter's bootstrap and adds lots of extras for slick web applications.

For more information on Twitter's Bootstrap, checkout http://twitter.github.com/bootstrap!

Extras
-------

**Font Awesome**
Turns glyphicons into an icon font to use a variety of sizes and colors. Also adds a bunch of new icons.
+ http://fortawesome.github.com/Font-Awesome/#

**HTML5 Boilerplate Goodies**
Uses sample files and resources gathered and created from HTML5 Boilerplate for making great HTML5 pages. Bootstrap Extra includes a sample file ready to go for a new Bootstrap HTML5 Page.
+ http://html5boilerplate.com/

How to upgrade bootstrap core (if you don't want to wait for me to do it)
-------------------------------------------------------------------------

Directions for upgrading bootstrap core
===========

Using bootstrap extras requires using the LESS framework in your development environment. 
At this time, you can avoid having to do this by simply downloading the latest releases of Bootstrap extras from GitHub.

1. Download complete bootstrap files from http://twitter.github.com/bootstrap
2. Simply paste everything into the root of this directory (at the same level as index.html and 404.html)
3. Edit /less/bootstrap.less
4. After this line:

@import "variables.less"; // Modify this for custom colors, font-sizes, etc

Add this line: 

@import "../overrides/less/variables.less"; // Use our own variables if we want.

So it should look like this:

// Core variables and mixins
@import "variables.less"; // Modify this for custom colors, font-sizes, etc
@import "../overrides/less/variables.less"; // Use our own variables if we want.
@import "mixins.less";

5. In the same file add this to the very end:

//Overrides
@import "../overrides/less/overrides.less";

6. Compile and you're set.

Authors
-------
(Original)

**Mark Otto**

+ http://twitter.com/mdo
+ http://github.com/markdotto

**Jacob Thornton**

+ http://twitter.com/fat
+ http://github.com/fat

(Modified)

**Adam Kochanowicz**

+ http://twitter.com/yourwebsitesUX

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
