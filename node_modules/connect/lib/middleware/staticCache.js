
/*!
 * Connect - staticCache
 * Copyright(c) 2011 Sencha Inc.
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var http = require('http')
  , utils = require('../utils')
  , Cache = require('../cache')
  , url = require('url')
  , fs = require('fs');

/**
 * Static cache:
 *
 * Enables a memory cache layer on top of
 * the `static()` middleware, serving popular
 * static files.
 *
 * By default a maximum of 128 objects are
 * held in cache, with a max of 256k each,
 * totalling ~32mb.
 *
 * A Least-Recently-Used (LRU) cache algo
 * is implemented through the `Cache` object,
 * simply rotating cache objects as they are
 * hit. This means that increasingly popular
 * objects maintain their positions while
 * others get shoved out of the stack and
 * garbage collected.
 *
 * Benchmarks:
 *
 *     static(): 2700 rps
 *     node-static: 5300 rps
 *     static() + staticCache(): 7500 rps
 *
 * Options:
 *
 *   - `maxObjects`  max cache objects [128]
 *   - `maxLength`  max cache object length 256kb
 *
 * @param {Type} name
 * @return {Type}
 * @api public
 */

module.exports = function staticCache(options){
  var options = options || {}
    , cache = new Cache(options.maxObjects || 128)
    , maxlen = options.maxLength || 1024 * 256;

  return function staticCache(req, res, next){
    var path = url.parse(req.url).pathname
      , ranges = req.headers.range
      , hit = cache.get(path)
      , hitCC
      , uaCC
      , header
      , age;

    function miss() {
      res.setHeader('X-Cache', 'MISS');
      next();
    }

    // cache static
    // TODO: change from staticCache() -> static()
    // and make this work for any request
    req.on('static', function(stream){
      var headers = res._headers
        , cc = utils.parseCacheControl(headers['cache-control'] || '')
        , contentLength = headers['content-length']
        , hit;

      // ignore larger files
      if (!contentLength || contentLength > maxlen) return;

      // don't cache partial files
      if (headers['content-range']) return;

      // dont cache items we shouldn't be
      // TODO: real support for must-revalidate / no-cache
      if ( cc['no-cache']
        || cc['no-store']
        || cc['private']
        || cc['must-revalidate']) return;

      // if already in cache then validate
      if (hit = cache.get(path)){
        if (headers.etag == hit[0].etag) {
          hit[0].date = new Date;
          return;
        } else {
          cache.remove(path);
        }
      }

      // validation notifiactions don't contain a steam
      if (null == stream) return;

      // add the cache object
      var arr = cache.add(path);
      arr.push(headers);

      // store the chunks
      stream.on('data', function(chunk){
        arr.push(chunk);
      });

      // flag it as complete
      stream.on('end', function(){
        arr.complete = true;
      });
    });

    // cache hit, doesnt support range requests
    if (hit && hit.complete && !ranges) {
      header = utils.merge({}, hit[0]);
      header.Age = age = (new Date - new Date(header.date)) / 1000 | 0;
      header.date = new Date().toUTCString();

      // parse cache-controls
      hitCC = utils.parseCacheControl(header['cache-control'] || '');
      uaCC = utils.parseCacheControl(req.headers['cache-control'] || '');

      // check if we must revalidate(bypass)
      if (hitCC['no-cache'] || uaCC['no-cache']) return miss();

      // check freshness of entity
      if (isStale(hitCC, age) || isStale(uaCC, age)) return miss();

      // conditional GET support
      if (utils.conditionalGET(req)) {
        if (!utils.modified(req, res, header)) {
          header['content-length'] = 0;
          res.writeHead(304, header);
          return res.end();
        }
      }

      // HEAD support
      if ('HEAD' == req.method) {
        res.writeHead(200, header);
        return res.end();
      }

      // respond with cache
      header['x-cache'] = 'HIT';
      res.writeHead(200, header);

      // backpressure
      function write(i) {
        var buf = hit[i];
        if (!buf) return res.end();
        if (false === res.write(buf)) {
          res.once('drain', function(){
            write(++i);
          });
        } else {
          write(++i);
        }
      }

      return write(1);
    }

    miss();
  }
};

/**
 * Check if cache item is stale
 *
 * @param {Object} cc
 * @param {Number} age
 * @return {Boolean}
 * @api private
 */

function isStale(cc, age) {
  return cc['max-age'] && cc['max-age'] <= age;
}