
/**
 * Connect is a middleware framework for node,
 * shipping with over 18 bundled middleware and a rich selection of
 * 3rd-party middleware.
 *
 *     var app = connect()
 *       .use(connect.logger('dev'))
 *       .use(connect.static('public'))
 *       .use(function(req, res){
 *         res.end('hello world\n');
 *       })
 *      .listen(3000);
 *     
 * Installation:
 * 
 *     $ npm install connect
 *
 * Middleware:
 *
 *  - [logger](logger.html) request logger with custom format support
 *  - [csrf](csrf.html) Cross-site request forgery protection
 *  - [compress](compress.html) Gzip compression middleware
 *  - [basicAuth](basicAuth.html) basic http authentication
 *  - [bodyParser](bodyParser.html) extensible request body parser
 *  - [json](json.html) application/json parser
 *  - [urlencoded](urlencoded.html) application/x-www-form-urlencoded parser
 *  - [multipart](multipart.html) multipart/form-data parser
 *  - [cookieParser](cookieParser.html) cookie parser
 *  - [session](session.html) session management support with bundled MemoryStore
 *  - [cookieSession](cookieSession.html) cookie-based session support
 *  - [methodOverride](methodOverride.html) faux HTTP method support
 *  - [responseTime](responseTime.html) calculates response-time and exposes via X-Response-Time
 *  - [staticCache](staticCache.html) memory cache layer for the static() middleware
 *  - [static](static.html) streaming static file server supporting `Range` and more
 *  - [directory](directory.html) directory listing middleware
 *  - [vhost](vhost.html) virtual host sub-domain mapping middleware
 *  - [favicon](favicon.html) efficient favicon server (with default icon)
 *  - [limit](limit.html) limit the bytesize of request bodies
 *  - [query](query.html) automatic querystring parser, populating `req.query`
 *  - [errorHandler](errorHandler.html) flexible error handler
 *
 * Internals:
 *
 *  - server [prototype](proto.html)
 *  - connect [utilities](utils.html)
 *  - node monkey [patches](patch.html)
 *
 * Links:
 * 
 *   - list of [3rd-party](https://github.com/senchalabs/connect/wiki) middleware
 *   - GitHub [repository](http://github.com/senchalabs/connect)
 *   - [test documentation](https://github.com/senchalabs/connect/blob/gh-pages/tests.md)
 * 
 */