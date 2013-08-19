window.onload = function () { // wait for load in a dumb way because B-0
  var cw = '/*!\n * Bootstrap v3.0.0\n *\n * Copyright 2013 Twitter, Inc\n * Licensed under the Apache License v2.0\n * http://www.apache.org/licenses/LICENSE-2.0\n *\n * Designed and built with all the love in the world @twitter by @mdo and @fat.\n */\n\n'

  function showError(msg, err) {
    $('<div id="bsCustomizerAlert" class="bs-customizer-alert">\
        <div class="container">\
          <a href="#bsCustomizerAlert" data-dismiss="alert" class="close pull-right">&times;</a>\
          <p class="bs-customizer-alert-text"><span class="glyphicon glyphicon-warning-sign"></span>' + msg + '</p>' +
          (err.extract ? '<pre class="bs-customizer-alert-extract">' + err.extract.join('\n') + '</pre>' : '') + '\
        </div>\
      </div>').appendTo('body').alert()
    throw err
  }

  function showCallout(msg, showUpTop) {
    var callout = $('<div class="bs-callout bs-callout-danger">\
       <h4>Attention!</h4>\
      <p>' + msg + '</p>\
    </div>')

    if (showUpTop) {
      callout.appendTo('.bs-docs-container')
    } else {
      callout.insertAfter('.bs-customize-download')
    }
  }

  function getQueryParam(key) {
    key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx meta chars
    var match = location.search.match(new RegExp("[?&]"+key+"=([^&]+)(&|$)"));
    return match && decodeURIComponent(match[1].replace(/\+/g, " "));
  }

  function createGist(configData) {
    var data = {
      "description": "Bootstrap Customizer Config",
      "public": true,
      "files": {
        "config.json": {
          "content": JSON.stringify(configData, null, 2)
        }
      }
    }
    $.ajax({
      url: 'https://api.github.com/gists',
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify(data)
    })
    .success(function(result) {
      history.replaceState(false, document.title, window.location.origin + window.location.pathname + '?id=' + result.id)
    })
    .error(function(err) {
      showError('<strong>Ruh roh!</strong> Could not save gist file, configuration not saved.', err)
    })
  }

  function getCustomizerData() {
    var vars = {}

    $('#less-variables-section input')
        .each(function () {
          $(this).val() && (vars[ $(this).prev().text() ] = $(this).val())
        })

    var data = {
      vars: vars,
      css: $('#less-section input:checked')  .map(function () { return this.value }).toArray(),
      js:  $('#plugin-section input:checked').map(function () { return this.value }).toArray()
    }

    if ($.isEmptyObject(data.vars) && !data.css.length && !data.js.length) return

    return data
  }

  function parseUrl() {
    var id = getQueryParam('id')

    if (!id) return

    $.ajax({
      url: 'https://api.github.com/gists/' + id,
      type: 'GET',
      dataType: 'json'
    })
    .success(function(result) {
      var data = JSON.parse(result.files['config.json'].content)
      if (data.js) {
        $('#plugin-section input').each(function () {
          $(this).prop('checked', ~$.inArray(this.value, data.js))
        })
      }
      if (data.css) {
        $('#less-section input').each(function () {
          $(this).prop('checked', ~$.inArray(this.value, data.css))
        })
      }
      if (data.vars) {
        for (var i in data.vars) {
          $('input[data-var="' + i + '"]').val(data.vars[i])
        }
      }
    })
    .error(function(err) {
      showError('Error fetching bootstrap config file', err)
    })
  }

  function generateZip(css, js, complete) {
    if (!css && !js) return showError('<strong>Ruh roh!</strong> No Bootstrap files selected.', new Error('no Bootstrap'))

    var zip = new JSZip()

    if (css) {
      var cssFolder = zip.folder('css')
      for (var fileName in css) {
        cssFolder.file(fileName, css[fileName])
      }
    }

    if (js) {
      var jsFolder = zip.folder('js')
      for (var fileName in js) {
        jsFolder.file(fileName, js[fileName])
      }
    }

    var content = zip.generate({type:"blob"})

    complete(content)
  }

  function generateCustomCSS(vars) {
    var result = ''

    for (var key in vars) {
      result += key + ': ' + vars[key] + ';\n'
    }

    return result + '\n\n'
  }

  function generateCSS() {
    var $checked = $('#less-section input:checked')

    if (!$checked.length) return false

    var result = {}
    var vars = {}
    var css = ''

    $('#less-variables-section input')
        .each(function () {
          $(this).val() && (vars[ $(this).prev().text() ] = $(this).val())
        })

    css += __less['variables.less']
    if (vars) css += generateCustomCSS(vars)
    css += __less['mixins.less']
    css += __less['normalize.less']
    css += __less['scaffolding.less']
    css += $checked
      .map(function () { return __less[this.value] })
      .toArray()
      .join('\n')

    css = css.replace(/@import[^\n]*/gi, '') //strip any imports

    try {
      var parser = new less.Parser({
          paths: ['variables.less', 'mixins.less']
        , optimization: 0
        , filename: 'bootstrap.css'
      }).parse(css, function (err, tree) {
        if (err) {
          return showError('<strong>Ruh roh!</strong> Could not parse less files.', err)
        }
        result = {
          'bootstrap.css'     : cw + tree.toCSS(),
          'bootstrap.min.css' : cw + tree.toCSS({ compress: true })
        }
      })
    } catch (err) {
      return showError('<strong>Ruh roh!</strong> Could not parse less files.', err)
    }

    return result
  }

  function generateJavascript() {
    var $checked = $('#plugin-section input:checked')
    if (!$checked.length) return false

    var js = $checked
      .map(function () { return __js[this.value] })
      .toArray()
      .join('\n')

    return {
      'bootstrap.js': js,
      'bootstrap.min.js': cw + uglify(js)
    }
  }

  var inputsComponent = $('#less-section input')
  var inputsPlugin    = $('#plugin-section input')
  var inputsVariables = $('#less-variables-section input')

  $('#less-section .toggle').on('click', function (e) {
    e.preventDefault()
    inputsComponent.prop('checked', !inputsComponent.is(':checked'))
  })

  $('#plugin-section .toggle').on('click', function (e) {
    e.preventDefault()
    inputsPlugin.prop('checked', !inputsPlugin.is(':checked'))
  })

  $('#less-variables-section .toggle').on('click', function (e) {
    e.preventDefault()
    inputsVariables.val('')
  })

  $('[data-dependencies]').on('click', function () {
    if (!$(this).is(':checked')) return
    var dependencies = this.getAttribute('data-dependencies')
    if (!dependencies) return
    dependencies = dependencies.split(',')
    for (var i = 0; i < dependencies.length; i++) {
      var dependency = $('[value="' + dependencies[i] + '"]')
      dependency && dependency.prop('checked', true)
    }
  })

  $('[data-dependents]').on('click', function () {
    if ($(this).is(':checked')) return
    var dependents = this.getAttribute('data-dependents')
    if (!dependents) return
    dependents = dependents.split(',')
    for (var i = 0; i < dependents.length; i++) {
      var dependent = $('[value="' + dependents[i] + '"]')
      dependent && dependent.prop('checked', false)
    }
  })

  var $compileBtn = $('#btn-compile')
  var $downloadBtn = $('#btn-download')

  $compileBtn.on('click', function (e) {
    e.preventDefault()

    $compileBtn.attr('disabled', 'disabled')

    generateZip(generateCSS(), generateJavascript(), function (blob) {
      $compileBtn.removeAttr('disabled')
      saveAs(blob, "bootstrap.zip")
      createGist(getCustomizerData())
    })
  })

  // browser support alerts
  if (!window.URL && navigator.userAgent.toLowerCase().indexOf('safari') != -1) {
    showCallout("Looks like you're using safari, which sadly doesn't have the best support\
                 for HTML5 blobs. Because of this your file will be downloaded with the name <code>\"untitled\"</code>.\
                 However, if you check your downloads folder, just rename this <code>\"untitled\"</code> file\
                 to <code>\"bootstrap.zip\"</code> and you should be good to go!")
  } else if (!window.URL && !window.webkitURL) {
    $('.bs-docs-section, .bs-sidebar').css('display', 'none')

    showCallout("Looks like your current browser doesn't support the Bootstrap Customizer. Please take a second\
                to <a href=\"https://www.google.com/intl/en/chrome/browser/\"> upgrade to a more modern browser</a>.", true)
  }

  parseUrl()
}
