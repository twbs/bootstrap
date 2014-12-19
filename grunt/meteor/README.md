[Bootstrap](http://getbootstrap.com) packaged for [Meteor.js](http://meteor.com).


# Usage

```sh
meteor add twbs:bootstrap
```

Features requiring JavaScript (such as drop-downs) or custom jQuery plugins like tooltip or popover should work automatically.
If don't work in templates other than `body`, make sure to run the initialization code in `Template.<yourtemplate>.rendered`:

```js
this.$('[data-toggle="dropdown"]').dropdown();
this.$('[data-toggle="tooltip"]').tooltip();
this.$('[data-toggle="popover"]').popover();
```

For performance reasons, [the Tooltip and Popover data-apis are opt-in](http://getbootstrap.com/javascript/#popovers).
Above, we initialize them in the limited scope of the template DOM.



# Package features

* Opt-in jQuery plugins are enabled, as long as you use the `data-toggle` attribute in your HTML.
  [Tooltips and popovers](http://getbootstrap.com/javascript/#popovers) "just work".
* No need for CSS override files - Meteor will automatically "convert relative URLs to absolute URLs
  when merging CSS files" [since v0.8.1](https://github.com/meteor/meteor/blob/b96c5d7962a9e59b9efaeb93eb81020e0548e378/History.md#v081)
  so CSS `@font-face src url('../fonts/...')` will be resolved to the correct `/packages/.../fonts/...` path.
* Tests that fonts are downloadable.
* Tests that [all jQuery custom plugins](http://getbootstrap.com/javascript/) instantiate correctly.
* Visual checks for plugins, including dropdown, popover, tooltip, are included.


# Versions

There are two versions of this package:

* [twbs:bootstrap](https://atmospherejs.com/twbs/bootstrap) - the CSS, JS including [all jQuery plugins](http://getbootstrap.com/javascript/),
  and the Glyphicons font are included.
* [twbs:bootstrap-noglyph](https://atmospherejs.com/twbs/bootstrap-noglyph) - Only the Bootstrap .CSS and .JS files (including the plugins) are
  packaged. Useful if you plan to use a different icon set instead of Glyphicons.

If you need more detailed control on the files, or to use `.less`, see [Nemo64's package](https://github.com/Nemo64/meteor-bootstrap).


# Issues

If you encounter a Meteor-related issue while using this package, please CC @dandv when you [file it](https://github.com/twbs/bootstrap/issues).
