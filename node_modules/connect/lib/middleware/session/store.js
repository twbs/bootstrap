
/*!
 * Connect - session - Store
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var EventEmitter = require('events').EventEmitter
  , Session = require('./session')
  , Cookie = require('./cookie')
  , utils = require('../../utils');

/**
 * Initialize abstract `Store`.
 *
 * @api private
 */

var Store = module.exports = function Store(options){};

/**
 * Inherit from `EventEmitter.prototype`.
 */

Store.prototype.__proto__ = EventEmitter.prototype;

/**
 * Re-generate the given requests's session.
 *
 * @param {IncomingRequest} req
 * @return {Function} fn
 * @api public
 */

Store.prototype.regenerate = function(req, fn){
  var self = this;
  this.destroy(req.sessionID, function(err){
    self.generate(req);
    fn(err);
  });
};

/**
 * Load a `Session` instance via the given `sid`
 * and invoke the callback `fn(err, sess)`.
 *
 * @param {String} sid
 * @param {Function} fn
 * @api public
 */

Store.prototype.load = function(sid, fn){
  var self = this;
  this.get(sid, function(err, sess){
    if (err) return fn(err);
    if (!sess) return fn();
    var req = { sessionID: sid, sessionStore: self };
    sess = self.createSession(req, sess);
    fn(null, sess);
  });
};

/**
 * Create session from JSON `sess` data.
 *
 * @param {IncomingRequest} req
 * @param {Object} sess
 * @return {Session}
 * @api private
 */

Store.prototype.createSession = function(req, sess){
  var expires = sess.cookie.expires
    , orig = sess.cookie.originalMaxAge
    , update = null == update ? true : false;
  sess.cookie = new Cookie(req, sess.cookie);
  if ('string' == typeof expires) sess.cookie.expires = new Date(expires);
  sess.cookie.originalMaxAge = orig;
  req.session = new Session(req, sess);
  return req.session;
};