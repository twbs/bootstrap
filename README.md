FBOOTSTRAPP
=================

Fbootstrapp is a toolkit for kickstarting the development of facebook iframe apps.

It is based on Twitter's excellent Bootstrap.
Just as that, it includes base CSS styles for typography, forms, buttons, tables, grids, navigation, alerts, and more.

However, these are all styled in colors reminiscing facebook's UI.

There are two 12-column grids included, one for 520px (fan-page), the other one for 760px (standalone app).
Put your content in a ```<div class="container">``` or a ```<div class="container canvas">```


Usage
-----

You can use Fbootstrapp in one of two ways: just drop the compiled CSS into any new project and start cranking, or run LESS on your site and compile on the fly like a boss.

Here's what the LESS version looks like:

``` html
<link rel="stylesheet/less" type="text/css" href="lib/bootstrap.less">
<script src="less.js" type="text/javascript"></script>
```

Or if you prefer, the standard css way:

``` html
<link rel="stylesheet" type="text/css" href="bootstrap.css">
```

For more info, refer to the bootstrap docs @ http://twitter.github.com/bootstrap
The usage is identical.


Bug tracker
-----------

Have a bug? Please create an issue here on GitHub!

https://github.com/ckrack/fbootstrapp/issues


Authors
-------

**Clemens Krack (Fbootstrapp)**

+ http://twitter.com/clmnsk
+ http://github.com/ckrack

**Mark Otto (Bootstrap)**

+ http://twitter.com/mdo
+ http://github.com/markdotto

**Jacob Thornton (Bootstrap)**

+ http://twitter.com/fat
+ http://github.com/fat


License
---------------------

Copyright 2011 Twitter, Inc.
Copyright 2011 C. Krack

Licensed under the Apache License, Version 2.0: http://www.apache.org/licenses/LICENSE-2.0