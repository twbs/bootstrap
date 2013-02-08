## 2.3.0 (February 7, 2013)

Minor release to add carousel indicators, improve tooltips, improve dev setup, and fix hella bugs.

- **Repository changes:**
  - **Local instead of global dependencies** for our makefile and install process. Now getting started is way easier—just run `npm install`.
  - Upgraded to jQuery 1.9. No changes were needed, but we did upgrade the included jQuery file to the latest release.
  - Moved changelog to be within the repo instead of as a wiki page.
- **New and improved features:**
  - **Added carousel indicators!** Add the HTML and it automagically works.
  - **Added `container` option to tooltips.** The default option is still `insertAfter`, but now you may specify where to insert tooltips (and by extension, popovers) with the optional container parameter.
  - Improved popovers now utilize `max-width` instead of `width`, have been widened from 240px to 280px, and will automatically hide the title if one has not been set via CSS `:empty` selector.
  - Improved tooltip alignment on edges with [#6713](https://github.com/twitter/bootstrap/pull/6713).
  - **Improved accessibility for links in all components.** After merging [#6441](https://github.com/twitter/bootstrap/pull/6441), link hover states now apply to the `:focus` state as well. This goes for basic `<a>` tags, as well as buttons, navs, dropdowns, and more.
  - Added print utility classes to show and hide content between `screen` and `print` via CSS.
  - Updated input groups to make them behave more like default form controls. Added `display: inline-block;`, increased `margin-bottom`, and added `vertical-align: middle;`  to match `<input>` styles.
  - Added `.horizontal-three-colors()` gradient mixin (with example in the CSS tests file).
  - Added `.text-left`, `.text-center`, and `.text-right` utility classes for easy typographic alignment.
  - Added `@ms-viewport` so IE10 can use responsive CSS when in split-screen mode.
- **Docs changes:**
  - Added [new justified navigation example](https://f.cloud.github.com/assets/98681/25869/5e2f812c-4afa-11e2-9293-501cd689232d.png).
  - Added sticky footer with fixed navbar example.

See more on the [2.3.0 pull request](https://github.com/twitter/bootstrap/pull/6346).


## 2.2.2 (December 8, 2012)

Bugfix release addressing docs, CSS, and some JavaScript issues. Key changes include:

- **Docs:**
  - Assets (illustrations and examples) are now retina-ready.
  - Replaced [Placehold.it](http://placehold.it) with [Holder.js](http://imsky.github.com/holder/), a client-side and retina-ready placeholder image tool.
- **Dropdowns:** Temporary fix added for dropdowns on mobile to prevent them from closing early.
- **Popovers:**
  - No longer inherits `font-size: 0;` when placed in button groups.
  - Arrows refactored to work in IE8, and use less code.
  - Plugin no longer inserts popover content into a `<p>`, but rather directly into `.popover-content`.
- **Labels and badges:** Now [automatically collapse](https://github.com/twitter/bootstrap/commit/ead5dbeba5cd7acfa560bfb353f5e7c4f4a19256) if they have no content.
- **Tables:** Nesting support with `.table-bordered` and `.table-striped` greatly improved.
- **Typeahead:**
  - Now [inserts dropdown menu after the input](https://github.com/twitter/bootstrap/commit/1747caf19d59cad7fdc90ae56a00e0e2849f95f4) instead of at the close of the document.
  - Hitting escape will place focus back on the `<input>`.
- Print styles, from HTML5 Boilerplate, have been added.

See more on the [2.2.2 milestone](https://github.com/twitter/bootstrap/issues?milestone=17&state=closed).


## 2.2.1 (October 30, 2012)

Hotfix release to address the carousel bug reports.


## 2.2.0 (October 29, 2012)

### tl;dr

2.1.2 is now 2.2.0: four new example templates, added media component, new typographic scale, fixed that box-shadow mixin bug, fixed z-index issues, and [more](https://github.com/twitter/bootstrap/issues?milestone=15&page=1&state=closed).

### Highlights

- **Added four new example templates** to the docs, including a narrow marketing page, sign in form, sticky footer, and a fancy carousel (created for an upcoming .net magazine article).
- **Added the media component**, to create larger common components like comments, Tweets, etc.
- **New variable-driven typographic scale** based on `@baseFontSize` and `@baseLineHeight`.
- Revamped mini, small, and large padding via new variables for inputs and buttons so everything is the same size.
- Reverted 2.1.1's `.box-shadow();` mixin change that caused compiler errors.
- Improved dropdown submenus to support dropups and left-aligned submenus.
- Fixed z-index issues with tooltips and popovers in modals.
- Hero unit now sets basic type styles for the entire component, rather than on `.hero-unit p { ... }`.
- Updated JavaScript plugins and docs to jQuery 1.8.1.
- Added Contributing.md file.
- Added support for installing Bootstrap via [Bower](http://twitter.github.com/bower).
- Miscellaneous variable improvements across the board.
- Miscellaneous documentation typos fixed.

For the full list of issues included in this release, visit the [2.2.0 milestone on GitHub](https://github.com/twitter/bootstrap/issues?milestone=15&page=1&state=closed)



## 2.1.1 (September 4, 2012)

* New feature: alert text. We documented these new classes, like `.text-success`, at the bottom of the [Typography section](http://twitter.github.com/bootstrap/base-css.html#typography) along with the long undocumented `.muted`.
* Fixed a lot of typos in the docs. Spelling is hard.
* Made the `.box-shadow()` mixin more durable. It no longer requires escaping for multiple shadows, meaning you can easily use variables and functions in them once again.
* Widened `.dl-horizontal dt` and `.horizontal-form .control-group` to better handle the increased font-size.
* Dropdown submenus improved: now you only see the next level, not all levels, on hover of the submenu toggle.
* Clarified jQuery and Bootstrap template requirements in Getting Started section.
* `select` now utilizes `@inputBorder`.
* `.lead` now scales up from `@baseFontSize` instead of being a fixed font-size and line-height.
* Fixed the vertical three color gradient in latest Firefox.
* Reordered some variables that caused errors in certain Less compilers.

View all closed issues on the [2.1.1 milestone](https://github.com/twitter/bootstrap/issues?milestone=14&state=closed).


## 2.1.0 (August 20, 2012)

### Key changes

* Submenu support on dropdowns
* Affix JavaScript plugin
* Block level buttons
* State classes on table rows
* Improved disabled states on navs and dropdowns
* The navbar component is now white by default, with an optional class to darken it
* Improved prepended and appended inputs
* New base font-size and line-height
* Added variable for navbar collapse trigger point
* Fluid grid offsets
* Fluid grid system variables are no longer fixed percentages
* Removed LESS docs page

For full set of changes, see the completed milestone: https://github.com/twitter/bootstrap/issues?milestone=7&page=1&state=closed

## 2.0.4 (June 1, 2012)


### Docs

- Added `type="button"` to all dismiss buttons in alerts and modals  to avoid a bug in which they prevent their parent's `form` from properly submitting.
- Added simple documentation to Base CSS for `.lead`.
- Added new CSS test to illustrate how the navbar, static and fixed, behaves.
- Clarified grid sizing copy to include mention of responsive variations.
- Reformatted the LESS docs page to prevent terrible table displays at smaller grid sizes.
- Miscellaneous typos and tweaks.

### CSS

- Refactored forms.less to make our selectors more specific for fewer overrides and less code. Instead of a generic `input` selector and various resets, we target each type of input like `input[type="text"]`, `input[type="password"]`, etc.
- Form field state (e.g., success or error) now applies to checkbox and radio labels.
- Removed redundant CSS on `<p>` for `font-family`, `font-size`, and `line-height`.
- Removed redundant `color` declaration from the `<label>` element.
- Added variables for dropdown dividers border colors.
- `legend` and `.form-actions` share the same `border-color`, `#e5e5e5`.
- Fixed some responsive issues with input-prepend and -append, notably with the fluid grid.
- Added special CSS to prevent `max-width: 100%;` on images from messing up Google Maps rendering.
- Scope opened dropdowns to only immediate children to avoid unintended cascade.
- Similarly, scope floated-right dropdowns to immediate children with `.pull-right > .dropdown-menu`.
- Updated `.placeholder()` mixin to use `&` operator in Less for proper output when compiling.
- Added `-ms-input-placeholder` to `.placeholder()` mixin.
- Added CSS3 hyphens mixin.
- Fixed a bug in IE7/8 where certain form controls would not show text if the parent had a filter opacity set.


## 2.0.3 (April 24, 2012)

Running makefile now require JSHint and Recess.

### HTML and CSS

- Overhauled the responsive utility classes to simplify required CSS, add `!important` to all declarations, and use `display: inherit` in place of `display: block` to account for different types of elements.
- Removed `>` from fluid grid column selectors, meaning every element with a `.span*` class within a `.row-fluid` will use percentage widths instead of fixed-pixels.
- Fixed regression in responsive images support as of 2.0.1. We've re-added `max-width: 100%;` to images by default. We removed it in our last release since we had folks complaining about Google Maps integration and other projects, but we're taking a different stance now on these things and will require developers to make these tweaks on their end.
- Added variable `@navbarBrandColor` for the brand element in navbars, which defaults to `@navbarLinkColor`.
- Font-family mixins now use variables for their stacks.
- Fixed an unescaped `filter` on the `.reset-filter()` mixin that was causing some errors depending on your compiler.
- Fixed regression in `.form-actions` background, which was too dark, by adding a new variable `@formActionsBackground` and changing the color to `#f5f5f5` instead of `#eee`.
- Fixed an issue on button group dropdowns where the background color was not using the button's darker color when the dropdown is open.
- Generalized and simplified the open dropdown classes while adding smarter defaults. Instead of `.dropdown.open`, we now use just `.open`. On the defaults side, all dropdown menus now have rounded corners to start.
- Improved active `.dropdown-toggle` styles (for dropdown buttons) by darkening the background and sharpening the inset shadow to match the active state of buttons.
- Direction of animation on progress bars reversed.
- Fixed input-prepend/append issue with uneditable inputs: `.uneditable-input` was being floated and a missing comma meant its `border-radius` for the append option wasn't being applied properly.
- Removed `height: auto;` from `img` since it was overriding dimensions set via HTML attributes.
- Fixed an issue of double borders on the top of tables with captions or colgroups.
- Fixed issue with anchor buttons in the `.navbar-text`. Instead of a general styling on all anchors within an element with that class, we now have a new class to specifically apply appropriate link color.
- Added support for `@navbarHeight` on the brand/project name and nav links for complete navbar height customization.
- Fixed the black borders on buttons problem in IE7 by removing the border, increasing the line-height, and providing darker background colors.
- Removed excess padding on `.search-query` inputs in IE7 since it doesn't have border-radius.
- Updated alert messages in Components to use `button` elements as close icons instead of `a`. Both can be used, but an `a` will require `href="#"` for dismissal on iOS devices.
- Fixed an issue with prepended/appended inputs in Firefox where `select` elements required two clicks to toggle the dropdown. Resolved by moving the `position: relative` to the `select` by default instead of on `:focus`.
- Added a new mixin, `.backface-visibility`, to help refine CSS 3D tranforms. Examples and explanation of usage can be found on [CSS Tricks](http://css-tricks.com/almanac/properties/b/backface-visibility/).
- Changed specificity of grid classes in responsive layouts under 767px to accurately target `input`, `select`, and `textarea` elements that use `.span*` classes.
- Horizontal description lists, `.dl-horizontal`, now truncate terms that are too long to fit in their fixed-width column. In the < 767px responsive layout, they change to their default stacked layout.
- Changed tabbable tabs to prevent issues in left and right aligned tabs. `.tab-content` would not growing to its parent's full width due to `display: table`. We removed that and the `width: 100%` and instead just set `overflow: auto` to clear the left and right aligned tabs.
- Updated thumbnails to support fluid grid column sizing.
- Added `>` to most of the button group selectors
- Added new variable, `@inputBorderRadius`, to all form controls that previously made use of the static `3px` value everywhere.
- Changed the way we do `border-radius` for tables. Instead of the regular mixin that zeros out all other corners, we specify one corner only so they can be combined for use on single column table headers.
- Updated Glyphicons Halflings from 1.5 to 1.6, introducing 20 new icons.
- Added an `offset` paramater to the `.makeColumn`.
- Increased the specificity of all tabbable nav selectors to include `.nav-collapse` to appropriately scope the responsive navbar behavior.
- Fixed uneditable inputs: text now cuts off and does not wrap, making it behave just like a default `input`.
- Labels and badges are now `vertical-align: baseline;` so they line up with surrounding text.

### Javascript

- Add jshint support
- Add travis-ci support w/ headless phantom integration
- Replace UA sniffing in bootstrap-transitions.js
- Add MSTransitionEnd event to transition plugin
- Fix pause method in carousel (shouldn't restart when hovering over controls)
- Fix crazy opera bug #1776
- Don't open dropdown if target element is disabled
- Always select last item in scrollspy if you've reached the bottom of the document or element
- Typeahead should escape regexp special chars
- If interval is false on carousel, do not auto-cycle
- Add preventDefault support for all initial event types (show, close, hide, etc.)
- Fix collapse bug in ie7+ for initial collapse in
- Fix nested collapse bug
- If transitioning collapse, don't start new transition
- Try to autodetect when to use html/text method in tooltip/popovers to help prevent xss
- Add bootstrap + bootstrap.min.js to gh-pages for @remy and jsbin support

### Documentation and repo

- Combined badges and labels into a single LESS file, labels-badges.less, to reduce repeated CSS.
- Separated responsive features into multiple files. We now have a file for each grouping of media queries (tablets and down, tablets to desktops, and large desktops). Additionally, the visible/hidden utility classes and the responsive navbar are in their own files. The output is the same in the compiled CSS, but this should give folks a bit more flexibility.
- Added a new CSS Tests page in the docs (not in the top nav) for better testing of edge cases and extending the use of standard components.
- Removed the bootstrap.zip file from the repo and the make process for faster building and a lighter repo. From now on, the zip will only be in the documentation branch.
- Fixed incorrect use of class instead of ID for tabs example and added documentation for multiple ways of toggling tabs.
- Fixed required markup listed for the specialized navbar search field.
- Removed all mention of `@siteWidth`, a variable no longer in use.
- Removed mentions of unused `@buttonPrimaryBackground` variable, which is no longer in use.
- Updated LESS docs page to include all the new variables we added in previous releases.
- Removed broken "dropup" menus from tabs and pills examples (shouldn't have been there in the first place).
- Replaced `.badge-error` with `.badge-important`. The error option is not a valid class and was a typo in the docs.
- Fixed mention of how to add plain text to the navbar. Previously the docs stated you only needed a `p` tag, but the required HTML is any element with class `.navbar-text`.
- Clarified the use of `.tabbable` for tabs. The wrapping class is only required for left and right tabs to clear their floats. Also added mention of `.fade` to fade in tabs.
- Updated forms documentation:
  - Remove unnecessary duplicate help text in first example
  - Added mention of required `input` class, `.search-query`, for the search form variation
  - Removed incorrect mention of form fields being `display: block;` to start as fields are `inline-block` to start.
- Added mention of `data-target` attribute for the dropdowns javascript plugin to show how to keep custom URLs intact on links with `.dropdown-toggle` class.
- Updated the Kippt screenshot on the homepage to reflect their recent responsive redesign and upgrade to 2.0.2.


## 2.0.2 (March 12, 2012)

Overview of docs changes, bugfixes, and new features.

### Documentation updates

- All docs pages now have distinct titles, such as <em>Scaffolding &middot; Twitter Bootstrap</em>.
- Updated the Apple touch icons (now black on black instead of the blue grid) and fixed the links to them in the docs.
- Added new global styles docs section to the Scaffolding page.
  - Required use of HTML5 doctype
  - Overview of global typographic and links details
  - Mention of our embedded CSS reset via [Normalize.css](http://necolas.github.com/normalize.css/)
- Added version number to the download button on the docs homepage.
- Updated progress bars section to simplify how the classes stack and more clearly indicate the available optional classes and styles.
- Added a new example, [SoundReady.fm](http://soundready.fm), to the homepage
- Added various sizes to the docs for button groups

### Resolved bugs

- Removed all IE7 hacks and floats from `.input-prepend` and `.input-append`, however, this requires you to **ensure there is no whitespace in your code** between `.add-on` and the `input`.
- In `.input-prepend` and `.input-append`, added ability to use add-ons on both sides when you chain the selectors.
- Updated lingering `.btn-dark` reference to `.btn-inverse`.
- Fixed issue with content being cut off in `.tab-content` for tabbable sections.
- Updated `.navbar .container` to use `width: auto;` to start and then reset the fixed widths via the `#gridSystem` mixin (it's a little dirty, but required to avoid adding another class).
- Modal footer buttons are now aligned by their parent via `text-align: right;` instead of `float: right` on the button level. This was changed to allow the use of `.pull-left` and `.pull-right` to align buttons easily. Double check your button order with this change!
- Fixed problem where default striped progress bar was green instead of blue.
- Fixed CSS selector used for `input` and `textarea` grid sizes to properly apply the CSS (was `input > .span*` and now is `input.span*`).

### New features

- Horizontal dividers support added to nav lists
- Added basic version of badges
- Added visible/hidden classes for devices
- Added support for buttons in input-prepend/append component
- Added .navbar-fixed-bottom support
- Added .dropup support for dropdown menus to pop them upward instead of downward (this is automatically done for the newly added fixed bottom navbar).
- Added mixin for [new image replacement technique](http://www.zeldman.com/2012/03/01/replacing-the-9999px-hack-new-image-replacement/)
- Added pause on hover for the carousel
- Added tons of new variables for typography, buttons, forms, dropdowns, navbar, and more for the LESS pros out there. These variables have also been reflected on the Customize page.
- Added new horizontal description list variation
- Added `.disabled` class support to the pager component (also added a mention of this to the docs)
- Added `.well-large` and `.well-small` classes for extending the well component

For a full issue-by-issue rundown of the release, check out the now closed [2.0.2 milestone on GitHub](https://github.com/twitter/bootstrap/issues?sort=created&direction=desc&state=closed&page=1&milestone=9)

## v2.0.1 (February 17, 2012)

Overview of changes:

- Previously the docs called for use of `.control-label` in the examples, but the CSS didn't make clear use of it. This class is required for horizontal forms and has been reflected in the CSS.
- We've tried our best to improve rendering of buttons and icons across all browsers. Some issues remain; Firefox throws an `!important`on `line-height` for inputs, so that's the big one.
- We refined the label component style to move away from uppercase.
- Added the black button option, `.btn-inverse`.
- Added a mini button class, `.btn-mini`.
- We had to re-add the protocol, `http:` to the HTML5 schim because IE7-8 wouldn't recognize it, dropping some HTML5 support for those browsers and introducing major performance issues.
- Resolved some issues with responsive layouts where media queries would overlap at 768px and 980px.
- Rearranged Scaffolding docs page to split fixed and fluid grid systems.
- Tons of docs updates for typos and language changes.

For full list of changes, see the now closed [v2.0.1 milestone](https://github.com/twitter/bootstrap/issues?milestone=8&state=closed).

## v2.0.0 (January 28, 2012)
Complete rewrite of the library. For full details, head to the upgrading doc at http://twitter.github.com/bootstrap/upgrading.html.

## v1.4.0
### Key bug fixes and changes
- **Updated tables** to make no border the default and add options for condensed and bordered versions
- **Updated form states** to expand on error styles and provide warning and success variations
- New javascript plugin for button states
- Switched to strict mode for Javascript plugins
- Added more data attribute controls to our plugins
- Full list of 25+ issues fixed: https://github.com/twitter/bootstrap/issues?milestone=6&state=closed

## v1.3.0
### New features
- **Javascript plugins** for modals, alerts, dropdowns, scrollspy, tabs, tooltips, and popovers that work with jQuery and Ender
- **Massively updated docs** for both the main page and for the new javascript plugins
- **Inline labels** for marking inline content with key visual flags
- Media thumbnails
- Breadcrumbs

### Updated docs
- Added complete javascript page with detailed documentation for how to use plugins
- Three complete example pages of using Bootstrap, linked from main docs page with thumbnails
- Added section for compiling Less, for guidelines on how to recompile Bootstrap with Less
- Added section for customizing grid variables in Less to roll your own grid system
- Added section for code for using pre and code tags
- Added section for form field sizes that match grid column sizes

### Key bug fixes and changes
  - Updated table styles to be just a tad bit more refined
  - Added new form input sizes based on the Bootstrap grid system (meaning now you can do `input.span5` for a 280px-wide input)
  - Removed `:focus` states from `:active` links in Firefox
  - Fixed unqualified `.clearfix` in forms.less that added bottom margin to all containers
  - Updated `.container()` mixing to be `.fixed-container()` to prevent conflicts when compiling
  - Added focus states (either `box-shadow` or `outline` on `:focus`) to all buttons, links, and inputs
  - No longer require `h3` in topbar, but still support for backwards compatibility

## v1.2.0
- **Dropdowns refactored** to be extensible (now work in ul.tabs)
- **Added HTML5 form support** by generalizing the form selectors (e.g., input instead of input[type=text|password])
- **Gradients back in IE**, but removed rounded corners in IE9 to prevent background bleed on buttons and alert messages
- **Simplified the grid CSS** by removing the static .span1-16 classes in favor of CSS-style regex for column styles in the grid
- **Added .one-third and .two-thirds columns** to the grid system
- Fixed bug in disabled buttons where they received :active styles
- Bug fixes

## v1.1.1
- **Redesigned alerts** to be more readable
- **Refactored buttons and alerts CSS** to be simpler
- Updated grid system to be more specific and not require .column or columns
- Improved on specificity of CSS selectors by removing unnecessary tag and parent selectors
- Miscellaneous updates to docs
- Bug fixes

## v1.1.0
- **Added support for IE7 and IE8**
- Added examples directory with first example usage of Bootstrap for a simple website
- Syntax fixes for gradients and color-stops
- Miscellaneous updates to docs
- Bug fixes

## v1.0.0
- **Initial release**