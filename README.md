# [Foundation](http://foundation.zurb.com)

[![Build Status](https://travis-ci.org/zurb/foundation.svg)](https://travis-ci.org/zurb/foundation)


Foundation is the most advanced responsive front-end framework in the world. You can quickly prototype and build sites or apps that work on any kind of device with Foundation, which includes layout constructs (like a fully responsive grid), elements and best practices.

To get started, check out <http://foundation.zurb.com/docs>


## Quickstart

To get going with Foundation you can:

  * [Download the latest release](http://foundation.zurb.com/develop/download.html)
  * [Install with Bower](http://bower.io): `bower install zurb/bower-foundation`

## Documentation

Foundation uses [Assemble.io](http://assemble.io) and [Grunt](http://gruntjs.com/) to generate its [documentation pages](http://foundation.zurb.com/docs). Documentation can also be run from your local computer:

### View documentation locally

You'll want to clone the Foundation repo first and install all the dependencies. You can do this using the following commands:

```
git clone git@github.com:zurb/foundation.git
cd foundation
npm install -g grunt-cli bower
npm install
bower install
```

Then just run `grunt build` and the documentation will be compiled:

```
foundation/
├── dist/
│   └── ...
├────── docs/
│       └── ...
```

Copyright (c) 2015 ZURB, inc.
