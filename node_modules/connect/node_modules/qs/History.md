
0.4.2 / 2012-02-08 
==================

  * Fixed: ensure objects are created when appropriate not arrays [aheckmann]

0.4.1 / 2012-01-26 
==================

  * Fixed stringify()ing numbers. Closes #23

0.4.0 / 2011-11-21 
==================

  * Allow parsing of an existing object (for `bodyParser()`) [jackyz]
  * Replaced expresso with mocha

0.3.2 / 2011-11-08 
==================

  * Fixed global variable leak

0.3.1 / 2011-08-17 
==================

  * Added `try/catch` around malformed uri components
  * Add test coverage for Array native method bleed-though

0.3.0 / 2011-07-19 
==================

  * Allow `array[index]` and `object[property]` syntaxes [Aria Stewart]

0.2.0 / 2011-06-29 
==================

  * Added `qs.stringify()` [Cory Forsyth]

0.1.0 / 2011-04-13 
==================

  * Added jQuery-ish array support

0.0.7 / 2011-03-13 
==================

  * Fixed; handle empty string and `== null` in `qs.parse()` [dmit]
    allows for convenient `qs.parse(url.parse(str).query)`

0.0.6 / 2011-02-14 
==================

  * Fixed; support for implicit arrays

0.0.4 / 2011-02-09 
==================

  * Fixed `+` as a space

0.0.3 / 2011-02-08 
==================

  * Fixed case when right-hand value contains "]"

0.0.2 / 2011-02-07 
==================

  * Fixed "=" presence in key

0.0.1 / 2011-02-07 
==================

  * Initial release