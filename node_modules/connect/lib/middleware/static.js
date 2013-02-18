/*!
 * Connect - staticProvider
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var fs = require('fs')
  , path = require('path')
  , join = path.join
  , basename = path.basename
  , normalize = path.normalize
  , utils = require('../utils')
  , Buffer = require('buffer').Buffer
  , parse = require('url').parse
  , mime = require('mime');

/**
 * Static:
 *
 *   Static file server with the given `root` path.
 *
 * Examples:
 *
 *     var oneDay = 86400000;
 *
 *     connect()
 *       .use(connect.static(__dirname + '/public'))
 *
 *     connect()
 *       .use(connect.static(__dirname + '/public', { maxAge: oneDay }))
 *
 * Options:
 *
 *    - `maxAge`   Browser cache maxAge in milliseconds. defaults to 0
 *    - `hidden`   Allow transfer of hidden files. defaults to false
 *    - `redirect`   Redirect to trailing "/" when the pathname is a dir
 *
 * @param {String} root
 * @param {Object} options
 * @return {Function}
 * @api public
 */

exports = module.exports = function static(root, options){
  options = options || {};

  // root required
  if (!root) throw new Error('static() root path required');
  options.root = root;

  return function static(req, res, next) {
    options.path = req.url;
    options.getOnly = true;
    send(req, res, next, options);
  };
};

/**
 * Expose mime module.
 * 
 * If you wish to extend the mime table use this
 * reference to the "mime" module in the npm registry.
 */

exports.mime = mime;

/**
 * decodeURIComponent.
 *
 * Allows V8 to only deoptimize this fn instead of all
 * of send().
 *
 * @param {String} path
 * @api private
 */

function decode(path){
  try {
    return decodeURIComponent(path);
  } catch (err) {
    return err;
  }
}

/**
 * Attempt to tranfer the requested file to `res`.
 *
 * @param {ServerRequest}
 * @param {ServerResponse}
 * @param {Function} next
 * @param {Object} options
 * @api private
 */

var send = exports.send = function(req, res, next, options){
  options = options || {};
  if (!options.path) throw new Error('path required');

  // setup
  var maxAge = options.maxAge || 0
    , ranges = req.headers.range
    , head = 'HEAD' == req.method
    , get = 'GET' == req.method
    , root = options.root ? normalize(options.root) : null
    , redirect = false === options.redirect ? false : true
    , getOnly = options.getOnly
    , fn = options.callback
    , hidden = options.hidden
    , done;

  // replace next() with callback when available
  if (fn) next = fn;

  // ignore non-GET requests
  if (getOnly && !get && !head) return next();

  // parse url
  var url = parse(options.path)
    , path = decode(url.pathname)
    , type;

  if (path instanceof URIError) return next(utils.error(400));

  // null byte(s)
  if (~path.indexOf('\0')) return next(utils.error(400));

  // when root is not given, consider .. malicious
  if (!root && ~path.indexOf('..')) return next(utils.error(403));
  
  // index.html support
  if ('/' == path[path.length - 1]) path += 'index.html';
  
  // join / normalize from optional root dir
  path = normalize(join(root, path));

  // malicious path
  if (root && 0 != path.indexOf(root)) return next(utils.error(403));

  // "hidden" file
  if (!hidden && '.' == basename(path)[0]) return next();

  fs.stat(path, function(err, stat){
    // mime type
    type = mime.lookup(path);

    // ignore ENOENT
    if (err) {
      if (fn) return fn(err);
      return ('ENOENT' == err.code || 'ENAMETOOLONG' == err.code)
        ? next()
        : next(err);
    // redirect directory in case index.html is present
    } else if (stat.isDirectory()) {
      if (!redirect) return next();
      res.statusCode = 301;
      res.setHeader('Location', url.pathname + '/');
      res.end('Redirecting to ' + url.pathname + '/');
      return;
    }

    // header fields
    if (!res.getHeader('Date')) res.setHeader('Date', new Date().toUTCString());
    if (!res.getHeader('Cache-Control')) res.setHeader('Cache-Control', 'public, max-age=' + (maxAge / 1000));
    if (!res.getHeader('Last-Modified')) res.setHeader('Last-Modified', stat.mtime.toUTCString());
    if (!res.getHeader('Content-Type')) {
      var charset = mime.charsets.lookup(type);
      res.setHeader('Content-Type', type + (charset ? '; charset=' + charset : ''));
    }
    res.setHeader('Accept-Ranges', 'bytes');

    // conditional GET support
    if (utils.conditionalGET(req)) {
      if (!utils.modified(req, res)) {
        req.emit('static');
        return utils.notModified(res);
      }
    }

    var opts = {}
      , len = stat.size;

    // we have a Range request
    if (ranges) {
      ranges = utils.parseRange(len, ranges);

      // valid
      if (ranges) {
        opts.start = ranges[0].start;
        opts.end = ranges[0].end;

        // unsatisfiable range
        if (opts.start > len - 1) {
          res.setHeader('Content-Range', 'bytes */' + stat.size);
          return next(utils.error(416));
        }

        // limit last-byte-pos to current length
        if (opts.end > len - 1) opts.end= len - 1;

        // Content-Range
        len = opts.end - opts.start + 1;
        res.statusCode = 206;
        res.setHeader('Content-Range', 'bytes '
          + opts.start
          + '-'
          + opts.end
          + '/'
          + stat.size);
      }
    }

    res.setHeader('Content-Length', len);

    // transfer
    if (head) return res.end();

    // stream
    var stream = fs.createReadStream(path, opts);
    req.emit('static', stream);
    req.on('close', stream.destroy.bind(stream));
    stream.pipe(res);

    // callback
    if (fn) {
      function callback(err) { done || fn(err); done = true }
      req.on('close', callback);
      req.socket.on('error', callback);
      stream.on('error', callback);
      stream.on('end', callback);
    } else {
      stream.on('error', function(err){
        if (res.headerSent) {
          console.error(err.stack);
          req.destroy();
        } else {
          next(err);
        }
      });
    }
  });
};
