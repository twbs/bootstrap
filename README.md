<p align="center">
  <a href="https://getbootstrap.com/">
    <img src="https://getbootstrap.com/docs/5.3/assets/brand/bootstrap-logo-shadow.png" alt="Bootstrap logo" width="200" height="165">
  </a>
</p>

<h3 align="center">Bootstrap</h3>

<p align="center">
  Sleek, intuitive, and powerful front-end framework for faster and easier web development.
  <br>
  <a href="https://getbootstrap.com/docs/5.3/"><strong>Explore Bootstrap docs »</strong></a>
  <br>
  <br>
  <a href="https://github.com/twbs/bootstrap/issues/new?assignees=-&labels=bug&template=bug_report.yml">Report bug</a>
  ·
  <a href="https://github.com/twbs/bootstrap/issues/new?assignees=&labels=feature&template=feature_request.yml">Request feature</a>
  ·
  <a href="https://blog.getbootstrap.com/">Blog</a>
</p>


## Bootstrap 5

Our default branch is for development of our Bootstrap 5 release. Head to the [`v4-dev` branch](https://github.com/twbs/bootstrap/tree/v4-dev) to view the readme, documentation, and source code for Bootstrap 4.


## Table of contents

- [Quick start](#quick-start)
- [Status](#status)
- [What’s included](#whats-included)
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

- [Download the latest release](https://github.com/twbs/bootstrap/archive/v5.3.8.zip)
- Clone the repo: `git clone https://github.com/twbs/bootstrap.git`
- Install with [npm](https://www.npmjs.com/): `npm install bootstrap@v5.3.8`
- Install with [yarn](https://yarnpkg.com/): `yarn add bootstrap@v5.3.8`
- Install with [Bun](https://bun.sh/): `bun add bootstrap@v5.3.8`
- Install with [Composer](https://getcomposer.org/): `composer require twbs/bootstrap:5.3.8`
- Install with [NuGet](https://www.nuget.org/): CSS: `Install-Package bootstrap` Sass: `Install-Package bootstrap.sass`

Read the [Getting started page](https://getbootstrap.com/docs/5.3/getting-started/introduction/) for information on the framework contents, templates, examples, and more.


## Status

[![Build Status](https://img.shields.io/github/actions/workflow/status/twbs/bootstrap/js.yml?branch=main&label=JS%20Tests&logo=github)](https://github.com/twbs/bootstrap/actions/workflows/js.yml?query=workflow%3AJS+branch%3Amain)
[![npm version](https://img.shields.io/npm/v/bootstrap?logo=npm&logoColor=fff)](https://www.npmjs.com/package/bootstrap)
[![Gem version](https://img.shields.io/gem/v/bootstrap?logo=rubygems&logoColor=fff)](https://rubygems.org/gems/bootstrap)
[![Meteor Atmosphere](https://img.shields.io/badge/meteor-twbs%3Abootstrap-blue?logo=meteor&logoColor=fff)](https://atmospherejs.com/twbs/bootstrap)
[![Packagist Prerelease](https://img.shields.io/packagist/vpre/twbs/bootstrap?logo=packagist&logoColor=fff)](https://packagist.org/packages/twbs/bootstrap)
[![NuGet](https://img.shields.io/nuget/vpre/bootstrap?logo=nuget&logoColor=fff)](https://www.nuget.org/packages/bootstrap/absoluteLatest)
[![Coverage Status](https://img.shields.io/coveralls/github/twbs/bootstrap/main?logo=coveralls&logoColor=fff)](https://coveralls.io/github/twbs/bootstrap?branch=main)
[![CSS gzip size](https://img.badgesize.io/twbs/bootstrap/main/dist/css/bootstrap.min.css?compression=gzip&label=CSS%20gzip%20size)](https://github.com/twbs/bootstrap/blob/main/dist/css/bootstrap.min.css)
[![CSS Brotli size](https://img.badgesize.io/twbs/bootstrap/main/dist/css/bootstrap.min.css?compression=brotli&label=CSS%20Brotli%20size)](https://github.com/twbs/bootstrap/blob/main/dist/css/bootstrap.min.css)
[![JS gzip size](https://img.badgesize.io/twbs/bootstrap/main/dist/js/bootstrap.min.js?compression=gzip&label=JS%20gzip%20size)](https://github.com/twbs/bootstrap/blob/main/dist/js/bootstrap.min.js)
[![JS Brotli size](https://img.badgesize.io/twbs/bootstrap/main/dist/js/bootstrap.min.js?compression=brotli&label=JS%20Brotli%20size)](https://github.com/twbs/bootstrap/blob/main/dist/js/bootstrap.min.js)
![Open Source Security Foundation Scorecard](https://img.shields.io/ossf-scorecard/github.com/twbs/bootstrap)
[![Backers on Open Collective](https://img.shields.io/opencollective/backers/bootstrap?logo=opencollective&logoColor=fff)](#backers)
[![Sponsors on Open Collective](https://img.shields.io/opencollective/sponsors/bootstrap?logo=opencollective&logoColor=fff)](#sponsors)


## What’s included

Within the download you’ll find the following directories and files, logically grouping common assets and providing both compiled and minified variations.

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

We provide compiled CSS and JS (`bootstrap.*`), as well as compiled and minified CSS and JS (`bootstrap.min.*`). [Source maps](https://web.dev/articles/source-maps) (`bootstrap.*.map`) are available for use with certain browsers’ developer tools. Bundled JS files (`bootstrap.bundle.js` and minified `bootstrap.bundle.min.js`) include [Popper](https://github.com/floating-ui/popper-docs/blob/main/docs/v2/index.md).


## Bugs and feature requests

Have a bug or a feature request? Please first read the [issue guidelines](https://github.com/twbs/bootstrap/blob/main/.github/CONTRIBUTING.md#using-the-issue-tracker) and search for existing and closed issues. If your problem or idea is not addressed yet, [please open a new issue](https://github.com/twbs/bootstrap/issues/new/choose).


## Documentation

Bootstrap’s documentation, included in this repo in the root directory, is built with [Astro](https://astro.build/) and publicly hosted on GitHub Pages at <https://getbootstrap.com/>. The docs may also be run locally.

Documentation search is powered by [Algolia's DocSearch](https://docsearch.algolia.com/).

### Running documentation locally

1. Run `npm install` to install the Node.js dependencies, including Astro (the site builder).
2. Run `npm run test` (or a specific npm script) to rebuild distributed CSS and JavaScript files, as well as our docs assets.
3. From the root `/bootstrap` directory, run `npm run docs-serve` in the command line.
4. Open <http://localhost:9001> in your browser, and voilà.

Learn more about using Astro by reading its [documentation](https://docs.astro.build/en/getting-started/).

### Documentation for previous releases

You can find all our previous releases docs on <https://getbootstrap.com/docs/versions/>.

[Previous releases](https://github.com/twbs/bootstrap/releases) and their documentation are also available for download.


## Contributing

Please read through our [contributing guidelines](https://github.com/twbs/bootstrap/blob/main/.github/CONTRIBUTING.md). Included are directions for opening issues, coding standards, and notes on development.

Moreover, if your pull request contains JavaScript patches or features, you must include [relevant unit tests](https://github.com/twbs/bootstrap/tree/main/js/tests). All HTML and CSS should conform to the [Code Guide](https://github.com/mdo/code-guide), maintained by [Mark Otto](https://github.com/mdo).

Editor preferences are available in the [editor config](https://github.com/twbs/bootstrap/blob/main/.editorconfig) for easy use in common text editors. Read more and download plugins at <https://editorconfig.org/>.


## Community

Get updates on Bootstrap’s development and chat with the project maintainers and community members.

- Follow [@getbootstrap on X](https://x.com/getbootstrap).
- Read and subscribe to [The Official Bootstrap Blog](https://blog.getbootstrap.com/).
- Ask questions and explore [our GitHub Discussions](https://github.com/twbs/bootstrap/discussions).
- Discuss, ask questions, and more on [the community Discord](https://discord.gg/bZUvakRU3M) or [Bootstrap subreddit](https://www.reddit.com/r/bootstrap/).
- Chat with fellow Bootstrappers in IRC. On the `irc.libera.chat` server, in the `#bootstrap` channel.
- Implementation help may be found at Stack Overflow (tagged [`bootstrap-5`](https://stackoverflow.com/questions/tagged/bootstrap-5)).
- Developers should use the keyword `bootstrap` on packages which modify or add to the functionality of Bootstrap when distributing through [npm](https://www.npmjs.com/browse/keyword/bootstrap) or similar delivery mechanisms for maximum discoverability.


## Versioning

For transparency into our release cycle and in striving to maintain backward compatibility, Bootstrap is maintained under [the Semantic Versioning guidelines](https://semver.org/). Sometimes we screw up, but we adhere to those rules whenever possible.

See [the Releases section of our GitHub project](https://github.com/twbs/bootstrap/releases) for changelogs for each release version of Bootstrap. Release announcement posts on [the official Bootstrap blog](https://blog.getbootstrap.com/) contain summaries of the most noteworthy changes made in each release.


## Creators

**Mark Otto**

- <https://x.com/mdo>
- <https://github.com/mdo>

**Jacob Thornton**

- <https://x.com/fat>
- <https://github.com/fat>


## Thanks

<a href="https://www.browserstack.com/">
  <img src="https://live.browserstack.com/images/opensource/browserstack-logo.svg" alt="BrowserStack" width="192" height="42">
</a>

Thanks to [BrowserStack](https://www.browserstack.com/) for providing the infrastructure that allows us to test in real browsers!

<a href="https://www.netlify.com/">
  <img src="https://www.netlify.com/v3/img/components/full-logo-light.svg" alt="Netlify" width="147" height="40">
</a>

Thanks to [Netlify](https://www.netlify.com/) for providing us with Deploy Previews!


## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/bootstrap#sponsor)]

[![OC sponsor 0](https://opencollective.com/bootstrap/sponsor/0/avatar.svg)](https://opencollective.com/bootstrap/sponsor/0/website)
[![OC sponsor 1](https://opencollective.com/bootstrap/sponsor/1/avatar.svg)](https://opencollective.com/bootstrap/sponsor/1/website)
[![OC sponsor 2](https://opencollective.com/bootstrap/sponsor/2/avatar.svg)](https://opencollective.com/bootstrap/sponsor/2/website)
[![OC sponsor 3](https://opencollective.com/bootstrap/sponsor/3/avatar.svg)](https://opencollective.com/bootstrap/sponsor/3/website)
[![OC sponsor 4](https://opencollective.com/bootstrap/sponsor/4/avatar.svg)](https://opencollective.com/bootstrap/sponsor/4/website)
[![OC sponsor 5](https://opencollective.com/bootstrap/sponsor/5/avatar.svg)](https://opencollective.com/bootstrap/sponsor/5/website)
[![OC sponsor 6](https://opencollective.com/bootstrap/sponsor/6/avatar.svg)](https://opencollective.com/bootstrap/sponsor/6/website)
[![OC sponsor 7](https://opencollective.com/bootstrap/sponsor/7/avatar.svg)](https://opencollective.com/bootstrap/sponsor/7/website)
[![OC sponsor 8](https://opencollective.com/bootstrap/sponsor/8/avatar.svg)](https://opencollective.com/bootstrap/sponsor/8/website)
[![OC sponsor 9](https://opencollective.com/bootstrap/sponsor/9/avatar.svg)](https://opencollective.com/bootstrap/sponsor/9/website)


## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/bootstrap#backer)]

[![Backers](https://opencollective.com/bootstrap/backers.svg?width=890)](https://opencollective.com/bootstrap#backers)


## Copyright and license

Code and documentation copyright 2011-2026 the [Bootstrap Authors](https://github.com/twbs/bootstrap/graphs/contributors). Code released under the [MIT License](https://github.com/twbs/bootstrap/blob/main/LICENSE). Docs released under [Creative Commons](https://creativecommons.org/licenses/by/3.0/).


## 🌐 Web Resources & Interactive Index
- [MATH RUNNER](https://theskillquest.pages.dev/math-runner.html)
- [FURRY KUNG FU](https://studyplaying.github.io/furry-kung-fu.html)
- [GRANDFATHER ROAD CHASE REALISTIC SHOOTER GUNS](https://quizverses.github.io/grandfather-road-chase-realistic-shooter-guns.html)
- [CAKE LINK MASTER](https://quizverses-9d2f2.web.app/cake-link-master.html)
- [JAVELIN BATTLE](https://quizverses.pages.dev/javelin-battle.html)
- [WOOD HEXA FACTORY](https://quizverses-9d2f2.web.app/wood-hexa-factory.html)
- [CATEGORY SURVIVAL366](https://quizverses.pages.dev/category-survival366.html)
- [CATEGORY PUZZLE 4](https://quizverses-9d2f2.web.app/category-puzzle-4.html)
- [CAR PARKING STUNT GAMES 2024](https://studyquests.github.io/car-parking-stunt-games-2024.html)
- [VALLEY OF WOLVES AMBUSH](https://studyquests.pages.dev/valley-of-wolves-ambush.html)
- [CATEGORY ADVENTURE 3](https://studyquests.pages.dev/category-adventure-3.html)
- [CATEGORY PIXEL313](https://quizverses.pages.dev/category-pixel313.html)
- [MR RECKLESS CAR CHASE SIMULATOR](https://quizverses.pages.dev/mr-reckless-car-chase-simulator.html)
- [SUGAR HEROES](https://studyquests.pages.dev/sugar-heroes.html)
- [BUBBLE SHOOTER TEMPLE JEWELS](https://quizverses.github.io/bubble-shooter-temple-jewels.html)
- [FAMILY TREE EMOJI](https://studyquesthub.web.app/family-tree-emoji.html)
- [CATEGORY FOOTBALL](https://quizverses.pages.dev/category-football.html)
- [CATEGORY IO](https://quizverses.github.io/category-io.html)
- [CATEGORY QUIZ](https://quizverses-9d2f2.web.app/category-quiz.html)
- [CATEGORY BUILDING179](https://studyplaying.github.io/category-building179.html)
- [CATEGORY POOL17](https://quizverses.github.io/category-pool17.html)
- [CATEGORY CASUAL 2](https://studyquesthub.web.app/category-casual-2.html)
- [INDEX9](https://quizverses-9d2f2.web.app/index9.html)
- [BULL RUNNER](https://studyquesthub.web.app/bull-runner.html)
- [KLONDIKE SOLITAIRE](https://studyquests.github.io/klondike-solitaire.html)
- [CATEGORY GROW99](https://quizverses.pages.dev/category-grow99.html)
- [PAWS OFF MY CLUES](https://studyquesthub.web.app/paws-off-my-clues.html)
- [CATEGORY CONTROLLER 3](https://quizverses.github.io/category-controller-3.html)
- [OFFLINE FPS ROYALE](https://quizverses.github.io/offline-fps-royale.html)
- [STICKMAN ROCKET](https://quizverses.github.io/stickman-rocket.html)
- [ROTATE RINGS CIRCLE PUZZLE](https://quizverses.github.io/rotate-rings-circle-puzzle.html)
- [INDEX36](https://quizverses.github.io/index36.html)
- [STICKMAN PUNISHMENT](https://studyquests.github.io/stickman-punishment.html)
- [CATEGORY CASUAL](https://quizverses-9d2f2.web.app/category-casual.html)
- [HIDDEN OBJECT FARM ADVENTURE](https://studyquests.github.io/hidden-object-farm-adventure.html)
- [CATEGORY RPG80](https://quizverses.pages.dev/category-rpg80.html)
- [CUBICA](https://studyquests.pages.dev/cubica.html)
- [FOOD JAM](https://quizverses.pages.dev/food-jam.html)
- [CATEGORY PARTY23](https://quizverses-9d2f2.web.app/category-party23.html)
- [CATEGORY SCRATCH17](https://quizverses-9d2f2.web.app/category-scratch17.html)
- [CATEGORY MAHJONG CONNECT](https://studyquesthub.web.app/category-mahjong-connect.html)
- [CATEGORY FARMING87](https://studyquesthub.web.app/category-farming87.html)
- [SECRET ROOMS](https://studyquests.github.io/secret-rooms.html)
- [TAPE SORT 3D](https://quizverses.github.io/tape-sort-3d.html)
- [INDEX15](https://quizverses-9d2f2.web.app/index15.html)
- [ROYAL PUZZLE BURST](https://studyquests.pages.dev/royal-puzzle-burst.html)
- [CATEGORY RPG80](https://quizverses-9d2f2.web.app/category-rpg80.html)
- [CATEGORY MAKEUP CATEGORY](https://quizverses.pages.dev/category-makeup-category.html)
- [CATEGORY MERGE](https://quizverses-9d2f2.web.app/category-merge.html)
- [OHPEACH IT](https://quizverses.github.io/ohpeach-it.html)
- [HYPER SURVIVE](https://quizverses.github.io/hyper-survive.html)
- [CATEGORY PUZZLE 3](https://quizverses-9d2f2.web.app/category-puzzle-3.html)
- [CATEGORY RUNNING](https://quizverses.pages.dev/category-running.html)
- [CATEGORY GUN238](https://quizverses.pages.dev/category-gun238.html)
- [GIANT RUN 3D](https://studyquests.pages.dev/giant-run-3d.html)
- [PING PONG BATTLE TABLE TENNIS](https://studyquesthub.web.app/ping-pong-battle-table-tennis.html)
- [LULUS FASHION WORLD](https://quizverses.github.io/lulus-fashion-world.html)
- [IDLE BARBER SHOP](https://studyquesthub.web.app/idle-barber-shop.html)
- [THE PATAGONIANS](https://studyquests.github.io/the-patagonians.html)
- [DEAD PARADISE](https://quizverses.pages.dev/dead-paradise.html)
- [CATEGORY PUZZLE](https://quizverses.pages.dev/category-puzzle.html)
- [BINGO HALLOWEEN](https://studyquests.pages.dev/bingo-halloween.html)
- [CATEGORY ESCAPE 2](https://quizverses.github.io/category-escape-2.html)
- [CATEGORY MINECRAFT 2](https://quizverses.pages.dev/category-minecraft-2.html)
- [CATEGORY RACING DRIVING](https://quizverses.pages.dev/category-racing-driving.html)
- [ARROW SURVIVAL 15 SECONDS](https://studyquests.github.io/arrow-survival-15-seconds.html)
- [CATEGORY BLOCK91](https://studyquests.pages.dev/category-block91.html)
- [BFFS K POP FANGIRLS](https://studyquests.github.io/bffs-k-pop-fangirls.html)
- [WOOD HEXA FACTORY](https://studyquests.github.io/wood-hexa-factory.html)
- [CATEGORY DRESS UP 3](https://studyplaying.github.io/category-dress-up-3.html)
- [SURVIVAL SWORD BATTLE](https://studyquests.pages.dev/survival-sword-battle.html)
- [CATEGORY ART](https://studyquesthub.web.app/category-art.html)
- [CATEGORY MONSTER](https://quizverses-9d2f2.web.app/category-monster.html)
- [MANSION STORY MATCH](https://studyquests.github.io/mansion-story-match.html)
- [ANTS PARTY](https://studyquests.pages.dev/ants-party.html)
- [PRIVACY](https://cryptotify.pages.dev/privacy.html)
- [DOCTOR CHICKEN](https://studyquests.pages.dev/doctor-chicken.html)
- [CATEGORY MAKEUP51](https://studyquests.github.io/category-makeup51.html)
- [PIZZA PUZZLE](https://quizverses.github.io/pizza-puzzle.html)
- [CATEGORY BIKE 2](https://studyquesthub.web.app/category-bike-2.html)
- [CATEGORY CARDS](https://studyquesthub.web.app/category-cards.html)
- [CATEGORY FIGHTING](https://quizverses.pages.dev/category-fighting.html)
- [WORDMEISTER HD](https://studyquesthub.web.app/wordmeister-hd.html)
- [YARN FEVER UNRAVEL PUZZLE](https://studyquesthub.web.app/yarn-fever-unravel-puzzle.html)
- [MEGA ESCAPE CAR PARKING PUZZLE](https://studyquests.pages.dev/mega-escape-car-parking-puzzle.html)
- [CATEGORY CONTROLLER 2](https://studyplaying.github.io/category-controller-2.html)
- [RANCH ADVENTURES](https://quizverses.github.io/ranch-adventures.html)
- [SHANGHAI TOWN](https://quizverses.github.io/shanghai-town.html)
- [TILES OF THE UNEXPECTED 2](https://quizverses.github.io/tiles-of-the-unexpected-2.html)
- [DOLPHIN DASH](https://studyquesthub.web.app/dolphin-dash.html)
- [CATEGORY UNBLOCKED GAMES](https://quizverses.pages.dev/category-unblocked-games.html)
- [PHONE CASE DIY 5](https://quizverses-9d2f2.web.app/phone-case-diy-5.html)
- [ROYAL REBELLION PUNK MAGIC](https://quizverses-9d2f2.web.app/royal-rebellion-punk-magic.html)
- [SWEET AND FRUITY MAKEUP](https://studyquests.pages.dev/sweet-and-fruity-makeup.html)
- [KNOCK AND RUN 100 DOORS ESCAPE](https://studyquests.github.io/knock-and-run-100-doors-escape.html)
- [DOLLYS RESTAURANT ORGANIZING](https://studyquests.pages.dev/dollys-restaurant-organizing.html)
- [CATEGORY SNAKE40](https://quizverses.pages.dev/category-snake40.html)
- [HIDDEN OBJECT MY HOTEL](https://quizverses.pages.dev/hidden-object-my-hotel.html)
- [DEVIL DASH](https://quizverses.github.io/devil-dash.html)
- [TRIANGLE WAY](https://quizverses.pages.dev/triangle-way.html)
- [CLICK CLICK CLICKER](https://quizverses-9d2f2.web.app/click-click-clicker.html)
- [CUBE KING](https://studyquests.pages.dev/cube-king.html)
- [CATEGORY SIMULATION 2](https://quizverses.pages.dev/category-simulation-2.html)
- [ONU LIVE](https://studyquesthub.web.app/onu-live.html)
- [TILE HEXA SORT](https://studyquests.github.io/tile-hexa-sort.html)
- [CATEGORY FIGHTING124](https://quizverses.pages.dev/category-fighting124.html)
- [COOKING FESTIVAL](https://studyquesthub.web.app/cooking-festival.html)
- [MILITARY CUBES 2048](https://studyquests.github.io/military-cubes-2048.html)
- [STICK FIGHT THE CHAOS](https://studyquests.pages.dev/stick-fight-the-chaos.html)
- [CATEGORY SPORTS](https://quizverses.pages.dev/category-sports.html)
- [MEDIEVAL ESCAPE](https://quizverses-9d2f2.web.app/medieval-escape.html)
- [INDEX37](https://quizverses.github.io/index37.html)
- [MAGIC BUBBLES](https://quizverses.pages.dev/magic-bubbles.html)
- [CATEGORY MATH29](https://quizverses-9d2f2.web.app/category-math29.html)
- [HERO TOWER WARS MERGE PUZZLE](https://studyquesthub.web.app/hero-tower-wars-merge-puzzle.html)
- [CATEGORY SIMULATION](https://quizverses.pages.dev/category-simulation.html)
- [CATEGORY WORLD CUP17](https://studyquests.github.io/category-world-cup17.html)
- [SKYSCRAPER TO THE SKY](https://studyquesthub.web.app/skyscraper-to-the-sky.html)
- [DALGONA MASTER](https://studyquests.pages.dev/dalgona-master.html)
- [BOLTS AND NUTS](https://quizverses.github.io/bolts-and-nuts.html)
- [BLOCOPS](https://studyquesthub.web.app/blocops.html)
- [NEON BLAST](https://studyquesthub.web.app/neon-blast.html)
- [MERGE BLOCKS 2048](https://quizverses.github.io/merge-blocks-2048.html)
- [DAYCARE TYCOON](https://quizverses.github.io/daycare-tycoon.html)
- [SOLITAIRE STORY TRIPEAKS 5](https://quizverses.github.io/solitaire-story-tripeaks-5.html)
- [CATEGORY BIKE](https://studyplaying.github.io/category-bike.html)
- [WOOD NUTS MASTER SCREW PUZZLE](https://learnquester.pages.dev/wood-nuts-master-screw-puzzle.html)
- [INDEX21](https://studyquesthub.web.app/index21.html)
- [FORMULA RACING GAMES CAR GAME](https://studyplayings.web.app/formula-racing-games-car-game.html)
- [ANIME DRESS UP DOLL DRESS UP](https://learnquester.pages.dev/anime-dress-up-doll-dress-up.html)
