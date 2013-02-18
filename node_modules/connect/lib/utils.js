
/*!
 * Connect - utils
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var http = require('http')
  , crypto = require('crypto')
  , crc16 = require('crc').crc16
  , Path = require('path')
  , fs = require('fs');

/**
 * Extract the mime type from the given request's
 * _Content-Type_ header.
 *
 * @param  {IncomingMessage} req
 * @return {String}
 * @api private
 */

exports.mime = function(req) {
  var str = req.headers['content-type'] || '';
  return str.split(';')[0];
};

/**
 * Generate an `Error` from the given status `code`.
 *
 * @param {Number} code
 * @return {Error}
 * @api private
 */

exports.error = function(code){
  var err = new Error(http.STATUS_CODES[code]);
  err.status = code;
  return err;
};

/**
 * Return md5 hash of the given string and optional encoding,
 * defaulting to hex.
 *
 *     utils.md5('wahoo');
 *     // => "e493298061761236c96b02ea6aa8a2ad"
 *
 * @param {String} str
 * @param {String} encoding
 * @return {String}
 * @api public
 */

exports.md5 = function(str, encoding){
  return crypto
    .createHash('md5')
    .update(str)
    .digest(encoding || 'hex');
};

/**
 * Merge object b with object a.
 *
 *     var a = { foo: 'bar' }
 *       , b = { bar: 'baz' };
 *     
 *     utils.merge(a, b);
 *     // => { foo: 'bar', bar: 'baz' }
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object}
 * @api private
 */

