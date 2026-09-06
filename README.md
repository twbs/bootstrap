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
- [CATEGORY RPG GAMES](https://theskillquest.pages.dev/category-rpg-games.html)
- [BARBEE SUMMER VACATION](https://studyquesthub.web.app/barbee-summer-vacation.html)
- [BATTLE OF PIRATE CARIBBEAN BATTLE](https://studyquests.github.io/battle-of-pirate-caribbean-battle.html)
- [BESTIES CHINESE NEW YEAR CELEBRATION](https://quizverses.pages.dev/besties-chinese-new-year-celebration.html)
- [URUS CITY DRIVER](https://quizverses.pages.dev/urus-city-driver.html)
- [PLANE CHASE](https://quizverses.github.io/plane-chase.html)
- [SUPERMARKET SORT GROCERY GAME](https://quizverses.pages.dev/supermarket-sort-grocery-game.html)
- [MAHJONG MAGIC ISLANDS](https://learnquester.github.io/mahjong-magic-islands.html)
- [PUZZLE BLOCKS](https://studyplaying.github.io/puzzle-blocks.html)
- [CATEGORY TOWER DEFENSE](https://studyquesthub.web.app/category-tower-defense.html)
- [CRAFTSMAN 3D GANGSTER](https://quizverses.github.io/craftsman-3d-gangster.html)
- [CATEGORY GROW99](https://studyplaying.github.io/category-grow99.html)
- [DUCKLINGS](https://quizverses.github.io/ducklings.html)
- [FLICK SHOT SOCCER](https://studyplaying.github.io/flick-shot-soccer.html)
- [TRAFFIC LIGHT SIMULATOR 3D](https://quizverses-9d2f2.web.app/traffic-light-simulator-3d.html)
- [CATEGORY SPACE57](https://quizverses.pages.dev/category-space57.html)
- [TAYLOR DRESS STUDIO PREPPY WILD WEST GLAM](https://studyquests.github.io/taylor-dress-studio-preppy-wild-west-glam.html)
- [STRONGBLADE](https://quizverses.github.io/strongblade.html)
- [MEGA ESCAPE CAR PARKING PUZZLE](https://studyquesthub.web.app/mega-escape-car-parking-puzzle.html)
- [INDEX2](https://studyplayings.web.app/index2.html)
- [ITALIAN ANIMALS CREATE YOUR OWN BRAINROT](https://studyquests.github.io/italian-animals-create-your-own-brainrot.html)
- [YOGA MASTER](https://studyquests.pages.dev/yoga-master.html)
- [DUNGEONS N DUCKS](https://studyplaying.github.io/dungeons-n-ducks.html)
- [WATER SORT](https://quizverses.github.io/water-sort.html)
- [ROLLING BALLS SEA RACE](https://studyquesthub.web.app/rolling-balls-sea-race.html)
- [HOTEL MANAGER](https://studyplaying.github.io/hotel-manager.html)
- [SAVE BABY CAPYBARAS PULL PIN](https://studyplaying.github.io/save-baby-capybaras-pull-pin.html)
- [ZOMBIE HIGHWAY RAMPAGE](https://studyquests.github.io/zombie-highway-rampage.html)
- [HAPPY FARM THE CROP](https://studyplaying.github.io/happy-farm-the-crop.html)
- [PULL THE PINS](https://studyplaying.github.io/pull-the-pins.html)
- [FIREBOY WATERGIRL 7 AND FRIENDS](https://quizverses.pages.dev/fireboy-watergirl-7-and-friends.html)
- [CATEGORY UNBLOCKED](https://studyquests.github.io/category-unblocked.html)
- [EARWAX CLINIC](https://quizverses-9d2f2.web.app/earwax-clinic.html)
- [INDEX16](https://studyquests.github.io/index16.html)
- [FACECHART](https://studyquests.github.io/facechart.html)
- [CUTE CRAFT LAB](https://studyplaying.github.io/cute-craft-lab.html)
- [CATEGORY ANIMAL216](https://quizverses-9d2f2.web.app/category-animal216.html)
- [CATEGORY CARTOON76](https://studyquests.github.io/category-cartoon76.html)
- [CATEGORY COOKING](https://studyquests.github.io/category-cooking.html)
- [INDEX16](https://studyquesthub.web.app/index16.html)
- [IDLE BARBER SHOP](https://studyquesthub.web.app/idle-barber-shop.html)
- [CATEGORY SNIPER39](https://studyquests.github.io/category-sniper39.html)
- [SIBERIAN ASSAULT](https://quizverses.github.io/siberian-assault.html)
- [CATEGORY BRAIN](https://studyquests.github.io/category-brain.html)
- [MINI GAMES RELAX COLLECTION 2](https://studyplaying.github.io/mini-games-relax-collection-2.html)
- [INDEX38](https://studyquests.github.io/index38.html)
- [BATTLE ARENA](https://quizverses.github.io/battle-arena.html)
- [MAHJONG CRIMES PUZZLE STORY](https://studyplaying.github.io/mahjong-crimes-puzzle-story.html)
- [SURVIVAL RACING EXTREME ROAD](https://studyplaying.github.io/survival-racing-extreme-road.html)
- [CELEBRITY AESTHETIC CHALLENGE](https://studyquesthub.web.app/celebrity-aesthetic-challenge.html)
- [CATEGORY SOLDIER](https://studyquests.github.io/category-soldier.html)
- [SPRING MAGIC ENCHANTED WARDROBE](https://studyplaying.github.io/spring-magic-enchanted-wardrobe.html)
- [INDEX27](https://studyquests.github.io/index27.html)
- [TRANSFORMERS BATTLE FOR THE CITY](https://studyquesthub.web.app/transformers-battle-for-the-city.html)
- [THREAD MATCH](https://quizverses-9d2f2.web.app/thread-match.html)
- [FOREST GLADE MYSTERIES](https://studyplaying.github.io/forest-glade-mysteries.html)
- [CHICKEN SHOOTER IO](https://studyquests.github.io/chicken-shooter-io.html)
- [JELLO BUBBLES](https://quizverses.pages.dev/jello-bubbles.html)
- [HIDE MOODENG HIPPO](https://studyquesthub.web.app/hide-moodeng-hippo.html)
- [BACKROOMS AMONG IMPOSTOR ROLLING GIANT](https://studyplaying.github.io/backrooms-among-impostor-rolling-giant.html)
- [CATEGORY CASUAL 6](https://studyquests.github.io/category-casual-6.html)
- [DIY PHONE CASE SHOP](https://studyplaying.github.io/diy-phone-case-shop.html)
- [ZOMBIE OUTBREAK SURVIVE](https://studyquesthub.web.app/zombie-outbreak-survive.html)
- [CATEGORY CASUAL 2](https://studyquests.pages.dev/category-casual-2.html)
- [ARROW WAVE](https://studyplaying.github.io/arrow-wave.html)
- [CELEBRITY FACE DANCE](https://quizverses-9d2f2.web.app/celebrity-face-dance.html)
- [CATEGORY CUTE62](https://studyquests.pages.dev/category-cute62.html)
- [PRACTICE ON ME](https://studyquesthub.web.app/practice-on-me.html)
- [CATEGORY SOCCER](https://studyquesthub.web.app/category-soccer.html)
- [CATEGORY PUZZLE](https://studyquesthub.web.app/category-puzzle.html)
- [BRAIN FIND CAN YOU FIND IT](https://quizverses.github.io/brain-find-can-you-find-it.html)
- [LABUBU COLORING ADVENTURE](https://quizverses.github.io/labubu-coloring-adventure.html)
- [MOLE DIG CLICKER](https://studyquesthub.web.app/mole-dig-clicker.html)
- [OVER THE RAINBOW](https://quizverses.github.io/over-the-rainbow.html)
- [DUSTY MAZE HUNTER](https://studyquesthub.web.app/dusty-maze-hunter.html)
- [FOREST SURVIVOR ROUGELIKE](https://studyquests.pages.dev/forest-survivor-rougelike.html)
- [HEADLEG DASH PARKOUR](https://studyquests.pages.dev/headleg-dash-parkour.html)
- [ROOF CAR STUNT](https://studyplaying.github.io/roof-car-stunt.html)
- [ANIMAL RACING IDLE PARK](https://studyplaying.github.io/animal-racing-idle-park.html)
- [STICKMAN FIGHT PRO](https://quizverses-9d2f2.web.app/stickman-fight-pro.html)
- [ZOMBIE ROYALE IO](https://quizverses.github.io/zombie-royale-io.html)
- [DEAD PARADISE](https://studyquests.pages.dev/dead-paradise.html)
- [KABOOM MINER](https://quizverses-9d2f2.web.app/kaboom-miner.html)
- [SUPER STOCK STACK](https://studyplaying.github.io/super-stock-stack.html)
- [MERGE IN SPACE](https://studyquesthub.web.app/merge-in-space.html)
- [CUBE DROP PUZZLE](https://quizverses-9d2f2.web.app/cube-drop-puzzle.html)
- [CATEGORY DIRT BIKE18](https://studyquests.pages.dev/category-dirt-bike18.html)
- [TOY CARS 3D RACING](https://quizverses-9d2f2.web.app/toy-cars-3d-racing.html)
- [BLOCKAPOLYPSE ZOMBIE SHOOTER](https://studyquesthub.web.app/blockapolypse-zombie-shooter.html)
- [SPRING TILE MASTER](https://studyplaying.github.io/spring-tile-master.html)
- [CATEGORY INCREMENTAL](https://studyquesthub.web.app/category-incremental.html)
- [MY ARCADE CENTER](https://studyquesthub.web.app/my-arcade-center.html)
- [BUBBLE SHOOTER NEON](https://studyquests.github.io/bubble-shooter-neon.html)
- [TRAVEL WITH ME ASMR EDITION](https://quizverses.github.io/travel-with-me-asmr-edition.html)
- [CATEGORY RPG80](https://studyquests.pages.dev/category-rpg80.html)
- [CATEGORY 2D1 070](https://studyquests.pages.dev/category-2d1-070.html)
- [CATEGORY THIRD PERSON SHOOTER80](https://studyquests.pages.dev/category-third-person-shooter80.html)
- [CATEGORY ROBOT49](https://studyquests.github.io/category-robot49.html)
- [PARKING FURY 3D NIGHT CITY](https://quizverses.github.io/parking-fury-3d-night-city.html)
- [TILE PAIR MATCH](https://studyquesthub.web.app/tile-pair-match.html)
- [ANIME COUPLE AVATAR MAKER](https://studyquesthub.web.app/anime-couple-avatar-maker.html)
- [IDLE AIRPORT CEO](https://quizverses-9d2f2.web.app/idle-airport-ceo.html)
- [SPACEFLIGHT SIMULATOR](https://studyquests.pages.dev/spaceflight-simulator.html)
- [FAIRY WINGERELLA](https://studyquests.github.io/fairy-wingerella.html)
- [KAWAII REALM ADVENTURE](https://studyquests.pages.dev/kawaii-realm-adventure.html)
- [PUSH THE COLORS](https://quizverses.github.io/push-the-colors.html)
- [MERGE TIKTOK GRAVITY KNIFE](https://quizverses.github.io/merge-tiktok-gravity-knife.html)
- [IDLE RESTAURANT TYCOON](https://studyquesthub.web.app/idle-restaurant-tycoon.html)
- [JUST DICE RANDOM TOWER DEFENCE](https://studyquesthub.web.app/just-dice-random-tower-defence.html)
- [2048 SNAKEIO](https://studyplaying.github.io/2048-snakeio.html)
- [3D ACRYLIC NAIL NAIL ART GAME](https://studyquesthub.web.app/3d-acrylic-nail-nail-art-game.html)
- [RED STICKMAN VS CRAFTMANS](https://studyplaying.github.io/red-stickman-vs-craftmans.html)
- [FREECELL](https://quizverses-9d2f2.web.app/freecell.html)
- [FRUIT MERGE RELOADED](https://studyquesthub.web.app/fruit-merge-reloaded.html)
- [FALLLING JEWELS](https://quizverses.github.io/fallling-jewels.html)
- [GARAGE MASTER NUTS AND BOLTS](https://studyplaying.github.io/garage-master-nuts-and-bolts.html)
- [OHPEACH IT](https://quizverses.github.io/ohpeach-it.html)
- [MERGE FRUIT](https://quizverses.pages.dev/merge-fruit.html)
- [TUNG TUNG SAHUR COLORING BOOK](https://studyquests.pages.dev/tung-tung-sahur-coloring-book.html)
- [CRAFT DRILL](https://studyquests.github.io/craft-drill.html)
- [TOP HOG](https://studyquests.github.io/top-hog.html)
- [PHOTO BLOCK JOURNEY](https://studyquests.pages.dev/photo-block-journey.html)
- [MURDER CASE CLUE 3D](https://quizverses.github.io/murder-case-clue-3d.html)
- [HOMO EVOLUTION](https://studyquests.github.io/homo-evolution.html)
- [CATEGORY HERO72](https://studyquests.pages.dev/category-hero72.html)
- [MAGIC FINGER](https://studyquests.pages.dev/magic-finger.html)
- [DUNGEON MASTER CULT CRAFT](https://quizverses.github.io/dungeon-master-cult-craft.html)
- [ENERGY CLICKER](https://studyquests.github.io/energy-clicker.html)
- [WORLD WARS TANKS](https://studyquests.github.io/world-wars-tanks.html)
- [BFFS K POP FANGIRLS](https://studyplaying.github.io/bffs-k-pop-fangirls.html)
