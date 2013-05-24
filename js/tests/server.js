/*
 * Simple connect server for phantom.js
 * Adapted from Modernizr
 */

var connect = require('connect')
  , http = require('http')
  , fs   = require('fs')
  , app = connect()
      .use(connect.static(__dirname + '/../../'))
      .use(function(req, res){
          if (req.url=='/modal/example1.html') {
            var body = '<h1>Modal Example 1</h1>\n';
            res.statusCode = 200;
            res.setHeader('Content-Length', body.length);
            res.end(body);
          } else {
            var body = '404 Not Found\n';
            res.statusCode = 404;
            res.setHeader('Content-Length', body.length);
            res.end(body);
          }
      });

http.createServer(app).listen(3000);

fs.writeFileSync(__dirname + '/pid.txt', process.pid, 'utf-8')
