
/*!
 * Connect - session
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var Session = require('./session/session')
  , debug = require('debug')('connect:session')
  , MemoryStore = require('./session/memory')
  , Cookie = require('./session/cookie')
  , Store = require('./session/store')
  , utils = require('./../utils')
  , parse = require('url').parse
  , crc16 = require('crc').crc16
  , crypto = require('crypto');

// environment

var env = process.env.NODE_ENV;

/**
 * Expose the middleware.
 */

exports = module.exports = session;

/**
 * Expose constructors.
 */

exports.Store = Store;
exports.Cookie = Cookie;
exports.Session = Session;
exports.MemoryStore = MemoryStore;

/**
 * Warning message for `MemoryStore` usage in production.
 */

var warning = 'Warning: connection.session() MemoryStore is not\n'
  + 'designed for a production environment, as it will leak\n'
  + 'memory, and will not scale past a single process.';

/**
 * Session:
 * 
 *   Setup session store with the given `options`.
 *
 *   Session data is _not_ saved in the cookie itself, however
 *   cookies are used, so we must use the [cookieParser()](cookieParser.html)
 *   middleware _before_ `session()`.
 *
 * Examples:
 *
 *     connect()
 *       .use(connect.cookieParser('keyboard cat'))
 *       .use(connect.session({ key: 'sid', cookie: { secure: true }}))
 *
 * Options:
 *
 *   - `key` cookie name defaulting to `connect.sid`
 *   - `store` session store instance
 *   - `cookie` session cookie settings, defaulting to `{ path: '/', httpOnly: true, maxAge: null }`
 *   - `proxy` trust the reverse proxy when setting secure cookies (via "x-forwarded-proto")
 *
 * Cookie option:
 *
 *  By default `cookie.maxAge` is `null`, meaning no "expires" parameter is set
 *  so the cookie becomes a browser-session cookie. When the user closes the 
 *  browser the cookie (and session) will be removed.
 *
 * ## req.session
 *
 *  To store or access session data, simply use the request property `req.session`,
 *  which is (generally) serialized as JSON by the store, so nested objects 
 *  are typically fine. For example below is a user-specific view counter:
 *
 *       connect()
 *         .use(connect.favicon())
 *         .use(connect.cookieParser('keyboard cat'))
 *         .use(connect.session({ cookie: { maxAge: 60000 }}))
 *         .use(function(req, res, next){
 *           var sess = req.session;
 *           if (sess.views) {
 *             res.setHeader('Content-Type', 'text/html');
 *             res.write('<p>views: ' + sess.views + '</p>');
 *             res.write('<p>expires in: ' + (sess.cookie.maxAge / 1000) + 's</p>');
 *             res.end();
 *             sess.views++;
 *           } else {
 *             sess.views = 1;
 *             res.end('welcome to the session demo. refresh!');
 *           }
 *         }
 *       )).listen(3000);
 *
 * ## Session#regenerate()
 *
 *  To regenerate the session simply invoke the method, once complete
 *  a new SID and `Session` instance will be initialized at `req.session`.
 *
 *      req.session.regenerate(function(err){
 *        // will have a new session here
 *      });
 *
 * ## Session#destroy()
 *
 *  Destroys the session, removing `req.session`, will be re-generated next request.
 *
 *      req.session.destroy(function(err){
 *        // cannot access session here
 *      });
 * 
 * ## Session#reload()
 *
 *  Reloads the session data.
 *
 *      req.session.reload(function(err){
 *        // session updated
 *      });
 *
 * ## Session#save()
 *
 *  Save the session.
 *
 *      req.session.save(function(err){
 *        // session saved
 *      });
 *
 * ## Session#touch()
 *
 *   Updates the `.maxAge` property. Typically this is
 *   not necessary to call, as the session middleware does this for you.
 *
 * ## Session#cookie
 *
 *  Each session has a unique cookie object accompany it. This allows
 *  you to alter the session cookie per visitor. For example we can
 *  set `req.session.cookie.expires` to `false` to enable the cookie
 *  to remain for only the duration of the user-agent.
 *
 * ## Session#maxAge
 *
 *  Alternatively `req.session.cookie.maxAge` will return the time
 *  remaining in milliseconds, which we may also re-assign a new value
 *  to adjust the `.expires` property appropriately. The following
 *  are essentially equivalent
 *
 *     var hour = 3600000;
 *     req.session.cookie.expires = new Date(Date.now() + hour);
 *     req.session.cookie.maxAge = hour;
 *
 * For example when `maxAge` is set to `60000` (one minute), and 30 seconds
 * has elapsed it will return `30000` until the current request has completed,
 * at which time `req.session.touch()` is called to reset `req.session.maxAge`
 * to its original value.
 *
 *     req.session.cookie.maxAge;
 *     // => 30000
 *
 * Session Store Implementation:
 *
 * Every session store _must_ implement the following methods
 *
 *    - `.get(sid, callback)`
 *    - `.set(sid, session, callback)`
 *    - `.destroy(sid, callback)`
 *
 * Recommended methods include, but are not limited to:
 *
 *    - `.length(callback)`
 *    - `.clear(callback)`
 *
 * For an example implementation view the [connect-redis](http://github.com/visionmedia/connect-redis) repo.
 *
 * @param {Object} options
 * @return {Function}
 * @api public
 */

