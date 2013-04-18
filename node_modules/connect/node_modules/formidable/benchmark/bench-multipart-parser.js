require('../test/common');
var multipartParser = require('../lib/multipart_parser'),
    MultipartParser = multipartParser.MultipartParser,
    parser = new MultipartParser(),
    Buffer = require('buffer').Buffer,
    boundary = '-----------------------------168072824752491622650073',
    mb = 100,
    buffer = createMultipartBuffer(boundary, mb * 1024 * 1024),
    callbacks =
      { partBegin: -1,
        partEnd: -1,
        headerField: -1,
        headerValue: -1,
        partData: -1,
        end: -1,
      };


parser.initWithBoundary(boundary);
parser.onHeaderField = function() {
  callbacks.headerField++;
};

parser.onHeaderValue = function() {
  callbacks.headerValue++;
};

parser.onPartBegin = function() {
  callbacks.partBegin++;
};

parser.onPartData = function() {
  callbacks.partData++;
};

parser.onPartEnd = function() {
  callbacks.partEnd++;
};

parser.onEnd = function() {
  callbacks.end++;
};

var start = +new Date(),
    nparsed = parser.write(buffer),
    duration = +new Date - start,
    mbPerSec = (mb / (duration / 1000)).toFixed(2);

console.log(mbPerSec+' mb/sec');

assert.equal(nparsed, buffer.length);

function createMultipartBuffer(boundary, size) {
  var head =
        '--'+boundary+'\r\n'
      + 'content-disposition: form-data; name="field1"\r\n'
      + '\r\n'
    , tail = '\r\n--'+boundary+'--\r\n'
    , buffer = new Buffer(size);

  buffer.write(head, 'ascii', 0);
  buffer.write(tail, 'ascii', buffer.length - tail.length);
  return buffer;
}

process.on('exit', function() {
  for (var k in callbacks) {
    assert.equal(0, callbacks[k], k+' count off by '+callbacks[k]);
  }
});
