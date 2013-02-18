# 1.3.3

2012-12-30

 - Fix critical bug with mixin call if using multiple brackets
 - when using the filter contrast function, the function is passed through if the first argument is not a color

# 1.3.2

2012-12-28

 - browser and server url re-writing is now aligned to not re-write (previous lessc behaviour)
 - url-rewriting can be made to re-write to be relative to the entry file using the relative-urls option (less.relativeUrls option)
 - rootpath option can be used to add a base path to every url
 - Support mixin argument seperator of ';' so you can pass comma seperated values. e.g. `.mixin(23px, 12px;);`
 - Fix lots of problems with named arguments in corner cases, not behaving as expected
 - hsv, hsva, unit functions
 - fixed lots more bad error messages
 - fix `@import-once` to use the full path, not the relative one for determining if an import has been imported already
 - support `:not(:nth-child(3))`
 - mixin guards take units into account
 - support unicode descriptors (`U+00A1-00A9`)
 - support calling mixins with a stack when using `&` (broken in 1.3.1)
 - support `@namespace` and namespace combinators
 - when using % with colour functions, take into account a colour is out of 256
 - when doing maths with a % do not divide by 100 and keep the unit
 - allow url to contain % (e.g. %20 for a space)
 - if a mixin guard stops execution a default mixin is not required
 - units are output in strings (use the unit function if you need to get the value without unit)
 - do not infinite recurse when mixins call mixins of the same name
 - fix issue on important on mixin calls
 - fix issue with multiple comments being confused
 - tolerate multiple semi-colons on rules
 - ignore subsequant `@charset`
 - syncImport option for node.js to read files syncronously
 - write the output directory if it is missing
 - change dependency on cssmin to ycssmin
 - lessc can load files over http
 - allow calling less.watch() in non dev mode
 - don't cache in dev mode
 - less files cope with query parameters better
 - sass debug statements are now chrome compatible
 - modifyVars function added to re-render with different root variables

# 1.3.1

2012-10-18

- Support for comment and @media debugging statements
- bug fix for async access in chrome extensions
- new functions tint, shade, multiply, screen, overlay, hardlight, difference, exclusion, average, negation, softlight, red, green, blue, contrast
- allow escaped characters in attributes
- in selectors support @{a} directly, e.g. .a.@{a} { color: black; }
- add fraction parameter to round function
- much better support for & selector
- preserve order of link statements client side
- lessc has better help
- rhino version fixed
- fix bugs in clientside error handling
- support dpi, vmin, vm, dppx, dpcm units
- Fix ratios in media statements
- in mixin guards allow comparing colors and strings
- support for -*-keyframes (for -khtml but now supports any)
- in mix function, default weight to 50%
- support @import-once
- remove duplicate rules in output
- implement named parameters when calling mixins
- many numerous bug fixes

# 1.3.0

2012-03-10

- @media bubbling
- Support arbitrary entities as selectors
- [Variadic argument support](https://gist.github.com/1933613)
- Behaviour of zero-arity mixins has [changed](https://gist.github.com/1933613)
- Allow `@import` directives in any selector
- Media-query features can now be a variable
- Automatic merging of media-query conditions
- Fix global variable leaks
- Fix error message on wrong-arity call
- Fix an `@arguments` behaviour bug
- Fix `::` selector output
- Fix a bug when using @media with mixins


# 1.2.1

2012-01-15

- Fix imports in browser
- Improve error reporting in browser
- Fix Runtime error reports from imported files
- Fix `File not found` import error reporting


# 1.2.0

2012-01-07

- Mixin guards
- New function `percentage`
- New `color` function to parse hex color strings
- New type-checking stylesheet functions
- Fix Rhino support
- Fix bug in string arguments to mixin call
- Fix error reporting when index is 0
- Fix browser support in WebKit and IE
- Fix string interpolation bug when var is empty
- Support `!important` after mixin calls
- Support vanilla @keyframes directive
- Support variables in certain css selectors, like `nth-child`
- Support @media and @import features properly
- Improve @import support with media features
- Improve error reports from imported files
- Improve function call error reporting
- Improve error-reporting
