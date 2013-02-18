var common = require('../common');
var BOUNDARY = '---------------------------10102754414578508781458777923',
    FIXTURE = TEST_FIXTURES+'/multi_video.upload',
    fs = require('fs'),
    util = require(common.lib + '/util'),
    http = require('http'),
    formidable = require(common.lib + '/index'),
    server = http.createServer();

server.on('request', function(req, res) {
  var form = new formidable.IncomingForm(),
      uploads = {};

  form.uploadDir = TEST_TMP;
  form.parse(req);

  form
    .on('fileBegin', function(field, file) {
      assert.equal(field, 'upload');

      var tracker = {file: file, progress: [], ended: false};
      uploads[file.filename] = tracker;
      file
        .on('progress', function(bytesReceived) {
          tracker.progress.push(bytesReceived);
          assert.equal(bytesReceived, file.length);
        })
        .on('end', function() {
          tracker.ended = true;
        });
    })
    .on('field', function(field, value) {
      assert.equal(field, 'title');
      assert.equal(value, '');
    })
    .on('file', function(field, file) {
      assert.equal(field, 'upload');
      assert.strictEqual(uploads[file.filename].file, file);
    })
    .on('end', function() {
      assert.ok(uploads['shortest_video.flv']);
      assert.ok(uploads['shortest_video.flv'].ended);
      assert.ok(uploads['shortest_video.flv'].progress.length > 3);
      assert.equal(uploads['shortest_video.flv'].progress.slice(-1), uploads['shortest_video.flv'].file.length);
      assert.ok(uploads['shortest_video.mp4']);
      assert.ok(uploads['shortest_video.mp4'].ended);
      assert.ok(uploads['shortest_video.mp4'].progress.length > 3);

      server.close();
      res.writeHead(200);
      res.end('good');
    });
});

server.listen(TEST_PORT, function() {
  var client = http.createClient(TEST_PORT),
      stat = fs.statSync(FIXTURE),
      headers = {
        'content-type': 'multipart/form-data; boundary='+BOUNDARY,
        'content-length': stat.size,
      }
      request = client.request('POST', '/', headers),
      fixture = new fs.ReadStream(FIXTURE);

  fixture
    .on('data', function(b) {
      request.write(b);
    })
    .on('end', function() {
      request.end();
    });
});
