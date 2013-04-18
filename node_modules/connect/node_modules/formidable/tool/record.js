var http = require('http');
var fs = require('fs');
var connections = 0;

var server = http.createServer(function(req, res) {
  var socket = req.socket;
  console.log('Request: %s %s -> %s', req.method, req.url, socket.filename);

  req.on('end', function() {
    if (req.url !== '/') {
      res.end(JSON.stringify({
        method: req.method,
        url: req.url,
        filename: socket.filename,
      }));
      return;
    }

    res.writeHead(200, {'content-type': 'text/html'});
    res.end(
      '<form action="/upload" enctype="multipart/form-data" method="post">'+
      '<input type="text" name="title"><br>'+
      '<input type="file" name="upload" multiple="multiple"><br>'+
      '<input type="submit" value="Upload">'+
      '</form>'
    );
  });
});

server.on('connection', function(socket) {
  connections++;

  socket.id = connections;
  socket.filename = 'connection-' + socket.id + '.http';
  socket.file = fs.createWriteStream(socket.filename);
  socket.pipe(socket.file);

  console.log('--> %s', socket.filename);
  socket.on('close', function() {
    console.log('<-- %s', socket.filename);
  });
});

var port = process.env.PORT || 8080;
server.listen(port, function() {
  console.log('Recording connections on port %s', port);
});
