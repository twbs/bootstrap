# minimatch

A minimal matching utility.

[![Build Status](https://secure.travis-ci.org/isaacs/minimatch.png)](http://travis-ci.org/isaacs/minimatch)


This is the matching library used internally by npm.

Eventually, it will replace the C binding in node-glob.

It works by converting glob expressions into JavaScript `RegExp`
objects.

## Usage

```javascript
var minimatch = require("minimatch")

minimatch("bar.foo", "*.foo") // true!
minimatch("bar.foo", "*.bar") // false!
```

## Features

Supports all glob features.

See:

* `man sh`
* `man fnmatch`
* `man 5 gitignore`

### Departures from zsh/bash/ksh/sh

If the pattern starts with a `!` character, then it is negated.

If a pattern starts with `#`, then it is treated as a comment, and
will not match anything.  (Use `\#` to match a literal `#` at the
start of a line.)

The double-star `**` is always supported, instead of requiring a special
flag.

If an escaped pattern has no matches, and the `null` flag is not set,
then minimatch.match returns the pattern as-provided, rather than
interpreting the character escapes.  For example,
`minimatch.match([], "\\*a\\?")` will return `"\\*a\\?"` rather than
`"*a?"`.

## Functions

### minimatch(path, pattern, options)

Main export.  Tests a path against
the pattern using the options.

### minimatch.filter(pattern, options)

Returns a function that tests its
supplied argument, suitable for use with `Array.filter`.

### minimatch.match(list, pattern, options)

Match against the list of
files, in the style of fnmatch or glob.  If nothing is matched, then
return the pattern (unless `{ null: true }` in the options.)

### minimatch.makeRe(pattern, options)

Make a regular expression object
from the pattern.

## Options

All options are `false` by default.

### debug

Dump a ton of stuff to stderr.

### null

Return an empty list from minimatch.match, instead of a list
containing the pattern itself.

### nocase

Perform a case-insensitive match.

### cache

An LRU cache with `.get(k)` and `.set(k,v)` methods.  By
default, an instance of `node-lru-cache` is used, with 1000 max
entries.

### slash

If set, then `a/*` will match `a/` as well as `a/b`.

### matchBase

If set, then patterns without slashes will be matched
against the basename of the path if it contains slashes.  For example,
`a?b` would match `xyz/123/acb`.

### partial

Internal.  Used by `minimatch.makeRe`.

### dot

Allow patterns to match paths starting with a period, even if
the pattern does not explicitly start with a period.
