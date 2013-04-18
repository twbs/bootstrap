
/*!
 * Connect - basicAuth
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var utils = require('../utils')
  , unauthorized = utils.unauthorized;

/**
 * Basic Auth:
 *
 * Enfore basic authentication by providing a `callback(user, pass)`,
 * which must return `true` in order to gain access. Alternatively an async
 * method is provided as well, invoking `callback(user, pass, callback)`. Populates
 * `req.user`. The final alternative is simply passing username / password
 * strings.
 *
 *  Simple username and password
 *
 *     connect(connect.basicAuth('username', 'password'));
 *
 *  Callback verification
 *
 *     connect()
 *       .use(connect.basicAuth(function(user, pass){
 *         return 'tj' == user & 'wahoo' == pass;
 *       }))
 *
 *  Async callback verification, accepting `fn(err, user)`.
 *
 *     connect()
 *       .use(connect.basicAuth(function(user, pass, fn){
 *         User.authenticate({ user: user, pass: pass }, fn);
 *       }))
 *
 * @param {Function|String} callback or username
 * @param {String} realm
 * @api public
 */

module.exports = function basicAuth(callback, realm) {
  var username, password;

  // user / pass strings
  if ('string' == typeof callback) {
    username = callback;
    password = realm;
    if ('string' != typeof password) throw new Error('password argument required');
    realm = arguments[2];
    callback = function(user, pass){
      return user == username && pass == password;
    }
  }

  realm = realm || 'Authorization Required';

  return function(req, res, next) {
    var authorization = req.headers.authorization;

    if (req.user) return next();
    if (!authorization) return unauthorized(res, realm);

    var parts = authorization.split(' ')
      , scheme = parts[0]
      , credentials = new Buffer(parts[1], 'base64').toString().split(':')
      , user = credentials[0]
      , pass = credentials[1];

    if ('Basic' != scheme) return next(utils.error(400));

    // async
    if (callback.length >= 3) {
      var pause = utils.pause(req);
      callback(user, pass, function(err, user){
        if (err || !user)  return unauthorized(res, realm);
        req.user = user;
        next();
        pause.resume();
      });
    // sync
    } else {
      if (callback(user, pass)) {
        req.user = user;
        next();
      } else {
        unauthorized(res, realm);
      }
    }
  }
};

