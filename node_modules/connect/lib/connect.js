
/*!
 * Connect
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var EventEmitter = require('events').EventEmitter
  , proto = require('./proto')
  , utils = require('./utils')
  , path = require('path')
  , basename = path.basename
  , fs = require('fs');

// node patches

require('./patch');

// expose createServer() as the module

exports = module.exports = createServer;

/**
 * Framework version.
 */

exports.version = '2.1.3';

/**
 * Expose the prototype.
 */

exports.proto = proto;

/**
 * Auto-load middleware getters.
 */

exports.middleware = {};

/**
 * Expose utilities.
 */

exports.utils = utils;

/**
 * Create a new connect server.
 *
 * @return {Function}
 * @api public
 */

function createServer() {
  function app(req, res){ app.handle(req, res); }
  utils.merge(app, proto);
  utils.merge(app, EventEmitter.prototype);
  app.route = '/';
  app.stack = [].slice.apply(arguments);
  return app;
};

/**
 * Support old `.createServer()` method.
 */

createServer.createServer = createServer;

/**
 * Auto-load bundled middleware with getters.
 */

fs.readdirSync(__dirname + '/middleware').forEach(function(filename){
  if (!/\.js$/.test(filename)) return;
  var name = basename(filename, '.js');
  function load(){ return require('./middleware/' + name); }
  exports.middleware.__defineGetter__(name, load);
  exports.__defineGetter__(name, load);
});
