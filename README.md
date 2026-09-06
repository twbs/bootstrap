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
- [CATEGORY FASHION](https://studyplayings.pages.dev/category-fashion.html)
- [BELOTE 3IN1](https://studyplayings.web.app/belote-3in1.html)
- [DIAMOND MOSAIC](https://studyplayings.web.app/diamond-mosaic.html)
- [CATEGORY FOOTBALL](https://thelearnquesters.pages.dev/category-football.html)
- [FASHION VALKYRIES SAGA OF STYLE](https://studyplayings.pages.dev/fashion-valkyries-saga-of-style.html)
- [CAR SERVICE TYCOON](https://studyplayings.pages.dev/car-service-tycoon.html)
- [CATEGORY CARDS](https://studyplayings.pages.dev/category-cards.html)
- [CATEGORY BUILDING182](https://studyplayings.pages.dev/category-building182.html)
- [CATEGORY BOOKMARKLETS](https://studyplayings.pages.dev/category-bookmarklets.html)
- [MERGE RUN BATTLE](https://studyplayings.pages.dev/merge-run-battle.html)
- [FOOD CARD SORT](https://studyplayings.pages.dev/food-card-sort.html)
- [PIXEL NUMBER DIY COLORING](https://studyplayings.web.app/pixel-number-diy-coloring.html)
- [BACKGAMMON DUEL](https://studyplayings.web.app/backgammon-duel.html)
- [CATEGORY SPOT THE DIFFERENCE6](https://studyplayings.pages.dev/category-spot-the-difference6.html)
- [MILITARY CUBES 2048](https://studyplayings.pages.dev/military-cubes-2048.html)
- [DUMMIES WORLD CUP](https://studyplayings.pages.dev/dummies-world-cup.html)
- [SHADOWMAN RUNNER](https://studyplayings.pages.dev/shadowman-runner.html)
- [HOME BLOCK STORY](https://studyplayings.pages.dev/home-block-story.html)
- [BULL RUNNER](https://studyplayings.pages.dev/bull-runner.html)
- [CATEGORY CONTROLLER](https://studyplayings.pages.dev/category-controller.html)
- [STEAL ITEMS IO](https://studyplayings.pages.dev/steal-items-io.html)
- [CATEGORY CONNECT68](https://learnquester.github.io/category-connect68.html)
- [INDEX3](https://learnquester.github.io/index3.html)
- [WOODS OF NEVIA FOREST SURVIVAL](https://studyplayings.pages.dev/woods-of-nevia-forest-survival.html)
- [FLOAT FOR BRAINROTS](https://studyplayings.pages.dev/float-for-brainrots.html)
- [SEA LORDS](https://studyplayings.pages.dev/sea-lords.html)
- [COLOR JAM 3D](https://studyplayings.pages.dev/color-jam-3d.html)
- [LABUBU POP](https://studyplayings.pages.dev/labubu-pop.html)
- [DAILY HOROSCOPE HD](https://studyplayings.pages.dev/daily-horoscope-hd.html)
- [INDEX10](https://learnquester.github.io/index10.html)
- [BACKWOODS](https://studyplayings.pages.dev/backwoods.html)
- [MUSIC TILES FLUFFY HOP BEAT](https://studyplayings.pages.dev/music-tiles-fluffy-hop-beat.html)
- [CATEGORY MOUSE1 707](https://studyplayings.pages.dev/category-mouse1-707.html)
- [FLAPPY RUSH](https://studyplayings.pages.dev/flappy-rush.html)
- [SWEET AND FRUITY MAKEUP](https://studyplayings.pages.dev/sweet-and-fruity-makeup.html)
- [BUBBLE SHOOTER BILLIARDS POOL](https://studyplayings.pages.dev/bubble-shooter-billiards-pool.html)
- [DARK ACADEMIA WEDDING](https://studyplayings.pages.dev/dark-academia-wedding.html)
- [CATEGORY CAN T STOP PLAYING212](https://studyplayings.pages.dev/category-can-t-stop-playing212.html)
- [CHICKZ STACK](https://studyplayings.pages.dev/chickz-stack.html)
- [INDEX17](https://learnquester.github.io/index17.html)
- [BLOONS SURVIVALIO](https://studyplayings.pages.dev/bloons-survivalio.html)
- [GEOMETRY ARROW 2](https://learnquester.github.io/geometry-arrow-2.html)
- [CUBE DROP PUZZLE](https://learnquester.github.io/cube-drop-puzzle.html)
- [MOTO TRAFFIC RIDER](https://studyplayings.pages.dev/moto-traffic-rider.html)
- [CHECKERS DELUXE EDITION](https://studyplayings.web.app/checkers-deluxe-edition.html)
- [CAKE LINK MASTER](https://studyplayings.web.app/cake-link-master.html)
- [CAT MATCH 3](https://studyplayings.pages.dev/cat-match-3.html)
- [PARKING FURY 3D NIGHT CITY](https://studyplayings.pages.dev/parking-fury-3d-night-city.html)
- [WINTER SOLITAIRE TRIPEAKS](https://studyplayings.web.app/winter-solitaire-tripeaks.html)
- [WORDS OR DIE](https://studyplayings.web.app/words-or-die.html)
- [SUIKA WATERMELON DROP](https://studyplayings.pages.dev/suika-watermelon-drop.html)
- [LOGIC STORM ANIMALS PUZZLE](https://studyplayings.web.app/logic-storm-animals-puzzle.html)
- [BRAINROT CLICKER](https://studyplayings.pages.dev/brainrot-clicker.html)
- [CATEGORY MERGE221](https://studyplayings.pages.dev/category-merge221.html)
- [ANIMAL MERGE ZOO PARK](https://studyplayings.pages.dev/animal-merge-zoo-park.html)
- [MOJO MATCH 3D](https://studyplayings.pages.dev/mojo-match-3d.html)
- [TRICKY ARROW 2](https://studyplayings.pages.dev/tricky-arrow-2.html)
- [WORM ESCAPE](https://studyplayings.web.app/worm-escape.html)
- [PEOPLE PLAYGROUND RAGDOLL ARENA](https://studyplayings.pages.dev/people-playground-ragdoll-arena.html)
- [MICKEY RUN ADVENTURE GAME](https://studyplayings.pages.dev/mickey-run-adventure-game.html)
- [CATEGORY PARTY23](https://studyplayings.web.app/category-party23.html)
- [MERMAIDS SPOT THE DIFFERENCES](https://studyplayings.pages.dev/mermaids-spot-the-differences.html)
- [ZOMBIE SURVIVAL](https://studyplayings.pages.dev/zombie-survival.html)
- [CYBER ROLLING GOING BALL 3D](https://studyquests.pages.dev/cyber-rolling-going-ball-3d.html)
- [CATEGORY SOCCER](https://studyquests.pages.dev/category-soccer.html)
- [ASMR WATER VS FIRE](https://studyquesthub.web.app/asmr-water-vs-fire.html)
- [TICTOC BRAIDED HAIRSTYLES](https://studyplayings.pages.dev/tictoc-braided-hairstyles.html)
- [BALL AND GIRLFRIEND](https://studyplaying.github.io/ball-and-girlfriend.html)
- [CATEGORY GAMES](https://studyplayings.pages.dev/category-games.html)
- [CATEGORY SNAKE](https://studyplayings.web.app/category-snake.html)
- [CATEGORY CONTROLLER](https://studyplaying.github.io/category-controller.html)
- [CATEGORY LISTS](https://studyplayings.pages.dev/category-lists.html)
- [CONTACT](https://studyplayings.web.app/contact.html)
- [MY HORSE IS AMAZING](https://studyplayings.web.app/my-horse-is-amazing.html)
- [POTTERY MASTER](https://quizverses-9d2f2.web.app/pottery-master.html)
- [CATEGORY SIMULATION](https://quizverses.pages.dev/category-simulation.html)
- [CATEGORY TOWER DEFENSE118](https://quizverses.pages.dev/category-tower-defense118.html)
- [PATO VS COPS](https://studyquests.pages.dev/pato-vs-cops.html)
- [DIAMOND MOSAIC](https://studyquests.pages.dev/diamond-mosaic.html)
- [PUSH THE FROG](https://studyquesthub.web.app/push-the-frog.html)
- [BUBBLE SHOOTER SPINNER POP](https://quizverses-9d2f2.web.app/bubble-shooter-spinner-pop.html)
- [CATEGORY EDUCATIONAL](https://quizverses.pages.dev/category-educational.html)
- [MR CAPPUCCINO ASSASSINO](https://studyquesthub.web.app/mr-cappuccino-assassino.html)
- [DEAD BRAIN](https://studyquests.github.io/dead-brain.html)
- [BUBBLE TROUBLE 2 REBUBBLED](https://studyplayings.web.app/bubble-trouble-2-rebubbled.html)
- [TOPSY TURVY](https://studyquests.pages.dev/topsy-turvy.html)
- [PESKY MOLES](https://studyplaying.github.io/pesky-moles.html)
- [FRUIT MERGE JUICY DROP GAME](https://quizverses-9d2f2.web.app/fruit-merge-juicy-drop-game.html)
- [MATCH DREAM GARDEN](https://studyquests.github.io/match-dream-garden.html)
- [CATEGORY FLASH](https://studyquests.github.io/category-flash.html)
- [HOTEL FEVER TYCOON](https://quizverses-9d2f2.web.app/hotel-fever-tycoon.html)
- [CATEGORY INTERSTELLARNETWORK](https://learnquester.github.io/category-interstellarnetwork.html)
- [HYPERSPACE   QUANTUM FRACTURE FEZ](https://studyplaying.github.io/hyperspace---quantum-fracture-fez.html)
- [SORT AND STYLE BACK TO SCHOOL](https://studyquests.pages.dev/sort-and-style-back-to-school.html)
- [TOBININ](https://studyplayings.pages.dev/tobinin.html)
- [CATEGORY 3D1 371](https://quizverses.pages.dev/category-3d1-371.html)
- [MERGE HERO SURVIVAL TOWER DEFENSE](https://quizverses-9d2f2.web.app/merge-hero-survival-tower-defense.html)
- [DIGITAL CIRCUS RUN](https://quizverses-9d2f2.web.app/digital-circus-run.html)
- [THE SORTING MART](https://studyplayings.pages.dev/the-sorting-mart.html)
- [DRAW BRIDGE CHALLENGE](https://quizverses.pages.dev/draw-bridge-challenge.html)
- [ARCHER DUNGEON HERO](https://quizverses.pages.dev/archer-dungeon-hero.html)
- [CATEGORY BUILDING](https://quizverses.pages.dev/category-building.html)
- [2048 DROP MERGE](https://studyplayings.pages.dev/2048-drop-merge.html)
- [CATEGORY CAN T STOP PLAYING215](https://studyquesthub.web.app/category-can-t-stop-playing215.html)
- [SWEET HAUNT 2](https://studyquests.github.io/sweet-haunt-2.html)
- [LOVE IN STYLE](https://quizverses-9d2f2.web.app/love-in-style.html)
- [CATEGORY MAKEUP51](https://quizverses.pages.dev/category-makeup51.html)
- [INDEX16](https://learnquester.github.io/index16.html)
- [DOOMSDAY ZOMBIE TD](https://studyquesthub.web.app/doomsday-zombie-td.html)
- [FURY ROAD ZOMBIE CRASH](https://quizverses-9d2f2.web.app/fury-road-zombie-crash.html)
- [CATEGORY MISSION207](https://quizverses.pages.dev/category-mission207.html)
- [PRIVACY](https://studyquesthub.web.app/privacy.html)
- [SAVE MY HERO](https://studyplaying.github.io/save-my-hero.html)
- [CATEGORY SANDBOX](https://studyplayings.web.app/category-sandbox.html)
- [CATEGORY BLOCK94](https://studyquesthub.web.app/category-block94.html)
- [CATEGORY BUBBLE SHOOTER](https://quizverses.pages.dev/category-bubble-shooter.html)
- [HIDDEN OBJECT MY HOTEL](https://studyplayings.web.app/hidden-object-my-hotel.html)
- [SAVE STRANDING FISH](https://studyplayings.pages.dev/save-stranding-fish.html)
- [CATEGORY BRAIN261](https://quizverses.pages.dev/category-brain261.html)
- [SUPER DOG HERO DASH](https://studyplayings.pages.dev/super-dog-hero-dash.html)
- [CATEGORY DESTROY256](https://quizverses.pages.dev/category-destroy256.html)
- [LULU RUN](https://studyquests.github.io/lulu-run.html)
- [CATEGORY GROW99](https://learnquester.github.io/category-grow99.html)
- [21 CARDS](https://quizverses-9d2f2.web.app/21-cards.html)
- [ERASE THE EXTRA ELEMENT](https://studyplaying.github.io/erase-the-extra-element.html)
- [FOOT HOSPITAL](https://quizverses-9d2f2.web.app/foot-hospital.html)
- [RUSH CAR DRIVING RACE MASTER](https://quizverses-9d2f2.web.app/rush-car-driving-race-master.html)
- [ITALIAN BRAINROT QUIZ](https://studyplayings.pages.dev/italian-brainrot-quiz.html)
- [CATEGORY AVOID](https://studyquesthub.web.app/category-avoid.html)
- [INDEX4](https://learnquester.github.io/index4.html)
