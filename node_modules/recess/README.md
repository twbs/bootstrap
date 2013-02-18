RECESS [![Build Status](https://secure.travis-ci.org/twitter/recess.png)](http://travis-ci.org/twitter/recess)
======

Developed at Twitter to support our internal styleguide, RECESS is a simple, attractive code quality tool for CSS built on top of LESS.

Incorporate it into your development process as a linter, or integrate it directly into your build system as a compiler, RECESS will keep your source looking clean and super manageable.


GENERAL USE
-----------

```CLI
$ recess [path] [options]
```

OPTIONS
-------

- --compile - compiles your code and outputs it to the terminal. Fixes white space and sort order. Can compile css or less.
- --compress - compress your compiled code.
- --config - accepts a path, which specifies a json config object
- --stripColors - removes color from output (useful when logging)
- --watch - watch filesystem for changes, useful when compiling Less projects
- --noIDs - doesn't complain about using IDs in your stylesheets
- --noJSPrefix - doesn't complain about styling `.js-` prefixed classnames
- --noOverqualifying - doesn't complain about overqualified selectors (ie: `div#foo.bar`)
- --noUnderscores - doesn't complain about using underscores in your class names
- --noUniversalSelectors - doesn't complain about using the universal `*` selector
- --prefixWhitespace - adds whitespace prefix to line up vender prefixed properties
- --strictPropertyOrder - doesn't looking into your property ordering
- --zeroUnits - doesn't complain if you add units to values of 0


EXAMPLES
--------

Lint all css files

```CLI
$ recess *.css
```

Lint file, ignore styling of IDs

```CLI
$ recess ./bootstrap.css --noIds false
```

Compile and compress .less file, then output it to a new file

```CLI
$ recess ./bootstrap.less --compress > ./bootstrap-production.css
```

Watch a directory for changes and auto compile a css file from the changes. *experimental*

```CLI
$ recess input.less:ouput.css --watch watch/this/dir/for/changes
```

Watch a single file for changes and auto compile a css file from the changes. *experimental*

```CLI
$ recess input.less:ouput.css --watch
```

PROGRAMMATIC API
----------------

Recess provides a pretty simple programmatic api.

```JS
var recess = require('recess')
```

Once you've required recess, just pass it a `path` (or array of paths) and an optional `options` object and an optional `callback`:

```js
recess(['../fat.css', '../twitter.css'], { compile: true }, callback)
```

The following options (and defaults) are available in the programatic api:

- compile: false
- compress: false
- noIDs: true
- noJSPrefix: true
- noOverqualifying: true
- noUnderscores: true
- noUniversalSelectors: true
- prefixWhitespace: true
- strictPropertyOrder: true
- stripColors: false
- zeroUnits: true

The callback is fired when each instance has finished processessing an input. The callback is passed an array of of instances (one for each path). The instances have a bunch of useful things on them like the raw data and an array of output strings.

When compiling, access the compiled source through the output property:

```js
var recess = require('recess')

recess('./js/fat.css', { compile: true }, function (err, obj) {
  if (err) throw err
  console.log(
  	obj // recess instance for fat.css
  , obj.output // array of loggable content
  , obj.errors // array of failed lint rules
  )
})
```

INSTALLATION
------------

To install recess you need both node and npm installed.

```CLI
$ npm install recess -g
```

AUTHORS
------------

+ **Jacob Thornton**: https://twitter.com/fat

LICENSE
------------

Copyright 2012 Twitter, Inc.

Licensed under the Apache License, Version 2.0: http://www.apache.org/licenses/LICENSE-2.0