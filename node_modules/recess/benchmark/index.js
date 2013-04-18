#!/usr/bin/env node
var path = require('path')
  , fs = require('fs')
  , less = require('less')
  , recess = require('../lib')
  , file = path.join(__dirname, 'benchmark.less')

fs.readFile(file, 'utf8', function (e, data) {
    var css, start, end

    new(less.Parser)({ optimization: 2 }).parse(data, function (err, tree) {

      start = new Date()
      css = tree.toCSS()
      end = new Date()

      console.log(
          "  LESS toCSS: "
        + (end - start)
        + " ms ("
        + parseInt(1000 / (end - start) * data.length / 1024)
        + " KB\/s)"
      )

      new(less.Parser)({ optimization: 2 }).parse(css, function (err, tree) {

        var play = new recess.Constructor(false)

        play.data = css
        play.definitions = tree.rules
        play.path = 'less'
        play.callback = function () {
          end = new Date()
          console.log(
              "RECESS toCSS: "
            + (end - start)
            + " ms ("
            + parseInt(1000 / (end - start) * data.length / 1024)
            + " KB\/s)"
          )
        }
        start = new Date()
        play.compile()
      })

    })
})