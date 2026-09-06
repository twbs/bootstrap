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
- [MINEBLOCKS 3D MAZE](https://themindzone.pages.dev/mineblocks-3d-maze.html)
- [ROYAL JEWELS MATCH](https://studyquests.pages.dev/royal-jewels-match.html)
- [CATEGORY SURVIVAL366](https://studyquesthub.web.app/category-survival366.html)
- [STACK UP](https://studyquests.github.io/stack-up.html)
- [SEA LORDS](https://thelearnquesters.pages.dev/sea-lords.html)
- [NEKOS ADVENTURE](https://studyplayings.web.app/nekos-adventure.html)
- [REACH 2048](https://studyquests.github.io/reach-2048.html)
- [HILL CLIMBING MANIA](https://learnquester.github.io/hill-climbing-mania.html)
- [PHANTOM THIEF CAT RUNNING](https://learnquester.github.io/phantom-thief-cat-running.html)
- [CATEGORY CASUAL 8](https://studyplayings.pages.dev/category-casual-8.html)
- [CATEGORY MINECRAFT](https://learnquester.github.io/category-minecraft.html)
- [WORD ART COLOR BOOK PUZZLE](https://studyquests.github.io/word-art-color-book-puzzle.html)
- [BELOTE 3IN1](https://studyquests.github.io/belote-3in1.html)
- [DELTA FORCE AIRBORNE](https://thelearnquester.web.app/delta-force-airborne.html)
- [MAGIC PIANO MUSIC](https://studyquests.github.io/magic-piano-music.html)
- [ZOMBIE FRONTIER SHOOTER](https://studyquests.github.io/zombie-frontier-shooter.html)
- [DRAW TO SMASH](https://studyplayings.pages.dev/draw-to-smash.html)
- [CHRISTMAS BLIND BOX](https://studyquests.github.io/christmas-blind-box.html)
- [LITTLE COMMANDER RED VS BLUE](https://studyquests.github.io/little-commander-red-vs-blue.html)
- [CATEGORY MERGE GAME](https://thelearnquester.web.app/category-merge-game.html)
- [GLACIER RUSH](https://studyquests.github.io/glacier-rush.html)
- [LAST PLAY RAGDOLL SANDBOX KQB](https://studyplayings.web.app/last-play-ragdoll-sandbox-kqb.html)
- [CYBER ROLLING GOING BALL 3D](https://learnquester.github.io/cyber-rolling-going-ball-3d.html)
- [MAFIA ROULETTE](https://studyplayings.web.app/mafia-roulette.html)
- [GAS STATION JUNKYARD TYCOON](https://studyquests.github.io/gas-station-junkyard-tycoon.html)
- [HAMMER MASTERCRAFT DESTROY](https://studyquests.github.io/hammer-mastercraft-destroy.html)
- [BRAINROT WORLD HOLEIO](https://studyquests.github.io/brainrot-world-holeio.html)
- [CRAZY FRUIT MERGE](https://thelearnquester.web.app/crazy-fruit-merge.html)
- [SNOW ROAD PUZZLE](https://studyquests.github.io/snow-road-puzzle.html)
- [CATEGORY RACING DRIVING 2](https://thelearnquester.web.app/category-racing-driving-2.html)
- [CUNNING GINGER](https://studyquests.pages.dev/cunning-ginger.html)
- [CANDY SMASH](https://studyplaying.github.io/candy-smash.html)
- [SEAFARING MEMORY CHALLENGE](https://thelearnquester.web.app/seafaring-memory-challenge.html)
- [BASE JUMP WINGSUIT FLYING](https://studyquests.pages.dev/base-jump-wingsuit-flying.html)
- [SOLITAIRE SUMMER KLONDIKE](https://studyquests.github.io/solitaire-summer-klondike.html)
- [WARCALL IO](https://studyplayings.web.app/warcall-io.html)
- [CATEGORY SOCCER60](https://thelearnquester.web.app/category-soccer60.html)
- [CATEGORY TOWER DEFENSE](https://thelearnquester.web.app/category-tower-defense.html)
- [DOP PUZZLE ERASE MASTER](https://studyquests.github.io/dop-puzzle-erase-master.html)
- [DRAW BRIDGE CHALLENGE](https://studyquests.github.io/draw-bridge-challenge.html)
- [MUSKETEERS GUNPOWDER VS STEEL](https://studyquests.github.io/musketeers-gunpowder-vs-steel.html)
- [GARTEN OF BANBAN 1 ESCAPE](https://learnquester.github.io/garten-of-banban-1-escape.html)
- [PLUG MAN RACE](https://studyquests.github.io/plug-man-race.html)
- [WOOD BLOCKS JAM](https://studyplaying.github.io/wood-blocks-jam.html)
- [CATEGORY ART](https://studyplayings.web.app/category-art.html)
- [ANGRY PLANTS FLOWER](https://studyplaying.github.io/angry-plants-flower.html)
- [SAMURAI LEGACY](https://studyquests.github.io/samurai-legacy.html)
- [MR DRIFTER CAR CHASE SIMULATOR](https://studyplayings.pages.dev/mr-drifter-car-chase-simulator.html)
- [TURNFIGHT COM UAP](https://studyplayings.web.app/turnfight-com-uap.html)
- [LIMOUSINE CAR GAME SIMULATOR](https://thelearnquester.web.app/limousine-car-game-simulator.html)
- [CATEGORY FPS GAMES](https://studyplayings.web.app/category-fps-games.html)
- [SOFT GIRLS WINTER AESTHETICS](https://studyplaying.github.io/soft-girls-winter-aesthetics.html)
- [CATEGORY SCHOOL](https://thelearnquester.web.app/category-school.html)
- [FASHION BATTLE FOR SURVIVAL](https://studyquests.github.io/fashion-battle-for-survival.html)
- [FNF 2 PLAYER](https://thelearnquester.web.app/fnf-2-player.html)
- [GRANNY PILLS DEFEND CACTUSES](https://studyplaying.github.io/granny-pills-defend-cactuses.html)
- [CATEGORY RACING DRIVING](https://thelearnquester.web.app/category-racing-driving.html)
- [TOILET PIN](https://studyplayings.web.app/toilet-pin.html)
- [BUSY BEE HIVE](https://studyplaying.github.io/busy-bee-hive.html)
- [COLOR NUTS BOLTS PUZZLE](https://studyquests.github.io/color-nuts-bolts-puzzle.html)
- [POTION MERGE WITCH](https://learnquester.github.io/potion-merge-witch.html)
- [TARCAT](https://studyplayings.pages.dev/tarcat.html)
- [BOUNCING CHICK](https://thelearnquester.web.app/bouncing-chick.html)
- [CATEGORY FASHION105](https://studyquests.pages.dev/category-fashion105.html)
- [CATEGORY PUZZLE 6](https://studyplayings.web.app/category-puzzle-6.html)
- [FREECELL](https://learnquester.github.io/freecell.html)
- [CAT PANCAKE DINER](https://learnquester.pages.dev/cat-pancake-diner.html)
- [ICE FISHING 3D](https://studyplaying.github.io/ice-fishing-3d.html)
- [CAT VS GRANNY CAT SIMULATOR](https://learnquester.pages.dev/cat-vs-granny-cat-simulator.html)
- [MANYUNYA SAVING THE PRINCESS](https://theskillquest.pages.dev/manyunya-saving-the-princess.html)
- [AGENT ZERO INFILTRATION](https://themindplay.pages.dev/agent-zero-infiltration.html)
- [WORD OF FORTUNE](https://themindzone.pages.dev/word-of-fortune.html)
- [FIND THE GHOST CAT](https://learnquester.github.io/find-the-ghost-cat.html)
- [CATEGORY QUIZ](https://themindplay.pages.dev/category-quiz.html)
- [SPIDER EVOLUTION](https://studyplayings.web.app/spider-evolution.html)
- [AUTUMN GLAM GALA](https://studyplayings.pages.dev/autumn-glam-gala.html)
- [CATEGORY MOBILE2 095](https://themindplaying.web.app/category-mobile2-095.html)
- [STRAWBERRY SHORTCAKE](https://studyplayings.web.app/strawberry-shortcake.html)
- [PARIS KISS](https://studyplaying.github.io/paris-kiss.html)
- [GUN RACING](https://studyquests.github.io/gun-racing.html)
- [POP THE BUBBLE](https://studyquests.github.io/pop-the-bubble.html)
- [INDEX18](https://learnquester.pages.dev/index18.html)
- [STICKMAN DUO ESCAPE THE TOMB](https://themindplay.pages.dev/stickman-duo-escape-the-tomb.html)
- [LAZY WORKERS](https://studyquests.pages.dev/lazy-workers.html)
- [GIN RUMMY](https://studyplayings.web.app/gin-rummy.html)
- [POOL MASTER](https://thequizzone.pages.dev/pool-master.html)
- [TENNIS MASTERS 2026](https://themindplay.pages.dev/tennis-masters-2026.html)
- [LAST UFO DEFENSE](https://themindplay.pages.dev/last-ufo-defense.html)
- [SKYDOM](https://studyquests.github.io/skydom.html)
- [BLOX FRUITS](https://themindplay.pages.dev/blox-fruits.html)
- [COLOR DASH](https://learnquester.github.io/color-dash.html)
- [TOY CARS 3D RACING](https://learnquesters.pages.dev/toy-cars-3d-racing.html)
- [ASTRAL ESCAPE](https://learnquesters.pages.dev/astral-escape.html)
- [TOWER STACK 2026](https://studyplayings.web.app/tower-stack-2026.html)
- [IDLE FIREFIGHTER 3D](https://studyquests.github.io/idle-firefighter-3d.html)
- [RELAXING CUBES AND CAMPFIRE](https://studyquests.pages.dev/relaxing-cubes-and-campfire.html)
- [TILEMAN IO](https://studyplaying.github.io/tileman-io.html)
- [PATTERNS](https://themindplays.pages.dev/patterns.html)
- [HEROES OF THE ARENA](https://studyquests.github.io/heroes-of-the-arena.html)
- [CATEGORY FLASH](https://studyplayings.web.app/category-flash.html)
- [MAIDO](https://learnquesters.pages.dev/maido.html)
- [FAR ORION NEW WORLDS](https://learnquester.github.io/far-orion-new-worlds.html)
- [BLOCKS AND THATS IT](https://iskillquest.pages.dev/blocks-and-thats-it.html)
- [SPRUNKI MEMORY CARD MATCH](https://themindplay.pages.dev/sprunki-memory-card-match.html)
- [CATEGORY CAR376](https://themindzone.pages.dev/category-car376.html)
- [XYTRIAN RUNNER](https://learnquesters.pages.dev/xytrian-runner.html)
- [KNOCKOUT DUDES](https://iskillquest.pages.dev/knockout-dudes.html)
- [CHILL CLICKER](https://themindzone.pages.dev/chill-clicker.html)
- [OFFROAD JEEP GAME SIMULATOR](https://studyplayings.pages.dev/offroad-jeep-game-simulator.html)
- [LAMBO TRAFFIC RACER](https://studyquests.github.io/lambo-traffic-racer.html)
- [STICKMAN RESCUE DRAW 2 SAVE](https://themindplay.github.io/stickman-rescue-draw-2-save.html)
- [JUNGLE MATCH ADVENTURES](https://themindzone.pages.dev/jungle-match-adventures.html)
- [WIPE INSIGHT MASTER](https://studyquests.pages.dev/wipe-insight-master.html)
- [SPIN THRU](https://themindplay.pages.dev/spin-thru.html)
- [CATEGORY UNBLOCK](https://learnquester.pages.dev/category-unblock.html)
- [ANIMAL RACING IDLE PARK](https://learnquesters.pages.dev/animal-racing-idle-park.html)
- [2020 CONNECT](https://learnquester.github.io/2020-connect.html)
- [CATEGORY FASHION105](https://themindzone.pages.dev/category-fashion105.html)
- [BALL AND GIRLFRIEND](https://thequizzone.pages.dev/ball-and-girlfriend.html)
- [POGO MASTERS](https://iskillquest.pages.dev/pogo-masters.html)
- [OBBY WITH FRIENDS DRAW AND JUMP](https://themindplays.pages.dev/obby-with-friends-draw-and-jump.html)
- [DRIVE RACE CRASH](https://learnquester.pages.dev/drive-race-crash.html)
- [PIRATE PARADISE](https://themindplays.pages.dev/pirate-paradise.html)
- [POLYGON SPACE](https://iskillquest.pages.dev/polygon-space.html)
- [CANNON BLAST THE LAST STAND](https://studyquests.github.io/cannon-blast-the-last-stand.html)
- [CATEGORY BATTLE ROYALE25](https://iskillquest.pages.dev/category-battle-royale25.html)
- [MOTO STUNTS DRIVING RACING](https://themindplays.pages.dev/moto-stunts-driving-racing.html)
- [SPACE CRAFT SHIP WAR](https://studyplaying.github.io/space-craft-ship-war.html)
- [DOLPHIN COUPLE UNDERWATER DRESS UP](https://themindplay.pages.dev/dolphin-couple-underwater-dress-up.html)
- [ICE CUBE](https://thequizzone.pages.dev/ice-cube.html)
