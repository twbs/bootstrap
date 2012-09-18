Recommendations and requirements for how to best contribute to Bootstrap. We strive to obey these as best as possible, though we may drift as development continues in our primary development branches. As always, thanks for contributing--we hope these guidelines make it easier and shed some light on our approach and processes.

### Key branches
- `master` is the latest, deployed version
- `*-wip` is the official branch for the next release

### Notes on the repo
As of v2.0.0, Bootstrap's documentation is powered by Mustache templates and built via `make` before each commit and release. This was done to enable internationalization (translation) in a future release by uploading our strings to the [Twitter Translation Center](http://translate.twttr.com/). Any edits to the docs should be first done in the Mustache files and then recompiled into the HTML.

### Pull requests
- Try to submit pull requests against the latest `*-wip` branch for easier merging
- Any changes to the docs must be made to the Mustache templates, not just the compiled HTML pages
- CSS changes must be done in .less files first, never just the compiled files
- If modifying the .less files, always recompile and commit the compiled files bootstrap.css and bootstrap.min.css
- Try not to pollute your pull request with unintended changes--keep them simple and small
- Try to share which browsers your code has been tested in before submitting a pull request

### Coding standards: HTML
- Two spaces for indentation, never tabs
- Double quotes only, never single quotes
- Always use proper indentation
- Use tags and elements appropriate for an HTML5 doctype (e.g., self-closing tags)

### Coding standards: CSS
- Adhere to the property order we support via Recess: http://www.markdotto.com/2011/11/29/css-property-order/
- Multiple-line approach (one property and value per line)
- Always a space after a property's colon (.e.g, `display: block;` and not `display:block;`)
- End all lines with a semi-colon
- For multiple, comma-separated selectors, place each selector on it's own line
- Attribute selectors, like `input[type="text"]` should always wrap the attribute's value in double quotes, for consistency and safety (see this [blog post on unquoted attribute values](http://mathiasbynens.be/notes/unquoted-attribute-values) that can lead to XSS attacks).

### License
By contributing your code, you agree to license your contribution under the terms of the APLv2:
https://github.com/twitter/bootstrap/blob/master/LICENSE