exports.merge = function(a, b){
  if (a && b) {
    for (var key in b) {
      a[key] = b[key];
    }
  }
  return a;
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

exports.escape = function(html){
  return String(html)
    .replace(/&(?!\w+;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};


/**
 * Return a unique identifier with the given `len`.
 *
 *     utils.uid(10);
 *     // => "FDaS435D2z"
 *
 * @param {Number} len
 * @return {String}
 * @api private
 */

exports.uid = function(len) {
  return crypto.randomBytes(Math.ceil(len * 3 / 4))
    .toString('base64')
    .slice(0, len);
};

/**
 * Sign the given `val` with `secret`.
 *
 * @param {String} val
 * @param {String} secret
 * @return {String}
 * @api private
 */

exports.sign = function(val, secret){
  return val + '.' + crypto
    .createHmac('sha256', secret)
    .update(val)
    .digest('base64')
    .replace(/=+$/, '');
};

/**
 * Unsign and decode the given `val` with `secret`,
 * returning `false` if the signature is invalid.
 *
 * @param {String} val
 * @param {String} secret
 * @return {String|Boolean}
 * @api private
 */

exports.unsign = function(val, secret){
  var str = val.slice(0,val.lastIndexOf('.'));
  return exports.sign(str, secret) == val
    ? str
    : false;
};

/**
 * Parse signed cookies, returning an object
 * containing the decoded key/value pairs,
 * while removing the signed key from `obj`.
 *
 * TODO: tag signed cookies with "s:"
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

exports.parseSignedCookies = function(obj, secret){
  var ret = {};
  Object.keys(obj).forEach(function(key){
    var val = obj[key]
      , signed = exports.unsign(val, secret);

    if (signed) {
      ret[key] = signed;
      delete obj[key];
    }
  });
  return ret;
};

/**
 * Parse JSON cookies.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

exports.parseJSONCookies = function(obj){
  var hashes = {};

  Object.keys(obj).forEach(function(key){
    var val = obj[key];
    if (0 == val.indexOf('j:')) {
      try {
        hashes[key] = crc16(val); // only crc json cookies for now
        obj[key] = JSON.parse(val.slice(2));
      } catch (err) {
        // nothing
      }
    }
  });

  return {
    cookies: obj,
    hashes: hashes
  };
};

/**
 * Parse the given cookie string into an object.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

exports.parseCookie = function(str){
  var obj = {}
    , pairs = str.split(/[;,] */);
  for (var i = 0, len = pairs.length; i < len; ++i) {
    var pair = pairs[i]
      , eqlIndex = pair.indexOf('=')
      , key = pair.substr(0, eqlIndex).trim()
      , val = pair.substr(++eqlIndex, pair.length).trim();

    // quoted values
    if ('"' == val[0]) val = val.slice(1, -1);

    // only assign once
    if (undefined == obj[key]) {
      val = val.replace(/\+/g, ' ');
      try {
        obj[key] = decodeURIComponent(val);
      } catch (err) {
        if (err instanceof URIError) {
          obj[key] = val;
        } else {
          throw err;
        }
      }
    }
  }
  return obj;
};

/**
 * Serialize the given object into a cookie string.
 *
 *      utils.serializeCookie('name', 'tj', { httpOnly: true })
 *      // => "name=tj; httpOnly"
 *
 * @param {String} name
 * @param {String} val
 * @param {Object} obj
 * @return {String}
 * @api private
 */

exports.serializeCookie = function(name, val, obj){
  var pairs = [name + '=' + encodeURIComponent(val)]
    , obj = obj || {};

  if (obj.domain) pairs.push('domain=' + obj.domain);
  if (obj.path) pairs.push('path=' + obj.path);
  if (obj.expires) pairs.push('expires=' + obj.expires.toUTCString());
  if (obj.httpOnly) pairs.push('httpOnly');
  if (obj.secure) pairs.push('secure');

  return pairs.join('; ');
};

/**
 * Pause `data` and `end` events on the given `obj`.
 * Middleware performing async tasks _should_ utilize
 * this utility (or similar), to re-emit data once
 * the async operation has completed, otherwise these
 * events may be lost.
 *
 *      var pause = utils.pause(req);
 *      fs.readFile(path, function(){
 *         next();
 *         pause.resume();
 *      });
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

exports.pause = function(obj){
  var onData
    , onEnd
    , events = [];

  // buffer data
  obj.on('data', onData = function(data, encoding){
    events.push(['data', data, encoding]);
  });

  // buffer end
  obj.on('end', onEnd = function(data, encoding){
    events.push(['end', data, encoding]);
  });

  return {
    end: function(){
      obj.removeListener('data', onData);
      obj.removeListener('end', onEnd);
    },
    resume: function(){
      this.end();
      for (var i = 0, len = events.length; i < len; ++i) {
        obj.emit.apply(obj, events[i]);
      }
    }
  };
};

/**
 * Check `req` and `res` to see if it has been modified.
 *
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 * @return {Boolean}
 * @api private
 */

exports.modified = function(req, res, headers) {
  var headers = headers || res._headers || {}
    , modifiedSince = req.headers['if-modified-since']
    , lastModified = headers['last-modified']
    , noneMatch = req.headers['if-none-match']
    , etag = headers['etag'];

  if (noneMatch) noneMatch = noneMatch.split(/ *, */);

  // check If-None-Match
  if (noneMatch && etag && ~noneMatch.indexOf(etag)) {
    return false;
  }

  // check If-Modified-Since
  if (modifiedSince && lastModified) {
    modifiedSince = new Date(modifiedSince);
    lastModified = new Date(lastModified);
    // Ignore invalid dates
    if (!isNaN(modifiedSince.getTime())) {
      if (lastModified <= modifiedSince) return false;
    }
  }
  
  return true;
};

/**
 * Strip `Content-*` headers from `res`.
 *
 * @param {ServerResponse} res
 * @api private
 */

exports.removeContentHeaders = function(res){
  Object.keys(res._headers).forEach(function(field){
    if (0 == field.indexOf('content')) {
      res.removeHeader(field);
    }
  });
};

/**
 * Check if `req` is a conditional GET request.
 *
 * @param {IncomingMessage} req
 * @return {Boolean}
 * @api private
 */

exports.conditionalGET = function(req) {
  return req.headers['if-modified-since']
    || req.headers['if-none-match'];
};

/**
 * Respond with 401 "Unauthorized".
 *
 * @param {ServerResponse} res
 * @param {String} realm
 * @api private
 */

exports.unauthorized = function(res, realm) {
  res.statusCode = 401;
  res.setHeader('WWW-Authenticate', 'Basic realm="' + realm + '"');
  res.end('Unauthorized');
};

/**
 * Respond with 304 "Not Modified".
 *
 * @param {ServerResponse} res
 * @param {Object} headers
 * @api private
 */

exports.notModified = function(res) {
  exports.removeContentHeaders(res);
  res.statusCode = 304;
  res.end();
};

/**
 * Return an ETag in the form of `"<size>-<mtime>"`
 * from the given `stat`.
 *
 * @param {Object} stat
 * @return {String}
 * @api private
 */

exports.etag = function(stat) {
  return '"' + stat.size + '-' + Number(stat.mtime) + '"';
};

/**
 * Parse "Range" header `str` relative to the given file `size`.
 *
 * @param {Number} size
 * @param {String} str
 * @return {Array}
 * @api private
 */

exports.parseRange = function(size, str){
  var valid = true;
  var arr = str.substr(6).split(',').map(function(range){
    var range = range.split('-')
      , start = parseInt(range[0], 10)
      , end = parseInt(range[1], 10);

    // -500
    if (isNaN(start)) {
      start = size - end;
      end = size - 1;
    // 500-
    } else if (isNaN(end)) {
      end = size - 1;
    }

    // Invalid
    if (isNaN(start)
      || isNaN(end)
      || start > end
      || start < 0) valid = false;

    return {
      start: start,
      end: end
    };
  });

  return valid ? arr : null;
};

/**
 * Parse the given Cache-Control `str`.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

exports.parseCacheControl = function(str){
  var directives = str.split(',')
    , obj = {};

  for(var i = 0, len = directives.length; i < len; i++) {
    var parts = directives[i].split('=')
      , key = parts.shift().trim()
      , val = parseInt(parts.shift(), 10);

    obj[key] = isNaN(val) ? true : val;
  }

  return obj;
};
