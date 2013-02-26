/*
 * Simple connect server for phantom.js
 * Adapted from Modernizr
 */
var PORT = process.env.PORT || 3000;
var connect = require('connect')
  , http = require('http')
  , fs   = require('fs')
  , app = connect()
      .use(connect.static(__dirname + '/../../'));

http.createServer(app).listen(PORT);

fs.writeFileSync(__dirname + '/pid.txt', process.pid, 'utf-8')