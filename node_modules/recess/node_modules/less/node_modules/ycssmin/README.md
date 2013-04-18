CSSMin
======

This project is a fork of [jbleuzen/node-cssmin](https://github.com/jbleuzen/node-cssmin).

It was originally based on the javascript for of the css minification tool used inside of 
[YUICompressor](https://github.com/yui/yuicompressor) based on code from Stoyan Stefanov and Isaac Schlueter.

We forked this project in order to maintain and up keep it on a regular basis.


Installation
------------

You can either download the plugin and unzip it into to your project folder or you can use npm to install the `ycssmin` package.

`npm -g i ycssmin`

Build Status
------------

[![Build Status](https://secure.travis-ci.org/yui/ycssmin.png)](http://travis-ci.org/yui/ycssmin)

Testing
-------

Clone this repo:

`npm test`

Code Coverage
-------------

We are using [istanbul](https://github.com/gotwarlost/istanbul) to provide code coverage, to view the report:

`npm test`

Then open `./coverage/lcov-report`

We also publish the [latest here](http://yui.github.com/ycssmin/).

We ask that all patches have a test attached and full coverage.

Usage
-----

The module exports the cssmin function, so you can use it with: 

`var cssmin = require('ycssmin').cssmin;`

The function cssmin takes two arguments:
* `input` : the CSS content you want to minimize.
* `linebreakpos` : the number of characters before the end of the line. If empty, the output will have only one line.
	
Example :

```javascript
var fs = require('fs'),
    cssmin = require('ycssmin').cssmin,
    css = fs.readFileSync("/Any/Random/CSS/File.css", encoding='utf8'),
    min = cssmin(css);

console.log(min);
```

License
-------

    Copyright 2012 Yahoo! Inc.
    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met:
        * Redistributions of source code must retain the above copyright
          notice, this list of conditions and the following disclaimer.
        * Redistributions in binary form must reproduce the above copyright
          notice, this list of conditions and the following disclaimer in the
          documentation and/or other materials provided with the distribution.
        * Neither the name of the Yahoo! Inc. nor the
          names of its contributors may be used to endorse or promote products
          derived from this software without specific prior written permission.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
    ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
    WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
    DISCLAIMED. IN NO EVENT SHALL YAHOO! INC. BE LIABLE FOR ANY
    DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
    (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
    LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
    ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
    (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
    SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

Thanks
------

Thanks to Johan BLEUZEN for originally porting this to node.js
