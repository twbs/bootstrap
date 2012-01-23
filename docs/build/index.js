#!/usr/bin/env node
var hogan = require('hogan.js')
  , fs    = require('fs')

var layout, pages

// compile layout template
layout = fs.readFileSync(__dirname + '/../templates/layout.mustache', 'utf-8')
layout = hogan.compile(layout)

// retrieve pages
pages = fs.readdirSync(__dirname + '/../templates/pages')

// iterate over pages
pages.forEach(function (name) {

  var page = fs.readFileSync(__dirname  + '/../templates/pages/' + name, 'utf-8')
    , context = {}

  context[name.replace(/\.mustache$/, '')] = 'active'
  page = hogan.compile(page)
  page = layout.render(context, {
    body: page
  })

  fs.writeFileSync(__dirname + '/../' + name.replace(/mustache$/, 'html'), page, 'utf-8')
})