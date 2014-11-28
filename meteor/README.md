Packaging Bootstrap for [Meteor.js](http://meteor.com).

# Issues

If you encounter an issue while using this package, please CC @dandv when you file it in this repo.


# DONE

* No need for CSS override files - Meteor will automatically "convert relative URLs to absolute URLs
when merging CSS files" [since v0.8.1](https://github.com/meteor/meteor/blob/b96c5d7962a9e59b9efaeb93eb81020e0548e378/History.md#v081)
so CSS `@font-face src url('../fonts/...')` will be resolved to the correct `/packages/.../fonts/...` path
* Tests that fonts are downloadable
* Plugin instantiation tests
* Visual checks for all plugins


# TODO

* Figure out why JS seems broken in the visual checks, even though Bootstrap.js does load: dropdowns, modals, popovers don't work. However, carousel does.
Possible that there's a conflict with the Bootstrap that Tinytest itself loads.
