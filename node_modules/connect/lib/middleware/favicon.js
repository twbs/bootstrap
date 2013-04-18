
/*!
 * Connect - favicon
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var fs = require('fs')
  , utils = require('../utils');

/*!
 * Favicon cache.
 */

var icon;

/**
 * Favicon:
 *
 * By default serves the connect favicon, or the favicon
 * located by the given `path`.
 *
 * Options:
 *
 *   - `maxAge`  cache-control max-age directive, defaulting to 1 day
 *
 * Examples:
 *
 *   Serve default favicon:
 *
 *     connect()
 *       .use(connect.favicon())
 *
 *   Serve favicon before logging for brevity:
 *
 *     connect()
 *       .use(connect.favicon())
 *       .use(connect.logger('dev'))
 *
 *   Serve custom favicon:
 *
 *     connect()
 *       .use(connect.favicon('public/favicon.ico))
 *
 * @param {String} path
 * @param {Object} options
 * @return {Function}
 * @api public
 */

module.exports = function favicon(path, options){
  var options = options || {}
    , path = path || __dirname + '/../public/favicon.ico'
    , maxAge = options.maxAge || 86400000;

  return function favicon(req, res, next){
    if ('/favicon.ico' == req.url) {
      if (icon) {
        res.writeHead(200, icon.headers);
        res.end(icon.body);
      } else {
        fs.readFile(path, function(err, buf){
          if (err) return next(err);
          icon = {
            headers: {
                'Content-Type': 'image/x-icon'
              , 'Content-Length': buf.length
              , 'ETag': '"' + utils.md5(buf) + '"'
              , 'Cache-Control': 'public, max-age=' + (maxAge / 1000)
            },
            body: buf
          };
          res.writeHead(200, icon.headers);
          res.end(icon.body);
        });
      }
    } else {
      next();
    }
  };
};