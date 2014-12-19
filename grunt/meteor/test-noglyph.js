'use strict';  // TWBS code style mandates no semicolons - https://github.com/twbs/bootstrap/blob/master/CONTRIBUTING.md#js

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
