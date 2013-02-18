
/*!
 * Connect - limit
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var utils = require('../utils');

/**
 * Limit:
 *
 *   Limit request bodies to the given size in `bytes`.
 *
 *   A string representation of the bytesize may also be passed,
 *   for example "5mb", "200kb", "1gb", etc.
 *
 *     connect()
 *       .use(connect.limit('5.5mb'))
 *       .use(handleImageUpload)
 *
 * @param {Number|String} bytes
 * @return {Function}
 * @api public
 */

module.exports = function limit(bytes){
  if ('string' == typeof bytes) bytes = parse(bytes);
  if ('number' != typeof bytes) throw new Error('limit() bytes required');
  return function limit(req, res, next){
    var received = 0
      , len = req.headers['content-length']
        ? parseInt(req.headers['content-length'], 10)
        : null;

    // self-awareness
    if (req._limit) return next();
    req._limit = true;

    // limit by content-length
    if (len && len > bytes) return next(utils.error(413));

    // limit
    req.on('data', function(chunk){
      received += chunk.length;
      if (received > bytes) req.destroy();
    });

    next();
  };
};

/**
 * Parse byte `size` string.
 *
 * @param {String} size
 * @return {Number}
 * @api private
 */

function parse(size) {
  var parts = size.match(/^(\d+(?:\.\d+)?) *(kb|mb|gb)$/)
    , n = parseFloat(parts[1])
    , type = parts[2];

  var map = {
      kb: 1024
    , mb: 1024 * 1024
    , gb: 1024 * 1024 * 1024
  };

  return map[type] * n;
}