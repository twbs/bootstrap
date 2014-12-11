Packaging [Bootstrap](http://getbootstrap.com) for [Meteor.js](http://meteor.com).
We'll be working with the Bootstrap team to include this integration in their repo
and provide same-day updates on Atmosphere.

Bootstrap.css, .js and the Glyphicons font are included.

If you need more detailed control on the files, see [Nemo64's package](https://github.com/Nemo64/meteor-bootstrap).


# Issues

If you encounter a Meteor-related issue while using this package, please CC @dandv when you file it in this repo.
If the issue is related to Bootstrap itself, please file it on [Bootstrap's GitHub](https://github.com/twbs/bootstrap/issues).


# DONE

* No need for CSS override files - Meteor will automatically "convert relative URLs to absolute URLs
  when merging CSS files" [since v0.8.1](https://github.com/meteor/meteor/blob/b96c5d7962a9e59b9efaeb93eb81020e0548e378/History.md#v081)
  so CSS `@font-face src url('../fonts/...')` will be resolved to the correct `/packages/.../fonts/...` path
* Tests that fonts are downloadable
* Plugin instantiation tests
* Visual checks for all plugins, including dropdown, popover, tooltip


# TODO

* For the sake of completeness, get the modal running
