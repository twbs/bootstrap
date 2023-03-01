<p align="center">
  <a href="https://getbootstrap.com/" target="_blank">
    <img src="https://getbootstrap.com/docs/5.3/assets/brand/bootstrap-logo-shadow.png" alt="Bootstrap logo" width="200" height="165">
  </a>
</p>

<h3 align="center">Bootstrap</h3>

<p align="center">
  Sleek, intuitive, and powerful front-end framework for faster and easier web development.
  <br>
  <a href="https://getbootstrap.com/docs/5.3/" target="_blank"><strong>Explore Bootstrap docs »</strong></a>
  <br>
  <br>
  <a href="https://github.com/twbs/bootstrap/issues/new?assignees=-&labels=bug&template=bug_report.yml" target="_blank">Report bug</a>
  ·
  <a href="https://github.com/twbs/bootstrap/issues/new?assignees=&labels=feature&template=feature_request.yml" target="_blank">Request feature</a>
  ·
  <a href="https://themes.getbootstrap.com/" target="_blank">Themes</a>
  ·
  <a href="https://blog.getbootstrap.com/" target="_blank">Blog</a>
</p>

## Bootstrap 5

Our default branch is for development of our Bootstrap 5 release. Head to the [`v4-dev` branch](https://github.com/twbs/bootstrap/tree/v4-dev){:target="\_blank"} to view the readme, documentation, and source code for Bootstrap 4.

## Table of contents

- [Quick start](#quick-start)
- [Status](#status)
- [What's included](#whats-included)
- [Bugs and feature requests](#bugs-and-feature-requests)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Community](#community)
- [Versioning](#versioning)
- [Creators](#creators)
- [Thanks](#thanks)
- [Copyright and license](#copyright-and-license)

## Quick start

Several quick start options are available:

- [Download the latest release](https://github.com/twbs/bootstrap/archive/v5.3.0-alpha1.zip)
- Clone the repo: `git clone https://github.com/twbs/bootstrap.git`
- Install with [npm](https://www.npmjs.com/){:target="\_blank"}: `npm install bootstrap@v5.3.0-alpha1`
- Install with [yarn](https://yarnpkg.com/){:target="\_blank"}: `yarn add bootstrap@v5.3.0-alpha1`
- Install with [Composer](https://getcomposer.org/){:target="\_blank"}: `composer require twbs/bootstrap:5.3.0-alpha1`
- Install with [NuGet](https://www.nuget.org/){:target="\_blank"}: CSS: `Install-Package bootstrap` Sass: `Install-Package bootstrap.sass`

Read the [Getting started page](https://getbootstrap.com/docs/5.3/getting-started/introduction/){:target="\_blank"} for information on the framework contents, templates, examples, and more.

## Status

[![Build Status](https://img.shields.io/github/actions/workflow/status/twbs/bootstrap/js.yml?branch=main&label=JS%20Tests&logo=github)](https://github.com/twbs/bootstrap/actions?query=workflow%3AJS+Tests+branch%3Amain){:target="\_blank"}
[![npm version](https://img.shields.io/npm/v/bootstrap?logo=npm&logoColor=fff)](https://www.npmjs.com/package/bootstrap){:target="\_blank"}
[![Gem version](https://img.shields.io/gem/v/bootstrap?logo=rubygems&logoColor=fff)](https://rubygems.org/gems/bootstrap){:target="\_blank"}
[![Meteor Atmosphere](https://img.shields.io/badge/meteor-twbs%3Abootstrap-blue?logo=meteor&logoColor=fff)](https://atmospherejs.com/twbs/bootstrap){:target="\_blank"}
[![Packagist Prerelease](https://img.shields.io/packagist/vpre/twbs/bootstrap?logo=packagist&logoColor=fff)](https://packagist.org/packages/twbs/bootstrap){:target="\_blank"}
[![NuGet](https://img.shields.io/nuget/vpre/bootstrap?logo=nuget&logoColor=fff)](https://www.nuget.org/packages/bootstrap/absoluteLatest){:target="\_blank"}
[![Coverage Status](https://img.shields.io/coveralls/github/twbs/bootstrap/main?logo=coveralls&logoColor=fff)](https://coveralls.io/github/twbs/bootstrap?branch=main){:target="\_blank"}
[![CSS gzip size](https://img.badgesize.io/twbs/bootstrap/main/dist/css/bootstrap.min.css?compression=gzip&label=CSS%20gzip%20size)](https://github.com/twbs/bootstrap/blob/main/dist/css/bootstrap.min.css){:target="\_blank"}
[![CSS Brotli size](https://img.badgesize.io/twbs/bootstrap/main/dist/css/bootstrap.min.css?compression=brotli&label=CSS%20Brotli%20size)](https://github.com/twbs/bootstrap/blob/main/dist/css/bootstrap.min.css){:target="\_blank"}
[![JS gzip size](https://img.badgesize.io/twbs/bootstrap/main/dist/js/bootstrap.min.js?compression=gzip&label=JS%20gzip%20size)](https://github.com/twbs/bootstrap/blob/main/dist/js/bootstrap.min.js){:target="\_blank"}
[![JS Brotli size](https://img.badgesize.io/twbs/bootstrap/main/dist/js/bootstrap.min.js?compression=brotli&label=JS%20Brotli%20size)](https://github.com/twbs/bootstrap/blob/main/dist/js/bootstrap.min.js){:target="\_blank"}
[![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=SkxZcStBeExEdVJqQ2hWYnlWckpkNmNEY213SFp6WHFETWk2bGFuY3pCbz0tLXhqbHJsVlZhQnRBdEpod3NLSDMzaHc9PQ==--3d0b75245708616eb93113221beece33e680b229)](https://www.browserstack.com/automate/public-build/SkxZcStBeExEdVJqQ2hWYnlWckpkNmNEY213SFp6WHFETWk2bGFuY3pCbz0tLXhqbHJsVlZhQnRBdEpod3NLSDMzaHc9PQ==--3d0b75245708616eb93113221beece33e680b229){:target="\_blank"}
[![Backers on Open Collective](https://img.shields.io/opencollective/backers/bootstrap?logo=opencollective&logoColor=fff)](#backers){:target="\_blank"}
[![Sponsors on Open Collective](https://img.shields.io/opencollective/sponsors/bootstrap?logo=opencollective&logoColor=fff)](#sponsors){:target="\_blank"}

## What's included

Within the download you'll find the following directories and files, logically grouping common assets and providing both compiled and minified variations.

<details>
  <summary>Download contents</summary>

```text
bootstrap/
├── css/
│   ├── bootstrap-grid.css
│   ├── bootstrap-grid.css.map
│   ├── bootstrap-grid.min.css
│   ├── bootstrap-grid.min.css.map
│   ├── bootstrap-grid.rtl.css
│   ├── bootstrap-grid.rtl.css.map
│   ├── bootstrap-grid.rtl.min.css
│   ├── bootstrap-grid.rtl.min.css.map
│   ├── bootstrap-reboot.css
│   ├── bootstrap-reboot.css.map
│   ├── bootstrap-reboot.min.css
│   ├── bootstrap-reboot.min.css.map
│   ├── bootstrap-reboot.rtl.css
│   ├── bootstrap-reboot.rtl.css.map
│   ├── bootstrap-reboot.rtl.min.css
│   ├── bootstrap-reboot.rtl.min.css.map
│   ├── bootstrap-utilities.css
│   ├── bootstrap-utilities.css.map
│   ├── bootstrap-utilities.min.css
│   ├── bootstrap-utilities.min.css.map
│   ├── bootstrap-utilities.rtl.css
│   ├── bootstrap-utilities.rtl.css.map
│   ├── bootstrap-utilities.rtl.min.css
│   ├── bootstrap-utilities.rtl.min.css.map
│   ├── bootstrap.css
│   ├── bootstrap.css.map
│   ├── bootstrap.min.css
│   ├── bootstrap.min.css.map
│   ├── bootstrap.rtl.css
│   ├── bootstrap.rtl.css.map
│   ├── bootstrap.rtl.min.css
│   └── bootstrap.rtl.min.css.map
└── js/
    ├── bootstrap.bundle.js
    ├── bootstrap.bundle.js.map
    ├── bootstrap.bundle.min.js
    ├── bootstrap.bundle.min.js.map
    ├── bootstrap.esm.js
    ├── bootstrap.esm.js.map
    ├── bootstrap.esm.min.js
    ├── bootstrap.esm.min.js.map
    ├── bootstrap.js
    ├── bootstrap.js.map
    ├── bootstrap.min.js
    └── bootstrap.min.js.map
```

</details>

We provide compiled CSS and JS (`bootstrap.*`), as well as compiled and minified CSS and JS (`bootstrap.min.*`). [Source maps](https://developers.google.com/web/tools/chrome-devtools/javascript/source-maps){:target="\_blank"} (`bootstrap.*.map`) are available for use with certain browsers' developer tools. Bundled JS files (`bootstrap.bundle.js` and minified `bootstrap.bundle.min.js`) include [Popper](https://popper.js.org/){:target="\_blank"}.

## Bugs and feature requests

Have a bug or a feature request? Please first read the [issue guidelines](https://github.com/twbs/bootstrap/blob/main/.github/CONTRIBUTING.md#using-the-issue-tracker){:target="\_blank"} and search for existing and closed issues. If your problem or idea is not addressed yet, [please open a new issue](https://github.com/twbs/bootstrap/issues/new/choose){:target="\_blank"}.

## Documentation

Bootstrap's documentation, included in this repo in the root directory, is built with [Hugo](https://gohugo.io/){:target="\_blank"} and publicly hosted on GitHub Pages at <https://getbootstrap.com/>. The docs may also be run locally.

Documentation search is powered by [Algolia's DocSearch](https://docsearch.algolia.com/){:target="\_blank"}.

### Running documentation locally

1. Run `npm install` to install the Node.js dependencies, including Hugo (the site builder).
2. Run `npm run test` (or a specific npm script) to rebuild distributed CSS and JavaScript files, as well as our docs assets.
3. From the root `/bootstrap` directory, run `npm run docs-serve` in the command line.
4. Open `http://localhost:9001/` in your browser, and voilà.

Learn more about using Hugo by reading its [documentation](https://gohugo.io/documentation/){:target="\_blank"}.

### Documentation for previous releases

You can find all our previous releases docs on <https://getbootstrap.com/docs/versions/>.

[Previous releases](https://github.com/twbs/bootstrap/releases){:target="\_blank"} and their documentation are also available for download.

## Contributing

Please read through our [contributing guidelines](https://github.com/twbs/bootstrap/blob/main/.github/CONTRIBUTING.md){:target="\_blank"}. Included are directions for opening issues, coding standards, and notes on development.

Moreover, if your pull request contains JavaScript patches or features, you must include [relevant unit tests](https://github.com/twbs/bootstrap/tree/main/js/tests){:target="\_blank"}. All HTML and CSS should conform to the [Code Guide](https://github.com/mdo/code-guide){:target="\_blank"}, maintained by [Mark Otto](https://github.com/mdo){:target="\_blank"}.

Editor preferences are available in the [editor config](https://github.com/twbs/bootstrap/blob/main/.editorconfig){:target="\_blank"} for easy use in common text editors. Read more and download plugins at <https://editorconfig.org/>.

## Community

Get updates on Bootstrap's development and chat with the project maintainers and community members.

- Follow [@getbootstrap on Twitter](https://twitter.com/getbootstrap){:target="\_blank"}.
- Read and subscribe to [The Official Bootstrap Blog](https://blog.getbootstrap.com/){:target="\_blank"}.
- Ask and explore [our GitHub Discussions](https://github.com/twbs/bootstrap/discussions){:target="\_blank"}.
- Chat with fellow Bootstrappers in IRC. On the `irc.libera.chat` server, in the `#bootstrap` channel.
- Implementation help may be found at Stack Overflow (tagged [`bootstrap-5`](https://stackoverflow.com/questions/tagged/bootstrap-5){:target="\_blank"}).
- Developers should use the keyword `bootstrap` on packages which modify or add to the functionality of Bootstrap when distributing through [npm](https://www.npmjs.com/browse/keyword/bootstrap){:target="\_blank"} or similar delivery mechanisms for maximum discoverability.

## Versioning

For transparency into our release cycle and in striving to maintain backward compatibility, Bootstrap is maintained under [the Semantic Versioning guidelines](https://semver.org/){:target="\_blank"}. Sometimes we screw up, but we adhere to those rules whenever possible.

See [the Releases section of our GitHub project](https://github.com/twbs/bootstrap/releases){:target="\_blank"} for changelogs for each release version of Bootstrap. Release announcement posts on [the official Bootstrap blog](https://blog.getbootstrap.com/){:target="\_blank"} contain summaries of the most noteworthy changes made in each release.

## Creators

**Mark Otto**

- <https://twitter.com/mdo>
- <https://github.com/mdo>

**Jacob Thornton**

- <https://twitter.com/fat>
- <https://github.com/fat>

## Thanks

<a href="https://www.browserstack.com/" target="_blank">
  <img src="https://live.browserstack.com/images/opensource/browserstack-logo.svg" alt="BrowserStack" width="192" height="42">
</a>

Thanks to [BrowserStack](https://www.browserstack.com/){:target="\_blank"} for providing the infrastructure that allows us to test in real browsers!

<a href="https://www.netlify.com/" target="_blank">
  <img src="https://www.netlify.com/v3/img/components/full-logo-light.svg" alt="Netlify" width="147" height="40">
</a>

Thanks to [Netlify](https://www.netlify.com/){:target="\_blank"} for providing us with Deploy Previews!

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/bootstrap#sponsor){:target="\_blank"}]

[![OC sponsor 0](https://opencollective.com/bootstrap/sponsor/0/avatar.svg)](https://opencollective.com/bootstrap/sponsor/0/website){:target="\_blank"}
[![OC sponsor 1](https://opencollective.com/bootstrap/sponsor/1/avatar.svg)](https://opencollective.com/bootstrap/sponsor/1/website){:target="\_blank"}
[![OC sponsor 2](https://opencollective.com/bootstrap/sponsor/2/avatar.svg)](https://opencollective.com/bootstrap/sponsor/2/website){:target="\_blank"}
[![OC sponsor 3](https://opencollective.com/bootstrap/sponsor/3/avatar.svg)](https://opencollective.com/bootstrap/sponsor/3/website){:target="\_blank"}
[![OC sponsor 4](https://opencollective.com/bootstrap/sponsor/4/avatar.svg)](https://opencollective.com/bootstrap/sponsor/4/website){:target="\_blank"}
[![OC sponsor 5](https://opencollective.com/bootstrap/sponsor/5/avatar.svg)](https://opencollective.com/bootstrap/sponsor/5/website){:target="\_blank"}
[![OC sponsor 6](https://opencollective.com/bootstrap/sponsor/6/avatar.svg)](https://opencollective.com/bootstrap/sponsor/6/website){:target="\_blank"}
[![OC sponsor 7](https://opencollective.com/bootstrap/sponsor/7/avatar.svg)](https://opencollective.com/bootstrap/sponsor/7/website){:target="\_blank"}
[![OC sponsor 8](https://opencollective.com/bootstrap/sponsor/8/avatar.svg)](https://opencollective.com/bootstrap/sponsor/8/website){:target="\_blank"}
[![OC sponsor 9](https://opencollective.com/bootstrap/sponsor/9/avatar.svg)](https://opencollective.com/bootstrap/sponsor/9/website){:target="\_blank"}

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/bootstrap#backer){:target="\_blank"}]

[![Backers](https://opencollective.com/bootstrap/backers.svg?width=890)](https://opencollective.com/bootstrap#backers){:target="\_blank"}

## Copyright and license

Code and documentation copyright 2011–2023 the [Bootstrap Authors](https://github.com/twbs/bootstrap/graphs/contributors){:target="\_blank"}. Code released under the [MIT License](https://github.com/twbs/bootstrap/blob/main/LICENSE){:target="\_blank"}. Docs released under [Creative Commons](https://creativecommons.org/licenses/by/3.0/){:target="\_blank"}.
