# Contributing to Bootstrap

Looking to contribute something to Bootstrap? **Here's how you can help.**



## Reporting issues

We only accept issues that are bug reports or feature requests. Bugs must be isolated and reproducible problems that we can fix within the Bootstrap core. Please read the following guidelines before opening any issue.

1. **Search for existing issues.** We get a lot of duplicate issues, and you'd help us out a lot by first checking if someone else has reported the same issue. Moreover, the issue may have already been resolved with a fix available.
2. **Create an isolated and reproducible test case.** Be sure the problem exists in Bootstrap's code with a [reduced test case](http://css-tricks.com/reduced-test-cases/) that should be included in each bug report.
3. **Include a live example.** Make use of jsFiddle or jsBin to share your isolated test cases.
4. **Share as much information as possible.** Include operating system and version, browser and version, version of Bootstrap, customized or vanilla build, etc. where appropriate. Also include steps to reproduce the bug.



## Key branches

- `master` is the latest, deployed version.
- `gh-pages` is the hosted docs (not to be used for pull requests).
- `*-wip` is the official work in progress branch for the next release.



## Notes on the repo

As of v2.0.0, Bootstrap's documentation is powered by Mustache templates and built via `make` before each commit and release. This was done to enable internationalization (translation) in a future release by uploading our strings to the [Twitter Translation Center](http://translate.twttr.com/). Any edits to the docs should be first done in the Mustache files and then recompiled into the HTML.



## Pull requests

- Try to submit pull requests against the latest `*-wip` branch for easier merging
- Any changes to the docs must be made to the Mustache templates, not just the compiled HTML pages
- CSS changes must be done in .less files first, never just the compiled files
- If modifying the .less files, always recompile and commit the compiled files bootstrap.css and bootstrap.min.css
- Try not to pollute your pull request with unintended changes--keep them simple and small
- Try to share which browsers your code has been tested in before submitting a pull request



## Coding standards: HTML

- Two spaces for indentation, never tabs
- Double quotes only, never single quotes
- Always use proper indentation
- Use tags and elements appropriate for an HTML5 doctype (e.g., self-closing tags)



## Coding standards: CSS

- Adhere to the [Recess CSS property order](http://markdotto.com/2011/11/29/css-property-order/)
- Multiple-line approach (one property and value per line)
- Always a space after a property's colon (.e.g, `display: block;` and not `display:block;`)
- End all lines with a semi-colon
- For multiple, comma-separated selectors, place each selector on it's own line
- Attribute selectors, like `input[type="text"]` should always wrap the attribute's value in double quotes, for consistency and safety (see this [blog post on unquoted attribute values](http://mathiasbynens.be/notes/unquoted-attribute-values) that can lead to XSS attacks).



## Coding standards: JS

- No semicolons
- Comma first
- 2 spaces (no tabs)
- strict mode
- "Attractive"



## License

By contributing your code, you agree to license your contribution under the terms of the APLv2: https://github.com/twbs/bootstrap/blob/master/LICENSE
