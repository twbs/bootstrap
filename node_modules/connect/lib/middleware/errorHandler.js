/*!
 * Connect - errorHandler
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var utils = require('../utils')
  , url = require('url')
  , fs = require('fs');

// environment

var env = process.env.NODE_ENV || 'development';

/**
 * Error handler:
 *
 * Development error handler, providing stack traces
 * and error message responses for requests accepting text, html,
 * or json.
 *
 * Text:
 *
 *   By default, and when _text/plain_ is accepted a simple stack trace
 *   or error message will be returned.
 *
 * JSON:
 *
 *   When _application/json_ is accepted, connect will respond with
 *   an object in the form of `{ "error": error }`.
 *
 * HTML:
 *
 *   When accepted connect will output a nice html stack trace.
 *
 * @return {Function}
 * @api public
 */

exports = module.exports = function errorHandler(){
  return function errorHandler(err, req, res, next){
    if (err.status) res.statusCode = err.status;
    if (res.statusCode < 400) res.statusCode = 500;
    if ('test' != env) console.error(err.stack);
    var accept = req.headers.accept || '';
    // html
    if (~accept.indexOf('html')) {
      fs.readFile(__dirname + '/../public/style.css', 'utf8', function(e, style){
        fs.readFile(__dirname + '/../public/error.html', 'utf8', function(e, html){
          var stack = (err.stack || '')
            .split('\n').slice(1)
            .map(function(v){ return '<li>' + v + '</li>'; }).join('');
            html = html
              .replace('{style}', style)
              .replace('{stack}', stack)
              .replace('{title}', exports.title)
              .replace('{statusCode}', res.statusCode)
              .replace(/\{error\}/g, utils.escape(err.toString()));
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.end(html);
        });
      });
    // json
    } else if (~accept.indexOf('json')) {
      var error = { message: err.message, stack: err.stack };
      for (var prop in err) error[prop] = err[prop];
      var json = JSON.stringify({ error: error });
      res.setHeader('Content-Type', 'application/json');
      res.end(json);
    // plain text
    } else {
      res.writeHead(res.statusCode, { 'Content-Type': 'text/plain' });
      res.end(err.stack);
    }
  };
};

/**
 * Template title, framework authors may override this value.
 */

exports.title = 'Connect';
