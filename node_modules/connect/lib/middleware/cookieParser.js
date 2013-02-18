
/*!
 * Connect - cookieParser
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var utils = require('./../utils');

/**
 * Cookie parser:
 *
 * Parse _Cookie_ header and populate `req.cookies`
 * with an object keyed by the cookie names. Optionally
 * you may enabled signed cookie support by passing
 * a `secret` string, which assigns `req.secret` so
 * it may be used by other middleware such as `session()`.
 *
 * Examples:
 *
 *     connect()
 *       .use(connect.cookieParser('keyboard cat'))
 *       .use(function(req, res, next){
 *         res.end(JSON.stringify(req.cookies));
 *       })
 *
 * @param {String} secret
 * @return {Function}
 * @api public
 */

module.exports = function cookieParser(secret){
  return function cookieParser(req, res, next) {
    var cookie = req.headers.cookie;
    if (req.cookies) return next();

    req.secret = secret;
    req.cookies = {};
    req.signedCookies = {};
    
    if (cookie) {
      try {
        req.cookies = utils.parseCookie(cookie);
        if (secret) {
          req.signedCookies = utils.parseSignedCookies(req.cookies, secret);
          var obj = utils.parseJSONCookies(req.signedCookies);
          req.signedCookies = obj.cookies;
          req.cookieHashes = obj.hashes;
        }
        req.cookies = utils.parseJSONCookies(req.cookies).cookies;
      } catch (err) {
        return next(err);
      }
    }
    next();
  };
};