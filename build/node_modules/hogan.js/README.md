## Hogan.js - A mustache compiler.

[Hogan.js](http://twitter.github.com/hogan.js/) is a compiler for the
[Mustache](http://mustache.github.com/) templating language. For information
on Mustache, see the [manpage](http://mustache.github.com/mustache.5.html) and
the [spec](https://github.com/mustache/spec).

## Basics

Hogan compiles templates to HoganTemplate objects, which have a render method.

```js
var data = {
  screenName: "dhg",
};

var template = Hogan.compile("Follow @{{screenName}}.");
var output = template.render(data);

// prints "Follow @dhg."
console.log(output);
```

## Features

Hogan is fast--try it on your workload.

Hogan has separate scanning, parsing and code generation phases. This way it's
possible to add new features without touching the scanner at all, and many
different code generation techniques can be tried without changing the parser.

Hogan exposes scan and parse methods. These can be useful for
pre-processing templates on the server.

```js
var text = "{{^check}}{{i18n}}No{{/i18n}}{{/check}}";
text +=  "{{#check}}{{i18n}}Yes{{/i18n}}{{/check}}";
var tree = Hogan.parse(Hogan.scan(text));

// outputs "# check"
console.log(tree[0].tag + " " + tree[0].name);

// outputs "Yes"
console.log(tree[1].nodes[0].nodes[0]);
```

It's also possible to use HoganTemplate objects without the Hogan compiler
present. That means you can pre-compile your templates on the server, and
avoid shipping the compiler. However, the optional lambda features from the
Mustache spec do require the compiler to be present.

## Why Hogan.js?

Why another templating library?

Hogan.js was written to meet three templating library requirements: good
performance, standalone template objects, and a parser API.

## Issues

Have a bug? Please create an issue here on GitHub!

https://github.com/twitter/hogan.js/issues

## Versioning

For transparency and insight into our release cycle, releases will be numbered with the follow format:

`<major>.<minor>.<patch>`

And constructed with the following guidelines:

* Breaking backwards compatibility bumps the major
* New additions without breaking backwards compatibility bumps the minor
* Bug fixes and misc changes bump the patch

For more information on semantic versioning, please visit http://semver.org/.

## Authors

**Robert Sayre**

+ http://github.com/sayrer

**Jacob Thornton**

+ http://github.com/fat

## License

Copyright 2011 Twitter, Inc.

Licensed under the Apache License, Version 2.0: http://www.apache.org/licenses/LICENSE-2.0