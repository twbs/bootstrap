nodeunit(1) -- simple node.js unit testing tool
===============================================

## SYNOPSIS

    nodeunit [options] <file-or-directory> [<file-or-directory> ...]

## DESCRIPTION

Nodeunit is a simple unit testing tool based on the node.js assert module.

* Simple to use
* Just export the tests from a module
* Helps you avoid common pitfalls when testing asynchronous code
* Easy to add test cases with setUp and tearDown functions if you wish
* Allows the use of mocks and stubs

## OPTIONS

  __--config FILE__:  
      Load config options from a JSON file, allows the customisation
      of color schemes for the default test reporter etc.
      See bin/nodeunit.json for current available options.

  __--reporter FILE__:  
      You can set the test reporter to a custom module or on of the modules
      in nodeunit/lib/reporters, when omitted, the default test runner is used.

  __--list-reporters__:  
      List available build-in reporters.

  __-h__, __--help__:  
      Display the help and exit.

  __-v__, __--version__:  
      Output version information and exit.

  __<file-or-directory>__:
      You can run nodeunit on specific files or on all *\*.js* files inside  
      a directory.

## AUTHORS

Written by Caolan McMahon and other nodeunit contributors.  
Contributors list: <http://github.com/caolan/nodeunit/contributors>.

## REPORTING BUGS

Report nodeunit bugs to <http://github.com/caolan/nodeunit/issues>.

## COPYRIGHT

Copyright © 2010 Caolan McMahon.  
Nodeunit has been released under the MIT license:  
<http://github.com/caolan/nodeunit/raw/master/LICENSE>.

## SEE ALSO

node(1)

