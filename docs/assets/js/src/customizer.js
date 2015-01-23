/*!
 * Bootstrap Customizer (http://getbootstrap.com/customize/)
 * Copyright 2011-2014 Twitter, Inc.
 *
 * Licensed under the Creative Commons Attribution 3.0 Unported License. For
 * details, see http://creativecommons.org/licenses/by/3.0/.
 */

/* global JSZip, less, autoprefixer, saveAs, UglifyJS, __configBridge, __js, __less, __fonts */

window.onload = function () { // wait for load in a dumb way because B-0
  'use strict';
  var cw = '/*!\n' +
           ' * Bootstrap v3.3.2 (http://getbootstrap.com)\n' +
           ' * Copyright 2011-' + new Date().getFullYear() + ' Twitter, Inc.\n' +
           ' * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)\n' +
           ' */\n\n'

  var supportsFile = (window.File && window.FileReader && window.FileList && window.Blob)
  var importDropTarget = $('#import-drop-target')

  function showError(msg, err) {
    $('<div id="bsCustomizerAlert" class="bs-customizer-alert">' +
        '<div class="container">' +
          '<a href="#bsCustomizerAlert" data-dismiss="alert" class="close pull-right" aria-label="Close" role="button"><span aria-hidden="true">&times;</span></a>' +
          '<p class="bs-customizer-alert-text"><span class="glyphicon glyphicon-warning-sign" aria-hidden="true"></span><span class="sr-only">Warning:</span>' + msg + '</p>' +
          (err.message ? $('<p></p>').text('Error: ' + err.message)[0].outerHTML : '') +
          (err.extract ? $('<pre class="bs-customizer-alert-extract"></pre>').text(err.extract.join('\n'))[0].outerHTML : '') +
        '</div>' +
      '</div>').appendTo('body').alert()
    throw err
  }

  function showSuccess(msg) {
    $('<div class="bs-callout bs-callout-info">' +
      '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + msg +
    '</div>').insertAfter('.bs-customize-download')
  }

  function showCallout(msg, showUpTop) {
    var callout = $('<div class="bs-callout bs-callout-danger">' +
      '<h4>Attention!</h4>' +
      '<p>' + msg + '</p>' +
    '</div>')

    if (showUpTop) {
      callout.appendTo('.bs-docs-container')
    } else {
      callout.insertAfter('.bs-customize-download')
    }
  }

  function showAlert(type, msg, insertAfter) {
    $('<div class="alert alert-' + type + '">' + msg + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>')
      .insertAfter(insertAfter)
  }

  function getQueryParam(key) {
    key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, '\\$&') // escape RegEx meta chars
    var match = location.search.match(new RegExp('[?&]' + key + '=([^&]+)(&|$)'))
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '))
  }

  function createGist(configJson, callback) {
    var data = {
      description: 'Bootstrap Customizer Config',
      'public': true,
      files: {
        'config.json': {
          content: configJson
        }
      }
    }
    $.ajax({
      url: 'https://api.github.com/gists',
      type: 'POST',
      contentType: 'application/json; charset=UTF-8',
      dataType: 'json',
      data: JSON.stringify(data)
    })
    .success(function (result) {
      var gistUrl = result.html_url;
      var origin = window.location.protocol + '//' + window.location.host
      var customizerUrl = origin + window.location.pathname + '?id=' + result.id
      showSuccess('<strong>Success!</strong> Your configuration has been saved to <a href="' + gistUrl + '">' + gistUrl + '</a> ' +
        'and can be revisited here at <a href="' + customizerUrl + '">' + customizerUrl + '</a> for further customization.')
      history.replaceState(false, document.title, customizerUrl)
      callback(gistUrl, customizerUrl)
    })
    .error(function (err) {
      try {
        showError('<strong>Ruh roh!</strong> Could not save gist file, configuration not saved.', err)
      } catch (sameErr) {
        // deliberately ignore the error
      }
      callback('<none>', '<none>')
    })
  }

  function getCustomizerData() {
    var vars = {}

    $('#less-variables-section input')
      .each(function () {
        $(this).val() && (vars[$(this).prev().text()] = $(this).val())
      })

    var data = {
      vars: vars,
      css: $('#less-section input:checked')  .map(function () { return this.value }).toArray(),
      js:  $('#plugin-section input:checked').map(function () { return this.value }).toArray()
    }

    if ($.isEmptyObject(data.vars) && !data.css.length && !data.js.length) return

    return data
  }

  function updateCustomizerFromJson(data) {
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
  }

  function parseUrl() {
    var id = getQueryParam('id')

    if (!id) return

    $.ajax({
      url: 'https://api.github.com/gists/' + id,
      type: 'GET',
      dataType: 'json'
    })
    .success(function (result) {
      var data = JSON.parse(result.files['config.json'].content)
      updateCustomizerFromJson(data)
    })
    .error(function (err) {
      showError('Error fetching bootstrap config file', err)
    })
  }

  function generateZip(css, js, fonts, config, complete) {
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
      for (var jsFileName in js) {
        jsFolder.file(jsFileName, js[jsFileName])
      }
    }

    if (fonts) {
      var fontsFolder = zip.folder('fonts')
      for (var fontsFileName in fonts) {
        fontsFolder.file(fontsFileName, fonts[fontsFileName], { base64: true })
      }
    }

    if (config) {
      zip.file('config.json', config)
    }

    var content = zip.generate({ type: 'blob' })

    complete(content)
  }

  function generateCustomLess(vars) {
    var result = ''

    for (var key in vars) {
      result += key + ': ' + vars[key] + ';\n'
    }

    return result + '\n\n'
  }

  function generateFonts() {
    var glyphicons = $('#less-section [value="glyphicons.less"]:checked')
    if (glyphicons.length) {
      return __fonts
    }
  }

  // Returns an Array of @import'd filenames in the order
  // in which they appear in the file.
  function includedLessFilenames(lessFilename) {
    var IMPORT_REGEX = /^@import \"(.*?)\";$/
    var lessLines = __less[lessFilename].split('\n')

    var imports = []
    $.each(lessLines, function (index, lessLine) {
      var match = IMPORT_REGEX.exec(lessLine)
      if (match) {
        var importee = match[1]
        var transitiveImports = includedLessFilenames(importee)
        $.each(transitiveImports, function (index, transitiveImportee) {
          if ($.inArray(transitiveImportee, imports) === -1) {
            imports.push(transitiveImportee)
          }
        })
        imports.push(importee)
      }
    })

    return imports
  }

  function generateLESS(lessFilename, lessFileIncludes, vars) {
    var lessSource = __less[lessFilename]

    var lessFilenames = includedLessFilenames(lessFilename)
    $.each(lessFilenames, function (index, filename) {
      var fileInclude = lessFileIncludes[filename]

      // Files not explicitly unchecked are compiled into the final stylesheet.
      // Core stylesheets like 'normalize.less' are not included in the form
      // since disabling them would wreck everything, and so their 'fileInclude'
      // will be 'undefined'.
      if (fileInclude || (fileInclude == null))    lessSource += __less[filename]

      // Custom variables are added after Bootstrap variables so the custom
      // ones take precedence.
      if (('variables.less' === filename) && vars) lessSource += generateCustomLess(vars)
    })

    lessSource = lessSource.replace(/@import[^\n]*/gi, '') // strip any imports
    return lessSource
  }

  function compileLESS(lessSource, baseFilename, intoResult) {
    var promise = $.Deferred()
    var parser = new less.Parser({
      paths: ['variables.less', 'mixins.less'],
      optimization: 0,
      filename: baseFilename + '.css'
    })

    parser.parse(lessSource, function (parseErr, tree) {
      if (parseErr) {
        return promise.reject(parseErr)
      }
      try {
        intoResult[baseFilename + '.css']     = cw + tree.toCSS()
        intoResult[baseFilename + '.min.css'] = cw + tree.toCSS({ compress: true })
      }
      catch (compileErr) {
        return promise.reject(compileErr)
      }
      promise.resolve()
    })

    return promise.promise()
  }

  function generateCSS(preamble) {
    var promise = $.Deferred()
    var oneChecked = false
    var lessFileIncludes = {}
    $('#less-section input').each(function () {
      var $this = $(this)
      var checked = $this.is(':checked')
      lessFileIncludes[$this.val()] = checked

      oneChecked = oneChecked || checked
    })

    if (!oneChecked) return false

    var result = {}
    var vars = {}

    $('#less-variables-section input')
      .each(function () {
        $(this).val() && (vars[$(this).prev().text()] = $(this).val())
      })

    var bsLessSource    = preamble + generateLESS('bootstrap.less', lessFileIncludes, vars)
    var themeLessSource = preamble + generateLESS('theme.less',     lessFileIncludes, vars)

    var prefixer = autoprefixer({ browsers: __configBridge.autoprefixerBrowsers })

    $.when(
      compileLESS(bsLessSource, 'bootstrap', result),
      compileLESS(themeLessSource, 'bootstrap-theme', result)
    ).done(function () {
      for (var key in result) {
        result[key] = prefixer.process(result[key]).css
      }
      promise.resolve(result)
    }).fail(function (err) {
      showError('<strong>Ruh roh!</strong> Problem parsing or compiling Less files.', err)
      promise.reject()
    })

    return promise.promise()
  }

  function uglify(js) {
    var ast = UglifyJS.parse(js)
    ast.figure_out_scope()

    var compressor = UglifyJS.Compressor()
    var compressedAst = ast.transform(compressor)

    compressedAst.figure_out_scope()
    compressedAst.compute_char_frequency()
    compressedAst.mangle_names()

    var stream = UglifyJS.OutputStream()
    compressedAst.print(stream)

    return stream.toString()
  }

  function generateJS(preamble) {
    var $checked = $('#plugin-section input:checked')
    var jqueryCheck = __configBridge.jqueryCheck.join('\n')
    var jqueryVersionCheck = __configBridge.jqueryVersionCheck.join('\n')

    if (!$checked.length) return false

    var js = $checked
      .map(function () { return __js[this.value] })
      .toArray()
      .join('\n')

    preamble = cw + preamble
    js = jqueryCheck + jqueryVersionCheck + js

    return {
      'bootstrap.js': preamble + js,
      'bootstrap.min.js': preamble + uglify(js)
    }
  }

  function removeImportAlerts() {
    importDropTarget.nextAll('.alert').remove()
  }

  function handleConfigFileSelect(e) {
    e.stopPropagation()
    e.preventDefault()

    var file = (e.originalEvent.hasOwnProperty('dataTransfer')) ? e.originalEvent.dataTransfer.files[0] : e.originalEvent.target.files[0]

    var reader = new FileReader()

    reader.onload = function (e) {
      var text = e.target.result

      try {
        var json = JSON.parse(text)

        if (!$.isPlainObject(json)) {
          throw new Error('JSON data from config file is not an object.')
        }

        updateCustomizerFromJson(json)
        showAlert('success', '<strong>Woohoo!</strong> Your configuration was successfully uploaded. Tweak your settings, then hit Download.', importDropTarget)
      } catch (err) {
        return showAlert('danger', '<strong>Shucks.</strong> We can only read valid <code>.json</code> files. Please try again.', importDropTarget)
      }
    }

    reader.readAsText(file, 'utf-8')
  }

  function handleConfigDragOver(e) {
    e.stopPropagation()
    e.preventDefault()
    e.originalEvent.dataTransfer.dropEffect = 'copy'

    removeImportAlerts()
  }

  if (supportsFile) {
    importDropTarget
      .on('dragover', handleConfigDragOver)
      .on('drop', handleConfigFileSelect)
  }

  $('#import-file-select').on('change', handleConfigFileSelect)
  $('#import-manual-trigger').on('click', removeImportAlerts)

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

  $compileBtn.on('click', function (e) {
    var configData = getCustomizerData()
    var configJson = JSON.stringify(configData, null, 2)

    e.preventDefault()

    $compileBtn.attr('disabled', 'disabled')

    createGist(configJson, function (gistUrl, customizerUrl) {
      configData.customizerUrl = customizerUrl
      configJson = JSON.stringify(configData, null, 2)

      var preamble = '/*!\n' +
        ' * Generated using the Bootstrap Customizer (' + customizerUrl + ')\n' +
        ' * Config saved to config.json and ' + gistUrl + '\n' +
        ' */\n'

      $.when(
        generateCSS(preamble),
        generateJS(preamble),
        generateFonts()
      ).done(function (css, js, fonts) {
        generateZip(css, js, fonts, configJson, function (blob) {
          $compileBtn.removeAttr('disabled')
          setTimeout(function () { saveAs(blob, 'bootstrap.zip') }, 0)
        })
      })
    })
  });

  // browser support alert
  (function () {
    function failback() {
      $('.bs-docs-section, .bs-docs-sidebar').css('display', 'none')
      showCallout('Looks like your current browser doesn\'t support the Bootstrap Customizer. Please take a second ' +
                    'to <a href="http://browsehappy.com/">upgrade to a more modern browser</a> (other than Safari).', true)
    }
    /**
     * Based on:
     *   Blob Feature Check v1.1.0
     *   https://github.com/ssorallen/blob-feature-check/
     *   License: Public domain (http://unlicense.org)
     */
    var url = window.webkitURL || window.URL // Safari 6 uses "webkitURL".
    var svg = new Blob(
      ['<svg xmlns=\'http://www.w3.org/2000/svg\'></svg>'],
      { type: 'image/svg+xml;charset=utf-8' }
    )
    var objectUrl = url.createObjectURL(svg);

    if (/^blob:/.exec(objectUrl) === null || !supportsFile) {
      // `URL.createObjectURL` created a URL that started with something other
      // than "blob:", which means it has been polyfilled and is not supported by
      // this browser.
      failback()
    } else {
      $('<img>')
        .on('load', function () {
          $compileBtn.prop('disabled', false)
        })
        .on('error', failback)
        .attr('src', objectUrl)
    }
  })();

  parseUrl()
}
