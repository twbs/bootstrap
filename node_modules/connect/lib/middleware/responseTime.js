
/*!
 * Connect - responseTime
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

/**
 * Reponse time:
 *
 * Adds the `X-Response-Time` header displaying the response
 * duration in milliseconds.
 *
 * @return {Function}
 * @api public
 */

module.exports = function responseTime(){
  return function(req, res, next){
    var start = new Date;

    if (res._responseTime) return next();
    res._responseTime = true;

    res.on('header', function(header){
      var duration = new Date - start;
      res.setHeader('X-Response-time', duration + 'ms');
    });

    next();
  };
};
