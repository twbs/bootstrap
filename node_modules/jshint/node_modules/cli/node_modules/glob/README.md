# Glob

This is a glob implementation in JavaScript.  It uses the `minimatch`
library to do its matching.

## Attention: node-glob users!

The API has changed dramatically between 2.x and 3.x. This library is
now 100% JavaScript, and the integer flags have been replaced with an
options object.

Also, there's an event emitter class, proper tests, and all the other
things you've come to expect from node modules.

And best of all, no compilation!

## Usage

```javascript
var glob = require("glob")

// options is optional
glob("**/*.js", options, function (er, files) {
  // files is an array of filenames.
  // If the `nonull` option is set, and nothing
  // was found, then files is ["**/*.js"]
  // er is an error object or null.
})
```

## Features

Please see the [minimatch
documentation](https://github.com/isaacs/minimatch) for more details.

Supports these glob features:

* Brace Expansion
* Extended glob matching
* "Globstar" `**` matching

See:

* `man sh`
* `man bash`
* `man 3 fnmatch`
* `man 5 gitignore`
* [minimatch documentation](https://github.com/isaacs/minimatch)

## glob(pattern, [options], cb)

* `pattern` {String} Pattern to be matched
* `options` {Object}
* `cb` {Function}
  * `err` {Error | null}
  * `matches` {Array<String>} filenames found matching the pattern

Perform an asynchronous glob search.

## glob.sync(pattern, [options]

* `pattern` {String} Pattern to be matched
* `options` {Object}
* return: {Array<String>} filenames found matching the pattern

Perform a synchronous glob search.

## Class: glob.Glob

Create a Glob object by instanting the `glob.Glob` class.

```javascript
var Glob = require("glob").Glob
var mg = new Glob(pattern, options, cb)
```

It's an EventEmitter, and starts walking the filesystem to find matches
immediately.

### new glob.Glob(pattern, [options], [cb])

* `pattern` {String} pattern to search for
* `options` {Object}
* `cb` {Function} Called when an error occurs, or matches are found
  * `err` {Error | null}
  * `matches` {Array<String>} filenames found matching the pattern

Note that if the `sync` flag is set in the options, then matches will
be immediately available on the `g.found` member.

### Properties

* `minimatch` The minimatch object that the glob uses.
* `options` The options object passed in.
* `error` The error encountered.  When an error is encountered, the
  glob object is in an undefined state, and should be discarded.
* `aborted` Boolean which is set to true when calling `abort()`.  There
  is no way at this time to continue a glob search after aborting, but
  you can re-use the statCache to avoid having to duplicate syscalls.

### Events

* `end` When the matching is finished, this is emitted with all the
  matches found.  If the `nonull` option is set, and no match was found,
  then the `matches` list contains the original pattern.  The matches
  are sorted, unless the `nosort` flag is set.
* `match` Every time a match is found, this is emitted with the matched.
* `error` Emitted when an unexpected error is encountered, or whenever
  any fs error occurs if `options.strict` is set.
* `abort` When `abort()` is called, this event is raised.

### Methods

* `abort` Stop the search.

### Options

All the options that can be passed to Minimatch can also be passed to
Glob to change pattern matching behavior.  Also, some have been added,
or have glob-specific ramifications.

All options are false by default, unless otherwise noted.

All options are added to the glob object, as well.

* `cwd` The current working directory in which to search.  Defaults
  to `process.cwd()`.
* `root` The place where patterns starting with `/` will be mounted
  onto.  Defaults to `path.resolve(options.cwd, "/")` (`/` on Unix
  systems, and `C:\` or some such on Windows.)
* `nomount` By default, a pattern starting with a forward-slash will be
  "mounted" onto the root setting, so that a valid filesystem path is
  returned.  Set this flag to disable that behavior.
* `mark` Add a `/` character to directory matches.  Note that this
  requires additional stat calls.
* `nosort` Don't sort the results.
* `stat` Set to true to stat *all* results.  This reduces performance
  somewhat, and is completely unnecessary, unless `readdir` is presumed
  to be an untrustworthy indicator of file existence.  It will cause
  ELOOP to be triggered one level sooner in the case of cyclical
  symbolic links.
* `silent` When an unusual error is encountered
  when attempting to read a directory, a warning will be printed to
  stderr.  Set the `silent` option to true to suppress these warnings.
* `strict` When an unusual error is encountered
  when attempting to read a directory, the process will just continue on
  in search of other matches.  Set the `strict` option to raise an error
  in these cases.
* `statCache` A cache of results of filesystem information, to prevent
  unnecessary stat calls.  While it should not normally be necessary to
  set this, you may pass the statCache from one glob() call to the
  options object of another, if you know that the filesystem will not
  change between calls.  (See "Race Conditions" below.)
* `sync` Perform a synchronous glob search.
* `nounique` In some cases, brace-expanded patterns can result in the
  same file showing up multiple times in the result set.  By default,
  this implementation prevents duplicates in the result set.
  Set this flag to disable that behavior.
* `nonull` Set to never return an empty set, instead returning a set
  containing the pattern itself.  This is the default in glob(3).
* `nocase` Perform a case-insensitive match.  Note that case-insensitive
  filesystems will sometimes result in glob returning results that are
  case-insensitively matched anyway, since readdir and stat will not
  raise an error.
* `debug` Set to enable debug logging in minimatch and glob.
* `globDebug` Set to enable debug logging in glob, but not minimatch.

## Comparisons to other fnmatch/glob implementations

While strict compliance with the existing standards is a worthwhile
goal, some discrepancies exist between node-glob and other
implementations, and are intentional.

If the pattern starts with a `!` character, then it is negated.  Set the
`nonegate` flag to suppress this behavior, and treat leading `!`
characters normally.  This is perhaps relevant if you wish to start the
pattern with a negative extglob pattern like `!(a|B)`.  Multiple `!`
characters at the start of a pattern will negate the pattern multiple
times.

If a pattern starts with `#`, then it is treated as a comment, and
will not match anything.  Use `\#` to match a literal `#` at the
start of a line, or set the `nocomment` flag to suppress this behavior.

The double-star character `**` is supported by default, unless the
`noglobstar` flag is set.  This is supported in the manner of bsdglob
and bash 4.1, where `**` only has special significance if it is the only
thing in a path part.  That is, `a/**/b` will match `a/x/y/b`, but
`a/**b` will not.  **Note that this is different from the way that `**` is
handled by ruby's `Dir` class.**

If an escaped pattern has no matches, and the `nonull` flag is set,
then glob returns the pattern as-provided, rather than
interpreting the character escapes.  For example,
`glob.match([], "\\*a\\?")` will return `"\\*a\\?"` rather than
`"*a?"`.  This is akin to setting the `nullglob` option in bash, except
that it does not resolve escaped pattern characters.

If brace expansion is not disabled, then it is performed before any
other interpretation of the glob pattern.  Thus, a pattern like
`+(a|{b),c)}`, which would not be valid in bash or zsh, is expanded
**first** into the set of `+(a|b)` and `+(a|c)`, and those patterns are
checked for validity.  Since those two are valid, matching proceeds.

## Windows

**Please only use forward-slashes in glob expressions.**

Though windows uses either `/` or `\` as its path separator, only `/`
characters are used by this glob implementation.  You must use
forward-slashes **only** in glob expressions.  Back-slashes will always
be interpreted as escape characters, not path separators.

Results from absolute patterns such as `/foo/*` are mounted onto the
root setting using `path.join`.  On windows, this will by default result
in `/foo/*` matching `C:\foo\bar.txt`.

## Race Conditions

Glob searching, by its very nature, is susceptible to race conditions,
since it relies on directory walking and such.

As a result, it is possible that a file that exists when glob looks for
it may have been deleted or modified by the time it returns the result.

As part of its internal implementation, this program caches all stat
and readdir calls that it makes, in order to cut down on system
overhead.  However, this also makes it even more susceptible to races,
especially if the statCache object is reused between glob calls.

Users are thus advised not to use a glob result as a
guarantee of filesystem state in the face of rapid changes.
For the vast majority of operations, this is never a problem.
