# TOBI Bootstrap
[TOBI BootStrap Docs](http://gittobi.github.io/bootstrap)

## Introduction

Bootstrap is a sleek, intuitive, and powerful front-end framework for faster and easier web development.  For Original Twitter Bootstrap, go to [http://getbootstrap.com](http://getbootstrap.com).

At TOBI, we use a fairly customized version of Bootstrap.  We import CSS, Markup and JS for many features of tobi.com.  

### Philosophy
The basic philosophy is to restyle CSS/Components of Bootstrap to meet our design specifications and follow the bootstrap coding conventions where possible.  

Sounds reasonable, right?

*(it sort of is... but please read on, be careful and document what you can)*

### One-Off Styles
For one-off styles, we keep those local in trunk and usually in SCSS files named for the site area or function  (See [trunk](https://github.com/gittobi/trunk)).  


### Custom Styles
For custom but commonly re-used styles, we sometimes will add specialized classes or modify the functionality of Bootstrap's built in classes to more fully meet our needs.  This is a bit tricky though... so try to modify the actually less files minimally and any values that you tweak, try to create corresponding variables in variables.less so we can better track the change.  

### Comment, Comment, Comment!
For anything custom - please leave a comment starting with something like this: 

    // TOBI - Custom Description Here!


## Documentation

Tobi-Bootstrap documentation: [http://gittobi.github.io/bootstrap](http://gittobi.github.io/bootstrap)!

Twitter Bootstrap documentation: [http://getbootstrap.com](http://getbootstrap.com)!


### What's included

Within the download you'll find the following directories and files, logically grouping common assets and providing both compiled and minified variations. 

In this repo... after using Grunt to parse and build bootstrap, you will see something like this:

```
#### Distribution Files (after compilation)

dist/
├── css/
│   ├── bootstrap-tobi-master.css   <----- This is the TOBI Bootstrap Production Stylesheet (used in trunk)
│   ├── bootstrap-tobi.css          <----- This is the TOBI Bootstrap Docs Stylesheet
│   ├── bootstrap-tobi.min.css
│   ├── bootstrap-tobi-theme.css
│   └── bootstrap-tobi-theme.min.css
└── js/
    ├── bootstrap.js                <----- Right now we use the full bootstrap.js in Production
    └── bootstrap.min.js

#### Font files (static)

fonts/
    ├── glyphicons-halflings-regular.eot
    ├── glyphicons-halflings-regular.svg
    ├── glyphicons-halflings-regular.ttf
    ├── glyphicons-halflings-regular.woff
    |
    └── ProximaNova ...             <----- Proxima Nova is the TOBI.com font.  It's already in trunk.         

#### JS Files (no tweaks here yet)

js/

#### Less Files (this is where most of the tweaking happens)
less/
    |-bootstrap.less                <----- This is used to build bootstrap for the docs
    └-bootstrap-master.less         <----- This is used to build TOBI bootstrap for production
```

For TOBI, we produce a specialized version of the boostrap.css which is named above.  The controlling .less file is bootstrap-master.less, which pulls in a subset of the styles available for TOBI.com.


We provide compiled CSS and JS (`bootstrap.*`), as well as compiled and minified CSS and JS (`bootstrap.min.*`). Fonts from Glyphicons are included, as is the optional Bootstrap theme.


## Dev Work-Flow

TOBI Bootstrap's documentation, included in this repo in the root directory, is built with [Jekyll](http://jekyllrb.com) and publicly hosted on GitHub Pages at [http://gittobi.github.io/bootstrap](http://gittobi.github.io/bootstrap). The docs may also be run locally.

### Trunk Work-Flow Example: Tweaking TOBI's tore

1. Open Bootstrap Repo in your editor and Start Jekyll Docs Server
2. Open Trunk Repo in your editor and Start Store 
3. Tweak Styles in Bootstrap, and then:
  * Run `grunt tobi` command to build and copy new css to trunk
  * restart `jekyll serve` to see results in Boostrap Docs
  * reload store page to see changes on local tobi.com staging in your browser
4. When you're finally done... make sure you document everything.
5. Then run `grunt` to build and test everything.  Rinse and repeat until clean.
6. Then commit all changes to gh-pages and to master.  gh-pages is used for online docs.
7. Then make a pull-request for your trunk changes too, including new bootstrap tweaks.

### Add a new class or feature?  Please document it!
If you ever add a new class to Bootstrap, please make sure you add it to the documentation.  And, if you customized something for TOBI.com that has never been touched before, please add a heart next to it's nav element to indicate what has been touched.  (See _includes for examples)

The basics for editing the docs is that everything in the base directory that's not an excluded directory, is compiled by jekyll at server startup into the _gh_pages directory.  So, if you tweak something, you have to restart jekyll to see your changes.  That just means CTRL-C and then `jekyll serve`.

The two things you'll edit the most are:

- css.html
- components.html

### Running documentation locally

1. If necessary, [install Jekyll](http://jekyllrb.com/docs/installation) (requires v1.x).
2. From the root `/bootstrap` directory, run `jekyll serve` in the command line.

        $ jekyll serve

3. Open [http://localhost:9001](http://localhost:9001) in your browser, and voilà.

Learn more about using Jekyll by reading its [documentation](http://jekyllrb.com/docs/home/).


## Grunt - Compiling CSS and JavaScript

Bootstrap uses [Grunt](http://gruntjs.com/) with convenient methods for working with the framework. It's how we compile our code, run tests, and more. To use it, install the required dependencies as directed and then run some Grunt commands.

That said, you can still use `lessc` to compile bootstrap manually and the copy/paste it over to trunk.  Just make sure you use the bootstrap-master.less file.

From the command line:

1. Install `grunt-cli` globally with `npm install -g grunt-cli`.
2. Navigate to the root `/bootstrap` directory, then run `npm install`. npm will look at [package.json](package.json) and automatically install the necessary local dependencies listed there.

When completed, you'll be able to run the various Grunt commands provided from the command line.

**Unfamiliar with `npm`? Don't have node installed?** That's a-okay. npm stands for [node packaged modules](http://npmjs.org/) and is a way to manage development dependencies through node.js. [Download and install node.js](http://nodejs.org/download/) before proceeding.

## Grunt Commands

### Build TOBI Bootstrap Master & Copy to Trunk - `grunt tobi`

        $ grunt tobi

This is a special command that helps with our development locally.  It essentially does what `grunt dist` does, which is rebuild the css files, but it also copies the main css file built for production, *bootstrap-tobi-master.css*, into your local trunk.  

        $ cp bootstrap-tobi-master.css ~/code/trunk/app/assets/plugins/bootstrap-3.0.0-tobi.css 

This enables developers to make a tweak in their local bootstrap repo, run the dist-tobi grunt command and reload their local store to see the changes immediately available.  It saves lots of time.  
  
    
### Build - `grunt`

        $ grunt

Run `grunt` to run tests locally and compile the CSS and JavaScript into `/dist`. **Uses [recess](http://twitter.github.io/recess/) and [UglifyJS](http://lisperator.net/uglifyjs/).**


### Only compile CSS and JavaScript - `grunt dist`

        $ grunt dist

`grunt dist` creates the `/dist` directory with compiled files. **Uses [recess](http://twitter.github.io/recess/) and [UglifyJS](http://lisperator.net/uglifyjs/).**


### Tests - `grunt test`

        $ grunt test

Runs [JSHint](http://jshint.com) and [QUnit](http://qunitjs.com/) tests headlessly in [PhantomJS](http://phantomjs.org/) (used for CI).


### Watch - `grunt watch`

        $ grunt watch

This is a convenience method for watching just Less files and automatically building them whenever you save.


## Troubleshooting Grunt Dependencies

Should you encounter problems with installing dependencies or running Grunt commands, uninstall all previous dependency versions (global and local). Then, rerun `npm install`.



## Copyright and license

Copyright 2013 Twitter, Inc under [the Apache 2.0 license](LICENSE).