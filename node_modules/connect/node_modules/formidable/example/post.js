require('../test/common');
var http = require('http'),
    util = require('util'),
    formidable = require('formidable'),
    server;

server = http.createServer(function(req, res) {
  if (req.url == '/') {
    res.writeHead(200, {'content-type': 'text/html'});
    res.end(
      '<form action="/post" method="post">'+
      '<input type="text" name="title"><br>'+
      '<input type="text" name="data[foo][]"><br>'+
      '<input type="submit" value="Submit">'+
      '</form>'
    );
  } else if (req.url == '/post') {
    var form = new formidable.IncomingForm(),
        fields = [];

    form
      .on('error', function(err) {
        res.writeHead(200, {'content-type': 'text/plain'});
        res.end('error:\n\n'+util.inspect(err));
      })
      .on('field', function(field, value) {
        console.log(field, value);
        fields.push([field, value]);
      })
      .on('end', function() {
        console.log('-> post done');
        res.writeHead(200, {'content-type': 'text/plain'});
        res.end('received fields:\n\n '+util.inspect(fields));
      });
    form.parse(req);
  } else {
    res.writeHead(404, {'content-type': 'text/plain'});
    res.end('404');
  }
});
server.listen(TEST_PORT);

console.log('listening on http://localhost:'+TEST_PORT+'/');
