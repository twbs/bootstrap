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
- [CUBE STACK 2048](https://themindplay.github.io/cube-stack-2048.html)
- [BLAST CUBES](https://thequizzone.pages.dev/blast-cubes.html)
- [SWIM GOOD](https://iskillquest.pages.dev/swim-good.html)
- [IDLE LANDMARK BUILDER](https://learnquester.github.io/idle-landmark-builder.html)
- [STRIKE IT](https://thelearnquester.web.app/strike-it.html)
- [CATEGORY STORY45](https://studyplaying.github.io/category-story45.html)
- [ICE CREAM INC](https://thelearnquester.web.app/ice-cream-inc.html)
- [CATEGORY PHYSICS371](https://iskillplay.web.app/category-physics371.html)
- [CATEGORY MAHJONG 2](https://themindskillplayplay.pages.dev/category-mahjong-2.html)
- [SUMMER AESTHETICS](https://thelearnquester.web.app/summer-aesthetics.html)
- [DYNAMONS 11](https://themindskillplayplay.pages.dev/dynamons-11.html)
- [CATEGORY QUIZ](https://themindskillplayplay.pages.dev/category-quiz.html)
- [SCREW PUZZLE MASTER](https://thelearnquester.web.app/screw-puzzle-master.html)
- [OBBY 1 PET EVERY SECONDS](https://themindskillplayplay.pages.dev/obby-1-pet-every-seconds.html)
- [MOJICON WINTER CONNECT](https://themindskillplayplay.pages.dev/mojicon-winter-connect.html)
- [ELEVATOR FIGHT](https://thelearnquester.web.app/elevator-fight.html)
- [PETS VS BEES](https://themindskillplayplay.pages.dev/pets-vs-bees.html)
- [SWEET HAUNT 2](https://themindskillplayplay.pages.dev/sweet-haunt-2.html)
- [CATEGORY FLASH](https://studyplaying.github.io/category-flash.html)
- [SUPERPIXELINT](https://theskillquest.pages.dev/superpixelint.html)
- [PUSH TO GO](https://themindzone.pages.dev/push-to-go.html)
- [DRESS PRINCESS](https://quizverses.pages.dev/dress-princess.html)
- [SPIDER ROPE HERO CITY FIGHT](https://thelearnquester.web.app/spider-rope-hero-city-fight.html)
- [OBBY CLIMB RACING](https://themindskillplayplay.pages.dev/obby-climb-racing.html)
- [GEOMETRY WAVE HERO](https://quizverses-9d2f2.web.app/geometry-wave-hero.html)
- [MANYUNYA SAVING THE PRINCESS](https://themindskillplayplay.pages.dev/manyunya-saving-the-princess.html)
- [LIMITED DEFENSE](https://thelearnquester.web.app/limited-defense.html)
- [BFFS SPRING BREAK FASHIONISTA](https://studyplaying.github.io/bffs-spring-break-fashionista.html)
- [LOOPER](https://thelearnquester.web.app/looper.html)
- [CHRISTMAS SORTING](https://thelearnquester.web.app/christmas-sorting.html)
- [BOAT GAME RACING SIMULATOR 3D](https://iskillquest.pages.dev/boat-game-racing-simulator-3d.html)
- [FISH SHOOTING FISH HUNTER](https://skillplay.github.io/fish-shooting-fish-hunter.html)
- [STICK ROPE HERO](https://quizverses.github.io/stick-rope-hero.html)
- [THE OFFICE ESCAPE](https://themindskillplayplay.pages.dev/the-office-escape.html)
- [FILL GLASS](https://themindskillplayplay.pages.dev/fill-glass.html)
- [GETTING OVER IT](https://theskillquest.pages.dev/getting-over-it.html)
- [DRIFTCLICKER](https://thelearnquester.web.app/driftclicker.html)
- [SPRUNKI 3D SHOOTER](https://studyquests.pages.dev/sprunki-3d-shooter.html)
- [ROLLANCE GOING BALLS](https://themindskillplayplay.pages.dev/rollance-going-balls.html)
- [LAST UFO DEFENSE](https://quizverses.github.io/last-ufo-defense.html)
- [100 DOORS CHALLENGE](https://studyplaying.github.io/100-doors-challenge.html)
- [STICKMAN MEGA BOSS BATTLES](https://thelearnquester.web.app/stickman-mega-boss-battles.html)
- [BLOCK BLAST BLOCK PUZZLE MASTER](https://themindskillplayplay.pages.dev/block-blast-block-puzzle-master.html)
- [CATEGORY RACING DRIVING](https://themindskillplayplay.pages.dev/category-racing-driving.html)
- [NOOB RAGDOLL CRAZY PUNCH](https://thelearnquester.web.app/noob-ragdoll-crazy-punch.html)
- [QUBE 2048](https://thelearnquester.web.app/qube-2048.html)
- [INDEX16](https://quizverses.pages.dev/index16.html)
- [SLAP MAN](https://iskillquest.pages.dev/slap-man.html)
- [BRAIN TEST IQ CHALLENGE 2](https://thequizzone.pages.dev/brain-test-iq-challenge-2.html)
- [MR LONG HAND](https://quizverses-9d2f2.web.app/mr-long-hand.html)
- [ARROWTIX TRAIN YOUR BRAIN](https://studyplaying.github.io/arrowtix-train-your-brain.html)
- [BLOXORZ BLOCK PUZZLE 3D](https://iskillquest.pages.dev/bloxorz-block-puzzle-3d.html)
- [ERASE THE EXTRA ELEMENT](https://studyquests.pages.dev/erase-the-extra-element.html)
- [LINK FLOW](https://thelearnquester.web.app/link-flow.html)
- [SUDOKU VAULT](https://quizverses.github.io/sudoku-vault.html)
- [POCKET PARKING](https://studyquests.pages.dev/pocket-parking.html)
- [RUN FRIENDS](https://studyquests.pages.dev/run-friends.html)
- [WIRE CONNECT](https://theskillquest.pages.dev/wire-connect.html)
- [PANDA KITCHEN IDLE TYCOON](https://quizverses.github.io/panda-kitchen-idle-tycoon.html)
- [MAHJONG SOLITAIRE ZODIAC](https://thelearnquester.web.app/mahjong-solitaire-zodiac.html)
- [IDLE MONEY FACTORY](https://themindskillplayplay.pages.dev/idle-money-factory.html)
- [DESIGNVILLE MERGE DESIGN](https://thelearnquester.web.app/designville-merge-design.html)
- [CATEGORY CAR 2](https://thelearnquester.web.app/category-car-2.html)
- [TRAVEL WITH ME ASMR EDITION](https://quizverses.github.io/travel-with-me-asmr-edition.html)
- [EMOJI SORT FUN PUZZLE GAME](https://quizverses.github.io/emoji-sort-fun-puzzle-game.html)
- [HIDDEN OBJECTS ISLAND](https://studyquests.pages.dev/hidden-objects-island.html)
- [LEAP AND AVOID 2](https://skillplay.github.io/leap-and-avoid-2.html)
- [SWIM GOOD](https://quizverses.github.io/swim-good.html)
- [SUDOKU PINGAMES](https://iskillquest.pages.dev/sudoku-pingames.html)
- [PIN PUZZLE LOVE STORY](https://quizverses-9d2f2.web.app/pin-puzzle-love-story.html)
- [LITTLE CANDY BAKERY](https://skillplay.github.io/little-candy-bakery.html)
- [TAXI DRIVER SIMULATOR](https://theskillquest.pages.dev/taxi-driver-simulator.html)
- [PET DOCTOR BUSINESS TYCOON PET CARE GAME](https://iskillquest.pages.dev/pet-doctor-business-tycoon-pet-care-game.html)
- [ULTIMATE ROBO DUEL 3D](https://skillplay.github.io/ultimate-robo-duel-3d.html)
- [CUTE CRAFT LAB](https://studyquests.pages.dev/cute-craft-lab.html)
- [CONSTRUCTION SET 3D BUILDER](https://studyplaying.github.io/construction-set-3d-builder.html)
- [CATEGORY ROBOT49](https://theskillquest.pages.dev/category-robot49.html)
- [BLOCK MERGE CITY](https://thelearnquester.web.app/block-merge-city.html)
- [BILLYTHEBOX](https://thelearnquester.web.app/billythebox.html)
- [CATEGORY GUN238](https://thelearnquester.web.app/category-gun238.html)
- [CATEGORY BATTLE 2](https://theskillquest.pages.dev/category-battle-2.html)
- [CATEGORY BATTLE ROYALE GAMES](https://themindskillplayplay.pages.dev/category-battle-royale-games.html)
- [PUZZLE BLOCKS CLASSIC](https://skillplay.github.io/puzzle-blocks-classic.html)
- [WINTER WOLF](https://thelearnquester.web.app/winter-wolf.html)
- [BUTTERFLY KYODAI DELUXE 2](https://thequizzone.pages.dev/butterfly-kyodai-deluxe-2.html)
- [ANIMAL SORT CUTE PUZZLE GAME](https://theskillquest.pages.dev/animal-sort-cute-puzzle-game.html)
- [AUTHENTIC FOOTBALL](https://quizverses-9d2f2.web.app/authentic-football.html)
- [THRILL ROLLER COASTER](https://thelearnquester.web.app/thrill-roller-coaster.html)
- [CATEGORY MERGE221](https://theskillquest.pages.dev/category-merge221.html)
- [CHICKEN BLAST](https://iskillquest.pages.dev/chicken-blast.html)
- [HALLOWEEN FRUIT SLICE](https://theskillquest.pages.dev/halloween-fruit-slice.html)
- [POP PUZZLE](https://themindskillplayplay.pages.dev/pop-puzzle.html)
- [CATEGORY EDUCATIONAL](https://thelearnquester.web.app/category-educational.html)
- [TILE CONNECT PAIR MATCH PUZZLE](https://studyplaying.github.io/tile-connect-pair-match-puzzle.html)
- [TRIANGLES](https://studyquests.pages.dev/triangles.html)
- [BAD EGG](https://thelearnquester.web.app/bad-egg.html)
- [TRUCK STACK COLORS](https://studyplaying.github.io/truck-stack-colors.html)
- [CRYPTOWORD](https://studyplaying.github.io/cryptoword.html)
- [BONNIE FITNESS FRENZY](https://themindskillplayplay.pages.dev/bonnie-fitness-frenzy.html)
- [CHICKZ STACK](https://studyplaying.github.io/chickz-stack.html)
- [LUCY ALL SEASON FASHIONINSTA](https://thelearnquester.web.app/lucy-all-season-fashioninsta.html)
- [FLOOF MY PET HOUSE](https://iskillquest.pages.dev/floof-my-pet-house.html)
- [BOLTS AND NUTS](https://thelearnquester.web.app/bolts-and-nuts.html)
- [CATEGORY FREE SOLITAIRE GAMES](https://thelearnquester.web.app/category-free-solitaire-games.html)
- [CATEGORY SOCCER 2](https://iskillquest.pages.dev/category-soccer-2.html)
- [CATEGORY DRAWING GAME](https://thelearnquester.web.app/category-drawing-game.html)
- [PIN PUZZLE LOVE STORY](https://theskillquest.pages.dev/pin-puzzle-love-story.html)
- [HAPPY MONSTERS](https://theskillquest.pages.dev/happy-monsters.html)
- [CATEGORY BASKETBALL 3](https://themindskillplayplay.pages.dev/category-basketball-3.html)
- [CS UPGRADE GUN](https://studyplaying.github.io/cs-upgrade-gun.html)
- [POGO MASTERS](https://quizverses-9d2f2.web.app/pogo-masters.html)
- [INDEX8](https://thelearnquester.web.app/index8.html)
- [BEGGAR CLICKER](https://theskillquest.pages.dev/beggar-clicker.html)
- [PUSH THE FROG](https://themindskillplayplay.pages.dev/push-the-frog.html)
- [BUBBLE MATCH MERGE](https://studyplaying.github.io/bubble-match-merge.html)
- [PIMPLE SQUEEZE](https://studyplaying.github.io/pimple-squeeze.html)
- [STICKMAN PRISON AND LOVE](https://skillplay.github.io/stickman-prison-and-love.html)
- [CATEGORY FASHION105](https://thelearnquester.web.app/category-fashion105.html)
- [CATEGORY JUMPING147](https://thelearnquester.web.app/category-jumping147.html)
- [RIDE SHOOTER](https://learnquester.github.io/ride-shooter.html)
- [BATTLE OF PIRATE CARIBBEAN BATTLE](https://theskillquest.pages.dev/battle-of-pirate-caribbean-battle.html)
- [CATEGORY CARE](https://theskillquest.pages.dev/category-care.html)
- [MERGE SHOOTER](https://theskillquest.pages.dev/merge-shooter.html)
- [MURDER STONE AGE](https://thelearnquester.web.app/murder-stone-age.html)
- [CATEGORY BASKETBALL 2](https://themindzone.pages.dev/category-basketball-2.html)
- [CATEGORY MATCH 3](https://quizverses-9d2f2.web.app/category-match-3.html)
- [ROBOTS GONE WILD](https://studyquests.pages.dev/robots-gone-wild.html)
- [CATEGORY CAN T STOP PLAYING212](https://themindskillplayplay.pages.dev/category-can-t-stop-playing212.html)
- [MOLANG MATCHN MUNCH](https://iskillquest.pages.dev/molang-matchn-munch.html)
- [NEW YEARS MIRACLES CONNECT THE BALLS](https://quizverses.github.io/new-years-miracles-connect-the-balls.html)
