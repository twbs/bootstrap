TODO:

* Move config in root dir so that the directory structure doesn't change a lot compared to the previous one; see next point why this currently fails
* Fix `ignoreFiles`
* Fix examples and homepage templates
* Fix homepage highlight shortcode
* Migrate the old Jekyll plugins to Hugo shortcodes:
  * `bugify.rb`
  * `example.rb` - Add ID and options support; switch to named args
* Change all URLs to use `absURL` / `relURL`
* See why we end up with bogus `</p>` after some shortcodes
* Fix `docs-github-serve` script
