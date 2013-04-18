#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var jsdom = require('jsdom').jsdom;
var step = require('step');

step(function() {
  var group = this.group();
  process.argv.slice(2).forEach(function(file) {
    run(file, group());
  });
}, function(err, runs) {
  if (err) throw err;
  var failed = 0;
  runs.forEach(function(run) {
    failed += report(run);
  });
  if (failed) console.log(failed + ' failed');
  process.exit(Number(!!failed));
});

function run(file, callback) {
  var self = this;
  fs.readFile(file, function(err, buffer) {
    if (err) throw err;
    var html = buffer.toString();
    var url = path.resolve('.', path.dirname(file));
    var window = jsdom(html, null, {url: url + '/'}).createWindow();
    // silence QUnit error logging
    window.console.error = window.console.warn = function(){};
    window.onload = function(){
      window.QUnit.done = function() {
        callback(null, {file: file, window: window});
      };
    };
  });
}

function report(run) {
  var window = run.window, file = run.file, jQuery = window.jQuery;
  jQuery('#qunit-tests > .fail').each(function(i, el) {
    el = jQuery(el);
    console.log(el.find('.test-name').text());
    el.find('> ol > .fail', this).each(function(i, el) {
      el = jQuery(el);
      console.log('\t' + el.find('.test-message').text());
      console.log('\t\t' + el.find('.test-expected').text());
      console.log('\t\t' + el.find('.test-actual').text());
      console.log('\t\t' + el.find('.test-source').text());
    });
  });
  return +jQuery('#qunit-testresult .failed').text();
}
