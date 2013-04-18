
/*!
 * Connect - methodOverride
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

/**
 * Method Override:
 * 
 * Provides faux HTTP method support.
 * 
 * Pass an optional `key` to use when checking for
 * a method override, othewise defaults to _\_method_.
 * The original method is available via `req.originalMethod`.
 *
 * @param {String} key
 * @return {Function}
 * @api public
 */

module.exports = function methodOverride(key){
  key = key || "_method";
  return function methodOverride(req, res, next) {
    req.originalMethod = req.originalMethod || req.method;

    // req.body
    if (req.body && key in req.body) {
      req.method = req.body[key].toUpperCase();
      delete req.body[key];
    // check X-HTTP-Method-Override
    } else if (req.headers['x-http-method-override']) {
      req.method = req.headers['x-http-method-override'].toUpperCase();
    }
    
    next();
  };
};

