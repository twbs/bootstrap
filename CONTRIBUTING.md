# Foundation

This is the Foundation project.  We love making super awesome stuff, but even more we like to empower people to make changes on their own.  Feel free to fork and improve Foundation.

## Compass Project

If you have a compass project and would like updated assets you can run the following command at any given time from within your project directory:

```bash
compass create -r zurb-foundation --using foundation
```

## Development

Want to test out the Compass templates.  Don't recompile the gem every time, use `bundler` like so:

```bash
mkdir demo1
cd demo1
echo -e 'source "https://rubygems.org"\n
gem "zurb-foundation", :path => "/path/to/foundation/repo"\n
gem "compass"\n' > Gemfile
bundle exec compass create -r zurb-foundation --using foundation
```

On subsequent template updates use:

```bash
bundle exec compass create -r zurb-foundation --using foundation --force
```

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. All code should have a 2 space indentation to avoid conflicts.
4. Test your changes to the best of your ability.
5. Update the documentation to reflect your changes if they add or change current functionality. Instructions on how to view the documentation locally can be found in the [README](README.md#view-documentation-locally).
6. Commit your changes (`git commit -am 'Added some feature'`)
7. Push to the branch (`git push origin my-new-feature`)
8. Create new Pull Request

## JavaScript Testing

The Foundation JS libraries are tested with Jasmine. Grunt can be used to run the test suite.

1. Install `node.js` and `npm` with `brew install node`
    * You may need to `source` your bash config or restart your terminal client to make sure your PATH is up to date.
2. From the root of the project, install required packages locally with `npm install`
3. Install bower with `npm install -g bower` and and required assets locally `bower install`
4. Install the command line interface for grunt with `npm install -g grunt-cli`
5. Install PhantomJS with `brew install PhantomJS` (we assume you have Chrome and Firefox installed)
    * If you get connection errors with PhantomJS when running the suite, ensure `node -v` returns  `v0.10.12` or later. Upgrade with `brew upgrade node`
6. Run `grunt karma:dev` to run the tests with some real browsers
7. Run `grunt build:assets` to compile any changes to foundation JS source into testing distribution