function session(options){
  var options = options || {}
    , key = options.key || 'connect.sid'
    , store = options.store || new MemoryStore
    , cookie = options.cookie
    , trustProxy = options.proxy;

  // notify user that this store is not
  // meant for a production environment
  if ('production' == env && store instanceof MemoryStore) {
    console.warn(warning);
  }

  // generates the new session
  store.generate = function(req){
    req.sessionID = utils.uid(24);
    req.session = new Session(req);
    req.session.cookie = new Cookie(req, cookie);
  };

  return function session(req, res, next) {
    // self-awareness
    if (req.session) return next();

    // ensure secret is available or bail
    if (!req.secret) throw new Error('connect.cookieParser("secret") required for security when using sessions');

    // parse url
    var url = parse(req.url)
      , path = url.pathname
      , originalHash;

    // expose store
    req.sessionStore = store;

    // set-cookie
    res.on('header', function(){
      if (!req.session) return;
      var cookie = req.session.cookie
        , proto = (req.headers['x-forwarded-proto'] || '').toLowerCase()
        , tls = req.connection.encrypted || (trustProxy && 'https' == proto)
        , secured = cookie.secure && tls
        , isNew = req.signedCookies[key] != req.sessionID;

      // only send secure cookies via https
      if (cookie.secure && !secured) return debug('not secured');

      // browser-session length cookie
      if (null == cookie.expires) {
        if (!isNew) return debug('already set browser-session cookie');
      // compare hashes
      } else if (originalHash == hash(req.session)) {
        return debug('unmodified session');
      }

      var val = cookie.serialize(key, req.sessionID);
      debug('set-cookie %s', val);
      res.setHeader('Set-Cookie', val);
    });

    // proxy end() to commit the session
    var end = res.end;
    res.end = function(data, encoding){
      res.end = end;
      if (!req.session) return res.end(data, encoding);
      debug('saving');
      req.session.resetMaxAge();
      req.session.save(function(){
        debug('saved');
        res.end(data, encoding);
      });
    };

    // generate the session
    function generate() {
      store.generate(req);
    }

    // get the sessionID from the cookie
    req.sessionID = req.signedCookies[key];

    // generate a session if the browser doesn't send a sessionID
    if (!req.sessionID) {
      debug('no SID sent, generating session');
      generate();
      next();
      return;
    }

    // generate the session object
    var pause = utils.pause(req);
    debug('fetching %s', req.sessionID);
    store.get(req.sessionID, function(err, sess){
      // proxy to resume() events
      var _next = next;
      next = function(err){
        _next(err);
        pause.resume();
      }

      // error handling
      if (err) {
        debug('error');
        if ('ENOENT' == err.code) {
          generate();
          next();
        } else {
          next(err);
        }
      // no session
      } else if (!sess) {
        debug('no session found');
        generate();
        next();
      // populate req.session
      } else {
        debug('session found');
        store.createSession(req, sess);
        originalHash = hash(sess);
        next();
      }
    });
  };
};

/**
 * Hash the given `sess` object omitting changes
 * to `.cookie`.
 *
 * @param {Object} sess
 * @return {String}
 * @api private
 */

function hash(sess) {
  return crc16(JSON.stringify(sess, function(key, val){
    if ('cookie' != key) return val;
  }));
}
