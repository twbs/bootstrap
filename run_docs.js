/**
 * Simple static server for running Bootstrap:
 * $ node run_docs  
 * Go to http://localhost:3000
 */
var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.use(express.favicon('/docs/assets/ico/favicon.ico'));
  app.use(express.logger('dev'));
  app.use(express.static(path.join(__dirname, '/docs')));
  app.use(express.errorHandler());
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Bootstrap up and running sir! Port: " + app.get('port'));
});