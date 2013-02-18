
/*!
 * Connect - cookieSession
 * Copyright(c) 2011 Sencha Inc.
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var utils = require('./../utils')
  , Cookie = require('./session/cookie')
  , debug = require('debug')('connect:cookieSession')
  , crc16 = require('crc').crc16;

// environment

var env = process.env.NODE_ENV;

/**
 * Cookie Session:
 *
 *   Cookie session middleware.
 *
 *      var app = connect();
 *      app.use(connect.cookieParser('tobo!'));
 *      app.use(connect.cookieSession({ cookie: { maxAge: 60 * 60 * 1000 }}));
 *
 * Options:
 *
 *   - `key` cookie name defaulting to `connect.sess`
 *   - `cookie` session cookie settings, defaulting to `{ path: '/', httpOnly: true, maxAge: null }`
 *   - `proxy` trust the reverse proxy when setting secure cookies (via "x-forwarded-proto")
 *
 * Clearing sessions:
 *
 *  To clear the session simply set its value to `null`,
 *  `cookieSession()` will then respond with a 1970 Set-Cookie.
 *
 *     req.session = null;
 *
 * @param {Object} options
 * @return {Function}
 * @api public
 */

module.exports = function cookieSession(options){
  // TODO: utilize Session/Cookie to unify API
  var options = options || {}
    , key = options.key || 'connect.sess'
    , cookie = options.cookie
    , trustProxy = options.proxy;

  return function cookieSession(req, res, next) {
    req.session = req.signedCookies[key] || {};
    req.session.cookie = new Cookie(req, cookie);

    res.on('header', function(){
      // removed
      if (!req.session) {
        debug('clear session');
        res.setHeader('Set-Cookie', key + '=; expires=' + new Date(0).toUTCString());
        return;
      }

      var cookie = req.session.cookie;
      delete req.session.cookie;

      // check security
      var proto = (req.headers['x-forwarded-proto'] || '').toLowerCase()
        , tls = req.connection.encrypted || (trustProxy && 'https' == proto)
        , secured = cookie.secure && tls;

      // only send secure cookies via https
      if (cookie.secure && !secured) return debug('not secured');

      // serialize
      debug('serializing %j', req.session);
      var val = 'j:' + JSON.stringify(req.session);

      // compare hashes
      var originalHash = req.cookieHashes && req.cookieHashes[key];
      var hash = crc16(val);
      if (originalHash == hash) return debug('unmodified session');

      // set-cookie
      val = utils.sign(val, req.secret);
      val = utils.serializeCookie(key, val, cookie);
      debug('set-cookie %j', cookie);
      res.setHeader('Set-Cookie', val);
    });

    next();
  };
};
