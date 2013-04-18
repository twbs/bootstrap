
0.7.2 / 2013-02-06 
==================

  * fix package.json
  * fix: Mobile Safari (private mode) is broken with debug
  * fix: Use unicode to send escape character to shell instead of octal to work with strict mode javascript

0.7.1 / 2013-02-05 
==================

  * add repository URL to package.json
  * add DEBUG_COLORED to force colored output
  * add browserify support
  * fix component. Closes #24

0.7.0 / 2012-05-04 
==================

  * Added .component to package.json
  * Added debug.component.js build

0.6.0 / 2012-03-16 
==================

  * Added support for "-" prefix in DEBUG [Vinay Pulim]
  * Added `.enabled` flag to the node version [TooTallNate] 

0.5.0 / 2012-02-02 
==================

  * Added: humanize diffs. Closes #8
  * Added `debug.disable()` to the CS variant
  * Removed padding. Closes #10
  * Fixed: persist client-side variant again. Closes #9

0.4.0 / 2012-02-01 
==================

  * Added browser variant support for older browsers [TooTallNate]
  * Added `debug.enable('project:*')` to browser variant [TooTallNate]
  * Added padding to diff (moved it to the right)

0.3.0 / 2012-01-26 
==================

  * Added millisecond diff when isatty, otherwise UTC string

0.2.0 / 2012-01-22 
==================

  * Added wildcard support

0.1.0 / 2011-12-02 
==================

  * Added: remove colors unless stderr isatty [TooTallNate]

0.0.1 / 2010-01-03
==================

  * Initial release
