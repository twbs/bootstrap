
/*!
 * Connect - logger
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

/*!
 * Log buffer.
 */

var buf = [];

/*!
 * Default log buffer duration.
 */

var defaultBufferDuration = 1000;

/**
 * Logger:
 *
 * Log requests with the given `options` or a `format` string.
 *
 * Options:
 *
 *   - `format`  Format string, see below for tokens
 *   - `stream`  Output stream, defaults to _stdout_
 *   - `buffer`  Buffer duration, defaults to 1000ms when _true_
 *   - `immediate`  Write log line on request instead of response (for response times)
 *
 * Tokens:
 *
 *   - `:req[header]` ex: `:req[Accept]`
 *   - `:res[header]` ex: `:res[Content-Length]`
 *   - `:http-version`
 *   - `:response-time`
 *   - `:remote-addr`
 *   - `:date`
 *   - `:method`
 *   - `:url`
 *   - `:referrer`
 *   - `:user-agent`
 *   - `:status`
 *
 * Formats:
 *
 *   Pre-defined formats that ship with connect:
 *
 *    - `default` ':remote-addr - - [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'
 *    - `short` ':remote-addr - :method :url HTTP/:http-version :status :res[content-length] - :response-time ms'
 *    - `tiny`  ':method :url :status :res[content-length] - :response-time ms'
 *    - `dev` concise output colored by response status for development use
 *
 * Examples:
 *
 *      connect.logger() // default
 *      connect.logger('short')
 *      connect.logger('tiny')
 *      connect.logger({ immediate: true, format: 'dev' })
 *      connect.logger(':method :url - :referrer')
 *      connect.logger(':req[content-type] -> :res[content-type]')
 *      connect.logger(function(req, res){ return 'some format string' })
 *
 * Defining Tokens:
 *
 *   To define a token, simply invoke `connect.logger.token()` with the
 *   name and a callback function. The value returned is then available
 *   as ":type" in this case.
 *
 *      connect.logger.token('type', function(req, res){ return req.headers['content-type']; })
 *
 * Defining Formats:
 *
 *   All default formats are defined this way, however it's public API as well:
 *
 *       connect.logger.format('name', 'string or function')
 *
 * @param {String|Function|Object} format or options
 * @return {Function}
 * @api public
 */

exports = module.exports = function logger(options) {
  if ('object' == typeof options) {
    options = options || {};
  } else if (options) {
    options = { format: options };
  } else {
    options = {};
  }

  // output on request instead of response
  var immediate = options.immediate;

  // format name
  var fmt = exports[options.format] || options.format || exports.default;

  // compile format
  if ('function' != typeof fmt) fmt = compile(fmt);

  // options
  var stream = options.stream || process.stdout
    , buffer = options.buffer;

  // buffering support
  if (buffer) {
    var realStream = stream
      , interval = 'number' == typeof buffer
        ? buffer
        : defaultBufferDuration;

    // flush interval
    setInterval(function(){
      if (buf.length) {
        realStream.write(buf.join(''), 'ascii');
        buf.length = 0;
      }
    }, interval); 

    // swap the stream
    stream = {
      write: function(str){
        buf.push(str);
      }
    };
  }

  return function logger(req, res, next) {
    req._startTime = new Date;

    // mount safety
    if (req._logging) return next();

    // flag as logging
    req._logging = true;

    // immediate
    if (immediate) {
      var line = fmt(exports, req, res);
      if (null == line) return;
      stream.write(line + '\n', 'ascii');
    // proxy end to output logging
    } else {
      var end = res.end;
      res.end = function(chunk, encoding){
        res.end = end;
        res.end(chunk, encoding);
        var line = fmt(exports, req, res);
        if (null == line) return;
        stream.write(line + '\n', 'ascii');
      };
    }


    next();
  };
};

/**
 * Compile `fmt` into a function.
 *
 * @param {String} fmt
 * @return {Function}
 * @api private
 */

function compile(fmt) {
  fmt = fmt.replace(/"/g, '\\"');
  var js = '  return "' + fmt.replace(/:([-\w]{2,})(?:\[([^\]]+)\])?/g, function(_, name, arg){
    return '"\n    + (tokens["' + name + '"](req, res, "' + arg + '") || "-") + "';
  }) + '";'
  return new Function('tokens, req, res', js);
};

/**
 * Define a token function with the given `name`,
 * and callback `fn(req, res)`.
 *
 * @param {String} name
 * @param {Function} fn
 * @return {Object} exports for chaining
 * @api public
 */

exports.token = function(name, fn) {
  exports[name] = fn;
  return this;
};

/**
 * Define a `fmt` with the given `name`.
 *
 * @param {String} name
 * @param {String|Function} fmt
 * @return {Object} exports for chaining
 * @api public
 */

exports.format = function(name, str){
  exports[name] = str;
  return this;
};

/**
 * Default format.
 */

exports.format('default', ':remote-addr - - [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"');

/**
 * Short format.
 */

exports.format('short', ':remote-addr - :method :url HTTP/:http-version :status :res[content-length] - :response-time ms');

/**
 * Tiny format.
 */

exports.format('tiny', ':method :url :status :res[content-length] - :response-time ms');

/**
 * dev (colored)
 */

exports.format('dev', function(tokens, req, res){
  var status = res.statusCode
    , color = 32;

  if (status >= 500) color = 31
  else if (status >= 400) color = 33
  else if (status >= 300) color = 36;

  return '\033[90m' + req.method
    + ' ' + req.originalUrl + ' '
    + '\033[' + color + 'm' + res.statusCode
    + ' \033[90m'
    + (new Date - req._startTime)
    + 'ms\033[0m';
});

/**
 * request url
 */

exports.token('url', function(req){
  return req.originalUrl;
});

/**
 * request method
 */

exports.token('method', function(req){
  return req.method;
});

/**
 * response time in milliseconds
 */

exports.token('response-time', function(req){
  return new Date - req._startTime;
});

/**
 * UTC date
 */

exports.token('date', function(){
  return new Date().toUTCString();
});

/**
 * response status code
 */

exports.token('status', function(req, res){
  return res.statusCode;
});

/**
 * normalized referrer
 */

exports.token('referrer', function(req){
  return req.headers['referer'] || req.headers['referrer'];
});

/**
 * remote address
 */

exports.token('remote-addr', function(req){
  return req.socket && (req.socket.remoteAddress || (req.socket.socket && req.socket.socket.remoteAddress));
});

/**
 * HTTP version
 */

exports.token('http-version', function(req){
  return req.httpVersionMajor + '.' + req.httpVersionMinor;
});

/**
 * UA string
 */

exports.token('user-agent', function(req){
  return req.headers['user-agent'];
});

/**
 * request header
 */

exports.token('req', function(req, res, field){
  return req.headers[field.toLowerCase()];
});

/**
 * response header
 */

exports.token('res', function(req, res, field){
  return (res._headers || {})[field.toLowerCase()];
});

