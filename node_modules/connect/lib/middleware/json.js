/*!
 * Connect - json
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var utils = require('../utils');

/**
 * JSON:
 *
 * Parse JSON request bodies, providing the
 * parsed object as `req.body`.
 *
 * Options:
 *
 *   - `strict`  when `false` anything `JSON.parse()` accepts will be parsed
 *   - `reviver`  used as the second "reviver" argument for JSON.parse
 *
 * @param {Object} options
 * @return {Function}
 * @api public
 */

exports = module.exports = function(options){
  var options = options || {}
    , strict = options.strict === false
      ? false
      : true;

  return function json(req, res, next) {
    if (req._body) return next();
    req.body = req.body || {};

    // check Content-Type
    if ('application/json' != utils.mime(req)) return next();

    // flag as parsed
    req._body = true;

    // parse
    var buf = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk){ buf += chunk });
    req.on('end', function(){
      if (strict && '{' != buf[0] && '[' != buf[0]) return next(utils.error(400));
      try {
        req.body = JSON.parse(buf, options.reviver);
        next();
      } catch (err){
        err.status = 400;
        next(err);
      }
    });
  }
};