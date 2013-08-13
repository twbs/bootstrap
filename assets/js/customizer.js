window.onload = function () { // wait for load in a dumb way because B-0
  var cw = '/*!\n * Bootstrap v3.0.0-rc.2\n *\n * Copyright 2013 Twitter, Inc\n * Licensed under the Apache License v2.0\n * http://www.apache.org/licenses/LICENSE-2.0\n *\n * Designed and built with all the love in the world @twitter by @mdo and @fat.\n */\n\n'

  function generateUrl() {
    var vars = {}

    $('#less-variables-section input')
        .each(function () {
          $(this).val() && (vars[ $(this).prev().text() ] = $(this).val())
        })

    var data = {
      vars: vars,
      css: $('#less-section input:not(:checked)').map(function () { return this.value }).toArray(),
      js: $('#plugin-section input:not(:checked)').map(function () { return this.value }).toArray()
    }

    if ($.isEmptyObject(data.vars) && !data.css.length && !data.js.length) return

    window.location = jQuery.param.querystring('/customize/', data)
  }

  function parseUrl() {
    var data = jQuery.deparam.querystring()

    if (data.js) {
      for (var i = 0; i < data.js.length; i++) {
        var input = $('input[value="'+data.js[i]+'"]')
        input && input.prop('checked', false)
      }
    }

    if (data.css) {
      for (var i = 0; i < data.css.length; i++) {
        var input = $('input[value="'+data.css[i]+'"]')
        input && input.prop('checked', false)
      }
    }

    if (data.vars) {
      // todo (fat): vars
    }
  }

  function generateZip(css, js, complete) {
    if (!css && !js) return alert('you want to build nothing… o_O')

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

    var content = zip.generate()

    location.href = 'data:application/zip;base64,' + content

    complete()
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
        if (err) return alert(err)

        result = {
          'bootstrap.css'     : cw + tree.toCSS(),
          'bootstrap.min.css' : cw + tree.toCSS({ compress: true })
        }
      })
    } catch (err) {
      return alert(err)
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

  var $downloadBtn = $('#btn-download').on('click', function (e) {
    e.preventDefault()
    $downloadBtn.addClass('loading')
    generateZip(generateCSS(), generateJavascript(), function () {
      $downloadBtn.removeClass('loading')
      setTimeout(function () {
        generateUrl()
      }, 1)
    })
  })

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

  try {
    parseUrl()
  } catch (e) {
    // maybe alert user that we can't parse their url
  }
}