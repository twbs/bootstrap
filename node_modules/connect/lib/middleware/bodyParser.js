
/*!
 * Connect - bodyParser
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var multipart = require('./multipart')
  , urlencoded = require('./urlencoded')
  , json = require('./json');

/**
 * Body parser:
 * 
 *   Parse request bodies, supports _application/json_,
 *   _application/x-www-form-urlencoded_, and _multipart/form-data_.
 *
 *   This is equivalent to: 
 *
 *     app.use(connect.json());
 *     app.use(connect.urlencoded());
 *     app.use(connect.multipart());
 *
 * Examples:
 *
 *      connect()
 *        .use(connect.bodyParser())
 *        .use(function(req, res) {
 *          res.end('viewing user ' + req.body.user.name);
 *        });
 *
 *      $ curl -d 'user[name]=tj' http://local/
 *      $ curl -d '{"user":{"name":"tj"}}' -H "Content-Type: application/json" http://local/
 *
 *  View [json](json.html), [urlencoded](urlencoded.html), and [multipart](multipart.html) for more info.
 *
 * @param {Object} options
 * @return {Function}
 * @api public
 */

exports = module.exports = function bodyParser(options){
  var _urlencoded = urlencoded(options)
    , _multipart = multipart(options)
    , _json = json(options);

  return function bodyParser(req, res, next) {
    _json(req, res, function(err){
      if (err) return next(err);
      _urlencoded(req, res, function(err){
        if (err) return next(err);
        _multipart(req, res, next);
      });
    });
  }
};