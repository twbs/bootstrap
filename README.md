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
- [HARBOR OPERATOR](https://theskillquest.pages.dev/harbor-operator.html)
- [UNDERWATER SURVIVAL](https://studyplaying.github.io/underwater-survival.html)
- [STELLAR MINES SPACE MINER](https://studyquests.github.io/stellar-mines-space-miner.html)
- [HUGGY WUGGY ESCAPE](https://quizverses-9d2f2.web.app/huggy-wuggy-escape.html)
- [CATEGORY CASUAL 6](https://quizverses.github.io/category-casual-6.html)
- [CATEGORY 2D1 070](https://quizverses-9d2f2.web.app/category-2d1-070.html)
- [NINJA TIME](https://studyplaying.github.io/ninja-time.html)
- [LOVIE CHICS SPRING BREAK FASHION](https://studyquests.github.io/lovie-chics-spring-break-fashion.html)
- [COLOR DODGE](https://studyquests.github.io/color-dodge.html)
- [CRAZY BAR BRAWL](https://studyplaying.github.io/crazy-bar-brawl.html)
- [BOXTERIA](https://learnquesters.pages.dev/boxteria.html)
- [PARKOUR BLOCK OBBY](https://quizverses.github.io/parkour-block-obby.html)
- [BLOCK TEAM DEATHMATCH](https://thequizzone.pages.dev/block-team-deathmatch.html)
- [PRINCESS DRESS UP RUN](https://studyquests.pages.dev/princess-dress-up-run.html)
- [STACK UP](https://studyquests.github.io/stack-up.html)
- [ASMR WASHING FIXING](https://studyquests.github.io/asmr-washing-fixing.html)
- [AIR BLOCK](https://thequizzone.pages.dev/air-block.html)
- [HAPPY MONSTERS 2](https://learnquester.pages.dev/happy-monsters-2.html)
- [METAL GUNS FURY](https://studyquests.github.io/metal-guns-fury.html)
- [CATEGORY HORDE SURVIVAL67](https://thequizzone.pages.dev/category-horde-survival67.html)
- [BATTLE ARENA RACE TO WIN](https://studyquesthub.web.app/battle-arena-race-to-win.html)
- [HAPPY FARM THE CROP](https://thelearnquester.web.app/happy-farm-the-crop.html)
- [PLAYGROUND PARKOUR](https://studyplaying.github.io/playground-parkour.html)
- [MERGE 3D MATCH 3 BALLOONS](https://thequizzone.pages.dev/merge-3d-match-3-balloons.html)
- [EAT AND GROW FISH](https://studyquesthub.web.app/eat-and-grow-fish.html)
- [SHELL STRIKERS](https://studyquests.pages.dev/shell-strikers.html)
- [CATEGORY DIRT BIKE](https://studyquests.pages.dev/category-dirt-bike.html)
- [MINI GAMES PUZZLE COLLECTION](https://studyplaying.github.io/mini-games-puzzle-collection.html)
- [PUMPKING VS MUMMY](https://quizverses-9d2f2.web.app/pumpking-vs-mummy.html)
- [CATEGORY MAHJONG 3](https://thequizzone.pages.dev/category-mahjong-3.html)
- [SPRUNKI TORCHES MAZE](https://learnquester.pages.dev/sprunki-torches-maze.html)
- [CATEGORY DRESS UP97](https://studyquests.pages.dev/category-dress-up97.html)
- [SPIDER SOLITAIRE 2 SUITS](https://quizverses.github.io/spider-solitaire-2-suits.html)
- [BLOCOPS](https://studyplaying.github.io/blocops.html)
- [CATEGORY CUTE62](https://studyquests.pages.dev/category-cute62.html)
- [CUBE DROP PUZZLE](https://studyplaying.github.io/cube-drop-puzzle.html)
- [MERGE SQUARES](https://studyquests.pages.dev/merge-squares.html)
- [DRAW TO FISH FIGHT](https://studyquesthub.web.app/draw-to-fish-fight.html)
- [CATEGORY STICKMAN175](https://quizverses-9d2f2.web.app/category-stickman175.html)
- [INDEX16](https://studyquesthub.web.app/index16.html)
- [CATEGORY RPG80](https://quizverses-9d2f2.web.app/category-rpg80.html)
- [CATEGORY MMO25](https://learnquesters.pages.dev/category-mmo25.html)
- [CATEGORY PUZZLE 5](https://quizverses-9d2f2.web.app/category-puzzle-5.html)
- [GRAND CLASH ARENA](https://studyplaying.github.io/grand-clash-arena.html)
- [KAWAII REALM ADVENTURE](https://studyquests.pages.dev/kawaii-realm-adventure.html)
- [PICK BRAINROT 3D BATTLE](https://thequizzone.pages.dev/pick-brainrot-3d-battle.html)
- [DRUNK MAN 3D](https://quizverses.github.io/drunk-man-3d.html)
- [BURGER EMPIRE](https://studyquesthub.web.app/burger-empire.html)
- [MADNESS SHERIFFS COMPOUND OFFICIAL](https://learnquesters.pages.dev/madness-sheriffs-compound-official.html)
- [PINBALL BASKETBALL](https://quizverses.github.io/pinball-basketball.html)
- [BALING BUM](https://thequizzone.pages.dev/baling-bum.html)
- [SOLITAIRE WINTER](https://quizverses.pages.dev/solitaire-winter.html)
- [CATEGORY ESCAPE187](https://learnquesters.pages.dev/category-escape187.html)
- [SAVE BABY CAPYBARAS PULL PIN](https://learnquester.pages.dev/save-baby-capybaras-pull-pin.html)
- [OBBY GYM SIMULATOR ESCAPE](https://thelearnquester.web.app/obby-gym-simulator-escape.html)
- [CATEGORY FLASH](https://learnquesters.pages.dev/category-flash.html)
- [CATEGORY CUTE](https://thequizzone.pages.dev/category-cute.html)
- [TRIPEAKS SOLITAIRE ESCAPES](https://quizverses-9d2f2.web.app/tripeaks-solitaire-escapes.html)
- [CATEGORY RACING DRIVING](https://studyquests.pages.dev/category-racing-driving.html)
- [CATEGORY CASUAL 6](https://quizverses-9d2f2.web.app/category-casual-6.html)
- [FROM NERD TO SCHOOL POPULAR](https://thelearnquester.web.app/from-nerd-to-school-popular.html)
- [CHROME CARS GARAGE](https://learnquesters.pages.dev/chrome-cars-garage.html)
- [RUNNING IN FOAM](https://studyplaying.github.io/running-in-foam.html)
- [HARVESTING VEGGIES](https://quizverses.github.io/harvesting-veggies.html)
- [BUS PARKING OUT](https://quizverses.github.io/bus-parking-out.html)
- [GEOMETRY DASH MAZE MAPS](https://studyplaying.github.io/geometry-dash-maze-maps.html)
- [MERGE BEASTS](https://thequizzone.pages.dev/merge-beasts.html)
- [CATEGORY SIMULATION](https://studyplaying.github.io/category-simulation.html)
- [TRIPLE CUPS](https://learnquesters.pages.dev/triple-cups.html)
- [SPIDER SOLITAIRE 2 SUITS](https://learnquester.pages.dev/spider-solitaire-2-suits.html)
- [STICKMAN MINERS WARS](https://learnquester.pages.dev/stickman-miners-wars.html)
- [CRAZY AXE](https://quizverses.github.io/crazy-axe.html)
- [CATEGORY BUBBLE SHOOTER](https://thequizzone.pages.dev/category-bubble-shooter.html)
- [BFFS Y2K FASHION](https://quizverses-9d2f2.web.app/bffs-y2k-fashion.html)
- [FISHING THE RUSSIAN WAY](https://quizverses-9d2f2.web.app/fishing-the-russian-way.html)
- [NUMBER TRICKY PUZZLES](https://studyplaying.github.io/number-tricky-puzzles.html)
- [CATEGORY GOGUARDIAN](https://thequizzone.pages.dev/category-goguardian.html)
- [STICKMAN THE FLASH](https://studyquesthub.web.app/stickman-the-flash.html)
- [LIFE CLICKER](https://thequizzone.pages.dev/life-clicker.html)
- [DEADLOCKIO](https://quizverses.github.io/deadlockio.html)
- [OBBY GYM SIMULATOR ESCAPE](https://studyquesthub.web.app/obby-gym-simulator-escape.html)
- [CATEGORY QUIZ](https://thequizzone.pages.dev/category-quiz.html)
- [UNSTACK TOWER](https://learnquester.pages.dev/unstack-tower.html)
- [CATEGORY COLLECT565](https://quizverses-9d2f2.web.app/category-collect565.html)
- [GOLF ORBIT](https://learnquesters.pages.dev/golf-orbit.html)
- [DARING JACK](https://studyplaying.github.io/daring-jack.html)
- [BLOCK BLASTER PUZZLE](https://thequizzone.pages.dev/block-blaster-puzzle.html)
- [FARM MAHJONG 3D](https://studyquests.pages.dev/farm-mahjong-3d.html)
- [FASHION CHALLENGE CATWALK RUN](https://learnquesters.pages.dev/fashion-challenge-catwalk-run.html)
- [ART PUZZLE MASTER](https://studyplaying.github.io/art-puzzle-master.html)
- [GRANDMA RECIPE RAMEN](https://quizverses-9d2f2.web.app/grandma-recipe-ramen.html)
- [CATEGORY BRAIN260](https://thequizzone.pages.dev/category-brain260.html)
- [CATEGORY BUILDING179](https://thequizzone.pages.dev/category-building179.html)
- [DADDY RABBIT](https://thequizzone.pages.dev/daddy-rabbit.html)
- [HAPPY JUMP](https://thequizzone.pages.dev/happy-jump.html)
- [MONSTER DASH](https://studyplayings.web.app/monster-dash.html)
- [WATER SORT PUZZLE 3](https://thequizzone.pages.dev/water-sort-puzzle-3.html)
- [BUTTERFLY SORT PUZZLE](https://learnquester.pages.dev/butterfly-sort-puzzle.html)
- [FIND THE FROG HIDDEN OBJECTS](https://thequizzone.pages.dev/find-the-frog-hidden-objects.html)
- [CATEGORY HORROR](https://studyquests.pages.dev/category-horror.html)
- [TERMS](https://quizverses-9d2f2.web.app/terms.html)
- [MART PUZZLE SHOPPING SORT](https://quizverses.github.io/mart-puzzle-shopping-sort.html)
- [BLOSSOM](https://quizverses.pages.dev/blossom.html)
- [CATEGORY SHOOTER 2](https://thequizzone.pages.dev/category-shooter-2.html)
- [CLAY CRAFT TYCOON](https://studyplayings.web.app/clay-craft-tycoon.html)
- [TINY FIGHTER UNSTOPPABLE RUN](https://learnquester.pages.dev/tiny-fighter-unstoppable-run.html)
- [VORTEX BALL](https://thelearnquester.web.app/vortex-ball.html)
- [CATEGORY PUZZLE 12](https://thequizzone.pages.dev/category-puzzle-12.html)
- [PANDA RESTAURANT](https://studyplayings.web.app/panda-restaurant.html)
- [CATEGORY BATTLE](https://quizverses.github.io/category-battle.html)
- [TRUE LOVE CALCULATOR NZW](https://thelearnquester.web.app/true-love-calculator-nzw.html)
- [CATEGORY IDLE448](https://studyquests.pages.dev/category-idle448.html)
- [BLOCK BLAST JEWEL PUZZLE](https://studyquesthub.web.app/block-blast-jewel-puzzle.html)
- [SUMMER AESTHETICS](https://studyplayings.pages.dev/summer-aesthetics.html)
- [COLOR NONOGRAM PUZZLE](https://learnquester.pages.dev/color-nonogram-puzzle.html)
- [WHEEL OF BINGO](https://learnquesters.pages.dev/wheel-of-bingo.html)
- [MAGIC SORT](https://quizverses.github.io/magic-sort.html)
- [CATEGORY BASKETBALL 2](https://learnquesters.pages.dev/category-basketball-2.html)
- [CATEGORY BIKE](https://learnquesters.pages.dev/category-bike.html)
- [CATEGORY BASKETBALL32](https://thequizzone.pages.dev/category-basketball32.html)
- [PYRAMIDZ](https://thequizzone.pages.dev/pyramidz.html)
- [MONEY FACTORY TYCOON IDLE GAME](https://thequizzone.pages.dev/money-factory-tycoon-idle-game.html)
- [ROYAL BUBBLE BLAST](https://studyquesthub.web.app/royal-bubble-blast.html)
- [CATEGORY DESTROY](https://thequizzone.pages.dev/category-destroy.html)
- [THE FLOWERS MERGE AND SELL BOUQUETS](https://thequizzone.pages.dev/the-flowers-merge-and-sell-bouquets.html)
- [BUS DRIVER SIMULATOR 3D](https://quizverses.pages.dev/bus-driver-simulator-3d.html)
- [CUBE KING](https://studyquesthub.web.app/cube-king.html)
- [8 BALL POOL BILLIARDS MULTIPLAYER](https://studyplayings.web.app/8-ball-pool-billiards-multiplayer.html)
- [FALLLING JEWELS](https://quizverses.github.io/fallling-jewels.html)
- [MUSIC CAT PIANO TILES GAME 3D](https://thequizzone.pages.dev/music-cat-piano-tiles-game-3d.html)
