/*!
 * Connect - query
 * Copyright(c) 2011 TJ Holowaychuk
 * Copyright(c) 2011 Sencha Inc.
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var qs = require('qs')
  , parse = require('url').parse;

/**
 * Query:
 *
 * Automatically parse the query-string when available,
 * populating the `req.query` object.
 *
 * Examples:
 *
 *     connect()
 *       .use(connect.query())
 *       .use(function(req, res){
 *         res.end(JSON.stringify(req.query));
 *       });
 *
 *  The `options` passed are provided to qs.parse function.
 *
 * @param {Object} options
 * @return {Function}
 * @api public
 */

module.exports = function query(options){
  return function query(req, res, next){
    if (!req.query) {
      req.query = ~req.url.indexOf('?')
        ? qs.parse(parse(req.url).query, options)
        : {};
    }

    next();
  };
};
