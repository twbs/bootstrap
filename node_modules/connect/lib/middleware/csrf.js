
/*!
 * Connect - csrf
 * Copyright(c) 2011 Sencha Inc.
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var utils = require('../utils')
  , crypto = require('crypto');

/**
 * Anti CSRF:
 *
 * CRSF protection middleware.
 *
 * By default this middleware generates a token named "_csrf"
 * which should be added to requests which mutate
 * state, within a hidden form field, query-string etc. This
 * token is validated against the visitor's `req.session._csrf`
 * property.
 *
 * The default `value` function checks `req.body` generated
 * by the `bodyParser()` middleware, `req.query` generated
 * by `query()`, and the "X-CSRF-Token" header field.
 *
 * This middleware requires session support, thus should be added
 * somewhere _below_ `session()` and `cookieParser()`.
 *
 * Options:
 *
 *    - `value` a function accepting the request, returning the token 
 *
 * @param {Object} options
 * @api public
 */

module.exports = function csrf(options) {
  var options = options || {}
    , value = options.value || defaultValue;

  return function(req, res, next){
    // generate CSRF token
    var token = req.session._csrf || (req.session._csrf = utils.uid(24));

    // ignore GET & HEAD (for now)
    if ('GET' == req.method || 'HEAD' == req.method) return next();

    // determine value
    var val = value(req);

    // check
    if (val != token) return next(utils.error(403));
    
    next();
  }
};

/**
 * Default value function, checking the `req.body`
 * and `req.query` for the CSRF token.
 *
 * @param {IncomingMessage} req
 * @return {String}
 * @api private
 */

function defaultValue(req) {
  return (req.body && req.body._csrf)
    || (req.query && req.query._csrf)
    || (req.headers['x-csrf-token']);
}