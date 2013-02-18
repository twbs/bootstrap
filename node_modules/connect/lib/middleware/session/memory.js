
/*!
 * Connect - session - MemoryStore
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var Store = require('./store')
  , utils = require('../../utils')
  , Session = require('./session');

/**
 * Initialize a new `MemoryStore`.
 *
 * @api public
 */

var MemoryStore = module.exports = function MemoryStore() {
  this.sessions = {};
};

/**
 * Inherit from `Store.prototype`.
 */

MemoryStore.prototype.__proto__ = Store.prototype;

/**
 * Attempt to fetch session by the given `sid`.
 *
 * @param {String} sid
 * @param {Function} fn
 * @api public
 */

MemoryStore.prototype.get = function(sid, fn){
  var self = this;
  process.nextTick(function(){
    var expires
      , sess = self.sessions[sid];
    if (sess) {
      sess = JSON.parse(sess);
      expires = 'string' == typeof sess.cookie.expires
        ? new Date(sess.cookie.expires)
        : sess.cookie.expires;
      if (!expires || new Date < expires) {
        fn(null, sess);
      } else {
        self.destroy(sid, fn);
      }
    } else {
      fn();
    }
  });
};

/**
 * Commit the given `sess` object associated with the given `sid`.
 *
 * @param {String} sid
 * @param {Session} sess
 * @param {Function} fn
 * @api public
 */

MemoryStore.prototype.set = function(sid, sess, fn){
  var self = this;
  process.nextTick(function(){
    self.sessions[sid] = JSON.stringify(sess);
    fn && fn();
  });
};

/**
 * Destroy the session associated with the given `sid`.
 *
 * @param {String} sid
 * @api public
 */

MemoryStore.prototype.destroy = function(sid, fn){
  var self = this;
  process.nextTick(function(){
    delete self.sessions[sid];
    fn && fn();
  });
};

/**
 * Invoke the given callback `fn` with all active sessions.
 *
 * @param {Function} fn
 * @api public
 */

MemoryStore.prototype.all = function(fn){
  var arr = []
    , keys = Object.keys(this.sessions);
  for (var i = 0, len = keys.length; i < len; ++i) {
    arr.push(this.sessions[keys[i]]);
  }
  fn(null, arr);
};

/**
 * Clear all sessions.
 *
 * @param {Function} fn
 * @api public
 */

MemoryStore.prototype.clear = function(fn){
  this.sessions = {};
  fn && fn();
};

/**
 * Fetch number of sessions.
 *
 * @param {Function} fn
 * @api public
 */

MemoryStore.prototype.length = function(fn){
  fn(null, Object.keys(this.sessions).length);
};
