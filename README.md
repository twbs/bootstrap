# [Bootstrap][1]

[![Slack][image-1]][2]
![Bower version][image-2]
[![npm version][image-3]][3]
[![Build Status][image-4]][4]
[![devDependency Status][image-5]][5]
[![NuGet][image-6]][6]
[![Selenium Test Status][image-7]][7]

Bootstrap is a sleek, intuitive, and powerful front-end framework for faster and easier web development, created by [Mark Otto][8] and [Jacob Thornton][9], and maintained by the [core team][10] with the massive support and involvement of the community.

To get started, check out [http://getbootstrap.com][11]!


## Table of contents

* [Quick start][12]
* [Bugs and feature requests][13]
* [Documentation][14]
* [Contributing][15]
* [Community][16]
* [Versioning][17]
* [Creators][18]
* [Copyright and license][19]


## Quick start

Several quick start options are available:

* [Download the latest release][20].
* Clone the repo: `git clone https://github.com/twbs/bootstrap.git`.
* Install with [Bower][21]: `bower install bootstrap`.
* Install with [npm][22]: `npm install bootstrap@3`.
* Install with [Meteor][23]: `meteor add twbs:bootstrap`.
* Install with [Composer][24]: `composer require twbs/bootstrap`.

Read the [Getting started page][25] for information on the framework contents, templates and examples, and more.

### What's included

Within the download you'll find the following directories and files, logically grouping common assets and providing both compiled and minified variations. You'll see something like this:

\`\`\`
bootstrap/
├── css/
│   ├── bootstrap.css
│   ├── bootstrap.css.map
│   ├── bootstrap.min.css
│   ├── bootstrap.min.css.map
│   ├── bootstrap-theme.css
│   ├── bootstrap-theme.css.map
│   ├── bootstrap-theme.min.css
│   └── bootstrap-theme.min.css.map
├── js/
│   ├── bootstrap.js
│   └── bootstrap.min.js
└── fonts/
	├── glyphicons-halflings-regular.eot
	├── glyphicons-halflings-regular.svg
	├── glyphicons-halflings-regular.ttf
	├── glyphicons-halflings-regular.woff
	└── glyphicons-halflings-regular.woff2
\`\`\`

We provide compiled CSS and JS (`bootstrap.*`), as well as compiled and minified CSS and JS (`bootstrap.min.*`). CSS [source maps][26] (`bootstrap.*.map`) are available for use with certain browsers' developer tools. Fonts from Glyphicons are included, as is the optional Bootstrap theme.


## Bugs and feature requests

Have a bug or a feature request? Please first read the [issue guidelines][27] and search for existing and closed issues. If your problem or idea is not addressed yet, [please open a new issue][28].

Note that **feature requests must target [Bootstrap v4][29],** because Bootstrap v3 is now in maintenance mode and is closed off to new features. This is so that we can focus our efforts on Bootstrap v4.


## Documentation

Bootstrap's documentation, included in this repo in the root directory, is built with [Jekyll][30] and publicly hosted on GitHub Pages at [http://getbootstrap.com][31]. The docs may also be run locally.

### Running documentation locally

1. If necessary, [install Jekyll][32] and other Ruby dependencies with `bundle install`.
   **Note for Windows users:** Read [this unofficial guide][33] to get Jekyll up and running without problems.
2. From the root `/bootstrap` directory, run `bundle exec jekyll serve` in the command line.
4. Open `http://localhost:9001` in your browser, and voilà.

Learn more about using Jekyll by reading its [documentation][34].

### Documentation for previous releases

Documentation for v2.3.2 has been made available for the time being at [http://getbootstrap.com/2.3.2/][35] while folks transition to Bootstrap 3.

[Previous releases][36] and their documentation are also available for download.


## Contributing

Please read through our [contributing guidelines][37]. Included are directions for opening issues, coding standards, and notes on development.

Moreover, if your pull request contains JavaScript patches or features, you must include [relevant unit tests][38]. All HTML and CSS should conform to the [Code Guide][39], maintained by [Mark Otto][40].

**Bootstrap v3 is now closed off to new features.** It has gone into maintenance mode so that we can focus our efforts on [Bootstrap v4][41], the future of the framework. Pull requests which add new features (rather than fix bugs) should target [Bootstrap v4 (the `v4-dev` git branch)][42] instead.

Editor preferences are available in the [editor config][43] for easy use in common text editors. Read more and download plugins at [http://editorconfig.org][44].


## Community

Get updates on Bootstrap's development and chat with the project maintainers and community members.

* Follow [@getbootstrap on Twitter][45].
* Read and subscribe to [The Official Bootstrap Blog][46].
* Join [the official Slack room][47].
* Chat with fellow Bootstrappers in IRC. On the `irc.freenode.net` server, in the `##bootstrap` channel.
* Implementation help may be found at Stack Overflow (tagged [`twitter-bootstrap-3`][48]).
* Developers should use the keyword `bootstrap` on packages which modify or add to the functionality of Bootstrap when distributing through [npm][49] or similar delivery mechanisms for maximum discoverability.


## Versioning

For transparency into our release cycle and in striving to maintain backward compatibility, Bootstrap is maintained under [the Semantic Versioning guidelines][50]. Sometimes we screw up, but we'll adhere to those rules whenever possible.

See [the Releases section of our GitHub project][51] for changelogs for each release version of Bootstrap. Release announcement posts on [the official Bootstrap blog][52] contain summaries of the most noteworthy changes made in each release.


## Creators

**Mark Otto**

* [https://twitter.com/mdo][53]
* [https://github.com/mdo][54]

**Jacob Thornton**

* [https://twitter.com/fat][55]
* [https://github.com/fat][56]


## Copyright and license

Code and documentation copyright 2011-2016 Twitter, Inc. Code released under [the MIT license][57]. Docs released under [Creative Commons][58].

DD [\<dt\>][59]

[1]:	http://getbootstrap.com
[2]:	https://bootstrap-slack.herokuapp.com
[3]:	https://www.npmjs.com/package/bootstrap
[4]:	https://travis-ci.org/twbs/bootstrap
[5]:	https://david-dm.org/twbs/bootstrap#info=devDependencies
[6]:	https://www.nuget.org/packages/Bootstrap
[7]:	https://saucelabs.com/u/bootstrap
[8]:	https://twitter.com/mdo
[9]:	https://twitter.com/fat
[10]:	https://github.com/orgs/twbs/people
[11]:	http://getbootstrap.com
[12]:	#quick-start
[13]:	#bugs-and-feature-requests
[14]:	#documentation
[15]:	#contributing
[16]:	#community
[17]:	#versioning
[18]:	#creators
[19]:	#copyright-and-license
[20]:	https://github.com/twbs/bootstrap/archive/v3.3.7.zip
[21]:	http://bower.io
[22]:	https://www.npmjs.com
[23]:	https://www.meteor.com
[24]:	https://getcomposer.org
[25]:	http://getbootstrap.com/getting-started/
[26]:	https://developer.chrome.com/devtools/docs/css-preprocessors
[27]:	https://github.com/twbs/bootstrap/blob/master/CONTRIBUTING.md#using-the-issue-tracker
[28]:	https://github.com/twbs/bootstrap/issues/new
[29]:	https://github.com/twbs/bootstrap/tree/v4-dev
[30]:	http://jekyllrb.com
[31]:	http://getbootstrap.com
[32]:	http://jekyllrb.com/docs/installation
[33]:	http://jekyll-windows.juthilo.com/
[34]:	http://jekyllrb.com/docs/home/
[35]:	http://getbootstrap.com/2.3.2/
[36]:	https://github.com/twbs/bootstrap/releases
[37]:	https://github.com/twbs/bootstrap/blob/master/CONTRIBUTING.md
[38]:	https://github.com/twbs/bootstrap/tree/master/js/tests
[39]:	https://github.com/mdo/code-guide
[40]:	https://github.com/mdo
[41]:	https://github.com/twbs/bootstrap/tree/v4-dev
[42]:	https://github.com/twbs/bootstrap/tree/v4-dev
[43]:	https://github.com/twbs/bootstrap/blob/master/.editorconfig
[44]:	http://editorconfig.org
[45]:	https://twitter.com/getbootstrap
[46]:	http://blog.getbootstrap.com
[47]:	https://bootstrap-slack.herokuapp.com
[48]:	https://stackoverflow.com/questions/tagged/twitter-bootstrap-3
[49]:	https://www.npmjs.com/browse/keyword/bootstrap
[50]:	http://semver.org/
[51]:	https://github.com/twbs/bootstrap/releases
[52]:	http://blog.getbootstrap.com
[53]:	https://twitter.com/mdo
[54]:	https://github.com/mdo
[55]:	https://twitter.com/fat
[56]:	https://github.com/fat
[57]:	https://github.com/twbs/bootstrap/blob/master/LICENSE
[58]:	https://github.com/twbs/bootstrap/blob/master/docs/LICENSE
[59]:	www.github.com "Github"

[image-1]:	https://bootstrap-slack.herokuapp.com/badge.svg
[image-2]:	https://img.shields.io/bower/v/bootstrap.svg
[image-3]:	https://img.shields.io/npm/v/bootstrap.svg
[image-4]:	https://img.shields.io/travis/twbs/bootstrap/master.svg
[image-5]:	https://img.shields.io/david/dev/twbs/bootstrap.svg
[image-6]:	https://img.shields.io/nuget/v/bootstrap.svg
[image-7]:	https://saucelabs.com/browser-matrix/bootstrap.svg