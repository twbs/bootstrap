#!/usr/bin/env node
var hogan = require('hogan')
  , fs    = require('fs')
  , title = 'Twitter Bootstrap'
  , wrench = require("wrench");


/**
 * Builds this target
 * @param  {Object} argv options from build-script
 */
module.exports.build = function(argv){
  var layout, pages;

  wrench.mkdirSyncRecursive(argv.directory + '/' + argv.target + '/examples/');

  // compile layout template
  layout = fs.readFileSync(__dirname + '/../templates/layout.mustache', 'utf-8');
  layout = hogan.compile(layout, { sectionTags: [{o:'_i', c:'i'}] });

  // retrieve pages
  pages = fs.readdirSync(__dirname + '/../templates/pages');

  // iterate over pages
  pages.forEach(function (name) {

    if (!name.match(/\.mustache$/)) return;

    var page = fs.readFileSync(__dirname  + '/../templates/pages/' + name, 'utf-8')
      , context = {};

    context[name.replace(/\.mustache$/, '')] = 'active';
    context._i = true;
    context.production = argv.production;
    context.title = name
      .replace(/\.mustache/, '')
      .replace(/\-.*/, '')
      .replace(/(.)/, function ($1) { return $1.toUpperCase() });

    if (context.title == 'Index') {
      context.title = title;
    } else {
      context.title += ' · ' + title;
    }

    page = hogan.compile(page, { sectionTags: [{o:'_i', c:'i'}] });
    page = layout.render(context, {
      body: page
    });

    fs.writeFileSync(argv.directory + '/' + argv.target + '/' + name.replace(/mustache$/, 'html'), page, 'utf-8');
  });

  // compile examples
  layout = fs.readFileSync(__dirname + '/../templates/examples_layout.mustache', 'utf-8');
  layout = hogan.compile(layout, { sectionTags: [{o:'_i', c:'i'}] });
  pages = fs.readdirSync(__dirname + '/../templates/examples');
  pages.forEach(function (name) {
    if (!name.match(/\.mustache$/)) return;
    var page = fs.readFileSync(__dirname  + '/../templates/examples/' + name, 'utf-8')
      , context = {};
    context[name.replace(/\.mustache$/, '')] = 'active';
    context._i = true;
    context.production = argv.production;
    context.title = title;
    page = hogan.compile(page, { sectionTags: [{o:'_i', c:'i'}] });
    page = layout.render(context, {
      body: page
    });
    fs.writeFileSync(argv.directory + '/' + argv.target + '/examples/' + name.replace(/mustache$/, 'html'), page, 'utf-8');
  });

}
