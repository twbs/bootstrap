'use strict';  // TWBS code style mandates no semicolons - https://github.com/twbs/bootstrap/blob/master/CONTRIBUTING.md#js

var packageName  // there seems to be no official way of finding out the name of the very package we're testing - http://stackoverflow.com/questions/27180709/in-a-tinytest-test-file-how-do-i-get-the-name-of-the-package

// Check that the font files are downloadable. Meteor places assets at /packages/<packageName>/.
['eot', 'svg', 'ttf', 'woff', 'woff2'].forEach(function (font) {
  Tinytest.addAsync(font + ' fonts are shipped', function (test, done) {

    // curiously enough, the 'local-test:...' package isn't loaded into Package before calling Tinytest, so we can't do this determination outside this loop
    if (!packageName)
      Object.keys(Package).forEach(function(p) {
        if (p.search(/local-test/) > -1)
          packageName = p.replace('local-test:', '')  // we should stop the loop, but forEach can't do that
      })

    if (!packageName) {
      test.exception({message: 'Package not quite loaded... go figure'})
      return
    }

    var packagePath = packageName.replace(':', '_')  // e.g. twbs_bootstrap

    HTTP.get(
      '/packages/' + packagePath + '/dist/fonts/glyphicons-halflings-regular.' + font,
      {
         headers: {
           'Cache-Control': 'no-cache'  // because Meteor has cached fonts even after they were removed from package.js (!) - https://github.com/meteor/meteor/issues/3196
         }
      },
      function callback(error, result) {
        if (error) {
          test.fail({message: 'Font failed to load'})
        } else {
          // if the file is 404, Meteor will redirect to / and return the Meteor.js boilerplate
          test.isTrue(result.content.length > 15000, font + ' font could not be downloaded')
        }

        done()
      }
    )
  })
})

var plugins = ['affix', 'alert', 'button', 'carousel', 'collapse', 'dropdown', 'modal', 'popover', 'scrollspy', 'tab', 'tooltip']

// test plugins
plugins.forEach(function (plugin) {
  Tinytest.add('Plugin - ' + plugin, function (test) {
    test.instanceOf($(document.body)[plugin], Function, 'instantiated correctly')
  })
})

// visual check
plugins.forEach(function (plugin) {

  Tinytest.addAsync('Visual check - ' + plugin, function (test, done) {
    var bootstrapDropZone = document.createElement('div')
    document.body.appendChild(bootstrapDropZone)


    // TODO ideally we'd get the htmls straight from this repo, but no idea how to do this from TinyTest - http://stackoverflow.com/questions/27180892/pull-an-html-file-into-a-tinytest
    HTTP.get('http://rawgit.com/twbs/bootstrap/master/js/tests/visual/' + plugin + '.html', function callback(error, result) {
      if (error) {
        test.fail('Error getting the test file. Do we have an Internet connection to rawgit.com?')
      } else {
        // [^] matches across newlines. Stay within the container div, or else the fragment will attempt to load resources on its own.
        bootstrapDropZone.innerHTML = result.content.match(/<div[^]+<\/div>/)
        test.ok({message: 'Test passed if the display looks OK *and* clicking dropdowns/popovers/tooltips works.'})
        // Only does anything after loading the 'dropdown' plugin test. No idea why it's necessary though.
        $('[data-toggle="dropdown"]').dropdown()
        // toltips and popovers are initialized by the package, but on Template.body.rendered, which is not available in this Tinytest
        $('[data-toggle="tooltip"]').tooltip()
        $('[data-toggle="popover"]').popover()
        // don't initialize the modals because that messes up the Tinytest runner HTML
      }

      done()
    })

  })

})
